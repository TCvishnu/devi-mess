import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import OTPInput from "@form/OTPInput"
import Button from "../../common/components/button/Button"
import { requestOtpVerification, verifyOtp } from "@services/authService"
import { useState } from "react"
import useTimer from "@hooks/useTimer"
import { convertSecondsToString } from "../../common/utils/time"

type OTPVerificationProps = {
	phoneNumber: string
	onClose: () => void
	onSuccess?: (data: any) => void
	onError?: (err: Error) => void
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
	phoneNumber,
	onClose,
	onSuccess,
	onError,
}) => {
	const { timeLeft, resetTimer } = useTimer(30)

	const [open, setOpen] = useState<boolean>(true)
	const [otp, setOtp] = useState<string>("")

	const handleChange = (newValue: string) => {
		setOtp(newValue)
		console.log(newValue)
	}

	const handleSubmit = async () => {
		try {
			resetTimer()
			const { status, data } = await verifyOtp(phoneNumber, otp)

			if (!status) {
				//handle error
			}

			setOpen(false)
			await new Promise((resolve) => setTimeout(resolve, 190))
			onClose()

			if (onSuccess) onSuccess(otp)
		} catch (err) {}
	}

	const handleResend = async () => {
		try {
			const { status, data } = await requestOtpVerification(phoneNumber)

			console.log(status, data)

			resetTimer()
		} catch (err) {}
	}

	const handleClose = async () => {
		if (!open) return

		setOpen(false)
		await new Promise((resolve) => setTimeout(resolve, 190))
		onClose()
	}

	return (
		<div
			className={` fixed inset-0 px-6 py-6 w-full min-h-dvh flex flex-col justify-between gap-10 bg-white ${
				open ? " animate-slide-in" : " animate-slide-out"
			}`}
		>
			<div className=" font-bold flex flex-col items-start gap-10">
				<Icon
					onClick={handleClose}
					icon="famicons:arrow-back"
					width={24}
					className=" text-gray-400"
				/>
				<div>
					<h2 className=" text-2xl">Verification Code</h2>
					<p className=" text-lg opacity-40 mt-3 text-justify">
						We have sent the verification code to your phone number
					</p>
				</div>
				<div className=" w-full sm:w-fit flex flex-col items-start gap-4">
					<OTPInput onChange={handleChange} />
					<button
						onClick={handleResend}
						disabled={timeLeft > 0}
						className=" opacity-60 "
					>
						{timeLeft > 0
							? `Resend available in ${convertSecondsToString(
									timeLeft
							  )}`
							: "Not recevied? Resend"}
						{}
					</button>
				</div>
				<Button
					onClick={handleSubmit}
					radiusSize="xl"
					className=" py-4"
				>
					Confirm
				</Button>
			</div>
			<div className=" text-center font-bold opacity-60">
				<span>Devi Mess</span>
			</div>
		</div>
	)
}

export default OTPVerification
