import { drawIcon, ICONS } from '../art/icons';
import { ARENA, CARDS, UNITS, Game, type Entity, type GameEvent, type Team } from '../sim';
import type { BattleRenderer, DeployPreview } from './types';

// WebGL 不可用時的 2D 備援畫面：全部以 Canvas 繪製，不使用外部圖檔。
/** 單位外觀比碰撞半徑大一些，手機小螢幕才看得清楚（不影響戰鬥判定）。 */
const UNIT_VISUAL_SCALE = 1.3;
const TEAM_COLORS: Record<Team, { main: string; dark: string; light: string }> = {
  0: { main: '#2f6fe0', dark: '#1d438a', light: '#8fb6ff' },
  1: { main: '#d8423a', dark: '#8a2620', light: '#ff9d94' },
};

interface Effect {
  kind: 'ring' | 'spark' | 'puff' | 'text' | 'boom' | 'bolt';
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  r: number;
  t: number; // 已經過時間
  life: number;
  color: string;
  text?: string;
}

/** 單位的單字圖示（沒有向量圖示的單位用卡牌字）。 */
const UNIT_GLYPH: Record<string, string> = {};
for (const c of Object.values(CARDS)) if (c.unit && !UNIT_GLYPH[c.unit]) UNIT_GLYPH[c.unit] = c.glyph;
UNIT_GLYPH.golemite = '石';

function drawGlyph(ctx: CanvasRenderingContext2D, id: string, x: number, y: number, size: number): void {
  if (ICONS[id]) {
    drawIcon(ctx, id, x, y, size);
    return;
  }
  const glyph = UNIT_GLYPH[id] ?? CARDS[id]?.glyph ?? '?';
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${Math.round(size * 0.55)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(glyph, x, y + size * 0.03);
}

export class Renderer2D implements BattleRenderer {
  readonly kind = '2d' as const;
  private ctx: CanvasRenderingContext2D;
  private scale = 20;
  private ox = 0;
  private oy = 0;
  private dpr = 1;
  private effects: Effect[] = [];
  private shake = 0;
  private bg: HTMLCanvasElement | null = null;
  preview: DeployPreview | null = null;
  showZone = false;
  selectedCard: string | null = null;
  private zoneKey = '';
  private zoneRects: [number, number, number, number][] = [];

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
  }

  resize(cssW: number, cssH: number): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(cssW * this.dpr);
    this.canvas.height = Math.round(cssH * this.dpr);
    this.canvas.style.width = `${cssW}px`;
    this.canvas.style.height = `${cssH}px`;
    this.scale = Math.min(cssW / ARENA.width, cssH / ARENA.height);
    this.ox = (cssW - ARENA.width * this.scale) / 2;
    this.oy = (cssH - ARENA.height * this.scale) / 2;
    this.bg = null;
  }

  /** 螢幕 CSS 座標（相對 canvas）→ 場地格座標。 */
  toWorld(px: number, py: number): [number, number] {
    return [(px - this.ox) / this.scale, (py - this.oy) / this.scale];
  }

  /** 場地格座標 → 螢幕 CSS 座標（相對 canvas）。 */
  toScreen(x: number, y: number): [number, number] {
    return [this.ox + x * this.scale, this.oy + y * this.scale];
  }

  get effectCount(): number {
    return this.effects.length;
  }

  reset(): void {
    this.effects = [];
    this.shake = 0;
    this.preview = null;
    this.showZone = false;
    this.selectedCard = null;
    this.zoneKey = '';
    this.zoneRects = [];
  }

  pushEvents(events: GameEvent[], _game?: Game): void {
    for (const ev of events) {
      switch (ev.type) {
        case 'deploy':
          this.effects.push({ kind: 'ring', x: ev.x, y: ev.y, r: 1.2, t: 0, life: 0.5, color: TEAM_COLORS[ev.team].light });
          break;
        case 'hit':
          if (this.effects.length < 220) this.effects.push({ kind: 'spark', x: ev.x, y: ev.y, r: ev.isTower ? 0.7 : 0.45, t: 0, life: 0.18, color: '#fff3b0' });
          if (ev.isTower && ev.amount >= 150) this.effects.push({ kind: 'text', x: ev.x, y: ev.y - 1.5, r: 0, t: 0, life: 0.7, color: '#ffffff', text: `-${Math.round(ev.amount)}` });
          break;
        case 'attack':
          if (!ev.ranged && ev.unit !== 'king' && ev.unit !== 'princess') {
            this.effects.push({ kind: 'bolt', x: ev.x, y: ev.y, x2: ev.tx, y2: ev.ty, r: 0, t: 0, life: 0.12, color: '#ffffff' });
          }
          break;
        case 'death':
          if (ev.kind !== 'tower') this.effects.push({ kind: 'puff', x: ev.x, y: ev.y, r: 0.9, t: 0, life: 0.45, color: '#d9d9d9' });
          break;
        case 'towerDown':
          this.effects.push({ kind: 'boom', x: ev.x, y: ev.y, r: ev.isKing ? 4 : 3, t: 0, life: 0.9, color: '#ffb347' });
          this.shake = 0.5;
          break;
        case 'strike':
          // 落雷：從上方劈到目標的一道閃電＋閃光
          this.effects.push({ kind: 'bolt', x: ev.x, y: ev.y - 6, x2: ev.x, y2: ev.y, r: 0, t: 0, life: 0.2, color: '#e2d6ff' });
          this.effects.push({ kind: 'boom', x: ev.x, y: ev.y, r: 1.2, t: 0, life: 0.3, color: '#c9b8ff' });
          break;
        case 'spell': {
          const color = ev.cardId === 'fireball' ? '#ff7a2f' : ev.cardId === 'zap' ? '#7fd3ff' : '#f0d070';
          this.effects.push({ kind: 'ring', x: ev.x, y: ev.y, r: ev.radius, t: 0, life: 0.45, color });
          this.effects.push({ kind: 'boom', x: ev.x, y: ev.y, r: ev.radius * 0.8, t: 0, life: 0.35, color });
          break;
        }
        default:
          break;
      }
    }
  }

  private sx(x: number): number {
    return this.ox + x * this.scale;
  }

  private sy(y: number): number {
    return this.oy + y * this.scale;
  }

  private buildBackground(): HTMLCanvasElement {
    const c = document.createElement('canvas');
    c.width = this.canvas.width;
    c.height = this.canvas.height;
    const g = c.getContext('2d')!;
    g.scale(this.dpr, this.dpr);
    const s = this.scale;
    g.fillStyle = '#1e2a1a';
    g.fillRect(0, 0, c.width, c.height);
    // 草地棋盤格
    for (let ty = 0; ty < ARENA.height; ty++) {
      for (let tx = 0; tx < ARENA.width; tx++) {
        const enemySide = ty < ARENA.riverTop;
        const even = (tx + ty) % 2 === 0;
        g.fillStyle = enemySide ? (even ? '#6aa84f' : '#62a047') : even ? '#74b357' : '#6cab4f';
        g.fillRect(this.sx(tx), this.sy(ty), s + 0.5, s + 0.5);
      }
    }
    // 中央道路痕跡
    g.fillStyle = 'rgba(214, 190, 130, 0.35)';
    for (const bx of ARENA.bridgeXs) {
      g.fillRect(this.sx(bx - 0.9), this.sy(6.5), 1.8 * s, 19 * s);
    }
    g.fillRect(this.sx(3.5), this.sy(6.2), 11 * s, 0.6 * s);
    g.fillRect(this.sx(3.5), this.sy(25.2), 11 * s, 0.6 * s);
    // 河道
    const rt = this.sy(ARENA.riverTop);
    const rh = (ARENA.riverBottom - ARENA.riverTop) * s;
    const grad = g.createLinearGradient(0, rt, 0, rt + rh);
    grad.addColorStop(0, '#3b8fd0');
    grad.addColorStop(0.5, '#58b2ea');
    grad.addColorStop(1, '#3b8fd0');
    g.fillStyle = grad;
    g.fillRect(this.sx(0), rt, ARENA.width * s, rh);
    g.strokeStyle = 'rgba(255,255,255,0.35)';
    g.lineWidth = Math.max(1, s * 0.06);
    for (let i = 0; i < 9; i++) {
      const x = this.sx(1 + i * 2);
      g.beginPath();
      g.moveTo(x, rt + rh * 0.45);
      g.quadraticCurveTo(x + s * 0.4, rt + rh * 0.3, x + s * 0.8, rt + rh * 0.45);
      g.stroke();
    }
    // 橋
    for (const bx of ARENA.bridgeXs) {
      const x = this.sx(bx - ARENA.bridgeHalfWidth);
      const w = ARENA.bridgeHalfWidth * 2 * s;
      g.fillStyle = '#9b6b3d';
      g.fillRect(x, rt - s * 0.25, w, rh + s * 0.5);
      g.strokeStyle = '#6e4826';
      g.lineWidth = Math.max(1, s * 0.07);
      for (let k = 0; k <= 5; k++) {
        const yy = rt - s * 0.25 + ((rh + s * 0.5) * k) / 5;
        g.beginPath();
        g.moveTo(x, yy);
        g.lineTo(x + w, yy);
        g.stroke();
      }
      g.fillStyle = '#5a3a1d';
      g.fillRect(x - s * 0.12, rt - s * 0.3, s * 0.18, rh + s * 0.6);
      g.fillRect(x + w - s * 0.06, rt - s * 0.3, s * 0.18, rh + s * 0.6);
    }
    // 外框
    g.strokeStyle = 'rgba(0,0,0,0.35)';
    g.lineWidth = 2;
    g.strokeRect(this.sx(0), this.sy(0), ARENA.width * s, ARENA.height * s);
    return c;
  }

  render(game: Game, alpha: number, dt: number, playerTeam: Team = 0): void {
    const ctx = this.ctx;
    if (!this.bg) this.bg = this.buildBackground();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let shakeX = 0;
    let shakeY = 0;
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt);
      const m = this.shake * this.scale * 0.5;
      shakeX = (Math.random() - 0.5) * m;
      shakeY = (Math.random() - 0.5) * m;
    }
    ctx.drawImage(this.bg, shakeX * this.dpr, shakeY * this.dpr);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, shakeX * this.dpr, shakeY * this.dpr);

    const zoneCard = this.preview?.cardId ?? this.selectedCard;
    if (this.showZone && zoneCard) this.drawZone(game, playerTeam, zoneCard);

    const lerp = (e: Entity): [number, number] => [e.px + (e.x - e.px) * alpha, e.py + (e.y - e.py) * alpha];

    // 塔與建築先畫，地面單位、空中單位依 y 排序
    const towers = game.entities.filter((e) => e.kind === 'tower');
    for (const t of towers) this.drawTower(t);
    const ground = game.entities.filter((e) => e.kind !== 'tower' && !e.stats.flying && e.alive).sort((a, b) => a.y - b.y);
    for (const e of ground) this.drawUnit(e, ...lerp(e));
    for (const p of game.projectiles) this.drawProjectile(p.x, p.y, p.tx, p.ty, p.source, p.team);
    const air = game.entities.filter((e) => e.stats.flying && e.alive).sort((a, b) => a.y - b.y);
    for (const e of air) this.drawUnit(e, ...lerp(e));
    for (const s of game.spells) this.drawIncomingSpell(s.fromX, s.fromY, s.x, s.y, 1 - s.delay / Math.max(0.0001, s.totalDelay), s.cardId);
    for (const t of towers) if (t.alive) this.drawBar(t.x, t.y - t.half - 0.55, t.hp / t.maxHp, t.team, t.half * 1.6, Math.ceil(t.hp));
    this.drawEffects(dt);
    if (this.preview) this.drawPreview(this.preview);
  }

  private drawZone(game: Game, team: Team, cardId: string): void {
    const card = CARDS[cardId];
    if (!card || card.kind === 'spell') return;
    // 不可部署區只會在塔倒下或建築出現／消失時改變，依此快取
    const statics = game.entities.filter((e) => e.alive && (e.kind === 'tower' || e.kind === 'building')).map((e) => e.id);
    const key = `${team}|${card.kind}|${card.unit ?? ''}|${statics.join(',')}`;
    if (key !== this.zoneKey) {
      this.zoneKey = key;
      this.zoneRects = [];
      // 以格子為單位標出不可部署的格（建築也以部隊的格子規則近似顯示）
      const probe = card.kind === 'building' ? 'knight' : cardId;
      for (let y = 0.5; y < ARENA.height; y += 1) {
        let runStart = -1;
        for (let x = 0.5; x <= ARENA.width + 0.5; x += 1) {
          const bad = x < ARENA.width && !game.canDeployAt(team, probe, x, y);
          if (bad && runStart < 0) runStart = x;
          if ((!bad || x >= ARENA.width) && runStart >= 0) {
            this.zoneRects.push([runStart - 0.5, y - 0.5, x - runStart, 1]);
            runStart = -1;
          }
        }
      }
    }
    const ctx = this.ctx;
    const s = this.scale;
    ctx.fillStyle = 'rgba(220, 40, 40, 0.26)';
    for (const [x, y, w, h] of this.zoneRects) ctx.fillRect(this.sx(x), this.sy(y), w * s, h * s + 0.5);
  }

  private drawTower(t: Entity): void {
    const ctx = this.ctx;
    const s = this.scale;
    const c = TEAM_COLORS[t.team];
    const r = t.half * s;
    const x = this.sx(t.x);
    const y = this.sy(t.y);
    if (!t.alive) {
      ctx.fillStyle = '#6b6258';
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.2, r * 0.9, r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8b8177';
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + t.id;
        ctx.fillRect(x + Math.cos(a) * r * 0.45 - s * 0.2, y + Math.sin(a) * r * 0.3 - s * 0.15, s * 0.4, s * 0.3);
      }
      return;
    }
    // 底座
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.35, r * 1.05, r * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b9b2a6';
    ctx.strokeStyle = '#5f5a52';
    ctx.lineWidth = Math.max(1, s * 0.08);
    ctx.beginPath();
    ctx.roundRect(x - r, y - r * 0.85, r * 2, r * 1.9, r * 0.25);
    ctx.fill();
    ctx.stroke();
    // 城垛
    ctx.fillStyle = '#d3cdc2';
    const n = t.unit === 'king' ? 5 : 4;
    for (let i = 0; i < n; i++) {
      const bw = (r * 2) / (n * 2 - 1);
      ctx.fillRect(x - r + i * bw * 2, y - r * 1.05, bw, r * 0.3);
    }
    // 屋頂／旗色
    ctx.fillStyle = c.main;
    ctx.beginPath();
    ctx.roundRect(x - r * 0.65, y - r * 0.55, r * 1.3, r * 1.2, r * 0.2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(r * (t.unit === 'king' ? 0.75 : 0.7))}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.unit === 'king' ? '♛' : '◆', x, y + r * 0.05);
    if (t.unit === 'king' && !t.active) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.roundRect(x - r * 0.65, y - r * 0.55, r * 1.3, r * 1.2, r * 0.2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.round(r * 0.35)}px system-ui, sans-serif`;
      ctx.fillText('z z', x + r * 0.45, y - r * 0.75);
    }
  }

  private drawBar(wx: number, wy: number, frac: number, team: Team, wTiles: number, label?: number): void {
    const ctx = this.ctx;
    const s = this.scale;
    const w = wTiles * s;
    const h = label !== undefined ? Math.max(11, s * 0.5) : Math.max(3, s * 0.18);
    const x = this.sx(wx) - w / 2;
    const y = this.sy(wy) - h / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
    ctx.fillStyle = team === 0 ? '#4fa3ff' : '#ff5b4f';
    ctx.fillRect(x, y, w * Math.max(0, Math.min(1, frac)), h);
    if (label !== undefined) {
      ctx.fillStyle = '#fff';
      ctx.font = `800 ${Math.round(h * 0.88)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(label), x + w / 2, y + h / 2 + 0.5);
    }
  }

  private drawUnit(e: Entity, wx: number, wy: number): void {
    const ctx = this.ctx;
    const s = this.scale;
    const c = TEAM_COLORS[e.team];
    const r = (e.kind === 'building' ? e.half : e.stats.radius * UNIT_VISUAL_SCALE) * s;
    const x = this.sx(wx);
    const lift = e.stats.flying ? s * 0.7 : 0;
    const y = this.sy(wy) - lift;
    // 影子
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(x, this.sy(wy) + r * 0.55, r * 0.9, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    const deploying = e.deployTimer > 0;
    if (deploying) ctx.globalAlpha = 0.65;

    if (e.kind === 'building') {
      ctx.fillStyle = '#7a7f88';
      ctx.strokeStyle = c.dark;
      ctx.lineWidth = Math.max(1.5, s * 0.12);
      ctx.beginPath();
      ctx.roundRect(x - r, y - r, r * 2, r * 2, r * 0.3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = c.main;
      ctx.fillRect(x - r, y + r * 0.55, r * 2, r * 0.45);
      drawGlyph(ctx, e.unit, x, y - r * 0.1, r * 1.9);
    } else {
      // 隊伍色底盤，飛行單位多一對翅膀輪廓
      if (e.stats.flying) {
        ctx.fillStyle = c.dark;
        ctx.beginPath();
        ctx.moveTo(x - r * 1.8, y - r * 0.1);
        ctx.quadraticCurveTo(x - r, y - r * 1.2, x, y - r * 0.3);
        ctx.quadraticCurveTo(x + r, y - r * 1.2, x + r * 1.8, y - r * 0.1);
        ctx.quadraticCurveTo(x + r, y + r * 0.3, x, y + r * 0.2);
        ctx.quadraticCurveTo(x - r, y + r * 0.3, x - r * 1.8, y - r * 0.1);
        ctx.fill();
      }
      ctx.fillStyle = c.main;
      ctx.strokeStyle = e.stunTimer > 0 ? '#9ee6ff' : c.light;
      ctx.lineWidth = Math.max(1.5, s * 0.09);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      drawGlyph(ctx, e.unit, x, y, r * 1.75);
    }
    ctx.globalAlpha = 1;

    if (deploying) {
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = Math.max(1.5, s * 0.1);
      ctx.beginPath();
      ctx.arc(x, y, r + s * 0.2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - e.deployTimer));
      ctx.stroke();
    }
    if (e.stunTimer > 0) {
      ctx.fillStyle = '#9ee6ff';
      ctx.font = `bold ${Math.max(9, Math.round(s * 0.6))}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡', x, y - r - s * 0.45);
    }
    if (e.hp < e.maxHp) this.drawBar(wx, wy - (r + lift) / s - 0.3, e.hp / e.maxHp, e.team, Math.max(1, e.stats.radius * 2.2));
  }

  private drawProjectile(x: number, y: number, tx: number, ty: number, card: string, team: Team): void {
    const ctx = this.ctx;
    const s = this.scale;
    const px = this.sx(x);
    const py = this.sy(y);
    const fire = card === 'wizard' || card === 'baby_dragon' || card === 'fire_spirit';
    if (fire) {
      ctx.fillStyle = '#ff8a2a';
      ctx.beginPath();
      ctx.arc(px, py, s * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe08a';
      ctx.beginPath();
      ctx.arc(px, py, s * 0.15, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    const a = Math.atan2(ty - y, tx - x);
    ctx.strokeStyle = card === 'king' || card === 'princess' ? (team === 0 ? '#cfe3ff' : '#ffd6d2') : '#f5e6c8';
    ctx.lineWidth = Math.max(1.5, s * 0.1);
    ctx.beginPath();
    ctx.moveTo(px - Math.cos(a) * s * 0.4, py - Math.sin(a) * s * 0.4);
    ctx.lineTo(px + Math.cos(a) * s * 0.2, py + Math.sin(a) * s * 0.2);
    ctx.stroke();
  }

  private drawIncomingSpell(fx: number, fy: number, x: number, y: number, k: number, cardId: string): void {
    const ctx = this.ctx;
    const s = this.scale;
    const t = Math.max(0, Math.min(1, k));
    const cx = fx + (x - fx) * t;
    const cy = fy + (y - fy) * t - Math.sin(t * Math.PI) * 3;
    ctx.fillStyle = cardId === 'fireball' ? '#ff7a2f' : '#f0d070';
    ctx.beginPath();
    ctx.arc(this.sx(cx), this.sy(cy), s * (cardId === 'fireball' ? 0.55 : 0.35), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(this.sx(x), this.sy(y), s * CARDS[cardId].spell!.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  private drawEffects(dt: number): void {
    const ctx = this.ctx;
    const s = this.scale;
    for (const f of this.effects) {
      f.t += dt;
      const k = Math.min(1, f.t / f.life);
      const x = this.sx(f.x);
      const y = this.sy(f.y);
      ctx.globalAlpha = 1 - k;
      switch (f.kind) {
        case 'ring':
          ctx.strokeStyle = f.color;
          ctx.lineWidth = Math.max(2, s * 0.15);
          ctx.beginPath();
          ctx.arc(x, y, f.r * s * (0.4 + 0.6 * k), 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'spark':
          ctx.fillStyle = f.color;
          ctx.beginPath();
          ctx.arc(x, y, f.r * s * (1 - k * 0.5), 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'puff':
          ctx.fillStyle = f.color;
          for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(x + Math.cos(a) * f.r * s * k, y + Math.sin(a) * f.r * s * k, s * 0.3 * (1 - k), 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        case 'boom':
          ctx.fillStyle = f.color;
          ctx.beginPath();
          ctx.arc(x, y, f.r * s * (0.3 + 0.7 * k), 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'bolt':
          ctx.strokeStyle = f.color;
          ctx.lineWidth = Math.max(2, s * 0.12);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(this.sx(f.x2!), this.sy(f.y2!));
          ctx.stroke();
          break;
        case 'text':
          ctx.fillStyle = f.color;
          ctx.font = `bold ${Math.round(s * 0.7)}px system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(f.text ?? '', x, y - k * s);
          break;
      }
    }
    ctx.globalAlpha = 1;
    this.effects = this.effects.filter((f) => f.t < f.life);
  }

  private drawPreview(p: DeployPreview): void {
    const ctx = this.ctx;
    const s = this.scale;
    const card = CARDS[p.cardId];
    const unit = card.unit ? UNITS[card.unit].stats : undefined;
    const x = this.sx(p.x);
    const y = this.sy(p.y);
    const r = (card.kind === 'spell' ? card.spell!.radius : Math.max(0.6, (unit!.half ?? unit!.radius) * ((card.count ?? 1) > 1 ? 2 : 1.3))) * s;
    ctx.fillStyle = p.legal ? 'rgba(255,255,255,0.25)' : 'rgba(255,60,60,0.3)';
    ctx.strokeStyle = p.legal ? '#ffffff' : '#ff4040';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (p.legal) {
      ctx.globalAlpha = 0.85;
      drawGlyph(ctx, card.unit ?? p.cardId, x, y, s * 1.6);
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = '#ffdddd';
      ctx.font = `bold ${Math.round(s * 0.9)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✕', x, y);
    }
  }
}
