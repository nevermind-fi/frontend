"use client";

import { Icon } from "@iconify/react";
import type { AllocationRecommendation } from "@/lib/cre-client";

interface AIRecommendationProps {
  recommendation: AllocationRecommendation;
  onApply?: () => void;
  isApplying?: boolean;
}

const riskLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Very Low", color: "text-emerald-400" },
  2: { label: "Low", color: "text-emerald-400" },
  3: { label: "Low-Med", color: "text-emerald-400" },
  4: { label: "Medium", color: "text-yellow-400" },
  5: { label: "Medium", color: "text-yellow-400" },
  6: { label: "Med-High", color: "text-yellow-400" },
  7: { label: "High", color: "text-orange-400" },
  8: { label: "High", color: "text-orange-400" },
  9: { label: "Very High", color: "text-red-400" },
  10: { label: "Extreme", color: "text-red-400" },
};

export function AIRecommendation({ recommendation, onApply, isApplying }: AIRecommendationProps) {
  const risk = riskLabels[recommendation.riskScore] ?? { label: "Unknown", color: "text-neutral-400" };

  return (
    <div className="rounded-2xl border border-neutral-800/50 bg-neutral-900/60 animate-fade-in">
      <div className="px-5 py-4 border-b border-neutral-800/50 flex items-center gap-2">
        <Icon icon="solar:stars-linear" className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-semibold text-white">AI Recommendation</h2>
      </div>

      <div className="px-5 py-4 space-y-4">
        <p className="text-sm text-neutral-300 leading-relaxed">{recommendation.summary}</p>

        <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-neutral-800/50 border border-neutral-800/50">
          <Icon icon="solar:shield-warning-linear" className="h-4 w-4 text-neutral-500 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-neutral-500">Risk Score</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 transition-all duration-500"
                  style={{ width: `${recommendation.riskScore * 10}%` }}
                />
              </div>
              <span
                className={`text-xs font-medium ${risk.color}`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {recommendation.riskScore}/10 {risk.label}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
            Recommended Allocation
          </p>
          {recommendation.allocations.map((alloc) => (
            <div key={`${alloc.protocol}-${alloc.chain}`} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-300">
                  {alloc.protocol}{" "}
                  <span className="text-neutral-500">/ {alloc.chain}</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                    {alloc.currentApy}%
                  </span>
                  <span className="text-white font-medium" style={{ fontFamily: "var(--font-mono)" }}>
                    {alloc.allocationPct}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 ease-out"
                  style={{ width: `${alloc.allocationPct}%` }}
                />
              </div>
              <p className="text-xs text-neutral-600">{alloc.reasoning}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onApply}
          disabled={isApplying}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isApplying ? (
            <>
              <Icon icon="solar:refresh-linear" className="h-4 w-4 animate-spin" />
              Executing on-chain...
            </>
          ) : (
            <>
              <Icon icon="solar:transfer-horizontal-linear" className="h-4 w-4" />
              Apply Rebalance
            </>
          )}
        </button>
      </div>
    </div>
  );
}
