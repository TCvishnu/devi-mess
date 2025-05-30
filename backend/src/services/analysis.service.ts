import { CutType, MealType, UserRole } from "@prisma/client";
import getPrisma from "../lib/getPrisma";

const getDailyFoodCount = async (
  db: ReturnType<typeof getPrisma>,
  date: Date
) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  startOfDay.setDate(startOfDay.getDate());
  console.log(startOfDay);

  const mealCounts = await db.user.groupBy({
    by: ["mealType"],
    _count: {
      mealType: true,
    },
    where: {
      role: { not: "ADMIN" },
      adminVerified: true,
    },
  });
  const countMap: Record<MealType, number> = {
    MORNING: 0,
    AFTERNOON: 0,
    EVENING: 0,
    FULL: 0,
  };

  for (const item of mealCounts) {
    if (item.mealType === null) {
      // type saefty
      continue;
    }
    countMap[item.mealType] = item._count.mealType;
  }

  const totalCounts = {
    morning: countMap["MORNING"] + countMap["FULL"],
    afternoon: countMap["AFTERNOON"] + countMap["FULL"],
    evening: countMap["EVENING"] + countMap["FULL"],
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
  console.log("cuts: ", messcuts);

  return { totalCounts };

  // const totalStudents = await db.user.count({
  //   //redis?
  //   where: {
  //     role: { not: UserRole.ADMIN },
  //     adminVerified: true,
  //   },
  // });

  // const totalNonVegetarians = await db.user.count({
  //   //redis?
  //   where: {
  //     role: { not: UserRole.ADMIN },
  //     adminVerified: true,
  //     isVeg: false,
  //   },
  // });

  // const messcuts = await db.messcut.findMany({
  //   where: {
  //     date: { equals: startOfDay },
  //   },
  //   include: {
  //     user: {
  //       select: { isVeg: true },
  //     },
  //   },
  // });

  // const cutCounts: Record<CutType, { veg: number; nonVeg: number }> = {
  //   FULL: { veg: 0, nonVeg: 0 },
  //   MORNING: { veg: 0, nonVeg: 0 },
  //   EVENING: { veg: 0, nonVeg: 0 },
  //   AFTERNOON: { veg: 0, nonVeg: 0 },
  // };

  // for (const cut of messcuts) {
  //   const type = cut.cutType;
  //   const isVeg = cut.user.isVeg;

  //   if (isVeg) {
  //     cutCounts[type].veg += 1;
  //   } else {
  //     cutCounts[type].nonVeg += 1;
  //   }
  // }

  // return { totalStudents, totalNonVegetarians, cutCounts };
};

export default { getDailyFoodCount };
