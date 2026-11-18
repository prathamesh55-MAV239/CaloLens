import { MealAnalysisResult } from "@/types/meal";
import { MVP_ATTRIBUTION_SOURCES } from "@/lib/dataSources";

export const SAMPLE_MEAL_ANALYSIS: MealAnalysisResult = {
  mealName: "Mediterranean Grilled Chicken & Quinoa Bowl",
  summary: "A balanced bowl featuring herb-grilled chicken breast, fluffy quinoa, cucumber, cherry tomatoes, Kalamata olives, and a light olive oil drizzle.",
  estimatedCalories: 540,
  macros: {
    protein: 42,
    carbs: 48,
    fat: 18,
    fiber: 7,
  },
  items: [
    {
      name: "Grilled Chicken Breast",
      portion: "approx. 160g",
      calories: 260,
      macros: { protein: 36, carbs: 0, fat: 5 },
      usdaRef: {
        fdcId: 171077,
        description: "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
        per100g: {
          calories: 165,
          protein: 31.02,
          fat: 3.57,
          carbs: 0,
          fiber: 0,
        },
        source: "USDA FoodData Central",
        sourceUrl: "https://fdc.nal.usda.gov/food-details/171077/nutrients",
      },
    },
    {
      name: "Cooked Quinoa",
      portion: "approx. 1 cup (185g)",
      calories: 220,
      macros: { protein: 8, carbs: 39, fat: 4, fiber: 5 },
      usdaRef: {
        fdcId: 168917,
        description: "Quinoa, cooked",
        per100g: {
          calories: 120,
          protein: 4.4,
          fat: 1.92,
          carbs: 21.3,
          fiber: 2.8,
        },
        source: "USDA FoodData Central",
        sourceUrl: "https://fdc.nal.usda.gov/food-details/168917/nutrients",
      },
    },
    {
      name: "Mixed Salad (Cucumber, Cherry Tomatoes)",
      portion: "approx. 100g",
      calories: 25,
      macros: { protein: 1, carbs: 5, fat: 0, fiber: 2 },
    },
    {
      name: "Kalamata Olives & Olive Oil dressing",
      portion: "approx. 1 tbsp",
      calories: 35,
      macros: { protein: 0, carbs: 1, fat: 4 },
    },
  ],
  confidence: "High",
  dietaryTags: ["High Protein", "Gluten-Free", "Mediterranean"],
  disclaimer: "Calorie and nutritional values are AI-based visual approximations. Actual values vary based on cooking methods, dressings, and exact portion size. Not medical advice.",
  analyzedAt: new Date().toISOString(),
  dataSources: MVP_ATTRIBUTION_SOURCES,
};
