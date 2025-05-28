import { Gender, MealType, UserRole } from "./enums"

export interface UserDetails {
	id?: string
	name?: string
	phoneNumber?: string
	gender?: Gender
	mealType?: MealType
	role?: UserRole
	isVeg?: boolean
	messcuts?: Array<Object>
	residentialData?: ResidentialDataType
	hasOnboarded?: boolean
	adminVerified?: boolean
}

export interface ProfileCompleteFormData
	extends Pick<
		UserDetails,
		"gender" | "mealType" | "role" | "isVeg" | "residentialData"
	> {}

export type ProfileDataType = {
	fullName: string
	gender: Gender
	isVeg: boolean
	phoneNumber: string
	mealType: MealType
}

export type ResidentialDataType = {
	building: "DEVI_HOUSE" | "ROCKLAND_ARCADE"
	floor: "TOP" | "GROUND"
}

export interface User {
	id: string
	createdAt: Date
	updatedAt: Date
	name: string
	phoneNumber: string
	password: string
	gender: Gender
	mealType: MealType
	role: UserRole
	isVeg: boolean
	hasOnboarded: boolean
	adminVerified: boolean
	messcuts: Messcut[]
}

export interface Messcut {
	id: string
	createdAt: Date
	updatedAt: Date
	date: Date
	cutType: MealType
	userId: string
}

export type ResidentFeesType = {
	rent: number
	wifi: number
	electricity: number
	totalFees: number
}
