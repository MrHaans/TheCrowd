// ============================================================
//  NetworkController.js — Network Polling & Tick Loop
//  Connects NetworkModel ↔ TickerView + AgentController
//  Cronos Warden — Cronos Edition
// ============================================================

export class NetworkController {
  /**
   * @param {NetworkModel}    networkModel
   * @param {TickerView}      tickerView
   * @param {AgentController} agentController
   * @param {StatusView}      statusView       — optional, updates status page block
   */
  constructor(networkModel, tickerView, agentController, statusView = null) {
    this._network = networkModel;
    this._ticker  = tickerView;
    this._agents  = agentController;
    this._status  = statusView;

    this._blockTimer = null;
    this._decayTimer = null;

    this._agents.setDecayRate(this._network.getDecayRate());
  }

  // ── Start all polling loops ───────────────────────────────
  start() {
    this._network.subscribe(({ event }) => {
      if (event === 'network:tick') {
        const blockFormatted = this._network.getFormattedBlockHeight();
        this._ticker.update({
          cycle:       this._network.getFormattedCycle(),
          blockHeight: blockFormatted,
        });
        // Also update the status page block counter
        if (this._status) this._status.updateBlock(blockFormatted);
      }
    });

    this._blockTimer = setInterval(() => this._network.tick(), 3000);
    this._decayTimer = setInterval(() => this._agents.applyDecay(), 60_000);

    this._network.tick();
    console.info('[NetworkController] Polling started');
  }

  stop() {
    clearInterval(this._blockTimer);
    clearInterval(this._decayTimer);
    console.info('[NetworkController] Polling stopped');
  }

  // ── Manual controls ───────────────────────────────────────
  setDecayRate(rate) {
    this._network.setDecayRate(rate);
    this._agents.setDecayRate(rate);
  }

  forceDecay() {
    this._agents.applyDecay();
  }
}
