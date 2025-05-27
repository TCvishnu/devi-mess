import { Router } from "express";
import messcutsController from "../controllers/messcuts.controller";
import {
  validateAndTransformRequest,
  validateQueryAndTransformRequest,
} from "../middlewares/validation.middleware";
import {
  createManyMessCutsSchema,
  monthYearQueryMessCutsSchema,
  deleteMessCutsSchema,
} from "../validations/messcuts.yup";

const messCutsRouter = Router({ mergeParams: true });

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

messCutsRouter.delete(
  "/",
  validateAndTransformRequest(deleteMessCutsSchema),
  messcutsController.deleteMessCuts
);

export default messCutsRouter;
