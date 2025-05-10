import React, { ChangeEvent, KeyboardEvent, useRef, useState } from "react"
import ErrorBox from "./ErrorBox"

type OTPInputProps = {
	initialValue?: string
	onChange: (value: string) => void
	isError?: boolean
	errorMessage?: string
}

const OTPInput: React.FC<OTPInputProps> = ({
	initialValue,
	onChange,
	isError,
	errorMessage,
}) => {
	const inputFieldRef = useRef<Array<HTMLInputElement | null>>([])
	const [otp, setOtp] = useState<Array<string>>(
		initialValue ? initialValue.split("") : ["", "", "", ""]
	)

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target

		if (!value || isNaN(Number(value))) return

		const changedIndex = Number(name)

		const newOtp = [...otp]
		newOtp[changedIndex] = value
		setOtp(newOtp)

		onChange?.(newOtp.join(""))

		if (changedIndex < otp.length - 1) {
			inputFieldRef.current[changedIndex + 1]?.focus()
		}
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		const pressedKey = event.key
		const index = Number(event.currentTarget.name)

		if (pressedKey === "Backspace") {
			console.log("Called 1")
			if (otp[index]) {
				const newOtp = [...otp]
				newOtp[index] = ""
				setOtp(newOtp)
				onChange?.(newOtp.join(""))
			} else if (index > 0) {
				console.log(inputFieldRef.current[index - 1])
				inputFieldRef.current[index - 1]?.focus()
			}
		}
	}

	return (
		<div className=" w-full">
			<div className=" w-full flex justify-around gap-4 text-2xl">
				{otp.map((eachOtp, index) => (
					<input
						key={eachOtp + index}
						ref={(element) => {
							inputFieldRef.current[index] = element
						}}
						type="text"
						name={index.toString()}
						className=" w-16 h-16 text-center text-gray-600 text-2xl border-2 border-gray-200 focus:outline-none focus:border-accent transition-colors rounded-2xl"
						value={eachOtp}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						maxLength={1}
					/>
				))}
			</div>
			{isError && <ErrorBox isError={isError} message={errorMessage} />}
		</div>
	)
}

export default OTPInput
