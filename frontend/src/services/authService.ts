import {
  LoginFormData,
  RegisterFormData,
  RegistrationDetails,
} from "../types/auth";
import { UserDetails } from "@type/user";

import fetchApi from "./fetchConfig/fetchWrapper";
import { handleError } from "./handlerService";
import { getBackendBaseUrl } from "@utils/base";

type LoginResponse = {
  status: boolean;
  data?: UserDetails;
  message?: string;
};

type RegisterResponse = {
  status: boolean;
  data?: UserDetails;
  message?: string;
};

export const login = async (data: LoginFormData): Promise<LoginResponse> => {
  try {
    const response = await fetch(getBackendBaseUrl() + "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response) throw new Error("Network Error");
    const responseData = await response.json();

    return responseData;
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);

    return {
      status: false,
      message: "An error occured. Please try again later",
    };
  }
};

export const register = async (
  data: RegistrationDetails
): Promise<RegisterResponse> => {
  try {
    const response = await fetchApi("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, name: data.fullName }),
    });

    if (!response) throw new Error("Network Error");

    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);

    return {
      status: false,
      message: "An error occured. Please try again later",
    };
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetchApi("/api/auth/logout", {
      method: "POST",
    });
    return response.status;
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);

    return {
      status: false,
      message: "An error occured. Please try again later",
    };
  }
};

export const requestOtpVerification = async (phoneNumber: string) => {
  try {
    const response = await fetchApi("/api/otp/request", {
      method: "POST",
      body: JSON.stringify({
        phoneNumber,
      }),
    });

    if (!response) throw new Error("Network failure");

    return {
      status: true,
      data: response.data,
    };
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);

    return {
      status: false,
    };
  }
};

export const verifyOtp = async (phoneNumber: string, otp: string) => {
  try {
    const response = await fetchApi("/api/otp/verify", {
      method: "POST",
      body: JSON.stringify({
        phoneNumber,
        otp,
      }),
    });

    if (!response) throw new Error("Network failure");

    return {
      status: true,
      data: response.data,
    };
  } catch (err: unknown) {
    if (err instanceof Error) handleError(err.message);

    return {
      status: false,
      message: "An error occured. Please try again later",
    };
  }
};
