import { forwardRef, ReactElement, useImperativeHandle, useRef } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import { fetchSelectionFindAllApi } from "../../api/fetch-selection-find-all.api.ts";
import { fetchSelectionMovieAddApi } from "../../api/fetch-selection-movie-add.api.ts";

import ButtonComponent from "../button/button.component.tsx";

import { MovieListItemType } from "../../types/movie-list-item.type.ts";

import MingcuteCloseCircleFill from "../../icons/MingcuteCloseCircleFill.tsx";

import styles from "./bookmark-modal.module.css";

export type BookmarkModalRef = Pick<HTMLDialogElement, "showModal" | "close">;

type Props = {
  movie: MovieListItemType;
};

const BookmarkModalComponent = forwardRef<BookmarkModalRef, Props>(
  function BookmarkModalComponent({ movie }, outerRef): ReactElement {
    const innerRef = useRef<HTMLDialogElement>(null);

    const queryClient = useQueryClient();

    const {
      data: selections,
      isPending,
      isError,
    } = useQuery({
      queryKey: ["selections"],
      queryFn: fetchSelectionFindAllApi,
    });

    const mutation = useMutation({
      mutationFn: fetchSelectionMovieAddApi,
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: ["selections"],
        }),
    });

    useImperativeHandle(outerRef, () => ({
      showModal: (): void => {
        innerRef.current?.showModal();
      },
      close: (): void => {
        innerRef.current?.close();
      },
    }));

    const closeDialog = () => {
      innerRef.current?.close();
    };
    const selectionButtonClickHandler = (id: number): void => {
      innerRef.current?.close();

      mutation.mutate(
        { id, dto: { movieId: movie.id } },
        {
          onSuccess: (result) => {
            if ("error" in result) {
              toast.error(result.message);
            } else {
              toast.success(result.message);
            }
          },
        },
      );
    };

    return (
      <dialog ref={innerRef} className={styles["bookmark-modal"]}>
        <div className={styles.content}>
          <MingcuteCloseCircleFill onClick={closeDialog} />
          {isPending ? (
            <>Loading...</>
          ) : isError ? (
            <>Something went wrong!</>
          ) : (
            selections.map((selection) => (
              <ButtonComponent
                type="button"
                color="primary"
                variant="solid"
                onClick={() => selectionButtonClickHandler(selection.id)}
              >
                {selection.name}
              </ButtonComponent>
            ))
          )}
        </div>
      </dialog>
    );
  },
);

export default BookmarkModalComponent;
