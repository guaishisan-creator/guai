"use client";

import { useMemo, useState } from "react";
import { fixedSavingsRates } from "@/constants/finance";
import { savingsCommandCopy } from "@/i18n/finance-copy";
import { useLocale } from "@/i18n/locale-provider";
import type { SavingsRate } from "@/types/finance";

const fixedTerms = [30, 90, 180, 365] as const;

function parseRate(rate: string) {
  return Number(rate.replace("%", "")) / 100;
}

function matchesTier(amount: number, tier: string) {
  const normalized = tier.replaceAll(",", "").toUpperCase();
  if (normalized.startsWith("OVER ")) return amount >= Number(normalized.replace("OVER ", ""));
  const [min, max] = normalized.split(" - ").map(Number);
  return amount >= min && amount <= max;
}

function findTier(amount: number, rates: SavingsRate[]) {
  return rates.find((rate) => matchesTier(amount, rate.amount)) ?? rates[0];
}

function formatUsdc(value: number) {
  return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)} USDC`;
}

export function SavingsCalculator({ testId }: { testId: string }) {
  const { locale } = useLocale();
  const copy = savingsCommandCopy[locale].calculator;
  const [amountText, setAmountText] = useState("10000");
  const [term, setTerm] = useState<(typeof fixedTerms)[number]>(30);
  const amount = Math.max(0, Number(amountText) || 0);
  const tier = useMemo(() => findTier(amount, fixedSavingsRates), [amount]);
  const rate = parseRate(tier.dailyRate);
  const interest = amount * rate;

  return <section data-testid={testId} className="rounded-control border border-cyan/25 bg-canvas/40 p-3">
    <div className="flex rounded-control border border-line bg-surface-soft p-1" role="group" aria-label={copy.savingsType}>
      <button
        type="button"
        className="flex-1 rounded-control bg-brand-gradient px-3 py-2 text-xs font-semibold text-ink shadow-glow"
      >
        {copy.fixed}
      </button>
    </div>
    <label className="mt-3 block text-xs font-medium text-muted">
      {copy.deposit}
      <input
        aria-label={copy.deposit}
        type="number"
        min="0"
        inputMode="decimal"
        value={amountText}
        onChange={(event) => setAmountText(event.target.value)}
        className="mt-1 w-full rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-cyan"
      />
    </label>
    <label className="mt-3 block text-xs font-medium text-muted">
      {copy.fixedTerm}
      <select
        aria-label={copy.fixedTerm}
        value={term}
        onChange={(event) => setTerm(Number(event.target.value) as (typeof fixedTerms)[number])}
        className="mt-1 w-full rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-warning"
      >
        {fixedTerms.map((days) => <option key={days} value={days}>{days} {copy.days}</option>)}
      </select>
    </label>
    <div className="mt-3 grid gap-2 rounded-control border border-line bg-surface-soft p-3 text-sm">
      <div className="flex items-center justify-between gap-3"><span className="text-muted">{copy.matchedTier}</span><strong>{tier.amount} USDC</strong></div>
      <div className="flex items-center justify-between gap-3"><span className="text-muted">{copy.matchedRate}</span><strong className="text-warning">{tier.dailyRate}</strong></div>
      <div className="flex items-center justify-between gap-3"><span className="text-muted">{copy.maturityInterest}</span><strong>{formatUsdc(interest)}</strong></div>
    </div>
    <p className="mt-3 text-xs leading-5 text-muted">{copy.fixedExplanation(term)}</p>
    <p className="mt-2 text-xs leading-5 text-muted">{copy.estimateOnly}</p>
  </section>;
}
