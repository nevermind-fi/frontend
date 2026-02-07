"use client";

import { Icon } from "@iconify/react";
import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Connect & Deposit",
    description:
      "Connect your wallet using email, social login, or any Web3 wallet via thirdweb. Deposit USDC into the Nevermind vault. Set your risk tolerance to Conservative, Balanced, or Aggressive.",
    icon: "solar:wallet-money-linear",
    details: ["Email / social login supported", "USDC deposits with instant confirmation", "Configurable risk profiles"],
  },
  {
    number: "02",
    title: "AI Analyzes Yields",
    description:
      "The CRE workflow triggers on schedule. It fetches live yield data from DeFi Llama across Aave V3 and Compound V3 on Ethereum and Arbitrum, then feeds it to GPT-4 for analysis.",
    icon: "solar:cpu-bolt-linear",
    details: ["DeFi Llama real-time data", "GPT-4 risk-adjusted analysis", "Chainlink DON consensus verification"],
  },
  {
    number: "03",
    title: "Auto-Rebalance",
    description:
      "Based on the AI recommendation, the CRE workflow executes an on-chain rebalance via a DON-signed report. Your funds automatically move to higher-yielding positions.",
    icon: "solar:transfer-horizontal-linear",
    details: ["DON-signed transaction execution", "Threshold-based triggers", "Full transaction history on-chain"],
  },
];

export function HowItWorksDetail() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background guide lines */}
      <div className="guide-line" style={{ left: "25%" }} />
      <div className="guide-line" style={{ left: "75%" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="feature-number mb-3">WORKFLOW</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            From deposit to yield in three steps
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            Every step is verifiably executed on Chainlink&apos;s Decentralized Oracle Network.
            No single point of failure. No trust assumptions.
          </p>
        </motion.div>

        <div className="space-y-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="feature-number text-lg">{step.number}</span>
                  <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800/50 flex items-center justify-center">
                    <Icon icon={step.icon} className="h-5 w-5 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-neutral-400 leading-relaxed mb-6">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-neutral-300">
                      <Icon icon="solar:check-circle-linear" className="h-4 w-4 text-emerald-500 shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="card-glow rounded-2xl bg-neutral-900/60 border border-neutral-800/50 p-6 h-48 sm:h-56 overflow-hidden">
                  {step.number === "01" && (
                    <div className="h-full flex flex-col justify-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                          <Icon icon="solar:wallet-linear" className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Deposited</p>
                          <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-mono)" }}>10,000.00 USDC</p>
                        </div>
                      </div>
                      <div className="h-px bg-neutral-800/50" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">Risk Profile</span>
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Balanced</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">Status</span>
                        <span className="flex items-center gap-1 text-xs text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Active</span>
                      </div>
                    </div>
                  )}
                  {step.number === "02" && (
                    <div className="h-full flex flex-col justify-center font-mono text-xs leading-relaxed">
                      <p className="text-neutral-600">{">"} Fetching yields from DeFi Llama...</p>
                      <p className="text-emerald-400/70">{">"} Aave V3 ETH: <span className="text-white">4.82%</span> APY</p>
                      <p className="text-emerald-400/70">{">"} Compound V3 ARB: <span className="text-white">5.14%</span> APY</p>
                      <p className="text-neutral-600 mt-2">{">"} Sending to GPT-4 for analysis...</p>
                      <p className="text-emerald-400 mt-1">{">"} Recommendation: <span className="text-white">Move 60% to Compound V3</span></p>
                      <p className="text-neutral-600 mt-1">{">"} DON consensus: <span className="text-emerald-400">verified</span></p>
                    </div>
                  )}
                  {step.number === "03" && (
                    <div className="h-full flex flex-col justify-center gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="h-6 w-6 rounded bg-emerald-600/20 flex items-center justify-center"><span className="text-[10px] text-emerald-400 font-bold">A</span></div>
                        <span className="text-neutral-500">Aave V3</span>
                        <div className="flex-1 h-px bg-neutral-800 relative"><div className="absolute inset-y-0 left-0 bg-emerald-500/40" style={{width: "40%"}} /></div>
                        <span className="text-neutral-400 font-mono">40%</span>
                      </div>
                      <div className="flex items-center justify-center my-1">
                        <Icon icon="solar:round-transfer-horizontal-linear" className="h-4 w-4 text-emerald-500/50" />
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="h-6 w-6 rounded bg-emerald-600/20 flex items-center justify-center"><span className="text-[10px] text-emerald-400 font-bold">C</span></div>
                        <span className="text-neutral-500">Compound V3</span>
                        <div className="flex-1 h-px bg-neutral-800 relative"><div className="absolute inset-y-0 left-0 bg-emerald-500/40" style={{width: "60%"}} /></div>
                        <span className="text-neutral-400 font-mono">60%</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-neutral-800/50 flex items-center justify-between">
                        <span className="text-[10px] text-neutral-600">Tx signed by DON</span>
                        <span className="text-[10px] font-mono text-emerald-400/60">0x4f2a...c91b</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
