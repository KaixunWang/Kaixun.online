import SITE_INFO from '@/config';

const BANNER_PATH = '/assets/images/banner/';

function normalizeSiteUrl(pathname: string) {
  if (/^(https?:)?\/\//.test(pathname) || pathname.startsWith('data:')) return pathname;
  const site = SITE_INFO.Site.replace(/\/+$/, '');
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${site}${path}`;
}

function isBannerCover(cover: string) {
  return cover.includes(BANNER_PATH);
}

/** 页面展示用相对路径，便于本地 dev 与线上同源加载 */
export function resolveCoverPath(filename: string | null | undefined) {
  const cover = filename && !isBannerCover(filename) ? filename : SITE_INFO.Cover;
  if (/^(https?:)?\/\//.test(cover) || cover.startsWith('data:')) return cover;
  return cover.startsWith('/') ? cover : `/${cover}`;
}

/** og:image 等 meta 标签用绝对 URL */
export function resolveCoverUrl(filename: string | null | undefined) {
  return normalizeSiteUrl(resolveCoverPath(filename));
}

export default async (filename: string | null | undefined) => {
  return resolveCoverPath(filename);
};
