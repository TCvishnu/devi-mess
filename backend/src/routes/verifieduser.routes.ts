import { Router } from "express";
import verifiedUserController from "@controllers/verifiedUser.controller";

import { verifyUserID } from "@middlewares/verifyUserID.middleware";
import { validateAndTransformRequest } from "@middlewares/validation.middleware";

import { updateUserNameAndFoodPreferenceSchema } from "@validations/verifiedUser.yup";

const verifiedUserRouter = Router();

verifiedUserRouter.patch(
  "/:userID",
  verifyUserID,
  validateAndTransformRequest(updateUserNameAndFoodPreferenceSchema),
  verifiedUserController.updateUserNameAndFoodPreference
);

export default verifiedUserRouter;
