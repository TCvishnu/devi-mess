import { UserRole } from "@prisma/client";
import * as yup from "yup";

export const updateUserNameAndFoodPreferenceSchema = yup
  .object()
  .shape({
    name: yup.string().trim().required(),
    isVeg: yup.boolean().required(),
  })
  .stripUnknown();

export const fetchStudentsSchema = yup.object().shape({
  page: yup.number().min(1).required(),
  limit: yup.number().min(1).max(50).required(),
});

export const searchUserByNameSchema = yup.object().shape({
  name: yup.string().min(1, "Name must be at least 1 character").required(),
  role: yup.mixed<UserRole>().oneOf(["MESS", "RESIDENT"]).required(),
});
