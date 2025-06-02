import { ReportType } from "@prisma/client"
import * as yup from "yup"

export const ReportRequest = yup
	.object()
	.shape({
		month: yup.number().min(0).max(11).required("month is required"),
		year: yup.number().min(2025).max(2100).required("year is required"),
		reportType: yup
			.string()
			.oneOf([ReportType.MESS, ReportType.RESIDENT])
			.required("reportType is required"),
	})
	.stripUnknown()
