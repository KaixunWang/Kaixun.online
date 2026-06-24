/**
 * 根据文件修改时间为已编辑的文章写入 frontmatter `updated` 字段。
 * 部署环境无法依赖 mtime，需本地运行后 commit。
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import dayjs from 'dayjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '../src/content/blog');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) fm[m[1]] = m[2].trim();
  }
  return { raw: match[1], block: match[0], body: content.slice(match[0].length), fm };
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

function isEditedBody(body) {
  const sections = body.split(/\n(?=## \d+\. )/);
  return sections.some((section) => /^## \d+\./.test(section) && !isPlaceholderSection(section));
}

function removeUpdated(fmRaw) {
  return fmRaw.replace(/^updated:.*\n/m, '');
}

function upsertUpdated(fmRaw, updatedStr) {
  if (/^updated:/m.test(fmRaw)) {
    return fmRaw.replace(/^updated:.*$/m, `updated: ${updatedStr}`);
  }
  if (/^date:/m.test(fmRaw)) {
    return fmRaw.replace(/^(date:.*)$/m, `$1\nupdated: ${updatedStr}`);
  }
  return `${fmRaw}\nupdated: ${updatedStr}`;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (/\.(md|mdx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

async function syncFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const parsed = parseFrontmatter(content);
  if (!parsed || !parsed.fm.date) return false;

  const edited = isEditedBody(parsed.body);

  if (!edited) {
    if (!parsed.fm.updated) return false;
    const newFmRaw = removeUpdated(parsed.raw);
    const newContent = `---\n${newFmRaw}\n---${parsed.body}`;
    await fs.writeFile(filePath, newContent, 'utf8');
    console.log(`🧹 ${path.relative(BLOG_DIR, filePath)} → 移除 updated（仍为模板）`);
    return true;
  }

  const stat = await fs.stat(filePath);
  const updatedStr = dayjs(stat.mtime).format('YYYY-MM-DD HH:mm:ss');
  const existingUpdated = parsed.fm.updated;

  if (existingUpdated === updatedStr) return false;

  const newFmRaw = upsertUpdated(parsed.raw, updatedStr);
  const newContent = `---\n${newFmRaw}\n---${parsed.body}`;
  await fs.writeFile(filePath, newContent, 'utf8');
  console.log(`✅ ${path.relative(BLOG_DIR, filePath)} → updated: ${updatedStr}`);
  return true;
}

async function main() {
  const files = await walk(BLOG_DIR);
  let count = 0;
  for (const file of files) {
    if (await syncFile(file)) count++;
  }
  console.log(count ? `\n📊 已更新 ${count} 篇文章的 updated 字段` : '\n📊 无需更新');
}

main().catch((err) => {
  console.error('❌ sync-updated 失败：', err);
  process.exit(1);
});
