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

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  phoneNumber: string;
  password: string;
  gender: Gender;
  mealType: MealType;
  role: UserRole;
  isVeg: boolean;
  hasOnboarded: boolean;
  adminVerified: boolean;
  messcuts: Messcut[];
}

export interface Messcut {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  date: Date;
  cutType: MealType;
  userId: string;
}

export type ResidentFeesType = {
  rent: number;
  wifi: number;
  electricity: number;
  totalFees: number;
};
