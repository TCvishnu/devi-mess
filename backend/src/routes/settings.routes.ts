import { Router } from "express";
import settingsController from "@controllers/settings.controller";
import { fixedSettingsUpdateSchema } from "@validations/settings.yup";
import { validateAndTransformRequest } from "@middlewares/validation.middleware";

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
export default settingsRouter;
