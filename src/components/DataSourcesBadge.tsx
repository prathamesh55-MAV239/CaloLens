"use client";

import React, { useState } from "react";
import { Database, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { DataSourceAttribution } from "@/types/meal";
import { ALL_SOURCES, MVP_ATTRIBUTION_SOURCES } from "@/lib/dataSources";

interface DataSourcesBadgeProps {
  /** Sources used in this specific analysis (from API response) */
  activeSources?: DataSourceAttribution[];
  /** Show the full registry (all sources including eval/hold) */
  showFullRegistry?: boolean;
}

export function DataSourcesBadge({
  activeSources,
  showFullRegistry = false,
}: DataSourcesBadgeProps) {
  const [expanded, setExpanded] = useState(false);

  const sources = activeSources || MVP_ATTRIBUTION_SOURCES;
  const registrySources = showFullRegistry ? ALL_SOURCES : [];

  return (
    <div className="rounded-2xl border border-[#FFE1AC] bg-[#FFF8EC] overflow-hidden shadow-warm-sm">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-xs hover:bg-[#FFF3DF] transition"
      >
        <div className="flex items-center gap-2.5 text-[#8D240D]">
          <Database className="h-4 w-4 text-[#FF990F]" />
          <span className="font-display text-sm font-black uppercase tracking-wide">Data Sources &amp; Models Registry</span>
          <span className="rounded-full bg-[#FFE1AC] px-2.5 py-0.5 text-[10px] font-bold text-[#8D240D] border border-[#F9A83B]/30">
            {sources.filter((s) => s.status === "active").length} active
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-[#8E513F]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#8E513F]" />
        )}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-[#FFE1AC] px-4 py-3.5 space-y-3.5 bg-[#FFF3DF]/60">
          {/* Active Sources */}
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-wider text-[#8D240D] mb-2">
              Active in This Analysis
            </p>
            <div className="space-y-2.5">
              {sources
                .filter((s) => s.status === "active")
                .map((src, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#FF990F]" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#8D240D]">{src.name}</span>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8E513F] hover:text-[#B30D08] transition"
                          title="View source"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="text-[11px] text-[#65230F] leading-snug mt-0.5">
                        {src.role}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Full Registry */}
          {showFullRegistry && registrySources.filter((s) => s.status !== "active").length > 0 && (
            <>
              <hr className="border-[#FFE1AC]" />
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-wider text-[#8E513F] mb-2">
                  Evaluation &amp; Future Sources (Reference Registry)
                </p>
                <div className="space-y-2">
                  {registrySources
                    .filter((s) => s.status !== "active")
                    .map((src, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs">
                        <div
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                            src.status === "evaluation"
                              ? "bg-[#FFA82F]"
                              : "bg-[#8E513F]/40"
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#8D240D]">{src.name}</span>
                            <span
                              className={`rounded-full px-2 py-0 text-[9px] font-bold uppercase ${
                                src.status === "evaluation"
                                  ? "bg-[#FFE1AC] text-[#8D240D] border border-[#F9A83B]"
                                  : "bg-[#FFF8EC] text-[#8E513F] border border-[#FFE1AC]"
                              }`}
                            >
                              {src.status}
                            </span>
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#8E513F] hover:text-[#B30D08] transition"
                            >
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                          <p className="text-[10px] text-[#65230F] leading-tight mt-0.5">
                            {src.role}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* Link to full registry */}
          <p className="text-[10px] font-medium text-[#8E513F] pt-1">
            Complete licensing decision registry:{" "}
            <a
              href="https://github.com/prathamesh55-MAV239/CaloLens/blob/main/SOURCES.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B30D08] hover:text-[#8D240D] font-bold underline underline-offset-2"
            >
              SOURCES.md
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
