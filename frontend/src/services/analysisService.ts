import { Dayjs } from "dayjs";
import fetchApi from "./fetchConfig/fetchWrapper";
import { handleError } from "./handlerService";

export const getDailyFoodCount = async (date: Dayjs) => {
  const sendDate = date.toISOString();
  try {
    const response = await fetchApi(
      `/api/analysis/daily-food-count?date=${sendDate}`
    );
    return {
      status: response.status,
      total: response.data.result.totalStudents,
      cutCounts: response.data.result.cutCounts,
      totalNonVegetarians: response.data.result.totalNonVegetarians,
    };
  } catch (error) {
    if (error instanceof Error) handleError(error.message);

    return {
      status: false,
      message: "An error occured. Please try again later",
    };
  }
};
