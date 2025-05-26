require("dotenv").config()

import express from "express"

import cors from "cors"
import cookieParser from "cookie-parser"

import passport from "./auth/passport"

import authRouter from "@routes/auth/routes/auth.routes"

const app = express()
const PORT = 3000

declare global {
	namespace Express {
		interface Request {
			user?: User
		}
	}
}

// middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(passport.initialize())

//routes

app.use("/", async (req, res, next) => {
	console.log(req.body, req.path)

	next()
})
app.use("/api/auth", authRouter)

// every API request MUST pass authentication except auth routes

app.use("/api", passport.authenticate("jwt", { session: false }))

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server running or port: ${PORT}`)
})
