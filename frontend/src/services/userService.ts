import { UserDetails } from "@type/user"
import fetchApi from "./fetchConfig/fetchWrapper"
import { handleError } from "./handlerService"

type UpdateProfileReturn = {
	data?: Partial<UserDetails>
	error?: string
}

export const saveProfile = async (
	formData: Partial<UserDetails>
): Promise<UpdateProfileReturn> => {
	try {
		const response = await fetchApi("/api/user/update", {
			method: "POST",
			body: JSON.stringify(formData),
		})

		const data = response.data

		return {
			data,
		}
	} catch (err: unknown) {
		if (err instanceof Error) handleError(err.message)

		return {
			error: "Failed to update user details",
		}
	}
}
