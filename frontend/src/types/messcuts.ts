import { MealType } from "./enums";
import { Dayjs } from "dayjs";

export type DisplayingCutType = {
  id: string;
  cutType: MealType;
  date: Dayjs;
  adminVerified: boolean;
};
