// ============================================================
//  LeaderboardView.js — Renders the Agent Leaderboard Table
//  Cronos Warden — Cronos Edition
// ============================================================

export class LeaderboardView {
  constructor(tbodyId) {
    this._tbody = document.getElementById(tbodyId);
  }

  // ── Render all agents ─────────────────────────────────────
  render(agents) {
    if (!this._tbody) return;

    if (!agents || agents.length === 0) {
      this._renderEmpty();
      return;
    }

    this._tbody.innerHTML = agents.map((agent, i) => this._rowHTML(agent, i)).join('');
  }

  // ── Single row HTML ───────────────────────────────────────
  _rowHTML(agent, index) {
    const rankClass   = ['rank-1', 'rank-2', 'rank-3'][index] || '';
    const fuelPct     = Math.round((agent.fuel / agent.fuelMax) * 100);
    const statusClass = this._statusClass(agent.status);

    return `
      <tr class="${rankClass}" data-agent-id="${agent.id}">
        <td><span class="rank-num">#${index + 1}</span></td>
        <td><span class="agent-name">${this._escapeHtml(agent.name)}</span></td>
        <td>
          <div class="fuel-bar-wrap">
            <div class="fuel-bar">
              <div class="fuel-fill" style="width:${fuelPct}%"></div>
            </div>
            <span style="font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text-secondary)">
              ${agent.fuel.toLocaleString()}
            </span>
          </div>
        </td>
        <td><span class="status-pill ${statusClass}">${agent.status}</span></td>
        <td style="font-family:'Orbitron',monospace;font-size:12px;color:var(--text-muted)">${agent.deaths}</td>
      </tr>
    `;
  }

  _renderEmpty() {
    this._tbody.innerHTML = `
      <tr class="empty-row">
        <td colspan="5">NO AGENTS DETECTED. BE THE FIRST TO DEPLOY ON CRONOS.</td>
      </tr>
    `;
  }

  _statusClass(status) {
    return { ALIVE: 'status-alive', CRITICAL: 'status-critical', DEAD: 'status-dead' }[status] || '';
  }

  _escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);
  }
}
