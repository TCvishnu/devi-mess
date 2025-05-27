import type { FC } from "react"

import { Navigate, Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import { useAuthContext } from "@contexts/AuthContext"

const UserLayout: FC = () => {
	const { user } = useAuthContext()

	return (
		<div className="w-screen h-screen flex flex-col p-4 bg-primary">
			<NavBar />
			{user ? (
				<div className="bg-white w-full h-full mt-4 rounded-md px-4 flex flex-col items-center overflow-y-auto">
					{user.hasOnboarded ? (
						user.adminVerified ? (
							<>
								<div className="w-full flex justify-between">
									<h1 className="text-white text-3xl font-bold">
										Hi!
									</h1>
									<button className="bg-white text-black font-semibold py-2 px-5 text-sm rounded-xs">
										Logout
									</button>
								</div>
								<h1 className="text-white text-3xl font-bold">
									{user?.name}
								</h1>
								<Outlet />
							</>
						) : (
							<Navigate to="/waiting-for-verification" />
						)
					) : (
						<Navigate to={`/complete-profile`} />
					)}
				</div>
			) : (
				<Navigate to="/" />
			)}
		</div>
	)
}

export default UserLayout
