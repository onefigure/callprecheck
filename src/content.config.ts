import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Phase 2 콘텐츠 컬렉션.
 *
 * `src/content/guides/` 에 Markdown/MDX 파일을 추가하면 다음이 자동으로 만들어진다.
 *  - /{product}/{slug}/ 증상 가이드 페이지
 *  - /guides/ 목록에 노출
 *  - 제품 허브(/washer/ 등)의 관련 가이드 목록에 노출
 *  - sitemap.xml 에 등록
 *  - 출처(확인 자료) 블록과 확인일 표기
 *
 * Phase 1 에서는 파일이 없으므로 어떤 페이지도 생성되지 않는다.
 * (빈 목록 페이지나 "준비중" 페이지를 만들지 않기 위한 설계다.)
 */

const sourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  /** 사람이 실제로 확인한 날짜 */
  checked_at: z.coerce.date(),
});

const guides = defineCollection({
  // `_` 로 시작하는 파일은 발행되지 않는다. (_TEMPLATE.md 같은 작성용 파일)
  loader: glob({
    pattern: ['**/*.{md,mdx}', '!**/_*.{md,mdx}'],
    base: './src/content/guides',
  }),
  schema: z.object({
    title: z.string(),
    /** URL 에 쓸 슬러그. 생략하면 파일명을 사용한다. */
    slug: z.string().optional(),
    product: z.enum(['washer', 'aircon', 'refrigerator']),
    /** 진단 Wizard 의 증상 id 와 맞추면 결과 화면에서 관련 가이드로 연결된다. */
    symptom: z.string(),
    /** 검색자가 무엇을 알고 싶어 하는지 */
    search_intent: z.string(),
    /** 목록과 meta description 에 쓰는 요약 */
    summary: z.string(),
    /** 마지막 검토일 */
    last_reviewed: z.coerce.date(),
    sources: z.array(sourceSchema).min(1),
    /** 이 증상의 안전 위험 수준 */
    safety_level: z.enum(['low', 'caution', 'stop-use']),
    /** 비용 정보의 근거 수준 */
    cost_confidence: z.enum([
      'official', // 공식 공개가격
      'verified-data', // 검증된 사용자/영수증 데이터
      'reference-range', // 근거 있는 참고 범위
      'unknown', // 확인할 수 없음
    ]),
    author: z.string(),
    reviewer: z.string().optional(),
    /**
     * 글 하단에 노출할 "실제 다음 질문" 2~4개.
     * 기계적인 관련글 목록 대신, 이 글을 읽은 사람이 다음에 궁금해할 것만 적는다.
     * 반드시 존재하는 경로만 적는다. (빈 링크 금지)
     */
    next_questions: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .min(2)
      .max(4)
      .optional(),
    /** true 면 빌드에서 제외된다. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { guides };
