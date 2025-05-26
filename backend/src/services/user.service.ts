import { User } from "@prisma/client"
import prisma from "../lib/prisma"

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
}
