"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import type { Portfolio } from "@/lib/mock-data";

type RiskProfile = Portfolio["riskProfile"];

interface RiskSelectorProps {
  defaultValue?: RiskProfile;
  onChange?: (value: RiskProfile) => void;
}

const profiles: { value: RiskProfile; label: string; icon: string; description: string }[] = [
  {
    value: "Conservative",
    label: "Conservative",
    icon: "solar:shield-linear",
    description: "Lower yields, minimal risk",
  },
  {
    value: "Balanced",
    label: "Balanced",
    icon: "solar:scale-linear",
    description: "Moderate yields, managed risk",
  },
  {
    value: "Aggressive",
    label: "Aggressive",
    icon: "solar:bolt-linear",
    description: "Maximum yields, higher risk",
  },
];

export function RiskSelector({ defaultValue = "Balanced", onChange }: RiskSelectorProps) {
  const [selected, setSelected] = useState<RiskProfile>(defaultValue);

  function handleSelect(value: RiskProfile) {
    setSelected(value);
    onChange?.(value);
  }

  return (
    <div className="rounded-2xl border border-neutral-800/50 bg-neutral-900/60 p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Risk Profile</h2>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {profiles.map((profile) => {
          const isSelected = selected === profile.value;
          return (
            <button
              key={profile.value}
              onClick={() => handleSelect(profile.value)}
              className={`rounded-xl border p-2.5 text-left transition-colors min-w-0 ${
                isSelected
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-neutral-800/50 bg-neutral-900/60 hover:border-neutral-700"
              }`}
            >
              <Icon
                icon={profile.icon}
                className={`h-4 w-4 mb-1.5 ${isSelected ? "text-emerald-400" : "text-neutral-500"}`}
              />
              <p className={`text-xs font-medium truncate ${isSelected ? "text-emerald-400" : "text-neutral-300"}`}>
                {profile.label}
              </p>
              <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">
                {profile.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
