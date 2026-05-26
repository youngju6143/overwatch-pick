// AUTO-GENERATED from owperks.com/ko — community preference snapshot
// Each hero has 4 perks: 2 minor (소형) + 2 major (주요).
// `preference` is community pick rate in % at scrape time.

export type PerkTier = "minor" | "major";

export interface Perk {
  tier: PerkTier;
  nameKo: string;
  nameEn?: string;
  preference: number;
  descriptionKo: string;
}

export const HERO_PERKS: Record<string, Perk[]> = {
  "D.Va": [
    { tier: "minor", nameKo: "토끼 깡총", preference: 18, descriptionKo: "비상 탈출 후 일시적으로 75의 추가 생명력을 얻고, 메카 호출 피해 반경이 50% 증가합니다." },
    { tier: "minor", nameKo: "확장 부스터", preference: 82, descriptionKo: "부스터가 적에게 적중하면 40% 증가한 피해를 주며 지속 시간이 0.5초 연장됩니다." },
    { tier: "major", nameKo: "보호막 시스템", preference: 53, descriptionKo: "생명력 150을 보호막으로 전환합니다. 방어 매트릭스가 흡수한 피해의 25%만큼 보호막을 회복합니다." },
    { tier: "major", nameKo: "집중 융합", preference: 47, descriptionKo: "R 키를 누르면 3초 동안 융합포의 집탄율이 75% 감소합니다." },
  ],
  "Domina": [
    { tier: "minor", nameKo: "효율적인 설계", preference: 36, descriptionKo: "방벽 배열 사용 후, 50의 보호막을 회복하고 지속 체력 재생을 활성화합니다." },
    { tier: "minor", nameKo: "출력 확장", preference: 64, descriptionKo: "광자 매그넘의 사거리가 20% 증가합니다." },
    { tier: "major", nameKo: "분열 폭발", preference: 71, descriptionKo: "수정 발사 폭발에 적중당한 적이 2초 동안 30% 둔화됩니다." },
    { tier: "major", nameKo: "벽어 천격", preference: 29, descriptionKo: "방벽 배열은 피해 증가량이 100%인 소닉 리펄서와 함께 적을 기절시키는 벽처럼 사용할 수 있습니다." },
  ],
  "Doomfist": [
    { tier: "minor", nameKo: "원투", preference: 37, descriptionKo: "로켓 펀치를 맞은 적이 벽에 부딪히면 철권포 탄약을 재장전하며, 2발 추가로 장전합니다." },
    { tier: "minor", nameKo: "자작생존", preference: 63, descriptionKo: "천지 시 최선의 방어는...이 25의 추가 생명력을 부여하며, 최대 생명력이 50 증가합니다." },
    { tier: "major", nameKo: "여진", preference: 13, descriptionKo: "지진 강타에 적중한 적이 2초 동안 40% 둔화됩니다." },
    { tier: "major", nameKo: "파워 매트릭스", preference: 87, descriptionKo: "파워 블락이 지속 시간의 첫 1초 동안 투사체를 흡수합니다." },
  ],
  "Hazard": [
    { tier: "minor", nameKo: "깊숙이 달려들기", preference: 72, descriptionKo: "덤벼들기의 사거리가 15% 증가합니다." },
    { tier: "minor", nameKo: "무정부 광신자", preference: 28, descriptionKo: "다가오는 가시가 30%의 생명력 흡수 효과를 얻습니다." },
    { tier: "major", nameKo: "재편성", preference: 15, descriptionKo: "가시벽 명중 시 날카로운 적이 25 에너지 충전되며, 최대 50 추가 충전됩니다." },
    { tier: "major", nameKo: "폭발성 꿰뚫기", preference: 85, descriptionKo: "본스퍼의 가시가 대상에게 표식을 남깁니다. 빠른 근접 공격과 덤벼들기로 상대를 베면 가시가 폭발하여 40의 폭발 피해를 줍니다." },
  ],
  "Junker Queen": [
    { tier: "minor", nameKo: "광분 돌진", preference: 79, descriptionKo: "살육 사용 시 저지 불가 상태가 되고 모든 재사용 대기시간이 6초 감소합니다." },
    { tier: "minor", nameKo: "전투의 외침", preference: 21, descriptionKo: "지휘의 외침이 산탄총을 완전히 재장전하고 아군의 재장전 속도를 50% 증가시킵니다." },
    { tier: "major", nameKo: "선풍", preference: 27, descriptionKo: "톱니날을 회수하면 반경이 100% 증가하고 30의 추가 명중 피해를 줍니다." },
    { tier: "major", nameKo: "맹렬한 포식", preference: 73, descriptionKo: "도륙이 명중하여 피해를 주면 100%의 생명력 흡수 효과를 얻습니다." },
  ],
  "Mauga": [
    { tier: "minor", nameKo: "키네틱 탄띠", preference: 18, descriptionKo: "돌파로 돌진 중 첫 1초 동안 최대 150발의 탄약을 재장전합니다." },
    { tier: "minor", nameKo: "방화광", preference: 82, descriptionKo: "화염 기관포로 적에게 불을 붙이면 50의 추가 생명력을 얻습니다." },
    { tier: "major", nameKo: "불 위를 걷는 자", preference: 72, descriptionKo: "돌파에 적중당한 적이 불탑니다." },
    { tier: "major", nameKo: "전투 연료", preference: 28, descriptionKo: "공격이 치명타로 적중한 다음 터질 듯한 심장 사용 시 마우가가 일시적으로 추가 생명력을 3 얻습니다. 최대 150까지 얻을 수 있습니다." },
  ],
  "Orisa": [
    { tier: "minor", nameKo: "방어 프로토콜", preference: 16, descriptionKo: "대지의 창을 충전하는 동안 생명력이 초당 100 재생됩니다." },
    { tier: "minor", nameKo: "이동식 강화", preference: 84, descriptionKo: "방어 강화가 활성화된 동안 오리사는 이동 속도가 감소되지 않고 열을 생성하지 않습니다." },
    { tier: "major", nameKo: "충전 투창", preference: 63, descriptionKo: "J 키를 길게 누르면 투창을 충전해 밀쳐내기 효과를 25%까지 증가시키고, 투사체 속도를 100%까지 증가시킵니다." },
    { tier: "major", nameKo: "보호 방벽", preference: 37, descriptionKo: "수호의 창 대신 방벽을 발사합니다." },
  ],
  "Ramattra": [
    { tier: "minor", nameKo: "맹공 형태", preference: 11, descriptionKo: "네메시스 형태가 활성화된 동안 처치 시 지속 시간이 1초 더 길어집니다." },
    { tier: "minor", nameKo: "연장된 방벽", preference: 89, descriptionKo: "공허 방벽의 크기와 지속 시간이 25% 증가합니다." },
    { tier: "major", nameKo: "공허 쇄도", preference: 91, descriptionKo: "공허 가속기를 연속 발사하는 동안 주기적으로 6발의 추가 투사체를 발사합니다." },
    { tier: "major", nameKo: "나노머신 수리", preference: 9, descriptionKo: "라마트라가 탐식의 소용돌이 안에 있는 동안 매초 75의 생명력을 회복합니다." },
  ],
  "Reinhardt": [
    { tier: "minor", nameKo: "성전사의 화염", preference: 25, descriptionKo: "적을 기절시킨 화염 강타 충전 1회를 돌려받습니다. 최대 3회까지 추가 충전됩니다." },
    { tier: "minor", nameKo: "성전사의 결의", preference: 75, descriptionKo: "방벽 방패 사용 중 생명력 지속 재생이 75% 빠르게 발동됩니다." },
    { tier: "major", nameKo: "방패 강타", preference: 43, descriptionKo: "방벽 방패가 활성화되어 있는 동안 사용 시 적에게 피해를 주고 밀쳐냅니다." },
    { tier: "major", nameKo: "불붙은 분노", preference: 57, descriptionKo: "화염 강타가 적에게 적중할 때마다 2초 동안 공격 속도가 25% 증가합니다." },
  ],
  "Roadhog": [
    { tier: "minor", nameKo: "고철 갈고리", preference: 74, descriptionKo: "사슬 갈고리 명중 시 탄약을 2발 재장전합니다." },
    { tier: "minor", nameKo: "파편 발사기", preference: 26, descriptionKo: "고철총 보조 발사의 사거리가 50% 늘어나고 탄 퍼짐이 25% 줄어듭니다." },
    { tier: "major", nameKo: "호그가스 노출", preference: 77, descriptionKo: "숨 돌리기 사용 시 주위의 아군을 치유량의 50%만큼 치유합니다." },
    { tier: "major", nameKo: "풀드포크", preference: 23, descriptionKo: "사슬 갈고리로 적을 끌어당긴 거리에 비례해 최대 300의 추가 생명력을 얻습니다." },
  ],
  "Sigma": [
    { tier: "minor", nameKo: "키네틱 순환", preference: 24, descriptionKo: "키네틱 손아귀로 투사체를 흡수 시 강착의 재사용 대기시간이 감소합니다." },
    { tier: "minor", nameKo: "초재생", preference: 76, descriptionKo: "초구체로 준 피해의 40%만큼 실험용 방벽의 내구도가 회복됩니다." },
    { tier: "major", nameKo: "하이퍼 강타", preference: 61, descriptionKo: "초구체가 5번 명중할 때마다 다음 빠른 근접 공격이 적중한 적을 공중에 띄우고 멀리 날려버립니다." },
    { tier: "major", nameKo: "공중 부양", preference: 39, descriptionKo: "공중에서 점프를 길게 누르면 잠시 더 높이 떠오릅니다." },
  ],
  "Winston": [
    { tier: "minor", nameKo: "전하", preference: 85, descriptionKo: "테슬라 캐논의 기본 발사로 피해를 준 적 하나당 윈스턴의 이동 속도가 10% 증가(최대 30%)" },
    { tier: "minor", nameKo: "묵직한 착륙", preference: 15, descriptionKo: "원시의 분노 시전 중 공중에서 점프 팩의 피해량과 범위가 최대 75 증가" },
    { tier: "major", nameKo: "연쇄 번개", preference: 24, descriptionKo: "완전히 충전된 보조 발사가 명중하면 번개 사슬이 최대 2명의 대상에게 추가 피해" },
    { tier: "major", nameKo: "활력 증진 방벽", preference: 76, descriptionKo: "방벽 생성기가 내부에 있는 아군의 생명력을 초당 30 치유" },
  ],
  "Wrecking Ball": [
    { tier: "minor", nameKo: "증기 롤러", preference: 31, descriptionKo: "구르기가 돌격 영웅에게 적중 시 100% 추가 피해를 줍니다." },
    { tier: "minor", nameKo: "멀티볼", preference: 69, descriptionKo: "지뢰밭 사용 후 5초 이내 A 키를 누르면 지뢰 7개를 추가로 투척합니다." },
    { tier: "major", nameKo: "체공 시간", preference: 28, descriptionKo: "파일드라이버가 더 오래 시전되며 공중에서 방향 조절이 가능해지고 50% 추가 피해를 줍니다." },
    { tier: "major", nameKo: "적응형 방벽", preference: 72, descriptionKo: "적응형 보호막 활성화 시, 1.5초간 유지되는 방벽을 생성합니다." },
  ],
  "Zarya": [
    { tier: "minor", nameKo: "점프 쇼", preference: 15, descriptionKo: "보조 발사로 자신을 밀쳐내는 거리가 75% 증가합니다." },
    { tier: "minor", nameKo: "지원 관측", preference: 85, descriptionKo: "방벽 씌우기가 아군의 생명력 재생을 활성화시키고 이동 속도 20% 증가시킵니다." },
    { tier: "major", nameKo: "출력 증폭", preference: 81, descriptionKo: "방벽이 활성화되어 있을 때 입자포 광선으로 피해를 주면 에너지를 생성합니다." },
    { tier: "major", nameKo: "에너지 창", preference: 19, descriptionKo: "입자포 광선이 적을 관통합니다." },
  ],
  "Sierra": [
    { tier: "minor", nameKo: "전력 비행", nameEn: "Full Flight", preference: 27, descriptionKo: "앵커 드론의 비행 및 갈고리 범위가 25% 증가합니다." },
    { tier: "minor", nameKo: "단단한 손아귀", nameEn: "Tight Grip", preference: 73, descriptionKo: "헬릭스 소총 집탄률이 100% 빨리 좁혀지고 30% 느리게 벌어집니다." },
    { tier: "major", nameKo: "의료 드론", nameEn: "Medi Drone", preference: 16, descriptionKo: "앵커 드론에 시에라를 치유하는 생명력 팩이 탑재됩니다." },
    { tier: "major", nameKo: "대상 포착", nameEn: "Locked In", preference: 84, descriptionKo: "추적 사격 발사 시 2초 동안 공격 속도가 20% 증가합니다." },
  ],
  "Anran": [
    { tier: "minor", nameKo: "불씨", preference: 73, descriptionKo: "불태우기가 적을 1.5초 더 오래 불태웁니다." },
    { tier: "minor", nameKo: "열 보호막", preference: 27, descriptionKo: "궁극기 사용 중 궁극기로 불태운 적 하나당 추가 생명력을 50 얻습니다." },
    { tier: "major", nameKo: "급한 성미", preference: 25, descriptionKo: "맹염 질주로 적과 충돌하면 재사용 대기시간이 1.5초 감소합니다." },
    { tier: "major", nameKo: "꿈꾸는 불꽃", preference: 75, descriptionKo: "춤추는 불꽃 연쇄 공격의 치유량이 25 증가합니다." },
  ],
  "Ashe": [
    { tier: "minor", nameKo: "원격 기폭", preference: 81, descriptionKo: "다이너마이트를 사용한 후 E 키를 누르면 0.5초의 지연 후 폭발합니다." },
    { tier: "minor", nameKo: "이중 총열", preference: 19, descriptionKo: "충격 산탄으로 적을 밀쳐낸 잠깐 동안 밀쳐내기 효과가 25% 감소한 채 다시 한 번 사용할 수 있습니다." },
    { tier: "major", nameKo: "독사의 침", preference: 83, descriptionKo: "저격기 2회 연속으로 대상에 명중하면 25의 추가 피해를 주고 탄약 1발이 재장전됩니다." },
    { tier: "major", nameKo: "공중 폭발", preference: 17, descriptionKo: "공중에서 다이너마이트 폭발 반경이 40% 증가하고, 투척 시 탄약 3발을 회복합니다." },
  ],
  "Bastion": [
    { tier: "minor", nameKo: "모자 포격기", preference: 15, descriptionKo: "포격 활성화 시 300의 추가 생명력을 임시로 얻음" },
    { tier: "minor", nameKo: "설정: 재장전", preference: 85, descriptionKo: "설정 변경 시 수류탄의 재사용 대기시간이 4초 감소" },
    { tier: "major", nameKo: "린드홀름 폭발물", preference: 28, descriptionKo: "강습 모드에서 느리게 폭발탄을 발사하도록 변경" },
    { tier: "major", nameKo: "자가 수리", preference: 72, descriptionKo: "E 키로 매우 빠르게 자신을 치유 가능" },
  ],
  "Cassidy": [
    { tier: "minor", nameKo: "번쩍번쩍", preference: 94, descriptionKo: "더 멀리 날아가는 두 번째 섬광탄을 던지지만, 두 섬광탄의 피해 모두 40% 감소" },
    { tier: "minor", nameKo: "공평한 승부", preference: 6, descriptionKo: "황야의 무법자로 저항한 적 하나당 초당 생명력을 30씩 회복" },
    { tier: "major", nameKo: "굴러 많이", preference: 24, descriptionKo: "구르기 사용 시 재장전한 탄약 한 발당 생명력 또한 15씩 치유" },
    { tier: "major", nameKo: "은 탄환", preference: 76, descriptionKo: "피스키퍼의 보조 발사가 출혈을 유발하는 관통 사격으로 대체, 구르기와 황야의 무법자 사용 시 재사용 대기시간 초기화" },
  ],
  "Echo": [
    { tier: "minor", nameKo: "집중 돌진", preference: 18, descriptionKo: "광선 집중의 사거리가 6미터 증가하고 활성화 시 이동 속도가 20% 증가합니다." },
    { tier: "minor", nameKo: "부분 스캔", preference: 82, descriptionKo: "복제가 궁극기 충전 50% 상태로 시작합니다." },
    { tier: "major", nameKo: "전탄 발사", preference: 96, descriptionKo: "점착 폭탄이 투사체를 50% 추가로 발사합니다." },
    { tier: "major", nameKo: "상향등", preference: 4, descriptionKo: "광선 집중 처치 시 비행의 재사용 대기시간이 초기화됩니다." },
  ],
  "Emre": [
    { tier: "minor", nameKo: "제약 보정", preference: 25, descriptionKo: "오버라이드 프로토콜의 경량탄이 적을 1초 동안 30% 감속시킵니다." },
    { tier: "minor", nameKo: "향상된 민첩성", preference: 75, descriptionKo: "발사 중이 아닐 때 사이펀 블라스터의 이동 속도 보너스가 20% 증가합니다." },
    { tier: "major", nameKo: "히트 싱크", preference: 74, descriptionKo: "사이펀 블라스터 직접 명중 시 열기를 60% 돌려받고 지속 시간이 0.1초 증가합니다." },
    { tier: "major", nameKo: "사이버 부착", preference: 26, descriptionKo: "사이버 파편 수류탄이 적중 시 부착되고, 부착한 적에게 40의 추가 피해를 줍니다." },
  ],
  "Freja": [
    { tier: "minor", nameKo: "가용한 포화", preference: 56, descriptionKo: "정조준으로 명중 시 자동 화살 탄약 8발을 돌려받습니다." },
    { tier: "minor", nameKo: "가속 증폭", preference: 44, descriptionKo: "재빠른 돌진 거리가 20% 증가합니다." },
    { tier: "major", nameKo: "공중 회복", preference: 72, descriptionKo: "상승기류를 사용한 후, 프레야가 땅에 닿을 때까지 생명력을 초당 30 치유합니다." },
    { tier: "major", nameKo: "솟구치는 바람", preference: 28, descriptionKo: "상승기류 충전량이 1회 증가합니다." },
  ],
  "Genji": [
    { tier: "minor", nameKo: "신속 베기", preference: 28, descriptionKo: "빠른 근접 공격 시 질풍참의 재사용 대기시간이 3초 감소합니다." },
    { tier: "minor", nameKo: "용의 갈증", preference: 72, descriptionKo: "용검을 휘두르면 생명력 흡수를 30% 얻습니다." },
    { tier: "major", nameKo: "회전하는 칼날", preference: 73, descriptionKo: "적의 생명력이 절반 미만이라면 질풍참이 25의 추가 지속 피해를 줍니다." },
    { tier: "major", nameKo: "명상", preference: 27, descriptionKo: "튕겨내기가 활성화되어 있는 동안 생명력을 초당 35씩 회복합니다." },
  ],
  "Hanzo": [
    { tier: "minor", nameKo: "음파 변위", preference: 64, descriptionKo: "음파 화살이 근처의 생명력 팩을 30초 동안 해킹합니다." },
    { tier: "minor", nameKo: "용의 분노", preference: 36, descriptionKo: "폭풍 활로 적에게 적중하면 1.5초 동안 공격 속도가 20% 증가합니다." },
    { tier: "major", nameKo: "냉기 화살", preference: 67, descriptionKo: "R 키를 눌러 폭발성 냉기 화살을 준비합니다. 냉기 화살에 중대한 적은 2초 동안 35% 둔화됩니다." },
    { tier: "major", nameKo: "갈래 화살", preference: 33, descriptionKo: "폭풍 화살의 첫 튕김이 5개의 투사체로 갈라져 33%의 피해를 주고, 1회 더 튕깁니다." },
  ],
  "Junkrat": [
    { tier: "minor", nameKo: "니트로 부스트", preference: 46, descriptionKo: "죽이는 타이어 활성화 중 좌Shift 사용 시 속도 증가, 피해 50% 감소" },
    { tier: "minor", nameKo: "빵 터지는 여행", preference: 54, descriptionKo: "충격 지뢰 후 공격 속도 3초간 25% 증가" },
    { tier: "major", nameKo: "지뢰 재활용", preference: 15, descriptionKo: "충격 지뢰 처치 시 충전 수 1개 회복" },
    { tier: "major", nameKo: "폭탄 발사포", preference: 85, descriptionKo: "폭탄 발사기 투사체 속도 25% 증가" },
  ],
  "Mei": [
    { tier: "minor", nameKo: "스케이트장", preference: 27, descriptionKo: "눈보라 내 아군의 이동 속도 25% 증가, 초당 50 치유" },
    { tier: "minor", nameKo: "빙하 추진력", preference: 73, descriptionKo: "2단 점프로 메이를 공중에 띄우는 얼음 기둥 생성" },
    { tier: "major", nameKo: "냉대", preference: 64, descriptionKo: "냉기 분사로 계속 공격하면 적을 짧은 시간 동안 얼림" },
    { tier: "major", nameKo: "급속 폭풍", preference: 36, descriptionKo: "주변 적들을 느려지게 하고 초당 70의 피해를 줌" },
  ],
  "Pharah": [
    { tier: "minor", nameKo: "충격력", preference: 74, descriptionKo: "충격탄이 최대 30의 폭발 피해를 줍니다." },
    { tier: "minor", nameKo: "나선 보호막", preference: 26, descriptionKo: "생명력 125를 보호막으로 전환합니다." },
    { tier: "major", nameKo: "연료 저장", preference: 15, descriptionKo: "급속 추진이 연료를 50% 충전합니다." },
    { tier: "major", nameKo: "로켓 투하", preference: 85, descriptionKo: "이동 기술 사용 후 기본 발사가 초소형 로켓 2발을 함께 발사합니다." },
  ],
  "Reaper": [
    { tier: "minor", nameKo: "영혼 갈탈자", preference: 18, descriptionKo: "사망한 적에게서 영혼 구슬을 수집하면 50의 생명력을 회복" },
    { tier: "minor", nameKo: "잔존하는 망령", preference: 82, descriptionKo: "망령화를 종료하고 2초 동안 이동 속도가 40% 증가" },
    { tier: "major", nameKo: "그림자 점멸", preference: 31, descriptionKo: "그림자 밟기의 사전 시전 시간과 재사용 대기시간이 25% 빨라지지만, 사거리가 25% 감소" },
    { tier: "major", nameKo: "방아쇠 손가락", preference: 69, descriptionKo: "기술을 사용하거나 총을 재장전할 때마다 긴박한 방아쇠의 재사용 대기시간이 초기화" },
  ],
  "Sojourn": [
    { tier: "minor", nameKo: "과충전", preference: 49, descriptionKo: "오버클럭이 활성화되어 있을 때 레일건의 최대 에너지가 50 증가합니다." },
    { tier: "minor", nameKo: "감속장", preference: 51, descriptionKo: "분열 사격에 적중한 적이 25% 둔화됩니다." },
    { tier: "major", nameKo: "마찰 생성기", preference: 25, descriptionKo: "파워 슬라이드가 미끄러지는 동안 최대 50의 에너지를 생성합니다." },
    { tier: "major", nameKo: "이중 추진기", preference: 75, descriptionKo: "파워 슬라이드 충전 횟수가 1 증가하고 점프 시 횡방향으로 이동할 수 있습니다." },
  ],
  "Soldier:76": [
    { tier: "minor", nameKo: "나선 추진", preference: 75, descriptionKo: "나선 로켓의 투사체 속도가 50% 증가합니다." },
    { tier: "minor", nameKo: "전술 일제 사격", preference: 25, descriptionKo: "전술 조준경 사용 중, 나선 로켓의 재사용 대기시간이 80% 감소합니다." },
    { tier: "major", nameKo: "전속력", preference: 23, descriptionKo: "질주의 이동 속도 보너스가 2초 동안 점진적으로 25% 추가로 증가합니다." },
    { tier: "major", nameKo: "전투자극제", preference: 77, descriptionKo: "전투자극제가 생체장을 대체합니다. 사용 시, 5초 동안 생명력이 초당 30 치유됩니다." },
  ],
  "Sombra": [
    { tier: "minor", nameKo: "암호화 업로드", preference: 24, descriptionKo: "투명화 중에 해킹을 사용할 수 있으며, 해킹에 성공하면 은신의 지속 시간이 3초 증가합니다." },
    { tier: "minor", nameKo: "CTRL ALT ESC", preference: 76, descriptionKo: "생명력이 절반 미만일 때 위치변환기로 순간이동하면 지속 생명력 재생이 시작됩니다." },
    { tier: "major", nameKo: "고속 대역폭", preference: 25, descriptionKo: "해킹한 생명력 팩이 4초 동안 아군의 이동 속도를 25% 증가시키고 50의 추가 생명력을 부여합니다." },
    { tier: "major", nameKo: "바이러스 복제", preference: 75, descriptionKo: "해킹한 적을 바이러스로 공격하면 바이러스가 8미터 이내의 적에게 퍼집니다." },
  ],
  "Symmetra": [
    { tier: "minor", nameKo: "포탑 용량", preference: 21, descriptionKo: "감시 포탑 충전 횟수가 1 증가합니다." },
    { tier: "minor", nameKo: "완벽한 정렬", preference: 79, descriptionKo: "광자 발사기 기본 발사 사거리가 20% 증가합니다." },
    { tier: "major", nameKo: "호버 방벽", preference: 21, descriptionKo: "순간이동기가 전방으로 움직이는 방벽을 생성하는 선택지가 생깁니다." },
    { tier: "major", nameKo: "보호막 배터리", preference: 79, descriptionKo: "시메트라가 순간이동기로부터 10미터 이내에 있는 동안 매초 보호막을 20 재생합니다." },
  ],
  "Torbjörn": [
    { tier: "minor", nameKo: "망치질 개시", preference: 35, descriptionKo: "대장간 망치를 장착한 동안 이동 속도가 20% 증가합니다." },
    { tier: "minor", nameKo: "예열 완료", preference: 65, descriptionKo: "초고열 용광로가 과부하를 활성화합니다." },
    { tier: "major", nameKo: "고정 나사", preference: 82, descriptionKo: "포탑 설치의 투척 거리가 50% 증가합니다. 이제 포탑을 벽이나 천장에 설치할 수 있습니다." },
    { tier: "major", nameKo: "포탑 과부하", preference: 18, descriptionKo: "과부하가 5초 동안 내 포탑을 업그레이드하여 생명력과 피해를 증가시킵니다." },
  ],
  "Tracer": [
    { tier: "minor", nameKo: "시간 질주", preference: 26, descriptionKo: "점멸 거리가 20% 증가합니다." },
    { tier: "minor", nameKo: "키네틱 재장전", preference: 74, descriptionKo: "근접 공격 적중 시 탄약을 20발 얻습니다." },
    { tier: "major", nameKo: "점멸 팩", preference: 48, descriptionKo: "생명력 팩이 점멸을 1회 충전시킵니다." },
    { tier: "major", nameKo: "양자 얽힘", preference: 52, descriptionKo: "시간 역행이 적과 사라지는 추가 생명력 50과 탄약 20발을 부여합니다." },
  ],
  "Vendetta": [
    { tier: "minor", nameKo: "추가 칼날", preference: 29, descriptionKo: "칼날 투영의 에너지 비용이 25% 감소합니다." },
    { tier: "minor", nameKo: "맹렬한 폭풍", preference: 71, descriptionKo: "맹공 사용 시 계속 회전하여 추가로 3회 공격해 넓은 범위에 30의 피해를 줍니다." },
    { tier: "major", nameKo: "착취의 칼날", preference: 85, descriptionKo: "내려치기가 40%의 생명력 흡수 효과를 얻습니다." },
    { tier: "major", nameKo: "무자비", preference: 15, descriptionKo: "맹공이 추가로 3번 충전되며, 충전 하나당 공격 속도가 5%, 이동 속도는 2% 증가합니다." },
  ],
  "Venture": [
    { tier: "minor", nameKo: "심층 잠복", preference: 28, descriptionKo: "잠복 상태에서 드릴 돌진의 거리가 50% 길어집니다." },
    { tier: "minor", nameKo: "먼지투성이", preference: 18, descriptionKo: "갈아 버리기로 피해를 주면 근접 탐험가 보호막이 최대 30 증가합니다." },
    { tier: "major", nameKo: "발굴의 쾌감", preference: 72, descriptionKo: "충격파가 활성화되어 있는 동안 재사용 대기시간이 300% 빠르게 충전됩니다." },
    { tier: "major", nameKo: "스마트 연장기", preference: 82, descriptionKo: "E 키로 스마트 굴착기를 강화하여 4초 동안 최대 투사체 사거리를 100% 증가시킵니다." },
  ],
  "Widowmaker": [
    { tier: "minor", nameKo: "저격 효율", preference: 78, descriptionKo: "저격 모드 탄 소모량이 5발에서 3발로 감소합니다." },
    { tier: "minor", nameKo: "저격수의 본능", preference: 22, descriptionKo: "갈고리 발사 사용 후 2초 동안 저격 모드가 100% 빨리 충전됩니다." },
    { tier: "major", nameKo: "추적 지뢰", preference: 9, descriptionKo: "맹독 지뢰가 10미터 이내의 적에게 독침을 발사하며 발동 후에도 유지됩니다." },
    { tier: "major", nameKo: "위도우의 독니", preference: 91, descriptionKo: "저격이 최대 125%까지 충전되며, 완충 시 적을 관통합니다." },
  ],
  "Ana": [
    { tier: "minor", nameKo: "휴이", preference: 25, descriptionKo: "수면총에서 깨어난 적이 느려지고 2초에 걸쳐 50 피해를 받습니다." },
    { tier: "minor", nameKo: "가속 혈청", nameEn: "Speed Serum", preference: 75, descriptionKo: "나노 강화제가 아나와 대상 모두의 이동 속도를 40% 증가시킵니다." },
    { tier: "major", nameKo: "생체 수류탄 튕기기", nameEn: "Biotic Bounce", preference: 32, descriptionKo: "폭발 후, 생체 수류탄이 튕겨 다시 폭발합니다. 두 번째 폭발은 60의 피해와 치유량을 갖습니다." },
    { tier: "major", nameKo: "인간사냥", nameEn: "Headhunter", preference: 68, descriptionKo: "생체 소총이 적에게 치명타를 줄 수 있습니다." },
  ],
  "Baptiste": [
    { tier: "minor", nameKo: "확장장", preference: 52, descriptionKo: "발사 장치의 반경이 30% 커집니다." },
    { tier: "minor", nameKo: "맹공의 파동", preference: 48, descriptionKo: "치유 파동이 3초 동안 바티스트의 공격 속도를 20% 증가시킵니다." },
    { tier: "major", nameKo: "자동화 치유", preference: 79, descriptionKo: "아무 기술을 사용하면 바티스트의 견착식 포탑이 아군에게 주기적으로 최대 3회 발사해 매번 40의 생명력을 치유합니다." },
    { tier: "major", nameKo: "로켓 점화", preference: 21, descriptionKo: "외골격 전투화로 공중에 떠 있을 때 스페이스 바 사용 시 수평 방향으로 추진합니다." },
  ],
  "Brigitte": [
    { tier: "minor", nameKo: "전투 의무감", preference: 20, descriptionKo: "근접 공격 시 수리 팩의 재사용 대기시간이 0.75초 감소" },
    { tier: "minor", nameKo: "사기 증진", preference: 80, descriptionKo: "도리깨 투척으로 발동하는 격려의 지속 시간이 3초 증가" },
    { tier: "major", nameKo: "격려 타격", preference: 87, descriptionKo: "방패 밀쳐내기 사용 시 2초 동안 이동 속도 30% 증가" },
    { tier: "major", nameKo: "채찍질", preference: 13, descriptionKo: "도리깨 투척으로 벽에 충돌시킨 적에게 50의 추가 피해" },
  ],
  "Illari": [
    { tier: "minor", nameKo: "빠른 조립", preference: 36, descriptionKo: "치유의 태양석이 300% 빠르게 설치되고 재사용 대기시간이 1.5초 감소합니다." },
    { tier: "minor", nameKo: "하지", preference: 64, descriptionKo: "태양 작렬 사용 시 일리아리의 비행 및 공격 속도가 20% 증가하고, 비행 지속 시간이 3초 증가합니다." },
    { tier: "major", nameKo: "태양의 섬광", preference: 13, descriptionKo: "태양 소총의 치유 광선을 사용하는 동안 R 키를 누르면 일리아리 앞에 있는 모든 아군을 100 치유합니다." },
    { tier: "major", nameKo: "일광 화상", preference: 87, descriptionKo: "분출이 적을 불태워 3초에 걸쳐 50의 추가 피해를 줍니다." },
  ],
  "Jetpack Cat": [
    { tier: "minor", nameKo: "숨은 동기", preference: 93, descriptionKo: "생체 냥냥탄 치유량의 15%만큼 연료가 회복됩니다." },
    { tier: "minor", nameKo: "운송 보호막", preference: 7, descriptionKo: "다른 영웅을 운반하는 동안 추가 보호막 내구도를 최대 75 얻습니다." },
    { tier: "major", nameKo: "박치기", preference: 3, descriptionKo: "정신 없는 비행의 속도가 충분히 빠르면 충돌 시 적을 밀쳐냅니다. 밀쳐내기 시 연료를 25% 생성합니다." },
    { tier: "major", nameKo: "발톱 꺼내기", preference: 97, descriptionKo: "빠른 근접 공격이 6초마다 강화되고, 적에게 상처를 입혀 40의 피해를 주며 1초 동안 30% 감속시킵니다." },
  ],
  "Juno": [
    { tier: "minor", nameKo: "익숙한 포착", preference: 24, descriptionKo: "펄사 어뢰가 아군을 35% 빠르게 추적합니다." },
    { tier: "minor", nameKo: "대상 포착", preference: 76, descriptionKo: "펄사 어뢰가 적에게 적중할 때마다 재사용 대기시간이 1초씩 감소합니다." },
    { tier: "major", nameKo: "이륙", preference: 49, descriptionKo: "화성식 오버부츠로 3단 점프가 가능해집니다." },
    { tier: "major", nameKo: "고속 블라스터", preference: 51, descriptionKo: "글라이드 부스터가 활성화된 동안 메디블라스터가 계속 발사됩니다." },
  ],
  "Kiriko": [
    { tier: "minor", nameKo: "긴급 치료", preference: 26, descriptionKo: "생명력이 절반 미만인 아군 추적 시 치유의 부적 투사체 속도가 50% 증가합니다." },
    { tier: "minor", nameKo: "술수가", preference: 74, descriptionKo: "쿠나이 적중 시 앞에 있는 아군에게 치유의 부적 2장을 날립니다." },
    { tier: "major", nameKo: "준비 단계", preference: 11, descriptionKo: "순보 사용 시 3초 동안 키리코의 공격력과 재장전 속도가 40% 증가합니다." },
    { tier: "major", nameKo: "여우걸음", preference: 89, descriptionKo: "정화의 방울이 4초 동안 아군의 이동 속도를 30% 증가시킵니다." },
  ],
  "Lifeweaver": [
    { tier: "minor", nameKo: "꽃잎 보호", preference: 21, descriptionKo: "아군이 연꽃 단상에 있는 동안 생명력을 초당 20씩 치유됩니다." },
    { tier: "minor", nameKo: "질주 탈출", preference: 79, descriptionKo: "신들 걸음의 거리가 30% 증가합니다." },
    { tier: "major", nameKo: "씨앗 뿌리기", preference: 25, descriptionKo: "치유의 꽃으로 빠른 근접 공격을 사용하면 씨앗을 던집니다." },
    { tier: "major", nameKo: "초월 개화", preference: 75, descriptionKo: "2.5초 이내에 충분한 수의 가시가 꽂힐 경우 가시가 폭발하여 40의 추가 피해를 줍니다." },
  ],
  "Lúcio": [
    { tier: "minor", nameKo: "소리 파동 타기", preference: 55, descriptionKo: "벽 타기 시 다음 소리 파동이 강화되어 밀쳐내기 효과가 25%, 피해가 50% 증가합니다." },
    { tier: "minor", nameKo: "비트 드롭", preference: 45, descriptionKo: "소리 방벽을 시전하는 동안 볼륨을 높여라!가 활성화됩니다." },
    { tier: "major", nameKo: "소음 공해", preference: 79, descriptionKo: "볼륨을 높여라!가 활성화되어 있는 동안 분위기 전환의 사거리가 150% 증가합니다." },
    { tier: "major", nameKo: "엑셀라렌도", preference: 21, descriptionKo: "루시우의 가속 음악이 활성화되어 있는 동안 공격 속도가 15% 증가하고, 볼륨을 높여라!를 시전 중일 땐 3배 증가합니다." },
  ],
  "Mercy": [
    { tier: "minor", nameKo: "천사의 부활", preference: 87, descriptionKo: "메르시가 부활을 시전한 후 100의 추가 생명력을 얻습니다." },
    { tier: "minor", nameKo: "날개 달린 손길", preference: 13, descriptionKo: "수호천사의 사거리가 30% 증가합니다." },
    { tier: "major", nameKo: "연쇄 증폭", preference: 23, descriptionKo: "카두세우스 지팡이 보조 발사가 근처의 두 번째 아군에게 연결됩니다." },
    { tier: "major", nameKo: "두 배 투여", preference: 77, descriptionKo: "빠른 치유 충전 횟수가 1회 증가하지만, 기본 치유량이 10 감소합니다." },
  ],
  "Mizuki": [
    { tier: "minor", nameKo: "샘물", preference: 41, descriptionKo: "회복 오라 재생량이 25% 증가합니다." },
    { tier: "minor", nameKo: "드러난 영혼", preference: 59, descriptionKo: "속박 사슬이 적에게 적중한 2초 동안 해당 적에게 주는 피해가 30% 증가합니다." },
    { tier: "major", nameKo: "공명 복귀", preference: 79, descriptionKo: "치유의 갓갓이 한 번 더 튕깁니다. 튕길 때마다 치유량이 10 증가합니다." },
    { tier: "major", nameKo: "잰걸음", preference: 21, descriptionKo: "종이 인형 분신술 사용 중일 때, 회복 오라 내에 있는 아군의 이동 속도가 25% 증가합니다." },
  ],
  "Moira": [
    { tier: "minor", nameKo: "파괴의 분화", preference: 18, descriptionKo: "융화를 순수 치유와 순수 공격 간 전환할 수 있습니다. 효과가 30% 증가합니다." },
    { tier: "minor", nameKo: "윤리적 양분 보충", preference: 82, descriptionKo: "생체 구슬이 접촉하는 각 아군의 생명력을 30만큼 즉시 치유합니다." },
    { tier: "major", nameKo: "반전", preference: 24, descriptionKo: "생체 구슬을 다시 활성화하면 방향이 반전됩니다." },
    { tier: "major", nameKo: "환영 걸음", preference: 76, descriptionKo: "소멸의 지속 시간이 0.5초 더 길어지고 점프 높이가 50% 증가합니다." },
  ],
  "Wuyang": [
    { tier: "minor", nameKo: "발랄", preference: 22, descriptionKo: "격류 활성화 중 탄약 10 획득, 치유 자원 50% 증가" },
    { tier: "minor", nameKo: "균형", preference: 78, descriptionKo: "물의 구슬 피해 시 회복의 물결 지속 치유량 30% 증가(2초)" },
    { tier: "major", nameKo: "밀물과 썰물", preference: 24, descriptionKo: "연속 파도가 시작 위치로 돌아가며 귀환 중 위력 50% 감소" },
    { tier: "major", nameKo: "쏟아지는 비", preference: 76, descriptionKo: "물의 구슬 3개 동시 제어, 피해 60% 감소, 폭발 반경 25% 감소" },
  ],
  "Zenyatta": [
    { tier: "minor", nameKo: "부조화의 수리", preference: 68, descriptionKo: "젠야타가 부조화의 구슬이 적용된 적으로부터 10%의 생명력 흡수를 얻습니다." },
    { tier: "minor", nameKo: "승천", preference: 32, descriptionKo: "공중에서 점프를 길게 누르면 최대 3초까지 떠오른 상태를 유지합니다." },
    { tier: "major", nameKo: "파괴 집중", preference: 34, descriptionKo: "보조 발사가 20% 빠르게 충전되며 파괴의 구슬 하나를 추가로 충전할 수 있습니다." },
    { tier: "major", nameKo: "이중 조화", preference: 66, descriptionKo: "두 번째 조화의 구슬을 얻지만, 두 구슬의 치유 효과가 70%가 됩니다." },
  ],
};

// Hero-specific context rules — bonus to a perk when given enemy/team conditions apply.
// Returns map of perk Korean name -> bonus reason string.
export function contextBonusForHero(
  heroName: string,
  ctx: { enemies: string[]; team: string[] },
): Record<string, string> {
  const out: Record<string, string> = {};
  const enemies = new Set(ctx.enemies);
  const hasAerialEnemy = ["Pharah", "Echo", "Mercy", "Freja", "Jetpack Cat"].some((n) => enemies.has(n));
  const hasFlankerEnemy = ["Tracer", "Genji", "Sombra", "Reaper", "Venture"].some((n) => enemies.has(n));
  const hasSniperEnemy = ["Widowmaker", "Hanzo", "Ashe"].some((n) => enemies.has(n));
  const hasTankyEnemy = ["Roadhog", "Mauga", "Reinhardt", "Orisa", "Ramattra", "Junker Queen"].some((n) => enemies.has(n));

  switch (heroName) {
    case "Ana":
      if (hasAerialEnemy) out["인간사냥"] = "상대 공중 영웅에 치명타로 압박";
      if (hasFlankerEnemy) out["휴이"] = "다이브 처치 후 마무리에 유리";
      break;
    case "Cassidy":
      if (hasFlankerEnemy) out["번쩍번쩍"] = "기동성 높은 적 견제에 유리";
      if (hasTankyEnemy) out["은 탄환"] = "관통 출혈로 큰 탱커 압박";
      break;
    case "Mercy":
      if (ctx.team.length >= 4) out["천사의 부활"] = "팀 한타에 부활 안정성";
      break;
    case "Soldier:76":
      if (hasAerialEnemy) out["나선 추진"] = "공중 영웅에 빠른 적중";
      break;
    case "Sojourn":
      if (hasFlankerEnemy) out["이중 추진기"] = "추가 슬라이드로 다이브 회피";
      break;
    case "Widowmaker":
      if (hasTankyEnemy) out["위도우의 독니"] = "관통으로 탱커 견제";
      break;
    case "Reinhardt":
      if (hasFlankerEnemy) out["성전사의 결의"] = "다이브 압박 속 생존 강화";
      break;
    case "Sigma":
      if (hasAerialEnemy) out["하이퍼 강타"] = "공중 영웅 띄우기 카운터";
      break;
    case "Winston":
      if (hasSniperEnemy) out["활력 증진 방벽"] = "저격수 라인 차단 + 팀 회복";
      break;
    case "Lúcio":
      if (hasFlankerEnemy) out["소리 파동 타기"] = "다이브 견제용 강화 파동";
      break;
    case "Kiriko":
      if (hasFlankerEnemy) out["여우걸음"] = "이속 버프로 다이브 견제";
      break;
    case "Brigitte":
      if (hasFlankerEnemy) out["격려 타격"] = "다이브 견제 핵심";
      break;
    case "Hanzo":
      if (hasTankyEnemy) out["냉기 화살"] = "탱커 둔화로 한타 압박";
      break;
    case "Pharah":
      if (hasSniperEnemy) out["로켓 투하"] = "저격수 라인 견제";
      break;
    case "Tracer":
      if (hasSniperEnemy) out["키네틱 재장전"] = "저격수 다이브 시 화력 유지";
      break;
    case "Reaper":
      if (hasTankyEnemy) out["방아쇠 손가락"] = "탱커 폭딜 사이클";
      break;
    case "Mei":
      if (hasFlankerEnemy) out["빙하 추진력"] = "다이브 회피 + 위치 선점";
      break;
  }
  return out;
}

export interface PerkRecommendation {
  perk: Perk;
  bonusReason?: string;
}

export function recommendedPerks(
  heroName: string,
  ctx: { enemies: string[]; team: string[] },
): { minor?: PerkRecommendation; major?: PerkRecommendation } {
  const perks = HERO_PERKS[heroName];
  if (!perks) return {};
  const bonus = contextBonusForHero(heroName, ctx);

  const score = (p: Perk) => p.preference + (bonus[p.nameKo] ? 30 : 0);

  const minors = perks.filter((p) => p.tier === "minor");
  const majors = perks.filter((p) => p.tier === "major");
  const bestMinor = minors.sort((a, b) => score(b) - score(a))[0];
  const bestMajor = majors.sort((a, b) => score(b) - score(a))[0];

  return {
    minor: bestMinor
      ? { perk: bestMinor, bonusReason: bonus[bestMinor.nameKo] }
      : undefined,
    major: bestMajor
      ? { perk: bestMajor, bonusReason: bonus[bestMajor.nameKo] }
      : undefined,
  };
}
