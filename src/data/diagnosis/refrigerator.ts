import type { ProductFlow } from './types';

/**
 * 냉장고 진단 흐름.
 * 냉매·컴프레서 관련 작업은 어떤 결과에서도 사용자에게 안내하지 않는다.
 */
export const refrigerator: ProductFlow = {
  id: 'refrigerator',
  label: '냉장고',
  href: '/refrigerator/',
  symptoms: [
    /* ── 1. 냉장이 약함 ─────────────────────────────────── */
    {
      id: 'weak-cooling',
      label: '냉장이 약함',
      description: '냉장실이 예전만큼 시원하지 않은 경우',
      questions: [
        {
          id: 'setting',
          text: '냉장실 온도 설정을 최근에 바꾸신 적이 있나요?',
          options: [
            { id: 'changed', label: '바꾼 적이 있거나 누가 바꿨을 수 있다' },
            { id: 'same', label: '그대로다' },
            { id: 'unsure', label: '확인하지 못했다' },
          ],
        },
        {
          id: 'load',
          text: '최근에 음식을 많이 채우거나, 따뜻한 음식을 그대로 넣으셨나요?',
          options: [
            { id: 'yes', label: '그렇다' },
            { id: 'no', label: '평소와 비슷하다' },
          ],
        },
        {
          id: 'door',
          text: '문 닫힘 상태는 어떤가요?',
          hint: '문이 완전히 닫히지 않으면 냉기가 계속 빠져나갑니다.',
          options: [
            { id: 'gap', label: '문이 잘 안 닫히거나 패킹이 들떠 있다' },
            { id: 'frequent', label: '문을 자주 열고 닫는 편이다' },
            { id: 'ok', label: '잘 닫힌다' },
          ],
        },
        {
          id: 'vent',
          text: '냉장실 안쪽 냉기 나오는 구멍(토출구)이 음식이나 용기로 막혀 있지는 않나요?',
          options: [
            { id: 'blocked', label: '막혀 있었다' },
            { id: 'clear', label: '막혀 있지 않다' },
            { id: 'unsure', label: '어디인지 모르겠다' },
          ],
        },
        {
          id: 'freezer',
          text: '냉동실은 정상인가요?',
          options: [
            { id: 'ok', label: '냉동은 잘 된다' },
            { id: 'weak', label: '냉동도 약하다' },
          ],
        },
      ],
      rules: [
        {
          when: { setting: 'changed' },
          outcome: {
            level: 'SELF_CHECK',
            title: '온도 설정을 먼저 확인하세요',
            reason:
              '온도 설정을 바꿨거나 누군가 바꿨을 수 있다고 선택하셨습니다. 설정값 하나로 체감 온도가 크게 달라질 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '냉장실 설정 온도를 설명서가 권장하는 범위로 맞춥니다.',
              '‘휴가 모드’, ‘절전 모드’ 같은 기능이 켜져 있는지 확인합니다.',
              '설정 변경 후 하루 정도 지켜보며 온도가 내려가는지 확인합니다.',
              '온도계를 넣어 실제 온도를 확인하면 더 정확합니다.',
            ],
          },
        },
        {
          when: { vent: 'blocked' },
          outcome: {
            level: 'SELF_CHECK',
            title: '냉기 흐름부터 확보하세요',
            reason:
              '냉기 토출구가 막혀 있었다고 선택하셨습니다. 냉기 순환이 막히면 특정 칸만 온도가 올라갈 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '토출구 앞을 막고 있는 음식이나 용기를 치웁니다.',
              '음식을 벽면에 밀착시키지 않고 간격을 둡니다.',
              '냉장실을 가득 채우지 않고 공기가 돌 공간을 남깁니다.',
              '정리 후 하루 정도 지켜보며 개선되는지 확인합니다.',
            ],
          },
        },
        {
          when: { door: 'gap' },
          outcome: {
            level: 'MONITOR',
            title: '문 닫힘 상태를 확인한 뒤 다시 보세요',
            reason:
              '문이 잘 닫히지 않거나 패킹이 들떠 있다고 선택하셨습니다. 냉기가 새면 냉장 성능이 떨어집니다.',
            costRisk: 'low',
            selfChecks: [
              '문 패킹(고무)에 이물질이 끼어 있는지 확인하고 부드럽게 닦습니다.',
              '문에 넣은 물건이 걸려 문이 덜 닫히는지 확인합니다.',
              '냉장고가 앞으로 기울어져 있지 않은지 확인합니다.',
              '패킹이 찢어졌거나 변형됐다면 교체 상담을 받습니다.',
            ],
          },
        },
        {
          when: { load: 'yes' },
          outcome: {
            level: 'MONITOR',
            title: '보관 조건을 조정한 뒤 지켜보세요',
            reason:
              '음식을 많이 채웠거나 따뜻한 음식을 그대로 넣었다고 선택하셨습니다. 일시적으로 내부 온도가 올라갈 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '따뜻한 음식은 식힌 뒤 넣습니다.',
              '냉기 순환을 위해 공간을 조금 비웁니다.',
              '문을 여는 횟수를 줄이고 하루 정도 지켜봅니다.',
              '그래도 회복되지 않으면 다시 진단해 봅니다.',
            ],
          },
        },
        {
          when: { freezer: 'weak' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '냉장과 냉동이 함께 약하다고 선택하셨습니다. 냉각 계통 전체와 관련될 수 있어 점검이 필요합니다.',
            costRisk: 'high',
            selfChecks: [
              '상하기 쉬운 음식을 먼저 옮깁니다.',
              '냉장고 뒷면과 옆면에 벽과의 간격이 있는지 확인합니다.',
              '설정 온도와 특수 모드를 확인합니다.',
              '모델명과 제조연월을 확인해 접수합니다.',
            ],
          },
        },
        {
          when: { setting: 'same', door: 'ok', vent: 'clear' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '점검을 받아 보는 편이 좋습니다',
            reason:
              '설정, 문 닫힘, 냉기 흐름을 모두 확인했는데도 냉장이 약하다고 선택하셨습니다. 남은 확인 범위는 사용자가 직접 다루기 어렵습니다.',
            costRisk: 'medium',
            selfChecks: [
              '냉장실에 온도계를 넣어 실제 온도를 확인합니다.',
              '냉장고 뒷면 통풍 공간을 확보합니다.',
              '언제부터 달라졌는지 기록합니다.',
              '보증 기간이 남아 있는지 확인합니다.',
            ],
          },
        },
      ],
      fallback: {
        level: 'MONITOR',
        title: '설정과 사용 조건을 정리한 뒤 다시 보세요',
        reason:
          '냉장 성능은 설정, 보관량, 문 사용 습관의 영향을 함께 받습니다.',
        costRisk: 'unknown',
        selfChecks: [
          '설정 온도와 특수 모드를 확인합니다.',
          '냉기 토출구 주변을 정리합니다.',
          '문 패킹 상태를 확인합니다.',
          '하루 정도 지켜본 뒤에도 같으면 점검을 고려합니다.',
        ],
      },
    },

    /* ── 2. 냉동은 되는데 냉장이 안 됨 ───────────────────── */
    {
      id: 'freezer-ok-fridge-not',
      label: '냉동은 되는데 냉장이 안 됨',
      description: '냉동실은 얼지만 냉장실만 시원하지 않은 경우',
      questions: [
        {
          id: 'frost-freezer',
          text: '냉동실 안쪽 벽이나 통풍구에 성에가 두껍게 끼어 있나요?',
          options: [
            { id: 'heavy', label: '두껍게 끼어 있다' },
            { id: 'slight', label: '조금 있다' },
            { id: 'none', label: '거의 없다' },
          ],
        },
        {
          id: 'airflow',
          text: '냉장실 토출구에 손을 대면 찬바람이 느껴지나요?',
          options: [
            { id: 'none', label: '바람이 거의 느껴지지 않는다' },
            { id: 'weak', label: '약하게 느껴진다' },
            { id: 'normal', label: '평소처럼 나온다' },
          ],
        },
        {
          id: 'vent-blocked',
          text: '냉장실 토출구가 음식이나 용기로 막혀 있나요?',
          options: [
            { id: 'yes', label: '막혀 있었다' },
            { id: 'no', label: '막혀 있지 않다' },
          ],
        },
        {
          id: 'fan-noise',
          text: '냉장고에서 평소와 다른 팬 소리나 ‘드르륵’ 하는 소리가 나나요?',
          options: [
            { id: 'yes', label: '난다' },
            { id: 'no', label: '나지 않는다' },
          ],
        },
      ],
      rules: [
        {
          when: { 'vent-blocked': 'yes' },
          outcome: {
            level: 'SELF_CHECK',
            title: '냉기 통로를 먼저 확보하세요',
            reason:
              '냉장실 토출구가 막혀 있었다고 선택하셨습니다. 냉동실에서 만든 냉기를 냉장실로 보내는 구조에서는 통로가 막히면 냉장만 약해질 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '토출구 앞의 음식과 용기를 치웁니다.',
              '음식을 안쪽 벽에 바짝 붙이지 않습니다.',
              '정리 후 하루 정도 온도 변화를 지켜봅니다.',
              '냉장실에 온도계를 넣어 실제 온도를 확인합니다.',
            ],
          },
        },
        {
          when: { 'frost-freezer': 'heavy' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '냉동실에 성에가 두껍게 끼어 있다고 선택하셨습니다. 성에가 냉기 통로를 막으면 냉장실만 온도가 올라갈 수 있으며, 성에가 반복해서 두껍게 끼는 것은 점검이 필요한 신호일 수 있습니다.',
            costRisk: 'medium',
            selfChecks: [
              '냉동실 문이 완전히 닫히는지, 패킹에 이물질이 있는지 확인합니다.',
              '뜨거운 물이나 날카로운 도구로 성에를 제거하지 않습니다.',
              '음식을 옮길 수 있다면 설명서가 안내하는 방법으로 전원을 끄고 자연 해동해 볼 수 있습니다.',
              '성에가 며칠 만에 다시 두껍게 끼는지 기록해 접수 시 전달합니다.',
            ],
          },
        },
        {
          when: { airflow: 'none', 'fan-noise': 'yes' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '냉장실로 바람이 거의 오지 않고 평소와 다른 소리가 난다고 선택하셨습니다. 냉기를 보내는 계통과 관련될 수 있어 사용자가 확인하기 어렵습니다.',
            costRisk: 'medium',
            selfChecks: [
              '상하기 쉬운 음식을 먼저 옮깁니다.',
              '내부 커버나 팬 부위를 분해하지 않습니다.',
              '소리가 나는 시점과 위치를 기록합니다.',
              '모델명과 제조연월을 확인해 접수합니다.',
            ],
          },
        },
        {
          when: { airflow: ['none', 'weak'] },
          outcome: {
            level: 'MONITOR',
            title: '냉기 흐름을 확인한 뒤 다시 보세요',
            reason:
              '냉장실로 오는 바람이 약하다고 선택하셨습니다. 냉기 통로 막힘이나 성에 여부를 먼저 확인해 볼 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '토출구 주변을 정리하고 음식 간격을 둡니다.',
              '냉동실 성에 상태를 함께 확인합니다.',
              '문 패킹에 이물질이 있는지 확인합니다.',
              '하루 정도 지켜본 뒤에도 같으면 점검을 고려합니다.',
            ],
          },
        },
        {
          when: { airflow: 'normal' },
          outcome: {
            level: 'MONITOR',
            title: '보관 조건과 설정을 확인해 보세요',
            reason:
              '냉기는 정상적으로 나온다고 선택하셨습니다. 설정값이나 보관 방식이 영향을 주고 있을 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '냉장실 설정 온도를 확인합니다.',
              '냉장실을 가득 채우지 않았는지 확인합니다.',
              '온도계를 넣어 칸별 온도를 비교합니다.',
              '특정 칸만 문제인지 확인해 기록합니다.',
            ],
          },
        },
      ],
      fallback: {
        level: 'MONITOR',
        title: '냉기 통로와 설정을 함께 확인해 보세요',
        reason:
          '냉동과 냉장이 다르게 동작하는 경우, 냉기 이동 경로와 설정을 먼저 확인하는 편이 순서상 맞습니다.',
        costRisk: 'unknown',
        selfChecks: [
          '냉장실 토출구 주변을 정리합니다.',
          '냉동실 성에 상태를 확인합니다.',
          '설정 온도와 특수 모드를 확인합니다.',
          '하루 정도 지켜본 뒤 변화를 기록합니다.',
        ],
      },
    },

    /* ── 3. 냉장·냉동 모두 안 됨 ─────────────────────────── */
    {
      id: 'both-fail',
      label: '냉장·냉동 모두 안 됨',
      description: '냉장고 전체가 시원해지지 않는 경우',
      questions: [
        {
          id: 'power',
          text: '내부 조명이나 표시창은 켜지나요?',
          options: [
            { id: 'on', label: '켜진다' },
            { id: 'off', label: '아무 반응도 없다' },
          ],
        },
        {
          id: 'breaker',
          text: '차단기가 내려가 있거나 반복해서 내려가나요?',
          options: [
            { id: 'repeat', label: '반복해서 내려간다' },
            { id: 'tripped', label: '내려가 있었다' },
            { id: 'no', label: '아니다' },
          ],
        },
        {
          id: 'compressor',
          text: '냉장고 뒤쪽에서 작동음(윙 소리)이 들리나요?',
          hint: '뒷면 부품에 손을 대지 말고 소리만 확인하세요.',
          options: [
            { id: 'yes', label: '들린다' },
            { id: 'no', label: '전혀 들리지 않는다' },
            { id: 'unsure', label: '확인하기 어렵다' },
          ],
        },
        {
          id: 'mode',
          text: '‘휴가 모드’, ‘쇼룸/전시 모드’ 같은 기능이 켜져 있지는 않나요?',
          options: [
            { id: 'on', label: '켜져 있었다' },
            { id: 'off', label: '켜져 있지 않다' },
            { id: 'unsure', label: '확인하지 못했다' },
          ],
        },
      ],
      rules: [
        {
          when: { breaker: 'repeat' },
          outcome: {
            level: 'STOP_USE',
            title: '사용을 중지하고 점검을 요청하세요',
            reason:
              '차단기가 반복해서 내려간다고 선택하셨습니다. 이상 전류가 반복 감지되는 상태일 수 있습니다.',
            costRisk: 'unknown',
            selfChecks: [
              '차단기를 반복해서 올리지 않습니다.',
              '냉장고 플러그를 뽑은 상태에서도 차단기가 내려가는지 확인합니다.',
              '음식은 아이스박스 등으로 옮겨 보관합니다.',
              '제조사 고객지원 또는 자격을 갖춘 전기 전문가에게 점검을 요청합니다.',
            ],
          },
        },
        {
          when: { mode: 'on' },
          outcome: {
            level: 'SELF_CHECK',
            title: '설정 모드를 먼저 해제하세요',
            reason:
              '휴가 모드나 전시용 모드가 켜져 있었다고 선택하셨습니다. 이런 모드에서는 냉각이 약해지거나 멈출 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '설명서를 보고 해당 모드를 해제합니다.',
              '설정 온도를 권장 범위로 맞춥니다.',
              '해제 후 몇 시간 지켜보며 온도가 내려가는지 확인합니다.',
              '변화가 없으면 다시 진단해 봅니다.',
            ],
          },
        },
        {
          when: { power: 'off' },
          outcome: {
            level: 'MONITOR',
            title: '전원 공급부터 확인하세요',
            reason:
              '내부 조명이나 표시창에 아무 반응이 없다고 선택하셨습니다. 냉각 문제보다 전원 공급 문제일 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '플러그가 끝까지 꽂혀 있는지 확인합니다.',
              '해당 회로의 차단기 상태를 확인합니다.',
              '같은 콘센트에 다른 기기를 꽂아 전원이 오는지 확인합니다.',
              '음식은 상하지 않도록 먼저 옮깁니다.',
            ],
          },
        },
        {
          when: { power: 'on', compressor: 'no' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '전원은 들어오는데 뒤쪽에서 작동음이 전혀 들리지 않는다고 선택하셨습니다. 냉각 계통과 관련될 수 있어 점검이 필요합니다.',
            costRisk: 'high',
            selfChecks: [
              '상하기 쉬운 음식을 먼저 옮깁니다.',
              '냉장고 뒷면 부품에 손대거나 분해하지 않습니다.',
              '뒷면과 벽 사이 통풍 공간이 확보되어 있는지 확인합니다.',
              '모델명과 제조연월을 확인해 접수합니다.',
            ],
          },
        },
        {
          when: { power: 'on', compressor: 'yes' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '전원과 작동음은 있는데 냉각이 되지 않는다고 선택하셨습니다. 사용자가 확인할 수 있는 범위를 벗어난 점검이 필요합니다.',
            costRisk: 'high',
            selfChecks: [
              '음식을 다른 곳으로 옮겨 보관합니다.',
              '뒷면·옆면 통풍 공간을 확보합니다.',
              '설정 온도와 특수 모드를 다시 확인합니다.',
              '사용 기간이 길다면 수리와 교체 비교도 함께 고려합니다.',
            ],
          },
        },
        {
          when: { breaker: 'tripped' },
          outcome: {
            level: 'MONITOR',
            title: '차단기 상태를 확인한 뒤 다시 보세요',
            reason:
              '차단기가 내려가 있었다고 선택하셨습니다. 전원이 끊긴 동안에는 냉각이 진행되지 않습니다.',
            costRisk: 'low',
            selfChecks: [
              '주변에 물기나 탄 자국이 없는지 확인한 뒤 차단기를 한 번만 올립니다.',
              '다시 내려가면 더 이상 올리지 않고 점검을 요청합니다.',
              '전원 복구 후 온도가 내려가기까지 몇 시간이 걸릴 수 있습니다.',
              '녹았던 음식은 상태를 확인하고 판단합니다.',
            ],
          },
        },
      ],
      fallback: {
        level: 'MONITOR',
        title: '전원과 설정을 먼저 확인해 보세요',
        reason:
          '냉장고 전체가 시원하지 않을 때는 전원 공급과 설정 모드를 먼저 확인하는 편이 순서상 맞습니다.',
        costRisk: 'unknown',
        selfChecks: [
          '플러그와 차단기 상태를 확인합니다.',
          '휴가·전시 모드 설정을 확인합니다.',
          '뒷면 통풍 공간을 확인합니다.',
          '음식은 상하지 않도록 먼저 옮깁니다.',
        ],
      },
    },

    /* ── 4. 이상 소음 ───────────────────────────────────── */
    {
      id: 'noise',
      label: '이상 소음이 남',
      description: '냉장고에서 평소와 다른 소리가 나는 경우',
      questions: [
        {
          id: 'type',
          text: '어떤 소리에 가장 가깝나요?',
          options: [
            { id: 'grinding', label: '금속이 긁히거나 무언가 걸리는 소리' },
            { id: 'rattle', label: '덜덜 떨리는 소리' },
            { id: 'water', label: '물 흐르는 소리나 ‘딱딱’ 하는 소리' },
            { id: 'hum', label: '평소보다 큰 작동음' },
          ],
        },
        {
          id: 'level',
          text: '냉장고가 흔들리지 않도록 수평이 맞아 있나요?',
          options: [
            { id: 'wobble', label: '손으로 밀면 흔들린다' },
            { id: 'level', label: '흔들리지 않는다' },
            { id: 'unsure', label: '확인하지 못했다' },
          ],
        },
        {
          id: 'around',
          text: '냉장고 위나 옆에 물건이 닿아 함께 진동하지는 않나요?',
          options: [
            { id: 'yes', label: '물건이 닿아 있다' },
            { id: 'no', label: '닿아 있지 않다' },
          ],
        },
        {
          id: 'cooling',
          text: '냉각 성능은 정상인가요?',
          options: [
            { id: 'ok', label: '정상이다' },
            { id: 'weak', label: '냉각도 약해졌다' },
          ],
        },
      ],
      rules: [
        {
          when: { type: 'grinding' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '금속이 긁히거나 무언가 걸리는 소리가 난다고 선택하셨습니다. 내부 회전 부품과 관련될 수 있어 사용자가 확인하기 어렵습니다.',
            costRisk: 'medium',
            selfChecks: [
              '내부 커버나 뒷면을 분해하지 않습니다.',
              '소리가 나는 시간대와 위치를 기록합니다.',
              '냉각 성능도 함께 달라졌는지 확인합니다.',
              '모델명과 제조연월을 확인해 접수합니다.',
            ],
          },
        },
        {
          when: { around: 'yes' },
          outcome: {
            level: 'SELF_CHECK',
            title: '주변 물건부터 정리해 보세요',
            reason:
              '냉장고에 물건이 닿아 있다고 선택하셨습니다. 작동 시 미세한 진동이 주변 물건으로 전달되면 큰 소리로 들릴 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '냉장고 위와 옆의 물건을 치웁니다.',
              '벽이나 가구와 간격을 둡니다.',
              '내부 선반과 용기가 흔들리지 않게 정리합니다.',
              '정리 후 소리가 줄었는지 확인합니다.',
            ],
          },
        },
        {
          when: { level: 'wobble' },
          outcome: {
            level: 'SELF_CHECK',
            title: '설치 수평을 맞춰 보세요',
            reason:
              '손으로 밀면 흔들린다고 선택하셨습니다. 수평이 맞지 않으면 진동음이 커질 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '바닥이 평평한지 확인합니다.',
              '설명서가 안내하는 방법으로 높이 조절 다리를 조정합니다.',
              '문이 저절로 닫히는 각도인지 함께 확인합니다.',
              '조정 후 소리가 줄었는지 확인합니다.',
            ],
          },
        },
        {
          when: { type: 'water' },
          outcome: {
            level: 'MONITOR',
            title: '정상 동작음일 수 있습니다',
            reason:
              '물 흐르는 소리나 ‘딱딱’ 하는 소리라고 선택하셨습니다. 냉매 순환음이나 자동 제상 과정에서 나는 소리는 정상 동작에서도 들릴 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '소리가 일정 주기로 반복되는지 확인합니다.',
              '냉각 성능에 변화가 있는지 함께 확인합니다.',
              '소리 크기가 이전과 크게 달라졌는지 비교합니다.',
              '냉각까지 약해졌다면 다시 진단해 봅니다.',
            ],
          },
        },
        {
          when: { cooling: 'weak' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '소음과 함께 냉각 성능도 약해졌다고 선택하셨습니다. 두 증상이 함께 나타나면 점검이 필요할 가능성이 높습니다.',
            costRisk: 'high',
            selfChecks: [
              '상하기 쉬운 음식을 먼저 옮깁니다.',
              '뒷면 통풍 공간을 확보합니다.',
              '언제부터 두 증상이 함께 나타났는지 기록합니다.',
              '사용 기간이 길다면 수리와 교체 비교도 함께 고려합니다.',
            ],
          },
        },
      ],
      fallback: {
        level: 'MONITOR',
        title: '설치 상태와 주변 환경을 확인해 보세요',
        reason:
          '냉장고 소음은 설치 상태와 주변 물건의 영향을 크게 받습니다.',
        costRisk: 'unknown',
        selfChecks: [
          '수평과 바닥 상태를 확인합니다.',
          '주변 물건을 치웁니다.',
          '내부 선반과 용기를 정리합니다.',
          '냉각 성능 변화도 함께 확인합니다.',
        ],
      },
    },

    /* ── 5. 물이 샘 ─────────────────────────────────────── */
    {
      id: 'leak',
      label: '물이 샘',
      description: '냉장고 안이나 바닥에 물이 고이는 경우',
      questions: [
        {
          id: 'near-electric',
          text: '물이 콘센트나 전기제품 쪽으로 흐르고 있나요?',
          options: [
            { id: 'yes', label: '그렇다' },
            { id: 'no', label: '아니다' },
            { id: 'unsure', label: '확인하기 어렵다' },
          ],
        },
        {
          id: 'where',
          text: '물은 주로 어디에 고이나요?',
          options: [
            { id: 'inside-bottom', label: '냉장실 바닥이나 야채칸 아래' },
            { id: 'outside-floor', label: '냉장고 바깥 바닥' },
            { id: 'dispenser', label: '정수·제빙 기능 주변' },
          ],
        },
        {
          id: 'water-line',
          text: '정수기나 제빙 기능이 있는 모델인가요?',
          options: [
            { id: 'yes', label: '있다' },
            { id: 'no', label: '없다' },
          ],
        },
        {
          id: 'door',
          text: '문이 오래 열려 있었거나 잘 닫히지 않는 상태였나요?',
          options: [
            { id: 'yes', label: '그렇다' },
            { id: 'no', label: '아니다' },
          ],
        },
      ],
      rules: [
        {
          when: { 'near-electric': ['yes', 'unsure'] },
          outcome: {
            level: 'STOP_USE',
            title: '사용을 중지하고 점검을 요청하세요',
            reason:
              '물이 전기제품이나 콘센트 쪽으로 흐르고 있거나 확인이 어렵다고 선택하셨습니다. 감전·누전 위험이 있습니다.',
            costRisk: 'unknown',
            selfChecks: [
              '젖은 손으로 플러그를 만지지 않습니다.',
              '물기가 없고 안전하게 접근할 수 있을 때만 해당 회로의 차단기를 내립니다.',
              '음식은 아이스박스 등으로 옮겨 보관합니다.',
              '바닥의 물이 다른 전기기기로 번지지 않도록 정리합니다.',
              '제조사 고객지원이나 자격을 갖춘 전문가에게 점검을 요청합니다.',
            ],
          },
        },
        {
          when: { where: 'dispenser', 'water-line': 'yes' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '급수 연결 부위 점검을 요청하세요',
            reason:
              '정수·제빙 기능 주변에서 물이 나온다고 선택하셨습니다. 급수 연결부는 사용자가 임의로 분해하기 어려운 부분입니다.',
            costRisk: 'medium',
            selfChecks: [
              '냉장고로 연결되는 물 공급 밸브를 잠급니다.',
              '바닥의 물을 닦고 다시 고이는지 확인합니다.',
              '연결 호스를 분해하거나 직접 교체하려 하지 않습니다.',
              '설치 업체나 제조사 고객지원에 점검을 요청합니다.',
            ],
          },
        },
        {
          when: { door: 'yes' },
          outcome: {
            level: 'MONITOR',
            title: '문 닫힘 상태를 확인한 뒤 다시 보세요',
            reason:
              '문이 오래 열려 있었거나 잘 닫히지 않았다고 선택하셨습니다. 습기가 들어가면 내부에 물이 맺히거나 성에가 녹아 고일 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '문 패킹에 이물질이 있는지 확인하고 부드럽게 닦습니다.',
              '문에 넣은 물건이 걸리지 않는지 확인합니다.',
              '고인 물을 닦고 하루 정도 다시 생기는지 확인합니다.',
              '패킹이 손상됐다면 교체 상담을 받습니다.',
            ],
          },
        },
        {
          when: { where: 'inside-bottom' },
          outcome: {
            level: 'MONITOR',
            title: '내부 배수구 주변을 확인해 보세요',
            reason:
              '냉장실 바닥이나 야채칸 아래에 물이 고인다고 선택하셨습니다. 내부에서 생긴 물이 빠져나가지 못하고 고이는 경우가 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '고인 물을 닦고 음식물 찌꺼기를 정리합니다.',
              '설명서에 사용자 청소 방법이 안내된 경우 그 범위에서만 배수구 주변을 확인합니다.',
              '뾰족한 도구로 내부를 찌르거나 부품을 분해하지 않습니다.',
              '며칠간 다시 고이는지 확인하고 반복되면 점검을 요청합니다.',
            ],
          },
        },
        {
          when: { where: 'outside-floor' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '냉장고 바깥 바닥에 물이 고인다고 선택하셨습니다. 내부에서 배출된 물이 정상적으로 처리되지 않는 상태일 수 있습니다.',
            costRisk: 'medium',
            selfChecks: [
              '바닥의 물을 닦고 어느 방향에서 번지는지 확인합니다.',
              '냉장고를 무리하게 끌어내지 않습니다.',
              '주변 전기제품과 콘센트를 물에서 멀리 둡니다.',
              '모델명과 증상 시작 시점을 정리해 접수합니다.',
            ],
          },
        },
      ],
      fallback: {
        level: 'MONITOR',
        title: '물이 생기는 위치를 좁힌 뒤 판단하세요',
        reason:
          '냉장고 누수는 위치에 따라 필요한 조치가 다릅니다. 안전을 먼저 확인한 뒤 위치를 좁혀 보세요.',
        costRisk: 'unknown',
        selfChecks: [
          '물기를 완전히 닦고 어디에서 다시 생기는지 확인합니다.',
          '문 패킹 상태를 확인합니다.',
          '정수·제빙 기능이 있다면 급수 밸브를 잠가 봅니다.',
          '전기제품 쪽으로 물이 흐르면 즉시 사용을 중지합니다.',
        ],
      },
    },

    /* ── 6. 성에가 심함 ─────────────────────────────────── */
    {
      id: 'frost',
      label: '성에가 심함',
      description: '냉동실이나 냉장실 안쪽에 성에나 얼음이 두껍게 끼는 경우',
      questions: [
        {
          id: 'door-seal',
          text: '문 패킹(고무)이 들뜨거나 찢어진 곳이 있나요?',
          options: [
            { id: 'damaged', label: '들뜨거나 손상된 곳이 있다' },
            { id: 'ok', label: '특별한 이상은 없다' },
            { id: 'unsure', label: '확인하지 못했다' },
          ],
        },
        {
          id: 'door-habit',
          text: '문을 자주 열거나 오래 열어 두는 편인가요?',
          options: [
            { id: 'yes', label: '그런 편이다' },
            { id: 'no', label: '평소와 비슷하다' },
          ],
        },
        {
          id: 'speed',
          text: '성에를 제거한 뒤 얼마나 빨리 다시 생기나요?',
          options: [
            { id: 'fast', label: '며칠 만에 다시 두꺼워진다' },
            { id: 'slow', label: '몇 달에 걸쳐 서서히 생긴다' },
            { id: 'never-removed', label: '제거해 본 적이 없다' },
          ],
        },
        {
          id: 'cooling',
          text: '냉장이나 냉동 성능에도 변화가 있나요?',
          options: [
            { id: 'weak', label: '냉장 쪽이 약해졌다' },
            { id: 'ok', label: '냉각은 정상이다' },
          ],
        },
      ],
      rules: [
        {
          when: { 'door-seal': 'damaged' },
          outcome: {
            level: 'MONITOR',
            title: '문 패킹 상태를 먼저 해결해 보세요',
            reason:
              '문 패킹이 들뜨거나 손상됐다고 선택하셨습니다. 틈으로 습한 공기가 들어오면 성에가 빠르게 생길 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '패킹에 낀 이물질을 부드러운 천으로 닦습니다.',
              '문을 닫았을 때 종이 한 장이 쉽게 빠지는 곳이 있는지 확인합니다.',
              '패킹이 찢어졌거나 변형됐다면 교체 상담을 받습니다.',
              '조치 후 성에가 다시 생기는 속도를 비교합니다.',
            ],
          },
        },
        {
          when: { speed: 'fast', cooling: 'weak' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '성에가 며칠 만에 다시 두꺼워지고 냉각 성능도 약해졌다고 선택하셨습니다. 제상(성에 제거) 기능과 관련될 수 있어 점검이 필요할 수 있습니다.',
            costRisk: 'medium',
            selfChecks: [
              '상하기 쉬운 음식을 먼저 옮깁니다.',
              '뜨거운 물이나 날카로운 도구로 성에를 제거하지 않습니다.',
              '성에가 다시 생기는 주기를 기록합니다.',
              '모델명과 제조연월을 확인해 접수합니다.',
            ],
          },
        },
        {
          when: { speed: 'fast' },
          outcome: {
            level: 'MONITOR',
            title: '사용 습관과 밀폐 상태를 확인해 보세요',
            reason:
              '성에가 며칠 만에 다시 두꺼워진다고 선택하셨습니다. 습한 공기 유입이 반복되는지 먼저 확인해 볼 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '문이 완전히 닫히는지, 걸리는 물건이 없는지 확인합니다.',
              '뜨겁거나 습기가 많은 음식은 식히고 덮어서 넣습니다.',
              '문을 여는 횟수와 시간을 줄여 봅니다.',
              '조치 후에도 같은 속도로 생기면 점검을 고려합니다.',
            ],
          },
        },
        {
          when: { 'door-habit': 'yes' },
          outcome: {
            level: 'SELF_CHECK',
            title: '사용 습관을 조정해 보세요',
            reason:
              '문을 자주 열거나 오래 열어 두는 편이라고 선택하셨습니다. 습한 공기가 자주 들어오면 성에가 잘 생깁니다.',
            costRisk: 'low',
            selfChecks: [
              '문을 여는 시간을 줄이고 필요한 것을 한 번에 꺼냅니다.',
              '음식은 밀폐 용기에 담아 보관합니다.',
              '뜨거운 음식은 식힌 뒤 넣습니다.',
              '조정 후 성에가 생기는 속도를 비교합니다.',
            ],
          },
        },
        {
          when: { speed: 'slow' },
          outcome: {
            level: 'MONITOR',
            title: '정기적인 관리 범위일 수 있습니다',
            reason:
              '성에가 몇 달에 걸쳐 서서히 생긴다고 선택하셨습니다. 모델에 따라 일정량의 성에는 자연스럽게 생길 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '설명서에 사용자 제상(성에 제거) 방법이 있는지 확인합니다.',
              '안내된 방법대로만 진행하고, 날카로운 도구는 사용하지 않습니다.',
              '음식은 미리 옮겨 두고 진행합니다.',
              '제거 후 다시 생기는 속도를 기록합니다.',
            ],
          },
        },
      ],
      fallback: {
        level: 'MONITOR',
        title: '밀폐 상태와 사용 습관을 확인해 보세요',
        reason:
          '성에는 습한 공기 유입과 밀폐 상태의 영향을 크게 받습니다.',
        costRisk: 'unknown',
        selfChecks: [
          '문 패킹 상태를 확인합니다.',
          '문을 여는 횟수와 시간을 줄여 봅니다.',
          '음식을 밀폐해 보관합니다.',
          '성에가 다시 생기는 속도를 기록합니다.',
        ],
      },
    },
  ],
};
