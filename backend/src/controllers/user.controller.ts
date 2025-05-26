import { Request, Response } from "express";
import userService from "../services/user.service";
import { User } from "@prisma/client";

const getUserWithoutPassword = async (req: Request, res: Response) => {
  const user = await userService.getUserWithoutPassword(req.user as User);

  res.status(200).json({ user });
};

export default { getUserWithoutPassword };
