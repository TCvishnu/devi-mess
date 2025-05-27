import { MealType } from "@type/enums";

export const mealTypes: { mealType: MealType; icon: string }[] = [
  { mealType: MealType.Morning, icon: "fe:sunrise" },
  { mealType: MealType.Afternoon, icon: "charm:sun" },
  { mealType: MealType.Evening, icon: "lets-icons:moon-fill" },
  { mealType: MealType.Full, icon: "flowbite:bowl-food-solid" },
];
