import getPrisma from "../lib/getPrisma";
import { BillTypeConfiguration } from "@prisma/client";
import { makeWorkerUtils } from "graphile-worker";
import { UserRole } from "@prisma/client";

const getSettingsConfiguration = async (db: ReturnType<typeof getPrisma>) => {
  const rawConfig = db.billTypeConfiguration.findMany();

  return (await rawConfig).sort(
    (a: BillTypeConfiguration, b: BillTypeConfiguration) =>
      a.type.localeCompare(b.type)
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
  // const count = await settingsService.updateConfig(db, updateData);
  // if (!count) return;

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

export default { getSettingsConfiguration, updateConfig, generateRent };
