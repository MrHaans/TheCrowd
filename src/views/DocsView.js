// ============================================================
//  DocsView.js — Docs Page: Sidebar Scroll Highlighting
//  Cronos Warden — Cronos Edition
// ============================================================

export class DocsView {
  constructor() {
    this._sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
    this._bound = false;
  }

  // ── Called by RouterController when docs page opens ──────
  resetSidebar() {
    this._setActive(null);
    if (!this._bound) this._bindClicks();
  }

  // ── Smooth-scroll to a section within docs content ───────
  scrollToSection(sectionId) {
    const target = document.getElementById('doc-' + sectionId);
    if (!target) return;

    const offset = target.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: offset, behavior: 'smooth' });
    this._setActive(sectionId);
  }

  // ── Highlight the clicked sidebar link ───────────────────
  _setActive(id) {
    this._sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === id);
    });
  }

  // ── Bind sidebar link clicks ─────────────────────────────
  _bindClicks() {
    this._sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollToSection(link.dataset.section);
      });
    });
    this._bound = true;
  }
}
