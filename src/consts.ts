/**
 * 사이트 전역 상수.
 * 문구/내비게이션/고지문은 이 파일 한 곳에서만 관리한다.
 */

export const SITE = {
  /** 한글 브랜드명 (메인) */
  name: '부르기전에',
  /** 영문 보조 브랜드명 = 도메인 */
  nameEn: 'CallPrecheck',
  domain: 'callprecheck.com',
  /** 기본 도메인. astro.config.mjs 의 site 값과 동일하게 유지한다. */
  url: 'https://callprecheck.com',
  locale: 'ko_KR',
  lang: 'ko',
  tagline: '수리기사 부르기 전, 먼저 확인하세요.',
  /* 네이버는 검색결과에서 설명문을 80자쯤에서 자른다. 그 안에 세 가지 축이 모두 들어가게 쓴다. */
  description:
    '세탁기·에어컨·냉장고가 이상할 때 먼저 확인할 항목, 서비스를 불러야 하는 시점, 비용이 커질 수 있는 조건을 공식 자료로 정리합니다.',
} as const;

/** 문의 메일 주소 (환경변수로 교체 가능) */
export const CONTACT_EMAIL: string =
  import.meta.env.PUBLIC_CONTACT_EMAIL || '15991175@naver.com';

/** 상단 내비게이션 */
export const MAIN_NAV = [
  { href: '/diagnosis/', label: '고장 진단' },
  { href: '/washer/', label: '세탁기' },
  { href: '/aircon/', label: '에어컨' },
  { href: '/refrigerator/', label: '냉장고' },
  { href: '/repair-or-replace/', label: '수리할까 교체할까' },
  { href: '/guides/', label: '가이드' },
] as const;

/** 푸터 내비게이션 */
export const FOOTER_NAV = [
  {
    title: '서비스',
    links: [
      { href: '/diagnosis/', label: '고장 진단' },
      { href: '/washer/', label: '세탁기' },
      { href: '/aircon/', label: '에어컨' },
      { href: '/refrigerator/', label: '냉장고' },
    ],
  },
  {
    title: '사이트',
    links: [
      { href: '/about/', label: '부르기전에 소개' },
      { href: '/editorial-policy/', label: '정보 작성 기준' },
      { href: '/safety/', label: '안전 안내' },
      { href: '/contact/', label: '문의하기' },
    ],
  },
  {
    title: '정책',
    links: [
      { href: '/privacy/', label: '개인정보처리방침' },
      { href: '/terms/', label: '이용약관' },
    ],
  },
] as const;

/** 모든 페이지 푸터와 소개 페이지에 노출되는 독립 사이트 고지문 */
export const INDEPENDENCE_NOTICE =
  '부르기전에는 특정 제조사 또는 서비스센터가 운영하는 공식 사이트가 아닙니다. 삼성전자, LG전자 등 각 상표와 서비스명은 해당 권리자에게 있으며, 본 사이트는 소비자가 수리기사 또는 AS를 요청하기 전에 확인할 수 있는 정보를 독립적으로 정리합니다.';

/** 진단 결과·안전 안내 전반에서 재사용하는 "하지 말아야 할 것" */
export const NEVER_DO = [
  '본체나 패널을 분해하는 작업',
  '전기 배선을 직접 손보는 작업',
  '냉매를 임의로 보충하거나 회수하는 작업',
  '가스 계통을 열거나 조작하는 작업',
  '안전장치·안전센서를 우회하는 작업',
] as const;

/** 즉시 사용을 중지해야 하는 신호 (Safety Gate 와 동일 기준) */
export const STOP_SIGNALS = [
  '타는 냄새가 난다',
  '연기나 스파크가 보인다',
  '누전되거나 만졌을 때 저릿한 느낌이 있다',
  '차단기가 반복해서 내려간다',
  '전원선이나 플러그가 비정상적으로 뜨겁다',
  '가스 냄새가 나거나 냉매 누출이 강하게 의심된다',
  '물이 전기부품이나 콘센트 쪽으로 흐른다',
] as const;

/** 환경변수 기반 기능 플래그 */
export const FLAGS = {
  ads:
    import.meta.env.PUBLIC_ENABLE_ADS === 'true' &&
    Boolean(import.meta.env.PUBLIC_ADSENSE_CLIENT),
  adsenseClient: import.meta.env.PUBLIC_ADSENSE_CLIENT || '',
  /**
   * AdSense 사이트 소유권 확인용 메타태그 값 (예: ca-pub-0000000000000000).
   * 광고 스크립트를 로드하지 않고 심사 연결만 하기 위한 항목이다.
   * 광고를 실제로 켜는 것은 PUBLIC_ENABLE_ADS 이며 서로 독립적이다.
   */
  adsenseAccount: import.meta.env.PUBLIC_ADSENSE_ACCOUNT || '',
  analytics:
    import.meta.env.PUBLIC_ENABLE_ANALYTICS === 'true' &&
    Boolean(import.meta.env.PUBLIC_ANALYTICS_ID),
  analyticsId: import.meta.env.PUBLIC_ANALYTICS_ID || '',
  gscVerification: import.meta.env.PUBLIC_GSC_VERIFICATION || '',
  /**
   * 네이버 서치어드바이저 소유권 확인 값.
   * 모든 페이지의 HTML 에 그대로 노출되는 공개 값이라 비밀이 아니다.
   * 빌드 환경변수가 없을 때도 확인이 풀리지 않도록 기본값을 둔다.
   */
  naverVerification:
    import.meta.env.PUBLIC_NAVER_VERIFICATION ||
    'c0b404de52628b8b313e4672d669b0646791dc4d',
  /**
   * 임시 주소(workers.dev 등)에 올려 둔 동안 색인을 막는 스위치.
   * true 면 모든 페이지에 noindex 를 붙이고 robots.txt 로도 크롤링을 막는다.
   * 실제 도메인으로 옮긴 뒤에는 반드시 false 로 되돌린다. (기본값 false)
   */
  noindexAll: import.meta.env.PUBLIC_NOINDEX_ALL === 'true',
};
