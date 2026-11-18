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

  const getMealTypeBadgeStyle = (type?: MealType) => {
    switch (type) {
      case "Breakfast":
        return "bg-[#FFC84B]/20 text-[#8D240D] border-[#FFC84B]";
      case "Lunch":
        return "bg-[#FFA82F]/20 text-[#8D240D] border-[#FFA82F]";
      case "Dinner":
        return "bg-[#8D240D]/10 text-[#8D240D] border-[#8D240D]/30";
      case "Snack":
        return "bg-[#FFE1AC] text-[#8D240D] border-[#F9A83B]";
      default:
        return "bg-[#FFF3DF] text-[#8D240D] border-[#FFE1AC]";
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
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#FFE1AC] bg-[#FFF3DF] p-12 text-center shadow-warm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFE1AC] text-[#8D240D] shadow-sm">
          <Calendar className="h-8 w-8 text-[#FF990F]" />
        </div>
        <h3 className="font-display text-2xl font-black uppercase tracking-tight text-[#8D240D]">
          No Meals Saved Yet
        </h3>
        <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-[#65230F] leading-relaxed">
          Snap a photo of your breakfast, lunch, or dinner to get your first estimated nutrition breakdown and view it in your history log.
        </p>
        <button
          type="button"
          onClick={onNavigateToScan}
          className="mt-6 flex items-center gap-2 rounded-full bg-[#B30D08] px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-[#B30D08]/30 hover:bg-[#8D240D] transition active:scale-95"
        >
          <Sparkles className="h-4 w-4 text-[#FFC84B]" />
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
    <div className="space-y-5">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#8D240D]">
            Meal History Log
          </h2>
          <p className="text-xs font-semibold text-[#8E513F]">
            {meals.length} {meals.length === 1 ? "meal recorded" : "meals recorded"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Meal Type Filter Pill */}
          <div className="flex items-center rounded-full bg-[#FFF3DF] p-1 border border-[#FFE1AC] shadow-warm-sm text-xs">
            {mealFilterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilterType(opt)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition ${
                  filterType === opt
                    ? "bg-[#B30D08] text-white shadow-sm"
                    : "text-[#8E513F] hover:text-[#8D240D]"
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
            className="text-xs font-bold uppercase tracking-wider text-[#B30D08] hover:text-[#8D240D] transition px-2 py-1"
          >
            Clear All
          </button>
        </div>
      </div>

      <DisclaimerBanner compact={true} />

      {/* Date Grouped Meals */}
      <div className="space-y-6">
        {Object.entries(groupedMeals).map(([dateLabel, groupMeals]) => {
          const groupTotalCalories = groupMeals.reduce(
            (acc, m) => acc + (m.estimatedCalories || 0),
            0
          );

          return (
            <div key={dateLabel} className="space-y-2.5">
              {/* Date Header with Cumulative Calories */}
              <div className="flex items-center justify-between px-1">
                <span className="font-display text-base font-black uppercase tracking-wide text-[#8D240D]">
                  {dateLabel}
                </span>
                <span className="text-xs font-bold text-[#8E513F]">
                  Total: <strong className="font-display font-black text-sm text-[#8D240D]">{groupTotalCalories}</strong> kcal
                </span>
              </div>

              {/* Meals in this date group */}
              <div className="divide-y divide-[#FFE1AC]/60 rounded-3xl border border-[#FFE1AC] bg-[#FFF3DF] shadow-warm overflow-hidden">
                {groupMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between p-4 sm:p-5 hover:bg-[#FFE1AC]/20 transition"
                  >
                    {/* Left Info */}
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      {meal.imageUrl ? (
                        <div className="h-16 w-16 sm:h-18 sm:w-18 shrink-0 overflow-hidden rounded-2xl border border-[#FFE1AC] bg-[#FFF8EC] shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={meal.imageUrl}
                            alt={meal.mealName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FFE1AC] text-[#8D240D] border border-[#F9A83B]/30 shadow-sm">
                          <Flame className="h-7 w-7 text-[#FF990F]" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm sm:text-base font-bold text-[#8D240D]">
                            {meal.mealName}
                          </p>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getMealTypeBadgeStyle(
                              meal.mealType
                            )}`}
                          >
                            {meal.mealType}
                          </span>
                        </div>

                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#8E513F]">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="h-3 w-3 text-[#FF990F]" />
                            {formatTime(meal.savedAt)}
                          </span>
                          <span>•</span>
                          <span className="font-display font-black text-sm text-[#B30D08]">
                            ~{meal.estimatedCalories} kcal
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-[#8E513F]">
                          <span>P: {meal.macros.protein}g</span>
                          <span>C: {meal.macros.carbs}g</span>
                          <span>F: {meal.macros.fat}g</span>
                          {meal.userNotes && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[160px] italic text-[#8D240D]">
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
                        className="flex items-center gap-1 rounded-full border border-[#FFE1AC] bg-[#FFF8EC] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8D240D] hover:bg-[#FFE1AC]/50 transition shadow-warm-sm"
                        title="View breakdown"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#FF990F]" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteMeal(meal.id)}
                        className="rounded-full p-2 text-[#8E513F] hover:bg-[#B30D08]/10 hover:text-[#B30D08] transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#8D240D]/35 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#FFF8EC] border-2 border-[#FFE1AC] p-6 sm:p-7 shadow-2xl">
            <button
              onClick={() => setSelectedMeal(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-[#8E513F] hover:bg-[#FFE1AC] hover:text-[#8D240D] transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#8D240D] pr-8">
                {selectedMeal.mealName}
              </h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getMealTypeBadgeStyle(
                  selectedMeal.mealType
                )}`}
              >
                {selectedMeal.mealType}
              </span>
            </div>
            <p className="text-xs text-[#8E513F] mt-1 font-medium">
              Saved on {new Date(selectedMeal.savedAt).toLocaleString()}
            </p>

            {selectedMeal.imageUrl && (
              <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-[#FFE1AC] bg-[#FFF3DF] shadow-warm-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedMeal.imageUrl}
                  alt={selectedMeal.mealName}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Calories & Macros Box */}
            <div className="mt-4 rounded-2xl bg-[#FFF3DF] p-4 border border-[#FFE1AC] shadow-warm-sm">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-[#8E513F]">
                  Estimated Total Energy
                </span>
                <span className="font-display text-2xl font-black text-[#B30D08]">
                  {selectedMeal.estimatedCalories}{" "}
                  <span className="font-sans text-xs font-normal text-[#8E513F] uppercase">kcal</span>
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-[#FFF8EC] p-2.5 border border-[#FFE1AC]/80">
                  <span className="font-display font-bold uppercase text-[10px] text-[#8D240D] block">Protein</span>
                  <span className="font-display text-base font-black text-[#8D240D]">{selectedMeal.macros.protein}g</span>
                </div>
                <div className="rounded-xl bg-[#FFF8EC] p-2.5 border border-[#FFE1AC]/80">
                  <span className="font-display font-bold uppercase text-[10px] text-[#8D240D] block">Carbs</span>
                  <span className="font-display text-base font-black text-[#8D240D]">{selectedMeal.macros.carbs}g</span>
                </div>
                <div className="rounded-xl bg-[#FFF8EC] p-2.5 border border-[#FFE1AC]/80">
                  <span className="font-display font-bold uppercase text-[10px] text-[#8D240D] block">Fat</span>
                  <span className="font-display text-base font-black text-[#8D240D]">{selectedMeal.macros.fat}g</span>
                </div>
              </div>
            </div>

            {/* Ingredients & USDA references */}
            {selectedMeal.items && selectedMeal.items.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#8D240D]">
                  Items &amp; Portions Breakdown
                </h4>
                <div className="divide-y divide-[#FFE1AC]/60 rounded-2xl border border-[#FFE1AC] bg-[#FFF3DF]">
                  {selectedMeal.items.map((it, idx) => (
                    <div key={idx} className="p-3 text-xs">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-[#8D240D] text-sm">{it.name}</span>
                          <span className="block text-[11px] text-[#8E513F]">
                            {it.portion}
                          </span>
                        </div>
                        <span className="font-display font-black text-sm text-[#8D240D]">
                          ~{it.calories} kcal
                        </span>
                      </div>

                      {it.usdaRef && (
                        <div className="mt-1.5 flex items-center justify-between gap-1 text-[10px] text-[#8D240D] bg-[#FFE1AC]/40 p-2 rounded-xl border border-[#F9A83B]/30">
                          <span>
                            USDA: {it.usdaRef.description} ({it.usdaRef.per100g.calories ?? "–"} kcal/100g)
                          </span>
                          <a
                            href={it.usdaRef.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#B30D08] hover:text-[#8D240D] p-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Section */}
            <div className="mt-4 rounded-2xl border border-[#FFE1AC] bg-[#FFF3DF] p-3.5 text-xs shadow-warm-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold uppercase tracking-wider text-[#8D240D] flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-[#FF990F]" />
                  Personal Notes
                </span>
                {!editingNotes && onUpdateNotes && (
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="text-[#B30D08] font-bold uppercase hover:underline text-[10px]"
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
                    className="w-full rounded-xl border border-[#FFE1AC] p-2 bg-[#FFF8EC] text-xs text-[#65230F] focus:border-[#FF990F] focus:outline-none"
                    placeholder="Add personal notes..."
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => setEditingNotes(false)}
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase text-[#8E513F] hover:bg-[#FFE1AC]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveModalNotes}
                      className="px-3.5 py-1 rounded-full bg-[#B30D08] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#8D240D]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[#65230F] italic">
                  {selectedMeal.userNotes || "No notes added for this meal."}
                </p>
              )}
            </div>

            <div className="mt-5">
              <DisclaimerBanner compact={true} />
            </div>

            <button
              onClick={() => setSelectedMeal(null)}
              className="mt-4 w-full rounded-full bg-[#B30D08] py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-[#B30D08]/30 hover:bg-[#8D240D] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
