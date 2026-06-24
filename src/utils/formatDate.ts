import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import type { Locale } from '@/i18n';

dayjs.extend(utc);

export function formatDate(
  time: string | Date,
  locale: Locale,
  fmt: string = 'MMMM D, YYYY',
): string {
  dayjs.locale(locale === 'zh' ? 'zh-cn' : 'en');
  return dayjs(time).utc().format(fmt);
}

export function toDatetimeAttr(date: Date): string {
  return date.toISOString();
}
