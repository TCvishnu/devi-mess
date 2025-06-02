import { run } from "graphile-worker";
import prisma from "@lib/prisma";
import { BillType, UserBill, CutType } from "@prisma/client";

const includedBillTypes = [BillType.WIFI, BillType.ELECTRICITY, BillType.RENT];
const includedBillTypesToUpdate = [BillType.WIFI, BillType.ELECTRICITY];

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
      await calculateRent(userId, month, year);
    },
    triggerMessBill: async (payload, helpers) => {
      const now = new Date();

      const messUsers = await prisma.user.findMany({
        where: {
          adminVerified: true,
          role: {
            not: "ADMIN",
          },
        },
      });
      const prevMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
        0,
        0,
        0
      ); // might be bug prone

      const prevMonthEnd = new Date(
        prevMonthStart.getFullYear(),
        prevMonthStart.getMonth() + 1,
        0
      );

      for (const user of messUsers) {
        if (user.startDate && user.startDate > prevMonthEnd) {
          continue;
        }

        await helpers.addJob("generateMonthlyMessBill", {
          userID: user.id,
          prevMonthStart,
        });
      }
    },
    generateMonthlyMessBill: async (payload, helpers) => {
      const { userID, prevMonthStart } = payload as {
        userID: string;
        prevMonthStart: Date;
      };

      console.log(`Generating mess bill for user ${userID}`);
      await messBill(userID);
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

    if (!userBill.draft) {
      const billComponentsToUpdate = await tx.billComponents.findMany({
        where: {
          userBillid: userBill.id,
          type: {
            in: includedBillTypesToUpdate,
          },
        },
      });

      const resident = await tx.resident.findFirst({
        where: {
          userId: userID,
        },
      });
      if (!resident) return;

      const applicableConfigs = await tx.billTypeConfiguration.findMany({
        where: {
          type: {
            in: includedBillTypesToUpdate,
          },
          classifier: {
            equals: `${resident.building} ${resident.floor}`,
          },
        },
      });

      const configMap = new Map(
        applicableConfigs.map((c) => [c.type, c.amount])
      );

      const updatedComponents = billComponentsToUpdate.map((comp) => ({
        ...comp,
        amount: configMap.get(comp.type) ?? comp.amount,
      }));

      await Promise.all(
        updatedComponents.map((comp) =>
          tx.billComponents.update({
            where: { id: comp.id },
            data: { amount: comp.amount },
          })
        )
      );

      return;
    }

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

    console.log("Rent created for: ", userID);
  });
};

const messBill = async (userID: string) => {
  await prisma.$transaction(async (tx) => {
    const now = new Date();
    const prevMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
      0,
      0,
      0
    );

    const user = await tx.user.findUnique({ where: { id: userID } });
    if (!user) return;

    const year =
      now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = now.getMonth() === 0 ? 11 : now.getMonth() - 1;

    const totalDays = new Date(year, month + 1, 0).getDate();

    const createdBill: UserBill = await tx.userBill.create({
      data: {
        userId: user.id,
        draft: user.role === "RESIDENT",
        month: prevMonthStart.getMonth(),
        year: prevMonthStart.getFullYear(),
      },
    });

    const startOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0
    );

    const totalDaysHadFood =
      user.startDate && user.startDate.getMonth() === prevMonthStart.getMonth()
        ? totalDays - user.startDate.getDate() + 1
        : totalDays;

    const prevMonthMessCutsCount = await tx.messcut.groupBy({
      by: ["cutType"],
      where: {
        userId: {
          equals: user.id,
        },
        date: {
          gte: prevMonthStart,
          lt: startOfCurrentMonth,
        },
      },
      _count: {
        _all: true,
      },
    });

    const totalDaysHadFoodAfterCuts: Record<CutType, number> = {
      MORNING_MEAL: totalDaysHadFood,
      AFTERNOON_MEAL: totalDaysHadFood,
      EVENING_MEAL: totalDaysHadFood,
      FULL_MEAL: totalDaysHadFood,
    };

    for (const cut of prevMonthMessCutsCount) {
      const cutType = cut.cutType as CutType;
      const count = cut._count._all;

      if (cutType === "FULL_MEAL") {
        totalDaysHadFoodAfterCuts.MORNING_MEAL = Math.max(
          0,
          totalDaysHadFoodAfterCuts.MORNING_MEAL - count
        );
        totalDaysHadFoodAfterCuts.AFTERNOON_MEAL = Math.max(
          0,
          totalDaysHadFoodAfterCuts.AFTERNOON_MEAL - count
        );
        totalDaysHadFoodAfterCuts.EVENING_MEAL = Math.max(
          0,
          totalDaysHadFoodAfterCuts.EVENING_MEAL - count
        );
      } else {
        totalDaysHadFoodAfterCuts[cutType] = Math.max(
          0,
          totalDaysHadFoodAfterCuts[cutType] - count
        );
      }
    }

    const excludedBillTypes = [
      BillType.WIFI,
      BillType.ELECTRICITY,
      BillType.RENT,
    ];
    const userBillConfigs = await tx.userBillTypeConfiguration.findMany({
      where: {
        userId: user.id,
        billTypeConfiguration: {
          NOT: {
            type: {
              in: excludedBillTypes,
            },
          },
        },
      },
      include: {
        billTypeConfiguration: true,
      },
    });

    const billComponentsToCreate = userBillConfigs.map((userBillConfig) => {
      const cutType = userBillConfig.billTypeConfiguration.type as CutType;
      const days = totalDaysHadFoodAfterCuts[cutType] || 0;

      return {
        amount:
          days *
          (userBillConfig.overriddenAmount ||
            userBillConfig.billTypeConfiguration.amount),
        userBillid: createdBill.id,
        totalDays: days,
        type: cutType,
      };
    });

    await tx.billComponents.createMany({ data: billComponentsToCreate });

    console.log("over: ", user.name);
  });
};
