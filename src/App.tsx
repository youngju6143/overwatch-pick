import { useState, useMemo } from "react";
import { X, Plus, ChevronDown } from "lucide-react";
import AppHeader from "./components/AppHeader";
import type {
  CompType,
  HeroRole,
  Tier,
  MapData,
  Recommendation,
} from "./types";
import { MAPS, MAP_KO, GAMETYPE_KO, FEATURE_KO } from "./data/maps";
import { HEROES, HERO_KO, HERO_IMG } from "./data/heroes";
import { COMP_KO, COMP_DESCRIPTIONS, ROLE_LABELS } from "./data/labels";
import {
  dpsClassOf,
  supportClassOf,
  tankSubtypeOf,
  dpsTagsOf,
  supportTagsOf,
  SUPPORT_PAIRS,
} from "./data/archetypes";

const ko = (name: string) => HERO_KO[name] ?? name;
const koList = (names: string[]) => names.map(ko).join(", ");
const heroImg = (name: string) => HERO_IMG[name];

function computeRecommendations(
  map: MapData | null,
  role: HeroRole | null,
  team: string[],
  enemies: string[],
): Recommendation[] {
  const candidates = HEROES.filter((h) => {
    if (team.includes(h.name)) return false;
    if (enemies.includes(h.name)) return false;
    if (role && h.role !== role) return false;
    return true;
  });

  const results: Recommendation[] = candidates.map((hero) => {
    let score = 1;
    const reasons: string[] = [];

    if (map) {
      if (hero.compType.includes(map.mapType)) {
        score += 3;
        reasons.push(
          `${MAP_KO[map.name] ?? map.name} 맵에 ${COMP_KO[map.mapType]} 플레이스타일이 적합`,
        );
      }
      const hasVertical = map.features.some(
        (f) =>
          f.toLowerCase().includes("vertical") ||
          f.toLowerCase().includes("high ground"),
      );
      if (
        hasVertical &&
        ["Winston", "Pharah", "Echo", "Genji", "Tracer", "Kiriko"].includes(
          hero.name,
        )
      ) {
        score += 1;
        reasons.push("수직 지형에서 강력");
      }
      const hasLong = map.features.some(
        (f) =>
          f.toLowerCase().includes("sightline") ||
          f.toLowerCase().includes("long"),
      );
      if (
        hasLong &&
        ["Widowmaker", "Ana", "Ashe", "Hanzo", "Sojourn", "Illari"].includes(
          hero.name,
        )
      ) {
        score += 1;
        reasons.push("긴 시야에서 유리");
      }
    }

    const synergizedTeam = hero.synergies.filter((s) => team.includes(s));
    if (synergizedTeam.length > 0) {
      score += synergizedTeam.length * 2;
      reasons.push(`${koList(synergizedTeam)} 와(과) 시너지`);
    }

    const counteredEnemies = hero.counters.filter((c) => enemies.includes(c));
    if (counteredEnemies.length > 0) {
      score += counteredEnemies.length * 2;
      reasons.push(`${koList(counteredEnemies)} 카운터`);
    }

    // ── 나무위키 조합 이론 기반 가중 ──────────────────────────────────────
    const teamTank = team.find((n) => tankSubtypeOf(n));
    const tankSub = teamTank ? tankSubtypeOf(teamTank) : null;
    const teamDps = team.filter((n) => dpsClassOf(n));
    const teamSupports = team.filter((n) => supportClassOf(n));
    const enemyTags = new Set(enemies.flatMap((n) => dpsTagsOf(n)));
    const enemyHasDiveTank = enemies.some(
      (n) => tankSubtypeOf(n) === "dive",
    );
    const enemyHasAnchor = enemies.some(
      (n) => tankSubtypeOf(n) === "anchor" || tankSubtypeOf(n) === "bruiser",
    );

    // 1) 탱커 서브타입 ↔ 페어 영웅 가중
    if (tankSub && hero.role !== "Tank") {
      const tags = dpsTagsOf(hero.name);
      const sTags = supportTagsOf(hero.name);
      if (tankSub === "anchor") {
        if (hero.role === "Damage" && tags.includes("midRange")) {
          score += 2;
          reasons.push(`${ko(teamTank!)} 진형 유지에 맞는 중·장거리 지속딜`);
        }
        if (hero.role === "Support" && sTags.includes("sustain")) {
          score += 2;
          reasons.push(`${ko(teamTank!)} 진영 유지 라인에 적합한 지속 힐`);
        }
      } else if (tankSub === "bruiser") {
        if (
          hero.role === "Damage" &&
          (tags.includes("antiTank") || tags.includes("assassin"))
        ) {
          score += 2;
          reasons.push(`${ko(teamTank!)} 브루저 난전에 어울리는 픽`);
        }
        if (hero.role === "Support" && sTags.includes("save")) {
          score += 2;
          reasons.push(`브루저 ${ko(teamTank!)} 세이브에 강한 힐러`);
        }
      } else if (tankSub === "dive") {
        if (
          hero.role === "Damage" &&
          (tags.includes("assassin") || tags.includes("aggro"))
        ) {
          score += 3;
          reasons.push(`${ko(teamTank!)} 다이브와 강한 시너지`);
        }
        if (hero.role === "Support") {
          if (hero.name === "Lúcio") {
            score += 2;
            reasons.push("다이브 기동성 보강");
          }
          if (
            hero.name === "Ana" &&
            teamTank !== "Wrecking Ball"
          ) {
            score += 2;
            reasons.push("나노/수면으로 다이브 결정력 강화");
          }
          if (sTags.includes("save") || sTags.includes("poke")) {
            score += 1;
            reasons.push("다이브 라인을 받쳐주는 원거리 지원");
          }
        }
      }
    }

    // 2) 메인/서브 딜러 페어 이론
    if (hero.role === "Damage" && teamDps.length > 0) {
      const heroClass = dpsClassOf(hero.name);
      const teamClasses = teamDps
        .map((n) => dpsClassOf(n))
        .filter(Boolean);
      if (heroClass && teamClasses.length > 0) {
        const hasMain = teamClasses.includes("main");
        const hasFlex = teamClasses.includes("flex");
        if (heroClass === "main" && hasFlex && !hasMain) {
          score += 2;
          reasons.push("서브 딜러와 메인·서브 페어 형성");
        } else if (heroClass === "flex" && hasMain && !hasFlex) {
          score += 2;
          reasons.push("메인 딜러와 메인·서브 페어 형성");
        } else if (heroClass === "main" && hasMain) {
          score -= 2;
          reasons.push("메인+메인 페어는 결정력 부족(감점)");
        }
      }
    }

    // 3) 메인/서브 힐러 페어 이론
    if (hero.role === "Support" && teamSupports.length > 0) {
      const heroClass = supportClassOf(hero.name);
      const teamClasses = teamSupports
        .map((n) => supportClassOf(n))
        .filter(Boolean);
      if (heroClass && teamClasses.length > 0) {
        const hasMain = teamClasses.includes("main");
        const hasFlex = teamClasses.includes("flex");
        if (heroClass === "main" && hasFlex && !hasMain) {
          score += 2;
          reasons.push("서브 힐러와 메인·서브 페어 형성");
        } else if (heroClass === "flex" && hasMain && !hasFlex) {
          score += 2;
          reasons.push("메인 힐러와 메인·서브 페어 형성");
        } else if (heroClass === "main" && hasMain) {
          score -= 2;
          reasons.push("메인+메인 힐러는 변수 부족(감점)");
        }
      }
    }

    // 4) 공중 지원(파라/에코/프레야) 트리거 시 히트스캔 / 아나·메르시·브리기테
    const teamHasAerial = team.some((n) =>
      dpsTagsOf(n).includes("aerial"),
    );
    if (
      teamHasAerial &&
      hero.role === "Support" &&
      ["Ana", "Mercy", "Brigitte"].includes(hero.name)
    ) {
      score += 2;
      reasons.push("공중 딜러를 받쳐줄 지원가");
    }

    // 5) 저격수 ↔ 안티탱커/메인 딜러 페어
    const teamHasSniper = team.some((n) => dpsTagsOf(n).includes("sniper"));
    if (
      teamHasSniper &&
      hero.role === "Damage" &&
      (dpsTagsOf(hero.name).includes("antiTank") ||
        dpsClassOf(hero.name) === "main")
    ) {
      score += 1;
      reasons.push("저격수를 보완하는 안정적 화력");
    }

    // 6) 상대 조합 카운터 가중
    if (enemyTags.has("aerial") && hero.role === "Damage") {
      if (
        ["Soldier:76", "Ashe", "Cassidy", "Sojourn"].includes(hero.name)
      ) {
        score += 2;
        reasons.push("상대 공중 영웅 히트스캔 카운터");
      }
    }
    if (
      enemyHasDiveTank &&
      hero.role === "Support" &&
      supportTagsOf(hero.name).includes("antiDive")
    ) {
      score += 2;
      reasons.push("상대 다이브 견제용 안티다이브 지원가");
    }
    if (
      enemyHasAnchor &&
      hero.role === "Damage" &&
      dpsTagsOf(hero.name).includes("antiTank")
    ) {
      score += 1;
      reasons.push("상대 큰 히트박스 탱커 압박");
    }

    // 7) 검증된 힐러 페어 (나무위키) 매칭 가중
    for (const pair of SUPPORT_PAIRS) {
      const [a, b] = pair.supports;
      const hasA = team.includes(a);
      const hasB = team.includes(b);

      if (hasA && hasB) {
        // 페어 완성 → 추천 탱커/딜러 가중
        if (hero.role === "Tank" && pair.tanks.includes(hero.name)) {
          score += 3;
          reasons.push(`${pair.label} 페어가 선호하는 탱커`);
        }
        if (hero.role === "Damage" && pair.dps.includes(hero.name)) {
          score += 3;
          reasons.push(`${pair.label} 페어가 선호하는 딜러`);
        }
      } else if (
        hero.role === "Support" &&
        ((hasA && hero.name === b) || (hasB && hero.name === a))
      ) {
        // 페어의 다른 한쪽이 이미 팀에 있을 때 — 짝꿍 추천
        score += 3;
        reasons.push(`${pair.label} 조합 완성 (${pair.note})`);
      }
    }

    const sThreshold = map ? 8 : 4;
    const aThreshold = map ? 4 : 2;
    const tier: Tier =
      score >= sThreshold ? "S" : score >= aThreshold ? "A" : "B";
    return { hero, score, reasons, tier };
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 9);
}

const F = {
  display: { fontFamily: "'Rajdhani', sans-serif" } as React.CSSProperties,
  mono: { fontFamily: "'DM Mono', monospace" } as React.CSSProperties,
  body: { fontFamily: "'Inter', sans-serif" } as React.CSSProperties,
};

// ─── Hero Picker ──────────────────────────────────────────────────────────────

function HeroPicker({
  exclude,
  filter,
  onFilterChange,
  onSelect,
}: {
  exclude: string[];
  filter: HeroRole | "All";
  onFilterChange: (f: HeroRole | "All") => void;
  onSelect: (name: string) => void;
}) {
  const FILTER_LABEL: Record<HeroRole | "All", string> = {
    All: "전체",
    Tank: "탱커",
    Damage: "공격",
    Support: "지원",
  };

  const ROLE_SECTIONS: { role: HeroRole; label: string }[] = [
    { role: "Tank", label: "탱커" },
    { role: "Damage", label: "딜러" },
    { role: "Support", label: "힐러" },
  ];

  const HeroButton = ({ hero }: { hero: (typeof HEROES)[number] }) => {
    const koName = ko(hero.name);
    return (
      <button
        key={hero.name}
        onClick={() => onSelect(hero.name)}
        className="flex items-center px-2 py-1.5 hover:bg-white/10 transition-colors text-left group"
      >
        <span
          className="text-sm text-muted-foreground group-hover:text-white/90 transition-colors truncate leading-none"
          style={F.mono}
        >
          {koName.length > 6 ? koName.slice(0, 6) + "…" : koName}
        </span>
      </button>
    );
  };

  if (filter !== "All") {
    const filtered = HEROES.filter(
      (h) => !exclude.includes(h.name) && h.role === filter,
    );
    return (
      <div className="mt-2 border border-border bg-card">
        <div className="flex border-b border-border">
          {(["All", "Tank", "Damage", "Support"] as const).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`flex-1 py-1.5 text-sm tracking-widest transition-colors ${
                filter === f
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:text-white"
              }`}
              style={F.mono}
            >
              {FILTER_LABEL[f]}
            </button>
          ))}
        </div>
        <div className="p-2 grid grid-cols-2 sm:grid-cols-3 gap-0.5 max-h-48 overflow-y-auto">
          {filtered.map((hero) => (
            <HeroButton key={hero.name} hero={hero} />
          ))}
          {filtered.length === 0 && (
            <p
              className="col-span-2 sm:col-span-3 text-center text-sm text-muted-foreground py-4"
              style={F.mono}
            >
              선택 가능한 영웅 없음
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 border border-border bg-card">
      <div className="flex border-b border-border">
        {(["All", "Tank", "Damage", "Support"] as const).map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`flex-1 py-1.5 text-sm tracking-widest transition-colors ${
              filter === f
                ? "bg-white/10 text-white"
                : "text-muted-foreground hover:text-white"
            }`}
            style={F.mono}
          >
            {FILTER_LABEL[f]}
          </button>
        ))}
      </div>
      <div className="max-h-64 overflow-y-auto">
        {ROLE_SECTIONS.map(({ role, label }, idx) => {
          const heroes = HEROES.filter(
            (h) => !exclude.includes(h.name) && h.role === role,
          );
          if (heroes.length === 0) return null;
          return (
            <div key={role}>
              {idx > 0 && <div className="border-t border-border" />}
              <div
                className="px-3 py-1 text-xs text-muted-foreground/60 tracking-widest uppercase"
                style={F.mono}
              >
                {label}
              </div>
              <div className="px-2 pb-2 grid grid-cols-2 sm:grid-cols-3 gap-0.5">
                {heroes.map((hero) => (
                  <HeroButton key={hero.name} hero={hero} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Recommendation Card ──────────────────────────────────────────────────────

function RecommendationCard({
  rec,
  rank,
}: {
  rec: Recommendation;
  rank: number;
}) {
  const borderClass =
    rec.tier === "S"
      ? "border-yellow-400/80"
      : rec.tier === "A"
        ? "border-red-500/60"
        : "border-green-500/40";

  const displayScore = Math.min(rec.score - 1, 10);

  return (
    <div
      className={`border ${borderClass} p-4 hover:bg-white/3 transition-colors flex flex-col gap-3`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="border border-border shrink-0 overflow-hidden bg-white/5"
            style={{ width: 56, height: 56 }}
          >
            {heroImg(rec.hero.name) ? (
              <img
                src={heroImg(rec.hero.name)}
                alt={ko(rec.hero.name)}
                className="object-cover block"
                style={{ width: 56, height: 56 }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-sm font-bold tracking-wider"
                style={F.display}
              >
                {rec.hero.abbrev}
              </div>
            )}
          </div>
          <div>
            <h3
              className="text-2xl font-bold leading-tight"
              style={{ ...F.display, letterSpacing: "0.04em" }}
            >
              {ko(rec.hero.name)}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-muted-foreground" style={F.mono}>
                {ROLE_LABELS[rec.hero.role]}
              </span>
              <span className="text-white/65">·</span>
              <span className="text-sm text-muted-foreground" style={F.mono}>
                {rec.hero.compType.map((t) => COMP_KO[t]).join("/")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-sm text-muted-foreground" style={F.mono}>
            #{rank}
          </span>
          <span
            className={`text-sm px-1.5 py-0.5 font-bold ${
              rec.tier === "S"
                ? "bg-yellow-400 text-black"
                : rec.tier === "A"
                  ? "bg-red-500 text-white"
                  : "bg-green-600 text-white"
            }`}
            style={F.mono}
          >
            {rec.tier}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 transition-all ${
              i < displayScore
                ? rec.tier === "S"
                  ? "bg-yellow-400"
                  : rec.tier === "A"
                    ? "bg-red-500"
                    : "bg-green-500"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Reasons */}
      <ul className="space-y-1.5 flex-1">
        {rec.reasons.length > 0 ? (
          rec.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-white/55 mt-px text-sm">—</span>
              <span
                className="text-sm text-muted-foreground leading-relaxed"
                style={F.body}
              >
                {r}
              </span>
            </li>
          ))
        ) : (
          <li className="text-sm text-muted-foreground" style={F.body}>
            이 역할에 무난한 픽입니다.
          </li>
        )}
      </ul>
    </div>
  );
}

// ─── Sidebar Section Wrapper ──────────────────────────────────────────────────

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 border-b border-border last:border-b-0">
      <p
        className="text-sm tracking-widest uppercase text-muted-foreground font-semibold mb-3"
        style={F.mono}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── Hero Chip ────────────────────────────────────────────────────────────────

function HeroChip({
  name,
  abbrev,
  onRemove,
  variant = "team",
}: {
  name: string;
  abbrev: string;
  onRemove: () => void;
  variant?: "team" | "enemy";
}) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-sm ${
        variant === "enemy" ? "border-white/20" : "border-border"
      }`}
    >
      <span className="font-bold text-white/90 text-sm" style={F.display}>
        {abbrev}
      </span>
      <span className="text-muted-foreground" style={F.mono}>
        {(() => {
          const k = ko(name);
          return k.length > 7 ? k.slice(0, 7) + "…" : k;
        })()}
      </span>
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-white transition-colors ml-0.5"
        aria-label={`Remove ${name}`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Hero List View ───────────────────────────────────────────────────────────

function HeroListView() {
  const ROLE_SECTIONS: { role: HeroRole; label: string }[] = [
    { role: "Tank", label: "탱커" },
    { role: "Damage", label: "딜러" },
    { role: "Support", label: "힐러" },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["Dive", "Brawl", "Poke", "Anchor"] as CompType[]).map((type) => (
          <div key={type} className="border-4 border-white/50 flex flex-col">
            {/* 컴타입 헤더 */}
            <div className="px-4 py-3 border-b-2 border-white/50 bg-white/3 shrink-0">
              <p
                className="text-xl font-bold tracking-wide text-white mb-1"
                style={F.display}
              >
                {COMP_KO[type]}
              </p>
              <p
                className="text-[11px] text-white/40 leading-relaxed"
                style={F.mono}
              >
                {COMP_DESCRIPTIONS[type]}
              </p>
            </div>
            <div className="flex flex-col divide-y divide-white/9">
              {ROLE_SECTIONS.map(({ role, label }) => {
                const heroes = HEROES.filter(
                  (h) => h.compType.includes(type) && h.role === role,
                ).sort((a, b) =>
                  (HERO_KO[a.name] ?? a.name).localeCompare(
                    HERO_KO[b.name] ?? b.name,
                    "ko",
                  ),
                );
                if (heroes.length === 0) return null;
                return (
                  <div key={role} className="p-2 border-b-2 border-white/50">
                    <p
                      className="text-md font-bold text-white/30 tracking-[0.15em] uppercase mb-1.5 px-0.5"
                      style={F.mono}
                    >
                      {label}
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {heroes.map((hero) => (
                        <div
                          key={hero.name}
                          className="group flex flex-col gap-1"
                        >
                          <div className="overflow-hidden bg-white/5 border border-white/8 aspect-square">
                            <img
                              src={heroImg(hero.name)}
                              alt={ko(hero.name)}
                              className="w-full h-full object-cover object-top scale-110 group-hover:scale-[1.15] transition-transform duration-200"
                            />
                          </div>
                          <span
                            className="text-sm font-medium text-white/60 truncate group-hover:text-white transition-colors leading-none px-0.5"
                            style={F.body}
                          >
                            {ko(hero.name)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [role, setRole] = useState<HeroRole | null>(null);
  const [team, setTeam] = useState<string[]>([]);
  const [enemies, setEnemies] = useState<string[]>([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [teamPickerOpen, setTeamPickerOpen] = useState(false);
  const [enemyPickerOpen, setEnemyPickerOpen] = useState(false);
  const [pickerFilter, setPickerFilter] = useState<HeroRole | "All">("All");
  const [view, setView] = useState<"recommend" | "heroes">("recommend");

  const currentMap = MAPS.find((m) => m.name === selectedMap) ?? null;
  const hasInputs = !!(selectedMap || role || team.length || enemies.length);

  const recommendations = useMemo(
    () => computeRecommendations(currentMap, role, team, enemies),
    [currentMap, role, team, enemies],
  );

  const getHero = (name: string) => HEROES.find((h) => h.name === name);

  const addToTeam = (name: string) => {
    if (team.length < 5 && !team.includes(name)) {
      setTeam((prev) => [...prev, name]);
      if (team.length >= 4) setTeamPickerOpen(false);
    }
  };

  const addToEnemies = (name: string) => {
    if (enemies.length < 5 && !enemies.includes(name)) {
      setEnemies((prev) => [...prev, name]);
      if (enemies.length >= 4) setEnemyPickerOpen(false);
    }
  };

  const openTeamPicker = () => {
    setTeamPickerOpen((v) => !v);
    setEnemyPickerOpen(false);
    setPickerFilter("All");
  };

  const openEnemyPicker = () => {
    setEnemyPickerOpen((v) => !v);
    setTeamPickerOpen(false);
    setPickerFilter("All");
  };

  const gameTypeLabel = currentMap
    ? (GAMETYPE_KO[currentMap.gameType] ?? currentMap.gameType)
    : undefined;
  const compLabel = currentMap ? COMP_KO[currentMap.mapType] : undefined;
  const roleLabel = role ? ROLE_LABELS[role] : undefined;
  const statusLabel = hasInputs
    ? `결과 ${recommendations.length}개`
    : "입력 대기 중";

  return (
    <div
      className="w-full min-h-screen md:h-screen flex flex-col bg-background text-foreground md:overflow-hidden"
      style={F.body}
    >
      {/* ── HEADER ── */}
      <AppHeader
        displayStyle={F.display}
        monoStyle={F.mono}
        gameTypeLabel={gameTypeLabel}
        compLabel={compLabel}
        roleLabel={roleLabel}
        statusLabel={statusLabel}
      />

      {/* ── BODY ── */}
      <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden">
        {/* ── LEFT PANEL ── */}
        <aside className="w-full md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-border md:overflow-y-auto">
          {/* MAP */}
          <Section label="01 — 맵">
            <div className="relative">
              <button
                onClick={() => setMapOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2 border border-border hover:border-white/30 transition-colors text-left"
              >
                <span
                  className={`text-sm tracking-wide ${selectedMap ? "text-white" : "text-muted-foreground"}`}
                  style={F.display}
                >
                  {selectedMap
                    ? (MAP_KO[selectedMap] ?? selectedMap)
                    : "맵 선택"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${mapOpen ? "rotate-180" : ""}`}
                />
              </button>

              {mapOpen && (
                <div className="absolute top-full left-0 right-0 bg-card border border-border border-t-0 z-50 max-h-56 overflow-y-auto shadow-2xl">
                  {MAPS.map((map) => (
                    <button
                      key={map.name}
                      onClick={() => {
                        setSelectedMap(map.name);
                        setMapOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors text-left border-b border-border/40 last:border-0 ${
                        selectedMap === map.name ? "bg-white/5" : ""
                      }`}
                    >
                      <span className="text-sm" style={F.display}>
                        {MAP_KO[map.name] ?? map.name}
                      </span>
                      <span
                        className="text-sm text-muted-foreground"
                        style={F.mono}
                      >
                        {COMP_KO[map.mapType]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {currentMap && (
              <div className="flex flex-wrap gap-1 mt-3">
                {currentMap.features.map((f) => (
                  <span
                    key={f}
                    className="text-sm px-2 py-0.5 border border-border text-muted-foreground"
                    style={F.mono}
                  >
                    {FEATURE_KO[f] ?? f}
                  </span>
                ))}
              </div>
            )}
          </Section>

          {/* ROLE */}
          <Section label="02 — 내 역할">
            <div className="flex gap-1.5">
              {(["Tank", "Damage", "Support"] as HeroRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(role === r ? null : r)}
                  className={`flex-1 py-2 text-sm font-semibold tracking-widest transition-colors border ${
                    role === r
                      ? "bg-white text-black border-white"
                      : "border-border text-muted-foreground hover:border-white/30 hover:text-white"
                  }`}
                  style={F.mono}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </Section>

          {/* YOUR TEAM */}
          <Section
            label={`03 — 우리 팀${team.length ? ` (${team.length}/5)` : ""}`}
          >
            {team.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {team.map((name) => {
                  const h = getHero(name)!;
                  return (
                    <HeroChip
                      key={name}
                      name={name}
                      abbrev={h.abbrev}
                      onRemove={() =>
                        setTeam((t) => t.filter((x) => x !== name))
                      }
                      variant="team"
                    />
                  );
                })}
              </div>
            )}
            {team.length < 5 && (
              <button
                onClick={openTeamPicker}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors border border-dashed border-border hover:border-white/30 px-3 py-2 w-full"
                style={F.mono}
              >
                <Plus className="w-3 h-3" />
                영웅 추가
              </button>
            )}
            {teamPickerOpen && (
              <HeroPicker
                exclude={[...team, ...enemies]}
                filter={pickerFilter}
                onFilterChange={setPickerFilter}
                onSelect={addToTeam}
              />
            )}
          </Section>

          {/* ENEMY TEAM */}
          <Section
            label={`04 — 상대 팀${enemies.length ? ` (${enemies.length}/5)` : " (선택)"}`}
          >
            {enemies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {enemies.map((name) => {
                  const h = getHero(name)!;
                  return (
                    <HeroChip
                      key={name}
                      name={name}
                      abbrev={h.abbrev}
                      onRemove={() =>
                        setEnemies((e) => e.filter((x) => x !== name))
                      }
                      variant="enemy"
                    />
                  );
                })}
              </div>
            )}
            {enemies.length < 5 && (
              <button
                onClick={openEnemyPicker}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors border border-dashed border-white/15 hover:border-white/30 px-3 py-2 w-full"
                style={F.mono}
              >
                <Plus className="w-3 h-3" />적 추가
              </button>
            )}
            {enemyPickerOpen && (
              <HeroPicker
                exclude={[...team, ...enemies]}
                filter={pickerFilter}
                onFilterChange={setPickerFilter}
                onSelect={addToEnemies}
              />
            )}
          </Section>

          {/* RESET */}
          {hasInputs && (
            <div className="p-5">
              <button
                onClick={() => {
                  setSelectedMap(null);
                  setRole(null);
                  setTeam([]);
                  setEnemies([]);
                  setTeamPickerOpen(false);
                  setEnemyPickerOpen(false);
                }}
                className="text-sm text-muted-foreground hover:text-white transition-colors tracking-widest"
                style={F.mono}
              >
                — 모두 초기화
              </button>
            </div>
          )}
        </aside>

        {/* ── RIGHT PANEL ── */}
        <main className="flex-1 overflow-y-auto">
          {/* ── TABS ── */}
          <div className="sticky top-0 z-10 bg-background border-b border-border flex">
            {(["recommend", "heroes"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-5 py-3 text-sm font-medium tracking-wide transition-colors border-b-2 -mb-px ${
                  view === v
                    ? "border-white text-white"
                    : "border-transparent text-muted-foreground hover:text-white"
                }`}
                style={F.mono}
              >
                {v === "recommend" ? "추천" : "영웅 목록"}
              </button>
            ))}
          </div>

          {view === "heroes" ? (
            <HeroListView />
          ) : !hasInputs ? (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center h-full text-center px-6 md:px-16 py-12 md:py-0">
              <div className="w-20 h-px bg-white/10 mb-8" />
              <h2
                className="text-5xl font-bold mb-3 tracking-wide"
                style={F.display}
              >
                영웅 추천
              </h2>
              <p
                className="text-base text-muted-foreground max-w-sm leading-relaxed"
                style={F.body}
              >
                맵과 역할을 선택하고, 필요시 우리 팀·상대 팀 구성을 추가하세요.
                추천이 실시간으로 업데이트됩니다.
              </p>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center max-w-2xl w-full">
                {(["Dive", "Brawl", "Poke", "Anchor"] as CompType[]).map(
                  (type) => (
                    <div key={type} className="border border-border p-3">
                      <p
                        className="text-sm font-bold mb-2"
                        style={{ ...F.display, letterSpacing: "0.1em" }}
                      >
                        {COMP_KO[type]}
                      </p>
                      <p
                        className="text-sm text-muted-foreground leading-relaxed"
                        style={F.mono}
                      >
                        {COMP_DESCRIPTIONS[type]}
                      </p>
                    </div>
                  ),
                )}
              </div>
              <div className="w-20 h-px bg-white/10 mt-8" />
            </div>
          ) : (
            <div className="p-4 md:p-6">
              {/* MAP CONTEXT BAR */}
              {currentMap && (
                <div className="border border-border p-4 mb-6 flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-sm text-muted-foreground tracking-widest"
                        style={F.mono}
                      >
                        {GAMETYPE_KO[currentMap.gameType] ??
                          currentMap.gameType}
                      </span>
                      <span className="text-white/65">·</span>
                      <span
                        className="text-sm px-2 py-0.5 border border-white/25 text-white/85"
                        style={F.mono}
                      >
                        {COMP_KO[currentMap.mapType]}
                      </span>
                    </div>
                    <h2
                      className="text-3xl font-bold"
                      style={{ ...F.display, letterSpacing: "0.04em" }}
                    >
                      {MAP_KO[currentMap.name] ?? currentMap.name}
                    </h2>
                  </div>
                  <div className="text-left sm:text-right sm:max-w-60">
                    <p
                      className="text-sm text-muted-foreground mb-1 tracking-widest"
                      style={F.mono}
                    >
                      플레이스타일
                    </p>
                    <p
                      className="text-sm text-white/75 leading-relaxed"
                      style={F.body}
                    >
                      {COMP_DESCRIPTIONS[currentMap.mapType]}
                    </p>
                  </div>
                </div>
              )}

              {/* RESULT HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span
                  className="text-sm tracking-[0.2em] text-muted-foreground"
                  style={F.mono}
                >
                  {role ? `${ROLE_LABELS[role]} 픽` : "전체 픽"} — 영웅{" "}
                  {recommendations.length}명
                </span>
                <div
                  className="flex items-center gap-4 text-sm text-muted-foreground"
                  style={F.mono}
                >
                  <span>S — 최적</span>
                  <span>A — 강력</span>
                  <span>B — 상황별</span>
                </div>
              </div>

              {/* GRID */}
              {recommendations.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground border border-border">
                  <p className="text-sm" style={F.mono}>
                    현재 조건에 맞는 영웅이 없습니다.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recommendations.map((rec, i) => (
                    <RecommendationCard
                      key={rec.hero.name}
                      rec={rec}
                      rank={i + 1}
                    />
                  ))}
                </div>
              )}

              {/* SYNERGY SUMMARY — show when team has heroes */}
              {team.length >= 2 && (
                <div className="mt-6 border border-border p-4">
                  <p
                    className="text-sm tracking-[0.2em] text-muted-foreground mb-3"
                    style={F.mono}
                  >
                    팀 조합 분석
                  </p>
                  <div className="flex items-start gap-2 flex-wrap">
                    {team.map((name) => {
                      const h = getHero(name);
                      if (!h) return null;
                      return (
                        <div
                          key={name}
                          className="flex items-center gap-2 border border-border px-3 py-2"
                        >
                          <span
                            className="text-sm font-bold text-white/85"
                            style={F.display}
                          >
                            {h.abbrev}
                          </span>
                          <div>
                            <p
                              className="text-sm"
                              style={{ ...F.display, letterSpacing: "0.05em" }}
                            >
                              {ko(name)}
                            </p>
                            <p
                              className="text-sm text-muted-foreground"
                              style={F.mono}
                            >
                              {h.compType.map((t) => COMP_KO[t]).join("/")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div className="ml-auto text-right shrink-0">
                      {(() => {
                        const compCounts: Record<CompType, number> = {
                          Dive: 0,
                          Brawl: 0,
                          Poke: 0,
                          Anchor: 0,
                        };
                        team.forEach((name) => {
                          const h = getHero(name);
                          if (h) h.compType.forEach((t) => compCounts[t]++);
                        });
                        const dominant = (
                          Object.entries(compCounts) as [CompType, number][]
                        ).sort((a, b) => b[1] - a[1])[0];
                        return (
                          <>
                            <p
                              className="text-sm text-muted-foreground mb-1"
                              style={F.mono}
                            >
                              조합 성향
                            </p>
                            <p
                              className="text-sm font-bold"
                              style={{ ...F.display, letterSpacing: "0.08em" }}
                            >
                              {COMP_KO[dominant[0]]}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
