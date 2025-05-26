import { getBackendBaseUrl } from "../../common/utils/base"
import { handleError } from "../handlerService"

const BACKEND_URL = getBackendBaseUrl()

const fetchApi = async (url: string, options?: RequestInit) => {
	try {
		const response = await fetch(BACKEND_URL + url, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			...options, // overriding options
		})

		if (!response) throw new Error("Network Failure")

		if (response.status === 401) {
			handleError("Token expired.Re-authentication is required", 401)
			throw new Error("Token expired.Re-authentication is required")
		}

		const data = await response.json()

		return {
			...response,
			data,
		}
	} catch (err) {
		throw err
	}
}

export default fetchApi
