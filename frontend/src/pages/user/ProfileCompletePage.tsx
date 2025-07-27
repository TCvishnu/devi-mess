import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import ProfileCompleteForm from "../../components/user/form/ProfileCompleteForm"
import { ProfileCompleteFormData } from "@type/user"
import { register } from "@services/authService"

const ProfileCompletePage = () => {
	const navigate = useNavigate()

	const [pending, setPending] = useState<boolean>(false)

	const [errorMessage, setErrorMessage] = useState<string | undefined>("")

	const handleSubmit = async (formData: ProfileCompleteFormData) => {
		try {
			setPending(true)
			const { data, status } = await register(formData)

			if (!status && data) {
				navigate(`/admin`)
				setErrorMessage("")
			} else {
				setErrorMessage(
					"Failed to register user.Please try again later"
				)
			}
		} catch (err: unknown) {
			if (err instanceof Error) console.log(err.message)
			setErrorMessage("Something went wrong. Please try again later")
		} finally {
			setPending(false)
		}
	}

	const handleGoBack = () => {
		navigate("/admin")
	}

	return (
		<div className=" px-6 py-4 min-h-dvh flex flex-col gap-10 justify-between">
			<div className=" space-y-4">
				<div className=" py-2 font-bold">
					<Icon
						onClick={handleGoBack}
						icon="famicons:arrow-back"
						width={24}
						className=" text-gray-400 cursor-pointer"
					/>
					<h2 className=" mt-10 text-2xl sm:text-2xl">
						Register here
					</h2>
					<p className=" mt-6 text-base sm:text-lg opacity-40 ">
						Use this form to register a new member into the mess
						system.
					</p>
				</div>

				<div>
					{errorMessage && (
						<span className=" text-red-600 font-medium opacity-50 ">
							{errorMessage}
						</span>
					)}
					<ProfileCompleteForm
						onSubmit={handleSubmit}
						disable={pending}
						pending={pending}
					/>
				</div>
			</div>
			<div className=" text-center font-bold opacity-60">
				<span>Devi Mess</span>
			</div>
		</div>
	)
}

export default ProfileCompletePage
