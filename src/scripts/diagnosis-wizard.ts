import {
  COST_DISCLAIMER,
  COST_META,
  LEVEL_META,
  PRODUCT_FLOWS,
  SAFETY_GATE_ITEMS,
  SAFETY_GATE_OUTCOME,
  evaluateSymptom,
  getProductFlow,
  getSymptomFlow,
} from '../data/diagnosis';
import type { Outcome, ProductFlow, SymptomFlow } from '../data/diagnosis';
import { NEVER_DO } from '../consts';

interface RelatedGuide {
  title: string;
  summary: string;
  url: string;
  product: string;
  symptom: string;
}

type Step = 'safety' | 'product' | 'symptom' | 'question' | 'result';

interface State {
  step: Step;
  safetySelected: string[];
  productId: string | null;
  symptomId: string | null;
  questionIndex: number;
  answers: Record<string, string>;
  /** Safety Gate 로 확정된 결과인지 */
  fromSafetyGate: boolean;
  started: boolean;
}

const root = document.getElementById('wizard');
if (root) {
  init(root);
}

function init(mount: HTMLElement) {
  const relatedGuides = readRelatedGuides();
  const params = new URLSearchParams(window.location.search);

  // 홈에서 제품·증상을 고르고 들어올 수 있다.
  // 어떤 경우에도 Step 0(안전 확인)은 건너뛰지 않는다.
  const productParam = params.get('product');
  const preselectedProduct = getProductFlow(productParam ?? '') ? productParam : null;
  const symptomParam = params.get('symptom');
  const preselectedSymptom =
    preselectedProduct && symptomParam && getSymptomFlow(preselectedProduct, symptomParam)
      ? symptomParam
      : null;

  // 홈 히어로에서 먼저 답한 항목을 `a_<질문id>=<선택지id>` 형태로 넘겨받는다.
  // 실제로 존재하는 질문과 선택지만 받아들인다.
  const prefilledAnswers: Record<string, string> = {};
  if (preselectedProduct && preselectedSymptom) {
    const flow = getSymptomFlow(preselectedProduct, preselectedSymptom);
    flow?.questions.forEach((question) => {
      const value = params.get(`a_${question.id}`);
      if (value && question.options.some((option) => option.id === value)) {
        prefilledAnswers[question.id] = value;
      }
    });
  }

  /** 아직 답하지 않은 첫 질문의 위치 */
  function firstUnansweredIndex(flow: SymptomFlow, answers: Record<string, string>) {
    const index = flow.questions.findIndex((question) => !answers[question.id]);
    return index === -1 ? flow.questions.length : index;
  }

  const state: State = {
    step: 'safety',
    safetySelected: [],
    productId: preselectedProduct,
    symptomId: preselectedSymptom,
    questionIndex: 0,
    answers: {},
    fromSafetyGate: false,
    started: false,
  };

  let firstRender = true;
  render();

  /* ── 렌더 ────────────────────────────────────────────── */

  function render() {
    mount.replaceChildren();
    setResultIndexing(state.step === 'result');

    switch (state.step) {
      case 'safety':
        renderSafety();
        break;
      case 'product':
        renderProduct();
        break;
      case 'symptom':
        renderSymptom();
        break;
      case 'question':
        renderQuestion();
        break;
      case 'result':
        renderResult();
        break;
    }

    // 첫 렌더에서는 포커스를 옮기지 않는다. (페이지가 위저드 위치로 튀는 것을 막는다)
    if (firstRender) {
      firstRender = false;
    } else {
      mount.focus();
    }
  }

  /** 진단 결과가 보이는 동안에는 색인 대상에서 제외한다. */
  function setResultIndexing(isResult: boolean) {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (meta) meta.content = isResult ? 'noindex,follow' : 'index,follow';
    mount.toggleAttribute('data-nosnippet', isResult);
  }

  function progress(current: number, total: number, label: string) {
    const el = document.createElement('div');
    el.className = 'wizard__progress';
    const left = document.createElement('span');
    left.textContent = label;
    const right = document.createElement('span');
    right.textContent = `${current} / ${total} 단계`;
    el.append(left, right);
    return el;
  }

  function heading(text: string, hint?: string) {
    const frag = document.createDocumentFragment();
    const h = document.createElement('h2');
    h.className = 'wizard__question';
    h.textContent = text;
    frag.append(h);
    if (hint) {
      const p = document.createElement('p');
      p.className = 'wizard__hint';
      p.textContent = hint;
      frag.append(p);
    }
    return frag;
  }

  function optionList(
    options: { id: string; label: string }[],
    onPick: (id: string) => void,
  ) {
    const ul = document.createElement('ul');
    ul.className = 'option-list';
    options.forEach((opt) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.textContent = opt.label;
      btn.addEventListener('click', () => onPick(opt.id));
      li.append(btn);
      ul.append(li);
    });
    return ul;
  }

  function navBar(buttons: { label: string; onClick: () => void; variant?: string }[]) {
    const nav = document.createElement('div');
    nav.className = 'wizard__nav';
    buttons.forEach((b) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn ${b.variant ?? 'btn--ghost'}`;
      btn.textContent = b.label;
      btn.addEventListener('click', b.onClick);
      nav.append(btn);
    });
    return nav;
  }

  /* ── Step 0 — Safety Gate ───────────────────────────── */

  function renderSafety() {
    mount.append(progress(1, 4, '안전 확인'));
    mount.append(
      heading(
        '먼저 아래에 해당하는 것이 있는지 확인해 주세요',
        '하나라도 해당된다면 원인을 좁히기보다 사용을 멈추는 편이 안전합니다. 해당 사항이 없다면 그대로 다음으로 넘어가세요.',
      ),
    );

    const list = document.createElement('div');
    list.className = 'option-list';
    SAFETY_GATE_ITEMS.forEach((item) => {
      const label = document.createElement('label');
      label.className = 'check-option';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = item.id;
      input.checked = state.safetySelected.includes(item.id);
      const span = document.createElement('span');
      span.textContent = item.label;
      label.append(input, span);
      list.append(label);
    });
    mount.append(list);

    mount.append(
      navBar([
        {
          label: '다음',
          variant: 'btn',
          onClick: () => {
            const checked = Array.from(
              list.querySelectorAll<HTMLInputElement>('input:checked'),
            ).map((i) => i.value);
            state.safetySelected = checked;

            if (!state.started) {
              state.started = true;
              window.cpTrack('diagnosis_start');
            }

            if (checked.length > 0) {
              state.fromSafetyGate = true;
              state.step = 'result';
              window.cpTrack('diagnosis_complete', { result_level: 'STOP_USE' });
            } else {
              state.fromSafetyGate = false;
              const preselectedFlow =
                state.productId && state.symptomId
                  ? getSymptomFlow(state.productId, state.symptomId)
                  : null;

              if (preselectedFlow) {
                // 홈에서 제품·증상을 고르고 들어온 경우.
                // 홈에서 먼저 답한 질문은 건너뛰고 남은 질문부터 이어간다.
                state.answers = { ...prefilledAnswers };
                state.questionIndex = firstUnansweredIndex(preselectedFlow, state.answers);
                state.step = 'question';
              } else {
                state.step = state.productId ? 'symptom' : 'product';
              }
            }
            render();
          },
        },
      ]),
    );
  }

  /* ── Step 1 — 제품 선택 ─────────────────────────────── */

  function renderProduct() {
    mount.append(progress(2, 4, '제품 선택'));
    mount.append(heading('어떤 제품인가요?'));
    mount.append(
      optionList(
        PRODUCT_FLOWS.map((p) => ({ id: p.id, label: p.label })),
        (id) => {
          state.productId = id;
          state.symptomId = null;
          state.answers = {};
          window.cpTrack('product_selected', { product: id });
          state.step = 'symptom';
          render();
        },
      ),
    );
    mount.append(
      navBar([{ label: '이전', onClick: () => goTo('safety') }]),
    );
  }

  /* ── Step 2 — 증상 선택 ─────────────────────────────── */

  function renderSymptom() {
    const product = currentProduct();
    if (!product) {
      goTo('product');
      return;
    }

    mount.append(progress(3, 4, `${product.label} 증상 선택`));
    mount.append(heading(`${product.label}에서 어떤 증상이 나타나나요?`));

    const ul = document.createElement('ul');
    ul.className = 'option-list';
    product.symptoms.forEach((symptom) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.style.flexDirection = 'column';
      btn.style.alignItems = 'flex-start';

      const strong = document.createElement('span');
      strong.textContent = symptom.label;
      const desc = document.createElement('small');
      desc.className = 'muted';
      desc.style.fontWeight = '400';
      desc.textContent = symptom.description;

      btn.append(strong, desc);
      btn.addEventListener('click', () => {
        state.symptomId = symptom.id;
        state.answers = {};
        state.questionIndex = 0;
        window.cpTrack('symptom_selected', {
          product: product.id,
          symptom: symptom.id,
        });
        state.step = 'question';
        render();
      });
      li.append(btn);
      ul.append(li);
    });
    mount.append(ul);

    mount.append(navBar([{ label: '이전', onClick: () => goTo('product') }]));
  }

  /* ── Step 3 — 분기 질문 ─────────────────────────────── */

  function renderQuestion() {
    const symptom = currentSymptom();
    if (!symptom) {
      goTo('symptom');
      return;
    }

    const question = symptom.questions[state.questionIndex];
    if (!question) {
      // 모든 질문에 이미 답이 있는 경우 바로 결과로 넘어간다.
      finish(symptom);
      render();
      return;
    }

    mount.append(
      progress(
        4,
        4,
        `${symptom.label} · 질문 ${state.questionIndex + 1}/${symptom.questions.length}`,
      ),
    );
    mount.append(heading(question.text, question.hint));
    mount.append(
      optionList(question.options, (optionId) => {
        state.answers[question.id] = optionId;
        if (state.questionIndex + 1 < symptom.questions.length) {
          state.questionIndex += 1;
          render();
        } else {
          finish(symptom);
          render();
        }
      }),
    );

    mount.append(
      navBar([
        {
          label: '이전',
          onClick: () => {
            if (state.questionIndex > 0) {
              state.questionIndex -= 1;
              render();
            } else {
              goTo('symptom');
            }
          },
        },
      ]),
    );
  }

  function finish(symptom: SymptomFlow) {
    state.step = 'result';
    const outcome = evaluateSymptom(symptom, state.answers);
    window.cpTrack('diagnosis_complete', {
      product: state.productId ?? '',
      symptom: symptom.id,
      result_level: outcome.level,
    });
  }

  /* ── Step 4 — 결과 ──────────────────────────────────── */

  function renderResult() {
    const symptom = state.fromSafetyGate ? null : currentSymptom();
    const outcome: Outcome =
      state.fromSafetyGate || !symptom
        ? SAFETY_GATE_OUTCOME
        : evaluateSymptom(symptom, state.answers);

    mount.append(resultHead(outcome));
    mount.append(reasonSection(outcome, symptom));
    mount.append(
      listSection(
        '사용자가 안전하게 확인할 수 있는 항목',
        outcome.selfChecks,
        'check-list',
      ),
    );
    mount.append(listSection('하지 말아야 할 것', [...NEVER_DO], 'x-list'));
    mount.append(costSection(outcome));
    mount.append(nextActionsSection());
    mount.append(relatedSection(symptom));

    mount.append(
      navBar([
        {
          label: '처음부터 다시 진단하기',
          variant: 'btn btn--secondary',
          onClick: () => {
            state.step = 'safety';
            state.safetySelected = [];
            state.symptomId = null;
            state.answers = {};
            state.questionIndex = 0;
            state.fromSafetyGate = false;
            render();
          },
        },
        ...(state.fromSafetyGate
          ? []
          : [
              {
                label: '질문 다시 답하기',
                onClick: () => {
                  state.step = 'question';
                  state.questionIndex = Math.max(
                    0,
                    (currentSymptom()?.questions.length ?? 1) - 1,
                  );
                  render();
                },
              },
            ]),
      ]),
    );
  }

  function resultHead(outcome: Outcome) {
    const box = document.createElement('div');
    box.className = 'result-head';
    box.dataset.level = outcome.level;
    box.setAttribute('role', 'status');

    const kicker = document.createElement('p');
    kicker.className = 'result-head__kicker';
    kicker.textContent = LEVEL_META[outcome.level].kicker;

    const h = document.createElement('h2');
    h.textContent = outcome.title;

    const p = document.createElement('p');
    p.textContent = LEVEL_META[outcome.level].summary;

    box.append(kicker, h, p);
    return box;
  }

  function reasonSection(outcome: Outcome, symptom: SymptomFlow | null) {
    const section = document.createElement('section');
    section.className = 'result-section';

    const h = document.createElement('h3');
    h.textContent = '이렇게 판단한 이유';
    const p = document.createElement('p');
    p.textContent = outcome.reason;
    section.append(h, p);

    if (state.fromSafetyGate) {
      const ul = document.createElement('ul');
      SAFETY_GATE_ITEMS.filter((i) => state.safetySelected.includes(i.id)).forEach(
        (item) => {
          const li = document.createElement('li');
          li.textContent = item.label;
          ul.append(li);
        },
      );
      section.append(ul);
      return section;
    }

    if (symptom) {
      const ul = document.createElement('ul');
      ul.className = 'answer-trail';

      const first = document.createElement('li');
      const firstQ = document.createElement('span');
      firstQ.className = 'q';
      firstQ.textContent = '선택한 증상';
      const firstA = document.createElement('span');
      firstA.className = 'a';
      firstA.textContent = `${currentProduct()?.label ?? ''} · ${symptom.label}`;
      first.append(firstQ, firstA);
      ul.append(first);

      symptom.questions.forEach((q) => {
        const answerId = state.answers[q.id];
        if (!answerId) return;
        const option = q.options.find((o) => o.id === answerId);
        if (!option) return;
        const li = document.createElement('li');
        const qs = document.createElement('span');
        qs.className = 'q';
        qs.textContent = q.text;
        const as = document.createElement('span');
        as.className = 'a';
        as.textContent = option.label;
        li.append(qs, as);
        ul.append(li);
      });
      section.append(ul);
    }

    return section;
  }

  function listSection(title: string, items: string[], className: string) {
    const section = document.createElement('section');
    section.className = 'result-section';
    const h = document.createElement('h3');
    h.textContent = title;
    const ul = document.createElement('ul');
    ul.className = className;
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.append(li);
    });
    section.append(h, ul);
    return section;
  }

  function costSection(outcome: Outcome) {
    const meta = COST_META[outcome.costRisk];
    const section = document.createElement('section');
    section.className = 'result-section';

    const h = document.createElement('h3');
    h.textContent = '비용 위험';

    const badgeLine = document.createElement('p');
    const badge = document.createElement('span');
    badge.className = `badge ${meta.badge}`.trim();
    badge.textContent = `비용 위험 ${meta.label}`;
    badgeLine.append(badge);

    const note = document.createElement('p');
    note.textContent = outcome.costNote ?? meta.note;

    const disclaimer = document.createElement('p');
    disclaimer.className = 'muted';
    disclaimer.textContent = COST_DISCLAIMER;

    section.append(h, badgeLine, note, disclaimer);
    return section;
  }

  function nextActionsSection() {
    const section = document.createElement('section');
    section.className = 'result-section';
    const h = document.createElement('h3');
    h.textContent = '다음에 할 수 있는 일';
    const ul = document.createElement('ul');

    const items: { label: string; href: string; external?: boolean }[] = [
      {
        label: '삼성전자서비스에서 제품 자가 점검과 서비스 접수 확인하기',
        href: 'https://www.samsungsvc.co.kr/',
        external: true,
      },
      {
        label: 'LG전자 고객지원에서 제품 문제 해결과 서비스 예약 확인하기',
        href: 'https://www.lge.co.kr/support',
        external: true,
      },
      { label: '수리할지 교체할지 판단 기준 보기', href: '/repair-or-replace/' },
      { label: '안전 안내에서 확인 가능한 범위 다시 보기', href: '/safety/' },
    ];

    const product = currentProduct();
    if (product) {
      items.splice(2, 0, {
        label: `${product.label} 정보 페이지에서 서비스 기준 확인하기`,
        href: product.href,
      });
    }

    items.forEach((item) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (item.external) {
        a.className = 'external';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      li.append(a);
      ul.append(li);
    });

    const caution = document.createElement('p');
    caution.className = 'muted';
    caution.textContent =
      '표시된 제조사 링크는 예시이며 외부 사이트로 연결됩니다. 다른 제조사 제품이라면 해당 제조사의 공식 고객지원에서 확인하세요. 부르기전에는 수리 업체를 중개하거나 특정 업체를 추천하지 않습니다.';

    section.append(h, ul, caution);
    return section;
  }

  function relatedSection(symptom: SymptomFlow | null) {
    const section = document.createElement('section');
    section.className = 'result-section';

    const matched = symptom
      ? relatedGuides.filter(
          (g) => g.product === state.productId && g.symptom === symptom.id,
        )
      : [];
    const sameProduct = relatedGuides.filter((g) => g.product === state.productId);
    const list = matched.length > 0 ? matched : sameProduct;

    if (list.length === 0) return section;

    const h = document.createElement('h3');
    h.textContent = '관련 가이드';
    const ul = document.createElement('ul');
    list.slice(0, 4).forEach((guide) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = guide.url;
      a.textContent = guide.title;
      a.addEventListener('click', () => {
        window.cpTrack('related_guide_click', { product: guide.product });
      });
      li.append(a);
      ul.append(li);
    });
    section.append(h, ul);
    return section;
  }

  /* ── 보조 ───────────────────────────────────────────── */

  function currentProduct(): ProductFlow | undefined {
    return state.productId ? getProductFlow(state.productId) : undefined;
  }

  function currentSymptom(): SymptomFlow | null {
    if (!state.productId || !state.symptomId) return null;
    return getSymptomFlow(state.productId, state.symptomId) ?? null;
  }

  function goTo(step: Step) {
    state.step = step;
    render();
  }
}

function readRelatedGuides(): RelatedGuide[] {
  const el = document.getElementById('related-guides-data');
  if (!el?.textContent) return [];
  try {
    return JSON.parse(el.textContent) as RelatedGuide[];
  } catch {
    return [];
  }
}
