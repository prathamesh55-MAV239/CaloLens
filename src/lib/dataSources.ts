import { DataSourceAttribution } from "@/types/meal";

/**
 * Data sources and models registry for CaloLens.
 * Mirrors SOURCES.md — the single source of truth for licensing decisions.
 *
 * Only sources marked "active" are used in the production MVP.
 * Sources marked "evaluation" or "hold" are listed for transparency
 * and future roadmap planning.
 */

// ─── Active Sources (used in MVP) ───────────────────────────────────────────

export const ACTIVE_SOURCES: DataSourceAttribution[] = [
  {
    name: "Google Gemini Vision (gemini-1.5-flash)",
    url: "https://ai.google.dev/gemini-api/docs",
    role: "Primary AI model for food recognition, portion estimation, and nutritional breakdown from meal photos",
    status: "active",
  },
  {
    name: "USDA FoodData Central",
    url: "https://fdc.nal.usda.gov/api-guide.html",
    role: "Government nutrition reference database for cross-referencing calorie and macronutrient estimates (per 100g values)",
    status: "active",
  },
];

// ─── Evaluation Sources (not yet in production) ─────────────────────────────

export const EVALUATION_SOURCES: DataSourceAttribution[] = [
  {
    name: "Open Food Facts (Nutrient Detection Layout)",
    url: "https://huggingface.co/datasets/openfoodfacts/nutrient-detection-layout",
    role: "OCR/layout experiments for packaged food label reading",
    status: "evaluation",
  },
  {
    name: "Food-101",
    url: "https://huggingface.co/datasets/food101",
    role: "Dish recognition baseline dataset (101 food categories)",
    status: "evaluation",
  },
  {
    name: "UECFood-256",
    url: "http://foodcam.mobi/dataset256.html",
    role: "Japanese dish recognition benchmark (256 food categories)",
    status: "evaluation",
  },
  {
    name: "Nutrition5k",
    url: "https://github.com/google-research/food-dataset-tools/tree/main/nutrition5k",
    role: "Calorie and macronutrient estimation benchmark dataset",
    status: "evaluation",
  },
  {
    name: "January/food-vision-v1",
    url: "https://huggingface.co/january/food-vision-v1",
    role: "Baseline food vision model for benchmarking",
    status: "evaluation",
  },
  {
    name: "January Food Benchmark",
    url: "https://arxiv.org/abs/2508.09966",
    role: "Academic model benchmark for food recognition accuracy",
    status: "evaluation",
  },
];

// ─── Hold Sources (pending legal review) ────────────────────────────────────

export const HOLD_SOURCES: DataSourceAttribution[] = [
  {
    name: "mmathys/food-nutrients",
    url: "https://huggingface.co/datasets/mmathys/food-nutrients",
    role: "Plate nutrition experiments (license unclear)",
    status: "hold",
  },
  {
    name: "AI4Food-NutritionDB",
    url: "https://github.com/BiDAlab/AI4Food-NutritionDB",
    role: "Research reference for nutrition database research",
    status: "hold",
  },
  {
    name: "OmniFood8K",
    url: "https://arxiv.org/abs/2604.12356",
    role: "Future benchmark dataset (license pending)",
    status: "hold",
  },
  {
    name: "FooDD",
    url: "https://ieee-dataport.org/open-access/foodd-food-detection-dataset-calorie-measurement-using-food-images",
    role: "Detection and calorie measurement benchmark",
    status: "hold",
  },
];

/** All registered sources in the CaloLens pipeline */
export const ALL_SOURCES: DataSourceAttribution[] = [
  ...ACTIVE_SOURCES,
  ...EVALUATION_SOURCES,
  ...HOLD_SOURCES,
];

/** Sources to display as attributions in the UI (active only) */
export const MVP_ATTRIBUTION_SOURCES = ACTIVE_SOURCES;
