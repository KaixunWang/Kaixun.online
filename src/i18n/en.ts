import type { I18nMessages } from './types';

const en: I18nMessages = {
  site: {
    title: 'kaixun.online',
    subtitle: 'Notes & sharing.',
    description: 'Personal blog by Kaixun — learning, projects, and life.',
    tips: '<p>Welcome! 🎉</p><p>I share notes on learning, projects, and everyday life here.</p>',
  },
  typewrite: ['Wish you a great day!', 'Build and Share.'],
  nav: {
    home: 'Home',
    search: 'Search',
    archives: 'Archives',
    about: 'About',
    message: 'Guestbook',
    links: 'Links',
    friends: 'Friends',
    talking: 'Moments',
  },
  aside: {
    notice: 'Notice',
    categories: 'Categories',
    tags: 'Popular tags',
    articleCount: 'Posts',
    categoryCount: 'Categories',
    tagCount: 'Tags',
    recommend: 'Recommended',
  },
  footer: {
    uptime: 'Uptime',
  },
  search: {
    placeholder: 'Search posts',
  },
  pagination: {
    prev: 'Previous',
    next: 'Next',
    first: 'First page',
    page: 'Page {page}',
  },
  archive: {
    postCount: '{count} posts',
  },
  article: {
    wordUnit: ' words',
    minuteUnit: ' min',
    wordFallback: 'a few',
    noMore: 'No more',
  },
  copyright: {
    published: 'Published by {author} on {time}',
    url: 'Permalink: ',
    licenseHtml:
      'Posts are licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0" target="_blank" rel="noopener nofollow">CC BY-NC-SA 4.0</a> unless stated otherwise. Please credit <a href="{siteUrl}">{site}</a> when reposting.',
  },
  reward: {
    prompt: 'Enjoyed this post? Buy me a coffee!',
    alipay: 'Alipay',
    wechat: 'WeChat',
  },
  pages: {
    archives: 'Archives',
    categoriesTitle: 'Posts in {name}',
    tagsTitle: 'Posts tagged {name}',
    homePage: 'Page {page}',
    about: { h1: 'About me', desc: 'Kaixun Wang · SUSTech CSE' },
    message: { h1: 'Guestbook 🌸', desc: 'Leave a note if you like.' },
    links: { h1: 'Blogroll 👭', desc: 'Friends on the web.' },
    friends: { h1: 'Friends feed 🎴', desc: 'What my friends are up to.' },
    talking: { h1: 'Moments 🥫', desc: 'Life in short updates.' },
    notFound: { h1: '404 Not Found', title: '404 Not Found' },
  },
  locale: {
    switchToEn: 'EN',
    switchToZh: '中',
    switchLabel: 'Switch language',
    labelZh: '中文',
    labelEn: 'English',
  },
};

export default en;
