/**
 * 브랜드 이미지(파비콘 PNG, 로고, OG 이미지)를 생성한다.
 * 결과물은 public/ 에 저장되며 저장소에 커밋된다. 빌드 때마다 실행할 필요는 없다.
 *
 *   node scripts/generate-images.mjs
 */
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const ACCENT = '#17667f';
const BG = '#f7f8f9';
const TEXT = '#16181d';
const MUTED = '#5b6371';

/** 텍스트가 없는 심볼 마크. 폰트 환경에 영향을 받지 않는다. */
function mark(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="${ACCENT}"/>
    <circle cx="32" cy="32" r="17.5" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="3"/>
    <path d="M22.5 32.8 L29.2 39.5 L42 25.5" fill="none" stroke="#ffffff" stroke-width="5.5"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

/**
 * OG 이미지.
 * 브랜드 문구는 SVG <text> 로 그린다. 한글 폰트를 찾지 못하는 환경에서는
 * generate-images.mjs 실행 결과를 눈으로 확인한 뒤 커밋할 것.
 */
function ogCard() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${BG}"/>
    <rect x="0" y="0" width="1200" height="14" fill="${ACCENT}"/>
    <g transform="translate(96, 150)">
      <g transform="scale(1.5)">
        <rect width="64" height="64" rx="14" fill="${ACCENT}"/>
        <circle cx="32" cy="32" r="17.5" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="3"/>
        <path d="M22.5 32.8 L29.2 39.5 L42 25.5" fill="none" stroke="#ffffff" stroke-width="5.5"
          stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </g>
    <text x="96" y="330" font-family="Malgun Gothic, Noto Sans KR, sans-serif" font-size="88"
      font-weight="700" fill="${TEXT}">부르기전에</text>
    <text x="96" y="410" font-family="Malgun Gothic, Noto Sans KR, sans-serif" font-size="42"
      fill="${TEXT}">수리기사 부르기 전, 먼저 확인하세요.</text>
    <text x="96" y="490" font-family="Malgun Gothic, Noto Sans KR, sans-serif" font-size="28"
      fill="${MUTED}">세탁기 · 에어컨 · 냉장고</text>
    <text x="96" y="556" font-family="Segoe UI, Arial, sans-serif" font-size="26"
      letter-spacing="2" fill="${MUTED}">CallPrecheck.com</text>
  </svg>`;
}

await mkdir('public', { recursive: true });

await sharp(Buffer.from(mark(180))).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(mark(512))).png().toFile('public/logo.png');
await sharp(Buffer.from(ogCard())).png().toFile('public/og-default.png');

console.log('public/apple-touch-icon.png, public/logo.png, public/og-default.png 생성 완료');
