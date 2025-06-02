import * as yup from "yup";

export const getDailyFoodCountSchema = yup.object().shape({
  date: yup
    .string()
    .required()
    .test("is-iso", "startDate must be a valid ISO string", (value) => {
      return value ? !isNaN(Date.parse(value)) : false;
    }),
});
