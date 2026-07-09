"use client";

const proofRibbon = [
  "24H Volume Flow",
  "Live Global Transactions",
  "Flexible USDC Access",
  "Fixed-Term Yield Plan",
  "On-Chain Transparency",
  "Deep Liquidity Access",
  "Real-Time Settlement",
  "Open to Verify",
] as const;

const flowRoutes = [
  { path: "M58 144 C112 48 215 58 276 132", tone: "stroke-cyan" },
  { path: "M42 190 C110 264 230 248 302 172", tone: "stroke-warning" },
  { path: "M82 88 C154 164 214 176 304 96", tone: "stroke-electric" },
] as const;

export function GlobalVolumeGlobe({ testId, hero = false }: { testId: string; hero?: boolean }) {
  return <section data-testid={testId} className={`global-volume-globe ${hero ? "global-volume-hero" : ""} relative isolate overflow-visible py-3 lg:min-h-[23.5rem]`}>
    <div className="global-volume-shell relative mx-auto grid min-h-[19rem] max-w-5xl items-center gap-4 lg:min-h-[23rem] lg:grid-cols-[1fr_1.08fr]">
      <div className="global-volume-copy relative z-20 px-1 lg:pl-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">Global savings activity</p>
        <h1 className="mt-2 max-w-xl text-4xl font-semibold leading-tight lg:text-5xl"><span className="brand-text">Blockchain Savings</span></h1>
        <h2 className="mt-3 max-w-md text-2xl font-semibold leading-tight text-ink lg:text-3xl">24H Volume Flow</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">Live routes show worldwide activity first. Savings proof and plan advantages move around the globe as a secondary trust layer.</p>
        <div className="mt-5 grid max-w-lg grid-cols-2 gap-2 text-xs font-semibold">
          <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-2 text-cyan">Flexible USDC Access</span>
          <span className="rounded-full border border-warning/30 bg-warning/10 px-3 py-2 text-warning">Fixed-Term Yield Plan</span>
          <span className="rounded-full border border-electric/30 bg-electric/10 px-3 py-2 text-electric">Daily Interest Estimate</span>
          <span className="rounded-full border border-violet/30 bg-violet/10 px-3 py-2 text-violet">Maturity Settlement</span>
        </div>
      </div>
      <div className="global-volume-stage relative z-10 mx-auto aspect-square w-full max-w-[25rem] lg:max-w-[29rem]" aria-hidden="true">
        <div className="global-volume-ribbon">
          <div className="global-volume-ribbon-track">
            {[...proofRibbon, ...proofRibbon].map((item, index) => <span data-testid="globe-proof-ribbon-item" key={`${item}-${index}`}>{item}</span>)}
          </div>
        </div>
        <div className="global-volume-orbit global-volume-orbit-a" />
        <div className="global-volume-orbit global-volume-orbit-b" />
        <div className="global-volume-earth">
          <div className="global-volume-map" />
          <span className="global-volume-hotspot global-volume-hotspot-a" />
          <span className="global-volume-hotspot global-volume-hotspot-b" />
          <span className="global-volume-hotspot global-volume-hotspot-c" />
          <svg viewBox="0 0 360 300" className="absolute inset-0 h-full w-full overflow-visible">
            {flowRoutes.map((route, index) => <path key={route.path} d={route.path} className={`global-volume-route ${route.tone}`} style={{ animationDelay: `${index * .42}s` }} />)}
          </svg>
        </div>
        <div className="global-volume-badge">
          <span>24H Volume</span>
          <strong>$64.94B</strong>
        </div>
      </div>
    </div>
  </section>;
}
