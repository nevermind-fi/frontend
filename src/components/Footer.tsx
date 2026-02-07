"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-800/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Icon icon="solar:bolt-circle-linear" className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">Nevermind</span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              Autonomous cross-chain yield optimization powered by
              Chainlink CRE and AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-medium text-neutral-300 mb-4">Product</p>
            <ul className="space-y-2">
              <li><Link href="/app" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">Dashboard</Link></li>
              <li><Link href="/app" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">Deposit</Link></li>
              <li><Link href="/app" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">Yield Analysis</Link></li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <p className="text-sm font-medium text-neutral-300 mb-4">Technology</p>
            <ul className="space-y-2">
              <li><a href="https://chain.link" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">Chainlink CRE</a></li>
              <li><a href="https://thirdweb.com" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">thirdweb</a></li>
              <li><a href="https://tenderly.co" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">Tenderly</a></li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <p className="text-sm font-medium text-neutral-300 mb-4">Developers</p>
            <ul className="space-y-2">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">GitHub</a></li>
              <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">Smart Contracts</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            Built for the Chainlink Hackathon 2026. Powered by Chainlink CRE + thirdweb.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-neutral-400 transition-colors">
              <Icon icon="logos:github-icon" className="h-5 w-5 grayscale brightness-200" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-neutral-400 transition-colors">
              <Icon icon="logos:twitter" className="h-5 w-5 grayscale brightness-200" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
