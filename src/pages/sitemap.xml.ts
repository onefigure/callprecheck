import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import { PRODUCT_HUBS } from '../data/products';

/**
 * sitemap.xml
 *
 * 포함: 홈, 제품 허브, 신뢰 페이지, 사람이 작성한 콘텐츠
 * 제외: 404, 진단 결과(별도 URL 없음), query parameter 변형, 아직 없는 페이지
 *
 * lastmod 는 실제로 검토한 날짜가 있는 문서에만 넣는다.
 * (빌드 날짜를 자동으로 채워 넣지 않는다.)
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE.url);

  const staticPaths = [
    '/',
    '/diagnosis/',
    ...PRODUCT_HUBS.map((hub) => hub.href),
    '/repair-or-replace/',
    '/guides/',
    '/about/',
    '/editorial-policy/',
    '/safety/',
    '/privacy/',
    '/terms/',
    '/contact/',
  ];

  const guides = await getCollection('guides', ({ data }) => !data.draft);

  const entries: { loc: string; lastmod?: string }[] = [
    ...staticPaths.map((path) => ({ loc: new URL(path, base).href })),
    ...guides.map((guide) => ({
      loc: new URL(`/${guide.data.product}/${guide.data.url_slug ?? guide.id}/`, base).href,
      lastmod: guide.data.last_reviewed.toISOString().slice(0, 10),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) =>
      `  <url>\n    <loc>${entry.loc}</loc>${
        entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''
      }\n  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
