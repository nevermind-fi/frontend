# Nevermind Frontend

Dashboard for autonomous cross-chain yield optimization. Users connect wallets, set risk profiles, deposit USDC, and view AI-driven yield recommendations.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- thirdweb v5 (wallet connection, contract interactions)
- @iconify/react (icons)
- motion (animations)

## Routes

- `/` - Landing page (marketing)
- `/app` - Dashboard (wallet connect, deposit/withdraw, yield table, AI recommendations, agent log)

## Setup

```bash
npm install
cp .env.example .env.local
```

Set required environment variables in `.env.local`:

- `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` - thirdweb project client ID
- `OPENROUTER_API_KEY` - OpenRouter API key for AI recommendations
- `NEXT_PUBLIC_VAULT_ADDRESS` - Vault contract address (default: 0x2A8e741e626F795784f1926052DD61Af14A01638)
- `NEXT_PUBLIC_USDC_ADDRESS` - USDC token address (default: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)

## Development

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Network

Connected to Tenderly VNet (chain ID: 73571)
