import { Agenda, Job } from "agenda";
import prisma from "@lib/prisma";
import { CutType, UserBill, BillComponents, BillType } from "@prisma/client";

export const agendaFunction = (agenda: Agenda): void => {
  agenda.define("calculate-monthly-fees", async (job: Job) => {
    try {
      await prisma.$transaction(async (tx) => {
        const users = await tx.user.findMany({
          where: {
            hasOnboarded: true,
            role: {
              not: "ADMIN",
            },
          },
        });
        for (const user of users) {
          const now = new Date();
          const year =
            now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          const month = now.getMonth() === 0 ? 11 : now.getMonth() - 1;

          const totalDays = new Date(year, month + 1, 0).getDate();

          const createdBill: UserBill = await tx.userBill.create({
            data: {
              userId: user.id,
              draft: user.role === "RESIDENT",
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
          const prevMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1,
            0,
            0,
            0
          );

          const totalDaysHadFood =
            user.startDate &&
            user.startDate.getMonth() === prevMonthStart.getMonth()
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
              totalDaysHadFoodAfterCuts.MORNING_MEAL -= count;
              totalDaysHadFoodAfterCuts.AFTERNOON_MEAL -= count;
              totalDaysHadFoodAfterCuts.EVENING_MEAL -= count;
            } else {
              totalDaysHadFoodAfterCuts[cutType] -= count;
            }
          }

          const userBillConfigs = await tx.userBillTypeConfiguration.findMany({
            where: {
              userId: user.id,
              billTypeConfiguration: {
                NOT: {
                  type: {
                    in: [BillType.WIFI, BillType.ELECTRICITY, BillType.RENT],
                  },
                },
              },
            },
            include: {
              billTypeConfiguration: true,
            },
          });

          for (const userBillConfig of userBillConfigs) {
            const insertData = {
              amount:
                totalDaysHadFoodAfterCuts[
                  userBillConfig.billTypeConfiguration.type as CutType
                ] * userBillConfig.billTypeConfiguration.amount,
              userBillid: createdBill.id,
              totalDays:
                totalDaysHadFoodAfterCuts[
                  userBillConfig.billTypeConfiguration.type as CutType
                ],
            };

            await tx.billComponents.create({ data: insertData });
          }
        }
      });
    } catch (err) {
      console.error("Error in calculate-monthly-fees job:", err);
    }
  });
};
