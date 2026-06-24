import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { modules, PLAN_URL, totalProblems } from './top150-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.join(__dirname, '../src/content/blog/leetcode-top150');
const SERIES_DATE = '2026-06-22 12:00:00';

const isBannerCover = (cover) => typeof cover === 'string' && cover.includes('/assets/images/banner/');
const top150Cover = (file) => `/assets/images/covers/top150/${file}.svg`;
const keepOrDefaultCover = (existingCover, defaultCover) =>
  existingCover && !isBannerCover(existingCover) ? existingCover : defaultCover;

function problemSectionHeader(problem) {
  return `## ${problem.num}. ${problem.titleZh}`;
}

function renderProblemSection(problem) {
  return `${problemSectionHeader(problem)}

**难度：** ${problem.difficulty}

::btn[力扣做题]{link="https://leetcode.cn/problems/${problem.slug}/" type="info"}

### 思路

<!-- 待填 -->

### 代码

\`\`\`java
// 待填
\`\`\`

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---
`;
}

function isPlaceholderSection(section) {
  const trimmed = section.trim();
  if (!trimmed) return true;
  const hasThought = /### 思路[\s\S]*?<!-- 待填 -->/.test(trimmed);
  const hasCode = /```java[\s\S]*?\/\/ 待填[\s\S]*?```/.test(trimmed);
  const hasTime = /- 时间：(?:<!-- 待填 -->|\$O\(\)\$)/.test(trimmed);
  const hasSpace = /- 空间：(?:<!-- 待填 -->|\$O\(\)\$)/.test(trimmed);
  const hasNote = /### 备注[\s\S]*?<!-- 待填 -->/.test(trimmed);
  return hasThought && hasCode && hasTime && hasSpace && hasNote;
}

function parseExistingSections(content) {
  const body = content.replace(/^---[\s\S]*?---\n/, '');
  const sections = new Map();
  const parts = body.split(/\n(?=## \d+\. )/);
  for (const part of parts) {
    const match = part.match(/^## (\d+)\. /);
    if (match) sections.set(Number(match[1]), part.trimEnd());
  }
  return sections;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) {
      let val = m[2].trim();
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
        val = val.slice(1, -1);
      }
      fm[m[1]] = val;
    }
  }
  return fm;
}

function renderModuleFrontmatter(mod, existing = {}) {
  const hide = existing.hide !== undefined ? existing.hide : true;
  const cover = keepOrDefaultCover(existing.cover, top150Cover(mod.file));
  const lines = [
    '---',
    `title: "Top 150 · ${mod.titleShort}（${mod.problems.length} 题）"`,
    'categories: LeetCode',
    `tags: [${mod.tags.map((t) => `'${t}'`).join(', ')}]`,
    `id: "${mod.postId}"`,
    `date: ${existing.date || SERIES_DATE}`,
    `cover: "${cover}"`,
  ];
  if (existing.updated) lines.push(`updated: ${existing.updated}`);
  lines.push(`hide: ${hide}`);
  lines.push('recommend: false');
  lines.push('top: false');
  lines.push('---');
  return lines.join('\n');
}

function renderModulePost(mod, existingContent = null) {
  const existingSections = existingContent ? parseExistingSections(existingContent) : new Map();
  const existingFm = existingContent ? parseFrontmatter(existingContent) : {};

  const intro = `:::note
${mod.summary}

本模块共 **${mod.problems.length}** 题，属于 [LeetCode 面试经典 150 题](${PLAN_URL}) 系列。
:::

`;

  const problemBlocks = mod.problems.map((p) => {
    const existing = existingSections.get(p.num);
    if (existing && !isPlaceholderSection(existing)) return existing + '\n';
    return renderProblemSection(p);
  });

  return `${renderModuleFrontmatter(mod, existingFm)}\n\n${intro}${problemBlocks.join('\n')}`;
}

function parseIndexProgress(content) {
  const done = new Set();
  if (!content) return done;
  const body = content.replace(/^---[\s\S]*?---\n/, '');
  for (const line of body.split('\n')) {
    const taskMatch = line.match(/^- \[([ xX])\] \*\*(\d{2}) ·/);
    if (taskMatch && (taskMatch[1] === 'x' || taskMatch[1] === 'X')) {
      done.add(taskMatch[2]);
      continue;
    }
    const tableMatch = line.match(/^\| (\d{2}) \|.+?\| (?:✅|\[x\]|已完成|- \[x\]) \|?\s*$/i);
    if (tableMatch) done.add(tableMatch[1]);
  }
  return done;
}

function renderIndexPost(existingContent = null) {
  const existingFm = existingContent ? parseFrontmatter(existingContent) : {};
  const cover = keepOrDefaultCover(existingFm.cover, top150Cover('index'));
  const done = parseIndexProgress(existingContent);
  const rows = modules
    .map((m) => {
      const status = done.has(m.id) ? '✅' : '⬜';
      return `| ${m.id} | ${m.title} | ${m.problems.length} | [阅读](/article/${m.postId}) | ${status} |`;
    })
    .join('\n');

  return `---
title: "LeetCode 面试经典 150 题 · 学习索引"
categories: LeetCode
tags: ['Top150', 'LeetCode', '面试']
id: "top150-index"
date: ${SERIES_DATE}
cover: "${cover}"
hide: false
recommend: true
top: true
---

:::note{type="info"}
本系列按 [LeetCode 面试经典 150 题](${PLAN_URL}) 官方模块划分，共 **${modules.length}** 个模块、**${totalProblems}** 道题。每模块一篇博客，内含 Java 解法与中文笔记。
:::

## 模块进度

| # | 模块 | 题数 | 文章 | 状态 |
|---|------|------|------|------|
${rows}

## 刷题建议

1. 按上表顺序逐模块推进，与力扣学习计划保持一致。
2. 每完成一模块，在对应 md 中填写思路与 Java 代码，再将 \`hide: false\`。
3. 完成某模块后，将表中对应行的 \`⬜\` 改为 \`✅\`。
`;
}

async function writeFileIfChanged(filePath, content) {
  let prev = '';
  try {
    prev = await fs.readFile(filePath, 'utf8');
  } catch {
    // new file
  }
  if (prev === content) {
    console.log(`⏭  未变更：${path.basename(filePath)}`);
    return false;
  }
  await fs.writeFile(filePath, content, 'utf8');
  console.log(`✅ 已写入：${path.basename(filePath)}`);
  return true;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  let written = 0;

  const indexPath = path.join(OUT_DIR, '00-index.md');
  let existingIndex = '';
  try {
    existingIndex = await fs.readFile(indexPath, 'utf8');
  } catch {
    // new index post
  }
  if (await writeFileIfChanged(indexPath, renderIndexPost(existingIndex || null))) written++;

  for (const mod of modules) {
    const filePath = path.join(OUT_DIR, `${mod.file}.md`);
    let existing = '';
    try {
      existing = await fs.readFile(filePath, 'utf8');
    } catch {
      // new module post
    }
    const content = renderModulePost(mod, existing || null);
    if (await writeFileIfChanged(filePath, content)) written++;
  }

  console.log(`\n📊 共 ${modules.length} 个模块、${totalProblems} 道题；本次更新 ${written} 个文件`);
  console.log(`📂 输出目录：${OUT_DIR}`);
}

main().catch((err) => {
  console.error('❌ 生成失败：', err);
  process.exit(1);
});
