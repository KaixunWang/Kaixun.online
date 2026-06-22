import en from './en';
import zh from './zh';
import type { I18nMessages, Locale } from './types';

export type { I18nMessages, Locale };

export const messages: Record<Locale, I18nMessages> = { zh, en };

export const DEFAULT_LOCALE: Locale = 'zh';

export function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function interpolate(
  template: string,
  vars: Record<string, string | number> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  );
}

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const value = getByPath(messages[locale] as unknown as Record<string, unknown>, key);
  if (typeof value !== 'string') return key;
  return vars ? interpolate(value, vars) : value;
}

/** Default zh strings for build-time meta / fallback */
export const defaultSite = zh.site;
