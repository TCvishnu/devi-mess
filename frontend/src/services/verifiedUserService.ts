import { UserRole } from "@type/enums";
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

export const getResidents = async (page: number, limit: number) => {
  try {
    const response = await fetchApi(
      `/api/verified-users/residents?page=${page}&limit=${limit}`
    );
    return {
      status: response.status,
      residents: response.data.result.residents,
      total: response.data.result.total,
    };
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);
    return {
      status: false,
      error: "Failed to update profile details. Please try again later",
    };
  }
};

export const getMessStudents = async (page: number, limit: number) => {
  try {
    const response = await fetchApi(
      `/api/verified-users/mess-students?page=${page}&limit=${limit}`
    );
    return {
      status: response.status,
      messStudents: response.data.result.messStudents,
      total: response.data.result.total,
    };
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);
    return {
      status: false,
      error: "Failed to update profile details. Please try again later",
    };
  }
};

export const searchStudentsByName = async (name: string, role: UserRole) => {
  try {
    const response = await fetchApi(
      `/api/verified-users/search?name=${name}&role=${role}`
    );
    console.log(response.data);
    return {
      status: response.status,
      students: response.data.result,
    };
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);
    return {
      status: false,
      error: "Failed to update profile details. Please try again later",
    };
  }
};
