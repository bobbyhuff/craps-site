// Aggregates for "How Long Will $100 Last Playing Blackjack?". The raw numbers
// live in content-packages/blackjack-100/simulation.json (written by that
// folder's simulate.py); this file only derives display values from them, so
// the charts in the article can never drift from the published results.
const sim = require("../../content-packages/blackjack-100/simulation.json");

const fmt = (n) => n.toLocaleString("en-US");
const money = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

const [five, ten] = sim.results;

const survival = sim.results.map((r) => {
  const lasted = r.sessions - r.ruined_before_100_count;
  return {
    bet: r.bet_usd,
    sessions: r.sessions,
    pct: Number(((lasted / r.sessions) * 100).toFixed(2)),
  };
});

const peak = Math.max(
  ...sim.results.flatMap((r) => r.histogram.map((b) => b.sessions))
);

const bins = five.histogram.map((b, i) => {
  const t = ten.histogram[i];
  const open = b.max_usd_exclusive >= 1000000;
  const label = open
    ? `$${b.min_usd}+`
    : `$${b.min_usd}–${money(b.max_usd_exclusive - 0.01)}`;
  return {
    label,
    five: { sessions: b.sessions, text: fmt(b.sessions), width: +((b.sessions / peak) * 100).toFixed(2) },
    ten: { sessions: t.sessions, text: fmt(t.sessions), width: +((t.sessions / peak) * 100).toFixed(2) },
  };
});

module.exports = { survival, bins, peak };
