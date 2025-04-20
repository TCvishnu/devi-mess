import { ChangeEvent, FormEvent, useState } from "react"
import PhoneNumberField from "../../../common/components/form/PhoneNumberField"
import PasswordField from "../../../common/components/form/PasswordField"
import Button from "../../../common/components/button/Button"
import { LoginFormData, LoginFormDataError } from "../../../types/auth"

type LoginFormProps = {
	onSubmit: (
		event: FormEvent<HTMLFormElement>,
		formData: LoginFormData
	) => void
	disable?: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, disable = false }) => {
	const [formData, setFormData] = useState<LoginFormData>({
		phoneNumber: "",
		password: "",
	})

	const [fieldErrors, setFieldErrors] = useState<LoginFormDataError>({
		phoneNumber: "",
		password: "",
	})

	const validateFormFields = (values: LoginFormData) => {
		let errors: LoginFormDataError = {
			phoneNumber: "",
			password: "",
		}

		let isError = false

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
			<PhoneNumberField
				label="Phone number"
				name="phoneNumber"
				value={formData.phoneNumber}
				onChange={handleChange}
				isError={fieldErrors.phoneNumber ? true : false}
				errorMessage={fieldErrors.phoneNumber}
			/>
			<PasswordField
				label="Password"
				name="password"
				value={formData.password}
				onChange={handleChange}
				isError={fieldErrors.password ? true : false}
				errorMessage={fieldErrors.password}
			/>
			<Button className=" mt-4" disabled={disable}>
				Login
			</Button>
		</form>
	)
}

export default LoginForm
