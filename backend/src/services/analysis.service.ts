import { CutType, UserRole } from "@prisma/client";
import getPrisma from "../lib/getPrisma";

const getDailyFoodCount = async (
  db: ReturnType<typeof getPrisma>,
  date: Date
) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  startOfDay.setDate(startOfDay.getDate() + 1);

  const totalStudents = await db.user.count({
    //redis?
    where: {
      role: { not: UserRole.ADMIN },
      adminVerified: true,
    },
  });

  const totalNonVegetarians = await db.user.count({
    //redis?
    where: {
      role: { not: UserRole.ADMIN },
      adminVerified: true,
      isVeg: false,
    },
  });

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

  const cutCounts: Record<CutType, { veg: number; nonVeg: number }> = {
    FULL: { veg: 0, nonVeg: 0 },
    MORNING: { veg: 0, nonVeg: 0 },
    EVENING: { veg: 0, nonVeg: 0 },
    AFTERNOON: { veg: 0, nonVeg: 0 },
  };

  for (const cut of messcuts) {
    const type = cut.cutType;
    const isVeg = cut.user.isVeg;

    if (isVeg) {
      cutCounts[type].veg += 1;
    } else {
      cutCounts[type].nonVeg += 1;
    }
  }

  return { totalStudents, totalNonVegetarians, cutCounts };
};

export default { getDailyFoodCount };
