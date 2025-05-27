import { Response } from "express"

export const handleError = (
	res: Response,
	statusCode: number,
	errorMessage?: string,
	loggingMessage?: string
) => {
	console.log("[ERROR]: ", statusCode, errorMessage, loggingMessage)
	res.status(statusCode).json({
		status: false,
		message: errorMessage,
	})
}
