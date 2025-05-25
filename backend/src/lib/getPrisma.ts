import { enhance } from "@zenstackhq/runtime";
import prisma from "./prisma";
import { User } from "@prisma/client";
import { Request } from "express";

// use enhanced prisma for api/* routes
const getPrisma = (req: Request) => {
  return enhance(prisma, { user: req.user! as User });
};

export default getPrisma;
