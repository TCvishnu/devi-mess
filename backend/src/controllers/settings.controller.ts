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

const updateFixedConfig = async (req: Request, res: Response) => {
  const { updateData } = req.body;

  try {
    const result = await settingsService.updateConfig(req.db, updateData);

    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const generateRent = async (req: Request, res: Response) => {
  const { updateData } = req.body;

  try {
    const result = await settingsService.generateRent(req.db, updateData);

    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { getSettingsConfiguration, updateFixedConfig, generateRent };
