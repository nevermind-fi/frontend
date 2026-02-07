"use client";

import { useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { AgentLogEntry } from "@/lib/mock-data";

interface AgentLogProps {
  logs: AgentLogEntry[];
}

const actionIcons: Record<AgentLogEntry["action"], string> = {
  analysis: "solar:chart-square-linear",
  llm: "solar:cpu-bolt-linear",
  rebalance: "solar:transfer-horizontal-linear",
  deposit: "solar:arrow-down-linear",
  withdraw: "solar:arrow-up-linear",
};

const statusIcons: Record<AgentLogEntry["status"], string> = {
  completed: "solar:check-circle-linear",
  pending: "solar:clock-circle-linear",
  failed: "solar:close-circle-linear",
};

const statusColors: Record<AgentLogEntry["status"], string> = {
  completed: "text-emerald-400",
  pending: "text-yellow-400",
  failed: "text-red-400",
};

export function AgentLog({ logs }: AgentLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  return (
    <div className="rounded-2xl border border-neutral-800/50 bg-neutral-900/60">
      <div className="px-5 py-4 border-b border-neutral-800/50">
        <h2 className="text-sm font-semibold text-white">Agent Activity</h2>
      </div>
      {logs.length === 0 ? (
        <div className="px-5 py-10 flex flex-col items-center gap-3">
          <Icon icon="solar:clock-circle-linear" className="h-6 w-6 text-neutral-700" />
          <p className="text-sm text-neutral-500">No activity yet</p>
          <p className="text-xs text-neutral-600 max-w-xs text-center">
            Click &quot;Analyze Yields&quot; to run the CRE workflow. Agent actions will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-800/30 max-h-80 overflow-y-auto">
          {logs.map((log, i) => (
            <div
              key={`${log.timestamp}-${i}`}
              className="px-5 py-3 flex items-start gap-3 animate-fade-in"
              style={{ animationDelay: `${Math.min(i, 5) * 100}ms` }}
            >
              <Icon
                icon={actionIcons[log.action]}
                className="h-4 w-4 text-neutral-500 mt-0.5 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-300">{log.message}</p>
                <p className="text-xs text-neutral-600 mt-1" style={{ fontFamily: "var(--font-mono)" }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <Icon
                icon={statusIcons[log.status]}
                className={`h-4 w-4 shrink-0 mt-0.5 ${statusColors[log.status]}`}
              />
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
