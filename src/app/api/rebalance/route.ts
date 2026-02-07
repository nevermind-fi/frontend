import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData, parseAbi } from "viem";

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`;
const RPC_URL = "https://virtual.rpc.tenderly.co/BESTOFRENTO/project/public/nevermind";

// The deployer address that is also creAuthorized on the contract.
// On Tenderly VNet we can send transactions from any address without a private key.
const CRE_AUTHORIZED = "0xfd8c6d95221d7509de63887df86e1c8c8f6953bb";

const vaultAbi = parseAbi([
  "function executeCRERebalance((string protocol, uint256 amount, uint256 chainId)[] newAllocations)",
]);

const CHAIN_IDS: Record<string, number> = {
  Ethereum: 1,
  Arbitrum: 42161,
  Optimism: 10,
  Base: 8453,
  Polygon: 137,
};

interface RebalanceRequest {
  allocations: Array<{
    protocol: string;
    chain: string;
    allocationPct: number;
  }>;
  totalDeposited: number;
}

export async function POST(request: NextRequest) {
  let body: RebalanceRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { allocations, totalDeposited } = body;
  if (!allocations || !Array.isArray(allocations) || !totalDeposited) {
    return NextResponse.json(
      { error: "Missing allocations or totalDeposited" },
      { status: 400 }
    );
  }

  // Convert percentage allocations to absolute USDC amounts (6 decimals)
  const totalUsdcUnits = BigInt(Math.round(totalDeposited * 1e6));
  const onChainAllocations = allocations.map((a) => ({
    protocol: a.protocol,
    amount: (totalUsdcUnits * BigInt(a.allocationPct)) / BigInt(100),
    chainId: BigInt(CHAIN_IDS[a.chain] ?? 1),
  }));

  const data = encodeFunctionData({
    abi: vaultAbi,
    functionName: "executeCRERebalance",
    args: [onChainAllocations],
  });

  try {
    // Tenderly VNet allows impersonated transactions via eth_sendTransaction
    const txResponse = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_sendTransaction",
        params: [{
          from: CRE_AUTHORIZED,
          to: VAULT_ADDRESS,
          data,
          gas: "0x7A120", // 500000
        }],
      }),
    });

    const txResult = await txResponse.json();

    if (txResult.error) {
      return NextResponse.json(
        { error: `Transaction failed: ${txResult.error.message}` },
        { status: 500 }
      );
    }

    const txHash = txResult.result;

    // Wait for receipt
    const receiptResponse = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "eth_getTransactionReceipt",
        params: [txHash],
      }),
    });

    const receiptResult = await receiptResponse.json();
    const receipt = receiptResult.result;

    return NextResponse.json({
      txHash,
      status: receipt?.status === "0x1" ? "success" : "reverted",
      blockNumber: receipt ? parseInt(receipt.blockNumber, 16) : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Rebalance transaction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
