"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ImageUploader } from "@/components/ImageUploader";
import { MealNutritionCard } from "@/components/MealNutritionCard";
import { MealHistory } from "@/components/MealHistory";
import { DailyGoalTracker } from "@/components/DailyGoalTracker";
import {
  MealAnalysisResult,
  SavedMealRecord,
  DailyNutritionGoal,
  MealType,
  FoodItemEstimate,
  Macronutrients,
} from "@/types/meal";
import { SAMPLE_MEAL_ANALYSIS } from "@/lib/mockData";
import {
  getSavedMeals,
  saveMeal,
  deleteMeal,
  clearAllMeals,
  updateMeal,
  getDailyGoal,
  saveDailyGoal,
  getTodayStats,
} from "@/lib/storage";
import { AlertTriangle, Sparkles, Camera, History, ShieldCheck, Flame } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"scan" | "history">("scan");
  const [currentAnalysis, setCurrentAnalysis] = useState<MealAnalysisResult | null>(null);
  const [currentImagePreview, setCurrentImagePreview] = useState<string | null>(null);
  const [savedMeals, setSavedMeals] = useState<SavedMealRecord[]>([]);
  const [dailyGoal, setDailyGoal] = useState<DailyNutritionGoal>({
    targetCalories: 2000,
    targetProtein: 140,
    targetCarbs: 220,
    targetFat: 65,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavedCurrent, setIsSavedCurrent] = useState<boolean>(false);

  // Load saved meals and goal from local storage on mount
  useEffect(() => {
    setSavedMeals(getSavedMeals());
    setDailyGoal(getDailyGoal());
  }, []);

  const todayStats = getTodayStats(savedMeals);

  const handleUpdateGoal = (newGoal: DailyNutritionGoal) => {
    saveDailyGoal(newGoal);
    setDailyGoal(newGoal);
  };

  const handleAnalyze = async (
    imageData: { base64: string; mimeType: string },
    useMock: boolean
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsSavedCurrent(false);

    if (useMock) {
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

  const handleSaveMeal = (editedData: {
    mealName: string;
    mealType: MealType;
    estimatedCalories: number;
    macros: Macronutrients;
    items: FoodItemEstimate[];
    userNotes?: string;
  }) => {
    if (!currentAnalysis) return;

    const newRecord: SavedMealRecord = {
      ...currentAnalysis,
      mealName: editedData.mealName,
      mealType: editedData.mealType,
      estimatedCalories: editedData.estimatedCalories,
      macros: editedData.macros,
      items: editedData.items,
      userNotes: editedData.userNotes,
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

  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = updateMeal(id, { userNotes: notes });
    setSavedMeals(updated);
  };

  const handleResetScan = () => {
    setCurrentAnalysis(null);
    setCurrentImagePreview(null);
    setErrorMessage(null);
    setIsSavedCurrent(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8EC] text-[#65230F] pb-16 sm:pb-0">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedMeals.length}
      />

      {/* Hero Header Banner (Desktop + Tablet) */}
      <section className="relative overflow-hidden border-b border-[#FFE1AC]/70 bg-gradient-to-b from-[#FFF3DF] to-[#FFF8EC] py-6 sm:py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE1AC] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#8D240D] border border-[#F9A83B]/30 shadow-warm-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#FF990F]" />
                <span>Next-Gen Visual Nutrition</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#8D240D] leading-none">
                Smart Food &amp; Calorie <span className="text-[#FF990F]">Estimator</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#65230F] max-w-xl font-medium leading-relaxed">
                Take a photo of your meal to instantly estimate portion sizes, calories, and macronutrient breakdowns. Edit and personalize your logs with one tap.
              </p>
            </div>

            {/* Quick Stats Pill (Desktop) */}
            <div className="hidden lg:flex items-center gap-3 rounded-3xl bg-[#FFF8EC] p-3 border border-[#FFE1AC] shadow-warm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF990F] to-[#FFA82F] text-white shadow-sm">
                <Flame className="h-6 w-6" />
              </div>
              <div className="pr-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E513F] block">
                  Today Logged
                </span>
                <span className="font-display text-2xl font-black text-[#8D240D]">
                  {todayStats.totalCalories}{" "}
                  <span className="font-sans text-xs font-semibold text-[#8E513F]">kcal</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 space-y-6">
        {/* Daily Goal Progress Card */}
        <DailyGoalTracker
          goal={dailyGoal}
          todayCalories={todayStats.totalCalories}
          todayProtein={todayStats.totalProtein}
          todayCarbs={todayStats.totalCarbs}
          todayFat={todayStats.totalFat}
          onUpdateGoal={handleUpdateGoal}
        />

        {/* Error Notification */}
        {errorMessage && (
          <div className="flex items-start gap-3 rounded-3xl border-2 border-[#B30D08]/30 bg-[#FFF3DF] p-4 text-[#8D240D] shadow-warm">
            <AlertTriangle className="h-5 w-5 shrink-0 text-[#B30D08] mt-0.5" />
            <div className="text-xs">
              <p className="font-bold uppercase tracking-wider text-[#B30D08]">Analysis Note</p>
              <p className="mt-0.5 leading-relaxed font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Tab View Transition */}
        {activeTab === "scan" ? (
          <div className="space-y-6">
            {!currentAnalysis ? (
              <ImageUploader onAnalyze={handleAnalyze} isLoading={isLoading} />
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
            onUpdateNotes={handleUpdateNotes}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Phone Viewport) */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden border-t border-[#FFE1AC] bg-[#FFF8EC]/95 backdrop-blur-md px-6 py-2.5 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setActiveTab("scan")}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition ${
            activeTab === "scan" ? "text-[#B30D08]" : "text-[#8E513F]"
          }`}
        >
          <Camera className="h-5 w-5" />
          <span>Scan</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`relative flex flex-col items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition ${
            activeTab === "history" ? "text-[#B30D08]" : "text-[#8E513F]"
          }`}
        >
          <History className="h-5 w-5" />
          <span>History</span>
          {savedMeals.length > 0 && (
            <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#B30D08] text-[9px] font-black text-white">
              {savedMeals.length}
            </span>
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#FFE1AC]/80 bg-[#FFF3DF] py-8 text-center text-xs text-[#8E513F]">
        <div className="mx-auto max-w-5xl px-4 space-y-2">
          <p className="font-display text-base font-black uppercase tracking-tight text-[#8D240D]">
            Calo<span className="text-[#FF990F]">Lens</span>
          </p>
          <p className="max-w-md mx-auto text-[11px] leading-relaxed">
            Visual estimation system for dietary tracking. All figures are AI-based approximations and not clinical or medical advice.
          </p>
          <p className="text-[10px] text-[#8E513F]/70 pt-1">
            © 2026 CaloLens. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
