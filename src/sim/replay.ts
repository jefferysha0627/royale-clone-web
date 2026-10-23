// 對戰重播：模擬是固定步長＋固定 seed 的確定性運算，只要記下雙方每次成功出牌（第幾步、哪一方、哪張卡、落點），
// 用同一組 seed 與牌組重跑就會得到一模一樣的對戰。重播編成可以放進網址的短字串，方便分享給朋友看。

import { AI_DECKS, CARDS } from './cards';
import { GAME_MODES, Game, type GameMode, type Team } from './game';
import type { AiLevel } from './ai';

/** 模擬規則（數值、機制）改變時要更新這個版本號，舊版本的重播就不會被誤播成不同的結果。 */
export const REPLAY_VERSION = 'r1';

export interface ReplayAction {
  t: number; // 第幾個模擬步（出牌發生在這一步執行之前）
  team: Team;
  c: string; // 卡牌 id
  x: number; // 對齊後的落點
  y: number;
}

export interface Replay {
  seed: number;
  decks: [string[], string[]];
  actions: ReplayAction[];
  foe: string; // 電腦牌組名稱（只用來顯示）
  lvl: AiLevel;
  arena: number; // 場地配色
  mode?: GameMode; // 活動模式（省略 = 一般對戰）
}

const LVLS: AiLevel[] = ['easy', 'normal', 'hard'];

function toB64(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64(s: string): Uint8Array | null {
  try {
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

/**
 * 編成字串：版本.seed.場地難度[模式].牌組A.牌組B.電腦牌組編號.出牌紀錄（每筆 5 bytes：步數 2、隊伍＋牌組位置 1、x×2、y×2）。
 * 一般對戰不寫模式那一碼，和加入活動模式之前的連結相容。
 */
export function encodeReplay(r: Replay): string {
  const slots = r.decks.map((d) => new Map(d.map((id, i) => [id, i])));
  const bytes = new Uint8Array(r.actions.length * 5);
  r.actions.forEach((a, i) => {
    const slot = slots[a.team].get(a.c) ?? 0;
    bytes[i * 5] = (a.t >> 8) & 255;
    bytes[i * 5 + 1] = a.t & 255;
    bytes[i * 5 + 2] = (a.team << 3) | slot;
    bytes[i * 5 + 3] = Math.round(a.x * 2) & 255;
    bytes[i * 5 + 4] = Math.round(a.y * 2) & 255;
  });
  const foeIdx = AI_DECKS.findIndex((d) => d.name === r.foe);
  return [
    REPLAY_VERSION,
    (r.seed >>> 0).toString(36),
    `${r.arena}${Math.max(0, LVLS.indexOf(r.lvl))}${r.mode && r.mode !== 'normal' ? GAME_MODES.indexOf(r.mode) : ''}`,
    r.decks[0].join('~'),
    r.decks[1].join('~'),
    String(foeIdx),
    toB64(bytes),
  ].join('.');
}

/** 解開重播字串；版本不同或內容不合法時回傳 null。 */
export function decodeReplay(s: string): Replay | null {
  const parts = s.split('.');
  if (parts.length !== 7 || parts[0] !== REPLAY_VERSION) return null;
  const seed = parseInt(parts[1], 36);
  if (!Number.isFinite(seed)) return null;
  const arena = Number(parts[2][0]);
  const lvl = LVLS[Number(parts[2][1])];
  const mode = parts[2].length === 3 ? GAME_MODES[Number(parts[2][2])] : 'normal';
  if (!mode || parts[2].length > 3) return null;
  const decks = [parts[3].split('~'), parts[4].split('~')] as [string[], string[]];
  if (!lvl || !Number.isInteger(arena) || decks.some((d) => d.length !== 8 || new Set(d).size !== 8 || d.some((id) => !(id in CARDS)))) return null;
  const foeIdx = Number(parts[5]);
  const bytes = fromB64(parts[6]);
  if (!bytes || bytes.length % 5 !== 0) return null;
  const actions: ReplayAction[] = [];
  let last = -1;
  for (let i = 0; i < bytes.length; i += 5) {
    const t = (bytes[i] << 8) | bytes[i + 1];
    const team = (bytes[i + 2] >> 3) as Team;
    const slot = bytes[i + 2] & 7;
    if (team > 1 || t < last) return null;
    last = t;
    actions.push({ t, team, c: decks[team][slot], x: bytes[i + 3] / 2, y: bytes[i + 4] / 2 });
  }
  return { seed, decks, actions, foe: AI_DECKS[foeIdx]?.name ?? '自訂牌組', lvl, arena, mode };
}

/** 建立重播用的對戰：和正式對戰一樣先替電腦分出一條亂數流（保持主亂數同步），但不放電腦對手。 */
export function newReplayGame(r: Replay): Game {
  const g = new Game({ seed: r.seed, decks: [[...r.decks[0]], [...r.decks[1]]], mode: r.mode });
  g.rng.fork();
  return g;
}

/** 在這一步執行之前，套用所有排在這一步的出牌；回傳下一筆要套用的位置。 */
export function applyReplayStep(g: Game, actions: readonly ReplayAction[], cursor: number): number {
  while (cursor < actions.length && actions[cursor].t <= g.tick) {
    const a = actions[cursor++];
    if (a.t < g.tick) continue;
    const idx = g.players[a.team].hand.indexOf(a.c);
    if (idx >= 0) g.deploy(a.team, idx, a.x, a.y);
  }
  return cursor;
}

/** 不經畫面直接跑完整場重播（測試用）。 */
export function runReplay(r: Replay, maxSteps = 30 * 600): Game {
  const g = newReplayGame(r);
  let cursor = 0;
  for (let i = 0; i < maxSteps && g.phase !== 'ended'; i++) {
    cursor = applyReplayStep(g, r.actions, cursor);
    g.step();
    g.drainEvents();
  }
  return g;
}
