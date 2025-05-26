import { Request, Response } from "express"
import { handleError } from "./utils/errorHandler.util"
import getPrisma from "@lib/getPrisma"
import userServices from "@services/user.service"
import { Resident, User } from "@prisma/client"
import residentService from "@services/resident.service"

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

const updateOnboardDetails = async (req: Request, res: Response) => {
	try {
		const db = getPrisma(req) // replace with request method

		const { residentType, ...profileDetails } = req.body

		const updatedUser = await userServices.findByIdAndUpdate(
			db,
			(req.user as User).id,
			{ ...profileDetails, hasOnboarded: true }
		)

		if (residentType) {
			const newResidentialData = residentType as Pick<
				Resident,
				"floor" | "building"
			>

			await residentService.create(db, {
				userId: updatedUser.id,
				floor: newResidentialData.floor,
				building: newResidentialData.building,
			})
		}

		const { password, ...safeUser } = updatedUser

		res.status(200).json({
			data: safeUser,
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
	updateOnboardDetails,
}
