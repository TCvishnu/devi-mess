import { CutType } from "@prisma/client";
import getPrisma from "../lib/getPrisma";

const createMany = async (
  db: ReturnType<typeof getPrisma>,
  startDate: Date,
  endDate: Date | undefined,
  userID: string,
  cutType: CutType,
  month: number,
  year: number
) => {
  try {
    if (!endDate || startDate.getTime() === endDate.getTime()) {
      // single messcut case
      const messcut = await db.messcut.create({
        data: {
          date: startDate,
          cutType,
          userId: userID,
        },
      });
      return [messcut];
    }

    const existingMessCuts = await db.messcut.findMany({
      where: {
        userId: userID,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const dates: Date[] = [];
    let current = new Date(startDate);

    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const existingDates = new Set(
      existingMessCuts.map((cut) => cut.date.getTime())
    );
    const newDates = dates.filter((date) => !existingDates.has(date.getTime()));

    await db.messcut.createMany({
      data: newDates.map((date) => ({ date, cutType, userId: userID })),
    });

    return await readMonthlyMessCuts(db, month, year, userID);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const readMonthlyMessCuts = async (
  db: ReturnType<typeof getPrisma>,
  month: number,
  year: number,
  userID: string
) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  const monthlyMesscuts = await db.messcut.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
      userId: userID,
    },
  });

  return monthlyMesscuts;
};

const deleteMessCuts = async (
  db: ReturnType<typeof getPrisma>,
  cutIDs: string[],
  userID: string
) => {
  return await db.messcut.deleteMany({
    where: {
      id: {
        in: cutIDs,
      },
      userId: userID,
    },
  });
};
export default { createMany, readMonthlyMessCuts, deleteMessCuts };
