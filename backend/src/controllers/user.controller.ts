import { Request, Response } from "express"
import { handleError } from "./utils/errorHandler.util"
import getPrisma from "@lib/getPrisma"
import userServices from "@services/user.service"
import { User } from "@prisma/client"
import residentService from "@services/resident.service"
import { hashPassword } from "@utils/bcrypt.util"

const getCurrentUser = async (req: Request, res: Response) => {
	try {
		const prisma = getPrisma(req)

		const residentialData = await residentService.getDetailsByUserId(
			prisma,
			(req.user as User).id
		)
		res.status(200).json({
			data: {
				...req.user,
				residentialData,
			},
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

const getNotVerifiedList = async (req: Request, res: Response) => {
	try {
		const page = parseInt(req.validatedQuery?.page as string) || 1
		const limit = parseInt(req.validatedQuery?.limit as string) || 10

		const db = getPrisma(req)

		delete req.validatedQuery?.page
		delete req.validatedQuery?.limit

		const data = await userServices.findNotVerifiedUsers(
			db,
			page,
			limit,
			req.validatedQuery
		)

		if (!data.result.length) {
			handleError(res, 404, "No users found")
			return
		}

		res.status(200).json(data)
	} catch (err) {
		handleError(
			res,
			500,
			"Internal Server error",
			err instanceof Error ? err.message : ""
		)
	}
}

const getResidentDetails = async (req: Request, res: Response) => {
	try {
		const db = getPrisma(req)

		const data = await residentService.getDetailsByUserId(
			db,
			req.params.userID
		)

		if (!data) {
			handleError(res, 404, "No resident details found")
			return
		}

		res.status(200).json(data)
	} catch (err) {
		handleError(
			res,
			500,
			"Internal Server error",
			err instanceof Error ? err.message : ""
		)
	}
}

const markAsVerified = async (req: Request, res: Response) => {
	try {
		const db = getPrisma(req)

		const data = await userServices.findByIdAndUpdate(
			db,
			req.params.userID,
			{
				adminVerified: true,
			}
		)

		const { password, ...safeUser } = data

		res.status(200).json({ data: safeUser })
	} catch (err) {
		handleError(
			res,
			500,
			"Internal Server error",
			err instanceof Error ? err.message : ""
		)
	}
}

const create = async (req: Request, res: Response) => {
	try {
		const { residentialData, ...profileDetails } = req.body

		const hashedPassword = await hashPassword(profileDetails.password)

		const updatedUser = await userServices.onboardStudent(
			req.db,
			{ ...profileDetails, password: hashedPassword },
			residentialData
		)

		res.status(200).json({
			data: updatedUser,
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
	getResidentDetails,
	create,
	getNotVerifiedList,
	markAsVerified,
}
