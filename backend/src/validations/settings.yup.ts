import * as yup from "yup";

export const fixedSettingsUpdateSchema = yup.object().shape({
  updateData: yup.array().of(
    yup.object().shape({
      id: yup.string().required(),
      amount: yup.number().required().transform(Number),
    })
  ),
});
