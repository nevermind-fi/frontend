"use client";

import { Icon } from "@iconify/react";
import type { Portfolio } from "@/lib/mock-data";

interface PortfolioOverviewProps {
  portfolio: Portfolio;
}

export function PortfolioOverview({ portfolio }: PortfolioOverviewProps) {
  const stats = [
    {
      label: "Total Deposited",
      value: `$${portfolio.totalDeposited.toLocaleString()}`,
      icon: "solar:wallet-money-linear",
      highlight: false,
    },
    {
      label: "Current Yield",
      value: `${portfolio.currentYield}%`,
      icon: "solar:graph-up-linear",
      highlight: true,
    },
    {
      label: "Est. Annual Return",
      value: `$${portfolio.estimatedAnnualReturn.toLocaleString()}`,
      icon: "solar:piggy-bank-linear",
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-neutral-800/50 bg-neutral-900/60 p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <Icon icon={stat.icon} className="h-5 w-5 text-neutral-500" />
            <span className="text-sm text-neutral-500">{stat.label}</span>
          </div>
          <p
            className={`text-2xl font-semibold ${
              stat.highlight ? "text-emerald-400" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
