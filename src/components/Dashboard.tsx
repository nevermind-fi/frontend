"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { PortfolioOverview } from "./PortfolioOverview";
import { PositionsTable } from "./PositionsTable";
import { AgentLog } from "./AgentLog";
import { RiskSelector } from "./RiskSelector";
import { DepositForm } from "./DepositForm";
import { YieldTable } from "./YieldTable";
import { YieldChart } from "./YieldChart";
import { CREWorkflowPanel } from "./CREWorkflowPanel";
import { AIRecommendation } from "./AIRecommendation";
import type { AgentLogEntry, Portfolio, Position } from "@/lib/mock-data";
import type { CREWorkflowResult, AllocationRecommendation } from "@/lib/cre-client";
import { vaultContract } from "@/lib/contracts";

const RISK_LABELS: Record<number, Portfolio["riskProfile"]> = {
  0: "Conservative",
  1: "Balanced",
  2: "Aggressive",
};

const CHAIN_NAMES: Record<string, string> = {
  "1": "Ethereum",
  "42161": "Arbitrum",
  "10": "Optimism",
  "137": "Polygon",
  "8453": "Base",
};

function formatChainId(chainId: bigint): string {
  const id = chainId.toString();
  return CHAIN_NAMES[id] ?? `Chain ${id}`;
}

export function Dashboard() {
  const account = useActiveAccount();
  const userAddress = account?.address;

  // Read user's vault balance
  const { data: rawBalance } = useReadContract({
    contract: vaultContract,
    method: "function getBalance(address user) view returns (uint256)",
    params: [userAddress ?? "0x0000000000000000000000000000000000000000"],
    queryOptions: { enabled: !!userAddress },
  });

  // Read user's on-chain risk profile
  const { data: rawRiskProfile } = useReadContract({
    contract: vaultContract,
    method: "function getRiskProfile(address user) view returns (uint8)",
    params: [userAddress ?? "0x0000000000000000000000000000000000000000"],
    queryOptions: { enabled: !!userAddress },
  });

  // Read vault allocations (only when wallet is connected)
  const { data: rawAllocations } = useReadContract({
    contract: vaultContract,
    method:
      "function getAllocations() view returns ((string protocol, uint256 amount, uint256 chainId)[])",
    params: [],
    queryOptions: { enabled: !!userAddress },
  });

  // Derive risk profile label from on-chain value
  const onChainRiskLabel: Portfolio["riskProfile"] =
    rawRiskProfile !== undefined
      ? (RISK_LABELS[Number(rawRiskProfile)] ?? "Balanced")
      : "Balanced";

  const [riskProfile, setRiskProfile] =
    useState<Portfolio["riskProfile"] | null>(null);
  const [recommendation, setRecommendation] =
    useState<AllocationRecommendation | null>(null);
  const [appliedRecommendation, setAppliedRecommendation] =
    useState<AllocationRecommendation | null>(() => {
      if (typeof window === "undefined") return null;
      try {
        const saved = localStorage.getItem("nvm:applied");
        return saved ? JSON.parse(saved) : null;
      } catch { return null; }
    });
  const [logs, setLogs] = useState<AgentLogEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("nvm:logs");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Persist to localStorage
  useEffect(() => {
    if (appliedRecommendation) {
      localStorage.setItem("nvm:applied", JSON.stringify(appliedRecommendation));
    } else {
      localStorage.removeItem("nvm:applied");
    }
  }, [appliedRecommendation]);

  useEffect(() => {
    if (logs.length > 0) {
      localStorage.setItem("nvm:logs", JSON.stringify(logs));
    }
  }, [logs]);

  // Use on-chain value until user explicitly changes it
  const activeRiskProfile = riskProfile ?? onChainRiskLabel;

  // Compute portfolio from real on-chain data
  const totalDeposited = rawBalance
    ? Number(rawBalance) / 1e6
    : 0;

  // Use applied recommendation for persistent stats, or pending recommendation for preview
  const activeAllocation = appliedRecommendation ?? recommendation;

  const currentYield = activeAllocation
    ? activeAllocation.allocations.reduce(
        (sum, a) => sum + (a.currentApy * a.allocationPct) / 100,
        0
      )
    : 0;

  const portfolio: Portfolio = useMemo(
    () => ({
      totalDeposited,
      currentYield: Math.round(currentYield * 100) / 100,
      estimatedAnnualReturn:
        Math.round(totalDeposited * currentYield) / 100,
      riskProfile: activeRiskProfile,
    }),
    [totalDeposited, currentYield, activeRiskProfile]
  );

  // Build positions from applied recommendation, or fall back to on-chain allocations
  // Dedup by protocol+chain: sum amounts, weighted-average APY
  // Only show positions when a wallet is connected
  const positions: Position[] = useMemo(() => {
    if (!userAddress) return [];
    if (appliedRecommendation && totalDeposited > 0) {
      const merged = new Map<string, { protocol: string; chain: string; amount: number; apySum: number }>();
      for (const alloc of appliedRecommendation.allocations) {
        const key = `${alloc.protocol}-${alloc.chain}`;
        const amount = Math.round(totalDeposited * alloc.allocationPct) / 100;
        const prev = merged.get(key);
        if (prev) {
          prev.apySum += alloc.currentApy * amount;
          prev.amount += amount;
        } else {
          merged.set(key, { protocol: alloc.protocol, chain: alloc.chain, amount, apySum: alloc.currentApy * amount });
        }
      }
      return Array.from(merged.values()).map((m) => ({
        protocol: m.protocol,
        chain: m.chain,
        amount: m.amount,
        apy: Math.round((m.apySum / m.amount) * 100) / 100,
        status: "active" as const,
      }));
    }
    if (!rawAllocations || rawAllocations.length === 0) return [];
    return rawAllocations.map(
      (alloc: { protocol: string; amount: bigint; chainId: bigint }) => ({
        protocol: alloc.protocol,
        chain: formatChainId(alloc.chainId),
        amount: Number(alloc.amount) / 1e6,
        apy: 0,
        status: "active" as const,
      })
    );
  }, [userAddress, appliedRecommendation, totalDeposited, rawAllocations]);

  const handleWorkflowComplete = useCallback((result: CREWorkflowResult) => {
    if (result.recommendation) {
      setRecommendation(result.recommendation);
    }
  }, []);

  const handleLogEntry = useCallback((entry: AgentLogEntry) => {
    setLogs((prev) => [...prev, entry]);
  }, []);

  const [isRebalancing, setIsRebalancing] = useState(false);

  const handleApplyRebalance = useCallback(async () => {
    if (!recommendation || totalDeposited <= 0) return;

    setIsRebalancing(true);
    const allocationSummary = recommendation.allocations
      .map((a) => `${a.allocationPct}% → ${a.protocol} (${a.chain})`)
      .join(", ");

    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        action: "rebalance" as const,
        message: `Submitting rebalance on-chain: ${allocationSummary}`,
        status: "pending" as const,
      },
    ]);

    try {
      const response = await fetch("/api/rebalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allocations: recommendation.allocations,
          totalDeposited,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Rebalance failed");
      }

      setAppliedRecommendation(recommendation);
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          action: "rebalance" as const,
          message: `Rebalance confirmed on-chain (tx: ${data.txHash?.slice(0, 10)}...)`,
          status: "completed" as const,
        },
      ]);
      setRecommendation(null);
    } catch (err) {
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          action: "rebalance" as const,
          message: `Rebalance failed: ${err instanceof Error ? err.message : "Unknown error"}`,
          status: "failed" as const,
        },
      ]);
    } finally {
      setIsRebalancing(false);
    }
  }, [recommendation, totalDeposited]);

  return (
    <div className="space-y-6">
      <PortfolioOverview portfolio={portfolio} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {userAddress && <YieldChart />}
          {userAddress && <PositionsTable positions={positions} />}
          <YieldTable />
          {recommendation && (
            <AIRecommendation
              recommendation={recommendation}
              onApply={handleApplyRebalance}
              isApplying={isRebalancing}
            />
          )}
        </div>
        <div className="space-y-6">
          <RiskSelector
            defaultValue={activeRiskProfile}
            onChange={setRiskProfile}
          />
          <DepositForm />
          <CREWorkflowPanel
            riskProfile={activeRiskProfile}
            onComplete={handleWorkflowComplete}
            onLogEntry={handleLogEntry}
          />
        </div>
      </div>

      <AgentLog logs={logs} />
    </div>
  );
}
