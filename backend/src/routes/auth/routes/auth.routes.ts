import express from "express"

import authControllers from "@controllers/auth/auth.controller"

//Middlewares
import { validateAndTransformRequest } from "@middlewares/validation.middleware"

//validation schemas
import { LoginRequest } from "@validations/user.yup"

const router = express.Router()

router.post(
	"/login",
	validateAndTransformRequest(LoginRequest),
	authControllers.login
)

router.post("/logout", authControllers.logout)

export default router
