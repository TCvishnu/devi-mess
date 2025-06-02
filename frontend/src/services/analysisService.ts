import { Dayjs } from "dayjs";
import fetchApi from "./fetchConfig/fetchWrapper";
import { handleError } from "./handlerService";

export const getDailyFoodCount = async (date: Dayjs) => {
  try {
    const response = await fetchApi(
      `/api/analysis/daily-food-count?date=${date}`
    );
    console.log(response.data.result);
    return {
      status: response.status,
      cutCounts: response.data.result.afterCutCounts,
    };
  } catch (error) {
    if (error instanceof Error) handleError(error.message);

    return {
      status: false,
      message: "An error occured. Please try again later",
    };
  }
};
