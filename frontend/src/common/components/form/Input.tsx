import ErrorBox from "./ErrorBox"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string
	isError?: boolean
	errorMessage?: string
}

const Input: React.FC<InputProps> = ({
	label,
	isError,
	errorMessage,
	...props
}) => {
	return (
		<div className=" w-full overflow-hidden font-semibold">
			{label && <label className=" opacity-60">{label}</label>}
			<input
				{...props}
				className=" w-full px-3 py-2 bg-neutral-100 border-2 border-neutral-400 focus:outline-none focus:border-neutral-600 transition-colors rounded-sm mt-1"
			/>
			{isError && <ErrorBox isError={isError} message={errorMessage} />}
		</div>
	)
}

export default Input
