// ============================================================
//  RouterController.js — SPA Page Routing
//  Manages navigation between Home, Docs, Story, Status
//  Cronos Warden — Cronos Edition
// ============================================================

export class RouterController {
  /**
   * @param {RouterView}  routerView
   * @param {StatusView}  statusView
   * @param {DocsView}    docsView
   */
  constructor(routerView, statusView, docsView) {
    this._router = routerView;
    this._status = statusView;
    this._docs   = docsView;

    this._pages    = ['home', 'docs', 'story', 'status'];
    this._current  = 'home';

    this._pageTitles = {
      home:   'CROWD — Cronos Warden',
      docs:   'CROWD — Documentation',
      story:  'CROWD — The Story',
      status: 'CROWD — Network Status',
    };
  }

  // ── Init: read hash, bind popstate ───────────────────────
  init() {
    // Bind nav links
    this._router.bindNavLinks((page) => this.navigate(page));

    // Bind footer links
    this._router.bindFooterLinks((page) => this.navigate(page));

    // Handle browser back / forward
    window.addEventListener('popstate', (e) => {
      const page = (e.state && e.state.page)
        || location.hash.replace('#', '')
        || 'home';
      if (this._pages.includes(page)) this._navigate(page, false);
    });

    // Initial page from URL hash
    const initial = location.hash.replace('#', '');
    this._navigate(this._pages.includes(initial) ? initial : 'home', false);
  }

  // ── Public navigation (pushes history) ───────────────────
  navigate(page) {
    if (!this._pages.includes(page) || page === this._current) return;
    this._navigate(page, true);
  }

  // ── Internal ──────────────────────────────────────────────
  _navigate(page, pushHistory = true) {
    this._current = page;

    // Update DOM
    this._router.showPage(page);
    document.title = this._pageTitles[page] || 'CROWD';

    // History
    if (pushHistory) {
      history.pushState({ page }, '', '#' + page);
    }

    // Side-effects per page
    if (page === 'status') this._status.updateChecked();
    if (page === 'docs')   this._docs.resetSidebar();

    console.info(`[RouterController] → ${page}`);
  }

  getCurrent() { return this._current; }
}
