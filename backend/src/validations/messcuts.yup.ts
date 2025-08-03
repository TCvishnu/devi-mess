import * as yup from "yup";
import { CutType } from "@prisma/client";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export const createManyMessCutsSchema = yup.object({
  startDate: yup
    .string()
    .required()
    .matches(
      datetimeRegex,
      "startDate must be in 'YYYY-MM-DD HH:mm:ss' format"
    ),

  endDate: yup.string().nullable().optional().matches(datetimeRegex, {
    excludeEmptyString: true,
    message: "endDate must be in 'YYYY-MM-DD HH:mm:ss' format",
  }),

  cutType: yup
    .mixed<CutType>()
    .oneOf(["MORNING_MEAL", "AFTERNOON_MEAL", "EVENING_MEAL", "FULL_MEAL"])
    .required(),

  month: yup.number().integer().min(0).max(11).required(),

  year: yup.number().integer().min(2025).max(2100).required(),
  needsVerification: yup.boolean().required(),
});

export const monthYearQueryMessCutsSchema = yup.object({
  month: yup.number().integer().min(0).max(11).required(),
  year: yup.number().integer().min(2025).max(2100).required(),
});

export const unverifiedCutsQuerySchema = yup.object({
  page: yup.number().required().min(1),
  limit: yup.number().integer().min(0),
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
