import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/assets/images/covers/notes');

const themes = [
  { bg0: '#07111f', bg1: '#123c4b', accent: '#01C4B6', sub: '#d6f7f4' },
  { bg0: '#111827', bg1: '#7f1d1d', accent: '#f97316', sub: '#ffedd5' },
  { bg0: '#0c4a6e', bg1: '#1e3a8a', accent: '#38bdf8', sub: '#e0f2fe' },
  { bg0: '#0f172a', bg1: '#312e81', accent: '#a78bfa', sub: '#ede9fe' },
  { bg0: '#064e3b', bg1: '#14532d', accent: '#34d399', sub: '#d1fae5' },
  { bg0: '#422006', bg1: '#713f12', accent: '#fbbf24', sub: '#fef3c7' },
  { bg0: '#4a044e', bg1: '#831843', accent: '#f472b6', sub: '#fce7f3' },
  { bg0: '#1e1b4b', bg1: '#4338ca', accent: '#818cf8', sub: '#e0e7ff' },
];

const notes = [
  { file: 'index', badge: '课程笔记', title: '课程笔记', subtitle: '7 门课程 · PDF 在线预览', theme: 0 },
  { file: '01-computer-organization', badge: '课程笔记 · 01', title: '计算机组成原理', subtitle: 'PDF 笔记 · 在线预览', theme: 1 },
  { file: '02-computer-network', badge: '课程笔记 · 02', title: '计算机网络', subtitle: 'PDF 笔记 · 在线预览', theme: 2 },
  { file: '03-probability', badge: '课程笔记 · 03', title: '概率论', subtitle: 'PDF 笔记 · 在线预览', theme: 3 },
  { file: '04-database', badge: '课程笔记 · 04', title: '数据库', subtitle: 'PDF 笔记 · 在线预览', theme: 4 },
  { file: '05-digital-logic', badge: '课程笔记 · 05', title: '数字逻辑', subtitle: 'PDF 笔记 · 在线预览', theme: 5 },
  { file: '06-software-engineering', badge: '课程笔记 · 06', title: '软件工程', subtitle: 'PDF 笔记 · 在线预览', theme: 6 },
  { file: '07-os', badge: '课程笔记 · 07', title: '操作系统', subtitle: 'PDF 笔记 · 在线预览', theme: 7 },
];

function titleSize(title) {
  const len = [...title].length;
  if (len <= 4) return 84;
  if (len <= 6) return 72;
  return 60;
}

function renderCover({ file, badge, title, subtitle, theme: themeIdx }) {
  const t = themes[themeIdx];
  const uid = file.replace(/[^a-z0-9]/gi, '');
  const size = titleSize(title);
  const yTitle = size >= 84 ? 302 : size >= 72 ? 310 : 318;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg-${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.bg0}"/>
      <stop offset="1" stop-color="${t.bg1}"/>
    </linearGradient>
    <radialGradient id="glow-${uid}" cx="78%" cy="20%" r="65%">
      <stop offset="0" stop-color="${t.accent}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${t.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg-${uid})"/>
  <rect width="1200" height="630" fill="url(#glow-${uid})"/>
  <circle cx="1010" cy="120" r="178" fill="${t.accent}" opacity="0.12"/>
  <circle cx="1040" cy="500" r="220" fill="#ffffff" opacity="0.05"/>
  <path d="M80 500 C260 380 390 560 565 430 S845 290 1120 390" fill="none" stroke="${t.accent}" stroke-width="14" opacity="0.28" stroke-linecap="round"/>
  <rect x="74" y="74" width="1052" height="482" rx="38" fill="#ffffff" opacity="0.06" stroke="#ffffff" stroke-opacity="0.14"/>
  <text x="100" y="142" fill="${t.accent}" font-family="Inter, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="34" font-weight="700" letter-spacing="2">${badge}</text>
  <text x="100" y="${yTitle}" fill="#ffffff" font-family="Inter, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="${size}" font-weight="800">${title}</text>
  <text x="104" y="382" fill="${t.sub}" font-family="Inter, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="36" font-weight="600">${subtitle}</text>
  <text x="100" y="505" fill="#ffffff" opacity="0.68" font-family="Inter, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="26">kaixun.online · 本科课程笔记</text>
</svg>
`;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  for (const note of notes) {
    const out = path.join(OUT_DIR, `${note.file}.svg`);
    await fs.writeFile(out, renderCover(note), 'utf8');
    console.log(`✅ ${note.file}.svg`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
