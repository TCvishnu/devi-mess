import { useContext } from "react"
import AuthContext, { type AuthContextType } from "./AuthContext"

const useAuthContext = (): AuthContextType => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuthContext must be used within AuthProvider")
	}
	return context
}

export default useAuthContext
