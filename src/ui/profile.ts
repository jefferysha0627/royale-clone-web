import { CARDS, decodeReplay, type AiLevel, type GameMode, type MatchResult } from '../sim';
import { crownSvg, fillCard } from './cardview';
import { modeInfo } from './modes';
import { arenaOf } from './progress';
import { LOG_MAX, type BattleLogEntry, type Settings } from './settings';

// 個人資料與對戰紀錄：最高獎盃、三皇冠勝場、最常出的卡，以及最近幾場的雙方牌組、皇冠與獎盃增減。全部只存在本機。

const LEVEL_NAME: Record<AiLevel, string> = { easy: '簡單', normal: '普通', hard: '困難' };

export interface MatchInfo {
  foe: string;
  foeCards: string[];
  level: AiLevel;
  deck: string[];
  plays: Record<string, number>;
  mode?: GameMode;
}

/** 一場打完（獎盃已更新後呼叫）：更新最高獎盃、三皇冠勝場、出牌統計，並把這場加到對戰紀錄最前面。 */
export function recordBattle(s: Settings, r: MatchResult, info: MatchInfo, delta: number, now = Date.now(), rep?: string): void {
  s.bestTrophies = Math.max(s.bestTrophies, s.trophies);
  if (r.winner === 0 && r.crowns[0] >= 3) s.threeCrowns++;
  for (const [id, n] of Object.entries(info.plays)) s.cardPlays[id] = (s.cardPlays[id] ?? 0) + n;
  const m = info.mode && info.mode !== 'normal' ? info.mode : undefined;
  s.log.unshift({ at: now, w: r.winner, c: [r.crowns[0], r.crowns[1]], lvl: info.level, foe: info.foe, foeCards: [...info.foeCards], deck: [...info.deck], d: delta, t: s.trophies, rep, m });
  if (s.log.length > LOG_MAX) s.log.length = LOG_MAX;
}

export function favoriteCard(s: Settings): { id: string; n: number } | null {
  let best: { id: string; n: number } | null = null;
  for (const [id, n] of Object.entries(s.cardPlays)) if (!best || n > best.n || (n === best.n && id < best.id)) best = { id, n };
  return best;
}

export function timeAgo(at: number, now = Date.now()): string {
  const m = Math.floor((now - at) / 60000);
  if (m < 1) return '剛剛';
  if (m < 60) return `${m} 分鐘前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小時前`;
  return `${Math.floor(h / 24)} 天前`;
}

export function profileRows(s: Settings): [string, string][] {
  const { win, lose, draw } = s.record;
  const total = win + lose + draw;
  const fav = favoriteCard(s);
  return [
    ['最高獎盃', String(s.bestTrophies)],
    ['目前競技場', arenaOf(s.trophies).name],
    ['勝場', String(win)],
    ['三皇冠勝利', String(s.threeCrowns)],
    ['敗場・平手', `${lose} 敗・${draw} 平`],
    ['勝率', total ? `${Math.round((win / total) * 100)}%（${total} 場）` : '—'],
    ['最常出的卡', fav ? `${CARDS[fav.id].name}（${fav.n} 次）` : '—'],
  ];
}

const RESULT: Record<string, { cls: string; text: string }> = {
  win: { cls: 'win', text: '勝利' },
  lose: { cls: 'lose', text: '落敗' },
  draw: { cls: 'draw', text: '平手' },
};

function miniDeck(cards: string[], label: string): HTMLElement {
  const row = document.createElement('div');
  row.className = 'mini-deck log-deck';
  row.setAttribute('aria-label', label);
  for (const id of cards) {
    const el = document.createElement('div');
    el.className = 'card';
    fillCard(el, id);
    row.appendChild(el);
  }
  return row;
}

/** 畫出對戰紀錄（最多 limit 筆）；沒有紀錄時顯示提示。有重播的那幾筆會有「重播」按鈕（onReplay）。 */
export function renderBattleLog(list: HTMLElement, log: BattleLogEntry[], limit = 10, now = Date.now(), onReplay?: (rep: string) => void): void {
  list.innerHTML = '';
  if (!log.length) {
    const li = document.createElement('li');
    li.className = 'log-empty';
    li.textContent = '還沒有對戰紀錄，打一場就會出現在這裡。';
    list.appendChild(li);
    return;
  }
  const crown = crownSvg();
  for (const e of log.slice(0, limit)) {
    const res = RESULT[e.w === 0 ? 'win' : e.w === 1 ? 'lose' : 'draw'];
    const li = document.createElement('li');
    li.className = `log-item ${res.cls}`;
    const top = document.createElement('div');
    top.className = 'log-top';
    const ev = modeInfo(e.m);
    // 活動對戰不計獎盃：右側改顯示活動名稱
    const delta = ev ? ev.name : e.d > 0 ? `+${e.d}` : e.d < 0 ? String(e.d) : '±0';
    top.innerHTML =
      `<b class="log-res">${res.text}</b>` +
      `<span class="log-crowns" aria-label="皇冠 ${e.c[0]} 比 ${e.c[1]}"><i class="me">${crown}</i>${e.c[0]} : ${e.c[1]}<i class="foe">${crown}</i></span>` +
      `<span class="log-delta ${ev ? 'event' : e.d < 0 ? 'down' : ''}">${delta}</span>`;
    if (e.rep && onReplay && decodeReplay(e.rep)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'log-replay';
      b.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4l10 6-10 6z" /></svg>重播';
      b.setAttribute('aria-label', '觀看這場的重播');
      const rep = e.rep;
      b.addEventListener('click', () => onReplay(rep));
      top.appendChild(b);
    }
    const meta = document.createElement('small');
    meta.className = 'log-meta';
    meta.textContent = `對手：${LEVEL_NAME[e.lvl]}電腦（${e.foe}）・${timeAgo(e.at, now)}`;
    li.append(top, miniDeck(e.deck, '你的牌組'), miniDeck(e.foeCards, '電腦的牌組'), meta);
    list.appendChild(li);
  }
}
