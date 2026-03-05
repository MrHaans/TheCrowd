// ============================================================
//  RouterView.js — Page Transitions & Nav Active States
//  Cronos Warden — Cronos Edition
// ============================================================

export class RouterView {
  constructor() {
    this._pages   = ['home', 'docs', 'story', 'status'];
    this._navLinks = document.querySelectorAll('.nav-link[data-page]');
  }

  // ── Show a page, hide others ─────────────────────────────
  showPage(page) {
    this._pages.forEach(p => {
      const el = document.getElementById('page-' + p);
      if (el) el.classList.toggle('active', p === page);
    });

    // Update active nav link
    this._navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Bind nav link clicks ──────────────────────────────────
  bindNavLinks(callback) {
    this._navLinks.forEach(link => {
      link.addEventListener('click', () => callback(link.dataset.page));
    });

    // Logo → home
    const logo = document.querySelector('.nav-logo');
    if (logo) logo.addEventListener('click', () => callback('home'));
  }

  // ── Bind footer nav links ─────────────────────────────────
  bindFooterLinks(callback) {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => callback(el.dataset.nav));
    });
  }
}
