import { Gender, MealType, UserRole } from "./enums"

export interface ProfileCompleteFormData {
	gender: Gender
	mealType: MealType
	role: UserRole
	isVeg: boolean
}

export interface ProfileCompleteFormDataError {
	gender: string
	mealType: string
	role: string
	isVeg: string
}
