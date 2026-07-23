import { BenefitsBar } from "@/components/finance/benefits-bar";
import { AdvantagesPanel } from "@/components/finance/advantages-panel";
import { DesktopFlowFooter } from "@/components/finance/desktop-flow-footer";
import { SavingsProofMatrix } from "@/components/finance/savings-proof-matrix";
import { PopularCoins } from "@/components/market/popular-coins";
import { DesktopOpportunityDeck } from "@/components/finance/desktop-opportunity-deck";
import { DesktopProofRibbon } from "@/components/finance/desktop-proof-ribbon";

export function DesktopHomePage() {
  // 💡 删除了原先的 useAccount()，让服务端组件保持纯净，避免 Next.js 报错
  return <main data-testid="desktop-home" className="relative z-10 mx-auto hidden max-w-content px-6 py-3 lg:block">
    {/* 💡 按钮组件内部自己会去处理钱包状态，这里不需要传参 */}
    <DesktopOpportunityDeck />
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-9 flex h-full flex-col">
        <PopularCoins />
        <SavingsProofMatrix />
        <DesktopProofRibbon />
      </div>
      <aside data-testid="desktop-sidebar" className="col-span-3 flex flex-col gap-3">
        <AdvantagesPanel instance="desktop" className="advantages-tree-desktop min-h-full" />
      </aside>
    </div>
    <div className="mt-3 grid grid-cols-12 gap-3">
      <div className="col-span-12"><BenefitsBar /></div>
    </div>
    <DesktopFlowFooter />
  </main>;
}
