import { createContext, ReactNode, useContext, useState } from "react"
import { UserDetails } from "../types/user"

type AuthProviderProps = {
	children: ReactNode
}

type AuthContextType = {
	user: UserDetails | null
	login: (user: UserDetails) => void
	logout: () => void
	updateUser: (updatedData: Partial<UserDetails>) => void
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	login: () => {},
	logout: () => {},
	updateUser: () => {},
})

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<UserDetails | null>(null)

	const login = (newUser: UserDetails): void => {
		setUser(newUser)
	}

	const updateUser = (updatedUser: Partial<UserDetails>) => {
		setUser({
			...user,
			...updatedUser,
		})
	}

	const logout = () => {
		//handle cache clear
		setUser(null)
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				logout,
				updateUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuthContext = (): AuthContextType => {
	const data = useContext(AuthContext)

	if (!data) {
		throw new Error("useAuthContext can't be use outside AuthProvider")
	}

	return {
		user: data.user,
		updateUser: data.updateUser,
		login: data.login,
		logout: data.logout,
	}
}

export default AuthProvider
