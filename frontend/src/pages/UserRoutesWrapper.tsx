import { useAuthContext } from "@contexts/AuthContext"
import { fetchCurrentUser } from "@services/userService"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

const UserRoutesWrapper = () => {
	const navigate = useNavigate()

	const { user, updateUser } = useAuthContext()
	const [pending, setPending] = useState(false)

	const getCurrentUser = async () => {
		try {
			setPending(true)

			const { data, error } = await fetchCurrentUser()

			if (!error && data) {
				updateUser(data)
			} else {
				navigate("/")
			}
		} catch (err) {
			console.log(err)
			navigate("/")
		} finally {
			setPending(false)
		}
	}

	useEffect(() => {
		getCurrentUser()
	}, [])

	if (pending) return <div>Loading....</div>

	// this ensures that it's children have user details
	return <div className=" w-full h-auto">{user && <Outlet />}</div>
}

export default UserRoutesWrapper
