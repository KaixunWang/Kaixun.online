import type { I18nMessages } from './types';

const zh: I18nMessages = {
  site: {
    title: 'kaixun.online',
    subtitle: '记录与分享.',
    description: 'kaixun.online 个人博客，记录学习、项目与生活。',
    tips: '<p>欢迎来访 🎉</p><p>这里会分享我的学习笔记、项目与日常。</p>',
  },
  typewrite: ['祝你天天开心！', '记录与分享。'],
  nav: {
    home: 'Home',
    search: '搜索',
    archives: '归档',
    about: '关于',
    message: '留言',
    links: '友链',
    friends: '圈子',
    talking: '动态',
  },
  aside: {
    notice: '公告',
    categories: '分类',
    tags: '热门标签',
    articleCount: '文章数',
    categoryCount: '分类数',
    tagCount: '标签数',
    recommend: '推荐文章',
  },
  footer: {
    uptime: '稳定运行',
  },
  search: {
    placeholder: '搜索文章',
  },
  pagination: {
    prev: '上一页',
    next: '下一页',
    first: '第一页',
    page: '第{page}页',
  },
  archive: {
    postCount: '{count}篇文章',
  },
  article: {
    wordUnit: '字',
    minuteUnit: '分钟',
    wordFallback: '一点',
    noMore: '没有啦~',
  },
  copyright: {
    published: '本文由 {author} 于 {time} 发布',
    url: '文章地址：',
    licenseHtml:
      '本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0" target="_blank" rel="noopener nofollow">CC BY-NC-SA 4.0</a> 许可协议。完整转载请注明来自 <a href="{siteUrl}">{site}</a>！',
  },
  reward: {
    prompt: '喜欢这篇文章嘛，觉得文章不错的话，奖励奖励我！',
    alipay: '支付宝',
    wechat: '微信',
  },
  pages: {
    archives: '归档',
    categoriesTitle: '分类 {name} 下的文章',
    tagsTitle: '标签 {name} 下的文章',
    homePage: '第{page}页文章',
    about: { h1: '关于我', desc: 'Kaixun Wang · 南科大 CSE' },
    message: { h1: '留言板 🌸', desc: '快友之事莫若谈。' },
    links: { h1: '朋友圈 👭', desc: '天下快意之事莫若友。' },
    friends: { h1: '朋友的新动态 🎴', desc: '来看看我的朋友们都在干嘛.' },
    talking: { h1: '动态 🥫', desc: '记录美好生活.' },
    notFound: { h1: '404 Not Found', title: '404 Not Found' },
  },
  locale: {
    switchToEn: 'EN',
    switchToZh: '中',
    switchLabel: '切换语言',
    labelZh: '中文',
    labelEn: 'English',
  },
};

export default zh;
