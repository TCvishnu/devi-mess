import { NextFunction, Request, Response } from "express";
import getPrisma from "../lib/getPrisma";

declare global {
  namespace Express {
    interface Request {
      db: ReturnType<typeof getPrisma>;
    }
  }
}

export const useZenstackClient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.db = getPrisma(req);
  next();
};
