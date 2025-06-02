import { run } from "graphile-worker";
import prisma from "@lib/prisma";
import { BillType, UserBillTypeConfiguration } from "@prisma/client";

const includedBillTypes = [BillType.WIFI, BillType.ELECTRICITY, BillType.RENT];

export const jobRun = run({
  connectionString: process.env.DATABASE_URL!,
  taskList: {
    generateUserBill: async (payload, helpers) => {
      const { userId, month, year } = payload as {
        userId: string;
        month: number;
        year: number;
      };
      console.log(`Generating bill for user ${userId} with config`);
      // billing logic here
      await calculateRent(userId, month, year);
    },
  },
}).catch((err) => {
  console.error("Worker failed:", err);
});

const calculateRent = async (userID: string, month: number, year: number) => {
  await prisma.$transaction(async (tx) => {
    const userBill = await tx.userBill.findFirst({
      where: {
        userId: userID,
        month,
        year,
      },
    });
    if (!userBill) return;

    const userBillConfigs = await tx.userBillTypeConfiguration.findMany({
      where: {
        userId: userID,
        billTypeConfiguration: {
          type: {
            in: includedBillTypes,
          },
        },
      },
      include: {
        billTypeConfiguration: true,
      },
    });

    console.log({ month, year });
    const totalDays = new Date(year, month + 1, 0).getDate();

    const billComponentsToCreate = userBillConfigs.map((userBillConfig) => {
      return {
        totalDays: totalDays,
        amount:
          userBillConfig.overriddenAmount ||
          userBillConfig.billTypeConfiguration.amount,
        userBillid: userBill.id,
        type: userBillConfig.billTypeConfiguration.type,
      };
    });

    await tx.billComponents.createMany({ data: billComponentsToCreate });
    await tx.userBill.update({
      where: {
        id: userBill.id,
      },
      data: {
        draft: false,
      },
    });
  });
};
