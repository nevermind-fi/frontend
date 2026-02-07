"use client";

import { motion } from "motion/react";

const stats = [
  { value: "$2.8M", label: "Total Volume Managed" },
  { value: "4.7%", label: "Average APY" },
  { value: "2", label: "Chains Supported" },
  { value: "24/7", label: "Autonomous Monitoring" },
];

export function StatsSection() {
  return (
    <section className="relative py-20 border-y border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p
                className="text-3xl sm:text-4xl font-bold text-white"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {stat.value}
              </p>
              <p className="text-sm text-neutral-500 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
