import { Request, Response } from "express";
import messcutsService from "../services/messcuts.service";

const createMany = async (req: Request, res: Response) => {
  const { startDate, endDate, cutType } = req.body;
  const { userID } = req.params;

  const startDateStr = new Date(startDate);
  const endDateStr = endDate ? new Date(endDate) : undefined;

  try {
    const result = await messcutsService.createMany(
      req.db,
      startDateStr,
      endDateStr,
      userID,
      cutType
    );

    res.status(201).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const readMonthlyMessCuts = async (req: Request, res: Response) => {
  let { month, year } = req.validatedQuery as { month: number; year: number };

  const { userID } = req.params;
  try {
    const result = await messcutsService.readMonthlyMessCuts(
      req.db,
      month,
      year,
      userID
    );

    if (result.length === 0) {
      res.status(404).json({ message: "No cuts in this month" });
      return;
    }

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteMessCuts = async (req: Request, res: Response) => {
  let { cutIDs } = req.body;
  const { userID } = req.params;

  try {
    const result = await messcutsService.deleteMessCuts(req.db, cutIDs, userID);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
export default { createMany, readMonthlyMessCuts, deleteMessCuts };
