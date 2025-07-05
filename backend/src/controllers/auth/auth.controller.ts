import { Request, Response } from "express"
import { Resident, User } from "@prisma/client"

import userServices from "@services/user.service"
import { compareHashedPassword } from "@utils/bcrypt.util"
import { ACCESS_TOKEN_EXPIRE_TIME } from "@utils/date.util"
import { generateToken } from "@utils/jwt.util"

import { handleError } from "@controllers/utils/errorHandler.util"
import residentService from "@services/resident.service"

const login = async (req: Request, res: Response) => {
	try {
		const { phoneNumber, password } = req.body

		const result: User | null = await userServices.findByPhoneNumber(
			phoneNumber
		)

		if (!result) {
			res.status(404).json({
				status: false,
				message: "No user found",
			})

			return
		}

		if (!(await compareHashedPassword(password, result.password))) {
			handleError(res, 401, "Incorrect password for the user")
			return
		}

		let residentialData: Resident | null = null

		if (result.hasOnboarded) {
			residentialData = await residentService.findByUserId(result.id)
		}

		const accessToken = generateToken(
			{
				id: result.id,
				role: result.role,
			},
			ACCESS_TOKEN_EXPIRE_TIME
		)

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "prod",
			sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
			maxAge: ACCESS_TOKEN_EXPIRE_TIME,
		})

		const { password: storedPassword, ...safeUser } = result

		res.status(200).json({
			status: true,
			data: { ...safeUser, residentialData },
		})
	} catch (err) {
		handleError(
			res,
			500,
			"Internal Server Error",
			err instanceof Error ? err.message : ""
		)
	}
}

const logout = async (req: Request, res: Response) => {
	res.clearCookie("accessToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "prod",
		sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
	})

	res.status(200).json({ message: "Logged out successfully" })
}

export default {
	login,
	logout,
}
