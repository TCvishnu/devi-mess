import fetchApi from "./fetchConfig/fetchWrapper";
import { handleError } from "./handlerService";

export const getConfiguration = async () => {
  try {
    const response = await fetchApi(`/api/settings/configuration`);

    return {
      status: response.status,
      settingsData: response.data.result,
      message: response.data.message,
    };
  } catch (error) {
    if (error instanceof Error) handleError(error.message);
    return {
      status: false,
      message: "An error occured. Please try again later",
    };
  }
};
