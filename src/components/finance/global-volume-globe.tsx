"use client";

import type { Locale } from "@/i18n/locales";
import { useLocale } from "@/i18n/locale-provider";

type GlobeCopy = {
  eyebrow: string;
  title: string;
  headline: string;
  description: string;
  pills: readonly string[];
  ribbon: readonly string[];
  surface: readonly string[];
  badge: string;
};

const globeCopy: Record<Locale, GlobeCopy> = {
  en: {
    eyebrow: "Global savings activity",
    title: "Blockchain Savings",
    headline: "24H Volume Flow",
    description: "Live routes show worldwide activity first. Savings proof and plan advantages move around the globe as a secondary trust layer.",
    pills: ["Flexible USDC Access", "Fixed-Term Yield Plan", "Daily Interest Estimate", "Maturity Settlement"],
    ribbon: ["24H Volume Flow", "Live Global Transactions", "Flexible USDC Access", "Fixed-Term Yield Plan", "On-Chain Transparency", "Deep Liquidity Access", "Real-Time Settlement", "Open to Verify"],
    surface: ["Global Trades", "USDC Access", "Yield Plans"],
    badge: "24H Volume",
  },
  "zh-CN": {
    eyebrow: "全球储蓄活动",
    title: "Blockchain Savings",
    headline: "全球交易量流动",
    description: "实时路径优先展示全球交易活跃度，储蓄背书与计划优势围绕地球呈现，作为辅助信任层。",
    pills: ["灵活 USDC 存取", "定期收益计划", "每日收益预估", "到期一次结算"],
    ribbon: ["24H 交易量流动", "全球实时交易", "灵活 USDC 存取", "定期收益计划", "链上透明", "深度流动性", "实时结算", "开放验证"],
    surface: ["全球交易", "USDC 存取", "收益计划"],
    badge: "24H 交易量",
  },
  "zh-TW": {
    eyebrow: "全球儲蓄活動",
    title: "Blockchain Savings",
    headline: "全球交易量流動",
    description: "即時路徑優先展示全球交易活躍度，儲蓄背書與計畫優勢圍繞地球呈現，作為輔助信任層。",
    pills: ["靈活 USDC 存取", "定期收益計畫", "每日收益預估", "到期一次結算"],
    ribbon: ["24H 交易量流動", "全球即時交易", "靈活 USDC 存取", "定期收益計畫", "鏈上透明", "深度流動性", "即時結算", "開放驗證"],
    surface: ["全球交易", "USDC 存取", "收益計畫"],
    badge: "24H 交易量",
  },
  ja: {
    eyebrow: "グローバル貯蓄アクティビティ",
    title: "Blockchain Savings",
    headline: "24時間取引量フロー",
    description: "世界中の取引アクティビティをライブ経路で先に示し、貯蓄の裏付けとプランの強みを信頼レイヤーとして地球上に重ねます。",
    pills: ["柔軟な USDC 入出金", "定期利回りプラン", "日次収益見積もり", "満期一括精算"],
    ribbon: ["24時間取引量フロー", "グローバルリアルタイム取引", "柔軟な USDC 入出金", "定期利回りプラン", "オンチェーン透明性", "深い流動性", "リアルタイム決済", "公開検証"],
    surface: ["世界取引", "USDC 入出金", "利回りプラン"],
    badge: "24H 取引量",
  },
  ko: {
    eyebrow: "글로벌 저축 활동",
    title: "Blockchain Savings",
    headline: "24시간 거래량 흐름",
    description: "실시간 경로로 전 세계 거래 활동을 먼저 보여주고, 저축 근거와 플랜 장점을 보조 신뢰 레이어로 지구 위에 배치합니다.",
    pills: ["유연한 USDC 입출금", "정기 수익 플랜", "일일 수익 예상", "만기 일괄 정산"],
    ribbon: ["24시간 거래량 흐름", "글로벌 실시간 거래", "유연한 USDC 입출금", "정기 수익 플랜", "온체인 투명성", "깊은 유동성", "실시간 정산", "공개 검증"],
    surface: ["글로벌 거래", "USDC 입출금", "수익 플랜"],
    badge: "24H 거래량",
  },
  th: {
    eyebrow: "กิจกรรมออมทั่วโลก",
    title: "Blockchain Savings",
    headline: "การไหลของปริมาณซื้อขาย 24 ชม.",
    description: "เส้นทางแบบสดแสดงกิจกรรมทั่วโลกเป็นหลัก พร้อมนำหลักฐานการออมและจุดเด่นของแผนมาเป็นชั้นความเชื่อมั่นเสริมบนโลก",
    pills: ["ฝากถอน USDC ยืดหยุ่น", "แผนผลตอบแทนระยะกำหนด", "ประมาณผลตอบแทนรายวัน", "ชำระครั้งเดียวเมื่อครบกำหนด"],
    ribbon: ["ปริมาณซื้อขาย 24 ชม.", "ธุรกรรมทั่วโลกแบบสด", "ฝากถอน USDC ยืดหยุ่น", "แผนผลตอบแทนระยะกำหนด", "โปร่งใสบนเชน", "สภาพคล่องลึก", "ชำระแบบเรียลไทม์", "เปิดให้ตรวจสอบ"],
    surface: ["ธุรกรรมทั่วโลก", "เข้าออก USDC", "แผนผลตอบแทน"],
    badge: "24H Volume",
  },
};

const flowRoutes = [
  { path: "M58 144 C112 48 215 58 276 132", tone: "stroke-cyan" },
  { path: "M42 190 C110 264 230 248 302 172", tone: "stroke-warning" },
  { path: "M82 88 C154 164 214 176 304 96", tone: "stroke-electric" },
] as const;

export function GlobalVolumeGlobe({ testId, hero = false }: { testId: string; hero?: boolean }) {
  const { locale } = useLocale();
  const copy = globeCopy[locale];

  return <section data-testid={testId} className={`global-volume-globe ${hero ? "global-volume-hero" : ""} relative isolate overflow-visible py-3 lg:min-h-[23.5rem]`}>
    <div className="global-volume-shell relative mx-auto grid min-h-[19rem] max-w-5xl items-center gap-4 lg:min-h-[23rem] lg:grid-cols-[1fr_1.08fr]">
      <div className="global-volume-copy relative z-20 px-1 lg:pl-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">{copy.eyebrow}</p>
        <h1 className="mt-2 max-w-xl text-4xl font-semibold leading-tight lg:text-5xl"><span className="brand-text">{copy.title}</span></h1>
        <h2 className="mt-3 max-w-md text-2xl font-semibold leading-tight text-ink lg:text-3xl">{copy.headline}</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">{copy.description}</p>
        <div className="mt-5 grid max-w-lg grid-cols-2 gap-2 text-xs font-semibold">
          <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-2 text-cyan">{copy.pills[0]}</span>
          <span className="rounded-full border border-warning/30 bg-warning/10 px-3 py-2 text-warning">{copy.pills[1]}</span>
          <span className="rounded-full border border-electric/30 bg-electric/10 px-3 py-2 text-electric">{copy.pills[2]}</span>
          <span className="rounded-full border border-violet/30 bg-violet/10 px-3 py-2 text-violet">{copy.pills[3]}</span>
        </div>
      </div>
      <div className="global-volume-stage relative z-10 mx-auto aspect-square w-full max-w-[25rem] lg:max-w-[29rem]" aria-hidden="true">
        <div className="global-volume-ribbon">
          <div className="global-volume-ribbon-track">
            {[...copy.ribbon, ...copy.ribbon].map((item, index) => <span data-testid="globe-proof-ribbon-item" key={`${item}-${index}`}>{item}</span>)}
          </div>
        </div>
        <div className="global-volume-orbit global-volume-orbit-a" />
        <div className="global-volume-orbit global-volume-orbit-b" />
        <div className="global-volume-earth">
          <div className="global-volume-map" />
          <span className="global-volume-hotspot global-volume-hotspot-a" />
          <span className="global-volume-hotspot global-volume-hotspot-b" />
          <span className="global-volume-hotspot global-volume-hotspot-c" />
          <span data-testid="globe-surface-label" className="global-volume-surface-label global-volume-surface-label-a">{copy.surface[0]}</span>
          <span data-testid="globe-surface-label" className="global-volume-surface-label global-volume-surface-label-b">{copy.surface[1]}</span>
          <span data-testid="globe-surface-label" className="global-volume-surface-label global-volume-surface-label-c">{copy.surface[2]}</span>
          <svg viewBox="0 0 360 300" className="absolute inset-0 h-full w-full overflow-visible">
            {flowRoutes.map((route, index) => <path key={route.path} d={route.path} className={`global-volume-route ${route.tone}`} style={{ animationDelay: `${index * .42}s` }} />)}
          </svg>
        </div>
        <div className="global-volume-badge">
          <span>{copy.badge}</span>
          <strong>$64.94B</strong>
        </div>
      </div>
    </div>
  </section>;
}
