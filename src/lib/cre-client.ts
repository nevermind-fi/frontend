export interface CREStep {
  name: string;
  status: "pending" | "running" | "completed" | "error";
  description: string;
  data?: unknown;
  duration?: number;
}

export interface AllocationRecommendation {
  allocations: Array<{
    protocol: string;
    chain: string;
    allocationPct: number;
    reasoning: string;
    currentApy: number;
  }>;
  summary: string;
  riskScore: number;
}

export interface CREWorkflowResult {
  status: "running" | "completed" | "error";
  steps: CREStep[];
  recommendation?: AllocationRecommendation;
  timestamp: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const RECOMMENDATIONS: Record<string, AllocationRecommendation> = {
  Conservative: {
    allocations: [
      {
        protocol: "Aave V3",
        chain: "Ethereum",
        allocationPct: 50,
        reasoning: "Highest TVL and battle-tested security on mainnet",
        currentApy: 4.2,
      },
      {
        protocol: "Compound V3",
        chain: "Ethereum",
        allocationPct: 35,
        reasoning: "Second largest lending protocol, strong audit history",
        currentApy: 3.8,
      },
      {
        protocol: "Aave V3",
        chain: "Arbitrum",
        allocationPct: 15,
        reasoning: "Small L2 allocation for marginal yield improvement",
        currentApy: 5.1,
      },
    ],
    summary:
      "Conservative allocation favoring mainnet blue-chip protocols. 85% on Ethereum for maximum security, 15% on Arbitrum for yield pickup. Expected blended APY: 4.15%.",
    riskScore: 2,
  },
  Balanced: {
    allocations: [
      {
        protocol: "Aave V3",
        chain: "Ethereum",
        allocationPct: 35,
        reasoning: "Core position in the most liquid lending market",
        currentApy: 4.2,
      },
      {
        protocol: "Aave V3",
        chain: "Arbitrum",
        allocationPct: 30,
        reasoning: "Higher APY on L2 with acceptable bridge risk",
        currentApy: 5.1,
      },
      {
        protocol: "Compound V3",
        chain: "Ethereum",
        allocationPct: 20,
        reasoning: "Protocol diversification on mainnet",
        currentApy: 3.8,
      },
      {
        protocol: "Aave V3",
        chain: "Optimism",
        allocationPct: 15,
        reasoning: "Additional L2 exposure for yield optimization",
        currentApy: 4.8,
      },
    ],
    summary:
      "Balanced mix across chains and protocols. 55% on Ethereum, 45% on L2s. Diversified across 3 venues for risk-adjusted returns. Expected blended APY: 4.52%.",
    riskScore: 5,
  },
  Aggressive: {
    allocations: [
      {
        protocol: "Morpho",
        chain: "Ethereum",
        allocationPct: 30,
        reasoning: "Highest mainnet yield via optimized peer-to-peer matching",
        currentApy: 6.2,
      },
      {
        protocol: "Aave V3",
        chain: "Arbitrum",
        allocationPct: 30,
        reasoning: "Best risk-adjusted L2 yield on established protocol",
        currentApy: 5.1,
      },
      {
        protocol: "Aave V3",
        chain: "Optimism",
        allocationPct: 25,
        reasoning: "Strong L2 yield with growing TVL",
        currentApy: 4.8,
      },
      {
        protocol: "Aave V3",
        chain: "Ethereum",
        allocationPct: 15,
        reasoning: "Small mainnet anchor for liquidity access",
        currentApy: 4.2,
      },
    ],
    summary:
      "Aggressive yield maximization across chains. Heavy L2 and Morpho exposure for highest returns. 45% mainnet, 55% L2. Expected blended APY: 5.28%.",
    riskScore: 8,
  },
};

export type WorkflowProgressCallback = (result: CREWorkflowResult) => void;

export async function simulateCREWorkflow(
  riskProfile: string,
  onProgress?: WorkflowProgressCallback
): Promise<CREWorkflowResult> {
  const steps: CREStep[] = [
    {
      name: "Fetch Yield Data",
      status: "pending",
      description: "Querying yield rates from Aave, Compound, and Morpho across chains",
    },
    {
      name: "Read Vault State",
      status: "pending",
      description: "Reading current vault allocations and balances on-chain",
    },
    {
      name: "LLM Analysis",
      status: "pending",
      description: `Running AI analysis for ${riskProfile} risk profile`,
    },
    {
      name: "Execute Rebalance",
      status: "pending",
      description: "Submitting rebalance transactions via CRE DON",
    },
  ];

  const result: CREWorkflowResult = {
    status: "running",
    steps: [...steps],
    timestamp: new Date().toISOString(),
  };

  const durations = [1200, 800, 2500, 1500];

  for (let i = 0; i < steps.length; i++) {
    result.steps[i] = { ...result.steps[i], status: "running" };
    onProgress?.({ ...result, steps: [...result.steps] });

    await delay(durations[i]);

    result.steps[i] = {
      ...result.steps[i],
      status: "completed",
      duration: durations[i],
    };
    onProgress?.({ ...result, steps: [...result.steps] });
  }

  const profile = riskProfile in RECOMMENDATIONS ? riskProfile : "Balanced";
  result.status = "completed";
  result.recommendation = RECOMMENDATIONS[profile];
  onProgress?.({ ...result, steps: [...result.steps] });

  return result;
}
