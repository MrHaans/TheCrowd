// ============================================================
//  AgentModel.js — Agent Data Layer
//  Manages all agent state, CRUD, and persistence
//  Cronos Warden — Cronos Edition
// ============================================================

export class AgentModel {
  constructor() {
    this._agents = this._loadFromStorage();
    this._subscribers = [];
  }

  // ── Default seed data ─────────────────────────────────────
  _defaultAgents() {
    return [
      { id: 'agt_001', name: 'NEXUS-7',     fuel: 9840, fuelMax: 10000, status: 'ALIVE',    deaths: 0, wallet: '0xA1b2...C3d4' },
      { id: 'agt_002', name: 'KRONOS-X',    fuel: 7210, fuelMax: 10000, status: 'ALIVE',    deaths: 1, wallet: '0xB2c3...D4e5' },
      { id: 'agt_003', name: 'VECTOR_ΩΩ',  fuel: 4580, fuelMax: 10000, status: 'CRITICAL', deaths: 2, wallet: '0xC3d4...E5f6' },
      { id: 'agt_004', name: 'DELTA-PRIME', fuel: 2100, fuelMax: 10000, status: 'CRITICAL', deaths: 3, wallet: '0xD4e5...F6a7' },
      { id: 'agt_005', name: 'AGENT_NULL',  fuel: 0,    fuelMax: 10000, status: 'DEAD',     deaths: 7, wallet: '0xE5f6...A7b8' },
    ];
  }

  // ── Persistence ───────────────────────────────────────────
  _loadFromStorage() {
    try {
      const saved = localStorage.getItem('crowd_agents');
      return saved ? JSON.parse(saved) : this._defaultAgents();
    } catch {
      return this._defaultAgents();
    }
  }

  _saveToStorage() {
    try {
      localStorage.setItem('crowd_agents', JSON.stringify(this._agents));
    } catch (e) {
      console.warn('[AgentModel] Storage write failed:', e);
    }
  }

  // ── Pub/Sub ───────────────────────────────────────────────
  subscribe(fn) {
    this._subscribers.push(fn);
    return () => { this._subscribers = this._subscribers.filter(s => s !== fn); };
  }

  _notify(event, payload) {
    this._subscribers.forEach(fn => fn({ event, payload }));
  }

  // ── Queries ───────────────────────────────────────────────
  getAll()            { return [...this._agents]; }
  getById(id)         { return this._agents.find(a => a.id === id) || null; }
  getActive()         { return this._agents.filter(a => a.status !== 'DEAD'); }
  getAlive()          { return this._agents.filter(a => a.status === 'ALIVE'); }
  getDead()           { return this._agents.filter(a => a.status === 'DEAD'); }
  getSorted()         { return [...this._agents].sort((a, b) => b.fuel - a.fuel); }

  // ── Aggregates ────────────────────────────────────────────
  getTotalFuelBurned() {
    return this._agents.reduce((sum, a) => sum + (a.fuelMax - a.fuel), 0);
  }

  getStats() {
    return {
      total:    this._agents.length,
      active:   this.getActive().length,
      alive:    this.getAlive().length,
      dead:     this.getDead().length,
      critical: this._agents.filter(a => a.status === 'CRITICAL').length,
      fuelBurned: this.getTotalFuelBurned(),
    };
  }

  // ── Mutations ─────────────────────────────────────────────
  add(agent) {
    const newAgent = {
      id:       `agt_${Date.now()}`,
      name:     agent.name     || 'UNKNOWN',
      fuel:     agent.fuel     ?? 10000,
      fuelMax:  agent.fuelMax  ?? 10000,
      status:   agent.status   || 'ALIVE',
      deaths:   agent.deaths   ?? 0,
      wallet:   agent.wallet   || '0x????...????',
    };
    this._agents.push(newAgent);
    this._saveToStorage();
    this._notify('agent:added', newAgent);
    return newAgent;
  }

  update(id, patch) {
    const idx = this._agents.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this._agents[idx] = { ...this._agents[idx], ...patch };
    this._saveToStorage();
    this._notify('agent:updated', this._agents[idx]);
    return this._agents[idx];
  }

  remove(id) {
    const agent = this.getById(id);
    if (!agent) return false;
    this._agents = this._agents.filter(a => a.id !== id);
    this._saveToStorage();
    this._notify('agent:removed', { id });
    return true;
  }

  // ── Simulation: decay fuel every tick ────────────────────
  applyDecay(rate = 1) {
    let changed = false;
    this._agents = this._agents.map(agent => {
      if (agent.status === 'DEAD') return agent;

      const newFuel = Math.max(0, agent.fuel - rate);
      const pct = newFuel / agent.fuelMax;
      const newStatus = newFuel === 0 ? 'DEAD'
                      : pct < 0.25   ? 'CRITICAL'
                      : 'ALIVE';

      const updated = { ...agent, fuel: newFuel, status: newStatus };
      if (newStatus === 'DEAD' && agent.status !== 'DEAD') {
        updated.deaths += 1;
        this._notify('agent:died', updated);
      }
      changed = true;
      return updated;
    });
    if (changed) {
      this._saveToStorage();
      this._notify('agent:decayed', this.getStats());
    }
  }

  reset() {
    this._agents = this._defaultAgents();
    this._saveToStorage();
    this._notify('agent:reset', null);
  }
}
