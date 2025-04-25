type ErrorBoxProps = {
	message?: string
	isError: boolean
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ isError, message }) => {
	return (
		<div className=" w-full text-xs mt-1 ml-4 text-red-400 animate-shake">
			<span>{message}</span>
		</div>
	)
}

export default ErrorBox
