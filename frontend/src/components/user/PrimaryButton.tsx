import type { FC, ReactNode, ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = {
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const PrimaryButton: FC<PrimaryButtonProps> = ({ children, ...props }) => {
  return (
    <button className=" bg-primary py-2 w-28 text-xs rounded-xs" {...props}>
      {children}
    </button>
  );
};

export default PrimaryButton;
