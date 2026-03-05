// ============================================================
//  app.js — Application Bootstrap
//  Wires all Models → Views → Controllers
//  Cronos Warden — Cronos Edition
// ============================================================

import { AgentModel }         from './models/AgentModel.js';
import { NetworkModel }       from './models/NetworkModel.js';

import { LeaderboardView }    from './views/LeaderboardView.js';
import { StatsView }          from './views/StatsView.js';
import { TickerView }         from './views/TickerView.js';
import { ThemeView }          from './views/ThemeView.js';
import { RouterView }         from './views/RouterView.js';
import { DocsView }           from './views/DocsView.js';
import { StatusView }         from './views/StatusView.js';

import { AgentController }    from './controllers/AgentController.js';
import { NetworkController }  from './controllers/NetworkController.js';
import { RouterController }   from './controllers/RouterController.js';

// ── Bootstrap ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Models ─────────────────────────────────────────────
  const agentModel   = new AgentModel();
  const networkModel = new NetworkModel();

  // ── 2. Views ──────────────────────────────────────────────
  const leaderboardView = new LeaderboardView('leaderboard-body');

  const statsView = new StatsView({
    agentsId: 'stat-agents',
    fuelId:   'stat-fuel',
    decayId:  'stat-decay',
  });

  const tickerView = new TickerView('.ticker-cycle', 'block-height');

  const themeView = new ThemeView({
    btnId:      'theme-btn',
    labelId:    'toggle-label',
    storageKey: 'crowd-theme',
  });

  const routerView = new RouterView();

  const docsView = new DocsView();

  const statusView = new StatusView({
    lastCheckedId: 'last-checked',
    blockId:       'status-block',
  });

  // ── 3. Controllers ────────────────────────────────────────
  const agentController = new AgentController(
    agentModel,
    leaderboardView,
    statsView,
  );

  const networkController = new NetworkController(
    networkModel,
    tickerView,
    agentController,
    statusView,       // ← passed so NetworkController can update status-block
  );

  const routerController = new RouterController(
    routerView,
    statusView,
    docsView,
  );

  // ── 4. Init ───────────────────────────────────────────────
  agentController.init();
  networkController.start();
  routerController.init();
  statusView.startAutoRefresh();

  // ── 5. Global UI bindings ─────────────────────────────────
  const copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) copyBtn.addEventListener('click', () => agentController.copyCommand());

  // ── 6. Debug handle ───────────────────────────────────────
  window.__CROWD__ = {
    agentModel,
    networkModel,
    agentController,
    networkController,
    routerController,
  };

  console.info(
    '%c CRONOS WARDEN — CRONOS EDITION ',
    'background:#0d9de0;color:white;font-family:monospace;font-size:12px;padding:4px 8px;'
  );
  console.info('[app.js] All systems initialized. Navigate: window.__CROWD__.routerController.navigate("docs")');
});
