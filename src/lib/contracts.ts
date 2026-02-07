import { getContract, defineChain } from "thirdweb";
import { thirdwebClient } from "./client";

export const VAULT_ADDRESS =
  (process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`) ||
  "0x0000000000000000000000000000000000000000";

export const USDC_ADDRESS =
  (process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`) ||
  "0x0000000000000000000000000000000000000000";

// Tenderly Virtual TestNet (forked from Ethereum Mainnet)
export const tenderlyVNet = defineChain({
  id: 73571,
  name: "Nevermind Tenderly VNet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpc: "https://virtual.rpc.tenderly.co/BESTOFRENTO/project/public/nevermind",
  testnet: true,
});

export const SUPPORTED_CHAINS = [tenderlyVNet];

export const vaultContract = getContract({
  client: thirdwebClient,
  chain: tenderlyVNet,
  address: VAULT_ADDRESS,
});

export const usdcContract = getContract({
  client: thirdwebClient,
  chain: tenderlyVNet,
  address: USDC_ADDRESS,
});

// Risk profile enum matching the smart contract
export const RISK_PROFILES = {
  Conservative: 0,
  Balanced: 1,
  Aggressive: 2,
} as const;
