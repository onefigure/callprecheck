import type { APIRoute } from 'astro';
import { FLAGS, SITE } from '../consts';

/**
 * robots.txt
 *
 * 크롤러를 차단하지 않는다.
 * - 제품·증상 선택값은 URL 조각(#)으로 전달하므로 서버 요청과 색인 대상에
 *   애초에 포함되지 않는다. 별도로 막을 경로가 없다.
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
