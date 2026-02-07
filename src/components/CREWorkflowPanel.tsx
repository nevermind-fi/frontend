"use client";

import { useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import {
  simulateCREWorkflow,
  type CREWorkflowResult,
  type CREStep,
} from "@/lib/cre-client";
import type { AgentLogEntry } from "@/lib/mock-data";

interface CREWorkflowPanelProps {
  riskProfile: string;
  onComplete?: (result: CREWorkflowResult) => void;
  onLogEntry?: (entry: AgentLogEntry) => void;
}

const stepIcons: Record<string, string> = {
  "Fetch Yield Data": "solar:database-linear",
  "Read Vault State": "solar:book-2-linear",
  "LLM Analysis": "solar:cpu-bolt-linear",
  "Execute Rebalance": "solar:transfer-horizontal-linear",
};

const statusConfig: Record<CREStep["status"], { icon: string; color: string; spin?: boolean }> = {
  pending: { icon: "solar:minus-circle-linear", color: "text-neutral-600" },
  running: { icon: "solar:refresh-linear", color: "text-emerald-400", spin: true },
  completed: { icon: "solar:check-circle-linear", color: "text-emerald-400" },
  error: { icon: "solar:danger-circle-linear", color: "text-red-400" },
};

const stepToLogAction: Record<string, AgentLogEntry["action"]> = {
  "Fetch Yield Data": "analysis",
  "Read Vault State": "analysis",
  "LLM Analysis": "llm",
  "Execute Rebalance": "rebalance",
};

export function CREWorkflowPanel({
  riskProfile,
  onComplete,
  onLogEntry,
}: CREWorkflowPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<CREStep[]>([]);

  const handleAnalyze = useCallback(async () => {
    setIsRunning(true);
    setSteps([]);

    const completedSteps = new Set<string>();

    const result = await simulateCREWorkflow(riskProfile, (progress) => {
      setSteps([...progress.steps]);

      for (const step of progress.steps) {
        if (step.status === "completed" && !completedSteps.has(step.name)) {
          completedSteps.add(step.name);
          onLogEntry?.({
            timestamp: new Date().toISOString(),
            action: stepToLogAction[step.name] ?? "analysis",
            message: `${step.name}: ${step.description}`,
            status: "completed",
          });
        }
      }
    });

    setIsRunning(false);
    onComplete?.(result);
  }, [riskProfile, onComplete, onLogEntry]);

  return (
    <div className="rounded-2xl border border-neutral-800/50 bg-neutral-900/60">
      <div className="px-5 py-4 border-b border-neutral-800/50 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">CRE Workflow</h2>
        {isRunning && (
          <Icon icon="solar:refresh-linear" className="h-4 w-4 text-emerald-400 animate-spin" />
        )}
      </div>

      {steps.length > 0 && (
        <div className="px-5 py-4 space-y-3">
          {steps.map((step, i) => {
            const config = statusConfig[step.status];
            const isLast = i === steps.length - 1;

            return (
              <div key={step.name} className="flex items-start gap-3 relative">
                {!isLast && (
                  <div className="absolute left-[9px] top-6 w-px h-[calc(100%+4px)] bg-neutral-800/50" />
                )}
                <div className="relative z-10 mt-0.5">
                  <Icon
                    icon={stepIcons[step.name] ?? "solar:minus-circle-linear"}
                    className={`h-[18px] w-[18px] ${config.color}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="feature-number"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className={`text-sm font-medium ${step.status === "pending" ? "text-neutral-500" : "text-neutral-200"}`}>
                      {step.name}
                    </p>
                    <Icon
                      icon={config.icon}
                      className={`h-3.5 w-3.5 ${config.color} ${config.spin ? "animate-spin" : ""}`}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">{step.description}</p>
                  {step.duration != null && (
                    <p className="text-xs text-neutral-600 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                      {(step.duration / 1000).toFixed(1)}s
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="px-5 py-4 border-t border-neutral-800/50">
        <button
          onClick={handleAnalyze}
          disabled={isRunning}
          className="w-full flex items-center justify-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 py-3 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <>
              <Icon icon="solar:refresh-linear" className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Icon icon="solar:magnifer-linear" className="h-4 w-4" />
              Analyze Yields
            </>
          )}
        </button>
      </div>
    </div>
  );
}
