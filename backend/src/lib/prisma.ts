import { PrismaClient } from "@prisma/client";

// do not use this client
const prisma = new PrismaClient();
export default prisma;
