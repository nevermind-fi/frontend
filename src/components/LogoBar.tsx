"use client";

import { Icon } from "@iconify/react";
import { motion } from "motion/react";

const logos = [
  { icon: "simple-icons:chainlink", name: "Chainlink", cls: "" },
  { icon: "logos:ethereum", name: "Ethereum", cls: "" },
  { icon: "token-branded:arbitrum-one", name: "Arbitrum", cls: "" },
  { icon: "simple-icons:openai", name: "OpenAI", cls: "text-white" },
  { icon: "simple-icons:vercel", name: "Vercel", cls: "text-white" },
];

export function LogoBar() {
  return (
    <section className="relative border-y border-neutral-800/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs text-neutral-600 uppercase tracking-widest text-center mb-8"
        >
          Built on
        </motion.p>
        <div className="flex items-center justify-center gap-10 sm:gap-16 flex-wrap">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity"
            >
              <Icon
                icon={logo.icon}
                width={36}
                height={36}
                className={logo.cls || "grayscale brightness-200"}
              />
              <span className="text-sm text-neutral-500 hidden sm:block">{logo.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
