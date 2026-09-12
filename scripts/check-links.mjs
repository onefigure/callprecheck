/**
 * 빌드 결과(dist/)의 내부 링크와 정적 파일 참조를 검사한다.
 *
 *   npm run build && npm run linkcheck
 *
 * - 내부 링크가 실제 파일로 해석되는지 확인한다.
 * - trailing slash 정책(항상 붙임)을 지키는지 확인한다.
 * - 외부 링크는 네트워크 요청 없이 목록만 출력한다.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = 'dist';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function resolveInternal(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '') return null;

  const rel = clean.replace(/^\//, '');
  const candidates = [
    path.join(DIST, rel),
    path.join(DIST, rel, 'index.html'),
    path.join(DIST, `${rel}.html`),
  ];
  return candidates.find((c) => existsSync(c) && !isDir(c)) ?? null;
}

function isDir(p) {
  try {
    return require('node:fs').statSync(p).isDirectory();
  } catch {
    return false;
  }
}

const files = (await walk(DIST)).filter((f) => f.endsWith('.html'));
const broken = [];
const slashIssues = [];
const external = new Set();
let internalCount = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(ref)) {
      if (/^https?:/.test(ref)) external.add(ref);
      continue;
    }
    if (!ref.startsWith('/')) continue;

    internalCount += 1;
    const target = resolveInternal(ref);
    if (!target) {
      broken.push({ file, ref });
      continue;
    }

    // HTML 페이지로 연결되는 링크는 trailing slash 로 끝나야 한다. (루트 제외)
    const pathOnly = ref.split('#')[0].split('?')[0];
    const isPage = target.endsWith('index.html') && pathOnly !== '/';
    if (isPage && !pathOnly.endsWith('/')) {
      slashIssues.push({ file, ref });
    }
  }
}

console.log(`HTML 파일 ${files.length}개 / 내부 링크 ${internalCount}개 검사`);

if (broken.length) {
  console.log(`\n깨진 내부 링크 ${broken.length}개`);
  for (const b of broken) console.log(`  ${b.file} -> ${b.ref}`);
}

if (slashIssues.length) {
  console.log(`\ntrailing slash 누락 ${slashIssues.length}개`);
  for (const s of slashIssues) console.log(`  ${s.file} -> ${s.ref}`);
}

console.log(`\n외부 링크 ${external.size}개 (네트워크 검사 안 함)`);
for (const url of [...external].sort()) console.log(`  ${url}`);

const failed = broken.length + slashIssues.length;
console.log(failed === 0 ? '\n내부 링크 오류 0건' : `\n오류 ${failed}건`);
process.exit(failed === 0 ? 0 : 1);
