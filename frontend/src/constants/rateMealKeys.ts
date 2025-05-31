import { RateMealType, MealType } from "@type/enums";

export const rateMealKeys: RateMealType[] = [
  MealType.Morning,
  MealType.Afternoon,
  MealType.Evening,
];

export const labelRateMealKeys: Record<RateMealType, string> = {
  [MealType.Morning]: "Morning",
  [MealType.Afternoon]: "Afternoon",
  [MealType.Evening]: "Evening",
};
