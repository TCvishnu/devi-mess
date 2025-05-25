import { Request, Response } from "express";
import messcutsService from "../services/messcuts.service";

const createMany = async (req: Request, res: Response) => {
  const { cutRange, cutType } = req.body;
  const { userID } = req.params;

  const [startDateStr, endDateStr] = cutRange;
  const startDate = new Date(startDateStr);
  const endDate = endDateStr ? new Date(endDateStr) : undefined;

  try {
    const result = await messcutsService.createMany(
      req.db,
      startDate,
      endDate,
      userID,
      cutType
    );

    res.status(201).json({ newMesscuts: result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const readMonthlyMessCuts = async (req: Request, res: Response) => {
  let { month, year } = req.validatedQuery as { month: string; year: string };

  const { userID } = req.params;
  try {
    const result = await messcutsService.readMonthlyMessCuts(
      req.db,
      parseInt(month),
      parseInt(year),
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

export default { createMany, readMonthlyMessCuts };
