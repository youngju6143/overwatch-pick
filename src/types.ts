export type CompType = "Dive" | "Brawl" | "Poke" | "Anchor";
export type HeroRole = "Tank" | "Damage" | "Support";
export type Tier = "S" | "A" | "B";

export interface MapData {
  name: string;
  mapType: CompType;
  gameType: string;
  features: string[];
}

export interface Hero {
  name: string;
  abbrev: string;
  role: HeroRole;
  compType: CompType[];
  synergies: string[];
  counters: string[];
}

export interface Recommendation {
  hero: Hero;
  score: number;
  reasons: string[];
  tier: Tier;
}
