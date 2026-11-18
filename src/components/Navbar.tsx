"use client";

import React from "react";
import { Camera, History, Sparkles, Flame } from "lucide-react";

interface NavbarProps {
  activeTab: "scan" | "history";
  onTabChange: (tab: "scan" | "history") => void;
  savedCount: number;
}

export function Navbar({ activeTab, onTabChange, savedCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#FFE1AC]/90 bg-[#FFF8EC]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF990F] to-[#FFA82F] text-white shadow-md shadow-[#FF990F]/30 ring-2 ring-[#FFE1AC]/60">
            <Flame className="h-6 w-6 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#8D240D]">
                Calo<span className="text-[#FF990F]">Lens</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF3DF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#B30D08] border border-[#FFE1AC]">
                <Sparkles className="h-2.5 w-2.5 text-[#FF990F]" /> AI Vision
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#8E513F] hidden sm:block">
              AI-Powered Meal &amp; Nutrition Estimator
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Pill Treatment) */}
        <nav className="flex items-center gap-1 rounded-full bg-[#FFF3DF] p-1.5 border border-[#FFE1AC] shadow-warm-sm">
          <button
            type="button"
            onClick={() => onTabChange("scan")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "scan"
                ? "bg-[#B30D08] text-white shadow-md shadow-[#B30D08]/25 scale-[1.02]"
                : "text-[#8E513F] hover:text-[#8D240D] hover:bg-[#FFE1AC]/40"
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Scan Meal</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("history")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "history"
                ? "bg-[#B30D08] text-white shadow-md shadow-[#B30D08]/25 scale-[1.02]"
                : "text-[#8E513F] hover:text-[#8D240D] hover:bg-[#FFE1AC]/40"
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>History</span>
            {savedCount > 0 && (
              <span
                className={`flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full text-[10px] font-bold ${
                  activeTab === "history"
                    ? "bg-[#FFC84B] text-[#8D240D]"
                    : "bg-[#FF990F] text-white"
                }`}
              >
                {savedCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
