import { DesktopHomePage } from "@/components/home/desktop-home-page";
import { MobileHomePage } from "@/components/home/mobile-home-page";
import { GlobalVolumeGlobe } from "@/components/finance/global-volume-globe";
import { SavingsCalculator } from "@/components/finance/savings-calculator";
import { Header } from "@/components/layout/header";
import { MarketTicker } from "@/components/layout/market-ticker";
import { PromoCarousel } from "@/components/layout/promo-carousel";

export default function Home() {
  return <div id="home" className="page-grid min-h-screen">
    <Header />
    <MarketTicker testId="top-market-ticker" />
    <PromoCarousel />
    <GlobalVolumeGlobe testId="hero-global-volume-globe" hero />
    <section className="relative z-10 mx-auto max-w-content px-page py-3 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <SavingsCalculator testId="hero-savings-calculator" />
      </div>
    </section>
    <DesktopHomePage />
    <MobileHomePage />
  </div>;
}
