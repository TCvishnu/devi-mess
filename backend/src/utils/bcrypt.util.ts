import bcrypt from "bcrypt"

const SALT_ROUNDS: number = 5

export const hashPassword = async (plainPassword: string): Promise<string> => {
	return await bcrypt.hash(plainPassword, SALT_ROUNDS)
}

export const compareHashedPassword = async (
	plainPassword: string,
	hashedPassword: string
): Promise<boolean> => {
	return await bcrypt.compare(plainPassword, hashedPassword)
}

export default {
	hashPassword,
	compareHashedPassword,
}
