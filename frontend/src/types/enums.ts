export enum Gender {
	Male = "MALE",
	Female = "FEMALE",
}

export enum MealType {
	Morning = "MORNING_MEAL",
	Afternoon = "AFTERNOON_MEAL",
	Evening = "EVENING_MEAL",
	Full = "FULL_MEAL",
}

export type RateMealType = Exclude<MealType, MealType.Full>

export enum UserRole {
	Admin = "ADMIN",
	Resident = "RESIDENT",
	Mess = "MESS",
}

export enum Building {
	DEVI_HOUSE = "DEVI_HOUSE",
	ROCKLAND_ARCADE = "ROCKLAND_ARCADE",
}

export enum Floor {
	TOP = "TOP",
	GROUND = "GROUND",
}

export enum BillType {
	RENT = "RENT",
	ELECTRICITY = "ELECTRICITY",
	WIFI = "WIFI",
	MORNING_MEAL = "MORNING_MEAL",
	AFTERNOON_MEAL = "AFTERNOON_MEAL",
	EVENING_MEAL = "EVENING_MEAL",
	FULL_MEAL = "FULL_MEAL",
}

export enum ReportType {
	MESS = "MESS",
	RESIDENT = "RESIDENT",
}
