import { Icon } from "@iconify-icon/react"
import { useId, useState } from "react"
import ErrorBox from "./ErrorBox"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: string
	isError?: boolean
	errorMessage?: string
}

const PasswordField: React.FC<InputProps> = ({
	label,
	isError,
	errorMessage,
	...props
}) => {
	const id: string = useId()
	const [showPassword, setShowPassword] = useState<boolean>(false)

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev)
	}

	return (
		<div className=" w-full font-semibold">
			{label && (
				<label htmlFor={id} className=" opacity-60">
					{label}
				</label>
			)}
			<div className=" mt-1 flex items-center gap-2 px-3 py-2 bg-neutral-100 border-2 border-neutral-400 focus:border-neutral-500 rounded-lg">
				<Icon
					className=" opacity-60"
					width={20}
					icon="meteor-icons:lock"
				/>
				<input
					{...props}
					id={id}
					type={showPassword ? "text" : "password"}
					className=" w-full focus:outline-none"
				/>
				<Icon
					className=" opacity-60"
					width={24}
					icon={showPassword ? "lucide:eye" : "lucide:eye-closed"}
					onClick={togglePasswordVisibility}
				/>
			</div>
			{isError && <ErrorBox isError={isError} message={errorMessage} />}
		</div>
	)
}

export default PasswordField
