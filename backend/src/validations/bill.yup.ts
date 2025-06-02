import * as yup from "yup";

export const getMonthlyBillSchema = yup.object().shape({
  month: yup.number().required().max(11).min(0),
  year: yup.number().required().min(2025),
});
