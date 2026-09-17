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

/**
 * 고정 페이지의 최종 수정일. 페이지 내용을 실제로 고칠 때 함께 갱신한다.
 * (빌드 시각이 아니라 사람이 손댄 날짜여야 한다.)
 */
const STATIC_LAST_MODIFIED: Record<string, string> = {
  '/': '2026-09-13',
  '/diagnosis/': '2026-09-13',
  '/washer/': '2026-09-13',
  '/aircon/': '2026-09-13',
  '/refrigerator/': '2026-09-13',
  '/repair-or-replace/': '2026-09-12',
  '/guides/': '2026-09-13',
  '/about/': '2026-09-12',
  '/editorial-policy/': '2026-09-13',
  '/safety/': '2026-09-12',
  '/privacy/': '2026-09-13',
  '/terms/': '2026-09-12',
  '/contact/': '2026-09-12',
};

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

  const reviewedAt = (guide: (typeof guides)[number]) =>
    guide.data.last_reviewed.toISOString().slice(0, 10);

  /**
   * 홈·가이드 목록·제품 허브는 가이드가 추가되면 내용이 함께 바뀐다.
   * 그래서 관련 가이드의 최신 확인일도 후보에 넣고 더 늦은 쪽을 쓴다.
   */
  const latestReview = (filter: (guide: (typeof guides)[number]) => boolean) =>
    guides.filter(filter).map(reviewedAt).sort().at(-1);

  const listingLastmod: Record<string, string | undefined> = {
    '/': latestReview(() => true),
    '/guides/': latestReview(() => true),
    ...Object.fromEntries(
      PRODUCT_HUBS.map((hub) => [
        hub.href,
        latestReview((guide) => guide.data.product === hub.id),
      ]),
    ),
  };

  const entries: { loc: string; lastmod?: string }[] = [
    ...staticPaths.map((path) => ({
      loc: new URL(path, base).href,
      lastmod: [STATIC_LAST_MODIFIED[path], listingLastmod[path]]
        .filter((date): date is string => Boolean(date))
        .sort()
        .at(-1),
    })),
    ...guides.map((guide) => ({
      loc: new URL(`/${guide.data.product}/${guide.data.url_slug ?? guide.id}/`, base).href,
      lastmod: reviewedAt(guide),
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
