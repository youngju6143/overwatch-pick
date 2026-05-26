import type { CompType, HeroRole } from "../types";

export const COMP_KO: Record<CompType, string> = {
  Dive: "다이브",
  Brawl: "러쉬",
  Poke: "포킹",
  Anchor: "앵커",
};

export const COMP_DESCRIPTIONS: Record<CompType, string> = {
  Dive: "빠른 진입, 수직 기동, 후방 암살. 과도한 진입은 금물.",
  Brawl: "지속적인 근거리 압박. 공간을 두고 싸우며 위치를 사수하세요.",
  Poke: "거리를 유지하며 교전 전 적의 체력을 깎으세요.",
  Anchor: "한 자리를 사수하며 아군 공간을 만들어주는 버티기 기반 조합.",
};

export const ROLE_LABELS: Record<HeroRole, string> = {
  Tank: "돌격",
  Damage: "공격",
  Support: "지원",
};
