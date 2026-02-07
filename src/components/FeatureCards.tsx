"use client";

import { Icon } from "@iconify/react";
import { motion } from "motion/react";

const features = [
  {
    number: "01",
    icon: "solar:cpu-bolt-linear",
    title: "AI-Powered Analysis",
    description:
      "CRE workflow fetches yield data from DeFi Llama across chains, then feeds it to GPT-4 for risk-adjusted allocation analysis. Every step verified by Chainlink DON consensus.",
  },
  {
    number: "02",
    icon: "solar:repeat-linear",
    title: "Auto-Rebalance",
    description:
      "When the agent detects better opportunities, it automatically moves your funds to higher-yielding positions. No manual intervention. Threshold-based triggers prevent unnecessary gas spend.",
  },
  {
    number: "03",
    icon: "solar:shield-check-linear",
    title: "Verifiable Execution",
    description:
      "Every agent decision is verified by Chainlink's Decentralized Oracle Network. DON-signed reports ensure no single node can manipulate your rebalancing. Fully transparent, fully on-chain.",
  },
];

export function FeatureCards() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <p className="feature-number mb-3">HOW IT WORKS</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Three steps to autonomous yield
        </h2>
      </motion.div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800/30 rounded-2xl overflow-hidden border border-neutral-800/50">
        {features.map((feature, i) => (
          <motion.div
            key={feature.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-neutral-950/80 p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="feature-number">{feature.number}</span>
              <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800/50 flex items-center justify-center">
                <Icon icon={feature.icon} className="h-5 w-5 text-emerald-400" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3">
              {feature.title}
            </h3>

            <p className="text-sm text-neutral-400 leading-relaxed flex-1">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
