import { ComponentProps, ReactElement } from "react";
import clsx from "clsx";

import styles from "./Button.module.css";

type Color = "primary" | "danger";
type Variant = "solid" | "outlined" | "ghost";
type Size = "small" | "medium" | "large";
type Shape = "rectangle" | "square" | "circle";

type Props = ComponentProps<"button"> & {
  color?: Color;
  variant?: Variant;
  size?: Size;
  shape?: Shape;
};
export default function Button({
  color = "primary",
  variant = "solid",
  size = "medium",
  shape = "rectangle",
  children,
  className,
  ...otherProps
}: Props): ReactElement {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        styles[color],
        styles[size],
        styles[shape],
        className,
      )}
      {...otherProps}
    >
      {children}
    </button>
  );
}
