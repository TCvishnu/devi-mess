import getPrisma from "@lib/getPrisma"
import prisma from "@lib/prisma"
import { Resident } from "@prisma/client"

type CreatePayload = Pick<Resident, "floor" | "building" | "userId">
const create = async (
	db: ReturnType<typeof getPrisma>,
	data: CreatePayload
) => {
	return await db.resident.create({
		data,
	})
}

const findByUserId = async (userId: string) => {
	return await prisma.resident.findUnique({
		where: {
			userId,
		},
	})
}

const getDetailsByUserId = async (
	db: ReturnType<typeof getPrisma>,
	userId: string
) => {
	return await db.resident.findUnique({
		where: {
			userId,
		},
	})
}

export default {
	create,
	findByUserId,
	getDetailsByUserId,
}
