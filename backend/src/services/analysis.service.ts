import { MealType } from "@prisma/client";
import getPrisma from "../lib/getPrisma";

const getDailyFoodCount = async (
  db: ReturnType<typeof getPrisma>,
  date: Date
) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(5, 30, 0, 0);

  const foodPrefCount = await db.user.groupBy({
    by: ["mealType", "isVeg"],
    _count: {
      _all: true,
    },
    where: {
      role: { not: "ADMIN" },
    },
  });

  const foodPrefMap: Record<MealType, { veg: number; nonVeg: number }> = {
    MORNING_MEAL: { veg: 0, nonVeg: 0 },
    AFTERNOON_MEAL: { veg: 0, nonVeg: 0 },
    EVENING_MEAL: { veg: 0, nonVeg: 0 },
    FULL_MEAL: { veg: 0, nonVeg: 0 },
  };

  for (const item of foodPrefCount) {
    if (!item.mealType) continue;
    foodPrefMap[item.mealType][item.isVeg ? "veg" : "nonVeg"] =
      item._count._all;
  }

  const combinedFoodPrefMap = {
    MORNING_MEAL: {
      veg: foodPrefMap.MORNING_MEAL.veg + foodPrefMap.FULL_MEAL.veg,
      nonVeg: foodPrefMap.MORNING_MEAL.nonVeg + foodPrefMap.FULL_MEAL.nonVeg,
    },
    AFTERNOON_MEAL: {
      veg: foodPrefMap.AFTERNOON_MEAL.veg + foodPrefMap.FULL_MEAL.veg,
      nonVeg: foodPrefMap.AFTERNOON_MEAL.nonVeg + foodPrefMap.FULL_MEAL.nonVeg,
    },
    EVENING_MEAL: {
      veg: foodPrefMap.EVENING_MEAL.veg + foodPrefMap.FULL_MEAL.veg,
      nonVeg: foodPrefMap.EVENING_MEAL.nonVeg + foodPrefMap.FULL_MEAL.nonVeg,
    },
  };

  const messcuts = await db.messcut.findMany({
    where: {
      date: { equals: startOfDay },
    },
    include: {
      user: {
        select: { isVeg: true },
      },
    },
  });

  for (const cut of messcuts) {
    const pref = cut.user.isVeg ? "veg" : "nonVeg";
    if (cut.cutType === "FULL_MEAL") {
      combinedFoodPrefMap.MORNING_MEAL[pref] -= 1;
      combinedFoodPrefMap.AFTERNOON_MEAL[pref] -= 1;
      combinedFoodPrefMap.EVENING_MEAL[pref] -= 1;
    } else {
      combinedFoodPrefMap[cut.cutType][pref] -= 1;
    }
  }

  return {
    afterCutCounts: combinedFoodPrefMap,
  };
};

export default { getDailyFoodCount };
