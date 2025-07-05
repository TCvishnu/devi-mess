import { Router } from "express"

import userController from "@controllers/user.controller"

import {
	validateAndTransformRequest,
	validateQueryAndTransformRequest,
} from "@middlewares/validation.middleware"
import { NotVerifiedListRequest, RegisterRequest } from "@validations/user.yup"
import { verifyUserID } from "@middlewares/verifyUserID.middleware"
import authenticateAdmin from "auth/authenticateAdmin"

const router = Router()

router.get("/get-current-user", userController.getCurrentUser)

/////// move this route to any other router if admin routes are defined in a different router
router.get(
	"/not-verified-users",
	validateQueryAndTransformRequest(NotVerifiedListRequest),
	userController.getNotVerifiedList
)

router.get("/resident/:userID", verifyUserID, userController.getResidentDetails)

router.post(
	"/mark-verified/:userID",
	verifyUserID,
	userController.markAsVerified
)

///////

router.post(
	"/register",
	validateAndTransformRequest(RegisterRequest),
	authenticateAdmin,
	userController.create
)

export default router
