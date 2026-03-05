// ============================================================
//  StatusView.js — Network Status Page Rendering
//  Cronos Warden — Cronos Edition
// ============================================================

export class StatusView {
  constructor({ lastCheckedId, blockId }) {
    this._checkedEl = document.getElementById(lastCheckedId);
    this._blockEl   = document.getElementById(blockId);
    this._interval  = null;
  }

  // ── Update "last checked" timestamp ──────────────────────
  updateChecked() {
    if (this._checkedEl) {
      this._checkedEl.textContent =
        new Date().toUTCString().replace(' GMT', '') + ' UTC';
    }
  }

  // ── Update block height display ───────────────────────────
  updateBlock(formatted) {
    if (this._blockEl) this._blockEl.textContent = formatted;
  }

  // ── Start auto-refresh interval (30s) ────────────────────
  startAutoRefresh() {
    if (this._interval) return;
    this._interval = setInterval(() => this.updateChecked(), 30_000);
  }

  // ── Stop auto-refresh ─────────────────────────────────────
  stopAutoRefresh() {
    clearInterval(this._interval);
    this._interval = null;
  }
}
