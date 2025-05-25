require("dotenv").config();

import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import passport from "./auth/passport";
import { useZenstackClient } from "./middlewares/useZenstackClient.middleware";

// router imports
import { router as messcutsRouter } from "./routes/messcuts.routes";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// every API request MUST pass authentication
app.use("/api", passport.authenticate("jwt", { session: false }));
app.use("/api", useZenstackClient);

// routes
app.use("/api/user", messcutsRouter);

// unwanted route - keep it for cookie signing
app.get("/set-cookie", (req: Request, res: Response) => {
  const payload = {
    id: "cmb3fv9p00000bn992m1cmfgq",
    role: "ADMIN",
  };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  });
  res.status(200).json({ message: "JWT cookie set successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running or port: ${PORT}`);
});
