import { NextFunction, Request, Response } from "express";
import getPrisma from "../lib/getPrisma";

export const useZenstackClient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.db = getPrisma(req);
  next();
};
