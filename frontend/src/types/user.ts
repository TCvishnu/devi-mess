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
