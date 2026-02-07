"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

const barData = [
  { day: "Mon", value: 72, apy: 4.8, active: true },
  { day: "Tue", value: 85, apy: 5.6, active: true },
  { day: "Wed", value: 92, apy: 6.1, active: true },
  { day: "Thu", value: 78, apy: 5.1, active: true },
  { day: "Fri", value: 88, apy: 5.8, active: true },
  { day: "Sat", value: 65, apy: 4.3, active: true },
  { day: "Sun", value: 40, apy: 2.6, active: false },
];

const AVG_APY = 5.2;

function StatsCard() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const displayApy = hoveredIdx !== null ? barData[hoveredIdx].apy : AVG_APY;
  const displayLabel = hoveredIdx !== null ? barData[hoveredIdx].day : "Avg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -5 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="card-glow rounded-2xl bg-neutral-900/80 backdrop-blur-sm border border-neutral-800/50 p-6 w-full max-w-[420px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-mono)" }}>
            $127.4K
          </p>
          <p className="text-sm text-neutral-500 mt-0.5">total yield generated</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-neutral-800 flex items-center justify-center">
          <Icon icon="solar:chart-2-linear" className="h-5 w-5 text-neutral-400" />
        </div>
      </div>

      {/* Chart label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-emerald-400 tracking-wider uppercase">Weekly APY</span>
        <div className="flex items-center gap-2">
          {hoveredIdx !== null && (
            <span className="text-[10px] text-neutral-600" style={{ fontFamily: "var(--font-mono)" }}>
              {displayLabel}
            </span>
          )}
          <span className="text-xs text-neutral-500 tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>
            {displayApy}%
          </span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1.5 h-28 mb-4" onMouseLeave={() => setHoveredIdx(null)}>
        {barData.map((bar, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <div
              key={bar.day}
              className="flex-1 flex flex-col items-center gap-1.5 h-full cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
            >
              <div className="w-full flex-1 flex items-end relative">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.08, ease: "easeOut" }}
                  className={`w-full rounded-sm transition-colors duration-150 ${
                    isHovered
                      ? "bg-emerald-400"
                      : bar.active
                        ? "bg-emerald-500/80"
                        : "bg-neutral-700"
                  }`}
                  style={{
                    height: `${bar.value}%`,
                    transformOrigin: "bottom",
                  }}
                />
              </div>
              <span className={`text-[10px] shrink-0 transition-colors duration-150 ${isHovered ? "text-emerald-400" : "text-neutral-600"}`}>
                {bar.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom metrics */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
        <div>
          <p className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-mono)" }}>4</p>
          <p className="text-xs text-neutral-500">protocols</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-mono)" }}>$42,805</p>
          <p className="text-xs text-neutral-500">auto-rebalanced</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Vortex beam — funnel to focal point */}
      <div className="beam-wrapper">
        <div className="beam-vortex" />
        <div className="beam-vortex-inner" />
        <div className="beam-focal" />
        <div className="beam-ring" />
        <div className="beam-particle-in" />
        <div className="beam-particle-in" />
        <div className="beam-particle-in" />
        <div className="beam-particle-out" />
        <div className="beam-particle-out" />
        <div className="beam-particle-out" />
      </div>

      {/* Vertical guide lines */}
      <div className="guide-line" style={{ left: "8.33%" }} />
      <div className="guide-line" style={{ left: "25%" }} />
      <div className="guide-line" style={{ left: "50%" }} />
      <div className="guide-line" style={{ left: "75%" }} />
      <div className="guide-line" style={{ left: "91.67%" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700/50 bg-neutral-900/50 backdrop-blur-sm px-4 py-1.5 mb-8"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-neutral-300">Powered by Chainlink CRE</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.1]"
            >
              The autonomous
              <br />
              yield infrastructure
              <br />
              <span className="text-neutral-500">for DeFi</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-neutral-400 leading-relaxed max-w-lg"
            >
              Nevermind handles yield analysis, rebalancing, and risk
              management so you can focus on your portfolio. AI-powered,
              verifiably executed on-chain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex items-center gap-4"
            >
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
              >
                Launch App
              </Link>
              <HoverBorderGradient
                as={Link}
                href="https://github.com"
                containerClassName="rounded-full"
                className="bg-neutral-950 text-neutral-300 flex items-center gap-2 text-sm font-medium"
              >
                Documentation
                <Icon icon="solar:document-text-linear" className="h-4 w-4" />
              </HoverBorderGradient>
            </motion.div>
          </div>

          {/* Right: floating dashboard card */}
          <div className="flex justify-center lg:justify-end">
            <StatsCard />
          </div>
        </div>
      </div>
    </section>
  );
}
