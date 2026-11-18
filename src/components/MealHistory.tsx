"use client";

import React, { useState } from "react";
import { SavedMealRecord } from "@/types/meal";
import { Trash2, Calendar, Flame, Eye, Sparkles, ChevronRight, X } from "lucide-react";
import { DisclaimerBanner } from "./DisclaimerBanner";

interface MealHistoryProps {
  meals: SavedMealRecord[];
  onDeleteMeal: (id: string) => void;
  onClearAll: () => void;
  onNavigateToScan: () => void;
}

export function MealHistory({
  meals,
  onDeleteMeal,
  onClearAll,
  onNavigateToScan,
}: MealHistoryProps) {
  const [selectedMeal, setSelectedMeal] = useState<SavedMealRecord | null>(null);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  if (meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Calendar className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No Meals Saved Yet</h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
          Snap a photo of your breakfast, lunch, or dinner to get your first estimated nutrition breakdown and save it here.
        </p>
        <button
          type="button"
          onClick={onNavigateToScan}
          className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
        >
          <Sparkles className="h-4 w-4" />
          <span>Scan Your First Meal</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Meal History
          </h2>
          <p className="text-xs text-slate-500">
            {meals.length} {meals.length === 1 ? "meal logged" : "meals logged"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm("Are you sure you want to clear your entire meal history?")) {
              onClearAll();
            }
          }}
          className="text-xs font-medium text-rose-600 hover:text-rose-700 transition"
        >
          Clear All
        </button>
      </div>

      <DisclaimerBanner compact={true} />

      {/* Meals List */}
      <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="flex items-center justify-between p-4 hover:bg-slate-50/70 transition"
          >
            {/* Left Info */}
            <div className="flex items-center gap-3.5 min-w-0">
              {meal.imageUrl ? (
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={meal.imageUrl}
                    alt={meal.mealName}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Flame className="h-6 w-6" />
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {meal.mealName}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{formatDate(meal.savedAt)}</span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-700">
                    ~{meal.estimatedCalories} kcal
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                  <span>P: {meal.macros.protein}g</span>
                  <span>C: {meal.macros.carbs}g</span>
                  <span>F: {meal.macros.fat}g</span>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <button
                type="button"
                onClick={() => setSelectedMeal(meal)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                title="View breakdown"
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Details</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteMeal(meal.id)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                title="Delete meal"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setSelectedMeal(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 pr-8">
              {selectedMeal.mealName}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Saved on {formatDate(selectedMeal.savedAt)}
            </p>

            {selectedMeal.imageUrl && (
              <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedMeal.imageUrl}
                  alt={selectedMeal.mealName}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Calories & Macros */}
            <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200/80">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-slate-500">Estimated Total Energy</span>
                <span className="text-xl font-extrabold text-emerald-600">
                  {selectedMeal.estimatedCalories} <span className="text-xs font-normal text-slate-500">kcal</span>
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-white p-2 border border-slate-200/60">
                  <span className="text-slate-400 text-[10px] block">Protein</span>
                  <span className="font-bold text-slate-800">{selectedMeal.macros.protein}g</span>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-200/60">
                  <span className="text-slate-400 text-[10px] block">Carbs</span>
                  <span className="font-bold text-slate-800">{selectedMeal.macros.carbs}g</span>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-200/60">
                  <span className="text-slate-400 text-[10px] block">Fat</span>
                  <span className="font-bold text-slate-800">{selectedMeal.macros.fat}g</span>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            {selectedMeal.items && selectedMeal.items.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Items & Portions
                </h4>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-white">
                  {selectedMeal.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between p-2.5 text-xs">
                      <div>
                        <span className="font-medium text-slate-800">{it.name}</span>
                        <span className="block text-[11px] text-slate-400">{it.portion}</span>
                      </div>
                      <span className="font-semibold text-slate-700">~{it.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <DisclaimerBanner compact={true} />
            </div>

            <button
              onClick={() => setSelectedMeal(null)}
              className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
