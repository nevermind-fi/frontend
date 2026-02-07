import { getContract } from "thirdweb";
import { sepolia, arbitrumSepolia } from "thirdweb/chains";
import { thirdwebClient } from "./client";

export const VAULT_ADDRESS =
  (process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`) ||
  "0x0000000000000000000000000000000000000000";

export const USDC_ADDRESS =
  (process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`) ||
  "0x0000000000000000000000000000000000000000";

export const SUPPORTED_CHAINS = [sepolia, arbitrumSepolia];

export const vaultContract = getContract({
  client: thirdwebClient,
  chain: sepolia,
  address: VAULT_ADDRESS,
});

export const usdcContract = getContract({
  client: thirdwebClient,
  chain: sepolia,
  address: USDC_ADDRESS,
});

// Risk profile enum matching the smart contract
export const RISK_PROFILES = {
  Conservative: 0,
  Balanced: 1,
  Aggressive: 2,
} as const;
