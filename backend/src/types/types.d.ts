import { JwtPayload } from "./auth";
import prisma from "../lib/prisma";
import { enhance } from "@zenstackhq/runtime";

declare global {
  namespace Express {
    interface User extends JwtPayload {}
  }
}

type EnhancedDb = ReturnType<typeof enhance>;

declare module "express-serve-static-core" {
  interface Request {
    db: EnhancedDb;
  }
}
