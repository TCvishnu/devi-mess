import getPrisma from "../lib/getPrisma";
import { BillTypeConfiguration, CutType, MealType } from "@prisma/client";
import { makeWorkerUtils } from "graphile-worker";
import { UserRole } from "@prisma/client";

const getSettingsConfiguration = async (db: ReturnType<typeof getPrisma>) => {
  const rawConfig = await db.billTypeConfiguration.findMany();

  return rawConfig.sort(
    (a: BillTypeConfiguration, b: BillTypeConfiguration) =>
      a.type.localeCompare(b.type) || b.classifier.localeCompare(a.classifier)
  );
};

const updateConfig = async (
  db: ReturnType<typeof getPrisma>,
  updateData: { id: string; amount: number }[]
) => {
  const results = await db.$transaction(async (tx) => {
    const ops = updateData.map(({ id, amount }) =>
      tx.billTypeConfiguration.update({
        where: { id },
        data: { amount },
      })
    );
    return Promise.all(ops);
  });

  return results.length;
};

const generateRent = async (
  db: ReturnType<typeof getPrisma>,
  updateData: { id: string; amount: number }[]
) => {
  console.log("yes: ", updateData);

  await updateConfig(db, updateData);

  const now = new Date();

  const prevMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
    0,
    0,
    0
  );

  const prevMonthEnd = new Date(
    prevMonthStart.getFullYear(),
    prevMonthStart.getMonth() + 1,
    0
  );

  const residentialUsers = await db.user.findMany({
    where: {
      role: UserRole.RESIDENT,
      adminVerified: true,
      startDate: { lt: prevMonthEnd },
    },
    select: { id: true },
  });

  const workerUtils = await makeWorkerUtils({
    connectionString: process.env.DATABASE_URL!,
  });

  for (const user of residentialUsers) {
    await workerUtils.addJob("generateUserBill", {
      userId: user.id,
      month: prevMonthStart.getMonth(),
      year: prevMonthStart.getFullYear(),
    });
  }
  console.log("res: ", residentialUsers);
  console.log("jobs added");
  return {};
};

const addMessHoliday = async (
  db: ReturnType<typeof getPrisma>,
  holidays: Date[]
) => {
  const users = await db.user.findMany({
    where: {
      role: { not: UserRole.ADMIN },
    },
    select: { id: true, mealType: true },
  });

  const createdHolidays = [];

  const sortedHolidays = holidays.sort(
    (holiday1, holiday2) => holiday1.getTime() - holiday2.getTime()
  );

  for (const holiday of sortedHolidays) {
    const created = await db.$transaction(async (tx) => {
      const createdHoliday = await tx.messHolidays.create({
        data: { date: holiday },
      });

      const messcuts = users.map((user) => ({
        date: holiday,
        cutType: user.mealType || MealType.FULL_MEAL,
        userId: user.id,
      }));

      await tx.messcut.createMany({ data: messcuts });

      return createdHoliday;
    });

    createdHolidays.push(created);
  }

  return createdHolidays;
};

const getMessHolidays = async (
  db: ReturnType<typeof getPrisma>,
  month: number,
  year: number
) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  return await db.messHolidays.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });
};

export default {
  getSettingsConfiguration,
  updateConfig,
  generateRent,
  addMessHoliday,
  getMessHolidays,
};
