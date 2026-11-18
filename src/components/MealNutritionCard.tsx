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

  const currentTotals = isEditing ? calculateTotals(items) : {
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
    <div className="w-full space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="rounded-lg border border-emerald-400 px-2.5 py-1 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Enter meal title..."
              />
            ) : (
              <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                {mealName}
              </h2>
            )}

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                analysis.confidence === "High"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : analysis.confidence === "Medium"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              <Info className="h-3 w-3" />
              <span>{analysis.confidence} Confidence</span>
            </span>
          </div>

          {analysis.summary && !isEditing && (
            <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-2xl">
              {analysis.summary}
            </p>
          )}

          {/* Meal Type Categorization Pills */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 mr-1">Meal:</span>
            {mealTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMealType(type)}
                className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold transition ${
                  mealType === type
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
              isEditing
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>{isEditing ? "Done Editing" : "Adjust / Edit"}</span>
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleResetToAI}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              title="Reset to AI estimate"
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Scan Another</span>
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
        {/* Total Calories */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-md shadow-emerald-500/10 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-100 tracking-wide uppercase">
              {isEditing ? "Updated Calories" : "Est. Calories"}
            </span>
            <Flame className="h-5 w-5 text-emerald-200" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tight">
              {totalCalories}
            </span>
            <span className="text-xs font-medium text-emerald-100">kcal</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-100/90 leading-tight">
            {isEditing
              ? "Sum of all adjusted items below."
              : "*Visual approximation based on identified portions."}
          </p>
        </div>

        {/* Macronutrient Breakdown Cards */}
        <div className="grid grid-cols-3 gap-2.5 md:col-span-3">
          {/* Protein */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <div>
              <span className="text-xs font-semibold text-slate-500">Protein</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{totalMacros.protein}</span>
                <span className="text-xs text-slate-500">g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
              <span className="mt-1 block text-[10px] text-slate-400">
                {proteinPercent}% of macros
              </span>
            </div>
          </div>

          {/* Carbs */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <div>
              <span className="text-xs font-semibold text-slate-500">Carbs</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{totalMacros.carbs}</span>
                <span className="text-xs text-slate-500">g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
              <span className="mt-1 block text-[10px] text-slate-400">
                {carbsPercent}% of macros
              </span>
            </div>
          </div>

          {/* Fat */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <div>
              <span className="text-xs font-semibold text-slate-500">Fat</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{totalMacros.fat}</span>
                <span className="text-xs text-slate-500">g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
              <span className="mt-1 block text-[10px] text-slate-400">
                {fatPercent}% of macros
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Ingredients Breakdown & Edit Table */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Detected Ingredients &amp; Portion Breakdown
          </h3>

          {isEditing && !showAddItem && (
            <button
              type="button"
              onClick={() => setShowAddItem(true)}
              className="flex items-center gap-1 rounded-lg border border-dashed border-emerald-400 bg-emerald-50/50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Item</span>
            </button>
          )}
        </div>

        {/* Add Item Inline Form */}
        {isEditing && showAddItem && (
          <form
            onSubmit={handleAddNewItem}
            className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-3.5 space-y-2.5"
          >
            <p className="text-xs font-bold text-emerald-900">Add Extra Food / Ingredient</p>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[10px] text-slate-500 block mb-0.5">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Olive Oil"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-1.5 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-slate-500 block mb-0.5">Portion</label>
                <input
                  type="text"
                  placeholder="1 tbsp"
                  value={newItemPortion}
                  onChange={(e) => setNewItemPortion(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-slate-500 block mb-0.5">Calories</label>
                <input
                  type="number"
                  placeholder="kcal"
                  value={newItemCalories}
                  onChange={(e) => setNewItemCalories(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-slate-500 block mb-0.5">Protein/Carb (g)</label>
                <input
                  type="number"
                  placeholder="P (g)"
                  value={newItemProtein}
                  onChange={(e) => setNewItemProtein(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-slate-500 block mb-0.5">Fat (g)</label>
                <input
                  type="number"
                  placeholder="F (g)"
                  value={newItemFat}
                  onChange={(e) => setNewItemFat(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowAddItem(false)}
                className="rounded-lg px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {/* Items List */}
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/40 overflow-hidden">
          {items.map((item, idx) => (
            <div key={idx} className="p-3 text-xs hover:bg-white transition">
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                      className="font-semibold text-slate-800 rounded border border-slate-300 px-2 py-0.5 flex-1 focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Portion</span>
                      <input
                        type="text"
                        value={item.portion}
                        onChange={(e) => handleItemChange(idx, "portion", e.target.value)}
                        className="w-full rounded border border-slate-300 px-1.5 py-0.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Calories (kcal)</span>
                      <input
                        type="number"
                        value={item.calories}
                        onChange={(e) =>
                          handleItemChange(idx, "calories", Number(e.target.value))
                        }
                        className="w-full rounded border border-slate-300 px-1.5 py-0.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Protein (g)</span>
                      <input
                        type="number"
                        value={item.macros?.protein || 0}
                        onChange={(e) =>
                          handleItemMacroChange(idx, "protein", Number(e.target.value))
                        }
                        className="w-full rounded border border-slate-300 px-1.5 py-0.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Carbs/Fat (g)</span>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="C"
                          value={item.macros?.carbs || 0}
                          onChange={(e) =>
                            handleItemMacroChange(idx, "carbs", Number(e.target.value))
                          }
                          className="w-1/2 rounded border border-slate-300 px-1 py-0.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder="F"
                          value={item.macros?.fat || 0}
                          onChange={(e) =>
                            handleItemMacroChange(idx, "fat", Number(e.target.value))
                          }
                          className="w-1/2 rounded border border-slate-300 px-1 py-0.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
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
              )}

              {/* USDA Reference Cross-Check */}
              {item.usdaRef && !isEditing && (
                <div className="mt-1.5 flex items-center gap-2 rounded-md bg-blue-50/70 px-2.5 py-1.5 border border-blue-100">
                  <span className="text-[10px] text-blue-700 leading-tight">
                    <strong>USDA Ref:</strong> {item.usdaRef.description} — {item.usdaRef.per100g.calories ?? "–"} kcal, P: {item.usdaRef.per100g.protein ?? "–"}g, C: {item.usdaRef.per100g.carbs ?? "–"}g, F: {item.usdaRef.per100g.fat ?? "–"}g <span className="text-blue-500">(per 100g)</span>
                  </span>
                  <a
                    href={item.usdaRef.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-blue-500 hover:text-blue-700 transition"
                    title="View on USDA FoodData Central"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Notes Input */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
          <span>Personal Notes (optional)</span>
        </div>
        <input
          type="text"
          placeholder="e.g. Post-workout lunch, felt full, ate 80%..."
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
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
