import { Dayjs } from "dayjs";
import fetchApi from "./fetchConfig/fetchWrapper";
import { handleError } from "./handlerService";
import { MealType } from "@type/enums";

export const readMonthlyMessCuts = async (
  userID: string,
  month: number,
  year: number
) => {
  try {
    const response = await fetchApi(
      `/api/verified-user/${userID}/messcuts?month=${month}&year=${year}`
    );
    return {
      status: response.status,
      data: response.data.result,
    };
  } catch (error) {
    if (error instanceof Error) handleError(error.message);

    return {
      status: false,
      message: "An error occured. Please try again later",
    };
  }
};

export const createMesscuts = async (
  userID: string,
  cutRange: [Dayjs | null, Dayjs | null],
  cutType: MealType
) => {
  try {
    const sendData = {
      startDate: cutRange[0]?.toISOString(),
      endDate: cutRange[1]?.toISOString(),
      cutType,
    };
    const response = await fetchApi(`/api/verified-user/${userID}/messcuts`, {
      method: "POST",
      body: JSON.stringify(sendData),
    });

    console.log(response);
    return {
      status: response.status,
      data: response.data.result,
    };
  } catch (error) {
    if (error instanceof Error) handleError(error.message);

    return {
      status: false,
      message: "An error occured. Please try again later",
    };
  }
};
