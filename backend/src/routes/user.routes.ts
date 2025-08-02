import { Router } from "express";

import userController from "@controllers/user.controller";
import {
  validateAndTransformRequest,
  validateQueryAndTransformRequest,
} from "@middlewares/validation.middleware";
import { NotVerifiedListRequest } from "@validations/user.yup";
import { verifyUserID } from "@middlewares/verifyUserID.middleware";
import authenticateAdmin from "auth/authenticateAdmin";
import { RegisterRequest } from "@validations/user.yup";

const router = Router();

router.get("/get-current-user", userController.getCurrentUser);

/////// move this route to any other router if admin routes are defined in a different router

router.get(
  "/resident/:userID",
  verifyUserID,
  userController.getResidentDetails
);

///////

router.post(
  "/register",
  validateAndTransformRequest(RegisterRequest),
  authenticateAdmin,
  userController.create
);

router.get("/:userID", authenticateAdmin, userController.getUserById);
router.delete(
  "/:userID",
  authenticateAdmin,
  verifyUserID,
  userController.deleteUser
);
router.patch(
  "/update-meal-type",
  authenticateAdmin,
  userController.updateMealType
);
router.patch(
  "/update-password/:userID",
  authenticateAdmin,
  userController.updatePassword
);

export default router;
