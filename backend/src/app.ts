require("dotenv").config();

import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./auth/passport";
import { enhance } from "@zenstackhq/runtime";
import { ZenStackMiddleware } from "@zenstackhq/server/express";
import prisma from "./lib/prisma";
import { User } from "@prisma/client";

const app = express();
const PORT = 3000;

// middlewares
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());

// every API request MUST pass authentication
app.use("/api", passport.authenticate("jwt", { session: false }));
app.use(
  "/api",
  ZenStackMiddleware({
    getPrisma: (req) => {
      enhance(prisma, { user: req.user! as User });
    },
  })
);

app.listen(PORT, () => {
  console.log(`Server running or port: ${PORT}`);
});
