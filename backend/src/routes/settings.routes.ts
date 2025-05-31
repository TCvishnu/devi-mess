import { Router } from "express";
import settingsController from "@controllers/settings.controller";

const settingsRouter = Router();

settingsRouter.get(
  "/configuration",
  settingsController.getSettingsConfiguration
);
export default settingsRouter;
