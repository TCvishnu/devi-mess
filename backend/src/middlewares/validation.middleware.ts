import { NextFunction, Request, Response } from "express"
import { AnyYupSchema } from "../types/yup"

import * as yup from "yup"

export const validateAndTransformRequest = (request: AnyYupSchema) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			req.body = await request.validate(req.body)

			next()
		} catch (err: unknown) {
			if (err instanceof yup.ValidationError) {
				res.status(400).json({
					status: false,
					message: "Validation failed",
					errors: err.errors,
				})
			} else {
				res.status(400).json({
					status: false,
					message: "Validation failed",
					errors: null,
				})
			}

			if (err instanceof Error) console.log(err.message)
			return
		}
	}
}
