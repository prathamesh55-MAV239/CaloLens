"use client";

import React, { useState } from "react";
import { MealAnalysisResult } from "@/types/meal";
import { Bookmark, Check, Flame, Info, RotateCcw, Sparkles } from "lucide-react";
import { DisclaimerBanner } from "./DisclaimerBanner";

interface MealNutritionCardProps {
  analysis: MealAnalysisResult;
  imageUrl?: string;
  onSave: () => void;
  onReset: () => void;
  isSaved?: boolean;
}

export function MealNutritionCard({
  analysis,
  imageUrl,
  onSave,
  onReset,
  isSaved = false,
}: MealNutritionCardProps) {
  const [justSaved, setJustSaved] = useState(false);

  const handleSaveClick = () => {
    onSave();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  const { estimatedCalories, macros, items, mealName, summary, confidence } = analysis;

  // Macro calorie math: Protein = 4 kcal/g, Carbs = 4 kcal/g, Fat = 9 kcal/g
  const totalMacroGrams = (macros.protein || 0) + (macros.carbs || 0) + (macros.fat || 0) || 1;
  const proteinPercent = Math.round(((macros.protein || 0) / totalMacroGrams) * 100);
  const carbsPercent = Math.round(((macros.carbs || 0) / totalMacroGrams) * 100);
  const fatPercent = Math.round(((macros.fat || 0) / totalMacroGrams) * 100);

  return (
    <div className="w-full space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {mealName}
            </h2>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                confidence === "High"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : confidence === "Medium"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              <Info className="h-3 w-3" />
              <span>{confidence} Confidence</span>
            </span>
          </div>
          {summary && (
            <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-2xl">
              {summary}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Scan Another</span>
          </button>

          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaved}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition active:scale-95 ${
              isSaved || justSaved
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {isSaved || justSaved ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-700" />
                <span>Saved to History</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                <span>Save Meal</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Estimated Total Calories */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-md shadow-emerald-500/10 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-100 tracking-wide uppercase">
              Est. Calories
            </span>
            <Flame className="h-5 w-5 text-emerald-200" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tight">
              {estimatedCalories}
            </span>
            <span className="text-xs font-medium text-emerald-100">kcal</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-100/90 leading-tight">
            *Visual approximation based on identified portions.
          </p>
        </div>

        {/* Macronutrient Breakdown Cards */}
        <div className="grid grid-cols-3 gap-2.5 md:col-span-3">
          {/* Protein */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <div>
              <span className="text-xs font-semibold text-slate-500">Protein</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{macros.protein}</span>
                <span className="text-xs text-slate-500">g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
              <span className="mt-1 block text-[10px] text-slate-400">{proteinPercent}% of macros</span>
            </div>
          </div>

          {/* Carbs */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <div>
              <span className="text-xs font-semibold text-slate-500">Carbs</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{macros.carbs}</span>
                <span className="text-xs text-slate-500">g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
              <span className="mt-1 block text-[10px] text-slate-400">{carbsPercent}% of macros</span>
            </div>
          </div>

          {/* Fat */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <div>
              <span className="text-xs font-semibold text-slate-500">Fat</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{macros.fat}</span>
                <span className="text-xs text-slate-500">g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-rose-500"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
              <span className="mt-1 block text-[10px] text-slate-400">{fatPercent}% of macros</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Food Components Breakdown */}
      {items && items.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Detected Ingredients & Portion Estimates
          </h3>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/40 overflow-hidden">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 text-xs hover:bg-white transition"
              >
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-[11px] text-slate-500">
                    Est. Portion: {item.portion}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">
                    ~{item.calories} <span className="font-normal text-slate-500 text-[10px]">kcal</span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    P: {item.macros?.protein || 0}g • C: {item.macros?.carbs || 0}g • F: {item.macros?.fat || 0}g
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dietary Tags if present */}
      {analysis.dietaryTags && analysis.dietaryTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-400 font-medium">Tags:</span>
          {analysis.dietaryTags.map((tag, i) => (
            <span
              key={i}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200/60"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <div className="pt-2">
        <DisclaimerBanner compact={false} />
      </div>
    </div>
  );
}
