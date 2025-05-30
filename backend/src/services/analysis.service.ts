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
      adminVerified: true,
    },
  });

  const foodPrefMap: Record<MealType, { veg: number; nonVeg: number }> = {
    MORNING: { veg: 0, nonVeg: 0 },
    AFTERNOON: { veg: 0, nonVeg: 0 },
    EVENING: { veg: 0, nonVeg: 0 },
    FULL: { veg: 0, nonVeg: 0 },
  };

  for (const item of foodPrefCount) {
    if (!item.mealType) continue;
    foodPrefMap[item.mealType][item.isVeg ? "veg" : "nonVeg"] =
      item._count._all;
  }

  const combinedFoodPrefMap = {
    MORNING: {
      veg: foodPrefMap.MORNING.veg + foodPrefMap.FULL.veg,
      nonVeg: foodPrefMap.MORNING.nonVeg + foodPrefMap.FULL.nonVeg,
    },
    AFTERNOON: {
      veg: foodPrefMap.AFTERNOON.veg + foodPrefMap.FULL.veg,
      nonVeg: foodPrefMap.AFTERNOON.nonVeg + foodPrefMap.FULL.nonVeg,
    },
    EVENING: {
      veg: foodPrefMap.EVENING.veg + foodPrefMap.FULL.veg,
      nonVeg: foodPrefMap.EVENING.nonVeg + foodPrefMap.FULL.nonVeg,
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
    if (cut.cutType === "FULL") {
      combinedFoodPrefMap.MORNING[pref] -= 1;
      combinedFoodPrefMap.AFTERNOON[pref] -= 1;
      combinedFoodPrefMap.EVENING[pref] -= 1;
    } else {
      combinedFoodPrefMap[cut.cutType][pref] -= 1;
    }
  }

  return {
    afterCutCounts: combinedFoodPrefMap,
  };
};

export default { getDailyFoodCount };
