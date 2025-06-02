import { FC, ButtonHTMLAttributes } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import { toTitleCase } from "@utils/stringUtils";

import { MealType } from "@type/enums";

type CutTypeButtonProps = {
  mealType: MealType;
  selectedMealType?: MealType;
  icon: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const MealTypeButton: FC<CutTypeButtonProps> = ({
  mealType,
  selectedMealType,
  icon,
  className,
  ...props
}) => {
  return (
    <button
      key={mealType}
      {...props}
      className={clsx(
        "size-16 xs:size-18 flex flex-col gap-1 justify-center items-center border-2 active:animate-ping rounded-md",
        selectedMealType === mealType ? "border-primary" : "border-gray-300",
        className
      )}
    >
      <span
        className={`${
          selectedMealType === mealType
            ? "text-primary font-bold"
            : "text-gray-500 font-medium"
        } text-[0.6rem] `}
      >
        {toTitleCase(mealType.split("_")[0])}
      </span>
      <Icon
        icon={icon}
        className={`size-8 ${
          selectedMealType === mealType ? " text-primary" : "text-gray-500"
        } `}
      />
    </button>
  );
};

export default MealTypeButton;
