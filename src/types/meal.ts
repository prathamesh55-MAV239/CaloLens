export interface Macronutrients {
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber?: number;  // in grams
}

export interface USDAReference {
  fdcId: number;
  description: string;
  per100g: {
    calories: number | null;
    protein: number | null;
    fat: number | null;
    carbs: number | null;
    fiber: number | null;
  };
  source: string;
  sourceUrl: string;
}

export interface FoodItemEstimate {
  name: string;
  portion: string;
  calories: number;
  macros: Macronutrients;
  usdaRef?: USDAReference;
}

export interface DataSourceAttribution {
  name: string;
  url: string;
  role: string;
  status: "active" | "evaluation" | "hold";
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
  dataSources?: DataSourceAttribution[];
}

export interface SavedMealRecord extends MealAnalysisResult {
  id: string;
  imageUrl?: string; // base64 or blob URL
  savedAt: string;
  userNotes?: string;
}
