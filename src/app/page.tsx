"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ImageUploader } from "@/components/ImageUploader";
import { MealNutritionCard } from "@/components/MealNutritionCard";
import { MealHistory } from "@/components/MealHistory";
import { MealAnalysisResult, SavedMealRecord } from "@/types/meal";
import { SAMPLE_MEAL_ANALYSIS } from "@/lib/mockData";
import { getSavedMeals, saveMeal, deleteMeal, clearAllMeals } from "@/lib/storage";
import { AlertTriangle } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"scan" | "history">("scan");
  const [currentAnalysis, setCurrentAnalysis] = useState<MealAnalysisResult | null>(null);
  const [currentImagePreview, setCurrentImagePreview] = useState<string | null>(null);
  const [savedMeals, setSavedMeals] = useState<SavedMealRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavedCurrent, setIsSavedCurrent] = useState<boolean>(false);

  // Load saved meals from local storage on mount
  useEffect(() => {
    setSavedMeals(getSavedMeals());
  }, []);

  const handleAnalyze = async (
    imageData: { base64: string; mimeType: string },
    useMock: boolean
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsSavedCurrent(false);

    if (useMock) {
      // Simulate real latency for responsive feel
      setTimeout(() => {
        setCurrentAnalysis(SAMPLE_MEAL_ANALYSIS);
        setCurrentImagePreview(null);
        setIsLoading(false);
      }, 700);
      return;
    }

    try {
      setCurrentImagePreview(`data:${imageData.mimeType};base64,${imageData.base64}`);

      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageData.base64,
          mimeType: imageData.mimeType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed. Please try again.");
      }

      setCurrentAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || "Failed to analyze meal. Check your internet connection or API key."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMeal = () => {
    if (!currentAnalysis) return;

    const newRecord: SavedMealRecord = {
      ...currentAnalysis,
      id: "meal_" + Date.now(),
      imageUrl: currentImagePreview || undefined,
      savedAt: new Date().toISOString(),
    };

    const updated = saveMeal(newRecord);
    setSavedMeals(updated);
    setIsSavedCurrent(true);
  };

  const handleDeleteMeal = (id: string) => {
    const updated = deleteMeal(id);
    setSavedMeals(updated);
  };

  const handleClearAll = () => {
    clearAllMeals();
    setSavedMeals([]);
  };

  const handleResetScan = () => {
    setCurrentAnalysis(null);
    setCurrentImagePreview(null);
    setErrorMessage(null);
    setIsSavedCurrent(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedMeals.length}
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6">
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-rose-800 shadow-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-rose-900">Analysis Error</p>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {activeTab === "scan" ? (
          <div className="space-y-6">
            {!currentAnalysis ? (
              <div className="space-y-4">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Estimate Your Meal Nutrition
                  </h1>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Snap or upload a photo to identify dishes, estimated portion sizes, and calorie breakdowns.
                  </p>
                </div>

                <ImageUploader onAnalyze={handleAnalyze} isLoading={isLoading} />
              </div>
            ) : (
              <MealNutritionCard
                analysis={currentAnalysis}
                imageUrl={currentImagePreview || undefined}
                onSave={handleSaveMeal}
                onReset={handleResetScan}
                isSaved={isSavedCurrent}
              />
            )}
          </div>
        ) : (
          <MealHistory
            meals={savedMeals}
            onDeleteMeal={handleDeleteMeal}
            onClearAll={handleClearAll}
            onNavigateToScan={() => setActiveTab("scan")}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-5xl px-4">
          <p>
            CaloLens © 2026. Visual estimation tool for dietary tracking. All figures are AI approximations and not medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
