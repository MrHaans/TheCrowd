// ============================================================
//  ThemeView.js — Light / Dark Mode Toggle
//  Cronos Warden — Cronos Edition
// ============================================================

export class ThemeView {
  constructor({ btnId, labelId, storageKey = 'crowd-theme' }) {
    this._btn        = document.getElementById(btnId);
    this._label      = document.getElementById(labelId);
    this._storageKey = storageKey;
    this._html       = document.documentElement;

    this._init();
  }

  _init() {
    // Restore saved preference
    const saved = localStorage.getItem(this._storageKey) || 'light';
    this._apply(saved);

    // Bind click
    if (this._btn) {
      this._btn.addEventListener('click', () => this.toggle());
    }
  }

  toggle() {
    const current = this._html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this._apply(next);
    localStorage.setItem(this._storageKey, next);
  }

  _apply(theme) {
    if (theme === 'dark') {
      this._html.setAttribute('data-theme', 'dark');
      if (this._label) this._label.textContent = 'LIGHT';
    } else {
      this._html.removeAttribute('data-theme');
      if (this._label) this._label.textContent = 'DARK';
    }
  }

  getTheme() {
    return this._html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
}
