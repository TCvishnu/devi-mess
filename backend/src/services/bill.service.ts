import getPrisma from "../lib/getPrisma";
import { BillType, UserRole } from "@prisma/client";

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
      billComponents: true,
    },
  });

  return { userBill };
};

export default { getMonthlyMessBill };
