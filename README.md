# 부르기전에 (CallPrecheck)

> 수리기사 부르기 전, 먼저 확인하세요.

세탁기·에어컨·냉장고가 이상할 때 **안전 여부 → 사용자가 확인할 수 있는 항목 → 서비스가 필요한 기준 → 비용 위험 → 수리·교체 판단** 순서로 정리해 주는 독립 정보 사이트입니다.

이 저장소는 **Phase 1(기반 구축)** 결과물입니다. Phase 2에서 증상 가이드 24편을 올릴 수 있도록 구조가 준비되어 있습니다.

---

## 기술 스택

| 항목 | 선택 |
| --- | --- |
| 사이트 생성 | Astro 7 (정적 출력, `output: static`) |
| 언어 | TypeScript (strict) |
| 스타일 | 순수 CSS (`src/styles/global.css`), CSS 변수 기반 토큰, 모바일 퍼스트 |
| 콘텐츠 | Astro Content Collections + Markdown/MDX (`@astrojs/mdx`) |
| 진단 엔진 | 선언형 규칙 데이터 + 브라우저 전용 TypeScript 모듈 |
| 서버 | 없음 (DB 없음, API 없음, 회원 기능 없음) |
| 이미지 | `sharp` 로 생성한 정적 PNG (빌드 의존성 아님) |

UI 프레임워크(React/Vue 등)와 CSS 프레임워크는 사용하지 않습니다. 페이지에 실리는 자바스크립트는 내비게이션 토글, 진단 위저드, 문의 폼뿐입니다.

---

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:4321
```

```bash
npm run build    # dist/ 로 정적 빌드
npm run preview  # 빌드 결과 미리보기
npm run linkcheck # dist/ 의 내부 링크 검사 (build 후 실행)
npm run check    # astro check (타입 검사)
npm run images   # public/ 의 파비콘·로고·OG 이미지 재생성
```

---

## 환경변수

`.env.example` 를 `.env` 로 복사해 사용합니다. 모든 값은 선택이며, 비워 두면 해당 기능이 출력되지 않습니다.

| 변수 | 기본값 | 설명 |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | `https://callprecheck.com` | canonical / sitemap / OG URL 생성 기준 |
| `PUBLIC_CONTACT_EMAIL` | `contact@callprecheck.com` | 문의 수신 주소 (**실제 주소로 교체 필요**) |
| `PUBLIC_GSC_VERIFICATION` | (없음) | Google Search Console HTML 메타태그 값 |
| `PUBLIC_ENABLE_ANALYTICS` | `false` | `true` 일 때만 분석 스크립트 로드 |
| `PUBLIC_ANALYTICS_ID` | (없음) | 측정 ID |
| `PUBLIC_ENABLE_ADS` | `false` | **Phase 1에서는 반드시 false** |
| `PUBLIC_ADSENSE_CLIENT` | (없음) | AdSense 게시자 ID |

`PUBLIC_ENABLE_ADS` 와 `PUBLIC_ADSENSE_CLIENT` 가 **둘 다** 설정된 경우에만 AdSense 스크립트가 출력됩니다. 광고 슬롯(빈 광고 박스)은 어떤 페이지에도 없습니다.

---

## 배포 — Cloudflare Workers

이 사이트는 **100% 정적**입니다. SSR 어댑터(`@astrojs/cloudflare`)를 쓰지 않고, Astro 가 만든 `dist/` 를 **Workers Static Assets** 로 그대로 서빙합니다. 배포 설정은 `wrangler.jsonc` 한 파일에 들어 있고, 워커 스크립트(`main`)는 없습니다.

### 로컬에서 배포 결과 확인

```bash
npm run cf:dev
```

`npm run dev`(Astro 개발 서버)와 달리 실제 배포 환경과 같은 Workers 런타임으로 동작합니다. trailing slash 리다이렉트와 404 상태코드를 여기서 확인할 수 있습니다.

### GitHub 연동 자동 배포

Cloudflare 대시보드에서 연결합니다. **API 토큰을 저장소에 넣을 필요가 없습니다.**

1. GitHub 에 저장소를 만들고 push 합니다.
2. Cloudflare 대시보드 → **Compute (Workers) → Create → Import a repository**
3. GitHub 계정을 연결하고 이 저장소를 선택합니다.
4. 빌드 설정을 아래와 같이 지정합니다.

| 항목 | 값 |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy --env=""` |
| Non-production branch deploy command | `npx wrangler versions upload --env=""` |
| Root directory | `/` |

5. **Build variables** 에 환경변수를 넣습니다. (아래 항목 참고)
6. 저장하면 `main` 에 push 할 때마다 자동 배포됩니다.

Node 버전은 `.node-version`(22)으로 고정되어 있습니다.

### Preview URL

`main` 이 아닌 브랜치에 push 하면 `wrangler versions upload` 가 실행되어 커밋별 미리보기 주소가 생성됩니다.

```
https://<version-prefix>-callprecheck.<계정>.workers.dev
```

운영 배포에는 영향을 주지 않습니다. 고정된 스테이징 주소가 따로 필요하면 별도 워커로 배포할 수 있습니다.

```bash
npm run cf:deploy:staging   # callprecheck-staging 워커로 배포
```

### 환경변수는 빌드 시점에 소비됩니다

이 사이트의 환경변수는 **런타임이 아니라 빌드 시점에** 사용됩니다. Astro 가 정적 HTML 안에 값을 넣어 두기 때문입니다. 따라서 Cloudflare 의 *Worker 런타임 변수*가 아니라 **Workers Builds 의 Build variables** 에 넣어야 합니다.

| 변수 | Production | Preview |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | `https://callprecheck.com` | 설정하지 않음 (canonical 이 운영 도메인을 가리켜, 미리보기 주소가 검색에 잡히는 것을 막아 줍니다) |
| `PUBLIC_CONTACT_EMAIL` | 실제 수신 가능한 주소 | 동일 |
| `PUBLIC_GSC_VERIFICATION` | Search Console 값 | 비움 |
| `PUBLIC_ENABLE_ANALYTICS` / `PUBLIC_ENABLE_ADS` | `false` (Phase 1) | `false` |

`.env` 는 `.gitignore` 에 포함되어 있어 저장소에 올라가지 않습니다.

### 커스텀 도메인 연결

1. Cloudflare 에 `callprecheck.com` 을 추가하고 네임서버를 변경합니다.
2. 해당 Worker → **Settings → Domains & Routes → Add → Custom domain** 에서 `callprecheck.com` 을 연결합니다. 인증서는 자동 발급됩니다.
3. www 통일: **Rules → Redirect Rules** 에서 `www.callprecheck.com/*` → `https://callprecheck.com/$1` (301) 규칙을 추가합니다.
4. **SSL/TLS → Edge Certificates → Always Use HTTPS** 를 켭니다.

### Google Search Console 연결

두 가지 중 편한 방법을 쓰면 됩니다.

- **DNS 방식(권장)**: 도메인을 Cloudflare 에 올렸다면 도메인 속성으로 등록하고 DNS TXT 레코드를 추가합니다. 코드 변경이 필요 없습니다.
- **HTML 메타태그 방식**: Workers Builds 의 Build variables 에 `PUBLIC_GSC_VERIFICATION` 값을 넣고 재배포하면 모든 페이지 `<head>` 에 메타태그가 출력됩니다.

등록 후 사이트맵으로 `https://callprecheck.com/sitemap.xml` 을 제출합니다.

### 이 설정이 지켜 주는 것

| 항목 | 방식 |
| --- | --- |
| trailing slash 통일 | `html_handling: "force-trailing-slash"` — `/about` → `/about/` 307 리다이렉트 |
| 404 | `not_found_handling: "404-page"` — 없는 경로에 `dist/404.html` 을 **404 상태코드**로 응답 |
| sitemap.xml / robots.txt | 정적 파일 그대로 서빙 (`application/xml`, `text/plain`) |
| canonical / noindex / OG | 빌드 시점에 HTML 에 포함되므로 그대로 유지 |

### 다른 호스팅을 쓸 경우

`dist/` 만 올리면 되므로 Netlify, Vercel, GitHub Pages 등에서도 동작합니다. 그 경우 HTTPS 강제, www 통일, trailing slash 정책(`always`), `dist/404.html` 을 404 응답으로 연결하는 설정을 해당 호스팅에서 직접 맞춰야 합니다.

---

## 전체 route

| 경로 | 색인 | 설명 |
| --- | --- | --- |
| `/` | O | 홈 |
| `/diagnosis/` | O | 고장 진단 도구 (결과 표시 중에는 noindex) |
| `/washer/` | O | 세탁기 허브 |
| `/aircon/` | O | 에어컨 허브 |
| `/refrigerator/` | O | 냉장고 허브 |
| `/repair-or-replace/` | O | 수리·교체 판단 기준 |
| `/guides/` | O | 가이드 안내 및 목록 |
| `/about/` | O | 사이트 소개 |
| `/editorial-policy/` | O | 정보 작성 기준 |
| `/safety/` | O | 안전 안내 |
| `/privacy/` | O | 개인정보처리방침 |
| `/terms/` | O | 이용약관 |
| `/contact/` | O | 문의하기 |
| `/404.html` | X (noindex) | 404 |
| `/robots.txt` | — | 크롤러 차단 없음 |
| `/sitemap.xml` | — | 색인 대상 페이지만 포함 |
| `/{product}/{slug}/` | O | **Phase 2** 증상 가이드 (콘텐츠가 있을 때만 생성) |

---

## 진단 엔진 데이터 구조

파일 위치: `src/data/diagnosis/`

```
types.ts          타입 정의
labels.ts         결과 4등급 / 비용 위험 등급의 화면 표기
safety-gate.ts    Step 0 안전 확인 항목과 STOP_USE 결과
washer.ts         세탁기 6개 증상 흐름
aircon.ts         에어컨 6개 증상 흐름
refrigerator.ts   냉장고 6개 증상 흐름
index.ts          제품 목록 + 규칙 평가 함수
```

### 핵심 타입

```ts
type OutcomeLevel = 'SELF_CHECK' | 'MONITOR' | 'SERVICE_RECOMMENDED' | 'STOP_USE';
type CostRisk     = 'low' | 'medium' | 'high' | 'unknown';   // 금액은 저장하지 않는다

interface Question { id; text; hint?; options: { id; label }[] }

interface Outcome {
  level: OutcomeLevel;
  title: string;        // 단정적인 고장 진단명으로 쓰지 않는다
  reason: string;       // 사용자가 고른 응답을 근거로 한 설명
  costRisk: CostRisk;
  costNote?: string;    // 기본 문구를 덮어써야 할 때만
  selfChecks: string[]; // 안전하게 확인할 수 있는 항목 3~5개
}

interface Rule { when: Record<questionId, optionId | optionId[]>; outcome: Outcome }

interface SymptomFlow {
  id; label; description;
  questions: Question[];   // 3~5개
  rules: Rule[];           // 위에서부터 평가, 먼저 맞는 것 채택
  fallback: Outcome;       // 아무 규칙도 맞지 않을 때
}
```

### 평가 방식

`evaluateSymptom(flow, answers)` 는 `rules` 를 위에서부터 확인해 **처음 일치하는 규칙**의 결과를 돌려주고, 없으면 `fallback` 을 씁니다. `when` 에 적지 않은 질문은 와일드카드이고, 값에 배열을 주면 그중 하나만 맞아도 됩니다. 분기 로직이 코드가 아니라 데이터에 있으므로, 질문이나 판단을 바꿀 때 TypeScript 파일의 데이터만 고치면 됩니다.

### 증상 추가 방법

`src/data/diagnosis/<product>.ts` 의 `symptoms` 배열에 항목을 하나 추가하면 홈, 제품 허브, 가이드 목록, 진단 도구에 자동 반영됩니다.

---

## Phase 2 콘텐츠 추가 방법

1. `src/content/guides/_TEMPLATE.md` 를 복사합니다.
2. `src/content/guides/washer-spin-fail.md` 처럼 **슬러그가 될 파일명**으로 저장합니다. (`.mdx` 도 가능)
3. frontmatter 를 채웁니다.

```yaml
---
title: 세탁기 탈수가 안 될 때 먼저 확인할 것
slug: washer-spin-fail          # 생략하면 파일명이 URL
product: washer                 # washer | aircon | refrigerator
symptom: spin-fail              # 진단 엔진의 증상 id 와 맞추면 결과 화면에 연결됨
search_intent: 고장인지 사용 문제인지 구분하고 싶다
summary: 목록과 meta description 에 그대로 쓰이는 한두 문장
last_reviewed: 2026-09-12       # 사람이 검토한 날짜
sources:
  - name: 삼성전자서비스 — 세탁기 자가 점검
    url: https://www.samsungsvc.co.kr/
    checked_at: 2026-09-12
safety_level: caution           # low | caution | stop-use
cost_confidence: unknown        # official | verified-data | reference-range | unknown
author: 부르기전에 편집팀
reviewer: (선택)
draft: false                    # true 면 빌드에서 제외
---
```

4. 본문을 Markdown 으로 씁니다. 확인 자료 목록과 확인일은 `sources` 에서 페이지 하단에 자동 출력되므로 본문에 다시 쓰지 않습니다.

파일 하나를 추가하면 다음이 **자동으로** 생깁니다.

- `/{product}/{slug}/` 페이지 (breadcrumb, `Article` 구조화 데이터, 안전 수준 배지, 비용 근거 배지, 최종 검토일, 확인 자료 포함)
- `/guides/` 목록에 노출
- 해당 제품 허브(`/washer/` 등)의 "증상 가이드" 목록에 노출
- 홈의 "사람들이 자주 겪는 증상" 섹션에 노출 *(글이 하나라도 있을 때만 섹션이 나타납니다)*
- `sitemap.xml` 에 `lastmod` 와 함께 등록
- 진단 결과 화면의 "관련 가이드" (`product` + `symptom` 이 일치할 때)

`_` 로 시작하는 파일은 발행되지 않습니다.

스키마 정의는 `src/content.config.ts` 에 있고, 필수 항목이 빠지면 **빌드가 실패**합니다. 출처 없는 글이 실수로 올라가지 않도록 `sources` 는 최소 1개를 요구합니다.

---

## SEO 설정

- 모든 색인 페이지에 고유 `<title>`, 고유 meta description, 절대경로 canonical
- Open Graph(`type`, `site_name`, `locale`, `title`, `description`, `url`, `image` 1200×630) + Twitter `summary_large_image`
- `<html lang="ko">`, semantic HTML, 페이지당 `h1` 1개
- 콘텐츠 페이지에 breadcrumb UI + `BreadcrumbList` 구조화 데이터
- 홈에 `WebSite` + `Organization` 구조화 데이터, Phase 2 가이드에 `Article`
- `/robots.txt`, `/sitemap.xml` (둘 다 `PUBLIC_SITE_URL` 기준으로 절대경로 생성)
- trailing slash 정책 한 가지(`always`)로 통일

억지 FAQ 구조화 데이터는 넣지 않았습니다.

### noindex 처리

| 대상 | 방식 |
| --- | --- |
| 진단 **결과** 화면 | 결과가 표시되는 동안 `<meta name="robots">` 를 `noindex,follow` 로 바꾸고 `data-nosnippet` 을 붙입니다. 뒤로 가면 다시 `index,follow` 로 돌아옵니다. |
| 진단 결과 URL | 결과는 **별도 URL 을 만들지 않습니다**. 초기 HTML 에는 결과가 존재하지 않습니다. |
| `/diagnosis/?product=...&symptom=...` | 홈에서 제품·증상을 고르고 진입하는 경로입니다. canonical 이 항상 `/diagnosis/` 를 가리키고 sitemap 에 포함하지 않습니다. |
| `/404.html` | `noindex,follow` |

robots.txt 로 차단하는 경로는 없습니다.

---

## 이 사이트가 하지 않는 것

- 확인할 근거가 없는 수리비 금액이나 고장 확률을 만들지 않습니다.
- 분해·배선·냉매·가스 계통 작업 방법을 안내하지 않습니다.
- "공식", "공인", "서비스센터" 같은 오인 표현을 쓰지 않습니다.
- 수리 업체를 중개하거나 특정 제품을 추천하지 않습니다.
- 빈 카테고리, 준비중 페이지, 빈 광고 영역을 만들지 않습니다.

---

## 디렉터리 구조

```
src/
├─ components/     Header, Footer, Breadcrumbs, Sources,
│                  SymptomPicker(홈 제품·증상 선택), ResultPreview(홈 진단 UI 미리보기)
├─ content/
│  └─ guides/      Phase 2 콘텐츠 (_TEMPLATE.md 포함)
├─ content.config.ts
├─ consts.ts       브랜드 문구, 내비게이션, 고지문, 환경변수 플래그
├─ data/
│  ├─ diagnosis/   진단 엔진 데이터
│  ├─ products.ts  제품 허브 본문
│  └─ sources.ts   확인한 공식 자료 + 확인일
├─ layouts/        BaseLayout(SEO/head), PageLayout(본문 페이지)
├─ pages/          라우트
├─ scripts/        진단 위저드 클라이언트 로직
└─ styles/         global.css
scripts/           이미지 생성, 링크 검사
wrangler.jsonc     Cloudflare Workers 배포 설정 (정적 자산 전용)
.node-version      빌드 Node 버전 고정 (22)
public/            favicon.svg, og-default.png, logo.png, apple-touch-icon.png
```
