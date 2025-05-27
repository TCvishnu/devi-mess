require("dotenv").config()

import express from "express"

import cors from "cors"
import cookieParser from "cookie-parser"

import passport from "./auth/passport"

import authRouter from "@routes/auth/routes/auth.routes"
import userRouter from "@routes/user.routes"

const app = express()
const PORT = 3000

declare global {
	namespace Express {
		interface Request {
			user?: User
		}
	}
}

const NODE_ENV = process.env.NODE_ENV

// middlewares
app.use(
	cors({
		origin:
			NODE_ENV === "prod"
				? ["production urls"]
				: ["http://localhost:5173"],
		credentials: true,
	})
)
app.use(cookieParser())
app.use(express.json())
app.use(passport.initialize())

//routes without auth
app.use("/", async (req, res, next) => {
	console.log(req.body, req.path)

	next()
})
app.use("/api/auth", authRouter)

// every API request MUST pass authentication except auth routes

app.use("/api", passport.authenticate("jwt", { session: false }))

//routes with auth
app.use("/api/user", userRouter)

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server running or port: ${PORT}`)
})
