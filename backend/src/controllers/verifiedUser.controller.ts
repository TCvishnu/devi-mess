import verifiedUserService from "@services/verifiedUser.service";
import { Request, Response } from "express";

const updateUserNameAndFoodPreference = async (req: Request, res: Response) => {
  const updateData = req.body as {
    name: string;
    isVeg: boolean;
  };
  const { userID } = req.params;

  try {
    const result = await verifiedUserService.updateUserNameAndFoodPreference(
      req.db,
      updateData,
      userID
    );

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getResidents = async (req: Request, res: Response) => {
  try {
    const result = await verifiedUserService.getResidents(req.db);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessStudents = async (req: Request, res: Response) => {
  try {
    const result = await verifiedUserService.getMessStudents(req.db);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  updateUserNameAndFoodPreference,
  getResidents,
  getMessStudents,
};
