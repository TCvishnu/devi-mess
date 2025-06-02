import { Request, Response } from "express";
import analysisService from "@services/analysis.service";

const getDailyFoodCount = async (req: Request, res: Response) => {
  const { date } = req.validatedQuery as { date: string };

  const dateObject = new Date(date);
  try {
    const result = await analysisService.getDailyFoodCount(req.db, dateObject);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { getDailyFoodCount };
