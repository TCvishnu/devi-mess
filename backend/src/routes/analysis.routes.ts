import { Router } from "express";
import analysisController from "@controllers/analysis.controller";

import { getDailyFoodCountSchema } from "@validations/analysis.yup";
import { validateQueryAndTransformRequest } from "@middlewares/validation.middleware";

const analysisRouter = Router();

analysisRouter.get(
  "/daily-food-count",
  validateQueryAndTransformRequest(getDailyFoodCountSchema),
  analysisController.getDailyFoodCount
);

export default analysisRouter;
