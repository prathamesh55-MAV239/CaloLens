import { SavedMealRecord } from "@/types/meal";

const STORAGE_KEY = "calolens_saved_meals_v1";

export function getSavedMeals(): SavedMealRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load meals from localStorage:", err);
    return [];
  }
}

export function saveMeal(meal: SavedMealRecord): SavedMealRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getSavedMeals();
    // Prepend new meal so newest is first
    const updated = [meal, ...existing.filter((m) => m.id !== meal.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to save meal to localStorage:", err);
    return [];
  }
}

export function deleteMeal(id: string): SavedMealRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getSavedMeals();
    const updated = existing.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to delete meal from localStorage:", err);
    return [];
  }
}

export function clearAllMeals(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear meals:", err);
  }
}
