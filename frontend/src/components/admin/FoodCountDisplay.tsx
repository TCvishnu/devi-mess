import { FC, useState, useEffect } from "react";
import { useDate } from "@contexts/DateContext";

import { getDailyFoodCount } from "@services/analysisService";

type mealStructure = {
  count: number;
  veg: number;
  nonVeg: number;
};

type FoodCountsType = {
  MORNING: mealStructure;
  AFTERNOON: mealStructure;
  EVENING: mealStructure;
};

const FoodCountDisplay: FC = () => {
  const [foodCounts, setFoodCounts] = useState<FoodCountsType | null>(null);

  const { selectedDate } = useDate();

  useEffect(() => {
    const fetchCurrentDateCount = async () => {
      const result = await getDailyFoodCount(selectedDate);
      if (result.status === 200) {
        const cutMap = result.cutCounts;
        setFoodCounts({
          MORNING: {
            count: cutMap.MORNING_MEAL.veg + cutMap.MORNING_MEAL.nonVeg,
            veg: cutMap.MORNING_MEAL.veg,
            nonVeg: cutMap.MORNING_MEAL.nonVeg,
          },
          AFTERNOON: {
            count: cutMap.AFTERNOON_MEAL.veg + cutMap.AFTERNOON_MEAL.nonVeg,
            veg: cutMap.AFTERNOON_MEAL.veg,
            nonVeg: cutMap.AFTERNOON_MEAL.nonVeg,
          },
          EVENING: {
            count: cutMap.EVENING_MEAL.veg + cutMap.EVENING_MEAL.nonVeg,
            veg: cutMap.EVENING_MEAL.veg,
            nonVeg: cutMap.EVENING_MEAL.nonVeg,
          },
        });
      }
    };

    fetchCurrentDateCount();
  }, [selectedDate]);

  if (!foodCounts) {
    return (
      <div className=" flex items-center justify-center h-full">
        <div className="size-32 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="rounded-sm shadow-sm p-4 border border-gray-400 active:animate-shake">
        <h3 className="text-lg font-semibold text-primary">Morning</h3>
        <p className="mt-2 text-5xl font-bold text-accent">
          {foodCounts.MORNING.count}
        </p>
        <p className="text-sm text-gray-400 font-medium mt-1">Total Meals</p>
      </div>

      <div className="rounded-sm shadow-sm p-4 border border-gray-400 active:animate-shake">
        <h3 className="text-lg font-semibold text-primary">Afternoon</h3>
        <p className="mt-2 text-5xl font-bold text-accent">
          {foodCounts.AFTERNOON.count}
        </p>
        <p className="text-sm text-gray-400 font-medium mt-1">Total Meals</p>
        <div className="mt-3 flex justify-between text-primary font-semibold">
          <span>Veg: {foodCounts.AFTERNOON.veg}</span>
          <span>Non-Veg: {foodCounts.AFTERNOON.nonVeg}</span>
        </div>
      </div>

      <div className="rounded-sm shadow-sm p-4 border border-gray-400 active:animate-shake">
        <h3 className="text-lg font-semibold text-primary">Night</h3>
        <p className="mt-2 text-5xl font-bold text-accent">
          {foodCounts.EVENING.count}
        </p>
        <p className="text-sm text-gray-400 font-medium mt-1">Total Meals</p>
        <div className="mt-3 flex justify-between text-primary font-semibold">
          <span>Veg: {foodCounts.EVENING.veg}</span>
          <span>Non-Veg: {foodCounts.EVENING.nonVeg}</span>
        </div>
      </div>
    </div>
  );
};

export default FoodCountDisplay;
