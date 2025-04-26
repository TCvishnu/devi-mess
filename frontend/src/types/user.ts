// should type from prisma client
import { MealType } from "@constants/mealTypes";

export type ProfileDataType = {
  fullName: string;
  gender: "MALE" | "FEMALE";
  isVeg: boolean;
  phoneNumber: string;
  mealType: MealType;
};

export type ResidentialDataType = {
  building: "Devi House" | "Rockland Arcade";
  floor: "Top" | "Ground";
};
