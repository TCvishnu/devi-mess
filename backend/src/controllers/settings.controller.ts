import { Request, Response } from "express";
import settingsService from "@services/settings.service";
const getSettingsConfiguration = async (req: Request, res: Response) => {
  try {
    const result = await settingsService.getSettingsConfiguration(req.db);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { getSettingsConfiguration };
