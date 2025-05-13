import { ChangeEvent, FormEvent, useState } from "react"
import Button from "../../../common/components/button/Button"
import { ProfileCompleteFormData } from "../../../types/user"
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

		onSubmit(event, formData)
	}

	return (
		<form className=" w-full flex flex-col gap-4" onSubmit={handleSubmit}>
			<SelectBox.Select
				name="gender"
				label="Gender"
				onChange={handleChange}
				value={formData.gender}
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
			/>

			<Button className=" mt-4" disabled={disable}>
				Complete
			</Button>
		</form>
	)
}

export default ProfileCompleteForm
