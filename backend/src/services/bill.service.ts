import getPrisma from "../lib/getPrisma";
import { BillType } from "@prisma/client";

const excludedBillTypes = [BillType.WIFI, BillType.ELECTRICITY, BillType.RENT];

const getMonthlyMessBill = async (
  db: ReturnType<typeof getPrisma>,
  month: number,
  year: number,
  userID: string
) => {
  const userBill = await db.userBill.findFirst({
    where: {
      month,
      year,
      userId: userID,
    },
    include: {
      billComponents: {
        where: {
          type: {
            notIn: excludedBillTypes,
          },
        },
      },
    },
  });

  const prevMonthStart = new Date(year, month, 1);
  const startOfCurrentMonth = new Date(year, month + 1, 1);

  const prevMonthMessCutsCount = await db.messcut.groupBy({
    by: ["cutType"],
    where: {
      userId: {
        equals: userID,
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

  return { userBill, prevMonthMessCutsCount };
};

export default { getMonthlyMessBill };
