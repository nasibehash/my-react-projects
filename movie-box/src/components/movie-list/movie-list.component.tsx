import { ReactElement, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { fetchMoviesApi } from "../../api/fetch-movies.api.ts";

import MingcuteBookmarkLine from "../../icons/MingcuteBookmarkLine.tsx";

import { useFiltersStore } from "../../stores/filters.store.ts";

import LoadingComponent from "../loading/loading.component.tsx";
import MovieListItemComponent from "../movie-list-item/movie-list-item.component.tsx";
import BookmarkModalComponent, {
  BookmarkModalRef,
} from "../bookmark-modal/bookmark-modal.component.tsx";

import { MovieListItemType } from "../../types/movie-list-item.type.ts";

import styles from "./movie-list.module.css";

function MovieListComponent(): ReactElement {
  const filters = useFiltersStore((state) => state.filters);

  const [movieToBeBookmarked, setMovieToBeBookmarked] =
    useState<MovieListItemType>();

  const bookmarkModalRef = useRef<BookmarkModalRef>(null);

  const { data, isPending, isFetching, isError, error } = useQuery({
    queryKey: ["movies", filters],
    queryFn: () => fetchMoviesApi(filters),
    staleTime: 60 * 1000,
  });

  const bookmarkClickHandler = (movie: MovieListItemType): void => {
    setMovieToBeBookmarked(movie);
    bookmarkModalRef.current?.showModal();
  };

  if (isPending) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <>Error: {error ? error.message : "Unexpected error."}</>;
  }

  return (
    <>
      <ul
        className={styles["movie-list"]}
        style={{ opacity: isFetching ? "0.5" : "1" }}
      >
        {data.map((movie) => (
          <MovieListItemComponent
            key={movie.id}
            movie={movie}
            actionIcon={<MingcuteBookmarkLine />}
            onActionClick={bookmarkClickHandler}
          />
        ))}
      </ul>
      <BookmarkModalComponent
        ref={bookmarkModalRef}
        movie={movieToBeBookmarked!}
      />
    </>
  );
}

export default MovieListComponent;
