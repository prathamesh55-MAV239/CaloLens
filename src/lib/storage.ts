import { SavedMealRecord, DailyNutritionGoal, MealType } from "@/types/meal";

const MEALS_STORAGE_KEY = "calolens_saved_meals_v1";
const GOAL_STORAGE_KEY = "calolens_daily_goal_v1";

export const DEFAULT_DAILY_GOAL: DailyNutritionGoal = {
  targetCalories: 2000,
  targetProtein: 140,
  targetCarbs: 220,
  targetFat: 65,
};

export function getSavedMeals(): SavedMealRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MEALS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: SavedMealRecord[] = JSON.parse(raw);
    // Backfill mealType if missing from earlier saves
    return parsed.map((m) => ({
      ...m,
      mealType: m.mealType || inferMealType(m.savedAt),
    }));
  } catch (err) {
    console.error("Failed to load meals from localStorage:", err);
    return [];
  }
}

export function saveMeal(meal: SavedMealRecord): SavedMealRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getSavedMeals();
    const updated = [meal, ...existing.filter((m) => m.id !== meal.id)];
    localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to save meal to localStorage:", err);
    return [];
  }
}

export function updateMeal(id: string, updates: Partial<SavedMealRecord>): SavedMealRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getSavedMeals();
    const updated = existing.map((m) => (m.id === id ? { ...m, ...updates } : m));
    localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to update meal in localStorage:", err);
    return [];
  }
}

export function deleteMeal(id: string): SavedMealRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getSavedMeals();
    const updated = existing.filter((m) => m.id !== id);
    localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to delete meal from localStorage:", err);
    return [];
  }
}

export function clearAllMeals(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(MEALS_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear meals:", err);
  }
}

// ── Daily Goal Management ──────────────────────────────────────────────────

export function getDailyGoal(): DailyNutritionGoal {
  if (typeof window === "undefined") return DEFAULT_DAILY_GOAL;
  try {
    const raw = localStorage.getItem(GOAL_STORAGE_KEY);
    if (!raw) return DEFAULT_DAILY_GOAL;
    return { ...DEFAULT_DAILY_GOAL, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_DAILY_GOAL;
  }
}

export function saveDailyGoal(goal: DailyNutritionGoal): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(goal));
  } catch (err) {
    console.error("Failed to save daily goal:", err);
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function isSameDay(dateStrA: string, dateStrB: string): boolean {
  const a = new Date(dateStrA);
  const b = new Date(dateStrB);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function inferMealType(dateStr?: string): MealType {
  const date = dateStr ? new Date(dateStr) : new Date();
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return "Breakfast";
  if (hour >= 11 && hour < 16) return "Lunch";
  if (hour >= 16 && hour < 22) return "Dinner";
  return "Snack";
}

export function getTodayStats(meals: SavedMealRecord[]) {
  const today = new Date().toISOString();
  const todayMeals = meals.filter((m) => isSameDay(m.savedAt, today));

  return {
    todayMeals,
    totalCalories: todayMeals.reduce((acc, m) => acc + (m.estimatedCalories || 0), 0),
    totalProtein: todayMeals.reduce((acc, m) => acc + (m.macros?.protein || 0), 0),
    totalCarbs: todayMeals.reduce((acc, m) => acc + (m.macros?.carbs || 0), 0),
    totalFat: todayMeals.reduce((acc, m) => acc + (m.macros?.fat || 0), 0),
  };
}
