import { Router } from "express";
import verifiedUserController from "@controllers/verifiedUser.controller";

import { userAdminVerified } from "@middlewares/userAdminVerified.middleware";
import { verifyUserID } from "@middlewares/verifyUserID.middleware";
import {
  validateAndTransformRequest,
  validateQueryAndTransformRequest,
} from "@middlewares/validation.middleware";

import {
  updateUserNameAndFoodPreferenceSchema,
  fetchStudentsSchema,
  searchUserByNameSchema,
} from "@validations/verifiedUser.yup";
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
  validateQueryAndTransformRequest(fetchStudentsSchema),
  verifiedUserController.getResidents
);

verifiedUserRouter.get(
  "/mess-students",
  authenticateAdmin,
  validateQueryAndTransformRequest(fetchStudentsSchema),
  verifiedUserController.getMessStudents
);

verifiedUserRouter.get(
  "/search",
  authenticateAdmin,
  validateQueryAndTransformRequest(searchUserByNameSchema),
  verifiedUserController.searchStudentsByName
);

export default verifiedUserRouter;
