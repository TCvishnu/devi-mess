import { MealType } from "@constants/mealTypes";

export type Gender = "MALE" | "FEMALE";
export type UserRole = "ADMIN" | "RESIDENT" | "MESS";

export type ProfileDataType = {
  fullName: string;
  gender: Gender;
  isVeg: boolean;
  phoneNumber: string;
  mealType: MealType;
};

export type ResidentialDataType = {
  building: "Devi House" | "Rockland Arcade";
  floor: "Top" | "Ground";
};

export type ResidentFeesType = {
  rent: number;
  wifi: number;
  electricity: number;
  totalFees: number;
};
