require("dotenv").config();

import express, { Request, Response } from "express";
import { UserRole } from "@prisma/client";

import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./auth/passport";
import jwt from "jsonwebtoken";
import authenticateAdmin from "./auth/authenticateAdmin";

const app = express();
const PORT = 3000;

// middlewares
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());

// every API request must pass authentication
app.use("/api", passport.authenticate("jwt", { session: false }));

app.listen(PORT, () => {
  console.log(`Server running or port: ${PORT}`);
});
