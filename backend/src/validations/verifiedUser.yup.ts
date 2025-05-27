import * as yup from "yup";

export const updateUserNameAndFoodPreferenceSchema = yup
  .object()
  .shape({
    name: yup.string().trim().required(),
    isVeg: yup.boolean().required(),
  })
  .stripUnknown();
