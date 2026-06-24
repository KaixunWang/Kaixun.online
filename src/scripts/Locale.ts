import {
  DEFAULT_LOCALE,
  messages,
  translate,
  type Locale,
} from '@/i18n';
import { formatDate } from '@/utils/formatDate';

const STORAGE_KEY = 'kaixun-locale';

let currentLocale: Locale = DEFAULT_LOCALE;

export function getLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'zh' || stored === 'en') return stored;
  return DEFAULT_LOCALE;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, locale);
  }
}

export function t(key: string, vars?: Record<string, string | number>): string {
  return translate(currentLocale, key, vars);
}

function readTemplateVars(el: Element): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const attr of el.attributes) {
    if (attr.name.startsWith('data-i18n-') && attr.name !== 'data-i18n-template') {
      const varName = attr.name.slice('data-i18n-'.length);
      vars[varName] = attr.value;
    }
  }
  return vars;
}

function formatDocumentTitle(pageTitle: string): string {
  const siteName = messages[currentLocale].site.title;
  const subtitle = messages[currentLocale].site.subtitle;
  if (pageTitle) return `${pageTitle} | ${siteName}`;
  return `${siteName} - ${subtitle}`;
}

function updateDocumentTitle(): void {
  const el = document.querySelector('[data-document-title]');
  if (!el) return;
  const key = el.getAttribute('data-document-title');
  if (key === '') {
    document.title = formatDocumentTitle('');
    return;
  }
  if (!key) return;
  const vars = readTemplateVars(el);
  const numericVars: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(vars)) {
    numericVars[k] = /^\d+$/.test(v) ? Number(v) : v;
  }
  document.title = formatDocumentTitle(t(key, numericVars));
}

function applyLangBlocks(root: ParentNode): void {
  root.querySelectorAll('[data-lang]').forEach((el) => {
    const lang = el.getAttribute('data-lang');
    if (lang === currentLocale) {
      el.removeAttribute('hidden');
    } else {
      el.setAttribute('hidden', '');
    }
  });
}

function applyLangShow(root: ParentNode): void {
  root.querySelectorAll('[data-lang-show]').forEach((el) => {
    const show = el.getAttribute('data-lang-show');
    if (show === currentLocale) {
      el.removeAttribute('hidden');
    } else {
      el.setAttribute('hidden', '');
    }
  });
}

function updateLocaleFloatUI(): void {
  document.querySelectorAll('[data-locale-option]').forEach((btn) => {
    const locale = btn.getAttribute('data-locale-option') as Locale;
    const active = locale === currentLocale;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}

function closeLocaleMenu(): void {
  const float = document.getElementById('locale-float');
  if (!float) return;
  float.classList.remove('open');
  float.querySelector('.vh-locale-float-trigger')?.setAttribute('aria-expanded', 'false');
}

export function applyLocale(root: ParentNode = document): void {
  currentLocale = getLocale();
  document.documentElement.lang = currentLocale === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.dataset.locale = currentLocale;

  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    el.textContent = t(key, readTemplateVars(el));
  });

  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (!key) return;
    el.innerHTML = t(key);
  });

  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key || !(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return;
    el.placeholder = t(key);
  });

  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (!key) return;
    const vars = readTemplateVars(el);
    const numericVars: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(vars)) {
      numericVars[k] = /^\d+$/.test(v) ? Number(v) : v;
    }
    el.setAttribute('title', t(key, numericVars));
  });

  root.querySelectorAll('time[data-i18n-date]').forEach((el) => {
    const iso = el.getAttribute('datetime');
    const fmt = el.getAttribute('data-i18n-date') || 'MMMM D, YYYY';
    if (!iso) return;
    el.textContent = formatDate(iso, currentLocale, fmt);
  });

  root.querySelectorAll('[data-i18n-template]').forEach((el) => {
    const key = el.getAttribute('data-i18n-template');
    if (!key) return;
    const vars = readTemplateVars(el);
    if (vars.timeIso) {
      vars.time = formatDate(vars.timeIso, currentLocale, 'YYYY-MM-DD A');
    }
    const numericVars: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(vars)) {
      if (k === 'timeIso') continue;
      numericVars[k] = /^\d+$/.test(v) ? Number(v) : v;
    }
    const text = t(key, numericVars);
    if (el.hasAttribute('data-i18n-html-template')) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  applyLangBlocks(root);
  applyLangShow(root);
  updateDocumentTitle();
  updateLocaleFloatUI();
}

export function switchLocale(locale: Locale): void {
  if (locale === currentLocale) return;
  setLocale(locale);
  applyLocale();
  restartTypewriter();
}

let typewriterRestart: (() => void) | null = null;

export function registerTypewriterRestart(fn: () => void): void {
  typewriterRestart = fn;
}

export function restartTypewriter(): void {
  typewriterRestart?.();
}

let floatBound = false;

export function initLocaleFloat(): void {
  if (floatBound) return;
  floatBound = true;

  const float = document.getElementById('locale-float');
  if (!float) return;

  const trigger = float.querySelector('.vh-locale-float-trigger');
  trigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !float.classList.contains('open');
    float.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  float.querySelectorAll('[data-locale-option]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const locale = btn.getAttribute('data-locale-option') as Locale;
      if (locale === 'zh' || locale === 'en') {
        switchLocale(locale);
      }
      closeLocaleMenu();
    });
  });

  document.addEventListener('click', () => closeLocaleMenu());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLocaleMenu();
  });
}
