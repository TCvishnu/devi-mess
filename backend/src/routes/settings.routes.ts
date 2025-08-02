import { Router } from "express";
import settingsController from "@controllers/settings.controller";
import { fixedSettingsUpdateSchema } from "@validations/settings.yup";
import {
  validateAndTransformRequest,
  validateQueryAndTransformRequest,
} from "@middlewares/validation.middleware";
import { monthYearQueryMessCutsSchema } from "@validations/messcuts.yup";

const settingsRouter = Router();

settingsRouter.get(
  "/configuration",
  settingsController.getSettingsConfiguration
);

settingsRouter.post(
  "/update-fixed-config",
  validateAndTransformRequest(fixedSettingsUpdateSchema),
  settingsController.updateFixedConfig
);

settingsRouter.post("/generate-rent", settingsController.generateRent);

settingsRouter.post("/mess-holiday", settingsController.addMessHoliday);
settingsRouter.get(
  "/mess-holiday",
  validateQueryAndTransformRequest(monthYearQueryMessCutsSchema),
  settingsController.getMessHolidays
);
export default settingsRouter;
