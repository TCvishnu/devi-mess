import type { FC, ReactNode, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type CalendarDateButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const CalendarDateButton: FC<CalendarDateButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "size-8 xs:size-10 flex items-center justify-center rounded-sm text-sm disabled:cursor-not-allowed disabled:text-gray-400 disabled:font-normal disabled:active:animate-shake",
        className
      )}
    >
      {children}
    </button>
  );
};

export default CalendarDateButton;
