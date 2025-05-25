import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";

import { Request } from "express";
import prisma from "../lib/prisma";
import { User } from "@prisma/client";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req: Request) => req?.cookies?.authToken,
  ]),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    const user: User | null = await prisma.user.findUnique({
      where: { id: jwtPayload.id },
    });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  })
);

export default passport;
