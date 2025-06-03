import { Request, Response } from "express"
import { handleError } from "./utils/errorHandler.util"

import reportServices from "@services/report.service"
import fs from "fs"
import path from "path"

const generateReport = async (req: Request, res: Response) => {
	try {
		const { month, year, reportType } = req.body

		const report = await reportServices.generateReport(
			req.db,
			month,
			year,
			reportType
		)

		if (!report) {
			handleError(res, 500, "Error generating report")
			return
		}

		const filePath = path.join(__dirname, `../${report.excelPath}`)

		const excelFile = await fs.promises.readFile(filePath)

		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		)
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=user-report.xlsx"
		)

		res.send(excelFile)
	} catch (err) {
		handleError(
			res,
			500,
			"Internal Server Error",
			err instanceof Error ? err.message : "Error From Report Generation"
		)
	}
}

export default {
	generateReport,
}
