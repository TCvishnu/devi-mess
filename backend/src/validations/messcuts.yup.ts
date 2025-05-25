import * as yup from "yup";
import { CutType } from "@prisma/client";

export const createManyMessCutsSchema = yup.object({
  cutRange: yup.array().of(yup.string().required()).length(2).required(),
  cutType: yup
    .mixed<CutType>()
    .oneOf(["MORNING", "AFTERNOON", "EVENING", "FULL"])
    .required(),
});

export const monthYearQueryMessCutsSchema = yup.object({
  month: yup.number().integer().min(0).max(11).required(),
  year: yup.number().integer().min(2025).max(2100).required(),
});
