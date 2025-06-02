import { Workbook } from "exceljs"
import path from "path"
import fs from "fs"

export const saveExcelFile = async (
	excelFile: Workbook
): Promise<string | null> => {
	try {
		const fileName = `${new Date().getTime()}-student-report.xlsx`

		const folderPath = path.resolve(__dirname, "../files")

		const filePath = path.join(folderPath, fileName)

		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true })
		}

		await excelFile.xlsx.writeFile(filePath)

		return "/files" + filePath.replace(folderPath, "").replace(/\\/g, "/")
	} catch (err) {
		if (err instanceof Error) console.log(err.message)
		return null
	}
}
