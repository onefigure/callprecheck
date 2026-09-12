// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// 배포 도메인은 환경변수로 덮어쓸 수 있다. (기본값: 운영 도메인)
const site = process.env.PUBLIC_SITE_URL || 'https://callprecheck.com';

export default defineConfig({
  site,
  // URL 정책: trailing slash 항상 포함 + 디렉터리 형태 출력으로 통일
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  // Phase 2 콘텐츠를 .md 뿐 아니라 .mdx 로도 바로 추가할 수 있게 해 둔다.
  integrations: [mdx()],
  compressHTML: true,
  devToolbar: { enabled: false },
});
