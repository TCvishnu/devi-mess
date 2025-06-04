import { getBackendBaseUrl } from "../../common/utils/base"
import { handleError } from "../handlerService"

type ResponseType = "json" | "blob" | "text"

const BACKEND_URL = getBackendBaseUrl()

const fetchApi = async (
	url: string,
	options?: RequestInit,
	responseType: ResponseType = "json"
) => {
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

		let data

		if (responseType === "json") {
			data = await response.json()
		} else if (responseType === "blob") {
			data = await response.blob()
		} else if (responseType === "text") {
			data = await response.text()
		}

		return {
			...response,
			status: response.status,
			data,
		}
	} catch (err) {
		throw err
	}
}

export default fetchApi
