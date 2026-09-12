import type { Outcome } from './types';

/**
 * Step 0 — Safety Gate.
 * 모든 제품 공통으로 가장 먼저 확인하며, 하나라도 해당되면 결과는 STOP_USE 로 확정된다.
 */
export const SAFETY_GATE_ITEMS = [
  { id: 'burning', label: '타는 냄새가 난다' },
  { id: 'smoke', label: '연기나 스파크가 보인다' },
  { id: 'shock', label: '누전되거나 만졌을 때 저릿한 느낌이 있다' },
  { id: 'breaker', label: '차단기가 반복해서 내려간다' },
  { id: 'hot-plug', label: '전원선이나 플러그가 비정상적으로 뜨겁다' },
  { id: 'gas', label: '가스 냄새가 나거나 냉매 누출이 강하게 의심된다' },
  { id: 'water-electric', label: '물이 전기부품이나 콘센트 쪽으로 흐른다' },
] as const;

export const SAFETY_GATE_OUTCOME: Outcome = {
  level: 'STOP_USE',
  title: '사용을 중지하고 점검을 요청하세요',
  reason:
    '선택하신 항목은 화재·감전·누출과 직접 연결될 수 있는 신호입니다. 원인을 더 좁히는 것보다 사용을 멈추는 편이 먼저입니다.',
  costRisk: 'unknown',
  costNote:
    '안전과 관련된 증상은 원인 범위가 넓어 지금 단계에서 비용을 가늠할 근거가 없습니다. 점검 후 견적을 확인하세요.',
  selfChecks: [
    '제품 사용을 즉시 멈춥니다.',
    '주변에 사람이 다치지 않을 상황이고 안전하게 접근할 수 있다면 전원 플러그를 뽑거나 해당 회로의 차단기를 내립니다. 물기가 있거나 플러그가 뜨거우면 손대지 말고 그대로 둡니다.',
    '가스 냄새가 난다면 불꽃이나 스위치 조작을 피하고 창문을 열어 환기한 뒤, 안전한 곳으로 이동합니다.',
    '연기나 불꽃이 계속되면 119에 신고합니다.',
    '제조사 고객지원 또는 자격을 갖춘 전문가에게 점검을 요청하고, 어떤 증상을 보았는지 그대로 전달합니다.',
  ],
};
