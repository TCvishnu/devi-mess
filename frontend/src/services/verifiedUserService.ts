import fetchApi from "./fetchConfig/fetchWrapper";
import { handleError } from "./handlerService";

export const updateNameAndFoodPreference = async (
  userID: string,
  name: string,
  isVeg: boolean
) => {
  try {
    const sendData = {
      name,
      isVeg,
    };
    const response = await fetchApi(`/api/verified-users/${userID}`, {
      method: "PATCH",
      body: JSON.stringify(sendData),
    });

    return response;
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);
    return {
      status: false,
      error: "Failed to update profile details. Please try again later",
    };
  }
};

export const getResidents = async () => {
  try {
    const response = await fetchApi(`/api/verified-users/residents`);
    return {
      status: response.status,
      residents: response.data.result,
    };
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);
    return {
      status: false,
      error: "Failed to update profile details. Please try again later",
    };
  }
};

export const getMessStudents = async () => {
  try {
    const response = await fetchApi(`/api/verified-users/mess-students`);
    return {
      status: response.status,
      messStudents: response.data.result,
    };
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);
    return {
      status: false,
      error: "Failed to update profile details. Please try again later",
    };
  }
};
