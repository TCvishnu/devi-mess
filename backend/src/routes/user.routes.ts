import { Router } from "express";
import userController from "../controllers/user.controller";

import {
  validateAndTransformRequest,
  validateQueryAndTransformRequest,
} from "../middlewares/validation.middleware";

export const userRouter = Router();

userRouter.get("/", userController.getUserWithoutPassword);

userRouter.get("/full-details", userController.getFullUserDetails);
