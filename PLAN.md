# 🎮 Overwatch 2 Hero Recommendation Service

## 1. 서비스 개요

오버워치2 유저들이 현재 게임 상황에 맞는 최적의 영웅을 빠르게 추천받을 수 있는 웹 서비스.

사용자는:

- 현재 플레이 중인 맵
- 자신이 플레이할 역할군 (탱커 / 딜러 / 힐러)
- 현재 팀 조합
- 페어 영웅
- 상대 조합 (선택)

등을 입력하면,
현재 상황에서 가장 적합한 영웅과 추천 이유를 확인할 수 있다.

---

# 2. 핵심 문제 정의

오버워치2에서는 다음과 같은 문제가 자주 발생한다.

- 맵에 어떤 영웅이 좋은지 모름
- 현재 팀 조합과 시너지가 나는 영웅을 모름
- 상대 조합 카운터를 모름
- 솔로 랭크에서 팀 조합이 꼬였을 때 무엇을 해야 하는지 모름
- 초보 유저는 조합 개념 자체가 어려움

현재 대부분의 정보는:

- 유튜브 영상
- 티어표
- 긴 공략글

형태로 제공되어 즉시 활용하기 어렵다.

본 서비스는:

> "지금 상황에서 내가 무엇을 해야 하는가?"

를 즉시 알려주는 것을 목표로 한다.

---

# 3. 핵심 기능

## 3-1. 맵 기반 추천

### 입력

- 현재 맵 선택

### 출력

- 해당 맵에서 강한 조합 타입
- 추천 영웅
- 추천 이유

### 예시

#### 입력

- 맵: Gibraltar

#### 출력

- 추천 조합: Dive
- 추천 영웅:
  - Winston
  - Tracer
  - Genji

#### 이유

- 고지대가 많음
- 수직 이동 중요
- 빠른 진입 유리

---

## 3-2. 역할 기반 추천

사용자가 플레이할 역할군을 선택하면
현재 팀 조합에 맞는 영웅을 추천한다.

### 입력

- 역할군 선택
  - Tank
  - Damage
  - Support

### 예시

#### 현재 팀

- Tank: Winston
- Support: Ana

#### 사용자 역할

- Damage

#### 추천 결과

- Tracer
- Genji
- Echo

#### 이유

- Winston Dive 진입 연계 가능
- Ana 나노 시너지 가능
- 고지대 활용 가능

---

## 3-3. 페어 시너지 추천

특정 영웅과 강한 시너지를 가지는 영웅 추천.

### 예시

| 영웅     | 추천 페어         |
| -------- | ----------------- |
| Ana      | Genji, Winston    |
| Mercy    | Pharah, Echo      |
| Lucio    | Reinhardt, Reaper |
| Kiriko   | Winston, Tracer   |
| Zenyatta | Sigma             |

---

## 3-4. 상대 조합 카운터 추천

상대 영웅 입력 시 카운터 영웅 추천.

### 예시

#### 상대 조합

- Pharah
- Mercy

#### 추천

- Cassidy
- Ashe
- Soldier:76

#### 이유

- 히트스캔 압박 가능
- 공중 조합 견제 가능

---

# 4. 추천 시스템 구조

## 4-1. 조합 타입

서비스는 모든 영웅을 크게 3가지 조합 구조로 분류한다.

### Dive

빠른 진입 및 백라인 암살 중심

#### 대표 영웅

- Winston
- D.Va
- Tracer
- Genji
- Echo
- Kiriko

---

### Brawl / Rush

근접 교전 및 유지력 중심

#### 대표 영웅

- Reinhardt
- Reaper
- Mei
- Lucio
- Baptiste

---

### Poke

원거리 견제 중심

#### 대표 영웅

- Sigma
- Ashe
- Widowmaker
- Sojourn
- Zenyatta

---

# 5. 맵 데이터 구조

## 예시

```ts
type MapInfo = {
  name: string;
  mapType: "Dive" | "Brawl" | "Poke";
  features: string[];
  recommendedHeroes: string[];
};

const maps = [
  {
    name: "Gibraltar",
    mapType: "Dive",
    features: ["highground", "vertical", "longRotation"],
    recommendedHeroes: ["Winston", "Tracer", "Genji", "Echo"],
  },
];
```
