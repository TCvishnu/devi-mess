import { ChangeEvent, FormEvent, useState } from "react"
import Button from "../../../common/components/button/Button"
import {
	ProfileCompleteFormData,
	ProfileCompleteFormDataError,
} from "../../../types/user"
import { Gender, MealType, UserRole } from "../../../types/enums"
import SelectBox from "../../../common/components/form/Select"
import CheckBox from "../../../common/components/form/Checkbox"

type ProfileCompleteFormProps = {
	onSubmit: (
		event: FormEvent<HTMLFormElement>,
		formData: ProfileCompleteFormData
	) => void
	disable?: boolean
}

const ProfileCompleteForm: React.FC<ProfileCompleteFormProps> = ({
	onSubmit,
	disable = false,
}) => {
	const [formData, setFormData] = useState<ProfileCompleteFormData>({
		gender: Gender.Male,
		mealType: MealType.Full,
		role: UserRole.Mess,
		isVeg: false,
	})

	const [fieldErrors, setFieldErrors] =
		useState<ProfileCompleteFormDataError>({
			gender: "",
			mealType: "",
			role: "",
			isVeg: "",
		})

	const validateFormFields = (values: ProfileCompleteFormData) => {
		let errors: ProfileCompleteFormDataError = {
			gender: "",
			mealType: "",
			role: "",
			isVeg: "",
		}

		let isError = false

		if (!values.gender.trim()) {
			errors.gender = "Gender is required"
			isError = true
		}

		if (!values.mealType.trim()) {
			errors.mealType = "Meal type is required"
			isError = true
		}

		if (!values.role.trim()) {
			errors.role = "Role is required"
			isError = true
		}

		setFieldErrors(errors)

		return isError
	}

	const handleChange = (
		event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = event.target
		const checked = (event.target as HTMLInputElement).checked

		setFormData((prev) => ({
			...prev,
			[name]: name === "isVeg" ? checked : value,
		}))
	}

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const isError = validateFormFields(formData)

		if (!isError) onSubmit(event, formData)
	}

	return (
		<form className=" w-full flex flex-col gap-4" onSubmit={handleSubmit}>
			<SelectBox.Select
				name="gender"
				label="Gender"
				onChange={handleChange}
				value={formData.gender}
				isError={fieldErrors.gender ? true : false}
				errorMessage={fieldErrors.gender}
			>
				<SelectBox.Option value={Gender.Male}>Male</SelectBox.Option>
				<SelectBox.Option value={Gender.Female}>
					Female
				</SelectBox.Option>
			</SelectBox.Select>

			<SelectBox.Select
				name="mealType"
				label="Meal Selection"
				onChange={handleChange}
				value={formData.mealType}
				isError={fieldErrors.mealType ? true : false}
				errorMessage={fieldErrors.mealType}
			>
				<SelectBox.Option value={MealType.Full}>
					Full day
				</SelectBox.Option>
				<SelectBox.Option value={MealType.Morning}>
					Morning
				</SelectBox.Option>
				<SelectBox.Option value={MealType.Afternoon}>
					Afternoon
				</SelectBox.Option>
				<SelectBox.Option value={MealType.Evening}>
					Evening
				</SelectBox.Option>
			</SelectBox.Select>

			<SelectBox.Select
				name="role"
				label="Type"
				onChange={handleChange}
				value={formData.role}
				isError={fieldErrors.role ? true : false}
				errorMessage={fieldErrors.role}
			>
				<SelectBox.Option value={UserRole.Mess}>Mess</SelectBox.Option>
				<SelectBox.Option value={UserRole.Resident}>
					Resident
				</SelectBox.Option>
			</SelectBox.Select>

			<CheckBox
				name="isVeg"
				label="Is vegetarian?"
				onChange={handleChange}
				checked={formData.isVeg}
				isError={fieldErrors.isVeg ? true : false}
				errorMessage={fieldErrors.isVeg}
			/>

			<Button className=" mt-4" disabled={disable}>
				Complete
			</Button>
		</form>
	)
}

export default ProfileCompleteForm
