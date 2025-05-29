import { Router } from "express";
import verifiedUserController from "@controllers/verifiedUser.controller";

import { userAdminVerified } from "@middlewares/userAdminVerified.middleware";
import { verifyUserID } from "@middlewares/verifyUserID.middleware";
import { validateAndTransformRequest } from "@middlewares/validation.middleware";

import { updateUserNameAndFoodPreferenceSchema } from "@validations/verifiedUser.yup";
import authenticateAdmin from "auth/authenticateAdmin";

const verifiedUserRouter = Router();

verifiedUserRouter.patch(
  "/:userID",
  verifyUserID,
  userAdminVerified,
  validateAndTransformRequest(updateUserNameAndFoodPreferenceSchema),
  verifiedUserController.updateUserNameAndFoodPreference
);

verifiedUserRouter.get(
  "/residents",
  authenticateAdmin,
  verifiedUserController.getResidents
);

verifiedUserRouter.get(
  "/mess-students",
  authenticateAdmin,
  verifiedUserController.getMessStudents
);

export default verifiedUserRouter;
