import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import OTPInput from "../../common/components/form/OTPInput"
import Button from "../../common/components/button/Button"

const OTPVerification: React.FC = () => {
	const handleChange = (newValue: string) => {
		console.log(newValue)
	}

	const handleSubmit = () => {}

	const handleResend = () => {}
	return (
		<div className=" px-6 py-6 w-full min-h-dvh flex flex-col justify-between gap-10 bg-white">
			<div className=" font-bold flex flex-col items-start gap-10">
				<Icon
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
					<button onClick={handleResend} className=" opacity-60">
						Not recevied? Resend
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
