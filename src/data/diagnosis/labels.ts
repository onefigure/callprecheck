import type { CostRisk, OutcomeLevel } from './types';

/** 결과 4등급의 화면 표기 */
export const LEVEL_META: Record<
  OutcomeLevel,
  { kicker: string; summary: string }
> = {
  SELF_CHECK: {
    kicker: '먼저 직접 확인',
    summary:
      '지금 단계에서는 사용자가 안전하게 확인할 수 있는 범위로 보입니다. 아래 항목을 먼저 확인해 보세요.',
  },
  MONITOR: {
    kicker: '조치 후 다시 확인',
    summary:
      '아래 항목을 확인하고 조치한 뒤 같은 증상이 다시 나타나는지 관찰이 필요합니다.',
  },
  SERVICE_RECOMMENDED: {
    kicker: '서비스 점검 권장',
    summary:
      '사용자가 확인할 수 있는 범위를 넘어설 가능성이 있습니다. 전문 점검을 받아 보는 편이 좋습니다.',
  },
  STOP_USE: {
    kicker: '사용 중지 후 점검 요청',
    summary:
      '안전과 직접 관련된 신호입니다. 계속 사용하지 말고 점검을 요청하세요.',
  },
};

/** 비용 위험도의 화면 표기. 금액은 표시하지 않는다. */
export const COST_META: Record<
  CostRisk,
  { label: string; badge: 'badge--ok' | 'badge--warn' | 'badge--danger' | ''; note: string }
> = {
  low: {
    label: '낮음',
    badge: 'badge--ok',
    note: '사용 설정이나 관리 범위에서 해결될 가능성이 있어, 별도 수리비가 발생하지 않을 수 있습니다.',
  },
  medium: {
    label: '중간',
    badge: 'badge--warn',
    note: '점검 결과에 따라 부품 교체가 필요할 수 있습니다. 접수할 때 방문 점검비와 부품비가 어떻게 계산되는지 먼저 확인하세요.',
  },
  high: {
    label: '높음',
    badge: 'badge--danger',
    note: '비교적 큰 부품이나 계통이 관련될 수 있는 증상입니다. 사용 기간이 길다면 수리와 교체를 함께 비교해 보세요.',
  },
  unknown: {
    label: '데이터 부족',
    badge: '',
    note: '지금 입력한 정보만으로는 비용 범위를 판단할 근거가 부족합니다. 점검을 받아 견적을 확인한 뒤 판단하세요.',
  },
};

/** 결과 화면 공통 안내: 이 사이트는 금액을 추정하지 않는다 */
export const COST_DISCLAIMER =
  '부르기전에는 확인할 수 있는 근거가 없는 수리비 금액을 만들어 표시하지 않습니다. 실제 비용은 모델, 부품 수급, 작업 난이도, 보증 여부에 따라 달라집니다.';
