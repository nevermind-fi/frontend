"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

interface YieldRow {
  protocol: string;
  chain: string;
  apy: number;
  tvl: number;
  tvlFormatted: string;
}

interface ProtocolGroup {
  protocol: string;
  bestApy: number;
  totalTvl: number;
  totalTvlFormatted: string;
  chains: Array<{ chain: string; apy: number; tvl: number; tvlFormatted: string }>;
}

const ALLOWED_PROJECTS = ["aave-v3", "compound-v3", "morpho"];
const ALLOWED_CHAINS = ["Ethereum", "Arbitrum", "Optimism", "Base"];

const PROJECT_LABELS: Record<string, string> = {
  "aave-v3": "Aave V3",
  "compound-v3": "Compound V3",
  morpho: "Morpho",
};

function formatTvl(tvlUsd: number): string {
  if (tvlUsd >= 1_000_000_000) {
    return `${(tvlUsd / 1_000_000_000).toFixed(1)}B`;
  }
  if (tvlUsd >= 1_000_000) {
    return `${Math.round(tvlUsd / 1_000_000)}M`;
  }
  return `${Math.round(tvlUsd / 1_000)}K`;
}

function groupByProtocol(rows: YieldRow[]): ProtocolGroup[] {
  const map = new Map<string, YieldRow[]>();
  for (const row of rows) {
    const existing = map.get(row.protocol) ?? [];
    existing.push(row);
    map.set(row.protocol, existing);
  }

  return Array.from(map.entries())
    .map(([protocol, chains]) => {
      const sorted = chains.sort((a, b) => b.tvl - a.tvl);
      const totalTvl = chains.reduce((sum, c) => sum + c.tvl, 0);
      const bestApy = Math.max(...chains.map((c) => c.apy));
      return {
        protocol,
        bestApy,
        totalTvl,
        totalTvlFormatted: formatTvl(totalTvl),
        chains: sorted.map((c) => ({
          chain: c.chain,
          apy: c.apy,
          tvl: c.tvl,
          tvlFormatted: c.tvlFormatted,
        })),
      };
    })
    .sort((a, b) => b.totalTvl - a.totalTvl);
}

export function YieldTable() {
  const [groups, setGroups] = useState<ProtocolGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchYields() {
      try {
        const response = await fetch("https://yields.llama.fi/pools");
        if (!response.ok) {
          throw new Error(`Failed to fetch yields: ${response.status}`);
        }

        const json = await response.json();
        const pools: Array<{
          pool: string;
          chain: string;
          project: string;
          symbol: string;
          apy: number;
          tvlUsd: number;
          stablecoin: boolean;
        }> = json.data;

        const filtered = pools.filter(
          (p) =>
            p.stablecoin &&
            p.symbol?.toUpperCase().includes("USDC") &&
            ALLOWED_PROJECTS.includes(p.project) &&
            ALLOWED_CHAINS.includes(p.chain)
        );

        // Deduplicate: keep highest-TVL pool per protocol+chain
        const bestByKey = new Map<string, (typeof filtered)[0]>();
        for (const pool of filtered) {
          const key = `${pool.project}-${pool.chain}`;
          const existing = bestByKey.get(key);
          if (!existing || pool.tvlUsd > existing.tvlUsd) {
            bestByKey.set(key, pool);
          }
        }

        const rows: YieldRow[] = Array.from(bestByKey.values()).map((p) => ({
          protocol: PROJECT_LABELS[p.project] ?? p.project,
          chain: p.chain,
          apy: Math.round(p.apy * 100) / 100,
          tvl: p.tvlUsd,
          tvlFormatted: formatTvl(p.tvlUsd),
        }));

        if (!cancelled) {
          setGroups(groupByProtocol(rows));
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load yields");
          setLoading(false);
        }
      }
    }

    fetchYields();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-800/50 bg-neutral-900/60 overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-800/50 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Available Yields</h2>
        {!loading && !error && (
          <span className="text-[10px] text-neutral-600 uppercase tracking-wider">Live via DeFi Llama</span>
        )}
      </div>
      {loading ? (
        <div className="px-5 py-10 flex flex-col items-center gap-3">
          <Icon icon="solar:refresh-linear" className="h-5 w-5 text-neutral-600 animate-spin" />
          <p className="text-sm text-neutral-500">Fetching live yield data...</p>
        </div>
      ) : error ? (
        <div className="px-5 py-10 flex flex-col items-center gap-3">
          <Icon icon="solar:danger-circle-linear" className="h-5 w-5 text-red-400/60" />
          <p className="text-sm text-red-400/80">{error}</p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-800/30">
          {groups.map((group) => (
            <div key={group.protocol} className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{group.protocol}</span>
                  <span
                    className="text-[11px] text-emerald-400 font-medium"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    up to {group.bestApy}%
                  </span>
                </div>
                <span
                  className="text-xs text-neutral-600"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  TVL ${group.totalTvlFormatted}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {group.chains.map((chain) => (
                  <div
                    key={chain.chain}
                    className="rounded-lg border border-neutral-800/40 bg-neutral-800/20 px-3 py-2.5 hover:border-neutral-700/50 transition-colors"
                  >
                    <p className="text-xs text-neutral-500 mb-1">{chain.chain}</p>
                    <p
                      className="text-sm font-medium text-emerald-400"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {chain.apy}%
                    </p>
                    <p
                      className="text-[11px] text-neutral-600 mt-0.5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      ${chain.tvlFormatted}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
