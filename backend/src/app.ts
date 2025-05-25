require("dotenv").config();

import express, { Request, Response } from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

import passport from "./auth/passport";
import prisma from "./lib/prisma";

const app = express();
const PORT = 3000;
const SALT_ROUNDS = 10;

// middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// every API request MUST pass authentication
app.use("/api", passport.authenticate("jwt", { session: false }));

// ignore these 2 requests: kept just for testing
app.post("/register", async (req: Request, res: Response) => {
  const user = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: user.phoneNumber },
    });

    if (existingUser) {
      res.status(400).json({ error: "Phone number already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.password = hashedPassword;

    const newUser = await prisma.user.create({ data: user });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/user", async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running or port: ${PORT}`);
});
