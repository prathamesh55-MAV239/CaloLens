"use client";

import React from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";

interface DisclaimerBannerProps {
  compact?: boolean;
}

export function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl bg-[#FFF3DF] px-3.5 py-2 text-xs text-[#8D240D] border border-[#FFE1AC] shadow-warm-sm">
        <AlertCircle className="h-4 w-4 shrink-0 text-[#FF990F]" />
        <p className="leading-snug">
          <strong className="font-bold">Visual Estimation:</strong> Nutrition figures are AI approximations and not medical advice.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#FFE1AC] bg-[#FFF3DF] p-4 sm:p-5 shadow-warm">
      <div className="flex items-start gap-3.5">
        <div className="rounded-xl bg-[#FFE1AC] p-2.5 text-[#8D240D] shrink-0 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-[#8D240D]" />
        </div>
        <div className="space-y-1 text-sm">
          <h4 className="font-display font-bold text-base uppercase tracking-tight text-[#8D240D]">
            Nutritional Estimation &amp; Medical Disclaimer
          </h4>
          <p className="text-xs leading-relaxed text-[#65230F]">
            CaloLens uses computer vision models to estimate ingredients, portion sizes, and nutrition. 
            Visual analysis cannot detect exact oils, seasonings, hidden sodium, or specific brand recipes. 
            All calorie and nutrient figures are <strong>rough estimates</strong> and must never be used as clinical dietary advice, medical diagnosis, or for managing critical health conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
