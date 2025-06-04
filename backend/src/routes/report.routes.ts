import reportController from "@controllers/report.controller"
import { validateAndTransformRequest } from "@middlewares/validation.middleware"
import { ReportRequest } from "@validations/report.yup"
import { Router } from "express"

const router = Router()

// router.get("/")

router.post(
	"/generate",
	validateAndTransformRequest(ReportRequest),
	reportController.generateReport
)

export default router
