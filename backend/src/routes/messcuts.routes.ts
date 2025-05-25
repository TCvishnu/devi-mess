import { Router } from "express";
import messcutsController from "../controllers/messcuts.controller";
import {
  validateAndTransformRequest,
  validateQueryAndTransformRequest,
} from "../middlewares/validation.middleware";
import {
  createManyMessCutsSchema,
  monthYearQueryMessCutsSchema,
} from "../validations/messcuts.yup";

export const router = Router();

router.post(
  "/:userID/messcuts",
  validateAndTransformRequest(createManyMessCutsSchema),
  messcutsController.createMany
);

router.get(
  "/:userID/messcuts",
  validateQueryAndTransformRequest(monthYearQueryMessCutsSchema),
  messcutsController.readMonthlyMessCuts
);
