import { FC, useState, useEffect } from "react";
import { useDate } from "@contexts/DateContext";
import { Icon } from "@iconify/react/dist/iconify.js";

type FoodCountsType = {
  morning: number;
  afternoon: number;
  night: number;
};

const FoodCountDisplay: FC = () => {
  const [foodCounts, setFoodCounts] = useState<FoodCountsType>({
    morning: 50,
    afternoon: 60,
    night: 90,
  });

  const { selectedDate } = useDate();

  useEffect(() => {
    setFoodCounts({
      morning: Math.floor(Math.random() * 100),
      afternoon: Math.floor(Math.random() * 100),
      night: Math.floor(Math.random() * 100),
    });
  }, [selectedDate]);

  return (
    <div className="my-6 w-full border-2 rounded-md border-primary h-24 xs:h-28 flex justify-evenly items-center text-lg">
      <div className="flex flex-col items-center">
        <Icon icon="bi:sunrise-fill" className=" size-10" />
        <span className=" font-medium text-primary">{foodCounts.morning}</span>
      </div>

      <div className="w-[1px] h-1/2 bg-primary"></div>
      <div className="flex flex-col items-center">
        <Icon icon="solar:sun-bold" className=" size-10" />
        <span className=" font-medium text-primary">
          {foodCounts.afternoon}
        </span>
      </div>

      <div className="w-[1px] h-1/2 bg-primary"></div>
      <div className="flex flex-col items-center">
        <Icon icon="lets-icons:moon-fill" className=" size-10" />
        <span className="font-medium text-primary">{foodCounts.night}</span>
      </div>
    </div>
  );
};

export default FoodCountDisplay;
