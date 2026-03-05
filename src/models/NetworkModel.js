// ============================================================
//  NetworkModel.js — Network / Chain Data Layer
//  Manages Cronos chain stats, cycle counter, block height
//  Cronos Warden — Cronos Edition
// ============================================================

export class NetworkModel {
  constructor() {
    this._state = {
      chainId:    25,
      chainName:  'CRONOS MAINNET',
      symbol:     '$CRO',
      cycle:      29544534,
      blockHeight: 17726720,
      decayRate:  1,            // units per minute
      status:     'ONLINE',     // ONLINE | DEGRADED | OFFLINE
      lastUpdate: Date.now(),
    };

    this._subscribers = [];
  }

  // ── Pub/Sub ───────────────────────────────────────────────
  subscribe(fn) {
    this._subscribers.push(fn);
    return () => { this._subscribers = this._subscribers.filter(s => s !== fn); };
  }

  _notify(event, payload) {
    this._subscribers.forEach(fn => fn({ event, payload }));
  }

  // ── Getters ───────────────────────────────────────────────
  get()               { return { ...this._state }; }
  getCycle()          { return this._state.cycle; }
  getBlockHeight()    { return this._state.blockHeight; }
  getStatus()         { return this._state.status; }
  getDecayRate()      { return this._state.decayRate; }

  // ── Mutations ─────────────────────────────────────────────
  tick() {
    this._state.cycle       += Math.floor(Math.random() * 3) + 1;
    this._state.blockHeight += 1;
    this._state.lastUpdate   = Date.now();
    this._notify('network:tick', this.get());
  }

  setStatus(status) {
    this._state.status = status;
    this._notify('network:status', { status });
  }

  setDecayRate(rate) {
    this._state.decayRate = rate;
    this._notify('network:decayRate', { rate });
  }

  // ── Formatted helpers ─────────────────────────────────────
  getFormattedCycle()       { return `CYCLE ${this._state.cycle.toLocaleString()}`; }
  getFormattedBlockHeight() { return this._state.blockHeight.toLocaleString(); }
}
