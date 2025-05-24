import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";

import { Request } from "express";
import { JwtPayload } from "../types/auth";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req: Request) => req?.cookies?.authToken,
  ]),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JwtStrategy(opts, (jwtPayload: JwtPayload, done) => {
    // a fetch is needed to get user data
    return done(null, jwtPayload);
  })
);

export default passport;
