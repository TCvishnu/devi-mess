import { NextFunction, Request, Response } from "express";
import { isCuid } from "cuid";

export const verifyUserID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userIDInParams = req.params.userID;
  if (!isCuid(userIDInParams)) {
    res.status(400).json({ error: "Invalid user ID format" });
    return;
  }
  next();
};
