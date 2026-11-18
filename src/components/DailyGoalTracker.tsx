"use client";

import React, { useState } from "react";
import { DailyNutritionGoal } from "@/types/meal";
import { Target, Flame, Edit3, X, Check, TrendingUp } from "lucide-react";

interface DailyGoalTrackerProps {
  goal: DailyNutritionGoal;
  todayCalories: number;
  todayProtein: number;
  todayCarbs: number;
  todayFat: number;
  onUpdateGoal: (newGoal: DailyNutritionGoal) => void;
}

export function DailyGoalTracker({
  goal,
  todayCalories,
  todayProtein,
  todayCarbs,
  todayFat,
  onUpdateGoal,
}: DailyGoalTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState<DailyNutritionGoal>(goal);

  const calPercent = Math.min(Math.round((todayCalories / (goal.targetCalories || 1)) * 100), 100);
  const remainingCal = (goal.targetCalories || 0) - todayCalories;

  const proteinPercent = Math.min(
    Math.round((todayProtein / (goal.targetProtein || 1)) * 100),
    100
  );
  const carbsPercent = Math.min(
    Math.round((todayCarbs / (goal.targetCarbs || 1)) * 100),
    100
  );
  const fatPercent = Math.min(
    Math.round((todayFat / (goal.targetFat || 1)) * 100),
    100
  );

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoal({
      targetCalories: Number(tempGoal.targetCalories) || 2000,
      targetProtein: Number(tempGoal.targetProtein) || 140,
      targetCarbs: Number(tempGoal.targetCarbs) || 220,
      targetFat: Number(tempGoal.targetFat) || 65,
    });
    setIsEditing(false);
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Today&apos;s Nutrition Goal</h2>
              <p className="text-[11px] text-slate-500">Track daily calorie &amp; macronutrient intake</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setTempGoal(goal);
              setIsEditing(true);
            }}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <Edit3 className="h-3 w-3" />
            <span>Edit Goal</span>
          </button>
        </div>

        {/* Calories Progress Row */}
        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Main Calorie Metric */}
          <div className="sm:col-span-1">
            <div className="flex items-baseline justify-between sm:justify-start sm:gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {todayCalories}
              </span>
              <span className="text-xs text-slate-500">
                / {goal.targetCalories} kcal
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5 text-xs">
              <Flame className="h-3.5 w-3.5 text-emerald-600" />
              {remainingCal >= 0 ? (
                <span className="text-slate-600 font-medium">
                  <strong>{remainingCal}</strong> kcal remaining today
                </span>
              ) : (
                <span className="text-rose-600 font-medium">
                  <strong>{Math.abs(remainingCal)}</strong> kcal over target
                </span>
              )}
            </div>

            <div className="mt-2.5 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  calPercent >= 100 ? "bg-rose-500" : "bg-emerald-500"
                }`}
                style={{ width: `${calPercent}%` }}
              />
            </div>
          </div>

          {/* Macros Progress Bar Grid */}
          <div className="sm:col-span-2 grid grid-cols-3 gap-2 sm:gap-3 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
            {/* Protein */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="font-semibold text-slate-600">Protein</span>
                <span className="text-slate-400">
                  {todayProtein}/{goal.targetProtein}g
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">{proteinPercent}%</span>
            </div>

            {/* Carbs */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="font-semibold text-slate-600">Carbs</span>
                <span className="text-slate-400">
                  {todayCarbs}/{goal.targetCarbs}g
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">{carbsPercent}%</span>
            </div>

            {/* Fat */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="font-semibold text-slate-600">Fat</span>
                <span className="text-slate-400">
                  {todayFat}/{goal.targetFat}g
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">{fatPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Goal Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Set Daily Goals</h3>
                <p className="text-xs text-slate-500">Configure your daily intake targets</p>
              </div>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Daily Calories (kcal)
                </label>
                <input
                  type="number"
                  min="500"
                  max="10000"
                  step="50"
                  value={tempGoal.targetCalories}
                  onChange={(e) =>
                    setTempGoal({ ...tempGoal, targetCalories: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={tempGoal.targetProtein}
                    onChange={(e) =>
                      setTempGoal({ ...tempGoal, targetProtein: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={tempGoal.targetCarbs}
                    onChange={(e) =>
                      setTempGoal({ ...tempGoal, targetCarbs: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={tempGoal.targetFat}
                    onChange={(e) =>
                      setTempGoal({ ...tempGoal, targetFat: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-5 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 rounded-xl border border-slate-300 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 font-semibold text-white hover:bg-emerald-700 transition"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Goal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
