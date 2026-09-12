import type { ProductFlow } from './types';

/**
 * 에어컨 진단 흐름.
 * 냉매 관련 작업은 어떤 결과에서도 사용자에게 안내하지 않는다.
 */
export const aircon: ProductFlow = {
  id: 'aircon',
  label: '에어컨',
  href: '/aircon/',
  symptoms: [
    /* ── 1. 찬바람이 안 나옴 ─────────────────────────────── */
    {
      id: 'no-cold-air',
      label: '찬바람이 안 나옴',
      description: '바람은 나오는데 시원하지 않거나, 바람 자체가 나오지 않는 경우',
      questions: [
        {
          id: 'mode',
          text: '운전 모드가 냉방으로 설정되어 있나요?',
          hint: '송풍, 제습, 자동 모드에서는 찬바람이 나오지 않거나 약하게 느껴질 수 있습니다.',
          options: [
            { id: 'cool', label: '냉방으로 되어 있다' },
            { id: 'other', label: '송풍·제습·자동 등 다른 모드였다' },
            { id: 'unsure', label: '확인하지 못했다' },
          ],
        },
        {
          id: 'settemp',
          text: '설정 온도가 현재 실내 온도보다 낮게 되어 있나요?',
          options: [
            { id: 'lower', label: '더 낮게 설정되어 있다' },
            { id: 'higher', label: '실내 온도와 비슷하거나 더 높다' },
            { id: 'unsure', label: '잘 모르겠다' },
          ],
        },
        {
          id: 'airflow',
          text: '실내기에서 바람은 나오나요?',
          options: [
            { id: 'yes', label: '바람은 나온다' },
            { id: 'weak', label: '바람이 매우 약하다' },
            { id: 'none', label: '바람이 전혀 나오지 않는다' },
          ],
        },
        {
          id: 'outdoor',
          text: '실외기는 돌아가고 있나요?',
          hint: '실외기 근처에서 진동음이 들리거나 팬이 도는지 확인하세요. 실외기에 손을 넣거나 덮개를 열지 마세요.',
          options: [
            { id: 'running', label: '돌아간다' },
            { id: 'stopped', label: '전혀 돌지 않는다' },
            { id: 'unknown', label: '확인할 수 없는 위치다' },
          ],
        },
        {
          id: 'filter',
          text: '실내기 필터를 최근에 청소하셨나요?',
          options: [
            { id: 'recent', label: '최근에 청소했다' },
            { id: 'long', label: '오래됐거나 기억나지 않는다' },
            { id: 'cleaned-now', label: '방금 청소했더니 나아졌다' },
          ],
        },
      ],
      rules: [
        {
          when: { filter: 'cleaned-now' },
          outcome: {
            level: 'SELF_CHECK',
            title: '관리 범위에서 개선된 상태로 보입니다',
            reason:
              '필터 청소 후 나아졌다고 선택하셨습니다. 필터가 막히면 바람이 약해지고 냉방 성능이 떨어집니다.',
            costRisk: 'low',
            selfChecks: [
              '설명서가 안내하는 주기에 맞춰 필터를 정기적으로 청소합니다.',
              '필터를 완전히 말린 뒤 장착합니다.',
              '실내기 흡입구와 토출구 주변을 가리는 물건이 없는지 확인합니다.',
              '같은 증상이 짧은 주기로 반복되면 기록해 둡니다.',
            ],
          },
        },
        {
          when: { mode: ['other', 'unsure'] },
          outcome: {
            level: 'SELF_CHECK',
            title: '운전 모드와 설정 온도를 먼저 확인하세요',
            reason:
              '운전 모드가 냉방이 아니거나 확인하지 못했다고 선택하셨습니다. 송풍이나 제습에서는 찬바람이 나오지 않을 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '리모컨에서 운전 모드를 냉방으로 바꿉니다.',
              '설정 온도를 현재 실내 온도보다 낮게 맞춥니다.',
              '바람 세기를 강으로 두고 몇 분간 상태를 확인합니다.',
              '변경 후에도 시원해지지 않으면 다시 진단해 봅니다.',
            ],
          },
        },
        {
          when: { settemp: ['higher', 'unsure'], mode: 'cool' },
          outcome: {
            level: 'SELF_CHECK',
            title: '설정 온도를 조정해 보세요',
            reason:
              '설정 온도가 실내 온도와 비슷하거나 더 높다고 선택하셨습니다. 이 경우 제품은 냉방을 시작하지 않거나 곧 멈춥니다.',
            costRisk: 'low',
            selfChecks: [
              '설정 온도를 실내 온도보다 낮게 조정합니다.',
              '희망 온도에 도달하면 자동으로 멈추는 기능이 있는지 설명서에서 확인합니다.',
              '조정 후 10분 정도 운전하며 바람 온도가 달라지는지 확인합니다.',
              '변화가 없으면 실외기 동작 여부를 확인합니다.',
            ],
          },
        },
        {
          when: { airflow: 'none' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '실내기에서 바람이 전혀 나오지 않는다고 선택하셨습니다. 송풍 계통이나 제어와 관련될 수 있어 사용자가 확인하기 어렵습니다.',
            costRisk: 'medium',
            selfChecks: [
              '리모컨 전지를 교체하고 전원을 다시 넣어 봅니다.',
              '실내기 흡입구가 가려져 있지 않은지 확인합니다.',
              '표시되는 코드가 있으면 그대로 적어 둡니다.',
              '실내기와 실외기 모델명을 확인해 접수 시 전달합니다.',
            ],
          },
        },
        {
          when: { outdoor: 'stopped', mode: 'cool', settemp: 'lower' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '냉방 설정이 맞는데도 실외기가 전혀 돌지 않는다고 선택하셨습니다. 실외기는 사용자가 직접 확인하거나 손대면 안 되는 영역입니다.',
            costRisk: 'high',
            selfChecks: [
              '실외기 주변에 짐이나 커버가 통풍을 막고 있는지 눈으로만 확인합니다.',
              '실외기 덮개를 열거나 내부에 손을 넣지 않습니다.',
              '실외기 전용 차단기가 내려가 있는지 확인합니다.',
              '접수 시 "냉방 설정에서 실외기가 돌지 않는다"는 점을 전달합니다.',
            ],
          },
        },
        {
          when: { filter: 'long', airflow: 'weak' },
          outcome: {
            level: 'MONITOR',
            title: '필터를 청소한 뒤 다시 확인해 보세요',
            reason:
              '바람이 약하고 필터 청소가 오래됐다고 선택하셨습니다. 필터 막힘은 바람 세기와 냉방 성능에 바로 영향을 줍니다.',
            costRisk: 'low',
            selfChecks: [
              '전원을 끄고 설명서가 안내하는 방법으로 필터를 분리해 청소합니다.',
              '필터를 완전히 말린 뒤 다시 장착합니다.',
              '실내기 주변 공기 흐름을 막는 물건을 치웁니다.',
              '청소 후 30분 정도 운전하며 개선 여부를 확인합니다.',
            ],
          },
        },
        {
          when: { outdoor: 'running', airflow: 'yes' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '점검을 받아 보는 편이 좋습니다',
            reason:
              '실외기도 돌고 바람도 나오는데 시원하지 않다고 선택하셨습니다. 사용 설정과 관리 범위를 벗어난 점검이 필요할 수 있습니다.',
            costRisk: 'unknown',
            costNote:
              '이 증상은 원인 범위가 넓어 점검 전에는 비용을 가늠하기 어렵습니다. 점검 결과를 받은 뒤 판단하세요.',
            selfChecks: [
              '필터 청소 상태와 실내기 주변 공기 흐름을 확인합니다.',
              '실외기 주변에 통풍을 막는 물건이 있는지 확인합니다.',
              '토출구 바람이 실내 공기보다 차가운지 손으로 비교해 봅니다.',
              '언제부터 성능이 떨어졌는지 기록해 접수 시 전달합니다.',
            ],
          },
        },
      ],
      fallback: {
        level: 'MONITOR',
        title: '설정과 관리 항목을 먼저 확인해 보세요',
        reason:
          '선택하신 응답만으로는 설정 문제와 제품 문제를 구분하기 어렵습니다.',
        costRisk: 'unknown',
        selfChecks: [
          '운전 모드와 설정 온도를 확인합니다.',
          '필터를 청소하고 완전히 말린 뒤 장착합니다.',
          '실내기와 실외기 주변 통풍을 확인합니다.',
          '조치 후에도 같은 증상이면 기록을 남깁니다.',
        ],
      },
    },

    /* ── 2. 냉방이 약함 ─────────────────────────────────── */
    {
      id: 'weak-cooling',
      label: '냉방이 약함',
      description: '찬바람은 나오지만 예전만큼 시원해지지 않는 경우',
      questions: [
        {
          id: 'change',
          text: '냉방 성능이 어떻게 달라졌나요?',
          options: [
            { id: 'gradual', label: '여러 해에 걸쳐 서서히 약해졌다' },
            { id: 'recent', label: '최근 들어 갑자기 약해졌다' },
            { id: 'always', label: '설치 때부터 계속 약했다' },
          ],
        },
        {
          id: 'filter',
          text: '필터 청소 상태는 어떤가요?',
          options: [
            { id: 'recent', label: '최근에 청소했다' },
            { id: 'long', label: '오래됐다' },
            { id: 'unsure', label: '확인하지 못했다' },
          ],
        },
        {
          id: 'outdoor-env',
          text: '실외기 주변 상태는 어떤가요?',
          options: [
            { id: 'blocked', label: '짐·화분·커버 등으로 막혀 있다' },
            { id: 'hot', label: '직사광선이 강하게 닿거나 매우 좁은 공간에 있다' },
            { id: 'clear', label: '주변이 트여 있다' },
            { id: 'unknown', label: '확인할 수 없는 위치다' },
          ],
        },
        {
          id: 'room',
          text: '사용 환경에 해당하는 것이 있나요?',
          options: [
            { id: 'open', label: '문이나 창이 열려 있거나 공간이 매우 넓다' },
            { id: 'sun', label: '햇볕이 강하게 들어온다' },
            { id: 'normal', label: '평소와 같은 환경이다' },
          ],
        },
      ],
      rules: [
        {
          when: { 'outdoor-env': 'blocked' },
          outcome: {
            level: 'SELF_CHECK',
            title: '실외기 주변 통풍을 먼저 확보하세요',
            reason:
              '실외기 주변이 막혀 있다고 선택하셨습니다. 실외기는 열을 밖으로 내보내는 역할을 하므로 통풍이 막히면 냉방 성능이 떨어집니다.',
            costRisk: 'low',
            selfChecks: [
              '실외기 앞과 옆을 막고 있는 짐이나 화분을 치웁니다.',
              '통풍을 막는 커버를 씌워 둔 상태라면 벗깁니다.',
              '실외기 덮개를 열거나 내부를 청소하려 하지 않습니다.',
              '정리 후 30분 이상 운전하며 개선 여부를 확인합니다.',
            ],
          },
        },
        {
          when: { filter: ['long', 'unsure'] },
          outcome: {
            level: 'MONITOR',
            title: '필터 청소 후 다시 확인해 보세요',
            reason:
              '필터 청소가 오래됐거나 확인하지 못했다고 선택하셨습니다. 필터 막힘은 냉방이 약해지는 가장 흔한 관리 항목입니다.',
            costRisk: 'low',
            selfChecks: [
              '전원을 끄고 설명서가 안내하는 방법으로 필터를 청소합니다.',
              '필터를 완전히 말린 뒤 장착합니다.',
              '실내기 흡입구와 토출구 주변 물건을 치웁니다.',
              '청소 후 며칠간 체감 온도가 달라지는지 확인합니다.',
            ],
          },
        },
        {
          when: { room: ['open', 'sun'] },
          outcome: {
            level: 'SELF_CHECK',
            title: '사용 환경 조건을 먼저 조정해 보세요',
            reason:
              '문이나 창이 열려 있거나 햇볕이 강하게 들어온다고 선택하셨습니다. 같은 성능이라도 환경에 따라 체감이 크게 달라집니다.',
            costRisk: 'low',
            selfChecks: [
              '문과 창을 닫고 외부 공기 유입을 줄입니다.',
              '블라인드나 커튼으로 직사광선을 가립니다.',
              '선풍기나 서큘레이터로 공기를 순환시켜 봅니다.',
              '조건을 맞춘 뒤에도 체감이 같은지 확인합니다.',
            ],
          },
        },
        {
          when: { change: 'always' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '설치 상태 확인을 요청해 보세요',
            reason:
              '설치 때부터 계속 냉방이 약했다고 선택하셨습니다. 제품 용량이 공간에 맞지 않거나 설치 조건과 관련될 수 있습니다.',
            costRisk: 'unknown',
            costNote:
              '설치 관련 사항은 제품 수리와 처리 주체가 다를 수 있습니다. 설치 업체와 제조사 고객지원 중 어디에 문의해야 하는지 먼저 확인하세요.',
            selfChecks: [
              '사용 공간 면적과 제품 권장 사용 면적을 설명서에서 비교합니다.',
              '설치 시 받은 서류나 보증서를 확인합니다.',
              '실외기와 실내기 사이 배관 설치 상태를 눈으로만 확인합니다.',
              '설치 업체에 설치 조건 확인을 요청합니다.',
            ],
          },
        },
        {
          when: { change: 'recent', filter: 'recent' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '필터 관리를 했는데도 최근 들어 갑자기 냉방이 약해졌다고 선택하셨습니다. 사용자가 확인할 수 있는 범위를 벗어난 점검이 필요할 수 있습니다.',
            costRisk: 'unknown',
            costNote:
              '냉방 성능 저하는 원인에 따라 비용 차이가 큽니다. 점검 후 어떤 작업이 필요한지 설명을 듣고 판단하세요.',
            selfChecks: [
              '언제부터 달라졌는지, 특정 시간대에 더 심한지 기록합니다.',
              '실외기 주변 통풍 상태를 확인합니다.',
              '표시되는 코드가 있으면 적어 둡니다.',
              '모델명과 설치 연도를 확인합니다.',
            ],
          },
        },
        {
          when: { change: 'gradual' },
          outcome: {
            level: 'MONITOR',
            title: '관리 항목을 정리한 뒤 다시 판단하세요',
            reason:
              '여러 해에 걸쳐 서서히 약해졌다고 선택하셨습니다. 관리 상태와 사용 환경이 함께 영향을 주었을 수 있습니다.',
            costRisk: 'unknown',
            selfChecks: [
              '필터와 실내기 흡입구를 청소합니다.',
              '실외기 주변 통풍을 확보합니다.',
              '같은 조건에서 몇 시간 운전하며 체감을 비교합니다.',
              '사용 기간이 길다면 수리와 교체 비교도 함께 고려합니다.',
            ],
          },
        },
      ],
      fallback: {
        level: 'MONITOR',
        title: '관리와 환경 조건부터 확인해 보세요',
        reason:
          '냉방이 약해지는 원인은 관리, 설치, 사용 환경이 함께 작용하는 경우가 많습니다.',
        costRisk: 'unknown',
        selfChecks: [
          '필터를 청소합니다.',
          '실외기 주변 통풍을 확인합니다.',
          '문과 창을 닫고 비교합니다.',
          '변화가 없으면 발생 시점을 기록합니다.',
        ],
      },
    },

    /* ── 3. 실외기가 동작하지 않음 ───────────────────────── */
    {
      id: 'outdoor-unit',
      label: '실외기가 동작하지 않음',
      description: '실내기는 켜지는데 실외기가 돌지 않는 경우',
      questions: [
        {
          id: 'smell',
          text: '실외기에서 타는 냄새나 연기, 스파크가 있었나요?',
          options: [
            { id: 'yes', label: '있었다' },
            { id: 'no', label: '없었다' },
          ],
        },
        {
          id: 'breaker',
          text: '실외기 또는 에어컨 전용 차단기 상태는 어떤가요?',
          options: [
            { id: 'tripped', label: '내려가 있다' },
            { id: 'repeat', label: '올려도 다시 내려간다' },
            { id: 'on', label: '올라가 있다' },
            { id: 'unknown', label: '어디인지 모르겠다' },
          ],
        },
        {
          id: 'wait',
          text: '에어컨을 끄고 다시 켠 뒤 몇 분 기다려 보셨나요?',
          hint: '제품에 따라 재가동까지 몇 분간 대기하는 보호 동작이 있습니다.',
          options: [
            { id: 'waited-ok', label: '기다리니 동작했다' },
            { id: 'waited-no', label: '기다려도 동작하지 않는다' },
            { id: 'nottried', label: '해보지 않았다' },
          ],
        },
        {
          id: 'settings',
          text: '실내기 설정은 어떻게 되어 있나요?',
          options: [
            { id: 'cool-low', label: '냉방이고 설정 온도도 낮게 되어 있다' },
            { id: 'fan', label: '송풍 등 다른 모드다' },
            { id: 'unsure', label: '확인하지 못했다' },
          ],
        },
      ],
      rules: [
        {
          when: { smell: 'yes' },
          outcome: {
            level: 'STOP_USE',
            title: '사용을 중지하고 점검을 요청하세요',
            reason:
              '실외기에서 타는 냄새나 연기, 스파크가 있었다고 선택하셨습니다. 화재와 직접 연결될 수 있는 신호입니다.',
            costRisk: 'unknown',
            selfChecks: [
              '에어컨 사용을 즉시 멈춥니다.',
              '안전하게 접근할 수 있다면 에어컨 전용 차단기를 내립니다.',
              '실외기에 가까이 가거나 덮개를 열지 않습니다.',
              '연기나 불꽃이 계속되면 119에 신고합니다.',
              '제조사 고객지원 또는 자격을 갖춘 전문가에게 점검을 요청합니다.',
            ],
          },
        },
        {
          when: { breaker: 'repeat' },
          outcome: {
            level: 'STOP_USE',
            title: '사용을 중지하고 점검을 요청하세요',
            reason:
              '차단기를 올려도 다시 내려간다고 선택하셨습니다. 이상 전류가 반복 감지되는 상태일 수 있어 계속 올리면 안 됩니다.',
            costRisk: 'unknown',
            selfChecks: [
              '차단기를 반복해서 올리지 않습니다.',
              '에어컨 사용을 중지합니다.',
              '실외기와 배선 주변에 물기나 탄 자국이 있는지 눈으로만 확인합니다.',
              '제조사 고객지원 또는 자격을 갖춘 전기 전문가에게 점검을 요청합니다.',
            ],
          },
        },
        {
          when: { wait: 'waited-ok' },
          outcome: {
            level: 'MONITOR',
            title: '정상 동작으로 돌아온 상태입니다',
            reason:
              '잠시 기다린 뒤 실외기가 동작했다고 선택하셨습니다. 제품에 따라 재가동 보호 동작으로 몇 분간 멈춰 있을 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '에어컨을 끈 직후 바로 다시 켜지 않고 몇 분 기다립니다.',
              '설정 온도를 너무 자주 바꾸지 않습니다.',
              '같은 증상이 자주 반복되는지 기록합니다.',
              '반복 주기가 짧아지면 점검을 고려합니다.',
            ],
          },
        },
        {
          when: { breaker: 'tripped' },
          outcome: {
            level: 'MONITOR',
            title: '차단기 상태를 확인한 뒤 다시 보세요',
            reason:
              '에어컨 전용 차단기가 내려가 있다고 선택하셨습니다. 차단기가 내려가 있으면 실외기에 전원이 공급되지 않습니다.',
            costRisk: 'low',
            selfChecks: [
              '주변에 물기나 탄 자국이 없는지 확인한 뒤 차단기를 한 번만 올립니다.',
              '올린 뒤 다시 내려가면 더 이상 올리지 않고 점검을 요청합니다.',
              '정상 동작하면 같은 증상이 재발하는지 확인합니다.',
              '차단기 위치를 모르면 무리하게 찾지 말고 문의합니다.',
            ],
          },
        },
        {
          when: { settings: ['fan', 'unsure'] },
          outcome: {
            level: 'SELF_CHECK',
            title: '운전 모드를 먼저 확인하세요',
            reason:
              '운전 모드가 냉방이 아니거나 확인하지 못했다고 선택하셨습니다. 송풍 모드에서는 실외기가 돌지 않는 것이 정상입니다.',
            costRisk: 'low',
            selfChecks: [
              '리모컨에서 운전 모드를 냉방으로 바꿉니다.',
              '설정 온도를 실내 온도보다 낮게 맞춥니다.',
              '몇 분 기다린 뒤 실외기 동작을 확인합니다.',
              '그래도 동작하지 않으면 다시 진단해 봅니다.',
            ],
          },
        },
        {
          when: { wait: 'waited-no', settings: 'cool-low' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '냉방 설정이 맞고 잠시 기다린 뒤에도 실외기가 동작하지 않는다고 선택하셨습니다. 실외기는 사용자가 확인하거나 손대면 안 되는 영역입니다.',
            costRisk: 'high',
            selfChecks: [
              '실외기 주변 통풍 상태만 눈으로 확인합니다.',
              '실외기 덮개를 열거나 내부에 손을 넣지 않습니다.',
              '표시되는 코드가 있으면 그대로 적어 둡니다.',
              '실내기·실외기 모델명과 설치 연도를 확인해 접수합니다.',
            ],
          },
        },
      ],
      fallback: {
        level: 'MONITOR',
        title: '전원과 설정을 확인한 뒤 다시 보세요',
        reason:
          '실외기가 멈춰 보이는 상황은 설정, 전원, 보호 동작 등 여러 이유로 나타날 수 있습니다.',
        costRisk: 'unknown',
        selfChecks: [
          '운전 모드와 설정 온도를 확인합니다.',
          '에어컨 전용 차단기 상태를 확인합니다.',
          '끄고 몇 분 기다린 뒤 다시 켜 봅니다.',
          '실외기에 직접 손대지 않습니다.',
        ],
      },
    },

    /* ── 4. 물이 떨어짐 ─────────────────────────────────── */
    {
      id: 'water-drip',
      label: '물이 떨어짐',
      description: '실내기에서 물이 새거나 주변이 젖는 경우',
      questions: [
        {
          id: 'near-electric',
          text: '떨어지는 물이 콘센트나 전기제품 쪽으로 흐르고 있나요?',
          options: [
            { id: 'yes', label: '그렇다' },
            { id: 'no', label: '아니다' },
            { id: 'unsure', label: '확인하기 어렵다' },
          ],
        },
        {
          id: 'where',
          text: '물은 어디에서 나오나요?',
          options: [
            { id: 'indoor-body', label: '실내기 본체 아래쪽이나 옆면' },
            { id: 'vent', label: '바람이 나오는 토출구' },
            { id: 'drain-pipe', label: '배수 호스(드레인) 쪽' },
            { id: 'unsure', label: '확실하지 않다' },
          ],
        },
        {
          id: 'humid',
          text: '실내 습도가 매우 높거나, 설정 온도를 아주 낮게 두고 오래 사용하셨나요?',
          options: [
            { id: 'yes', label: '그렇다' },
            { id: 'no', label: '평소와 비슷하다' },
          ],
        },
        {
          id: 'filter',
          text: '필터 청소 상태는 어떤가요?',
          options: [
            { id: 'recent', label: '최근에 청소했다' },
            { id: 'long', label: '오래됐다' },
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
              '떨어지는 물이 전기제품이나 콘센트 쪽으로 흐르고 있거나 확인이 어렵다고 선택하셨습니다. 감전·누전 위험이 있는 상황입니다.',
            costRisk: 'unknown',
            selfChecks: [
              '에어컨 사용을 즉시 멈춥니다.',
              '물기가 없고 안전하게 접근할 수 있을 때만 해당 회로의 차단기를 내립니다.',
              '젖은 콘센트에 꽂힌 기기를 무리하게 뽑지 않습니다.',
              '물이 번지는 범위를 정리하고 점검을 요청합니다.',
            ],
          },
        },
        {
          when: { where: 'vent', filter: 'long' },
          outcome: {
            level: 'MONITOR',
            title: '필터 청소 후 다시 확인해 보세요',
            reason:
              '토출구에서 물이 나오고 필터 청소가 오래됐다고 선택하셨습니다. 필터가 막히면 결로가 생겨 물방울이 맺힐 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '전원을 끄고 설명서가 안내하는 방법으로 필터를 청소합니다.',
              '필터를 완전히 말린 뒤 장착합니다.',
              '바람 방향을 아래로 고정하지 말고 넓게 퍼지도록 설정합니다.',
              '청소 후에도 물이 떨어지면 사용을 멈추고 점검을 요청합니다.',
            ],
          },
        },
        {
          when: { humid: 'yes', where: 'vent' },
          outcome: {
            level: 'MONITOR',
            title: '운전 조건을 조정해 보세요',
            reason:
              '습도가 높거나 설정 온도를 아주 낮게 두고 오래 사용했다고 선택하셨습니다. 이런 조건에서는 토출구에 결로가 생길 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '설정 온도를 조금 올리고 바람 세기를 높여 봅니다.',
              '바람 방향을 한 곳에 고정하지 않습니다.',
              '제습 기능이 있다면 함께 사용해 봅니다.',
              '조정 후에도 같은 증상이면 점검을 고려합니다.',
            ],
          },
        },
        {
          when: { where: 'drain-pipe' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '배수 경로 점검이 필요할 수 있습니다',
            reason:
              '배수 호스 쪽에서 물이 나온다고 선택하셨습니다. 배수 경로가 막히거나 기울기가 맞지 않으면 물이 역류할 수 있고, 사용자가 조정하기 어려운 부분입니다.',
            costRisk: 'medium',
            selfChecks: [
              '에어컨 사용을 잠시 멈추고 물받이나 수건으로 바닥을 보호합니다.',
              '배수 호스 끝이 꺾이거나 눌려 있는지 눈으로만 확인합니다.',
              '호스를 분해하거나 막힌 곳을 뚫으려 하지 않습니다.',
              '설치 업체 또는 제조사 고객지원에 배수 경로 점검을 요청합니다.',
            ],
          },
        },
        {
          when: { where: 'indoor-body' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '사용을 멈추고 점검을 받으세요',
            reason:
              '실내기 본체에서 물이 흘러나온다고 선택하셨습니다. 내부 물받이나 배수 경로와 관련될 수 있어 계속 사용하면 주변 피해가 커질 수 있습니다.',
            costRisk: 'medium',
            selfChecks: [
              '에어컨 사용을 중단합니다.',
              '아래에 있는 가구나 전기제품을 옮깁니다.',
              '물이 나오는 위치를 사진으로 남깁니다.',
              '실내기를 분해하지 않고 점검을 요청합니다.',
            ],
          },
        },
      ],
      fallback: {
        level: 'MONITOR',
        title: '물이 나오는 위치를 좁힌 뒤 판단하세요',
        reason:
          '에어컨 누수는 결로, 배수, 설치 기울기 등 원인이 다양해 위치 확인이 먼저입니다.',
        costRisk: 'unknown',
        selfChecks: [
          '바닥과 주변을 닦고 어디에서 물이 다시 생기는지 확인합니다.',
          '필터를 청소합니다.',
          '설정 온도를 조금 올려 비교합니다.',
          '전기제품 쪽으로 물이 흐르면 즉시 사용을 중지합니다.',
        ],
      },
    },

    /* ── 5. 이상 소음 ───────────────────────────────────── */
    {
      id: 'noise',
      label: '이상 소음이 남',
      description: '실내기나 실외기에서 평소와 다른 소리가 나는 경우',
      questions: [
        {
          id: 'where',
          text: '소리는 주로 어디에서 나나요?',
          options: [
            { id: 'indoor', label: '실내기' },
            { id: 'outdoor', label: '실외기' },
            { id: 'both', label: '양쪽 다' },
          ],
        },
        {
          id: 'type',
          text: '어떤 소리에 가장 가깝나요?',
          options: [
            { id: 'grinding', label: '금속이 긁히거나 무언가 걸리는 소리' },
            { id: 'rattle', label: '덜덜 떨리거나 부딪히는 소리' },
            { id: 'water', label: '물 흐르는 소리나 ‘똑똑’ 소리' },
            { id: 'hum', label: '평소보다 큰 모터 소리' },
          ],
        },
        {
          id: 'burning',
          text: '소리와 함께 타는 냄새가 나나요?',
          options: [
            { id: 'yes', label: '난다' },
            { id: 'no', label: '나지 않는다' },
          ],
        },
        {
          id: 'when',
          text: '언제부터 시작됐나요?',
          options: [
            { id: 'sudden', label: '갑자기 시작됐다' },
            { id: 'gradual', label: '점점 심해졌다' },
            { id: 'season', label: '이번 시즌 처음 켰을 때부터' },
          ],
        },
      ],
      rules: [
        {
          when: { burning: 'yes' },
          outcome: {
            level: 'STOP_USE',
            title: '사용을 중지하고 점검을 요청하세요',
            reason:
              '이상 소음과 함께 타는 냄새가 난다고 선택하셨습니다. 안전과 직접 관련된 신호입니다.',
            costRisk: 'unknown',
            selfChecks: [
              '에어컨 사용을 즉시 멈춥니다.',
              '안전하게 접근할 수 있다면 에어컨 전용 차단기를 내립니다.',
              '실내기나 실외기를 열지 않습니다.',
              '제조사 고객지원 또는 자격을 갖춘 전문가에게 점검을 요청합니다.',
            ],
          },
        },
        {
          when: { type: 'grinding' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '금속이 긁히거나 무언가 걸리는 소리가 난다고 선택하셨습니다. 계속 사용하면 손상이 커질 수 있습니다.',
            costRisk: 'high',
            selfChecks: [
              '사용을 줄이고 점검 전까지 장시간 운전하지 않습니다.',
              '실외기 주변에 날아든 이물질이 있는지 눈으로만 확인합니다.',
              '실내기나 실외기를 열지 않습니다.',
              '소리가 나는 시점과 위치를 기록해 접수 시 전달합니다.',
            ],
          },
        },
        {
          when: { type: 'water' },
          outcome: {
            level: 'MONITOR',
            title: '정상 동작음일 수도 있습니다',
            reason:
              '물 흐르는 소리나 ‘똑똑’ 소리라고 선택하셨습니다. 냉방 중 발생하는 응축수나 내부 순환음은 정상 동작에서도 들릴 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '소리 크기가 이전과 크게 달라졌는지 비교합니다.',
              '물이 실제로 떨어지는지 함께 확인합니다.',
              '필터를 청소한 뒤 소리가 달라지는지 확인합니다.',
              '물이 새는 증상이 있으면 누수 항목으로 다시 진단합니다.',
            ],
          },
        },
        {
          when: { type: 'rattle', where: 'indoor' },
          outcome: {
            level: 'MONITOR',
            title: '진동이 생기는 부분을 확인해 보세요',
            reason:
              '실내기에서 덜덜 떨리는 소리가 난다고 선택하셨습니다. 커버나 필터가 제대로 닫히지 않아 진동음이 생기는 경우가 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '전원을 끈 뒤 필터와 앞면 커버가 제자리에 닫혀 있는지 확인합니다.',
              '필터를 청소하고 완전히 말린 뒤 장착합니다.',
              '실내기 주변에 함께 진동하는 물건이 없는지 확인합니다.',
              '조치 후에도 같은 소리가 나면 점검을 고려합니다.',
            ],
          },
        },
        {
          when: { where: ['outdoor', 'both'], when: 'gradual' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '점검을 받아 보는 편이 좋습니다',
            reason:
              '실외기 쪽 소음이 점점 심해졌다고 선택하셨습니다. 사용 기간에 따른 마모와 관련될 수 있어 점검이 필요할 수 있습니다.',
            costRisk: 'high',
            selfChecks: [
              '실외기 주변 통풍과 고정 상태를 눈으로만 확인합니다.',
              '실외기 덮개를 열거나 손을 넣지 않습니다.',
              '언제부터 어떻게 심해졌는지 기록합니다.',
              '설치 연도가 오래됐다면 수리와 교체 비교도 함께 고려합니다.',
            ],
          },
        },
        {
          when: { when: 'season' },
          outcome: {
            level: 'MONITOR',
            title: '시즌 첫 가동 상태를 확인해 보세요',
            reason:
              '이번 시즌 처음 켰을 때부터 소리가 났다고 선택하셨습니다. 장기간 사용하지 않은 뒤에는 먼지나 이물질로 소음이 생길 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '필터를 청소하고 완전히 말린 뒤 장착합니다.',
              '실외기 주변에 낙엽이나 이물질이 쌓였는지 눈으로 확인합니다.',
              '몇 시간 운전 후에도 소리가 계속되는지 확인합니다.',
              '소리가 커지거나 냄새가 나면 즉시 사용을 중지합니다.',
            ],
          },
        },
      ],
      fallback: {
        level: 'MONITOR',
        title: '소리의 종류와 위치를 기록해 보세요',
        reason:
          '소음은 종류와 위치에 따라 필요한 조치가 달라집니다. 정상 동작음과 구분되는지 먼저 확인해 보세요.',
        costRisk: 'unknown',
        selfChecks: [
          '언제, 어느 단계에서 소리가 나는지 기록합니다.',
          '필터와 커버 장착 상태를 확인합니다.',
          '실외기 주변 이물질을 눈으로 확인합니다.',
          '냄새나 진동이 함께 있으면 사용을 중지합니다.',
        ],
      },
    },

    /* ── 6. 켜졌다 꺼짐 ─────────────────────────────────── */
    {
      id: 'cycling',
      label: '켜졌다 꺼짐',
      description: '운전 중 저절로 멈추거나 짧은 간격으로 켜졌다 꺼지는 경우',
      questions: [
        {
          id: 'breaker',
          text: '멈출 때 차단기가 함께 내려가나요?',
          options: [
            { id: 'yes', label: '그렇다' },
            { id: 'no', label: '아니다' },
            { id: 'unsure', label: '확인하지 못했다' },
          ],
        },
        {
          id: 'reach-temp',
          text: '설정 온도에 도달한 뒤에 멈추나요?',
          options: [
            { id: 'yes', label: '시원해진 뒤에 멈춘다' },
            { id: 'no', label: '시원해지기 전에 멈춘다' },
            { id: 'unsure', label: '잘 모르겠다' },
          ],
        },
        {
          id: 'timer',
          text: '예약(타이머)이나 절전·자동 모드가 설정되어 있나요?',
          options: [
            { id: 'yes', label: '설정되어 있었다' },
            { id: 'no', label: '설정하지 않았다' },
            { id: 'unsure', label: '확인하지 못했다' },
          ],
        },
        {
          id: 'code',
          text: '멈출 때 표시창에 코드가 나타나나요?',
          options: [
            { id: 'yes', label: '코드가 표시된다' },
            { id: 'no', label: '표시되지 않는다' },
          ],
        },
      ],
      rules: [
        {
          when: { breaker: 'yes' },
          outcome: {
            level: 'STOP_USE',
            title: '사용을 중지하고 점검을 요청하세요',
            reason:
              '멈출 때 차단기가 함께 내려간다고 선택하셨습니다. 이상 전류가 반복 감지되는 상황일 수 있습니다.',
            costRisk: 'unknown',
            selfChecks: [
              '에어컨 사용을 중지합니다.',
              '차단기를 반복해서 올리지 않습니다.',
              '전원선과 콘센트 주변 상태를 눈으로만 확인합니다.',
              '제조사 고객지원 또는 자격을 갖춘 전기 전문가에게 점검을 요청합니다.',
            ],
          },
        },
        {
          when: { timer: ['yes', 'unsure'] },
          outcome: {
            level: 'SELF_CHECK',
            title: '설정부터 확인하세요',
            reason:
              '예약이나 절전·자동 모드가 설정되어 있거나 확인하지 못했다고 선택하셨습니다. 이 경우 제품이 스스로 멈추는 것이 정상 동작일 수 있습니다.',
            costRisk: 'low',
            selfChecks: [
              '리모컨에서 예약(타이머) 설정을 해제합니다.',
              '절전·자동·쾌적 모드가 켜져 있는지 확인합니다.',
              '냉방 모드로 두고 설정 온도를 낮춰 다시 확인합니다.',
              '설정을 정리한 뒤에도 같은 증상이면 다시 진단해 봅니다.',
            ],
          },
        },
        {
          when: { 'reach-temp': 'yes' },
          outcome: {
            level: 'MONITOR',
            title: '정상 동작 범위일 수 있습니다',
            reason:
              '설정 온도에 도달한 뒤 멈춘다고 선택하셨습니다. 희망 온도에 도달하면 압축기가 멈췄다가 다시 동작하는 것은 일반적인 동작입니다.',
            costRisk: 'low',
            selfChecks: [
              '설정 온도를 1~2도 조정해 멈추는 주기가 달라지는지 확인합니다.',
              '바람 세기를 바꿔 체감을 비교합니다.',
              '멈춰 있는 동안에도 송풍이 유지되는지 확인합니다.',
              '주기가 지나치게 짧다면 기록해 둡니다.',
            ],
          },
        },
        {
          when: { code: 'yes' },
          outcome: {
            level: 'MONITOR',
            title: '표시되는 코드를 먼저 확인하세요',
            reason:
              '멈출 때 코드가 표시된다고 선택하셨습니다. 코드는 원인을 좁히는 가장 직접적인 단서입니다.',
            costRisk: 'unknown',
            selfChecks: [
              '표시되는 코드를 그대로 적어 둡니다.',
              '설명서나 제조사 고객지원에서 코드의 의미를 확인합니다.',
              '설명서가 사용자 조치로 안내한 범위만 따릅니다.',
              '같은 코드가 반복되면 접수 시 코드를 함께 전달합니다.',
            ],
          },
        },
        {
          when: { 'reach-temp': 'no', timer: 'no' },
          outcome: {
            level: 'SERVICE_RECOMMENDED',
            title: '서비스 점검을 권합니다',
            reason:
              '예약 설정이 없는데도 시원해지기 전에 멈춘다고 선택하셨습니다. 보호 동작이나 제어와 관련될 수 있어 점검이 필요합니다.',
            costRisk: 'medium',
            selfChecks: [
              '멈추기까지 걸리는 시간을 몇 차례 측정해 기록합니다.',
              '실외기 주변 통풍 상태를 확인합니다.',
              '필터를 청소한 뒤에도 같은지 확인합니다.',
              '모델명과 설치 연도를 확인해 접수합니다.',
            ],
          },
        },
      ],
      fallback: {
        level: 'MONITOR',
        title: '설정과 동작 주기를 확인해 보세요',
        reason:
          '켜졌다 꺼지는 동작은 정상 제어와 이상 동작이 비슷하게 보일 수 있어 조건 확인이 필요합니다.',
        costRisk: 'unknown',
        selfChecks: [
          '예약과 절전 모드 설정을 확인합니다.',
          '설정 온도를 조정해 비교합니다.',
          '멈추는 주기를 기록합니다.',
          '코드가 표시되면 그대로 적어 둡니다.',
        ],
      },
    },
  ],
};
