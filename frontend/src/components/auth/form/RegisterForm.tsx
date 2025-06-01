import { ChangeEvent, FormEvent, useState } from "react"
import PhoneNumberField from "@form/PhoneNumberField"
import PasswordField from "@form/PasswordField"
import Input from "@form/Input"
import Button from "../../../common/components/button/Button"
import { RegisterFormData, RegisterFormDataError } from "@type/auth"
import { Icon } from "@iconify/react"

type RegisterFormProps = {
	onSubmit: (
		event: FormEvent<HTMLFormElement>,
		formData: RegisterFormData
	) => void
	disable?: boolean
	pending?: boolean
}

const RegisterForm: React.FC<RegisterFormProps> = ({
	onSubmit,
	disable = false,
	pending = false,
}) => {
	const [formData, setFormData] = useState<RegisterFormData>({
		fullName: "",
		phoneNumber: "",
		password: "",
		confirmPassword: "",
	})

	const [fieldErrors, setFieldErrors] = useState<RegisterFormDataError>({
		fullName: "",
		phoneNumber: "",
		password: "",
		confirmPassword: "",
	})

	const validateFormFields = (values: RegisterFormData) => {
		let errors: RegisterFormDataError = {
			fullName: "",
			phoneNumber: "",
			password: "",
			confirmPassword: "",
		}

		let isError = false

		if (!values.fullName.trim()) {
			errors.fullName = "Full name is required"
			isError = true
		}

		if (!values.phoneNumber.trim()) {
			errors.phoneNumber = "Phone number is required"
			isError = true
		}

		if (!(values.phoneNumber.length == 10)) {
			errors.phoneNumber = "Phone must have 10 digits"
			isError = true
		}

		if (!values.password.trim()) {
			errors.password = "Password is required"
			isError = true
		} else if (!(values.password.trim().length >= 8)) {
			errors.password = "Password must contain atleast 8 characters"
			isError = true
		} else if (values.password !== values.confirmPassword) {
			errors.confirmPassword = "Password must be same"
			isError = true
		}

		setFieldErrors(errors)

		return isError
	}

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const isError = validateFormFields(formData)

		if (!isError) onSubmit(event, formData)
	}

	return (
		<form className=" w-full flex flex-col gap-2" onSubmit={handleSubmit}>
			<Input
				label="Full name"
				name="fullName"
				value={formData.fullName}
				onChange={handleChange}
				isError={fieldErrors.fullName ? true : false}
				errorMessage={fieldErrors.fullName}
				required
			/>
			<PhoneNumberField
				label="Phone number"
				name="phoneNumber"
				value={formData.phoneNumber}
				onChange={handleChange}
				isError={fieldErrors.phoneNumber ? true : false}
				errorMessage={fieldErrors.phoneNumber}
				required
			/>
			<PasswordField
				label="Password"
				name="password"
				value={formData.password}
				onChange={handleChange}
				isError={fieldErrors.password ? true : false}
				errorMessage={fieldErrors.password}
				required
			/>
			<PasswordField
				label="Confirm Password"
				name="confirmPassword"
				value={formData.confirmPassword}
				onChange={handleChange}
				isError={fieldErrors.confirmPassword ? true : false}
				errorMessage={fieldErrors.confirmPassword}
				required
			/>
			<Button
				className=" mt-4 flex justify-center items-center"
				disabled={disable}
			>
				{pending ? (
					<Icon width={24} color="white" icon="eos-icons:loading" />
				) : (
					"Register"
				)}
			</Button>
		</form>
	)
}

export default RegisterForm
