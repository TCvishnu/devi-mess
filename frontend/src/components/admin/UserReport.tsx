import { FC, useState } from "react"
import dayjs from "dayjs"
import { fetchReport } from "@services/reportService"
import { ReportType } from "@type/enums"
import { MONTHS } from "@utils/time"

const ReportTypeName = {
	[ReportType.MESS]: "outsiders",
	[ReportType.RESIDENT]: "residents",
}

const UserReport: FC = () => {
	const [pending, setPending] = useState({
		show: false,
		id: -1,
		type: "",
	})
	const [errorMessage, setErrorMessage] = useState("")

	const today = dayjs()
	const reportMonths = Array.from({ length: 3 }, (_, i) =>
		today.subtract(i + 1, "month")
	)

	const getReport = async (
		id: number,
		month: number,
		year: number,
		reportType: ReportType
	) => {
		try {
			setPending({
				show: true,
				id: id,
				type: reportType,
			})
			const { data, error } = await fetchReport(month, year, reportType)

			console.log(error, data)
			if (!error && data) {
				setErrorMessage("")
				const url = window.URL.createObjectURL(data)
				const link = document.createElement("a")

				document.body.appendChild(link)

				link.href = url

				link.download = `${MONTHS[month]}-${year}-${ReportTypeName[reportType]}-report`
				link.click()
				window.URL.revokeObjectURL(data)
				document.body.removeChild(link)
			} else {
				setErrorMessage(error || "")
			}
		} catch (err: unknown) {
			console.log(
				err instanceof Error
					? err.message
					: "Error in report generation"
			)
			setErrorMessage("Failed to generate report")
		} finally {
			setPending({
				show: false,
				id: -1,
				type: "",
			})
		}
	}

	return (
		<div>
			{errorMessage && (
				<div className=" text-red-400 text-center font-semibold mt-4">
					{errorMessage}
				</div>
			)}
			<div className="w-full grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-4 mt-2">
				{reportMonths.map((date, id) => (
					<div
						key={date.format("YYYY-MM")}
						className="w-full rounded-sm border border-gray-300 shadow-sm col-span-1"
					>
						<div className="p-6 flex flex-col gap-4 items-center">
							<div className="text-center">
								<h2 className="text-xl font-semibold text-primary tracking-wide">
									{date.format("MMMM")}
								</h2>
								<p className="text-sm font-medium text-gray-400">
									{date.format("YYYY")}
								</p>
							</div>

							<div className="flex w-full">
								<button
									className="w-1/2 p-3 flex justify-center items-center text-sm font-medium text-primary border-r border-accent"
									onClick={() =>
										getReport(
											id,
											date.month(),
											date.year(),
											ReportType.RESIDENT
										)
									}
									disabled={pending.show}
								>
									{/* <div className=" w-4 h-4 border-2 border-b-transparent rounded-full animate-spin " /> */}
									{pending.id == id &&
									pending.type === ReportType.RESIDENT ? (
										<div className=" w-4 h-4 border-2 border-b-transparent rounded-full animate-spin " />
									) : (
										"Residents"
									)}
								</button>
								<button
									className="w-1/2 p-3 flex justify-center items-center text-sm font-medium text-accent"
									onClick={() =>
										getReport(
											id,
											date.month(),
											date.year(),
											ReportType.MESS
										)
									}
									disabled={pending.show}
								>
									{pending.id == id &&
									pending.type === ReportType.MESS ? (
										<div className=" w-4 h-4 border-2 border-b-transparent rounded-full animate-spin " />
									) : (
										"Outsiders"
									)}
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default UserReport
