"use client";

import { useState, useCallback } from "react";
import { PortfolioOverview } from "./PortfolioOverview";
import { PositionsTable } from "./PositionsTable";
import { AgentLog } from "./AgentLog";
import { RiskSelector } from "./RiskSelector";
import { DepositForm } from "./DepositForm";
import { YieldTable } from "./YieldTable";
import { YieldChart } from "./YieldChart";
import { CREWorkflowPanel } from "./CREWorkflowPanel";
import { AIRecommendation } from "./AIRecommendation";
import {
  mockPortfolio,
  mockPositions,
  mockAgentLogs,
  type AgentLogEntry,
  type Portfolio,
} from "@/lib/mock-data";
import type { CREWorkflowResult, AllocationRecommendation } from "@/lib/cre-client";

export function Dashboard() {
  const [riskProfile, setRiskProfile] = useState<Portfolio["riskProfile"]>(
    mockPortfolio.riskProfile
  );
  const [recommendation, setRecommendation] =
    useState<AllocationRecommendation | null>(null);
  const [logs, setLogs] = useState<AgentLogEntry[]>(mockAgentLogs);

  const handleWorkflowComplete = useCallback((result: CREWorkflowResult) => {
    if (result.recommendation) {
      setRecommendation(result.recommendation);
    }
  }, []);

  const handleLogEntry = useCallback((entry: AgentLogEntry) => {
    setLogs((prev) => [...prev, entry]);
  }, []);

  const handleApplyRebalance = useCallback(() => {
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        action: "rebalance" as const,
        message: "Rebalance applied successfully based on AI recommendation",
        status: "completed" as const,
      },
    ]);
    setRecommendation(null);
  }, []);

  return (
    <div className="space-y-6">
      <PortfolioOverview portfolio={mockPortfolio} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <YieldChart />
          <PositionsTable positions={mockPositions} />
          <YieldTable />
          {recommendation && (
            <AIRecommendation
              recommendation={recommendation}
              onApply={handleApplyRebalance}
            />
          )}
        </div>
        <div className="space-y-6">
          <RiskSelector
            defaultValue={riskProfile}
            onChange={setRiskProfile}
          />
          <DepositForm />
          <CREWorkflowPanel
            riskProfile={riskProfile}
            onComplete={handleWorkflowComplete}
            onLogEntry={handleLogEntry}
          />
        </div>
      </div>

      <AgentLog logs={logs} />
    </div>
  );
}
