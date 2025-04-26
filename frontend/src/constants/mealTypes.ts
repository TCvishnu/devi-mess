export type MealType = "Morning" | "Afternoon" | "Evening" | "Full";

export const mealTypes: { mealType: MealType; icon: string }[] = [
  { mealType: "Morning", icon: "fe:sunrise" },
  { mealType: "Afternoon", icon: "charm:sun" },
  { mealType: "Evening", icon: "lets-icons:moon-fill" },
  { mealType: "Full", icon: "flowbite:bowl-food-solid" },
];
