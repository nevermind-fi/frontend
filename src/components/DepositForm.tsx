"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { prepareContractCall, toUnits } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { vaultContract, usdcContract } from "@/lib/contracts";

export function DepositForm() {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [status, setStatus] = useState<"idle" | "approving" | "pending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const account = useActiveAccount();
  const { mutateAsync: sendTransaction } = useSendTransaction();

  const isConnected = !!account;
  const isProcessing = status === "approving" || status === "pending";
  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;

  async function handleDeposit() {
    if (!isValidAmount) return;
    setStatus("approving");
    setErrorMessage("");

    try {
      const amountInUnits = toUnits(amount, 6);
      const approveTx = prepareContractCall({
        contract: usdcContract,
        method: "function approve(address spender, uint256 amount)",
        params: [vaultContract.address, amountInUnits],
      });
      await sendTransaction(approveTx);

      setStatus("pending");
      const depositTx = prepareContractCall({
        contract: vaultContract,
        method: "function deposit(uint256 amount)",
        params: [amountInUnits],
      });
      await sendTransaction(depositTx);

      setStatus("success");
      setAmount("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }

  async function handleWithdraw() {
    if (!isValidAmount) return;
    setStatus("pending");
    setErrorMessage("");

    try {
      const amountInUnits = toUnits(amount, 6);
      const withdrawTx = prepareContractCall({
        contract: vaultContract,
        method: "function withdraw(uint256 amount)",
        params: [amountInUnits],
      });
      await sendTransaction(withdrawTx);

      setStatus("success");
      setAmount("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }

  function handleSubmit() {
    if (mode === "deposit") handleDeposit();
    else handleWithdraw();
  }

  function getButtonLabel() {
    if (status === "approving") return "Approving USDC...";
    if (status === "pending") return mode === "deposit" ? "Depositing..." : "Withdrawing...";
    if (status === "success") return "Success!";
    return mode === "deposit" ? "Deposit USDC" : "Withdraw USDC";
  }

  return (
    <div className="rounded-2xl border border-neutral-800/50 bg-neutral-900/60 p-5">
      <h2 className="text-sm font-semibold text-white mb-4">
        {mode === "deposit" ? "Deposit" : "Withdraw"} Funds
      </h2>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("deposit")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors ${
            mode === "deposit"
              ? "bg-emerald-600 text-white"
              : "border border-neutral-700 text-neutral-400 hover:text-neutral-300"
          }`}
        >
          <Icon icon="solar:arrow-down-linear" className="h-4 w-4" />
          Deposit
        </button>
        <button
          onClick={() => setMode("withdraw")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors ${
            mode === "withdraw"
              ? "bg-red-600 text-white"
              : "border border-neutral-700 text-neutral-400 hover:text-neutral-300"
          }`}
        >
          <Icon icon="solar:arrow-up-linear" className="h-4 w-4" />
          Withdraw
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <label htmlFor="amount" className="block text-xs text-neutral-500 mb-1">
            Amount (USDC)
          </label>
          <input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isProcessing}
            className="w-full rounded-xl border border-neutral-800/50 bg-neutral-900/60 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors disabled:opacity-50"
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </div>

        {status === "error" && errorMessage && (
          <p className="text-xs text-red-400 break-words">{errorMessage}</p>
        )}
        {status === "success" && (
          <p className="text-xs text-emerald-400">Transaction confirmed.</p>
        )}

        {!isConnected ? (
          <p className="text-center text-xs text-neutral-500 py-2">
            Connect your wallet above to {mode}
          </p>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isValidAmount || isProcessing}
            className={`w-full flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              mode === "deposit"
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-red-600 hover:bg-red-500"
            }`}
          >
            {isProcessing && <Icon icon="solar:refresh-linear" className="h-4 w-4 animate-spin" />}
            {getButtonLabel()}
          </button>
        )}
      </div>
    </div>
  );
}
