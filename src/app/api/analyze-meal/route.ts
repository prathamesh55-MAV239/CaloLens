import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MealAnalysisResult } from "@/types/meal";
import { lookupUSDAReferences } from "@/lib/usda";
import { MVP_ATTRIBUTION_SOURCES } from "@/lib/dataSources";

export const runtime = "nodejs";

const PROMPT_INSTRUCTIONS = `
You are an expert culinary and nutritional estimation assistant for CaloLens.
Analyze the provided image of a meal or food plate and provide an estimated nutritional breakdown.

Your estimates should be grounded in standard nutritional reference data such as the
USDA FoodData Central database (https://fdc.nal.usda.gov). Use realistic per-100g values
from standard food composition tables when estimating calorie and macronutrient content,
and scale by your best estimate of the visible portion size.

Rules:
1. If the image DOES NOT show food or a beverage, return:
{
  "isFood": false,
  "error": "No food or meal was clearly detected in this image. Please provide a clear photo of your plate or dish."
}

2. If the image DOES show food, carefully estimate:
- mealName: clear name of the dish/meal.
- summary: 1-2 sentence description of what you observe (ingredients, cooking method).
- estimatedCalories: realistic integer total kcal estimate based on visible portion sizes.
- macros: { protein: number (g), carbs: number (g), fat: number (g), fiber: number (g) }
- items: array of detected items, each with { name: string, portion: string (e.g. 'approx. 150g' or '1 cup'), calories: number, macros: { protein: number, carbs: number, fat: number } }
- confidence: "High" | "Medium" | "Low"
- mealType: suggest "Breakfast", "Lunch", "Dinner", or "Snack" based on typical meal composition
- dietaryTags: array of relevant tags like ["High Protein", "Vegetarian", "Keto", etc.]
- disclaimer: "Calorie and nutritional values are AI-based visual approximations. Actual values vary based on cooking methods, dressings, and exact portion size. Not medical advice."

Output strictly valid JSON only. Do not wrap in markdown or backticks.
`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not configured on the server. Please add your key to .env.local or your hosting environment variables.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { image, mimeType } = body;

    if (!image) {
      return NextResponse.json(
        { error: "Image data is required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for fast, accurate multimodal vision
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const imagePart = {
      inlineData: {
        data: image,
        mimeType: mimeType || "image/jpeg",
      },
    };

    const result = await model.generateContent([PROMPT_INSTRUCTIONS, imagePart]);
    const responseText = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Fallback cleanup if response includes markdown code fences
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    if (parsed.isFood === false) {
      return NextResponse.json(
        { error: parsed.error || "No food detected in image." },
        { status: 422 }
      );
    }

    // Parse the Gemini response into typed items
    const items = Array.isArray(parsed.items)
      ? parsed.items.map((it: any) => ({
          name: it.name || "Item",
          portion: it.portion || "Standard serving",
          calories: Number(it.calories) || 0,
          macros: {
            protein: Number(it.macros?.protein) || 0,
            carbs: Number(it.macros?.carbs) || 0,
            fat: Number(it.macros?.fat) || 0,
          },
        }))
      : [];

    // ── USDA FoodData Central cross-reference (approved source) ──────────
    // If a USDA API key is configured, look up each detected food item
    // to attach reference nutrition data (per 100g) from the USDA database.
    const usdaApiKey = process.env.USDA_API_KEY;
    if (usdaApiKey && items.length > 0) {
      try {
        const foodNames = items.map((it: any) => it.name);
        const usdaRefs = await lookupUSDAReferences(foodNames, usdaApiKey);

        for (const item of items) {
          const ref = usdaRefs.get(item.name);
          if (ref) {
            item.usdaRef = ref;
          }
        }
      } catch (usdaError) {
        // USDA lookup is best-effort; don't fail the whole analysis
        console.warn("USDA reference lookup failed:", usdaError);
      }
    }

    const analysisResult: MealAnalysisResult = {
      mealName: parsed.mealName || "Estimated Meal",
      summary: parsed.summary || "",
      estimatedCalories: Number(parsed.estimatedCalories) || 0,
      macros: {
        protein: Number(parsed.macros?.protein) || 0,
        carbs: Number(parsed.macros?.carbs) || 0,
        fat: Number(parsed.macros?.fat) || 0,
        fiber: Number(parsed.macros?.fiber) || 0,
      },
      items,
      confidence: (parsed.confidence as "High" | "Medium" | "Low") || "Medium",
      mealType: ["Breakfast", "Lunch", "Dinner", "Snack"].includes(parsed.mealType)
        ? parsed.mealType
        : undefined,
      dietaryTags: parsed.dietaryTags || [],
      disclaimer:
        parsed.disclaimer ||
        "Calorie and nutritional values are AI-based visual approximations. Actual values vary based on cooking methods, dressings, and exact portion size. Not medical advice.",
      analyzedAt: new Date().toISOString(),
      dataSources: MVP_ATTRIBUTION_SOURCES,
    };

    return NextResponse.json(analysisResult);
  } catch (error: any) {
    console.error("Meal analysis error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to analyze meal image. Please try again.",
      },
      { status: 500 }
    );
  }
}
