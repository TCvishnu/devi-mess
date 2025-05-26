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

export default {
	create,
}
