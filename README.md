# kaixun.online

基于 [vhAstro-Theme](https://github.com/uxiaohan/vhAstro-Theme) 的个人博客，部署在 **Vercel** 静态托管。

旧 Next.js 全栈版本已归档至 [`archive/nextjs-site/`](archive/nextjs-site/)。大陆 ECS + Nginx 方案见 [`nginx/`](nginx/) 与 [`scripts/deploy.sh`](scripts/deploy.sh)（需 ICP 备案）。

**上线前请阅读** [`PERSONALIZE.md`](PERSONALIZE.md) — 列出所有需改成你自己信息的位置。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:4321](http://localhost:4321)。

## 站点配置

编辑 [`src/config.ts`](src/config.ts)：站点名、导航链接、头像、主题色等。UI 文案（副标题、公告、导航文字等）在 [`src/i18n/zh.ts`](src/i18n/zh.ts) / [`src/i18n/en.ts`](src/i18n/en.ts)。

## 语言切换

Header 左下角 **地球浮球** 点击展开下拉，选择中文 / English 切换界面语言（博客正文不切换）。偏好保存在浏览器本地，Swup 无刷新跳转后仍生效。

## 写文章

```bash
npm run newpost "文章标题"
```

文章生成在 `src/content/blog/年/月/文章标题.md`。

格式模板见 [`_templates/vhAstro-theme/post-template.md`](_templates/vhAstro-theme/post-template.md)；theme 自带 8 篇示例在 [`_templates/vhAstro-theme/posts/`](_templates/vhAstro-theme/posts/)（不参与构建）。

## 构建与部署（Vercel）

### 首次接入

1. 将仓库 push 到 GitHub
2. 打开 [Vercel](https://vercel.com) → **Add New Project** → 导入该仓库
3. 框架会自动识别为 **Astro**（已含根目录 [`vercel.json`](vercel.json)）
4. 直接 **Deploy**（Build：`npm run build`，Output：`dist`）

### 绑定域名

在 Vercel 项目 **Settings → Domains** 添加 `kaixun.online` 与 `www.kaixun.online`，按 Vercel 提示改 DNS：

| 主机记录 | 类型 | 记录值（以 Vercel 面板为准） |
|---------|------|------------------------------|
| `@` | A | `76.76.21.21` |
| `www` | CNAME | `cname.vercel-dns.com` |

在阿里云解析里删掉指向 ECS `47.92.78.150` 的旧 A 记录，改为上表。生效后自动 HTTPS，无需备案。

### 日常更新

推送到 GitHub 默认分支后 Vercel 会自动构建；本地也可：

```bash
npm i -g vercel
vercel --prod
```

### 可选：大陆 ECS 部署（需备案）

```bash
npm run build
./scripts/deploy.sh
```

## 目录结构

```
├── archive/nextjs-site/       # 旧 Next.js 备份
├── _templates/vhAstro-theme/  # 示例文章与 post 模板
├── PERSONALIZE.md             # 个性化修改清单
├── src/
│   ├── config.ts              # 站点配置（必改）
│   ├── i18n/                  # 中英 UI 文案
│   └── content/blog/          # 博客文章 Markdown
├── vercel.json                # Vercel 构建配置
├── nginx/nginx.conf           # 可选：ECS Nginx（需备案）
└── scripts/deploy.sh          # 可选：ECS rsync 部署
```

## Theme 文档

- 在线演示：https://www.vvhan.com
- Theme 仓库：https://github.com/uxiaohan/vhAstro-Theme
