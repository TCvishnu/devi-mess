import { FC, ButtonHTMLAttributes } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";

type CutType = "Morning" | "Afternoon" | "Evening" | "Full";

type CutTypeButtonProps = {
  cutType: CutType;
  selectedCutType?: CutType;
  icon: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const MealTypeButton: FC<CutTypeButtonProps> = ({
  cutType,
  selectedCutType,
  icon,
  className,
  ...props
}) => {
  return (
    <button
      key={cutType}
      {...props}
      className={clsx(
        "size-18 flex flex-col gap-1 justify-center items-center border-2 active:animate-ping rounded-md",
        selectedCutType === cutType ? "border-primary" : "border-gray-300",
        className
      )}
    >
      <span
        className={`${
          selectedCutType === cutType
            ? "text-primary font-bold"
            : "text-gray-500 font-medium"
        } text-xs `}
      >
        {cutType}
      </span>
      <Icon
        icon={icon}
        className={`size-8 ${
          selectedCutType === cutType ? " text-primary" : "text-gray-500"
        } `}
      />
    </button>
  );
};

export default MealTypeButton;
