import { ReportType } from "@prisma/client"
import { ExcelColumnType } from "../types/excel"

export const EXCEL_COLUMNS: ExcelColumnType = {
	[ReportType.MESS]: [
		{
			header: "SI NO",
			key: "id",
			width: 10,
			style: {
				alignment: {
					horizontal: "left",
				},
			},
		},
		{
			header: "NAME",
			key: "name",
			width: 30,
			style: {
				alignment: {
					horizontal: "left",
				},
			},
		},
		{
			header: "NO OF DAYS PRESENT",
			key: "totalDays",
			width: 20,
			style: {
				alignment: {
					horizontal: "left",
				},
			},
		},
		{
			header: "FEE AMOUNT",
			key: "totalAmount",
			width: 20,
			style: {
				alignment: {
					horizontal: "left",
				},
			},
		},
	],
	[ReportType.RESIDENT]: [
		{
			header: "SI NO",
			key: "id",
			width: 10,
			style: {
				alignment: {
					horizontal: "left",
				},
			},
		},
		{
			header: "NAME",
			key: "name",
			width: 30,
			style: {
				alignment: {
					horizontal: "left",
				},
			},
		},
		{
			header: "RENT",
			key: "rent",
			width: 10,
			style: {
				alignment: {
					horizontal: "left",
				},
			},
		},
		{
			header: "MESS",
			key: "mess",
			width: 10,
			style: {
				alignment: {
					horizontal: "left",
				},
			},
		},
		{
			header: "NO OF DAYS PRESENT",
			key: "totalDays",
			width: 20,
			style: {
				alignment: {
					horizontal: "left",
				},
			},
		},
		{
			header: "WIFI",
			key: "wifi",
			width: 10,
			style: {
				alignment: {
					horizontal: "left",
				},
			},
		},
		{
			header: "CURRENT BILL",
			key: "electricity",
			width: 20,
			style: {
				alignment: {
					horizontal: "left",
				},
			},
		},
		{
			header: "TOTAL",
			key: "totalAmount",
			width: 10,
			style: {
				alignment: {
					horizontal: "left",
				},
			},
		},
	],
}
