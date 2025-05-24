import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../types/auth";

const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as JwtPayload | undefined;
  if (!user) {
    res
      .status(401)
      .json({ error: "Unauthenticated: unable to identify the user!" });
    return;
  }

  if (user.role !== "ADMIN") {
    res.status(403).json({ error: "Unauthorized: Admins only" });
    return;
  }

  next();
};

export default authenticateAdmin;
