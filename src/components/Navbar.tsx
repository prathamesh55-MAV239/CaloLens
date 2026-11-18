"use client";

import React from "react";
import { Camera, History, Sparkles } from "lucide-react";

interface NavbarProps {
  activeTab: "scan" | "history";
  onTabChange: (tab: "scan" | "history") => void;
  savedCount: number;
}

export function Navbar({ activeTab, onTabChange, savedCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Calo<span className="text-emerald-600">Lens</span>
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                <Sparkles className="h-2.5 w-2.5" /> MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              AI Food & Nutritional Estimator
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60">
          <button
            onClick={() => onTabChange("scan")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "scan"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Scan Meal</span>
          </button>
          <button
            onClick={() => onTabChange("history")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "history"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>History</span>
            {savedCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                {savedCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
