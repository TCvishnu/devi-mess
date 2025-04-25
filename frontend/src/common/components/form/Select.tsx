import { useId } from "react"
import ErrorBox from "./ErrorBox"

type SelectProps = React.InputHTMLAttributes<HTMLSelectElement> & {
	label?: string
	className?: string
	errorMessage?: string
	isError?: boolean
}

type SelectOptionProps = React.InputHTMLAttributes<HTMLOptionElement> & {
	className?: string
}

const Select: React.FC<SelectProps> = ({
	label,
	className,
	isError,
	errorMessage,
	...props
}) => {
	const id: string = useId()

	return (
		<div className=" w-full font-semibold">
			{label && (
				<label htmlFor={id} className=" opacity-60">
					{label}
				</label>
			)}
			<select
				id={id}
				className={` w-full px-3 py-2 bg-neutral-100 border-2 border-neutral-400 focus:outline-none focus:border-neutral-600 transition-colors rounded-lg mt-1 ${
					className ? className : ""
				} `}
				{...props}
			>
				{props.children}
			</select>
			{isError && <ErrorBox isError={isError} message={errorMessage} />}
		</div>
	)
}

const Option: React.FC<SelectOptionProps> = ({ className, ...props }) => {
	return <option value={props.value}>{props.children}</option>
}

export default {
	Select,
	Option,
}
