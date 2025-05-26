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

export const messCutsRouter = Router();

messCutsRouter.post(
  "/",
  validateAndTransformRequest(createManyMessCutsSchema),
  messcutsController.createMany
);

messCutsRouter.get(
  "/",
  validateQueryAndTransformRequest(monthYearQueryMessCutsSchema),
  messcutsController.readMonthlyMessCuts
);
