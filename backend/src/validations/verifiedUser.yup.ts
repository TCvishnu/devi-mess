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
