export type MealType = "MORNING" | "AFTERNOON" | "EVENING" | "FULL";

export const mealTypes: { mealType: MealType; icon: string }[] = [
  { mealType: "MORNING", icon: "fe:sunrise" },
  { mealType: "AFTERNOON", icon: "charm:sun" },
  { mealType: "EVENING", icon: "lets-icons:moon-fill" },
  { mealType: "FULL", icon: "flowbite:bowl-food-solid" },
];
