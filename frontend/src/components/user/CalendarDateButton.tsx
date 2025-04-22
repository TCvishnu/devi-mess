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
        "w-10 h-10 flex items-center justify-center rounded-sm text-sm disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};

export default CalendarDateButton;
