import { TEAM_RGB } from './coords';

// 疊在 3D 畫面上的 2D 介面層：血條、等級徽章、塔血量數字、部署倒數、能量花費飄字。
// 用 Canvas 2D 畫，文字清楚且不增加 WebGL 繪製呼叫。

export interface FloatText {
  x: number;
  y: number;
  text: string;
  color: string;
  t: number;
  life: number;
  size: number;
}

const LEVEL = 11;

export class Overlay {
  readonly ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  floats: FloatText[] = [];

  constructor(readonly canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
  }

  resize(w: number, h: number, dpr: number): void {
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
  }

  begin(): void {
    const c = this.ctx;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.clearRect(0, 0, this.w, this.h);
  }

  /** 部隊血條：受傷才顯示（建築一直顯示）；左側小等級徽章。 */
  unitBar(x: number, y: number, w: number, frac: number, team: 0 | 1, showLevel: boolean): void {
    const c = this.ctx;
    const h = Math.max(4, Math.round(w * 0.13));
    const bx = x - w / 2;
    const by = y - h / 2;
    c.fillStyle = 'rgba(12,16,22,0.78)';
    roundRect(c, bx - 1.5, by - 1.5, w + 3, h + 3, 2.5);
    c.fill();
    c.fillStyle = TEAM_RGB[team].bar;
    c.fillRect(bx, by, Math.max(0, Math.min(1, frac)) * w, h);
    c.fillStyle = 'rgba(255,255,255,0.28)';
    c.fillRect(bx, by, Math.max(0, Math.min(1, frac)) * w, Math.max(1, h * 0.35));
    if (showLevel) this.levelBadge(bx - h * 1.25, y, h * 2.2, team);
  }

  levelBadge(cx: number, cy: number, size: number, team: 0 | 1): void {
    const c = this.ctx;
    const s = size;
    c.fillStyle = TEAM_RGB[team].dark;
    roundRect(c, cx - s / 2, cy - s / 2, s, s, s * 0.25);
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.85)';
    c.lineWidth = Math.max(1, s * 0.09);
    c.stroke();
    c.fillStyle = '#fff';
    c.font = `900 ${Math.round(s * 0.62)}px system-ui, -apple-system, sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(String(LEVEL), cx, cy + s * 0.04);
  }

  /** 塔：血量數字＋血條＋等級徽章（國王塔多一個皇冠）。 */
  towerBar(x: number, y: number, w: number, hp: number, frac: number, team: 0 | 1, king: boolean, scale: number): void {
    const c = this.ctx;
    const h = Math.max(7, Math.round(9 * scale));
    const bx = x - w / 2;
    const by = y - h / 2;
    c.fillStyle = 'rgba(12,16,22,0.82)';
    roundRect(c, bx - 2, by - 2, w + 4, h + 4, 3);
    c.fill();
    c.fillStyle = TEAM_RGB[team].bar;
    c.fillRect(bx, by, Math.max(0, Math.min(1, frac)) * w, h);
    c.fillStyle = 'rgba(255,255,255,0.3)';
    c.fillRect(bx, by, Math.max(0, Math.min(1, frac)) * w, h * 0.38);
    const badge = h * 1.9;
    this.levelBadge(bx - badge * 0.55, y, badge, team);
    if (king) {
      c.fillStyle = '#f2b233';
      const cx = bx - badge * 0.55;
      const cy = y - badge * 0.85;
      const s = badge * 0.45;
      c.beginPath();
      c.moveTo(cx - s, cy + s * 0.55);
      c.lineTo(cx - s, cy - s * 0.35);
      c.lineTo(cx - s * 0.45, cy + s * 0.05);
      c.lineTo(cx, cy - s * 0.55);
      c.lineTo(cx + s * 0.45, cy + s * 0.05);
      c.lineTo(cx + s, cy - s * 0.35);
      c.lineTo(cx + s, cy + s * 0.55);
      c.closePath();
      c.fill();
    }
    c.font = `900 ${Math.round(h * 1.15)}px system-ui, -apple-system, sans-serif`;
    c.textAlign = 'left';
    c.textBaseline = 'bottom';
    c.lineWidth = 3;
    c.strokeStyle = 'rgba(0,0,0,0.75)';
    const label = String(Math.ceil(hp));
    c.strokeText(label, bx + 2, by - 1);
    c.fillStyle = '#ffffff';
    c.fillText(label, bx + 2, by - 1);
  }

  /** 部署中的圓形倒數。 */
  deployTimer(x: number, y: number, r: number, frac: number, team: 0 | 1): void {
    const c = this.ctx;
    c.fillStyle = 'rgba(12,16,22,0.6)';
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = TEAM_RGB[team].light;
    c.lineWidth = Math.max(2, r * 0.35);
    c.beginPath();
    c.arc(x, y, r * 0.72, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, Math.min(1, frac)));
    c.stroke();
  }

  addFloat(x: number, y: number, text: string, color: string, size = 18, life = 0.9): void {
    this.floats.push({ x, y, text, color, t: 0, life, size });
  }

  drawFloats(dt: number, project: (x: number, y: number) => [number, number]): void {
    const c = this.ctx;
    for (const f of this.floats) {
      f.t += dt;
      const k = f.t / f.life;
      const [sx, sy] = project(f.x, f.y);
      c.globalAlpha = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3;
      const size = Math.round(f.size * (k < 0.15 ? 0.6 + (k / 0.15) * 0.5 : 1.1 - Math.min(0.1, (k - 0.15) * 0.2)));
      c.font = `900 ${size}px system-ui, -apple-system, sans-serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.lineWidth = 4;
      c.strokeStyle = 'rgba(40,10,50,0.85)';
      const yy = sy - k * 28;
      c.strokeText(f.text, sx, yy);
      c.fillStyle = f.color;
      c.fillText(f.text, sx, yy);
    }
    c.globalAlpha = 1;
    this.floats = this.floats.filter((f) => f.t < f.life);
  }

  /** 最後 10 秒的大型半透明倒數（原作也有此提示）。 */
  bigCountdown(n: number, frac: number): void {
    const c = this.ctx;
    c.globalAlpha = 0.28 + 0.25 * (1 - frac);
    c.font = `900 ${Math.round(this.h * 0.22 * (1.15 - frac * 0.15))}px system-ui, -apple-system, sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = '#ffffff';
    c.lineWidth = 6;
    c.strokeStyle = 'rgba(0,0,0,0.5)';
    c.strokeText(String(n), this.w / 2, this.h * 0.45);
    c.fillText(String(n), this.w / 2, this.h * 0.45);
    c.globalAlpha = 1;
  }
}

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
