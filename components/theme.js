// theme.js — Dark / Light / System theme management
// Stored in localStorage as qwv_theme. Default: 'system'

const STORAGE_KEY = 'qwv_theme';

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) || 'system';
  applyTheme(saved);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ((localStorage.getItem(STORAGE_KEY) || 'system') === 'system') {
      applyTheme('system');
    }
  });
}

export function applyTheme(mode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = mode === 'dark' || (mode === 'system' && prefersDark);
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  localStorage.setItem(STORAGE_KEY, mode);

  // Swap every logo image in the DOM
  const logoSrc = isDark
    ? 'assets/images/Alif-Dark.png'
    : 'assets/images/Alif-Light.png';

  // All .alif-logo class elements
  document.querySelectorAll('.alif-logo').forEach(img => {
    img.src = logoSrc;
  });
  // Specific IDs used in index.html sidebar
  ['logo-left', 'logo-loading'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.src = logoSrc;
  });

  // Update sidebar theme button if present
  const themeBtn = document.getElementById('sidebar-theme-btn');
  if (themeBtn) {
    const icons  = { dark: '🌙', light: '☀️', system: '💻' };
    const labels = { dark: 'Dark', light: 'Light', system: 'System' };
    const iconEl  = themeBtn.querySelector('.theme-toggle-icon');
    const labelEl = themeBtn.querySelector('span:last-child');
    if (iconEl)  iconEl.textContent  = icons[mode];
    if (labelEl) labelEl.textContent = labels[mode];
  }
}

export function getTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'system';
}

export function isDark() {
  return document.documentElement.dataset.theme === 'dark';
}

// ── TEXT SIZE ──
const TEXT_SIZE_KEY = 'qwv_text_size';
const TEXT_SIZES = ['normal', 'large', 'xlarge'];

export function initTextSize() {
  const saved = localStorage.getItem(TEXT_SIZE_KEY) || 'normal';
  applyTextSize(saved);
}

export function applyTextSize(size) {
  if (!TEXT_SIZES.includes(size)) size = 'normal';
  const html = document.documentElement;
  if (size === 'normal') {
    delete html.dataset.textSize;
  } else {
    html.dataset.textSize = size;
  }
  localStorage.setItem(TEXT_SIZE_KEY, size);
}

export function getTextSize() {
  return localStorage.getItem(TEXT_SIZE_KEY) || 'normal';
}

export function cycleTextSize() {
  const current = getTextSize();
  const idx = TEXT_SIZES.indexOf(current);
  const next = TEXT_SIZES[(idx + 1) % TEXT_SIZES.length];
  applyTextSize(next);
  return next;
}
