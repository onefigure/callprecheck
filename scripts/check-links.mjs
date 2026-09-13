/**
 * 빌드 결과(dist/)의 내부 링크, 정적 파일 참조, sitemap.xml 을 검사한다.
 *
 *   npm run build && npm run linkcheck
 *
 * - 내부 링크가 실제 파일로 해석되는지 확인한다.
 * - trailing slash 정책(항상 붙임)을 지키는지 확인한다.
 * - sitemap.xml 의 URL이 실제 빌드된 페이지인지 확인한다.
 * - 색인 대상(noindex 아님)인데 sitemap 에 빠진 페이지를 찾는다.
 * - 외부 링크는 네트워크 요청 없이 목록만 출력한다.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
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

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
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

// ── sitemap.xml 검증 ──────────────────────────────────────────
// HTML 안의 링크만 보면 sitemap 의 잘못된 URL을 놓친다.
// (실제로 frontmatter 필드명을 바꾸면서 sitemap 만 옛 필드를 참조해
//  존재하지 않는 URL 24개가 들어간 적이 있다.)
const sitemapPath = path.join(DIST, 'sitemap.xml');
const sitemapBroken = [];
const missingFromSitemap = [];
let sitemapCount = 0;

if (existsSync(sitemapPath)) {
  const sitemapXml = await readFile(sitemapPath, 'utf8');
  const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  sitemapCount = locs.length;

  for (const loc of locs) {
    if (!resolveInternal(new URL(loc).pathname)) sitemapBroken.push(loc);
  }

  // 색인 대상인데 sitemap 에 빠진 페이지. noindex 페이지는 제외한다.
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;

    const pathname = file
      .split(path.sep)
      .join('/')
      .replace(new RegExp(`^${DIST}`), '')
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '');

    if (!sitemapXml.includes(`${pathname}</loc>`)) missingFromSitemap.push(pathname);
  }
}

console.log(`\nsitemap.xml URL ${sitemapCount}개 검사`);
if (sitemapBroken.length) {
  console.log(`  존재하지 않는 페이지를 가리킴 ${sitemapBroken.length}개`);
  for (const loc of sitemapBroken) console.log(`    ${loc}`);
}
if (missingFromSitemap.length) {
  console.log(`  색인 대상인데 sitemap 에 없음 ${missingFromSitemap.length}개`);
  for (const pn of missingFromSitemap) console.log(`    ${pn}`);
}

const failed =
  broken.length + slashIssues.length + sitemapBroken.length + missingFromSitemap.length;
console.log(failed === 0 ? '\n내부 링크·sitemap 오류 0건' : `\n오류 ${failed}건`);
process.exit(failed === 0 ? 0 : 1);
