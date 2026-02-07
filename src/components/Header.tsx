"use client";

import Link from "next/link";
import Image from "next/image";
import { WalletButton } from "./WalletButton";

interface HeaderProps {
  showConnect?: boolean;
}

export function Header({ showConnect = false }: HeaderProps) {
  return (
    <header className="bg-transparent backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between mt-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="Nevermind"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-lg font-semibold tracking-tight text-white">
            Nevermind
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          {showConnect ? (
            <WalletButton />
          ) : (
            <>
              {/* <Link href="/app" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Dashboard
              </Link> */}
              <Link
                href="/app"
                className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
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
