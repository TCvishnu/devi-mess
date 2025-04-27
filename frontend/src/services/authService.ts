import {
	LoginFormData,
	RegisterFormData,
	RegistrationDetails,
} from "../types/auth"
import { UserDetails } from "../types/user"

import fetchApi from "./fetchConfig/fetchWrapper"
import { handleError } from "./handlerService"

type LoginResponse = {
	status: boolean
	data?: UserDetails
}

type RegisterResponse = {
	status: boolean
	data?: UserDetails
}

export const login = async (data: LoginFormData): Promise<LoginResponse> => {
	try {
		const response = await fetchApi("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})

		if (!response) throw new Error("Network Error")

		const responseData = response.data

		return {
			status: true,
			data: responseData,
		}
	} catch (err: unknown) {
		if (err instanceof Error) handleError(err.message)

		return {
			status: false,
		}
	}
}

export const register = async (
	data: RegistrationDetails
): Promise<RegisterResponse> => {
	try {
		const response = await fetchApi("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})

		if (!response) throw new Error("Network Error")

		const responseData = response.data

		return {
			status: true,
			data: responseData,
		}
	} catch (err: unknown) {
		if (err instanceof Error) handleError(err.message)

		return {
			status: false,
		}
	}
}

export const requestOtpVerification = async (phoneNumber: string) => {
	try {
		const response = await fetchApi("/api/otp/request", {
			method: "POST",
			body: JSON.stringify({
				phoneNumber,
			}),
		})

		if (!response) throw new Error("Network failure")

		return {
			status: true,
			data: response.data,
		}
	} catch (err: unknown) {
		if (err instanceof Error) handleError(err.message)

		return {
			status: false,
		}
	}
}

export const verifyOtp = async (phoneNumber: string, otp: string) => {
	try {
		const response = await fetchApi("/api/otp/verify", {
			method: "POST",
			body: JSON.stringify({
				phoneNumber,
				otp,
			}),
		})

		if (!response) throw new Error("Network failure")

		return {
			status: true,
			data: response.data,
		}
	} catch (err: unknown) {
		if (err instanceof Error) handleError(err.message)

		return {
			status: false,
		}
	}
}
