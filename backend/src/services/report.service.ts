import prisma from "@lib/prisma"
import { BillType, Report, ReportType, UserRole } from "@prisma/client"
import { saveExcelFile } from "@utils/file.util"
import ExcelJS from "exceljs"
import { MessReportRows, ResidentReportRows } from "../types/excel"
import { EXCEL_COLUMNS } from "../config/excelConfig"

const generateReport = async (
	month: number,
	year: number,
	reportType: ReportType
): Promise<Report | null> => {
	const alreadyExistingReport = await prisma.report.findFirst({
		where: {
			month,
			year,
			type: reportType,
		},
	})

	if (alreadyExistingReport) {
		return alreadyExistingReport
	}

	const users = await prisma.user.findMany({
		where: {
			role: reportType,
			adminVerified: true,
			hasOnboarded: true,
		},
		include: {
			userBills: {
				where: {
					month,
					year,
				},
				include: {
					billComponents: true,
				},
			},
		},
	})

	const workBook = new ExcelJS.Workbook()

	const workSheet = workBook.addWorksheet("Report")

	workSheet.columns = EXCEL_COLUMNS[reportType]

	const rows: ResidentReportRows[] | MessReportRows[] = []

	users.forEach((user, index) => {
		let rowDetails: MessReportRows | ResidentReportRows = {
			id: index + 1,
			name: user.name,
			totalDays: 0,
			totalAmount: 0,
			rent: 0,
			wifi: 0,
			electricity: 0,
		}

		if (user.role === UserRole.RESIDENT) {
			const electricityBill = user.userBills[0]?.billComponents.filter(
				(eachBill) => eachBill.type === BillType.ELECTRICITY
			)[0]
			const rentBill = user.userBills[0]?.billComponents.filter(
				(eachBill) => eachBill.type === BillType.RENT
			)[0]

			const wifiBill = user.userBills[0]?.billComponents.filter(
				(eachBill) => eachBill.type === BillType.WIFI
			)[0]

			if (electricityBill) {
				rowDetails.electricity = electricityBill.amount
				rowDetails.totalAmount += electricityBill.amount
			}
			if (rentBill) {
				rowDetails.rent = rentBill.amount
				rowDetails.totalAmount += rentBill.amount
			}
			if (wifiBill) {
				rowDetails.wifi = wifiBill.amount
				rowDetails.totalAmount += wifiBill.amount
			}
		}

		const filterTypeMap = new Map()

		if (user.mealType === BillType.FULL_MEAL) {
			// mess bill is the cummulative of all noons for FULL_MEAL
			filterTypeMap.set(BillType.MORNING_MEAL, 1)
			filterTypeMap.set(BillType.AFTERNOON_MEAL, 1)
			filterTypeMap.set(BillType.EVENING_MEAL, 1)
		} else {
			filterTypeMap.set(user.mealType, 1)
		}

		const messBill = user.userBills[0]?.billComponents.filter((eachBill) =>
			filterTypeMap.has(eachBill.type)
		)

		if (messBill?.length > 0) {
			rowDetails.totalDays = messBill[0].totalDays
			messBill.forEach((eachBill) => {
				rowDetails.totalAmount += eachBill.amount
			})
		}

		rows.push(rowDetails)
	})

	workSheet.addRows(rows)

	workSheet.getRow(1).eachCell((cell) => {
		;(cell.font = { bold: true }),
			(cell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "FFFFCC00" },
			})
	})

	const savedPath = await saveExcelFile(workBook)

	if (!savedPath) {
		console.error("Failed to save excel file")
		return null
	}

	const savedReport = await prisma.report.create({
		data: {
			type: reportType,
			excelPath: savedPath,
			month,
			year,
		},
	})

	return savedReport
}

// use for billConfigChange
const deleteReportByMonthAndYearAndType = async (
	month: number,
	year: number,
	type: ReportType
) => {
	return await prisma.report.deleteMany({
		where: {
			month,
			year,
			type,
		},
	})
}

export default {
	generateReport,
	deleteReportByMonthAndYearAndType,
}
