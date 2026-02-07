export interface Position {
  protocol: string;
  chain: string;
  amount: number;
  apy: number;
  status: "active" | "pending" | "inactive";
}

export interface AgentLogEntry {
  timestamp: string;
  action: "analysis" | "llm" | "rebalance" | "deposit" | "withdraw";
  message: string;
  status: "completed" | "pending" | "failed";
}

export interface Portfolio {
  totalDeposited: number;
  currentYield: number;
  estimatedAnnualReturn: number;
  riskProfile: "Conservative" | "Balanced" | "Aggressive";
}

export const mockPositions: Position[] = [
  { protocol: "Aave V3", chain: "Ethereum", amount: 5000, apy: 4.2, status: "active" },
  { protocol: "Compound V3", chain: "Ethereum", amount: 3000, apy: 3.8, status: "active" },
  { protocol: "Aave V3", chain: "Arbitrum", amount: 2000, apy: 5.1, status: "active" },
];

export const mockAgentLogs: AgentLogEntry[] = [
  { timestamp: "2026-02-07T10:00:00Z", action: "analysis", message: "Fetched yield data from 3 protocols across 2 chains", status: "completed" },
  { timestamp: "2026-02-07T10:00:05Z", action: "llm", message: "AI recommends shifting 20% from Compound to Aave Arbitrum (higher APY)", status: "completed" },
  { timestamp: "2026-02-07T10:00:10Z", action: "rebalance", message: "Rebalance executed: moved 2000 USDC to Aave Arbitrum", status: "completed" },
];

export const mockPortfolio: Portfolio = {
  totalDeposited: 10000,
  currentYield: 4.5,
  estimatedAnnualReturn: 450,
  riskProfile: "Balanced",
};
