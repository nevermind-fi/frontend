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

export type WorkflowProgressCallback = (result: CREWorkflowResult) => void;

interface YieldPool {
  pool: string;
  chain: string;
  project: string;
  apy: number;
  tvlUsd: number;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ALLOWED_PROJECTS = ["aave-v3", "compound-v3", "morpho"];
const ALLOWED_CHAINS = ["Ethereum", "Arbitrum", "Optimism"];

async function fetchYieldData(): Promise<YieldPool[]> {
  const response = await fetch("https://yields.llama.fi/pools");
  if (!response.ok) {
    throw new Error(`DeFi Llama API error: ${response.status}`);
  }

  const json = await response.json();
  const pools: Array<{
    pool: string;
    chain: string;
    project: string;
    apy: number;
    tvlUsd: number;
    stablecoin: boolean;
    symbol: string;
  }> = json.data;

  return pools
    .filter(
      (p) =>
        p.stablecoin &&
        p.symbol?.toUpperCase().includes("USDC") &&
        ALLOWED_PROJECTS.includes(p.project) &&
        ALLOWED_CHAINS.includes(p.chain)
    )
    .map((p) => ({
      pool: p.pool,
      chain: p.chain,
      project: p.project,
      apy: Math.round(p.apy * 100) / 100,
      tvlUsd: p.tvlUsd,
    }))
    .sort((a, b) => b.tvlUsd - a.tvlUsd)
    .slice(0, 15);
}

async function analyzeWithLLM(
  yieldData: YieldPool[],
  riskProfile: string
): Promise<AllocationRecommendation> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ yieldData, riskProfile }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Analysis API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  return data as AllocationRecommendation;
}

export async function simulateCREWorkflow(
  riskProfile: string,
  onProgress?: WorkflowProgressCallback
): Promise<CREWorkflowResult> {
  const steps: CREStep[] = [
    {
      name: "Fetch Yield Data",
      status: "pending",
      description:
        "Querying yield rates from Aave, Compound, and Morpho across chains",
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

  // --- Step 1: Fetch Yield Data (REAL) ---
  result.steps[0] = { ...result.steps[0], status: "running" };
  onProgress?.({ ...result, steps: [...result.steps] });

  let yieldData: YieldPool[];
  const step1Start = Date.now();
  try {
    yieldData = await fetchYieldData();
  } catch (error) {
    result.steps[0] = {
      ...result.steps[0],
      status: "error",
      duration: Date.now() - step1Start,
    };
    result.status = "error";
    onProgress?.({ ...result, steps: [...result.steps] });
    throw error;
  }
  result.steps[0] = {
    ...result.steps[0],
    status: "completed",
    data: yieldData,
    duration: Date.now() - step1Start,
  };
  onProgress?.({ ...result, steps: [...result.steps] });

  // --- Step 2: Read Vault State (simulated) ---
  result.steps[1] = { ...result.steps[1], status: "running" };
  onProgress?.({ ...result, steps: [...result.steps] });

  await delay(500);

  result.steps[1] = {
    ...result.steps[1],
    status: "completed",
    duration: 500,
  };
  onProgress?.({ ...result, steps: [...result.steps] });

  // --- Step 3: LLM Analysis (REAL via API route) ---
  result.steps[2] = { ...result.steps[2], status: "running" };
  onProgress?.({ ...result, steps: [...result.steps] });

  let recommendation: AllocationRecommendation;
  const step3Start = Date.now();
  try {
    recommendation = await analyzeWithLLM(yieldData, riskProfile);
  } catch (error) {
    result.steps[2] = {
      ...result.steps[2],
      status: "error",
      duration: Date.now() - step3Start,
    };
    result.status = "error";
    onProgress?.({ ...result, steps: [...result.steps] });
    throw error;
  }
  result.steps[2] = {
    ...result.steps[2],
    status: "completed",
    data: recommendation,
    duration: Date.now() - step3Start,
  };
  onProgress?.({ ...result, steps: [...result.steps] });

  // --- Step 4: Execute Rebalance (simulated) ---
  result.steps[3] = { ...result.steps[3], status: "running" };
  onProgress?.({ ...result, steps: [...result.steps] });

  await delay(500);

  result.steps[3] = {
    ...result.steps[3],
    status: "completed",
    duration: 500,
  };
  onProgress?.({ ...result, steps: [...result.steps] });

  // --- Done ---
  result.status = "completed";
  result.recommendation = recommendation;
  onProgress?.({ ...result, steps: [...result.steps] });

  return result;
}
