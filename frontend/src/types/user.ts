// should type from prisma client
import { MealType } from "@constants/mealTypes";

export interface ProfileDataType {
  fullName: string;
  gender: "MALE" | "FEMALE";
  isVeg: boolean;
  phoneNumber: string;
  mealType: MealType;
}

export interface ResidentialDataType {
  building: "Devi House" | "Rockland Arcade";
  floor: "Top" | "Ground";
}

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  phoneNumber: string;
  password: string;
  gender: "MALE" | "FEMALE";
  mealType: MealType;
  role: "MESS" | "ADMIN" | "RESIDENT";
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
  cutType: "MORNING" | "AFTERNOON" | "NIGHT" | "FULL";
  userId: string;
}
