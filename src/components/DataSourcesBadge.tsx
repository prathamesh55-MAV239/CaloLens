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
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-xs hover:bg-slate-100/60 transition"
      >
        <div className="flex items-center gap-2 text-slate-600">
          <Database className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-semibold">Data Sources & Models</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
            {sources.filter((s) => s.status === "active").length} active
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        )}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-slate-200/80 px-4 py-3 space-y-3">
          {/* Active Sources */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
              Active in This Analysis
            </p>
            <div className="space-y-2">
              {sources
                .filter((s) => s.status === "active")
                .map((src, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">{src.name}</span>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-emerald-600 transition"
                          title="View source"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        {src.role}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Full Registry (if enabled) */}
          {showFullRegistry && registrySources.filter((s) => s.status !== "active").length > 0 && (
            <>
              <hr className="border-slate-200/80" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Evaluation & Future Sources (not yet in production)
                </p>
                <div className="space-y-1.5">
                  {registrySources
                    .filter((s) => s.status !== "active")
                    .map((src, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <div
                          className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            src.status === "evaluation"
                              ? "bg-amber-400"
                              : "bg-slate-300"
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-slate-600">{src.name}</span>
                            <span
                              className={`rounded px-1.5 py-0 text-[9px] font-semibold uppercase ${
                                src.status === "evaluation"
                                  ? "bg-amber-50 text-amber-600 border border-amber-200"
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                              }`}
                            >
                              {src.status}
                            </span>
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-slate-600 transition"
                            >
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
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
          <p className="text-[10px] text-slate-400 pt-1">
            Full source and license registry:{" "}
            <a
              href="https://github.com/prathamesh55-MAV239/CaloLens/blob/main/SOURCES.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
            >
              SOURCES.md
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
