import fetchApi from "./fetchConfig/fetchWrapper";
import { handleError } from "./handlerService";

export const getMonthlyMessBill = async (
  month: number,
  year: number,
  userID: string
) => {
  try {
    const response = await fetchApi(
      `/api/verified-user/${userID}/bill?month=${month}&year=${year}`
    );
    console.log(response.data.result);
    console.log(response.status);
    return {
      status: response.status,
      bill: response.data.result.userBill,
      // prevMonthMessCuts: response.data.result.prevMonthMessCuts,
    };
  } catch (error) {
    if (error instanceof Error) handleError(error.message);

    return {
      status: false,
      message: "An error occured. Please try again later",
    };
  }
};

export const generateRent = async (
  updateData: { id: string; amount: number }[]
) => {
  try {
    const response = await fetchApi(`/api/settings/generate-rent`, {
      method: "POST",
      body: JSON.stringify(updateData),
    });

    console.log(response);
    return {
      status: response.status,
      // prevMonthMessCuts: response.data.result.prevMonthMessCuts,
    };
  } catch (error) {
    if (error instanceof Error) handleError(error.message);

    return {
      status: false,
      message: "An error occured. Please try again later",
    };
  }
};
