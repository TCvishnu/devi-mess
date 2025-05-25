import { Router } from "express";
import messcutsController from "../controllers/messcuts.controller";

export const router = Router();

router.post("/:userID/messcuts", messcutsController.createMany);

router.get("/:userID/messcuts", messcutsController.readMonthlyMessCuts);
