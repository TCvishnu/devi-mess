import { FC, useState, useEffect } from "react";
import { useDate } from "@contexts/DateContext";

type mealStructure = {
  count: number;
  veg: number;
  nonVeg: number;
};

type FoodCountsType = {
  morning: mealStructure;
  afternoon: mealStructure;
  night: mealStructure;
};

const FoodCountDisplay: FC = () => {
  const [foodCounts, setFoodCounts] = useState<FoodCountsType>({
    morning: { count: 50, veg: 30, nonVeg: 20 },
    afternoon: { count: 50, veg: 30, nonVeg: 20 },
    night: { count: 50, veg: 30, nonVeg: 20 },
  });

  const { selectedDate } = useDate();

  useEffect(() => {
    setFoodCounts(() => {
      const mrngCount = Math.floor(Math.random() * 100);
      const afternoonCount = Math.floor(Math.random() * 100);
      const nightCount = Math.floor(Math.random() * 100);

      return {
        morning: {
          count: mrngCount,
          veg: Math.floor(mrngCount / 4),
          nonVeg: Math.floor((mrngCount / 4) * 3),
        },
        afternoon: {
          count: afternoonCount,
          veg: Math.floor(afternoonCount / 4),
          nonVeg: Math.floor((afternoonCount / 4) * 3),
        },
        night: {
          count: nightCount,
          veg: Math.floor(nightCount / 4),
          nonVeg: Math.floor((nightCount / 4) * 3),
        },
      };
    });
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="rounded-sm shadow-sm p-4 border border-gray-400 active:animate-shake">
        <h3 className="text-lg font-semibold text-primary">Morning</h3>
        <p className="mt-2 text-3xl font-bold text-accent">
          {foodCounts.morning.count}
        </p>
        <p className="text-sm text-gray-400 font-medium mt-1">Total Meals</p>
      </div>

      <div className="rounded-sm shadow-sm p-4 border border-gray-400 active:animate-shake">
        <h3 className="text-lg font-semibold text-primary">Afternoon</h3>
        <p className="mt-2 text-3xl font-bold text-accent">
          {foodCounts.afternoon.count}
        </p>
        <p className="text-sm text-gray-400 font-medium mt-1">Total Meals</p>
        <div className="mt-3 flex justify-between text-sm text-primary font-semibold">
          <span>Veg: {foodCounts.afternoon.veg}</span>
          <span>Non-Veg: {foodCounts.afternoon.nonVeg}</span>
        </div>
      </div>

      <div className="rounded-sm shadow-sm p-4 border border-gray-400 active:animate-shake">
        <h3 className="text-lg font-semibold text-primary">Night</h3>
        <p className="mt-2 text-3xl font-bold text-accent">
          {foodCounts.night.count}
        </p>
        <p className="text-sm text-gray-400 font-medium mt-1">Total Meals</p>
        <div className="mt-3 flex justify-between text-sm text-primary font-semibold">
          <span>Veg: {foodCounts.night.veg}</span>
          <span>Non-Veg: {foodCounts.night.nonVeg}</span>
        </div>
      </div>
    </div>
  );
};

export default FoodCountDisplay;
