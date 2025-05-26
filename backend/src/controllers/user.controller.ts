import { Request, Response } from "express"
import { handleError } from "./utils/errorHandler.util"

const getCurrentUser = async (req: Request, res: Response) => {
	try {
		res.status(200).json({
			data: req.user,
		})
	} catch (err) {
		handleError(
			res,
			500,
			"Internal Server error",
			err instanceof Error ? err.message : ""
		)
	}
}

export default {
	getCurrentUser,
}
