type ButtonProps = React.ButtonHTMLAttributes<HTMLElement> & {
	radiusSize?: "sm" | "md" | "lg" | "xl"
}

const Button: React.FC<ButtonProps> = ({ radiusSize, ...props }) => {
	let buttonRoundRadius = ""

	switch (radiusSize) {
		case "sm":
			buttonRoundRadius = " rounded-sm"
			break
		case "md":
			buttonRoundRadius = " rounded-md"
			break
		case "lg":
			buttonRoundRadius = " rounded-lg"
			break
		case "xl":
			buttonRoundRadius = " rounded-4xl"
			break
		default:
			buttonRoundRadius = " rounded-md"
	}

	return (
		<button
			{...props}
			className={` w-full px-3 py-2 font-semibold bg-accent text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${buttonRoundRadius} ${
				props.className ? props.className : ""
			}`}
		>
			{props.children}
		</button>
	)
}

export default Button
