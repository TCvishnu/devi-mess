import { Request, Response } from "express";
import messcutsService from "../services/messcuts.service";

const createMany = async (req: Request, res: Response) => {
  const { startDate, endDate, cutType, month, year, needsVerification } =
    req.body;
  const { userID } = req.params;

  const startDateStr = new Date(startDate);
  startDateStr.setHours(startDateStr.getHours() + 5);
  startDateStr.setMinutes(startDateStr.getMinutes() + 30);

  const endDateStr = endDate ? new Date(endDate) : undefined;
  endDateStr?.setHours(startDateStr.getHours() + 5);
  endDateStr?.setMinutes(startDateStr.getMinutes() + 30);

  try {
    const result = await messcutsService.createMany(
      req.db,
      startDateStr,
      endDateStr,
      userID,
      cutType,
      month,
      year,
      needsVerification
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

const readUnverifiedCuts = async (req: Request, res: Response) => {
  const { page, limit } = req.validatedQuery as { page: number; limit: number };
  try {
    const result = await messcutsService.readUnverifiedCuts(
      req.db,
      page,
      limit
    );
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUnverifiedCut = async (req: Request, res: Response) => {
  const { cutID } = req.body;

  try {
    await messcutsService.deleteUnverifiedCut(req.db, cutID);
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", reason: error });
  }
};

const verifyCut = async (req: Request, res: Response) => {
  const { cutID } = req.body;

  try {
    await messcutsService.verifyCut(req.db, cutID);
    res.status(200).json({ message: "verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", reason: error });
  }
};

export default {
  createMany,
  readMonthlyMessCuts,
  deleteMessCuts,
  readUnverifiedCuts,
  deleteUnverifiedCut,
  verifyCut,
};
