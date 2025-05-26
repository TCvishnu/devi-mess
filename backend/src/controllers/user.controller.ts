import { Request, Response } from "express";
import userService from "../services/user.service";
import { User } from "@prisma/client";

const getUserWithoutPassword = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserWithoutPassword(req.user as User);

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFullUserDetails = async (req: Request, res: Response) => {
  const { id } = req.user as User;
  try {
    const user = await userService.getFullUserDetails(req.db, id);
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default { getUserWithoutPassword, getFullUserDetails };
