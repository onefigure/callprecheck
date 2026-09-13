---
# ─────────────────────────────────────────────────────────────
# Phase 2 증상 가이드 작성 템플릿
#
# 이 파일은 `_` 로 시작하므로 빌드에 포함되지 않는다.
# 실제 글을 쓸 때는 이 파일을 복사해 `washer-spin-fail.md` 처럼
# 슬러그가 될 파일명으로 저장한다.
#
# 저장 위치:  src/content/guides/<파일명>.md  (또는 .mdx)
# 생성 URL :  /{product}/{slug 또는 파일명}/
# ─────────────────────────────────────────────────────────────

title: 세탁기 탈수가 안 될 때 먼저 확인할 것
# url_slug 를 생략하면 파일명이 URL 이 된다.
# frontmatter 의 `slug` 는 Astro 예약어이므로 반드시 `url_slug` 를 쓴다.
url_slug: spin-fail
# washer | aircon | refrigerator
product: washer
# src/data/diagnosis/<product>.ts 의 증상 id 와 맞추면
# 진단 결과 화면의 "관련 가이드"에 자동으로 연결된다.
symptom: spin-fail
# 이 글을 검색한 사람이 실제로 알고 싶어 하는 것
search_intent: 탈수가 멈췄을 때 고장인지 사용 문제인지 구분하고 서비스를 불러야 하는지 판단하고 싶다
# 목록과 meta description 에 그대로 사용된다. 한두 문장.
summary: 탈수가 안 될 때는 배수가 끝났는지부터 확인해야 합니다. 사용자가 볼 수 있는 항목과 서비스가 필요한 기준을 정리했습니다.
# 사람이 마지막으로 내용을 검토한 날짜 (YYYY-MM-DD)
last_reviewed: 2026-09-12
# 실제로 열어서 확인한 자료만 적는다. 최소 1개.
sources:
  - name: 삼성전자서비스 — 세탁기 자가 점검
    url: https://www.samsungsvc.co.kr/
    checked_at: 2026-09-12
  - name: LG전자 고객지원 — 세탁기 문제 해결
    url: https://www.lge.co.kr/support
    checked_at: 2026-09-12
# low | caution | stop-use
safety_level: caution
# official | verified-data | reference-range | unknown
cost_confidence: unknown
author: 부르기전에 편집팀
# 검토자가 있으면 적는다. 없으면 줄 자체를 지운다.
reviewer:
# true 로 두면 빌드에서 제외된다.
draft: true
---

## 이 증상은 이런 상황입니다

(검색한 사람이 겪고 있는 상황을 먼저 확인해 준다.)

## 먼저 안전부터

(사용을 중지해야 하는 신호를 먼저 안내한다. `/safety/` 의 기준과 다르게 쓰지 않는다.)

## 30초 판단

(지금 바로 확인할 수 있는 핵심 한두 가지.)

## 사용자가 확인할 수 있는 항목

(설명서가 사용자 범위로 안내하는 것만. 분해·배선·냉매·가스는 절대 넣지 않는다.)

## 서비스를 부르는 기준

(자가 확인 범위를 넘어가는 조건.)

## 예상되는 점검 영역

(부품을 단정하지 않는다. `/editorial-policy/` 5번 원칙.
 "○○ 고장입니다" 대신 "○○ 점검이 필요할 수 있습니다",
 "○○가 아닙니다" 대신 "○○ 가능성은 낮아집니다"로 쓴다.
 한 문서 안에서 확정 표현과 가능성 표현을 섞지 않는다.
 단, 안전 지시와 제조사가 정상으로 안내한 현상은 분명하게 쓴다.)

## 비용 위험

(금액을 만들지 않는다. `cost_confidence` 가 `unknown` 이면 위험 수준과 확인 방법만 쓴다.)

## 수리할지 교체할지

(판단 기준은 `/repair-or-replace/` 로 연결한다.)

---

작성 원칙은 `/editorial-policy/` 를 따른다.
확인 자료 목록과 확인일은 frontmatter 의 `sources` 에서 자동으로 페이지 하단에 출력되므로
본문에 다시 적을 필요가 없다.
