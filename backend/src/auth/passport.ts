import passport from "passport"
import {
	Strategy as JwtStrategy,
	ExtractJwt,
	StrategyOptions,
} from "passport-jwt"

import { Request } from "express"
import { User } from "@prisma/client"
import userServices from "@services/user.service"

const opts: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromExtractors([
		(req: Request) => req?.cookies?.accessToken,
	]),
	secretOrKey: process.env.JWT_SECRET as string,
}

passport.use(
	new JwtStrategy(opts, async (jwtPayload, done) => {
		const user: User | null = await userServices.findById(jwtPayload.id)

		if (!user) {
			return done(null, false)
		}

		return done(null, user)
	})
)

export default passport
