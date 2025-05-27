import { Router } from "express"

import userController from "@controllers/user.controller"

import { validateAndTransformRequest } from "@middlewares/validation.middleware"
import { ProfileCompleteRequest } from "@validations/user.yup"

const router = Router()

router.get("/get-current-user", userController.getCurrentUser)

router.post(
	"/complete-profile",
	validateAndTransformRequest(ProfileCompleteRequest),
	userController.updateOnboardDetails
)

export default router
