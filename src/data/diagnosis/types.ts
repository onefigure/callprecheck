/**
 * 고장 진단 Wizard 데이터 구조.
 *
 * 설계 원칙
 * - "고장 부품을 맞히는" 구조가 아니라 "다음 행동을 결정하는" 구조다.
 * - 모든 판단은 선언형 규칙(rules)으로만 표현하고, 코드 분기를 늘리지 않는다.
 * - 수리비 금액은 어떤 필드에도 저장하지 않는다. 비용은 등급(costRisk)으로만 표현한다.
 */

/** 진단 결과 4등급 */
export type OutcomeLevel =
  | 'SELF_CHECK' // 먼저 사용자가 확인
  | 'MONITOR' // 조치 후 다시 확인
  | 'SERVICE_RECOMMENDED' // 서비스 점검 권장
  | 'STOP_USE'; // 사용 중지 및 전문 점검

/** 비용 위험도. Phase 1에서는 금액을 만들지 않는다. */
export type CostRisk = 'low' | 'medium' | 'high' | 'unknown';

/** 초기 대상 제품 */
export type ProductId = 'washer' | 'aircon' | 'refrigerator';

export interface AnswerOption {
  id: string;
  label: string;
}

export interface Question {
  /** 같은 증상 흐름 안에서 유일한 키. 규칙(when)에서 이 키를 참조한다. */
  id: string;
  text: string;
  /** 질문을 정확히 이해하기 위한 보조 설명 (선택) */
  hint?: string;
  options: AnswerOption[];
}

export interface Outcome {
  level: OutcomeLevel;
  /** 결과 화면의 제목. 단정적인 고장 진단명으로 쓰지 않는다. */
  title: string;
  /** 선택한 응답을 근거로 한 판단 이유 */
  reason: string;
  costRisk: CostRisk;
  /** 기본 비용 위험 설명을 덮어써야 할 때만 사용 */
  costNote?: string;
  /** 사용자가 안전하게 직접 확인할 수 있는 항목 (3~5개) */
  selfChecks: string[];
}

/**
 * 규칙. `when` 에 적힌 질문이 모두 일치하면 이 결과를 사용한다.
 * `when` 에 없는 질문은 어떤 답이든 상관없다(와일드카드).
 * 배열을 주면 그중 하나만 일치해도 된다.
 */
export interface Rule {
  when: Record<string, string | string[]>;
  outcome: Outcome;
}

export interface SymptomFlow {
  id: string;
  /** 증상 선택 화면에 보이는 문구 */
  label: string;
  /** 증상 선택 화면의 한 줄 보조 설명 */
  description: string;
  questions: Question[];
  /** 위에서부터 순서대로 평가하며, 먼저 일치하는 규칙을 사용한다. */
  rules: Rule[];
  /** 어떤 규칙에도 걸리지 않을 때의 결과 */
  fallback: Outcome;
}

export interface ProductFlow {
  id: ProductId;
  label: string;
  /** 제품 허브 경로 (/washer/ 등) */
  href: string;
  symptoms: SymptomFlow[];
}
