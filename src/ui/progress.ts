import type { AiLevel, Team } from '../sim';

// 獎盃與競技場：贏電腦拿獎盃、輸了扣一點，累積到門檻就換到下一座競技場（場地配色不同）。
// 只存在本機；名稱與門檻為本作自訂。

export interface Arena {
  min: number; // 需要的獎盃數
  name: string;
  theme: number; // 場地配色編號（render3d/arena.ts 的 ARENA_THEMES）
}

export const ARENAS: Arena[] = [
  { min: 0, name: '綠野競技場', theme: 0 },
  { min: 300, name: '石橋要塞', theme: 1 },
  { min: 700, name: '楓紅山谷', theme: 2 },
  { min: 1200, name: '月光湖畔', theme: 3 },
  { min: 1800, name: '雷霆高地', theme: 4 },
  { min: 2600, name: '黃金王座', theme: 5 },
];

export function arenaIndex(trophies: number): number {
  let i = 0;
  while (i + 1 < ARENAS.length && trophies >= ARENAS[i + 1].min) i++;
  return i;
}

export function arenaOf(trophies: number): Arena {
  return ARENAS[arenaIndex(trophies)];
}

/** 到下一座競技場的進度（0～1）與還差幾座獎盃；已是最後一座時 next 為 null。 */
export function arenaProgress(trophies: number): { next: Arena | null; need: number; frac: number } {
  const i = arenaIndex(trophies);
  const next = ARENAS[i + 1] ?? null;
  if (!next) return { next: null, need: 0, frac: 1 };
  const cur = ARENAS[i].min;
  return { next, need: next.min - trophies, frac: (trophies - cur) / (next.min - cur) };
}

const WIN: Record<AiLevel, number> = { easy: 20, normal: 30, hard: 40 };
const LOSS: Record<AiLevel, number> = { easy: 5, normal: 12, hard: 18 };

/** 一場的獎盃增減：贏的難度越高拿越多；輸了扣少一點；平手不變。獎盃不會低於 0。 */
export function trophyDelta(level: AiLevel, winner: Team | null, crowns: number, current: number): number {
  if (winner === null) return 0;
  if (winner === 0) return WIN[level] + (crowns >= 3 ? 5 : 0);
  return -Math.min(current, LOSS[level]);
}
