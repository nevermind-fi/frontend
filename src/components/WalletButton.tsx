"use client";

import { ConnectButton } from "thirdweb/react";
import { thirdwebClient } from "@/lib/client";
import { SUPPORTED_CHAINS } from "@/lib/contracts";

export function WalletButton({ label = "Connect Wallet" }: { label?: string }) {
  return (
    <ConnectButton
      client={thirdwebClient}
      chains={SUPPORTED_CHAINS}
      connectButton={{
        label,
        className: "!rounded-full !bg-emerald-600 !px-5 !py-2 !text-sm !font-medium !text-white hover:!bg-emerald-500 !transition-colors !border-0 !h-auto !min-h-0 !min-w-0",
      }}
      theme="dark"
    />
  );
}
