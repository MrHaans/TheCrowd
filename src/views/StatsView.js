// ============================================================
//  StatsView.js — Renders Stats Cards
//  Cronos Warden — Cronos Edition
// ============================================================

export class StatsView {
  constructor({ agentsId, fuelId, decayId }) {
    this._agentsEl = document.getElementById(agentsId);
    this._fuelEl   = document.getElementById(fuelId);
    this._decayEl  = document.getElementById(decayId);
  }

  // ── Update all stats at once ──────────────────────────────
  render({ activeAgents, fuelBurned, decayRate }) {
    this._set(this._agentsEl, activeAgents);
    this._set(this._fuelEl,   fuelBurned);
    this._set(this._decayEl,  `-${decayRate}`);
  }

  // ── Animate a count-up from 0 → target ───────────────────
  animateCount(el, target) {
    if (!el) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur.toLocaleString();
      if (cur >= target) clearInterval(timer);
    }, 40);
  }

  // ── Run entry animation for all stat values ───────────────
  animateAll({ activeAgents, fuelBurned }) {
    this.animateCount(this._agentsEl, activeAgents);
    this.animateCount(this._fuelEl,   fuelBurned);
  }

  _set(el, value) {
    if (el) el.textContent = typeof value === 'number' ? value.toLocaleString() : value;
  }
}
