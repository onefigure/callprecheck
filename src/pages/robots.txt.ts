import type { APIRoute } from 'astro';
import { FLAGS, SITE } from '../consts';

/**
 * robots.txt
 *
 * 크롤러를 차단하지 않는다.
 * - /diagnosis/?product=... 같은 파라미터 변형은 Disallow 로 막지 않고
 *   canonical(/diagnosis/) 과 sitemap 미포함으로 정리한다.
 * - 진단 결과는 별도 URL 이 없으며, 결과가 표시되는 동안에만 noindex 가 적용된다.
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(SITE.url)).href.replace(/\/$/, '');

  // 임시 주소에 올려 둔 동안에는 크롤링 자체를 막는다.
  // 실제 도메인으로 옮기면 PUBLIC_NOINDEX_ALL 을 지워 원래 정책으로 돌아간다.
  const body = FLAGS.noindexAll
    ? `User-agent: *
Disallow: /
`
    : `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
