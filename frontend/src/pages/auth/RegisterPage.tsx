import { FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import RegisterForm from "../../components/auth/form/RegisterForm"
import BackgroundLayer from "../../components/auth/BackgroundLayer"
import OTPVerification from "../../components/auth/OTPVerification"
import { RegisterFormData, RegistrationDetails } from "@type/auth"
import { register } from "@services/authService"

const RegisterPage = () => {
	const [registrationDetails, setRegistrationDetails] =
		useState<RegistrationDetails>({
			password: "",
			phoneNumber: "",
			fullName: "",
			otp: "",
		})
	const [showOtpWindow, setShowOtpWindow] = useState<boolean>(false)
	const [pending, setPending] = useState<boolean>(false)

	const triggerShowOtpWindow = () => {
		setShowOtpWindow((prev) => !prev)
	}

	const handleSubmit = (
		event: FormEvent<HTMLFormElement>,
		formData: RegisterFormData
	) => {
		try {
			setRegistrationDetails({ ...formData, otp: "" })
			setShowOtpWindow(true)
			console.log(formData, "FROM LOGIN")
		} catch (err: unknown) {
			if (err instanceof Error) console.log(err.message)
		}
	}

	const handleOtpSuccess = async (otp: string) => {
		try {
			const { status, data } = await register({
				...registrationDetails,
				otp,
			})

			console.log(status, data)
			setShowOtpWindow(false)
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.log(err)
			} else {
				console.log(err)
			}
		}
	}

	return (
		<div className=" w-full px-6 py-10 h-full flex flex-col justify-around gap-60">
			<BackgroundLayer />
			<div className=" text-white font-bold">
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
					<h1>Create</h1>
					<h1>An Account</h1>
				</div>

				<RegisterForm disable={pending} onSubmit={handleSubmit} />
				<div className=" text-sm font-semibold text-gray-400 text-center flex flex-col">
					<span>already have an account?</span>
					<span>
						click here to
						<Link to="/" className=" ml-1 underline text-gray-800">
							login
						</Link>
					</span>
				</div>
			</div>
			{showOtpWindow && (
				<OTPVerification
					phoneNumber="12121"
					onClose={triggerShowOtpWindow}
					onSuccess={handleOtpSuccess}
				/>
			)}
		</div>
	)
}

export default RegisterPage
