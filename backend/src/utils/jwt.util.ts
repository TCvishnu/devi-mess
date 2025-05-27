import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

export const generateToken = (payload: Object, expireTime: number) => {
	return jwt.sign(payload, JWT_SECRET as string, {
		expiresIn: expireTime,
	})
}
