import { useState, useMemo, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
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
import { HERO_PERKS, recommendedPerks } from "./data/perks";

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
    const enemyHasDiveTank = enemies.some((n) => tankSubtypeOf(n) === "dive");
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
          if (hero.name === "Ana" && teamTank !== "Wrecking Ball") {
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
      const teamClasses = teamDps.map((n) => dpsClassOf(n)).filter(Boolean);
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
    const teamHasAerial = team.some((n) => dpsTagsOf(n).includes("aerial"));
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
      if (["Soldier:76", "Ashe", "Cassidy", "Sojourn"].includes(hero.name)) {
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

// ─── Hero Autocomplete ────────────────────────────────────────────────────────

const ROLE_BADGE: Record<HeroRole, string> = {
  Tank: "돌격",
  Damage: "공격",
  Support: "지원",
};

function HeroAutocomplete({
  exclude,
  onSelect,
  placeholder,
  disabled,
}: {
  exclude: string[];
  onSelect: (name: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [focused, setFocused] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = HEROES.filter((h) => !exclude.includes(h.name));
    if (!q) return pool.slice(0, 8);
    return pool
      .filter((h) => {
        const ko = (HERO_KO[h.name] ?? "").toLowerCase();
        const en = h.name.toLowerCase();
        const ab = h.abbrev.toLowerCase();
        return ko.includes(q) || en.includes(q) || ab.includes(q);
      })
      .slice(0, 8);
  }, [query, exclude]);

  const safeHighlight = highlight >= matches.length ? 0 : highlight;

  const commit = (idx: number) => {
    const hero = matches[idx];
    if (!hero) return;
    onSelect(hero.name);
    setQuery("");
    setHighlight(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 IME 조합 중에는 Enter/Tab이 확정용이므로 무시
    if (
      e.nativeEvent.isComposing ||
      (e as unknown as { keyCode: number }).keyCode === 229
    ) {
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(safeHighlight);
    } else if (e.key === "Tab" && matches.length > 0 && query.trim() !== "") {
      // 후보가 있고 입력 중이면 Tab으로 선택, 그 뒤 자연스럽게 다음 입력으로 포커스 이동
      e.preventDefault();
      commit(safeHighlight);
      // 폼 흐름: 다음 input/button으로 이동
      const form = (e.currentTarget.closest("aside") ||
        document) as HTMLElement;
      const focusables = Array.from(
        form.querySelectorAll<HTMLElement>(
          "input, button, [tabindex]:not([tabindex='-1'])",
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      const idx = focusables.indexOf(e.currentTarget);
      const next = focusables[idx + 1];
      if (next) next.focus();
    } else if (e.key === "Escape") {
      setQuery("");
      setHighlight(0);
      (e.target as HTMLInputElement).blur();
    }
  };

  const showList = focused && matches.length > 0;

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setHighlight(0);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? "영웅 이름 입력 (Tab/Enter로 선택)"}
        disabled={disabled}
        className="w-full px-3 py-2 bg-transparent border border-border focus:border-white/40 outline-none text-sm text-white placeholder:text-muted-foreground transition-colors"
        style={F.mono}
      />
      {showList && (
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-1 border border-border bg-card z-40 max-h-64 overflow-y-auto shadow-2xl"
        >
          {matches.map((hero, i) => {
            const koName = HERO_KO[hero.name] ?? hero.name;
            const active = i === safeHighlight;
            return (
              <button
                key={hero.name}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(i);
                }}
                onMouseEnter={() => setHighlight(i)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors ${
                  active ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="text-sm font-bold text-white/85 w-9 shrink-0"
                    style={F.display}
                  >
                    {hero.abbrev}
                  </span>
                  <span className="text-sm text-white/90" style={F.mono}>
                    {koName}
                  </span>
                </span>
                <span
                  className="text-xs text-muted-foreground tracking-widest"
                  style={F.mono}
                >
                  {ROLE_BADGE[hero.role]}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Map Combobox ─────────────────────────────────────────────────────────────

function MapCombobox({
  selected,
  open,
  setOpen,
  onSelect,
}: {
  selected: string | null;
  open: boolean;
  setOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  onSelect: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MAPS;
    return MAPS.filter((m) => {
      const ko = (MAP_KO[m.name] ?? "").toLowerCase();
      const en = m.name.toLowerCase();
      const gt = (GAMETYPE_KO[m.gameType] ?? m.gameType).toLowerCase();
      const ct = COMP_KO[m.mapType].toLowerCase();
      return (
        ko.includes(q) || en.includes(q) || gt.includes(q) || ct.includes(q)
      );
    });
  }, [query]);

  const safeHighlight = highlight >= matches.length ? 0 : highlight;

  const commit = (idx: number) => {
    const map = matches[idx];
    if (!map) return;
    onSelect(map.name);
    setQuery("");
    setHighlight(0);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.nativeEvent.isComposing ||
      (e as unknown as { keyCode: number }).keyCode === 229
    ) {
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(safeHighlight);
    } else if (e.key === "Tab" && matches.length > 0 && query.trim() !== "") {
      e.preventDefault();
      commit(safeHighlight);
    } else if (e.key === "Escape") {
      setQuery("");
      setOpen(false);
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center border border-border focus-within:border-white/40 transition-colors">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={handleKeyDown}
          placeholder={
            selected ? (MAP_KO[selected] ?? selected) : "맵 검색 또는 선택"
          }
          className="flex-1 px-3 py-2 bg-transparent outline-none text-sm text-white placeholder:text-muted-foreground"
          style={F.mono}
        />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setOpen((v) => !v);
          }}
          className="px-2 py-2 text-muted-foreground hover:text-white"
          aria-label="맵 목록 열기"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && matches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border z-50 max-h-56 overflow-y-auto shadow-2xl">
          {matches.map((map, i) => {
            const active = i === safeHighlight;
            return (
              <button
                key={map.name}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(i);
                }}
                onMouseEnter={() => setHighlight(i)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left border-b border-border/40 last:border-0 transition-colors ${
                  active
                    ? "bg-white/10"
                    : selected === map.name
                      ? "bg-white/5"
                      : "hover:bg-white/5"
                }`}
              >
                <span className="text-sm" style={F.display}>
                  {MAP_KO[map.name] ?? map.name}
                </span>
                <span className="text-sm text-muted-foreground" style={F.mono}>
                  {COMP_KO[map.mapType]}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Recommendation Card ──────────────────────────────────────────────────────

function RecommendationCard({
  rec,
  rank,
  team,
  enemies,
}: {
  rec: Recommendation;
  rank: number;
  team: string[];
  enemies: string[];
}) {
  const perkRec = recommendedPerks(rec.hero.name, { team, enemies });
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

      {/* Perks */}
      {(perkRec.minor || perkRec.major) && (
        <div className="border-t border-border/60 pt-2.5 mt-1 space-y-1.5">
          <p
            className="text-xs tracking-[0.2em] text-muted-foreground/80 uppercase"
            style={F.mono}
          >
            추천 특전
          </p>
          {(["minor", "major"] as const).map((tier) => {
            const r = perkRec[tier];
            if (!r) return null;
            return (
              <div
                key={tier}
                className="flex items-start gap-2 p-2 border border-yellow-300/70 bg-yellow-300/10 shadow-[0_0_12px_rgba(253,224,71,0.25)]"
              >
                <span
                  className={`text-[10px] px-1.5 py-0.5 font-bold mt-0.5 shrink-0 bg-yellow-300 text-black`}
                  style={F.mono}
                >
                  {tier === "minor" ? "소형" : "주요"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span
                      className="text-sm font-bold text-yellow-300"
                      style={{
                        ...F.display,
                        textShadow: "0 0 8px rgba(253, 224, 71, 0.6)",
                      }}
                    >
                      {r.perk.nameKo}
                    </span>
                    <span className="text-xs text-yellow-200/80" style={F.mono}>
                      {r.perk.preference}%
                    </span>
                    {r.bonusReason && (
                      <span className="text-xs text-yellow-200" style={F.mono}>
                        · {r.bonusReason}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs text-white/75 leading-snug"
                    style={F.body}
                  >
                    {r.perk.descriptionKo}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
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

// ─── Perks View ───────────────────────────────────────────────────────────────

function PerksView({ team, enemies }: { team: string[]; enemies: string[] }) {
  const [roleFilter, setRoleFilter] = useState<HeroRole | "All">("All");
  const [search, setSearch] = useState("");

  const ROLES: { key: HeroRole | "All"; label: string }[] = [
    { key: "All", label: "전체" },
    { key: "Tank", label: "돌격" },
    { key: "Damage", label: "공격" },
    { key: "Support", label: "지원" },
  ];

  const filteredHeroes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return HEROES.filter((h) => {
      if (!HERO_PERKS[h.name]) return false;
      if (roleFilter !== "All" && h.role !== roleFilter) return false;
      if (!q) return true;
      const ko = (HERO_KO[h.name] ?? "").toLowerCase();
      return ko.includes(q) || h.name.toLowerCase().includes(q);
    }).sort((a, b) =>
      (HERO_KO[a.name] ?? a.name).localeCompare(
        HERO_KO[b.name] ?? b.name,
        "ko",
      ),
    );
  }, [roleFilter, search]);

  return (
    <div className="p-4 md:p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="영웅 검색"
          className="flex-1 px-3 py-2 bg-transparent border border-border focus:border-white/40 outline-none text-sm text-white placeholder:text-muted-foreground"
          style={F.mono}
        />
        <div className="flex gap-1">
          {ROLES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRoleFilter(r.key)}
              className={`px-3 py-2 text-sm tracking-widest border transition-colors ${
                roleFilter === r.key
                  ? "bg-white text-black border-white"
                  : "border-border text-muted-foreground hover:border-white/30 hover:text-white"
              }`}
              style={F.mono}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <p
        className="text-xs text-muted-foreground mb-3 tracking-widest"
        style={F.mono}
      >
        커뮤니티 선호도 (owperks.com) · 노란색 = 현재 상대/팀 조합에 따른 맥락
        추천
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredHeroes.map((hero) => {
          const perks = HERO_PERKS[hero.name];
          const rec = recommendedPerks(hero.name, { team, enemies });
          return (
            <div key={hero.name} className="border border-border p-3">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="border border-border shrink-0 overflow-hidden bg-white/5"
                  style={{ width: 40, height: 40 }}
                >
                  {heroImg(hero.name) ? (
                    <img
                      src={heroImg(hero.name)}
                      alt={ko(hero.name)}
                      className="object-cover block"
                      style={{ width: 40, height: 40 }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-xs font-bold"
                      style={F.display}
                    >
                      {hero.abbrev}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-base font-bold"
                    style={{ ...F.display, letterSpacing: "0.04em" }}
                  >
                    {ko(hero.name)}
                  </h4>
                  <span
                    className="text-xs text-muted-foreground"
                    style={F.mono}
                  >
                    {ROLE_LABELS[hero.role]}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {(["minor", "major"] as const).map((tier) => {
                  const tierPerks = perks.filter((p) => p.tier === tier);
                  return (
                    <div key={tier}>
                      <p
                        className="text-[10px] text-muted-foreground/70 tracking-[0.2em] uppercase mb-1"
                        style={F.mono}
                      >
                        {tier === "minor" ? "소형 특전" : "주요 특전"}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {tierPerks.map((p) => {
                          const isPick =
                            (tier === "minor"
                              ? rec.minor?.perk.nameKo
                              : rec.major?.perk.nameKo) === p.nameKo;
                          const bonus =
                            isPick &&
                            (tier === "minor"
                              ? rec.minor?.bonusReason
                              : rec.major?.bonusReason);
                          return (
                            <div
                              key={p.nameKo}
                              className={`p-2 border text-xs ${
                                isPick
                                  ? "border-yellow-300 bg-yellow-300/10 shadow-[0_0_12px_rgba(253,224,71,0.3)]"
                                  : "border-border/60"
                              }`}
                            >
                              <div className="flex items-baseline justify-between gap-1 mb-0.5">
                                <span
                                  className={
                                    isPick
                                      ? "font-bold text-yellow-300"
                                      : "font-semibold text-white/90"
                                  }
                                  style={
                                    isPick
                                      ? {
                                          ...F.display,
                                          textShadow:
                                            "0 0 8px rgba(253, 224, 71, 0.6)",
                                        }
                                      : F.display
                                  }
                                >
                                  {p.nameKo}
                                </span>
                                <span
                                  className={
                                    isPick
                                      ? "text-yellow-200/80 shrink-0"
                                      : "text-muted-foreground shrink-0"
                                  }
                                  style={F.mono}
                                >
                                  {p.preference}%
                                </span>
                              </div>
                              <p
                                className={
                                  isPick
                                    ? "text-white/80 leading-snug"
                                    : "text-muted-foreground leading-snug"
                                }
                                style={F.body}
                              >
                                {p.descriptionKo}
                              </p>
                              {bonus && (
                                <p
                                  className="text-yellow-200 mt-1"
                                  style={F.mono}
                                >
                                  · {bonus}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {filteredHeroes.length === 0 && (
          <p
            className="col-span-full text-center text-sm text-muted-foreground py-10"
            style={F.mono}
          >
            결과가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Hero List View ───────────────────────────────────────────────────────────

function HeroListView() {
  const ROLE_SECTIONS: { role: HeroRole; label: string }[] = [
    { role: "Tank", label: "돌격" },
    { role: "Damage", label: "공격" },
    { role: "Support", label: "지원" },
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
  const [view, setView] = useState<"recommend" | "heroes" | "perks">(
    "recommend",
  );

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
    }
  };

  const addToEnemies = (name: string) => {
    if (enemies.length < 5 && !enemies.includes(name)) {
      setEnemies((prev) => [...prev, name]);
    }
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
            <MapCombobox
              selected={selectedMap}
              open={mapOpen}
              setOpen={setMapOpen}
              onSelect={setSelectedMap}
            />

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
              <HeroAutocomplete
                exclude={team}
                onSelect={addToTeam}
                placeholder="우리 팀 영웅 입력"
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
              <HeroAutocomplete
                exclude={enemies}
                onSelect={addToEnemies}
                placeholder="상대 팀 영웅 입력"
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
            {(["recommend", "heroes", "perks"] as const).map((v) => (
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
                {v === "recommend"
                  ? "추천"
                  : v === "heroes"
                    ? "영웅 목록"
                    : "특전"}
              </button>
            ))}
          </div>

          {view === "perks" ? (
            <PerksView team={team} enemies={enemies} />
          ) : view === "heroes" ? (
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
                      team={team}
                      enemies={enemies}
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
