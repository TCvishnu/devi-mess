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

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const createMesscuts = async (
  userID: string,
  cutRange: [Dayjs | null, Dayjs | null],
  cutType: MealType,
  month: number,
  year: number,
  needsVerification: boolean
) => {
  try {
    const istStart = cutRange[0]
      ?.tz("Asia/Kolkata")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    const istEnd = cutRange[1]
      ?.tz("Asia/Kolkata")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");

    const sendData = {
      startDate: istStart,
      endDate: istEnd,
      cutType,
      month,
      year,
      needsVerification,
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
      message: "An error occurred. Please try again later",
    };
  }
};

export const deleteMessCuts = async (userID: string, cutIDs: string[]) => {
  try {
    const response = await fetchApi(`/api/verified-user/${userID}/messcuts`, {
      method: "DELETE",
      body: JSON.stringify({ cutIDs }),
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof Error) handleError(error.message);

    return {
      status: false,
      message: "An error occured. Please try again later",
    };
  }
};
