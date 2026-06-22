export type Locale = 'zh' | 'en';

export type I18nMessages = {
  site: {
    title: string;
    subtitle: string;
    description: string;
    tips: string;
  };
  typewrite: string[];
  nav: {
    home: string;
    search: string;
    archives: string;
    about: string;
    message: string;
    links: string;
    friends: string;
    talking: string;
  };
  aside: {
    notice: string;
    categories: string;
    tags: string;
    articleCount: string;
    categoryCount: string;
    tagCount: string;
    recommend: string;
  };
  footer: {
    uptime: string;
  };
  search: {
    placeholder: string;
  };
  pagination: {
    prev: string;
    next: string;
    first: string;
    page: string;
  };
  archive: {
    postCount: string;
  };
  article: {
    wordUnit: string;
    minuteUnit: string;
    wordFallback: string;
    noMore: string;
  };
  copyright: {
    published: string;
    url: string;
    licenseHtml: string;
  };
  reward: {
    prompt: string;
    alipay: string;
    wechat: string;
  };
  pages: {
    archives: string;
    categoriesTitle: string;
    tagsTitle: string;
    homePage: string;
    about: { h1: string; desc: string };
    message: { h1: string; desc: string };
    links: { h1: string; desc: string };
    friends: { h1: string; desc: string };
    talking: { h1: string; desc: string };
    notFound: { h1: string; title: string };
  };
  locale: {
    switchToEn: string;
    switchToZh: string;
    switchLabel: string;
    labelZh: string;
    labelEn: string;
  };
};
