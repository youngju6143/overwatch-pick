// 나무위키 오버워치/조합 문서를 기반으로 한 영웅 분류.
// 점수 가중을 위한 태그 데이터.

export type DpsClass = "main" | "flex";
export type SupportClass = "main" | "flex";
export type TankSubtype = "anchor" | "bruiser" | "dive";

export type DpsTag =
  | "antiTank"
  | "assassin"
  | "aggro"
  | "sniper"
  | "midRange"
  | "trickster"
  | "aerial";

export type SupportTag =
  | "sustain"
  | "highHPS"
  | "save"
  | "poke"
  | "antiDive";

export const DPS_CLASS: Record<string, DpsClass> = {
  Sojourn: "main",
  "Soldier:76": "main",
  Sierra: "main",
  Ashe: "main",
  Emre: "main",
  Cassidy: "main",
  Bastion: "main",
  Widowmaker: "main",
  Torbjörn: "main",
  Freja: "main",
  Hanzo: "main",
  Genji: "flex",
  Vendetta: "flex",
  Venture: "flex",
  Anran: "flex",
  Tracer: "flex",
  Echo: "flex",
  Pharah: "flex",
  Junkrat: "flex",
  Mei: "flex",
  Sombra: "flex",
  Symmetra: "flex",
  Reaper: "flex",
};

export const SUPPORT_CLASS: Record<string, SupportClass> = {
  Lifeweaver: "main",
  Lúcio: "main",
  Mercy: "main",
  Mizuki: "main",
  Brigitte: "main",
  Wuyang: "main",
  Juno: "main",
  Moira: "flex",
  Baptiste: "flex",
  Ana: "flex",
  Illari: "flex",
  "Jetpack Cat": "flex",
  Zenyatta: "flex",
  Kiriko: "flex",
};

export const TANK_SUBTYPE: Record<string, TankSubtype> = {
  Domina: "anchor",
  Reinhardt: "anchor",
  Sigma: "anchor",
  Zarya: "anchor",
  Ramattra: "bruiser",
  Roadhog: "bruiser",
  Mauga: "bruiser",
  Orisa: "bruiser",
  "Junker Queen": "bruiser",
  "D.Va": "dive",
  Doomfist: "dive",
  "Wrecking Ball": "dive",
  Winston: "dive",
  Hazard: "dive",
};

export const DPS_TAGS: Record<string, DpsTag[]> = {
  Reaper: ["antiTank", "midRange"],
  Bastion: ["antiTank", "midRange"],
  Mei: ["antiTank", "trickster"],
  Vendetta: ["antiTank", "assassin"],
  Sombra: ["antiTank", "assassin", "aggro"],
  Symmetra: ["antiTank", "trickster"],
  Junkrat: ["antiTank"],
  Cassidy: ["antiTank", "midRange"],
  Freja: ["antiTank", "trickster", "aerial"],
  Genji: ["assassin", "aggro"],
  Venture: ["assassin", "aggro"],
  Echo: ["assassin", "aerial"],
  Tracer: ["assassin", "aggro"],
  Anran: ["aggro"],
  Ashe: ["sniper", "midRange"],
  Widowmaker: ["sniper"],
  Hanzo: ["sniper", "midRange"],
  Sojourn: ["sniper", "midRange"],
  "Soldier:76": ["midRange"],
  Sierra: ["midRange"],
  Emre: ["midRange"],
  Torbjörn: ["trickster"],
  Pharah: ["aerial"],
};

export const SUPPORT_TAGS: Record<string, SupportTag[]> = {
  Lifeweaver: ["sustain", "save"],
  Lúcio: ["sustain", "save", "antiDive"],
  Mercy: ["sustain"],
  Moira: ["sustain", "highHPS"],
  Mizuki: ["sustain", "antiDive"],
  Brigitte: ["sustain", "antiDive"],
  Baptiste: ["sustain", "highHPS", "save", "poke"],
  Juno: ["sustain", "highHPS"],
  Ana: ["highHPS", "save", "poke", "antiDive"],
  Illari: ["highHPS", "poke"],
  Zenyatta: ["save", "poke"],
  Kiriko: ["save", "poke"],
  Wuyang: ["save", "poke"],
  "Jetpack Cat": [],
};

export const TANK_SUBTYPE_KO: Record<TankSubtype, string> = {
  anchor: "진형 유지",
  bruiser: "브루저",
  dive: "진형 붕괴",
};

// 나무위키 4번 — 검증된 힐러 페어 조합
export interface SupportPair {
  id: string;
  label: string;
  style: "dive" | "rush" | "poke" | "hybrid";
  supports: [string, string];
  tanks: string[];
  dps: string[];
  note: string;
}

export const SUPPORT_PAIRS: SupportPair[] = [
  {
    id: "ana-brig",
    label: "아나 + 브리기테",
    style: "dive",
    supports: ["Ana", "Brigitte"],
    tanks: ["Winston", "D.Va"],
    dps: ["Genji", "Tracer", "Echo"],
    note: "고전적 다이브: 아나 원거리 힐 + 브리 보디가드",
  },
  {
    id: "lucio-kiriko-dive",
    label: "루시우 + 키리코 (다이브)",
    style: "dive",
    supports: ["Lúcio", "Kiriko"],
    tanks: ["Winston", "D.Va", "Doomfist", "Wrecking Ball"],
    dps: ["Genji", "Tracer", "Echo"],
    note: "두 힐러가 적극적으로 다이브에 합류",
  },
  {
    id: "wuyang-kiriko",
    label: "우양 + 키리코",
    style: "dive",
    supports: ["Wuyang", "Kiriko"],
    tanks: ["Winston", "D.Va"],
    dps: ["Genji", "Tracer", "Echo"],
    note: "산개 다이브: 우양 지속힐 + 키리코 세이브",
  },
  {
    id: "juno-brig",
    label: "주노 + 브리기테",
    style: "rush",
    supports: ["Juno", "Brigitte"],
    tanks: ["Ramattra", "Mauga"],
    dps: ["Mei", "Reaper"],
    note: "하이퍼 링으로 진입하는 러쉬",
  },
  {
    id: "lucio-kiriko-rush",
    label: "루시우 + 키리코 (러쉬)",
    style: "rush",
    supports: ["Lúcio", "Kiriko"],
    tanks: ["Junker Queen", "Mauga", "Reinhardt", "Ramattra"],
    dps: ["Mei", "Reaper"],
    note: "5인이 한 몸처럼 같이 진격",
  },
  {
    id: "zen-bap",
    label: "젠야타 + 바티스트",
    style: "poke",
    supports: ["Zenyatta", "Baptiste"],
    tanks: ["Sigma", "Orisa"],
    dps: ["Widowmaker", "Ashe", "Pharah", "Soldier:76", "Torbjörn"],
    note: "장거리 누킹 극단 포킹",
  },
  {
    id: "illari-bap",
    label: "일리아리 + 바티스트",
    style: "poke",
    supports: ["Illari", "Baptiste"],
    tanks: ["Sigma", "Orisa"],
    dps: ["Widowmaker", "Ashe", "Pharah", "Soldier:76", "Torbjörn"],
    note: "농성형 포킹: 자리 사수에 강점",
  },
  {
    id: "zen-ana",
    label: "젠야타 + 아나",
    style: "hybrid",
    supports: ["Zenyatta", "Ana"],
    tanks: ["D.Va", "Zarya", "Doomfist", "Winston"],
    dps: ["Genji", "Sojourn"],
    note: "안티탱 복합: 깡체력 탱커 녹이기",
  },
];

export const SUPPORT_PAIR_STYLE_KO: Record<SupportPair["style"], string> = {
  dive: "다이브",
  rush: "러쉬",
  poke: "포킹",
  hybrid: "복합",
};

export const dpsClassOf = (name: string) => DPS_CLASS[name];
export const supportClassOf = (name: string) => SUPPORT_CLASS[name];
export const tankSubtypeOf = (name: string) => TANK_SUBTYPE[name];
export const dpsTagsOf = (name: string) => DPS_TAGS[name] ?? [];
export const supportTagsOf = (name: string) => SUPPORT_TAGS[name] ?? [];
