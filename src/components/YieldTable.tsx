"use client";

const yields = [
  { protocol: "Aave V3", chain: "Ethereum", asset: "USDC", apy: 4.2, tvl: "2.1B" },
  { protocol: "Aave V3", chain: "Arbitrum", asset: "USDC", apy: 5.1, tvl: "890M" },
  { protocol: "Compound V3", chain: "Ethereum", asset: "USDC", apy: 3.8, tvl: "1.5B" },
  { protocol: "Morpho", chain: "Ethereum", asset: "USDC", apy: 6.2, tvl: "320M" },
  { protocol: "Aave V3", chain: "Optimism", asset: "USDC", apy: 4.8, tvl: "450M" },
];

export function YieldTable() {
  return (
    <div className="rounded-2xl border border-neutral-800/50 bg-neutral-900/60 overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-800/50">
        <h2 className="text-sm font-semibold text-white">
          Available Yields
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-900/80 border-b border-neutral-800/50 text-xs text-neutral-500 uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">Protocol</th>
              <th className="text-left px-5 py-3 font-medium">Chain</th>
              <th className="text-left px-5 py-3 font-medium">Asset</th>
              <th className="text-right px-5 py-3 font-medium">APY</th>
              <th className="text-right px-5 py-3 font-medium">TVL</th>
            </tr>
          </thead>
          <tbody>
            {yields.map((row, i) => (
              <tr
                key={`${row.protocol}-${row.chain}`}
                className={
                  i < yields.length - 1
                    ? "border-b border-neutral-800/30"
                    : ""
                }
              >
                <td className="px-5 py-3 text-sm text-white font-medium">
                  {row.protocol}
                </td>
                <td className="px-5 py-3 text-sm text-neutral-300">{row.chain}</td>
                <td className="px-5 py-3 text-sm text-neutral-300">{row.asset}</td>
                <td
                  className="px-5 py-3 text-right text-sm text-emerald-400"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {row.apy}%
                </td>
                <td
                  className="px-5 py-3 text-right text-sm text-neutral-400"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ${row.tvl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
