import type { ReportType } from "@prisma/client"
import type { Column } from "exceljs"

export type ExcelColumn<T> = {
	header: string
	key: keyof T
	width?: number
	style?: Column["style"]
	hidden?: boolean
	outlineLevel?: number
}

export type MessReportRows = {
	id: number
	name: string
	totalDays: number
	totalAmount: number
}

export type ResidentReportRows = {
	id: number
	name: string
	rent: number
	totalDays: number
	wifi: number
	electricity: number
	totalAmount: number
}

export type ReportSchema = {
	[ReportType.MESS]: MessReportRows
	[ReportType.RESIDENT]: ResidentReportRows
}

export type ExcelColumnType = {
	[K in keyof ReportSchema]: ExcelColumn<ReportSchema[K]>[]
}
