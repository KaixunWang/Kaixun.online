# 个性化修改清单

上线前请逐项检查。示例文章已移至 [`_templates/vhAstro-theme/`](_templates/vhAstro-theme/)，当前 `src/content/blog/` 为空。

## 必改（站点身份）

| 文件 | 需改内容 | 状态 |
|------|----------|------|
| [`src/config.ts`](src/config.ts) | `Title` / `Author` / `Avatar` / `Motto` / `CreateTime` / `Theme` 颜色 / `Navs`（`i18nKey` + link） / `WebSites` | 部分已改，请继续完善 |
| [`src/i18n/zh.ts`](src/i18n/zh.ts) / [`src/i18n/en.ts`](src/i18n/en.ts) | UI 文案、公告 Tips、Banner 打字机列表、静态页标题 | 按需修改 |
| [`src/pages/about/index.md`](src/pages/about/index.md) | CV 式关于页（中英 `data-lang`、经历/项目/技能图标） | 已按简历填写，可继续改 |
| [`public/assets/images/logo.png`](public/assets/images/logo.png) | 头像 / Logo | theme 默认 |
| [`public/assets/images/home-banner.webp`](public/assets/images/home-banner.webp) | 首页 Banner 背景 | theme 默认 |

## 若启用对应页面则需改

| 文件 | 需改内容 | 状态 |
|------|----------|------|
| [`src/page_data/Link.ts`](src/page_data/Link.ts) | 友链列表 | 已清空，待添加 |
| [`src/page_data/Talking.ts`](src/page_data/Talking.ts) | 说说动态 | 已清空，待添加 |
| [`src/page_data/Friends.ts`](src/page_data/Friends.ts) | 圈子 RSS | 已清空，待添加 |
| [`src/pages/links/index.md`](src/pages/links/index.md) | 友链页说明 | 占位，待填写 |
| [`src/pages/friends/index.md`](src/pages/friends/index.md) | 圈子页文案（Nav 未链入，URL 仍可访问） | 可选 |
| [`src/pages/talking/index.md`](src/pages/talking/index.md) | 动态页文案（同上） | 可选 |

## 可选配置（启用时再填）

| 配置项 | 位置 |
|--------|------|
| 评论 Twikoo / Waline | `src/config.ts` → `Comment` |
| 赞赏码 | `src/config.ts` → `Reward`（两项都填才显示） |
| 音乐 API | `src/config.ts` → `vhMusicApi` |
| 备案号 | `src/components/Footer/Footer.astro`（当前无 ICP 链接） |

## 启用评论时注意

| 文件 | 说明 |
|------|------|
| [`src/scripts/Comment.ts`](src/scripts/Comment.ts) | Waline 图片上传默认指向 `wp-cdn.4ce.cn`，需改成你自己的图床或关闭上传 |
| [`public/vh-search.json`](public/vh-search.json) | 本地搜索索引（无文章时应为 `[]`，`npm run build` 会重新生成） |

## 中英切换

- 导航栏左下角 **地球浮球** 点击展开下拉，选择中文 / English 切换语言，偏好保存在浏览器 `localStorage`（键名 `kaixun-locale`，默认中文）。
- **会切换**：导航、侧边栏、页脚、搜索、分页、静态页标题与正文（`data-lang="zh"` / `data-lang="en"` 块）。
- **不切换**：博客文章标题、正文、分类名、标签名。
- 改 UI 文案：编辑 [`src/i18n/zh.ts`](src/i18n/zh.ts) 与 [`src/i18n/en.ts`](src/i18n/en.ts)。
- 改静态页正文：在对应 `.md` 里维护两个 `data-lang` 块，例如：

```markdown
<div data-lang="zh">

中文内容

</div>

<div data-lang="en" hidden>

English content

</div>
```

## 不必改

- [`src/pages/message/index.md`](src/pages/message/index.md)、[`src/pages/404.md`](src/pages/404.md) — 已有中英 `data-lang` 块，可按需改文案
- 页脚 Astro / vhAstro-Theme 主题署名 — 已保留
- [`archive/nextjs-site/`](archive/nextjs-site/) — 旧项目备份

## 写文章

```bash
npm run newpost "文章标题"
# 或复制 _templates/vhAstro-theme/post-template.md 到 src/content/blog/
```
