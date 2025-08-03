import { CutType } from "@prisma/client";
import getPrisma from "../lib/getPrisma";

const createMany = async (
  db: ReturnType<typeof getPrisma>,
  startDate: Date,
  endDate: Date | undefined,
  userID: string,
  cutType: CutType,
  month: number,
  year: number,
  needsVerification: boolean
) => {
  try {
    if (!endDate || startDate.getTime() === endDate.getTime()) {
      // single messcut case
      const messcut = await db.messcut.create({
        data: {
          date: startDate,
          cutType,
          userId: userID,
          adminVerified: !needsVerification,
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
      data: newDates.map((date) => ({
        date,
        cutType,
        userId: userID,
        adminVerified: !needsVerification,
      })),
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

const readUnverifiedCuts = async (
  db: ReturnType<typeof getPrisma>,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const cuts = await db.messcut.findMany({
    where: {
      adminVerified: false,
    },
    orderBy: {
      date: "desc",
    },
    skip,
    take: limit,
    include: {
      user: true,
    },
  });

  const totalCuts = await db.messcut.count({ where: { adminVerified: false } });

  return {
    cuts,
    totalCuts,
    page,
    totalPages: Math.ceil(totalCuts / limit),
  };
};

const deleteUnverifiedCut = async (
  db: ReturnType<typeof getPrisma>,
  cutID: string
) => {
  await db.messcut.delete({
    where: {
      id: cutID,
    },
  });
};

export default {
  createMany,
  readMonthlyMessCuts,
  deleteMessCuts,
  readUnverifiedCuts,
  deleteUnverifiedCut,
};
