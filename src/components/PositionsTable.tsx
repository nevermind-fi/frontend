"use client";

import { Icon } from "@iconify/react";
import type { Position } from "@/lib/mock-data";

interface PositionsTableProps {
  positions: Position[];
}

export function PositionsTable({ positions }: PositionsTableProps) {
  return (
    <div className="rounded-2xl border border-neutral-800/50 bg-neutral-900/60 overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-800/50">
        <h2 className="text-sm font-semibold text-white">Current Positions</h2>
      </div>
      {positions.length === 0 ? (
        <div className="px-5 py-10 flex flex-col items-center gap-3">
          <Icon icon="solar:wallet-money-linear" className="h-6 w-6 text-neutral-700" />
          <p className="text-sm text-neutral-500">No active positions</p>
          <p className="text-xs text-neutral-600 max-w-xs text-center">
            Deposit USDC and run the AI agent to get allocation recommendations.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-900/80 border-b border-neutral-800/50 text-[11px] text-neutral-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Protocol</th>
                <th className="text-left px-5 py-3 font-medium">Chain</th>
                <th className="text-right px-5 py-3 font-medium">Amount</th>
                <th className="text-right px-5 py-3 font-medium">APY</th>
                <th className="text-right px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, i) => (
                <tr
                  key={`${position.protocol}-${position.chain}`}
                  className={`transition-colors hover:bg-neutral-800/20 ${
                    i < positions.length - 1 ? "border-b border-neutral-800/30" : ""
                  }`}
                >
                  <td className="px-5 py-3 text-sm text-white font-medium">
                    {position.protocol}
                  </td>
                  <td className="px-5 py-3 text-sm text-neutral-400">
                    {position.chain}
                  </td>
                  <td
                    className="px-5 py-3 text-right text-sm text-white"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    ${position.amount.toLocaleString()}
                  </td>
                  <td
                    className="px-5 py-3 text-right text-sm text-emerald-400 font-medium"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {position.apy}%
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      {position.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
