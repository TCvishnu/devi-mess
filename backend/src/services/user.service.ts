import { User } from "@prisma/client"
import prisma from "@lib/prisma"
import getPrisma from "@lib/getPrisma"

const create = async (user: User) => {
	return await prisma.user.create({
		data: user,
	})
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
	findByPhoneNumber,
	findByIdAndUpdate,
}
