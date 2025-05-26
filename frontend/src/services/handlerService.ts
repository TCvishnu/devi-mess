export const handleError = (errorMessage: string, statusCode?: number) => {
	//add statuscode based error handling

	if (statusCode === 401) {
		window.localStorage.clear()
		window.sessionStorage.clear()
		//also remove cookie by sending a logout request to server
		// window.location.reload() // for clearing state values
	}

	console.log(errorMessage)
}
