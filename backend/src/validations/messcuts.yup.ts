import * as yup from "yup";
import { CutType } from "@prisma/client";

export const createManyMessCutsSchema = yup.object({
  startDate: yup
    .string()
    .required()
    .test("is-iso", "startDate must be a valid ISO string", (value) => {
      return value ? !isNaN(Date.parse(value)) : false;
    }),

  endDate: yup
    .string()
    .optional()
    .nullable()
    .test("is-iso", "endDate must be a valid ISO string", (value) => {
      if (value === undefined || value === null) return true;
      return !isNaN(Date.parse(value));
    }),

  cutType: yup
    .mixed<CutType>()
    .oneOf(["MORNING", "AFTERNOON", "EVENING", "FULL"])
    .required(),
  month: yup.number().integer().min(0).max(11).required(),
  year: yup.number().integer().min(2025).max(2100).required(),
});

export const monthYearQueryMessCutsSchema = yup.object({
  month: yup.number().integer().min(0).max(11).required(),
  year: yup.number().integer().min(2025).max(2100).required(),
});

export const deleteMessCutsSchema = yup.object({
  cutIDs: yup
    .array()
    .of(
      yup
        .string()
        .required("ID is required")
        .matches(/^c[a-z0-9]{24}$/, "Invalid CUID format")
    )
    .required("cutIDs is required")
    .min(1, "At least one ID is required"),
});
