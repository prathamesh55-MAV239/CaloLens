"use client";

import React from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";

interface DisclaimerBannerProps {
  compact?: boolean;
}

export function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 border border-amber-200/80">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
        <p>
          <strong className="font-semibold">Visual Estimate:</strong> Nutritional figures are AI approximations and not medical advice.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-amber-900 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-amber-900">
            Estimated Nutritional Information & Medical Disclaimer
          </p>
          <p className="text-xs leading-relaxed text-amber-800">
            CaloLens uses computer vision models to estimate ingredients, portion sizes, and nutrition. 
            Visual analysis cannot detect hidden oils, sodium levels, exact cuts, or specific brand recipes. 
            All calorie and nutrient figures are <strong>rough estimates</strong> and should never be used as medical advice, clinical dietary diagnosis, or for managing critical medical conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
