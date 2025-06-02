import { Agenda, Job } from "agenda";
import prisma from "@lib/prisma";
import { CutType, UserBill, BillComponents, BillType } from "@prisma/client";

export const agendaFunction = (agenda: Agenda): void => {
  agenda.define("calculate-monthly-fees", async (job: Job) => {
    try {
      await prisma.$transaction(async (tx) => {
        const users = await tx.user.findMany({
          where: {
            adminVerified: true,
            role: {
              not: "ADMIN",
            },
          },
        });
        for (const user of users) {
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

          if (user.startDate && user.startDate > prevMonthEnd) {
            continue; // joined after May, skip
          }

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

          const billComponentsToCreate = userBillConfigs.map(
            (userBillConfig) => {
              const cutType = userBillConfig.billTypeConfiguration
                .type as CutType;
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
            }
          );

          await tx.billComponents.createMany({ data: billComponentsToCreate });

          console.log("over: ", user.name);
        }
      });
    } catch (err) {
      console.error("Error in calculate-monthly-fees job:", err);
    }
  });
};
