import { Building, Floor, Gender, MealType, UserRole } from "@prisma/client"
import * as yup from "yup"

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

export const LoginRequest = yup
	.object()
	.shape({
		phoneNumber: yup
			.string()
			.required("phoneNumber is required")
			.length(10),
		password: yup.string().required("password is required"),
	})
	.stripUnknown()

export const RegisterRequest = yup
	.object()
	.shape({
		name: yup.string().trim().required("name is required"),
		phoneNumber: yup
			.string()
			.required("phoneNumber is required")
			.length(10),
		password: yup.string().required("password is required"),
		gender: yup
			.string()
			.oneOf([Gender.FEMALE, Gender.MALE])
			.required("gender is required"),
		role: yup
			.string()
			.oneOf([UserRole.MESS, UserRole.RESIDENT])
			.required("role is required"),

		mealType: yup
			.string()
			.oneOf([
				MealType.FULL_MEAL,
				MealType.MORNING_MEAL,
				MealType.EVENING_MEAL,
				MealType.AFTERNOON_MEAL,
			])
			.required("mealType is required"),
		isVeg: yup.boolean().required("isVeg is required"),
		residentialData: yup
			.object()
			.shape({
				building: yup
					.string()
					.oneOf([Building.DEVI_HOUSE, Building.ROCKLAND_ARCADE])
					.required(),
				floor: yup.string().oneOf([Floor.GROUND, Floor.TOP]).required(),
			})
			.when("role", {
				is: UserRole.RESIDENT,
				then: (schema) =>
					schema.required("residentialData is required"),
				otherwise: (schema) => schema.strip(),
			}),
		startDate: yup
			.string()
			.required()
			.matches(dateRegex, "startDate must be in 'YYYY-MM-DD' format"),
	})
	.stripUnknown()

export const NotVerifiedListRequest = yup
	.object()
	.shape({
		name: yup.string().optional(),
		page: yup.number().integer().min(1).default(1),
		limit: yup.number().integer().min(10).default(10),
	})
	.stripUnknown()
