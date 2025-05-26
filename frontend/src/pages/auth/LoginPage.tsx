import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import LoginForm from "../../components/auth/form/LoginForm"
import BackgroundLayer from "../../components/auth/BackgroundLayer"
import { login } from "@services/authService"
import { useAuthContext } from "../../contexts/AuthContext"
import { LoginFormData } from "@type/auth"

const LoginPage = () => {
	const navigate = useNavigate()

	const { login: updateUserState } = useAuthContext()

	const [pending, setPending] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState<string | undefined>("")

	const handleSubmit = async (
		event: FormEvent<HTMLFormElement>,
		formData: LoginFormData
	) => {
		try {
			setPending(true)
			const { status, data, message } = await login(formData)

			console.log(data?.hasOnboarded, "FROM LOGIN")
			if (status && data) {
				updateUserState(data)
				setErrorMessage("")

				if (!data.hasOnboarded) {
					navigate(`/complete-profile`)
				} else {
					navigate(`/user/${data.id}`)
				}
			} else {
				setErrorMessage(message)
			}
		} catch (err: unknown) {
			if (err instanceof Error) console.log(err.message)
		} finally {
			setPending(false)
		}
	}

	// add a auto login feature at the end of development.
	// Logging from cookie

	return (
		<div className=" w-full px-6 py-10 h-full flex flex-col justify-around gap-60">
			<BackgroundLayer />
			<div className=" h-1/4 text-white font-bold">
				<h1 className=" text-5xl sm:text-6xl">Devi Mess</h1>
				<p className=" flex items-center gap-2 mt-4">
					<Icon
						className=" text-accent"
						icon="ic:baseline-waving-hand"
						width={40}
						color="fc6874"
					/>
					<span className=" text-2xl">Welcome back</span>
				</p>
			</div>

			{/* <div className="shapedividers_com-6409">he</div> */}
			<div className=" max-w-md flex flex-col gap-10 justify-end">
				<div className="text-4xl font-bold">
					<h1>Login</h1>
					<h1>To Your Account</h1>
				</div>

				<div>
					{errorMessage && (
						<span className=" text-red-600 font-medium opacity-50 ">
							{errorMessage}
						</span>
					)}
					<LoginForm
						disable={pending}
						onSubmit={handleSubmit}
						pending={pending}
					/>
				</div>

				<div className=" text-center">
					<span className=" text-sm font-semibold text-gray-400">
						new here? click here to{" "}
						<Link
							to="/register"
							className=" underline text-gray-800"
						>
							register
						</Link>
					</span>
				</div>
			</div>
		</div>
	)
}

export default LoginPage
