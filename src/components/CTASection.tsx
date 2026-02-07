"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "motion/react";

const phrase = "AUTOMATE YOUR YIELD \u00B7 ";
const repeated = Array(12).fill(phrase).join("");

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Ambient green glow behind marquee */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0.05) 40%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-12"
        >
          {/* Scrolling marquee in glassmorphism pill */}
          <div className="w-full overflow-hidden rounded-[2rem] border border-neutral-700/30 bg-neutral-900/30 backdrop-blur-2xl py-7 sm:py-10">
            <div className="marquee-track">
              <span className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight shrink-0">
                {repeated}
              </span>
              <span className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight shrink-0">
                {repeated}
              </span>
            </div>
          </div>

          {/* Subtitle + CTA buttons */}
          <div className="text-center">
            <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
              Connect your wallet, deposit USDC, and let Nevermind&apos;s AI agent
              optimize your returns across chains. Verified by Chainlink DON.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
              >
                Launch App
                <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-8 py-3.5 text-sm font-medium text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
              >
                View on GitHub
                <Icon icon="solar:code-linear" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
