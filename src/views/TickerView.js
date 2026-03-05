// ============================================================
//  TickerView.js — Scrolling Ticker Strip
//  Cronos Warden — Cronos Edition
// ============================================================

export class TickerView {
  constructor(cycleSelector, blockSelector) {
    this._cycleEls = document.querySelectorAll(cycleSelector);
    this._blockEl  = document.getElementById(blockSelector);
  }

  updateCycle(formatted) {
    this._cycleEls.forEach(el => { el.textContent = formatted; });
  }

  updateBlock(formatted) {
    if (this._blockEl) this._blockEl.textContent = formatted;
  }

  update({ cycle, blockHeight }) {
    this.updateCycle(cycle);
    this.updateBlock(blockHeight);
  }
}
