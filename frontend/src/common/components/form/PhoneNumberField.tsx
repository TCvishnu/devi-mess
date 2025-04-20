import { ChangeEvent, ChangeEventHandler, InputHTMLAttributes } from "react"
import ErrorBox from "./ErrorBox"

type PhoneNumberFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string
	isError?: boolean
	errorMessage?: string
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
	label,
	isError,
	errorMessage,
	...props
}) => {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!/^\d{0,10}$/.test(event.target.value)) return
		props.onChange ? props.onChange(event) : null
	}

	return (
		<div className=" w-full overflow-hidden font-semibold">
			{label && <label className=" opacity-60">{label}</label>}
			<div className=" mt-1 flex items-center gap-3 px-3 py-2 bg-neutral-100 border-2 border-neutral-400 focus:border-neutral-500 rounded-lg">
				<div className=" pr-3 border-r-2 border-neutral-400 flex justify-center items-center">
					<span>+91</span>
				</div>
				<input
					type="text"
					{...props}
					onChange={handleChange}
					className=" w-full focus:outline-none"
				/>
			</div>

			{isError && <ErrorBox isError={isError} message={errorMessage} />}
		</div>
	)
}

export default PhoneNumberField
