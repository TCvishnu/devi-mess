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

  return { userBill };
};

export default { getMonthlyMessBill };
