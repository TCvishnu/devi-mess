require("dotenv").config();

import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

import passport from "./auth/passport";
import getPrisma from "./lib/getPrisma";

// middleware imports

import { useZenstackClient } from "./middlewares/useZenstackClient.middleware";
import { verifyUserID } from "@middlewares/verifyUserID.middleware";

// router imports
import messCutsRouter from "@routes/messcuts.routes";
import authRouter from "@routes/auth/routes/auth.routes";
import userRouter from "@routes/user.routes";
import verifiedUserRouter from "@routes/verifieduser.routes";

const app = express();
const PORT = 3000;
const NODE_ENV = process.env.NODE_ENV;

declare global {
  namespace Express {
    interface Request {
      db: ReturnType<typeof getPrisma>;
      validatedQuery?: Record<string, Object>;
    }
  }
}

// middlewares
app.use(
  cors({
    origin:
      NODE_ENV === "prod" ? ["production urls"] : ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

app.use("/", async (req, _, next) => {
  console.log(req.body, req.path);
  next();
});

// API middlewares
app.use("/api/auth", authRouter);
app.use("/api", passport.authenticate("jwt", { session: false }));
app.use("/api", useZenstackClient);

// routes
app.use("/api/verified-user/:userID/messcuts", verifyUserID, messCutsRouter);
app.use("/api/user", userRouter);
app.use("/api/verified-users", verifiedUserRouter);

app.listen(PORT, () => {
  console.log(`Server running or port: ${PORT}`);
});
