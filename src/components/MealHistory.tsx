"use client";

import React, { useState } from "react";
import { SavedMealRecord, MealType } from "@/types/meal";
import {
  Trash2,
  Calendar,
  Flame,
  Eye,
  Sparkles,
  X,
  Clock,
  Filter,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { DisclaimerBanner } from "./DisclaimerBanner";

interface MealHistoryProps {
  meals: SavedMealRecord[];
  onDeleteMeal: (id: string) => void;
  onClearAll: () => void;
  onNavigateToScan: () => void;
  onUpdateNotes?: (id: string, notes: string) => void;
}

export function MealHistory({
  meals,
  onDeleteMeal,
  onClearAll,
  onNavigateToScan,
  onUpdateNotes,
}: MealHistoryProps) {
  const [selectedMeal, setSelectedMeal] = useState<SavedMealRecord | null>(null);
  const [filterType, setFilterType] = useState<"All" | MealType>("All");
  const [editingNotes, setEditingNotes] = useState(false);
  const [noteText, setNoteText] = useState("");

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const getDateGroupKey = (isoString: string): string => {
    const d = new Date(isoString);
    const now = new Date();
    const isToday =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getFullYear() === yesterday.getFullYear() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getDate() === yesterday.getDate();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMealTypeBadgeColor = (type?: MealType) => {
    switch (type) {
      case "Breakfast":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Lunch":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Dinner":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Snack":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const filteredMeals =
    filterType === "All"
      ? meals
      : meals.filter((m) => m.mealType === filterType);

  // Group meals by date
  const groupedMeals: { [key: string]: SavedMealRecord[] } = {};
  filteredMeals.forEach((meal) => {
    const key = getDateGroupKey(meal.savedAt);
    if (!groupedMeals[key]) groupedMeals[key] = [];
    groupedMeals[key].push(meal);
  });

  const handleOpenModal = (meal: SavedMealRecord) => {
    setSelectedMeal(meal);
    setNoteText(meal.userNotes || "");
    setEditingNotes(false);
  };

  const handleSaveModalNotes = () => {
    if (selectedMeal && onUpdateNotes) {
      onUpdateNotes(selectedMeal.id, noteText);
      setSelectedMeal({ ...selectedMeal, userNotes: noteText });
    }
    setEditingNotes(false);
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

  const mealFilterOptions: ("All" | MealType)[] = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
  ];

  return (
    <div className="space-y-4">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Meal History
          </h2>
          <p className="text-xs text-slate-500">
            {meals.length} {meals.length === 1 ? "meal logged" : "meals logged"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Meal Type Filter */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/60 text-xs">
            {mealFilterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilterType(opt)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  filterType === opt
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to clear your entire meal history?")) {
                onClearAll();
              }
            }}
            className="text-xs font-medium text-rose-600 hover:text-rose-700 transition px-2 py-1"
          >
            Clear All
          </button>
        </div>
      </div>

      <DisclaimerBanner compact={true} />

      {/* Date Grouped Meals */}
      <div className="space-y-5">
        {Object.entries(groupedMeals).map(([dateLabel, groupMeals]) => {
          const groupTotalCalories = groupMeals.reduce(
            (acc, m) => acc + (m.estimatedCalories || 0),
            0
          );

          return (
            <div key={dateLabel} className="space-y-2">
              {/* Date Header with Cumulative Calories */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-700 tracking-wide">
                  {dateLabel}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Total: <strong className="text-slate-800">{groupTotalCalories}</strong> kcal
                </span>
              </div>

              {/* Meals in this date group */}
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {groupMeals.map((meal) => (
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
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {meal.mealName}
                          </p>
                          <span
                            className={`rounded-full px-2 py-0.2 text-[10px] font-semibold border ${getMealTypeBadgeColor(
                              meal.mealType
                            )}`}
                          >
                            {meal.mealType}
                          </span>
                        </div>

                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {formatTime(meal.savedAt)}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-700">
                            ~{meal.estimatedCalories} kcal
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                          <span>P: {meal.macros.protein}g</span>
                          <span>C: {meal.macros.carbs}g</span>
                          <span>F: {meal.macros.fat}g</span>
                          {meal.userNotes && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[150px] italic text-slate-500">
                                &quot;{meal.userNotes}&quot;
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(meal)}
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
            </div>
          );
        })}
      </div>

      {/* Details & Notes Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setSelectedMeal(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 pr-8">
                {selectedMeal.mealName}
              </h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${getMealTypeBadgeColor(
                  selectedMeal.mealType
                )}`}
              >
                {selectedMeal.mealType}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Saved on {new Date(selectedMeal.savedAt).toLocaleString()}
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
                <span className="text-xs font-semibold text-slate-500">
                  Estimated Total Energy
                </span>
                <span className="text-xl font-extrabold text-emerald-600">
                  {selectedMeal.estimatedCalories}{" "}
                  <span className="text-xs font-normal text-slate-500">kcal</span>
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-white p-2 border border-slate-200/60">
                  <span className="text-slate-400 text-[10px] block">Protein</span>
                  <span className="font-bold text-slate-800">
                    {selectedMeal.macros.protein}g
                  </span>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-200/60">
                  <span className="text-slate-400 text-[10px] block">Carbs</span>
                  <span className="font-bold text-slate-800">
                    {selectedMeal.macros.carbs}g
                  </span>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-200/60">
                  <span className="text-slate-400 text-[10px] block">Fat</span>
                  <span className="font-bold text-slate-800">
                    {selectedMeal.macros.fat}g
                  </span>
                </div>
              </div>
            </div>

            {/* Ingredients & USDA references */}
            {selectedMeal.items && selectedMeal.items.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Items &amp; Portions
                </h4>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-white">
                  {selectedMeal.items.map((it, idx) => (
                    <div key={idx} className="p-2.5 text-xs">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-medium text-slate-800">{it.name}</span>
                          <span className="block text-[11px] text-slate-400">
                            {it.portion}
                          </span>
                        </div>
                        <span className="font-semibold text-slate-700">
                          ~{it.calories} kcal
                        </span>
                      </div>

                      {it.usdaRef && (
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-blue-600 bg-blue-50/60 p-1.5 rounded">
                          <span>
                            USDA: {it.usdaRef.description} ({it.usdaRef.per100g.calories ?? "–"} kcal/100g)
                          </span>
                          <a
                            href={it.usdaRef.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Section */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                  Personal Notes
                </span>
                {!editingNotes && onUpdateNotes && (
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="text-emerald-600 font-medium hover:underline text-[11px]"
                  >
                    Edit Note
                  </button>
                )}
              </div>

              {editingNotes ? (
                <div className="space-y-2 mt-1">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full rounded border border-slate-300 p-1.5 bg-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Add personal notes..."
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => setEditingNotes(false)}
                      className="px-2 py-0.5 rounded text-slate-500 hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveModalNotes}
                      className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-medium hover:bg-emerald-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-600 italic">
                  {selectedMeal.userNotes || "No notes added for this meal."}
                </p>
              )}
            </div>

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
