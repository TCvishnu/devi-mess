import { Router } from "express"

const router = Router()

import userController from "@controllers/user.controller"

router.get("/get-current-user", userController.getCurrentUser)

export default router
