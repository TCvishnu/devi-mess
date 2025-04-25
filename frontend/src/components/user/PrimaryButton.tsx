import type { FC, ReactNode, ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = {
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const PrimaryButton: FC<PrimaryButtonProps> = ({ children, ...props }) => {
  return (
    <button className=" bg-primary h-12 w-40 rounded-xs" {...props}>
      {children}
    </button>
  );
};

export default PrimaryButton;
