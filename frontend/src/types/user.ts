// import { Gender, MealType, UserRole } from "./enums"

export type Gender = "MALE" | "FEMALE" // Need to change to an enum type
export type UserRole = "ADMIN" | "RESIDENT" | "MESS"

export interface UserDetails {
	id?: number
	name?: string
	phoneNumber?: string
	gender?: Gender
	mealType?: MealType
	role?: UserRole
	isVeg?: boolean
	messcuts?: Array<Object>
	residentType?: string // replace with recident enum
	hasOnBoarded?: boolean
	adminVerified?: boolean
}

export interface ProfileCompleteFormData
	extends Pick<
		UserDetails,
		"gender" | "mealType" | "role" | "isVeg" | "residentType"
	> {}
import { MealType } from "@constants/mealTypes"

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
