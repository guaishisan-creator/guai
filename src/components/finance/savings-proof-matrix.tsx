const proofItems = [
  ["Plan Match", "Rate tier locked"],
  ["Pool Route", "USDC route"],
  ["Daily Settle", "T+0 accrual"],
  ["Maturity Payout", "Fixed-term"],
  ["On-chain Proof", "Trace layer"],
];

const metrics = [
  ["$64.94B", "24H Volume"],
  ["Daily", "Settlement"],
  ["On-chain", "Proof"],
];

const riskSignals = [
  ["Reserve Check", "Synced"],
  ["Route Risk", "Low"],
  ["Trace Layer", "Active"],
];

export function SavingsProofMatrix() {
  return (
    <section data-testid="desktop-proof-matrix" className="savings-proof-matrix savings-proof-engine" aria-label="Savings proof engine">
      <div className="savings-proof-path">
        {proofItems.map(([title, detail], index) => (
          <article key={title} data-testid="savings-proof-node" className="savings-proof-node">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <b>{title}</b>
            <small>{detail}</small>
          </article>
        ))}
      </div>
      <div data-testid="savings-proof-terminal" className="savings-proof-terminal">
        <p>LIVE PROOF LAYER</p>
        <h2>Savings Proof Engine</h2>
        <span>Matched plans are checked against settlement, maturity and on-chain trace signals.</span>
        <div className="savings-proof-metrics">
          {metrics.map(([value, label]) => (
            <strong key={label} data-testid="savings-proof-metric"><b>{value}</b><small>{label}</small></strong>
          ))}
        </div>
      </div>
      <div className="savings-proof-risk-panel">
        <div className="savings-proof-radar" aria-hidden="true"><i /><i /><i /></div>
        {riskSignals.map(([label, value]) => (
          <span key={label} data-testid="savings-proof-risk"><small>{label}</small><b>{value}</b></span>
        ))}
      </div>
    </section>
  );
}
