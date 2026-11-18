"use client";

import React, { useState } from "react";
import { MealAnalysisResult, MealType, FoodItemEstimate, Macronutrients } from "@/types/meal";
import {
  Bookmark,
  Check,
  Flame,
  Info,
  RotateCcw,
  ExternalLink,
  Edit2,
  Plus,
  Trash2,
  MessageSquare,
  Undo2,
} from "lucide-react";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { DataSourcesBadge } from "./DataSourcesBadge";
import { inferMealType } from "@/lib/storage";

interface MealNutritionCardProps {
  analysis: MealAnalysisResult;
  imageUrl?: string;
  onSave: (payload: {
    mealName: string;
    mealType: MealType;
    estimatedCalories: number;
    macros: Macronutrients;
    items: FoodItemEstimate[];
    userNotes?: string;
  }) => void;
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

  // Editable states
  const [mealName, setMealName] = useState(analysis.mealName);
  const [mealType, setMealType] = useState<MealType>(
    analysis.mealType || inferMealType(analysis.analyzedAt)
  );
  const [items, setItems] = useState<FoodItemEstimate[]>(analysis.items || []);
  const [userNotes, setUserNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // New item inputs
  const [newItemName, setNewItemName] = useState("");
  const [newItemPortion, setNewItemPortion] = useState("");
  const [newItemCalories, setNewItemCalories] = useState("");
  const [newItemProtein, setNewItemProtein] = useState("");
  const [newItemCarbs, setNewItemCarbs] = useState("");
  const [newItemFat, setNewItemFat] = useState("");
  const [showAddItem, setShowAddItem] = useState(false);

  // Dynamically calculate totals based on current items
  const calculateTotals = (currentItems: FoodItemEstimate[]) => {
    if (currentItems.length === 0) {
      return {
        calories: analysis.estimatedCalories,
        macros: analysis.macros,
      };
    }
    const calories = currentItems.reduce((acc, it) => acc + (Number(it.calories) || 0), 0);
    const macros: Macronutrients = {
      protein: currentItems.reduce((acc, it) => acc + (Number(it.macros?.protein) || 0), 0),
      carbs: currentItems.reduce((acc, it) => acc + (Number(it.macros?.carbs) || 0), 0),
      fat: currentItems.reduce((acc, it) => acc + (Number(it.macros?.fat) || 0), 0),
      fiber: analysis.macros?.fiber,
    };
    return { calories, macros };
  };

  const currentTotals = isEditing
    ? calculateTotals(items)
    : {
        calories: analysis.estimatedCalories,
        macros: analysis.macros,
      };

  const { calories: totalCalories, macros: totalMacros } = currentTotals;

  // Macro calorie math
  const totalMacroGrams =
    (totalMacros.protein || 0) + (totalMacros.carbs || 0) + (totalMacros.fat || 0) || 1;
  const proteinPercent = Math.round(((totalMacros.protein || 0) / totalMacroGrams) * 100);
  const carbsPercent = Math.round(((totalMacros.carbs || 0) / totalMacroGrams) * 100);
  const fatPercent = Math.round(((totalMacros.fat || 0) / totalMacroGrams) * 100);

  const handleSaveClick = () => {
    onSave({
      mealName: mealName.trim() || analysis.mealName,
      mealType,
      estimatedCalories: totalCalories,
      macros: totalMacros,
      items,
      userNotes: userNotes.trim() || undefined,
    });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  const handleItemChange = (index: number, field: keyof FoodItemEstimate, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleItemMacroChange = (
    index: number,
    macroField: keyof Macronutrients,
    value: number
  ) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      macros: { ...updated[index].macros, [macroField]: value },
    };
    setItems(updated);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: FoodItemEstimate = {
      name: newItemName.trim(),
      portion: newItemPortion.trim() || "1 serving",
      calories: Number(newItemCalories) || 0,
      macros: {
        protein: Number(newItemProtein) || 0,
        carbs: Number(newItemCarbs) || 0,
        fat: Number(newItemFat) || 0,
      },
    };

    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemPortion("");
    setNewItemCalories("");
    setNewItemProtein("");
    setNewItemCarbs("");
    setNewItemFat("");
    setShowAddItem(false);
  };

  const handleResetToAI = () => {
    setMealName(analysis.mealName);
    setItems(analysis.items || []);
    setIsEditing(false);
    setShowAddItem(false);
  };

  const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

  return (
    <div className="w-full space-y-5 rounded-3xl border border-[#FFE1AC] bg-[#FFF3DF] p-5 sm:p-7 shadow-warm">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b border-[#FFE1AC]/80 pb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="rounded-xl border-2 border-[#FF990F] bg-[#FFF8EC] px-3 py-1 font-display text-xl font-black text-[#8D240D] focus:outline-none focus:ring-2 focus:ring-[#FF990F]/30"
                placeholder="Enter meal title..."
              />
            ) : (
              <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#8D240D] truncate">
                {mealName}
              </h2>
            )}

            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[11px] font-bold border ${
                analysis.confidence === "High"
                  ? "bg-[#FFF8EC] text-[#8D240D] border-[#FFE1AC]"
                  : analysis.confidence === "Medium"
                  ? "bg-[#FFE1AC] text-[#8D240D] border-[#F9A83B]"
                  : "bg-[#B30D08]/10 text-[#B30D08] border-[#B30D08]/30"
              }`}
            >
              <Info className="h-3 w-3 text-[#FF990F]" />
              <span>{analysis.confidence} Confidence</span>
            </span>
          </div>

          {analysis.summary && !isEditing && (
            <p className="mt-1 text-xs text-[#65230F] leading-relaxed max-w-2xl">
              {analysis.summary}
            </p>
          )}

          {/* Meal Type Categorization Pills */}
          <div className="mt-3 flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E513F] mr-1">Meal:</span>
            {mealTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMealType(type)}
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition ${
                  mealType === type
                    ? "bg-[#B30D08] text-white shadow-md shadow-[#B30D08]/25"
                    : "bg-[#FFF8EC] text-[#8D240D] border border-[#FFE1AC] hover:bg-[#FFE1AC]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              isEditing
                ? "bg-[#FF990F] text-white shadow-md shadow-[#FF990F]/25"
                : "border border-[#FFE1AC] bg-[#FFF8EC] text-[#8D240D] hover:bg-[#FFE1AC]/50 shadow-warm-sm"
            }`}
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>{isEditing ? "Done" : "Adjust"}</span>
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleResetToAI}
              className="flex items-center gap-1 rounded-full border border-[#FFE1AC] bg-[#FFF8EC] px-3 py-2 text-xs font-bold uppercase text-[#8D240D] hover:bg-[#FFE1AC]"
              title="Reset to AI estimate"
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-full border border-[#FFE1AC] bg-[#FFF8EC] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8D240D] hover:bg-[#FFE1AC]/50 transition shadow-warm-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Scan Another</span>
          </button>

          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaved}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-md transition active:scale-95 ${
              isSaved || justSaved
                ? "bg-[#FFE1AC] text-[#8D240D] border border-[#F9A83B] cursor-default"
                : "bg-[#B30D08] text-white hover:bg-[#8D240D] shadow-[#B30D08]/30"
            }`}
          >
            {isSaved || justSaved ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#8D240D]" />
                <span>Saved to Log</span>
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
        {/* Total Calories Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF990F] via-[#F9A83B] to-[#8D240D] p-6 text-white shadow-orange md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-bold tracking-wider uppercase text-white/90">
              {isEditing ? "Updated Calories" : "Est. Energy"}
            </span>
            <Flame className="h-5 w-5 text-[#FFC84B] fill-[#FFC84B]/30" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="font-display text-4xl sm:text-5xl font-black tracking-tight">
              {totalCalories}
            </span>
            <span className="text-xs font-bold text-white/90 uppercase">kcal</span>
          </div>
          <p className="mt-2.5 text-[11px] text-white/80 leading-tight">
            {isEditing
              ? "Sum of all adjusted items below."
              : "*Visual approximation based on identified portions."}
          </p>
        </div>

        {/* Macronutrient Breakdown Cards */}
        <div className="grid grid-cols-3 gap-2.5 md:col-span-3">
          {/* Protein */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#FFE1AC] bg-[#FFF8EC] p-4 shadow-warm-sm">
            <div>
              <span className="font-display font-bold uppercase tracking-wider text-xs text-[#8D240D]">Protein</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-2xl sm:text-3xl font-black text-[#8D240D]">{totalMacros.protein}</span>
                <span className="text-xs font-semibold text-[#8E513F]">g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-[#FFE1AC]/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#B30D08] transition-all duration-300"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
              <span className="mt-1 block text-[10px] font-bold text-[#8D240D]">
                {proteinPercent}% of macros
              </span>
            </div>
          </div>

          {/* Carbs */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#FFE1AC] bg-[#FFF8EC] p-4 shadow-warm-sm">
            <div>
              <span className="font-display font-bold uppercase tracking-wider text-xs text-[#8D240D]">Carbs</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-2xl sm:text-3xl font-black text-[#8D240D]">{totalMacros.carbs}</span>
                <span className="text-xs font-semibold text-[#8E513F]">g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-[#FFE1AC]/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#FF990F] transition-all duration-300"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
              <span className="mt-1 block text-[10px] font-bold text-[#FF990F]">
                {carbsPercent}% of macros
              </span>
            </div>
          </div>

          {/* Fat */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#FFE1AC] bg-[#FFF8EC] p-4 shadow-warm-sm">
            <div>
              <span className="font-display font-bold uppercase tracking-wider text-xs text-[#8D240D]">Fat</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-2xl sm:text-3xl font-black text-[#8D240D]">{totalMacros.fat}</span>
                <span className="text-xs font-semibold text-[#8E513F]">g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-[#FFE1AC]/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#FFC84B] transition-all duration-300"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
              <span className="mt-1 block text-[10px] font-bold text-[#8D240D]">
                {fatPercent}% of macros
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Ingredients Breakdown & Edit Table */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#8D240D]">
            Detected Ingredients &amp; Portion Breakdown
          </h3>

          {isEditing && !showAddItem && (
            <button
              type="button"
              onClick={() => setShowAddItem(true)}
              className="flex items-center gap-1 rounded-full border border-dashed border-[#FF990F] bg-[#FFF8EC] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#8D240D] hover:bg-[#FFE1AC] transition"
            >
              <Plus className="h-3.5 w-3.5 text-[#FF990F]" />
              <span>Add Item</span>
            </button>
          )}
        </div>

        {/* Add Item Form */}
        {isEditing && showAddItem && (
          <form
            onSubmit={handleAddNewItem}
            className="rounded-2xl border-2 border-[#FF990F] bg-[#FFF8EC] p-4 space-y-3 shadow-warm"
          >
            <p className="font-display text-sm font-black uppercase text-[#8D240D]">Add Extra Ingredient</p>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase text-[#8D240D] block mb-0.5">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Olive Oil Dressing"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full rounded-xl border border-[#FFE1AC] bg-[#FFF3DF] p-2 focus:border-[#FF990F] focus:outline-none"
                  required
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-[#8D240D] block mb-0.5">Portion</label>
                <input
                  type="text"
                  placeholder="1 tbsp"
                  value={newItemPortion}
                  onChange={(e) => setNewItemPortion(e.target.value)}
                  className="w-full rounded-xl border border-[#FFE1AC] bg-[#FFF3DF] p-2 focus:border-[#FF990F] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-[#8D240D] block mb-0.5">Calories</label>
                <input
                  type="number"
                  placeholder="kcal"
                  value={newItemCalories}
                  onChange={(e) => setNewItemCalories(e.target.value)}
                  className="w-full rounded-xl border border-[#FFE1AC] bg-[#FFF3DF] p-2 focus:border-[#FF990F] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-[#8D240D] block mb-0.5">P / C (g)</label>
                <input
                  type="number"
                  placeholder="P"
                  value={newItemProtein}
                  onChange={(e) => setNewItemProtein(e.target.value)}
                  className="w-full rounded-xl border border-[#FFE1AC] bg-[#FFF3DF] p-2 focus:border-[#FF990F] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-[#8D240D] block mb-0.5">Fat (g)</label>
                <input
                  type="number"
                  placeholder="F"
                  value={newItemFat}
                  onChange={(e) => setNewItemFat(e.target.value)}
                  className="w-full rounded-xl border border-[#FFE1AC] bg-[#FFF3DF] p-2 focus:border-[#FF990F] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowAddItem(false)}
                className="rounded-full px-3 py-1 text-xs font-bold uppercase text-[#8E513F] hover:bg-[#FFE1AC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#B30D08] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#8D240D]"
              >
                Add Item
              </button>
            </div>
          </form>
        )}

        {/* Items List */}
        <div className="divide-y divide-[#FFE1AC]/60 rounded-2xl border border-[#FFE1AC] bg-[#FFF8EC] overflow-hidden shadow-warm-sm">
          {items.map((item, idx) => (
            <div key={idx} className="p-3.5 text-xs hover:bg-[#FFF3DF]/50 transition">
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                      className="font-bold text-[#8D240D] rounded-lg border border-[#FFE1AC] bg-[#FFF3DF] px-2.5 py-1 flex-1 focus:border-[#FF990F] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(idx)}
                      className="text-[#8E513F] hover:text-[#B30D08] p-1.5 transition"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#8E513F] uppercase block">Portion</span>
                      <input
                        type="text"
                        value={item.portion}
                        onChange={(e) => handleItemChange(idx, "portion", e.target.value)}
                        className="w-full rounded-lg border border-[#FFE1AC] bg-[#FFF3DF] px-2 py-1 text-xs text-[#65230F] focus:border-[#FF990F] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#8E513F] uppercase block">Calories</span>
                      <input
                        type="number"
                        value={item.calories}
                        onChange={(e) =>
                          handleItemChange(idx, "calories", Number(e.target.value))
                        }
                        className="w-full rounded-lg border border-[#FFE1AC] bg-[#FFF3DF] px-2 py-1 text-xs font-bold text-[#8D240D] focus:border-[#FF990F] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#8E513F] uppercase block">Protein (g)</span>
                      <input
                        type="number"
                        value={item.macros?.protein || 0}
                        onChange={(e) =>
                          handleItemMacroChange(idx, "protein", Number(e.target.value))
                        }
                        className="w-full rounded-lg border border-[#FFE1AC] bg-[#FFF3DF] px-2 py-1 text-xs text-[#65230F] focus:border-[#FF990F] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#8E513F] uppercase block">Carbs/Fat (g)</span>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="C"
                          value={item.macros?.carbs || 0}
                          onChange={(e) =>
                            handleItemMacroChange(idx, "carbs", Number(e.target.value))
                          }
                          className="w-1/2 rounded-lg border border-[#FFE1AC] bg-[#FFF3DF] px-1.5 py-1 text-xs text-[#65230F] focus:border-[#FF990F] focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder="F"
                          value={item.macros?.fat || 0}
                          onChange={(e) =>
                            handleItemMacroChange(idx, "fat", Number(e.target.value))
                          }
                          className="w-1/2 rounded-lg border border-[#FFE1AC] bg-[#FFF3DF] px-1.5 py-1 text-xs text-[#65230F] focus:border-[#FF990F] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#8D240D] text-sm">{item.name}</p>
                    <p className="text-[11px] text-[#8E513F]">
                      Est. Portion: {item.portion}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-base font-black text-[#8D240D]">
                      ~{item.calories} <span className="font-sans font-normal text-[#8E513F] text-[10px] uppercase">kcal</span>
                    </p>
                    <p className="text-[10px] font-medium text-[#8E513F]">
                      P: {item.macros?.protein || 0}g • C: {item.macros?.carbs || 0}g • F: {item.macros?.fat || 0}g
                    </p>
                  </div>
                </div>
              )}

              {/* USDA Reference Cross-Check */}
              {item.usdaRef && !isEditing && (
                <div className="mt-2 flex items-center justify-between rounded-xl bg-[#FFE1AC]/40 px-3 py-2 border border-[#F9A83B]/30">
                  <span className="text-[10px] text-[#8D240D] leading-tight">
                    <strong className="font-bold">USDA Reference:</strong> {item.usdaRef.description} — {item.usdaRef.per100g.calories ?? "–"} kcal, P: {item.usdaRef.per100g.protein ?? "–"}g, C: {item.usdaRef.per100g.carbs ?? "–"}g, F: {item.usdaRef.per100g.fat ?? "–"}g <span className="text-[#8E513F]">(per 100g)</span>
                  </span>
                  <a
                    href={item.usdaRef.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[#B30D08] hover:text-[#8D240D] transition p-1"
                    title="View on USDA FoodData Central"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Notes Input */}
      <div className="rounded-2xl border border-[#FFE1AC] bg-[#FFF8EC] p-3.5 shadow-warm-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8D240D] mb-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-[#FF990F]" />
          <span>Personal Notes (optional)</span>
        </div>
        <input
          type="text"
          placeholder="e.g. Post-workout lunch, felt full, ate 80%..."
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          className="w-full rounded-xl border border-[#FFE1AC] bg-[#FFF3DF] p-2.5 text-xs text-[#65230F] placeholder-[#8E513F]/50 focus:border-[#FF990F] focus:outline-none"
        />
      </div>

      {/* Data Sources Attribution */}
      <DataSourcesBadge
        activeSources={analysis.dataSources}
        showFullRegistry={true}
      />

      {/* Mandatory Disclaimer */}
      <div className="pt-2">
        <DisclaimerBanner compact={false} />
      </div>
    </div>
  );
}
