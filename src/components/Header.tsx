"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { WalletButton } from "./WalletButton";

interface HeaderProps {
  showConnect?: boolean;
}

export function Header({ showConnect = false }: HeaderProps) {
  return (
    <header className="border-b border-neutral-800/30 bg-transparent backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Icon icon="solar:bolt-circle-linear" className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Nevermind
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          {showConnect ? (
            <WalletButton />
          ) : (
            <>
              <Link href="/app" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link
                href="/app"
                className="rounded-full border border-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
