import { Request, Response } from "express";
import { handleError } from "./utils/errorHandler.util";
import getPrisma from "@lib/getPrisma";
import userServices from "@services/user.service";
import { User } from "@prisma/client";
import residentService from "@services/resident.service";
import { hashPassword } from "@utils/bcrypt.util";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma(req);

    const residentialData = await residentService.getDetailsByUserId(
      prisma,
      (req.user as User).id
    );
    res.status(200).json({
      data: {
        ...req.user,
        residentialData,
      },
    });
  } catch (err) {
    handleError(
      res,
      500,
      "Internal Server error",
      err instanceof Error ? err.message : ""
    );
  }
};

const getResidentDetails = async (req: Request, res: Response) => {
  try {
    const db = getPrisma(req);

    const data = await residentService.getDetailsByUserId(
      db,
      req.params.userID
    );

    if (!data) {
      handleError(res, 404, "No resident details found");
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    handleError(
      res,
      500,
      "Internal Server error",
      err instanceof Error ? err.message : ""
    );
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { residentialData, ...profileDetails } = req.body;

    const hashedPassword = await hashPassword(profileDetails.password);

    const updatedUser = await userServices.onboardStudent(
      req.db,
      { ...profileDetails, password: hashedPassword },
      residentialData
    );

    res.status(200).json({
      data: updatedUser,
    });
  } catch (err) {
    handleError(
      res,
      500,
      "Internal Server error",
      err instanceof Error ? err.message : ""
    );
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const result = await userServices.deleteUser(req.db, userID);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const result = await userServices.getFullUserDetails(req.db, userID);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateMealType = async (req: Request, res: Response) => {
  try {
    const { mealType, gender, userID } = req.body;
    const result = await userServices.updateMealType(
      req.db,
      userID,
      mealType,
      gender
    );

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const { userID } = req.params;

    const result = await userServices.updatePassword(req.db, userID, password);
    console.log("update pass: ", result);
    res.status(200).json({ message: "password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getCurrentUser,
  getResidentDetails,
  create,
  updatePassword,
  updateMealType,
  getUserById,
  deleteUser,
};
