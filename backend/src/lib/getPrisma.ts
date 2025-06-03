import { enhance } from "@zenstackhq/runtime"
import prisma from "./prisma"
import { PrismaClient, User } from "@prisma/client"
import { Request } from "express"

// use enhanced prisma for api/* routes
const getPrisma = (req: Request): PrismaClient => {
	return enhance(prisma, {
		user: req.user! as User,
	}) as unknown as PrismaClient
}

export default getPrisma
