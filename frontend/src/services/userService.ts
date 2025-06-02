import { UserDetails } from "@type/user";
import fetchApi from "./fetchConfig/fetchWrapper";
import { handleError } from "./handlerService";

type UpdateProfileReturn = {
  data?: Partial<UserDetails>;
  error?: string;
};

type CurrentUserReturn = {
  data?: UserDetails;
  error?: string;
};

export const fetchCurrentUser = async (): Promise<CurrentUserReturn> => {
  try {
    const response = await fetchApi("/api/user/get-current-user");

    return {
      data: response.data.data,
    };
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);

    return {
      error: "Failed to update user details",
    };
  }
};

export const saveProfile = async (
  formData: Partial<UserDetails>
): Promise<UpdateProfileReturn> => {
  try {
    const response = await fetchApi("/api/user/complete-profile", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    console.log(response);
    return {
      data: response.data.data,
    };
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);

    return {
      error: "Failed to update profile details. Please try again later",
    };
  }
};
