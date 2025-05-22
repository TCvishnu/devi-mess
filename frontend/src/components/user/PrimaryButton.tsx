import type { FC, ReactNode, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type PrimaryButtonProps = {
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(" bg-primary h-12 w-40 rounded-xs", className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
