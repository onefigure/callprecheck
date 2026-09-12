/**
 * 사이트가 참고하는 공식 자료.
 *
 * 원칙
 * - 실제로 접속해 확인한 자료만 적는다.
 * - checkedAt 은 사람이 실제로 확인한 날짜다. 자동으로 오늘 날짜를 넣지 않는다.
 * - "출처: 인터넷" 같은 표기는 사용하지 않는다.
 */

export interface Source {
  name: string;
  /** 자료 안에서 어떤 부분을 참고했는지 */
  page: string;
  url: string;
  /** YYYY-MM-DD */
  checkedAt: string;
}

export const SAMSUNG_SUPPORT: Source = {
  name: '삼성전자서비스',
  page: '제품별 자가 점검(스스로 해결) 및 서비스 안내',
  url: 'https://www.samsungsvc.co.kr/',
  checkedAt: '2026-09-12',
};

export const LG_SUPPORT: Source = {
  name: 'LG전자 고객지원',
  page: '제품 사용설명서·문제 해결 및 서비스 예약 안내',
  url: 'https://www.lge.co.kr/support',
  checkedAt: '2026-09-12',
};

export const CONSUMER_DISPUTE_STANDARD: Source = {
  name: '국가법령정보센터',
  page: '소비자분쟁해결기준(공정거래위원회 고시)',
  url: 'https://www.law.go.kr/%ED%96%89%EC%A0%95%EA%B7%9C%EC%B9%99/%EC%86%8C%EB%B9%84%EC%9E%90%EB%B6%84%EC%9F%81%ED%95%B4%EA%B2%B0%EA%B8%B0%EC%A4%80',
  checkedAt: '2026-09-12',
};

/** 제품 허브·판단 페이지에서 공통으로 안내하는 자료 */
export const COMMON_SOURCES: Source[] = [
  SAMSUNG_SUPPORT,
  LG_SUPPORT,
  CONSUMER_DISPUTE_STANDARD,
];
