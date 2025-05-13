import { Gender, MealType, UserRole } from "./enums"

export interface UserDetails {
	id?: number
	name?: string
	phoneNumber?: string
	gender?: Gender
	mealType?: MealType
	role?: UserRole
	isVeg?: boolean
	messcuts?: Array<Object>
	hasOnBoarded?: boolean
	adminVerified?: boolean
}

export interface ProfileCompleteFormData
	extends Pick<UserDetails, "gender" | "mealType" | "role" | "isVeg"> {}
