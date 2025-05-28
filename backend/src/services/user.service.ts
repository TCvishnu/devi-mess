import { User } from "@prisma/client"
import prisma from "@lib/prisma"
import getPrisma from "@lib/getPrisma"

const create = async (user: User) => {
	return await prisma.user.create({
		data: user,
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
	limit: number
) => {
	const skip = (page - 1) * limit
	const take = limit

	const totalUsers = await db.user.count({
		where: {
			adminVerified: false,
		},
	})

	const result = await db.user.findMany({
		where: {
			adminVerified: false,
		},
		orderBy: {
			updatedAt: "desc",
		},
		skip,
		take,
	})

	return {
		pagination: {
			currrentPage: page,
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
}
