import { Resident, User } from "@prisma/client"
import prisma from "@lib/prisma"
import getPrisma from "@lib/getPrisma"

const selectFields = {
	id: true,
	createdAt: true,
	updatedAt: true,
	name: true,
	phoneNumber: true,
	gender: true,
	mealType: true,
	role: true,
	isVeg: true,
	hasOnboarded: true,
	adminVerified: true,
}

const create = async (user: User) => {
	return await prisma.user.create({
		data: user,
	})
}

const updateOnBoardDetails = async (
	db: ReturnType<typeof getPrisma>,
	id: string,
	updatedData: User,
	residentialData: Resident
) => {
	return await db.$transaction(async (tx) => {
		const updatedUser = await tx.user.update({
			where: {
				id,
			},
			data: { ...updatedData, hasOnboarded: true },
		})

		let savedResidentialData: Resident | null = null

		if (residentialData) {
			const newResidentialData = residentialData as Pick<
				Resident,
				"floor" | "building"
			>

			savedResidentialData = await tx.resident.create({
				data: {
					userId: updatedUser.id,
					floor: newResidentialData.floor,
					building: newResidentialData.building,
				},
			})
		}

		const { password, ...safeUser } = updatedUser

		return { ...safeUser, residentialData: savedResidentialData }
	})
}

const getFullUserDetails = async (
	db: ReturnType<typeof getPrisma>,
	userID: string
) => {
	const user = await db.user.findUnique({
		where: { id: userID },
		include: { residentialData: true },
	})

	if (!user) return null

	const { password, ...rest } = user
	return rest
}

const findById = async (id: string) => {
	return await prisma.user.findUnique({
		where: {
			id,
		},
	})
}

const findByIdAndUpdate = async (
	db: ReturnType<typeof getPrisma>,
	id: string,
	updatedData: Partial<User>
) => {
	return await db.user.update({
		where: {
			id,
		},
		data: updatedData,
	})
}

const findByPhoneNumber = async (phoneNumber: string) => {
	return await prisma.user.findUnique({
		where: {
			phoneNumber,
		},
	})
}

const findNotVerifiedUsers = async (
	db: ReturnType<typeof getPrisma>,
	page: number,
	limit: number,
	query?: Omit<Partial<User>, "password">
) => {
	const skip = (page - 1) * 5
	const take = 5

	const whereClause: { [key: string]: any } = {
		adminVerified: false,
		hasOnboarded: true,
	}

	if (query?.name) {
		whereClause.name = {
			contains: query.name,
			mode: "insensitive",
		}
	}

	const totalUsers = await db.user.count({
		where: whereClause,
	})

	const result = await db.user.findMany({
		where: whereClause,
		select: selectFields,
		orderBy: {
			updatedAt: "desc",
		},
		skip,
		take,
	})

	return {
		pagination: {
			currentPage: page,
			limit,
			totalPages: Math.ceil(totalUsers / limit),
		},
		result,
	}
}

// const findBy = async (id: string): Promise<User | null> => {
// 	return await prisma.user.findUnique({
// 		where: {
// 			id,
// 		},
// 	})
// }

export default {
	create,
	findById,
	getFullUserDetails,
	findByPhoneNumber,
	findByIdAndUpdate,
	findNotVerifiedUsers,
	updateOnBoardDetails,
}
