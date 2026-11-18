// USDA FoodData Central API client
// Source: https://fdc.nal.usda.gov/api-guide.html
// Status: Approved as a nutrition provider (see SOURCES.md)

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

export interface USDANutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  value: number;
  unitName: string;
}

export interface USDAFoodItem {
  fdcId: number;
  description: string;
  dataType: string;
  brandName?: string;
  foodCategory?: string;
  nutrients: USDANutrient[];
}

export interface USDASearchResult {
  totalHits: number;
  foods: USDAFoodItem[];
}

// Key USDA nutrient IDs for macros
const NUTRIENT_IDS = {
  ENERGY: 1008,       // Energy (kcal)
  PROTEIN: 1003,      // Protein (g)
  TOTAL_FAT: 1004,    // Total lipid (fat) (g)
  CARBS: 1005,        // Carbohydrate, by difference (g)
  FIBER: 1079,        // Fiber, total dietary (g)
  SUGAR: 2000,        // Sugars, total (g)
  SODIUM: 1093,       // Sodium (mg)
  CHOLESTEROL: 1253,  // Cholesterol (mg)
} as const;

/**
 * Search the USDA FoodData Central database for a food item.
 * Returns nutrition data per 100g serving.
 */
export async function searchUSDAFood(
  query: string,
  apiKey: string,
  pageSize: number = 3
): Promise<USDASearchResult> {
  const url = `${USDA_BASE_URL}/foods/search?api_key=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(query)}&pageSize=${pageSize}&dataType=Foundation,SR Legacy`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`USDA API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  const foods: USDAFoodItem[] = (data.foods || []).map((f: any) => ({
    fdcId: f.fdcId,
    description: f.description,
    dataType: f.dataType,
    brandName: f.brandName || undefined,
    foodCategory: f.foodCategory || undefined,
    nutrients: (f.foodNutrients || []).map((n: any) => ({
      nutrientId: n.nutrientId,
      nutrientName: n.nutrientName,
      nutrientNumber: n.nutrientNumber,
      value: n.value,
      unitName: n.unitName,
    })),
  }));

  return {
    totalHits: data.totalHits || 0,
    foods,
  };
}

/**
 * Extract key macronutrients from a USDA food item (per 100g).
 */
export function extractMacros(food: USDAFoodItem) {
  const get = (id: number) =>
    food.nutrients.find((n) => n.nutrientId === id)?.value ?? null;

  return {
    fdcId: food.fdcId,
    description: food.description,
    per100g: {
      calories: get(NUTRIENT_IDS.ENERGY),
      protein: get(NUTRIENT_IDS.PROTEIN),
      fat: get(NUTRIENT_IDS.TOTAL_FAT),
      carbs: get(NUTRIENT_IDS.CARBS),
      fiber: get(NUTRIENT_IDS.FIBER),
      sugar: get(NUTRIENT_IDS.SUGAR),
      sodium: get(NUTRIENT_IDS.SODIUM),
      cholesterol: get(NUTRIENT_IDS.CHOLESTEROL),
    },
    source: "USDA FoodData Central" as const,
    sourceUrl: `https://fdc.nal.usda.gov/food-details/${food.fdcId}/nutrients`,
  };
}

/**
 * Look up USDA reference data for an array of food names.
 * Returns a map of food name -> USDA reference nutrition (per 100g).
 * Silently returns empty results on failure (graceful degradation).
 */
export async function lookupUSDAReferences(
  foodNames: string[],
  apiKey: string
): Promise<
  Map<
    string,
    {
      fdcId: number;
      description: string;
      per100g: Record<string, number | null>;
      source: string;
      sourceUrl: string;
    }
  >
> {
  const results = new Map();

  if (!apiKey || foodNames.length === 0) return results;

  // Run lookups in parallel with a limit of 5 concurrent
  const promises = foodNames.slice(0, 5).map(async (name) => {
    try {
      const searchResult = await searchUSDAFood(name, apiKey, 1);
      if (searchResult.foods.length > 0) {
        results.set(name, extractMacros(searchResult.foods[0]));
      }
    } catch {
      // Graceful degradation: skip failed lookups
    }
  });

  await Promise.all(promises);
  return results;
}
