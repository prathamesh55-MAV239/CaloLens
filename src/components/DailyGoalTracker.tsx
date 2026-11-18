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
      <div className="rounded-3xl border border-[#FFE1AC] bg-[#FFF3DF] p-5 sm:p-6 shadow-warm">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#FFE1AC]/70 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFE1AC] text-[#8D240D] shadow-sm">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-[#8D240D]">
                Today&apos;s Nutrition Goal
              </h2>
              <p className="text-xs text-[#8E513F] font-medium">Daily calorie intake &amp; macronutrient targets</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setTempGoal(goal);
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 rounded-full border border-[#FFE1AC] bg-[#FFF8EC] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8D240D] hover:bg-[#FFE1AC]/50 transition shadow-warm-sm"
          >
            <Edit3 className="h-3.5 w-3.5 text-[#FF990F]" />
            <span>Edit Goal</span>
          </button>
        </div>

        {/* Calories Progress Row */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
          {/* Main Calorie Metric */}
          <div className="sm:col-span-1">
            <div className="flex items-baseline justify-between sm:justify-start sm:gap-2">
              <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-[#8D240D]">
                {todayCalories}
              </span>
              <span className="text-xs font-bold text-[#8E513F] uppercase tracking-wide">
                / {goal.targetCalories} kcal
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5 text-xs">
              <Flame className="h-4 w-4 text-[#FF990F] shrink-0" />
              {remainingCal >= 0 ? (
                <span className="text-[#65230F] font-medium">
                  <strong className="font-bold text-[#8D240D]">{remainingCal}</strong> kcal left today
                </span>
              ) : (
                <span className="text-[#B30D08] font-bold">
                  +{Math.abs(remainingCal)} kcal over target
                </span>
              )}
            </div>

            <div className="mt-3 h-2.5 w-full rounded-full bg-[#FFE1AC]/70 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  calPercent >= 100
                    ? "bg-[#B30D08]"
                    : "bg-gradient-to-r from-[#FF990F] to-[#FFA82F]"
                }`}
                style={{ width: `${calPercent}%` }}
              />
            </div>
          </div>

          {/* Macros Progress Bar Grid */}
          <div className="sm:col-span-2 grid grid-cols-3 gap-2.5 sm:gap-3.5 border-t sm:border-t-0 sm:border-l border-[#FFE1AC]/80 pt-3 sm:pt-0 sm:pl-5">
            {/* Protein */}
            <div className="rounded-2xl bg-[#FFF8EC] p-3 border border-[#FFE1AC]/60 shadow-warm-sm space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-display font-bold uppercase tracking-wide text-[#8D240D]">Protein</span>
                <span className="text-[11px] font-semibold text-[#8E513F]">
                  {todayProtein}/{goal.targetProtein}g
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#FFE1AC]/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#B30D08] transition-all duration-500"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-[#8D240D] block">{proteinPercent}% of goal</span>
            </div>

            {/* Carbs */}
            <div className="rounded-2xl bg-[#FFF8EC] p-3 border border-[#FFE1AC]/60 shadow-warm-sm space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-display font-bold uppercase tracking-wide text-[#8D240D]">Carbs</span>
                <span className="text-[11px] font-semibold text-[#8E513F]">
                  {todayCarbs}/{goal.targetCarbs}g
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#FFE1AC]/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#FF990F] transition-all duration-500"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-[#FF990F] block">{carbsPercent}% of goal</span>
            </div>

            {/* Fat */}
            <div className="rounded-2xl bg-[#FFF8EC] p-3 border border-[#FFE1AC]/60 shadow-warm-sm space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-display font-bold uppercase tracking-wide text-[#8D240D]">Fat</span>
                <span className="text-[11px] font-semibold text-[#8E513F]">
                  {todayFat}/{goal.targetFat}g
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#FFE1AC]/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#FFC84B] transition-all duration-500"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-[#8D240D] block">{fatPercent}% of goal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Goal Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#8D240D]/30 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#FFF8EC] border-2 border-[#FFE1AC] p-6 shadow-2xl">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-[#8E513F] hover:bg-[#FFE1AC]/60 hover:text-[#8D240D] transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="rounded-2xl bg-[#FFE1AC] p-2.5 text-[#8D240D]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-black uppercase tracking-tight text-[#8D240D]">
                  Set Daily Nutrition Goals
                </h3>
                <p className="text-xs text-[#8E513F]">Configure your daily calorie &amp; macro targets</p>
              </div>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#8D240D] uppercase tracking-wider block mb-1">
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
                  className="w-full rounded-xl border border-[#FFE1AC] bg-[#FFF3DF] p-2.5 text-sm font-bold text-[#8D240D] focus:border-[#FF990F] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-[#8D240D] uppercase tracking-wider block mb-1">
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
                    className="w-full rounded-xl border border-[#FFE1AC] bg-[#FFF3DF] p-2 text-xs font-bold text-[#8D240D] focus:border-[#FF990F] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8D240D] uppercase tracking-wider block mb-1">
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
                    className="w-full rounded-xl border border-[#FFE1AC] bg-[#FFF3DF] p-2 text-xs font-bold text-[#8D240D] focus:border-[#FF990F] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8D240D] uppercase tracking-wider block mb-1">
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
                    className="w-full rounded-xl border border-[#FFE1AC] bg-[#FFF3DF] p-2 text-xs font-bold text-[#8D240D] focus:border-[#FF990F] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-5 flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 rounded-full border border-[#FFE1AC] bg-[#FFF3DF] py-2.5 font-bold uppercase tracking-wider text-[#8D240D] hover:bg-[#FFE1AC] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-[#B30D08] py-2.5 font-bold uppercase tracking-wider text-white shadow-md shadow-[#B30D08]/30 hover:bg-[#8D240D] transition"
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
