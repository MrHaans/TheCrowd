// ============================================================
//  AgentController.js — Agent Business Logic
//  Connects AgentModel ↔ LeaderboardView + StatsView
//  Cronos Warden — Cronos Edition
// ============================================================

export class AgentController {
  /**
   * @param {AgentModel}      model
   * @param {LeaderboardView} leaderboardView
   * @param {StatsView}       statsView
   */
  constructor(model, leaderboardView, statsView) {
    this._model     = model;
    this._lbView    = leaderboardView;
    this._statsView = statsView;

    this._bindModel();
  }

  // ── Subscribe to model events ─────────────────────────────
  _bindModel() {
    this._model.subscribe(({ event }) => {
      // Re-render on any data change
      const refreshEvents = [
        'agent:added', 'agent:updated', 'agent:removed',
        'agent:decayed', 'agent:reset',
      ];
      if (refreshEvents.includes(event)) {
        this._refresh();
      }
      if (event === 'agent:died') {
        console.info('[AgentController] Agent died — could trigger on-chain event here');
      }
    });
  }

  // ── Initial render ────────────────────────────────────────
  init() {
    this._refresh();
    this._statsView.animateAll(this._model.getStats());
  }

  // ── Sync views with model ─────────────────────────────────
  _refresh() {
    const sorted = this._model.getSorted();
    const stats  = this._model.getStats();

    this._lbView.render(sorted);
    this._statsView.render({
      activeAgents: stats.active,
      fuelBurned:   stats.fuelBurned,
      decayRate:    this._networkDecayRate || 1,
    });
  }

  // ── Public actions (called by UI or NetworkController) ────

  setDecayRate(rate) {
    this._networkDecayRate = rate;
  }

  applyDecay() {
    this._model.applyDecay(this._networkDecayRate || 1);
  }

  addAgent(data) {
    return this._model.add(data);
  }

  removeAgent(id) {
    return this._model.remove(id);
  }

  refuelAgent(id, amount = 1000) {
    const agent = this._model.getById(id);
    if (!agent) return null;
    const newFuel = Math.min(agent.fuelMax, agent.fuel + amount);
    return this._model.update(id, {
      fuel: newFuel,
      status: newFuel / agent.fuelMax >= 0.25 ? 'ALIVE' : 'CRITICAL',
    });
  }

  resetAll() {
    this._model.reset();
  }

  copyCommand() {
    const el = document.getElementById('cmd-text');
    if (!el) return;
    navigator.clipboard.writeText(el.textContent.trim()).then(() => {
      const btn = document.querySelector('.copy-btn');
      if (btn) {
        btn.textContent = 'COPIED!';
        setTimeout(() => { btn.textContent = 'COPY'; }, 2000);
      }
    });
  }
}
