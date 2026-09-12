import type { Outcome, ProductFlow, ProductId, Rule, SymptomFlow } from './types';
import { washer } from './washer';
import { aircon } from './aircon';
import { refrigerator } from './refrigerator';

export * from './types';
export { LEVEL_META, COST_META, COST_DISCLAIMER } from './labels';
export { SAFETY_GATE_ITEMS, SAFETY_GATE_OUTCOME } from './safety-gate';

/** 진단 대상 제품 목록 (Phase 1: 3종) */
export const PRODUCT_FLOWS: ProductFlow[] = [washer, aircon, refrigerator];

export function getProductFlow(productId: string): ProductFlow | undefined {
  return PRODUCT_FLOWS.find((p) => p.id === productId);
}

export function getSymptomFlow(
  productId: string,
  symptomId: string,
): SymptomFlow | undefined {
  return getProductFlow(productId)?.symptoms.find((s) => s.id === symptomId);
}

function ruleMatches(rule: Rule, answers: Record<string, string>): boolean {
  return Object.entries(rule.when).every(([questionId, expected]) => {
    const given = answers[questionId];
    if (given === undefined) return false;
    return Array.isArray(expected) ? expected.includes(given) : expected === given;
  });
}

/**
 * 규칙을 위에서부터 평가해 먼저 일치하는 결과를 돌려준다.
 * 일치하는 규칙이 없으면 fallback 을 사용한다.
 */
export function evaluateSymptom(
  flow: SymptomFlow,
  answers: Record<string, string>,
): Outcome {
  const matched = flow.rules.find((rule) => ruleMatches(rule, answers));
  return matched ? matched.outcome : flow.fallback;
}

/** 홈/허브에서 쓰는 제품 요약 */
export const PRODUCT_SUMMARY: Array<{
  id: ProductId;
  label: string;
  href: string;
  symptomCount: number;
}> = PRODUCT_FLOWS.map((p) => ({
  id: p.id,
  label: p.label,
  href: p.href,
  symptomCount: p.symptoms.length,
}));
