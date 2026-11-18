export interface Macronutrients {
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber?: number;  // in grams
}

export interface FoodItemEstimate {
  name: string;
  portion: string;
  calories: number;
  macros: Macronutrients;
}

export interface MealAnalysisResult {
  mealName: string;
  summary: string;
  estimatedCalories: number;
  macros: Macronutrients;
  items: FoodItemEstimate[];
  confidence: "High" | "Medium" | "Low";
  dietaryTags?: string[];
  disclaimer: string;
  analyzedAt: string;
}

export interface SavedMealRecord extends MealAnalysisResult {
  id: string;
  imageUrl?: string; // base64 or blob URL
  savedAt: string;
  userNotes?: string;
}
