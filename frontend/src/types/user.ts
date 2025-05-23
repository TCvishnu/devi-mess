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
	residentType?: ResidentialDataType
	hasOnBoarded?: boolean
	adminVerified?: boolean
}

export interface ProfileCompleteFormData
	extends Pick<
		UserDetails,
		"gender" | "mealType" | "role" | "isVeg" | "residentType"
	> {}

export type ProfileDataType = {
	fullName: string
	gender: Gender
	isVeg: boolean
	phoneNumber: string
	mealType: MealType
}

export type ResidentialDataType = {
	building: "Devi House" | "Rockland Arcade"
	floor: "Top" | "Ground"
}

export type ResidentFeesType = {
	rent: number
	wifi: number
	electricity: number
	totalFees: number
}
