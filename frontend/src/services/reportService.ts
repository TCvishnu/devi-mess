import { ReportType } from "@type/enums"
import fetchApi from "./fetchConfig/fetchWrapper"
import { handleError } from "./handlerService"

export const fetchReport = async (
	month: number,
	year: number,
	reportType: ReportType
) => {
	try {
		const response = await fetchApi(
			"/api/reports/generate",
			{
				method: "POST",
				body: JSON.stringify({
					month,
					year,
					reportType,
				}),
			},
			"blob"
		)

		return {
			data: response.data,
		}
	} catch (err: unknown) {
		if (err instanceof Error) handleError(err.message)

		return {
			error: "Failed to generate report",
		}
	}
}
