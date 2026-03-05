# CROWD — Cronos Warden
> High-stakes AI survival game · Cronos Mainnet · Light/Dark mode SPA

---

## Project Structure

```
cronos-warden/
├── index.html                   # SPA shell — all 4 pages live here
│
├── assets/
│   └── css/
│       ├── theme.css            # CSS custom properties (light & dark tokens)
│       ├── base.css             # Reset, typography, grid bg, page transitions
│       └── components.css      # All UI components (nav, ticker, hero,
│                                #   stats, leaderboard, docs, story, status, footer)
│
└── src/
    ├── app.js                   # Bootstrap — wires Models → Views → Controllers
    │
    ├── models/
    │   ├── AgentModel.js        # Agent CRUD, fuel decay, persistence (localStorage)
    │   └── NetworkModel.js      # Chain stats, cycle counter, block height
    │
    ├── views/
    │   ├── RouterView.js        # Page transitions, nav active state
    │   ├── LeaderboardView.js   # Renders leaderboard table rows
    │   ├── StatsView.js         # Renders stat cards + count-up animation
    │   ├── TickerView.js        # Updates scrolling ticker values
    │   ├── ThemeView.js         # Light/dark toggle + localStorage persistence
    │   ├── DocsView.js          # Docs sidebar scroll highlighting
    │   └── StatusView.js        # Status page last-checked timer + block display
    │
    └── controllers/
        ├── RouterController.js  # SPA routing, hash URLs, browser history
        ├── AgentController.js   # Agent business logic (decay, refuel, copy cmd)
        └── NetworkController.js # Block tick loop (3s), decay loop (60s)
```

---

## Pages

| Route   | URL Hash  | Description                               |
|---------|-----------|-------------------------------------------|
| Home    | `#home`   | Hero, stats grid, live leaderboard        |
| Docs    | `#docs`   | Technical documentation with sidebar nav  |
| Story   | `#story`  | 4-chapter narrative origin story          |
| Status  | `#status` | Live system health, uptime, incident log  |

---

## Running Locally

Because `app.js` uses ES modules (`type="module"`), open via a local server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

Then visit: `http://localhost:8080`

---

## Debug Console

All core objects are exposed on `window.__CROWD__`:

```js
// Navigate programmatically
__CROWD__.routerController.navigate('docs')

// Force a decay tick
__CROWD__.agentController.applyDecay()

// Add a new agent
__CROWD__.agentController.addAgent({ name: 'MY-BOT', fuel: 5000 })

// Reset all agents to defaults
__CROWD__.agentController.resetAll()

// Inspect network state
__CROWD__.networkModel.get()
```

---

## Theme

Toggle via the button in the navbar. Preference is persisted in `localStorage` under key `crowd-theme`.

- **Light** — Blue on white (`#f0f7ff` base, `#0d9de0` accent)
- **Dark**  — Deep navy (`#050d14` base, `#00c6ff` accent with glow effects)

---

*Cronos Warden — Cronos Edition*
