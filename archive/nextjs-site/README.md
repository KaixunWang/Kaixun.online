# Next.js 全栈站点（已归档）

**归档日期**：2026-06-22

原 **kaixun.online** 个人站点，基于 Next.js (App Router) + Prisma + PostgreSQL，包含用户认证、Admin 后台、博客、评论、作品集等功能。

## 技术栈

- Next.js 16 + React 19
- Prisma + PostgreSQL
- NextAuth（邮箱 + GitHub OAuth）
- TipTap 富文本编辑器
- Docker + Nginx 部署

## 本地恢复运行

```bash
cd archive/nextjs-site
npm install
cp .env.production.example .env   # 填写 DATABASE_URL、NEXTAUTH_SECRET 等
docker compose up -d --build
npm run dev
```

生产环境部署见 `docker-compose.prod.yml` 与 `scripts/deploy-prod.sh`。

## 说明

此目录为历史代码备份。新站点已迁移至仓库根目录的 Astro 静态站。PostgreSQL 中的文章/项目数据未自动导出，如需迁移请另行处理。
