import { PrismaClient } from "@prisma/client";

// only use it for /register and /login
const prisma = new PrismaClient();
export default prisma;
