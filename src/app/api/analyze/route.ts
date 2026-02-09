import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface YieldPool {
  pool: string;
  chain: string;
  project: string;
  apy: number;
  tvlUsd: number;
}

interface AnalyzeRequest {
  yieldData: YieldPool[];
  riskProfile: string;
}

function buildPrompt(riskProfile: string, yieldData: YieldPool[]): string {
  return `You are a DeFi yield optimization agent. Given the following USDC yield data and user risk profile, recommend an optimal allocation.

Risk Profile: ${riskProfile}
Available Yields: ${JSON.stringify(yieldData)}

Respond with ONLY valid JSON in this exact format:
{
  "allocations": [
    {"protocol": "...", "chain": "...", "allocationPct": 35, "reasoning": "...", "currentApy": 4.2}
  ],
  "summary": "one sentence summary",
  "riskScore": 5
}

Rules:
- allocationPct must sum to 100
- Conservative: favor high-TVL protocols on mainnet, max 20% on L2s
- Balanced: mix of mainnet and L2, diversify across 3-4 protocols
- Aggressive: maximize APY, heavier L2 exposure, include newer protocols`;
}

export async function POST(request: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: AnalyzeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { yieldData, riskProfile } = body;

  if (!yieldData || !Array.isArray(yieldData) || !riskProfile) {
    return NextResponse.json(
      { error: "Missing required fields: yieldData (array), riskProfile (string)" },
      { status: 400 }
    );
  }

  const allowedProfiles = ["Conservative", "Balanced", "Aggressive"];
  if (!allowedProfiles.includes(riskProfile)) {
    return NextResponse.json(
      { error: `Invalid risk profile. Must be one of: ${allowedProfiles.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const llmResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: buildPrompt(riskProfile, yieldData),
            },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      }
    );

    if (!llmResponse.ok) {
      const errorText = await llmResponse.text();
      return NextResponse.json(
        { error: `OpenRouter API error: ${llmResponse.status} - ${errorText}` },
        { status: 502 }
      );
    }

    const llmData = await llmResponse.json();
    const content = llmData.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content in LLM response" },
        { status: 502 }
      );
    }

    // Strip markdown code fences if the model wraps the JSON
    const cleaned = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const recommendation = JSON.parse(cleaned);

    // Basic shape validation
    if (
      !recommendation.allocations ||
      !Array.isArray(recommendation.allocations) ||
      typeof recommendation.summary !== "string" ||
      typeof recommendation.riskScore !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid recommendation shape from LLM" },
        { status: 502 }
      );
    }

    return NextResponse.json(recommendation);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error during analysis";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
