import billService from "@services/bill.service";
import { Request, Response } from "express";

const getMonthlyMessBill = async (req: Request, res: Response) => {
  const { month, year } = req.validatedQuery as { month: number; year: number };
  const { userID } = req.params;
  console.log(userID);
  try {
    const result = await billService.getMonthlyMessBill(
      req.db,
      month,
      year,
      userID
    );

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { getMonthlyMessBill };
