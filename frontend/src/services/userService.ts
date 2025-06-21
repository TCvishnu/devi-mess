import { ResidentialDataType, UserDetails } from "@type/user"
import fetchApi from "./fetchConfig/fetchWrapper"
import { handleError } from "./handlerService"

type UpdateProfileReturn = {
	data?: Partial<UserDetails>
	error?: string
}

type CurrentUserReturn = {
	data?: UserDetails
	error?: string
}

type VerificationRequestReturn = {
	data?: {
		pagination: {
			limit: number
			currentPage: number
			totalPages: number
		}
		result: UserDetails[]
	}
	error?: string
}

type MarkAsVerifiedReturn = {
	status: boolean
	error?: string
}

type ResidentFetchReturn = {
	data?: ResidentialDataType
	error?: string
}

type UserSearchQuery = {
	name?: string
	// add other fields and use as query type
}
export const fetchCurrentUser = async (): Promise<CurrentUserReturn> => {
	try {
		const response = await fetchApi("/api/user/get-current-user")

		return {
			data: response.data.data,
		}
	} catch (err: unknown) {
		if (err instanceof Error) handleError(err.message)

		return {
			error: "Failed to update user details",
		}
	}
}

export const saveProfile = async (
	formData: Partial<UserDetails>
): Promise<UpdateProfileReturn> => {
	try {
		const response = await fetchApi("/api/user/complete-profile", {
			method: "POST",
			body: JSON.stringify(formData),
		})
		console.log(response)
		return {
			data: response.data.data,
		}
	} catch (err: unknown) {
		if (err instanceof Error) handleError(err.message)

		return {
			error: "Failed to update profile details. Please try again later",
		}
	}
}

export const fetchVerificationRequests = async (
	page?: number,
	limit?: number,
	query?: UserSearchQuery
): Promise<VerificationRequestReturn> => {
	try {
		console.log(page, limit)
		const urlParams = new URLSearchParams()

		if (query?.name) {
			urlParams.set("name", query.name)
		}

		if (page !== undefined) {
			urlParams.set("page", `${page}`)
		}

		if (limit !== undefined) {
			urlParams.set("limit", `${limit}`)
		}

		const response = await fetchApi(
			`/api/user/not-verified-users?${urlParams.toString()}`
		)

		if (!response.data?.result?.length)
			return {
				error: "No users found",
			}

		return {
			data: response.data,
		}
	} catch (err: unknown) {
		if (err instanceof Error) handleError(err.message)

		return {
			error: "No pending verification requests",
		}
	}
}

export const updateVerificationStatus = async (
	userId: string
): Promise<MarkAsVerifiedReturn> => {
	try {
		await fetchApi(`/api/user/mark-verified/${userId}`, {
			method: "POST",
		})

		return {
			status: true,
		}
	} catch (err: unknown) {
		if (err instanceof Error) handleError(err.message)

		return {
			status: false,
			error: "Failed to fetch verification requests",
		}
	}
}

export const fetchResidentDetails = async (
	userId: string
): Promise<ResidentFetchReturn> => {
	try {
		const response = await fetchApi(`/api/user/resident/${userId}`, {
			method: "GET",
		})

		return {
			data: response.data,
		}
	} catch (err: unknown) {
		if (err instanceof Error) handleError(err.message)

		return {
			error: "Failed to fetch verification requests",
		}
	}
}
