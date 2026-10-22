import {
  AdditiveBlending, CircleGeometry, CylinderGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, OrthographicCamera, RingGeometry,
  SphereGeometry, Vector3, type WebGLRenderer,
} from 'three';
import { ARENA, CARDS, Game, UNITS, type Entity, type GameEvent } from '../sim';
import type { BattleRenderer, DeployPreview } from '../render/types';
import { ArenaView } from './arena';
import { COS_E, CX, CZ, SIN_E, TEAM_RGB, toX, toZ } from './coords';
import { Effects } from './effects';
import { Overlay } from './overlay';
import { createRenderer, createStage, type Stage } from './stage';
import { BlobShadows, makeProjectileMesh, TowerView, trailOf, UnitView, visualRadius } from './views';
import { ZoneView } from './zone';

type Quality = 'high' | 'medium' | 'low';

interface ProjVis {
  mesh: Mesh;
  sx: number;
  sz: number;
  sh: number;
  total: number;
  last: Vector3;
}

interface FlightVis {
  group: Group;
  meshes: Mesh[];
  cardId: string;
}

interface RainArrow {
  mesh: Mesh;
  t: number;
  x: number;
  z: number;
  dx: number;
}

const tmpV = new Vector3();

/** 嘗試建立 3D 渲染器；WebGL 不可用時回傳 null（改用 2D 備援）。 */
export function tryCreateRenderer3D(canvas: HTMLCanvasElement, overlay: HTMLCanvasElement): Renderer3D | null {
  try {
    const probe = document.createElement('canvas');
    const ok = !!(probe.getContext('webgl2') ?? probe.getContext('webgl'));
    if (!ok) return null;
    return new Renderer3D(canvas, overlay);
  } catch {
    return null;
  }
}

export class Renderer3D implements BattleRenderer {
  readonly kind = '3d' as const;
  preview: DeployPreview | null = null;
  showZone = false;
  selectedCard: string | null = null;
  /** 打擊停頓：大於 0 時對戰暫停推進（只延後畫面時間，不影響模擬結果）。 */
  hitStop = 0;

  private gl: WebGLRenderer;
  private stage: Stage;
  private cam: OrthographicCamera;
  private arena: ArenaView;
  private fx = new Effects();
  private zone = new ZoneView();
  private shadows = new BlobShadows();
  private overlay: Overlay;
  private layer = new Group();
  private units = new Map<number, UnitView>();
  private towers = new Map<number, TowerView>();
  private projs = new Map<number, ProjVis>();
  private flights = new Map<number, FlightVis>();
  private areas = new Map<number, Group>();
  private logs = new Map<number, Mesh>();
  private bombs = new Map<number, Mesh>();
  private beams = new Map<number, Mesh>();
  private rain: RainArrow[] = [];
  private pendingSpawn = new Map<number, string>();
  private time = 0;
  private shakeAmp = 0;
  private cssW = 1;
  private cssH = 1;
  private k = 20;
  private left = -9;
  private top = 13;
  private dpr = 1;
  private quality: Quality;
  private frameAvg = 16;
  private slowFrames = 0;
  private lastGame: Game | null = null;
  private beamGeo = new CylinderGeometry(0.09, 0.09, 1, 6, 1, true);
  private poisonGeo = new CircleGeometry(1, 40);
  private poisonRingGeo = new RingGeometry(0.95, 1, 48);
  private bombMat = new MeshLambertMaterial({ vertexColors: true, emissive: '#000000' });

  constructor(canvas: HTMLCanvasElement, overlayCanvas: HTMLCanvasElement) {
    const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
    this.quality = coarse ? 'medium' : 'high';
    this.gl = createRenderer(canvas, { antialias: true });
    this.stage = createStage(this.gl, this.quality === 'high' ? 2048 : 1024);
    const s = this.stage.scene;
    this.cam = new OrthographicCamera(-10, 10, 14, -14, 0.1, 200);
    this.cam.position.set(0, SIN_E * 60, COS_E * 60);
    this.cam.lookAt(0, 0, 0);
    this.arena = new ArenaView(this.gl);
    s.add(this.arena.group, this.layer, this.fx.group, this.zone.group, this.shadows.mesh);
    this.overlay = new Overlay(overlayCanvas);
    canvas.addEventListener('webglcontextlost', (e) => e.preventDefault());
    this.warmUp();
  }

  /** 先把會用到的 shader 編譯好，避免第一次出兵、第一發投射物時卡頓。 */
  private warmUp(): void {
    try {
      const tmp = new Group();
      const fakeUnit = new UnitView(
        { id: -1, team: 0, kind: 'troop', unit: 'knight', cardId: 'knight', facing: 0, x: 9, y: 20, px: 9, py: 20 } as unknown as Entity,
        tmp,
      );
      for (const v of ['arrow', 'fireball', 'bomb']) tmp.add(makeProjectileMesh(v));
      this.stage.scene.add(tmp);
      this.gl.compile(this.stage.scene, this.cam);
      this.stage.scene.remove(tmp);
      fakeUnit.dispose();
    } catch {
      // 預先編譯失敗不影響遊戲
    }
  }

  get effectCount(): number {
    return this.fx.count + this.rain.filter((r) => r.t < 1).length + this.flights.size + this.projs.size;
  }

  get qualityLevel(): Quality {
    return this.quality;
  }

  /** 畫面每秒影格的移動平均（毫秒），自動畫質與效能紀錄用。 */
  get frameTime(): number {
    return this.frameAvg;
  }

  resize(cssW: number, cssH: number): void {
    this.cssW = cssW;
    this.cssH = cssH;
    const cap = this.quality === 'high' ? 2 : this.quality === 'medium' ? 1.5 : 1;
    this.dpr = Math.min(window.devicePixelRatio || 1, cap);
    this.gl.setPixelRatio(this.dpr);
    this.gl.setSize(cssW, cssH, true);
    // 需要完整看到：寬 18 格（含少許邊）、上緣到對方國王塔頂、下緣到己方最後一排；上方留給名稱與計時器
    const hudPx = 58;
    const needW = 18.7;
    const upTop = 12.9;
    const upBottom = -ARENA.height / 2 * SIN_E - 0.15;
    const needH = upTop - upBottom;
    const k = Math.min(cssW / needW, (cssH - hudPx) / needH);
    const halfW = cssW / (2 * k);
    const extra = Math.max(0, (cssH - hudPx) / k - needH);
    const top = upTop + hudPx / k + extra * 0.55;
    this.k = k;
    this.left = -halfW;
    this.top = top;
    this.cam.left = -halfW;
    this.cam.right = halfW;
    this.cam.top = top;
    this.cam.bottom = top - cssH / k;
    this.cam.updateProjectionMatrix();
    this.fx.setScale(k * this.dpr);
    this.overlay.resize(cssW, cssH, this.dpr);
  }

  /** 開發用：查看單位畫面狀態。 */
  debugUnits(): { unit: string; opacity: number; transparent: boolean; dying: number; emissive: string; y: number }[] {
    return [...this.units.values()].map((v) => ({
      unit: v.e.unit, opacity: v.mat.opacity, transparent: v.mat.transparent, dying: v.dyingT, emissive: v.mat.emissive.getHexString(), y: v.inst.mesh.position.y,
    }));
  }

  /** 開發用：把鏡頭拉近到某個格子座標（zoom 倍）。 */
  debugView(x: number, y: number, zoom: number): void {
    const halfW = this.cssW / (2 * this.k * zoom);
    const halfH = this.cssH / (2 * this.k * zoom);
    const X = x - CX;
    const up = -(y - CZ) * SIN_E;
    this.left = X - halfW;
    this.top = up + halfH;
    this.k *= zoom;
    this.cam.left = X - halfW;
    this.cam.right = X + halfW;
    this.cam.top = up + halfH;
    this.cam.bottom = up - halfH;
    this.cam.updateProjectionMatrix();
    this.fx.setScale(this.k * this.dpr);
  }

  toWorld(px: number, py: number): [number, number] {
    const X = this.left + px / this.k;
    const up = this.top - py / this.k;
    const Z = -up / SIN_E;
    return [X + CX, Z + CZ];
  }

  toScreen(x: number, y: number): [number, number] {
    return this.project(x - CX, 0, y - CZ);
  }

  /** 3D 世界座標 → 畫布 CSS 座標。 */
  project(X: number, Y: number, Z: number): [number, number] {
    const up = Y * COS_E - Z * SIN_E;
    return [(X - this.left) * this.k, (this.top - up) * this.k];
  }

  reset(): void {
    for (const v of this.units.values()) v.dispose();
    for (const v of this.towers.values()) v.dispose();
    this.units.clear();
    this.towers.clear();
    for (const p of this.projs.values()) p.mesh.removeFromParent();
    this.projs.clear();
    for (const f of this.flights.values()) f.group.removeFromParent();
    this.flights.clear();
    for (const a of this.areas.values()) a.removeFromParent();
    this.areas.clear();
    for (const l of this.logs.values()) l.removeFromParent();
    this.logs.clear();
    for (const b of this.bombs.values()) b.removeFromParent();
    this.bombs.clear();
    for (const b of this.beams.values()) b.removeFromParent();
    this.beams.clear();
    for (const r of this.rain) r.mesh.removeFromParent();
    this.rain = [];
    this.pendingSpawn.clear();
    this.fx.clear();
    this.overlay.floats = [];
    this.preview = null;
    this.showZone = false;
    this.selectedCard = null;
    this.shakeAmp = 0;
    this.hitStop = 0;
    this.lastGame = null;
  }

  private shake(a: number): void {
    this.shakeAmp = Math.min(0.6, Math.max(this.shakeAmp, a));
  }

  private stop(sec: number): void {
    this.hitStop = Math.max(this.hitStop, sec);
  }

  // ───────── 事件 → 特效 ─────────

  pushEvents(events: GameEvent[], game: Game): void {
    const fx = this.fx;
    for (const ev of events) {
      switch (ev.type) {
        case 'spawn':
          this.pendingSpawn.set(ev.id, ev.source);
          break;
        case 'deploy': {
          const card = CARDS[ev.cardId];
          const X = toX(ev.x);
          const Z = toZ(ev.y);
          if (card.kind !== 'spell') {
            fx.ring(X, Z, 0.3, card.kind === 'building' ? 1.8 : 1.3, TEAM_RGB[ev.team].light, 0.5);
            fx.burst('dust', X, 0, Z, card.kind === 'building' ? 1.3 : 0.8);
            const u = UNITS[card.unit!];
            if (u.stats.mass >= 18 || card.kind === 'building') this.shake(0.08);
          }
          if (ev.team === 0) {
            this.overlay.addFloat(X, Z, `-${ev.cost}`, '#ff8ff0', 20, 1.0);
            fx.burst('elixir', X, 0.2, Z, 1, 8);
          }
          break;
        }
        case 'attack': {
          const tv = this.units.get(ev.targetId);
          if (!ev.ranged) {
            const tx = toX(ev.tx);
            const tz = toZ(ev.ty);
            const ty = tv ? tv.hover + 0.6 : 0.8;
            const heavy = ['giant', 'golem', 'golemite', 'giant_skeleton', 'iron_swordsman', 'lancer', 'bomb_blimp'].includes(ev.unit);
            fx.burst('spark', tx, ty, tz, heavy ? 1.3 : 0.7, heavy ? 12 : 6);
            if (heavy) {
              fx.ring(tx, tz, 0.2, 1.1, '#fff2c8', 0.3, 0.7);
              this.shake(ev.charge ? 0.14 : 0.06);
              this.stop(ev.charge ? 0.07 : 0.035);
            }
            if (ev.unit === 'axe_dwarf') fx.ring(toX(ev.x), toZ(ev.y), 0.4, 2.1, '#ffffff', 0.35, 0.6);
            if (ev.unit === 'bomb_blimp') {
              fx.burst('fire', tx, 0.4, tz, 1.2);
              fx.burst('smoke', tx, 0.3, tz, 1);
              fx.ring(tx, tz, 0.3, 1.4, '#ffb347', 0.4);
            }
          } else if (ev.unit === 'musketeer' || ev.unit === 'cannon' || ev.unit === 'king') {
            fx.burst('smoke', toX(ev.x), ev.unit === 'king' ? 3.2 : 0.9, toZ(ev.y), 0.4, 3);
          }
          break;
        }
        case 'hit': {
          const v = this.units.get(ev.id);
          if (v) v.flash = 1;
          const t = this.towers.get(ev.id);
          if (t) {
            t.flash = 1;
            if (ev.amount >= 150) fx.burst('debris', toX(ev.x), 1.6, toZ(ev.y), 0.4, 3);
          }
          if (ev.amount >= 500 && !ev.isTower) this.stop(0.04);
          break;
        }
        case 'impact': {
          const X = toX(ev.x);
          const Z = toZ(ev.y);
          switch (ev.visual) {
            case 'bomb':
              fx.burst('fire', X, 0.3, Z, ev.radius * 0.7);
              fx.burst('smoke', X, 0.3, Z, ev.radius * 0.6);
              fx.ring(X, Z, 0.2, ev.radius, '#ffd36b', 0.35);
              fx.decal(X, Z, ev.radius * 0.6, '#2a2218', 2.5);
              this.shake(0.05);
              break;
            case 'fireball':
            case 'fire':
              fx.burst('fire', X, 0.5, Z, ev.radius * 0.6);
              fx.ring(X, Z, 0.2, ev.radius, '#ffb347', 0.3, 0.7);
              break;
            case 'magic':
              fx.burst('magic', X, 0.5, Z, ev.radius);
              fx.ring(X, Z, 0.2, ev.radius, '#c86bff', 0.3, 0.7);
              break;
            case 'ice':
              fx.burst('ice', X, 0.4, Z, ev.radius * 0.8, 18);
              fx.ring(X, Z, 0.2, ev.radius, '#bfe8ff', 0.4, 0.9);
              break;
            default:
              fx.burst('spark', X, 0.5, Z, 0.6, 5);
          }
          break;
        }
        case 'death': {
          const v = this.units.get(ev.id);
          if (v) {
            if (ev.kamikaze) {
              v.dispose();
              this.units.delete(ev.id);
            } else if (v.dyingT < 0) v.dyingT = 0;
          }
          if (ev.kind !== 'tower') {
            const X = toX(ev.x);
            const Z = toZ(ev.y);
            const big = UNITS[ev.unit]?.stats.mass >= 18;
            if (!ev.kamikaze) fx.burst('smoke', X, (v?.hover ?? 0) + 0.3, Z, big ? 1.4 : 0.6, big ? 12 : 5);
            if (ev.kind === 'building') {
              fx.burst('debris', X, 0.5, Z, 1, 14);
              this.shake(0.06);
            }
          }
          break;
        }
        case 'towerDown': {
          const X = toX(ev.x);
          const Z = toZ(ev.y);
          const p = ev.isKing ? 1.6 : 1.2;
          fx.burst('fire', X, 1.6, Z, 1.6 * p, 36);
          fx.burst('debris', X, 1.2, Z, 1.4 * p, 36);
          fx.burst('smoke', X, 1, Z, 1.6 * p, 12);
          fx.ring(X, Z, 0.5, 3.4 * p, '#ffd36b', 0.7);
          fx.decal(X, Z, 1.9 * p, '#3a2e22', 6);
          this.shake(ev.cascade ? 0.3 : 0.45);
          this.stop(ev.cascade ? 0.05 : 0.14);
          const t = [...this.towers.values()].find((tv) => tv.e.x === ev.x && tv.e.y === ev.y);
          if (t && !t.down) t.collapse();
          break;
        }
        case 'kingActivate': {
          const k = game.king(ev.team);
          fx.burst('spark', toX(k.x), 3.2, toZ(k.y), 1.2, 14);
          break;
        }
        case 'spell':
          this.spellImpact(ev.cardId, ev.x, ev.y, ev.radius, ev.wave);
          break;
        case 'blast': {
          const X = toX(ev.x);
          const Z = toZ(ev.y);
          if (ev.visual === 'bomb') {
            fx.burst('fire', X, 0.4, Z, ev.radius * 0.8, 40);
            fx.burst('smoke', X, 0.4, Z, ev.radius * 0.7, 18);
            fx.burst('debris', X, 0.3, Z, ev.radius * 0.5, 12);
            fx.ring(X, Z, 0.3, ev.radius, '#ffd36b', 0.5);
            fx.decal(X, Z, ev.radius * 0.7, '#1f1a14', 5);
            this.shake(0.3);
            this.stop(0.08);
          } else {
            fx.burst('dust', X, 0, Z, ev.radius, 26);
            fx.burst('debris', X, 0.3, Z, ev.radius * 0.6, 16);
            fx.ring(X, Z, 0.4, ev.radius, '#e8d9b8', 0.5);
            this.shake(0.18);
          }
          break;
        }
        case 'charge': {
          const v = this.units.get(ev.id);
          if (v) fx.burst('dust', v.x, 0, v.z, 1, 10);
          break;
        }
        case 'stun': {
          const v = this.units.get(ev.id);
          if (v) fx.burst(ev.freeze ? 'ice' : 'stun', v.x, v.hover + v.height * 0.9, v.z, 0.6, ev.freeze ? 8 : 6);
          break;
        }
        default:
          break;
      }
    }
  }

  private spellImpact(cardId: string, x: number, y: number, radius: number, wave: number): void {
    const fx = this.fx;
    const X = toX(x);
    const Z = toZ(y);
    switch (cardId) {
      case 'fireball':
        fx.burst('fire', X, 0.5, Z, radius * 0.75, 60);
        fx.burst('smoke', X, 0.6, Z, radius * 0.6, 16);
        fx.burst('spark', X, 0.5, Z, 1.5, 16);
        fx.ring(X, Z, 0.3, radius, '#ffb347', 0.45);
        fx.decal(X, Z, radius * 0.75, '#1f1a14', 4);
        this.shake(0.16);
        this.stop(0.05);
        break;
      case 'rocket':
        fx.burst('fire', X, 0.5, Z, radius * 1.1, 80);
        fx.burst('smoke', X, 0.6, Z, radius, 24);
        fx.burst('debris', X, 0.4, Z, radius * 0.6, 18);
        fx.ring(X, Z, 0.3, radius * 1.3, '#ffd36b', 0.55);
        fx.decal(X, Z, radius * 0.9, '#1a1510', 6);
        this.shake(0.3);
        this.stop(0.09);
        break;
      case 'arrows':
        this.arrowRain(X, Z, radius);
        break;
      case 'zap':
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2 + Math.random();
          const r = i === 0 ? 0 : radius * (0.3 + Math.random() * 0.5);
          fx.bolt(X + Math.cos(a) * r, Z + Math.sin(a) * r);
        }
        fx.ring(X, Z, 0.4, radius, '#8fdcff', 0.35, 0.9);
        fx.burst('stun', X, 0.3, Z, 1, 16);
        this.shake(0.06);
        break;
      case 'goblin_barrel':
        fx.burst('splinter', X, 0.4, Z, 1, 16);
        fx.burst('dust', X, 0, Z, 1.2, 12);
        fx.ring(X, Z, 0.3, 1.6, '#e8d9b8', 0.4);
        this.shake(0.05);
        break;
      case 'poison':
        if (wave === 0) fx.burst('poison', X, 0.1, Z, radius, 10);
        break;
      default:
        break;
    }
  }

  private arrowRain(X: number, Z: number, radius: number): void {
    for (let i = 0; i < 9; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius * 0.9;
      let ra = this.rain.find((q) => q.t >= 1);
      if (!ra) {
        if (this.rain.length > 60) break;
        const mesh = makeProjectileMesh('arrow');
        this.layer.add(mesh);
        ra = { mesh, t: 1, x: 0, z: 0, dx: 0 };
        this.rain.push(ra);
      }
      ra.t = -Math.random() * 0.12;
      ra.x = X + Math.cos(a) * r;
      ra.z = Z + Math.sin(a) * r;
      ra.dx = (Math.random() - 0.5) * 0.6;
      ra.mesh.visible = false;
    }
    this.fx.burst('dust', X, 0, Z, radius * 0.5, 14);
  }

  // ───────── 每幀同步 ─────────

  render(game: Game, alpha: number, dt: number): void {
    if (this.lastGame !== game) {
      this.reset();
      this.lastGame = game;
    }
    this.time += dt;
    const animDt = this.hitStop > 0 ? dt * 0.12 : dt;
    this.hitStop = Math.max(0, this.hitStop - dt);
    this.trackPerformance(dt);
    this.arena.update(this.time);

    // 部隊與建築
    const seen = new Set<number>();
    for (const e of game.entities) {
      if (e.kind === 'tower') {
        let tv = this.towers.get(e.id);
        if (!tv) {
          tv = new TowerView(e, this.layer);
          this.towers.set(e.id, tv);
        }
        const target = e.alive && e.targetId >= 0 ? game.get(e.targetId) : undefined;
        tv.update(animDt, game.time, target ? tmpV.set(toX(target.x), 0, toZ(target.y)) : null);
        continue;
      }
      if (!e.alive) continue;
      seen.add(e.id);
      let v = this.units.get(e.id);
      if (!v) {
        v = new UnitView(e, this.layer);
        const src = this.pendingSpawn.get(e.id);
        if (src === 'card' || src === 'barrel') v.dropT = 0;
        else if (src === 'spawner' || src === 'death') v.popT = 0;
        this.pendingSpawn.delete(e.id);
        this.units.set(e.id, v);
      }
      if (e.kind === 'building' && e.targetId >= 0) {
        const t = game.get(e.targetId);
        if (t) {
          const world = Math.atan2(toX(t.x) - v.x, toZ(t.y) - v.z);
          v.st.aimYaw = world - v.yaw;
        }
      }
      v.update(alpha, dt, animDt, game.time);
      this.updateBeam(e, v, game);
      if (e.charging && Math.random() < 0.5) this.fx.trail('smoke', v.x, 0.1, v.z);
    }
    for (const [id, v] of this.units) {
      if (seen.has(id)) continue;
      if (v.dyingT < 0) v.dyingT = 0;
      v.update(alpha, dt, animDt, game.time);
      if (v.done) {
        v.dispose();
        this.units.delete(id);
        this.removeBeam(id);
      }
    }

    this.syncProjectiles(game);
    this.syncSpells(game, dt);
    this.updateRain(dt);
    this.zone.update(game, this.showZone, this.selectedCard, this.preview, this.time);

    // 飛行單位的地面影子（低畫質時所有單位都用）
    this.shadows.begin();
    for (const v of this.units.values()) {
      if (v.hover > 0 || this.quality === 'low') this.shadows.add(v.x, v.z, visualRadius(v.e.unit) * (v.hover > 0 ? 0.9 : 1.1));
    }
    this.shadows.end();

    this.fx.update(dt);
    // 鏡頭震動
    let ox = 0;
    let oy = 0;
    if (this.shakeAmp > 0.001) {
      ox = (Math.random() - 0.5) * this.shakeAmp;
      oy = (Math.random() - 0.5) * this.shakeAmp;
      this.shakeAmp *= Math.pow(0.02, dt);
    }
    this.cam.position.set(ox, SIN_E * 60 + oy * COS_E, COS_E * 60 - oy * SIN_E);
    this.gl.render(this.stage.scene, this.cam);
    this.drawOverlay(game, dt);
  }

  private updateBeam(e: Entity, v: UnitView, game: Game): void {
    if (e.unit !== 'inferno') return;
    const t = e.attacking && e.targetId >= 0 ? game.get(e.targetId) : undefined;
    let beam = this.beams.get(e.id);
    if (!t || e.stunTimer > 0) {
      if (beam) beam.visible = false;
      return;
    }
    if (!beam) {
      beam = new Mesh(this.beamGeo, new MeshBasicMaterial({ color: '#ff8a2a', transparent: true, blending: AdditiveBlending, depthWrite: false }));
      beam.renderOrder = 7;
      this.layer.add(beam);
      this.beams.set(e.id, beam);
    }
    const stage = Math.min(2, Math.floor(e.rampTime / (e.stats.ramp?.stageTime ?? 2)));
    const tv = this.units.get(t.id);
    const a = new Vector3(v.x, 1.8, v.z);
    const b = new Vector3(toX(t.x), tv ? tv.hover + 0.6 : t.kind === 'tower' ? 1.5 : 0.6, toZ(t.y));
    const d = b.clone().sub(a);
    const len = d.length();
    beam.visible = true;
    beam.position.copy(a);
    beam.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), d.normalize());
    const w = 0.7 + stage * 0.7 + Math.sin(this.time * 40) * 0.15;
    beam.scale.set(w, len, w);
    beam.position.addScaledVector(d, len / 2);
    (beam.material as MeshBasicMaterial).color.set(stage === 0 ? '#ffb347' : stage === 1 ? '#ff7a2a' : '#ff3a1a');
    if (Math.random() < 0.4) this.fx.trail('fire', b.x, b.y, b.z);
  }

  private removeBeam(id: number): void {
    const b = this.beams.get(id);
    if (b) {
      b.removeFromParent();
      this.beams.delete(id);
    }
  }

  private heightOfSource(unit: string): number {
    if (unit === 'princess') return 2.6;
    if (unit === 'king') return 3.1;
    const u = UNITS[unit];
    if (!u) return 0.8;
    if (u.stats.flying) return (unit === 'baby_dragon' ? 1.4 : 1.0) + 0.5;
    return u.stats.half ? 0.9 : 0.8;
  }

  private syncProjectiles(game: Game): void {
    const live = new Set<number>();
    for (const p of game.projectiles) {
      if (p.done) continue;
      live.add(p.id);
      let v = this.projs.get(p.id);
      if (!v) {
        const mesh = makeProjectileMesh(p.visual);
        this.layer.add(mesh);
        const total = Math.max(0.1, Math.hypot(p.tx - p.sx, p.ty - p.sy));
        v = { mesh, sx: p.sx, sz: p.sy, sh: this.heightOfSource(p.source), total, last: new Vector3(toX(p.x), 1, toZ(p.y)) };
        this.projs.set(p.id, v);
      }
      const target = game.get(p.targetId);
      const th = target ? (target.stats.flying ? 1.5 : target.kind === 'tower' ? 1.6 : 0.6) : 0.4;
      const done = Math.hypot(p.x - p.sx, p.y - p.sy);
      const f = Math.min(1, done / Math.max(0.1, done + Math.hypot(p.tx - p.x, p.ty - p.y)));
      const h = v.sh + (th - v.sh) * f + p.arc * 4 * f * (1 - f);
      const pos = new Vector3(toX(p.x), h, toZ(p.y));
      const dir = pos.clone().sub(v.last);
      v.mesh.position.copy(pos);
      if (dir.lengthSq() > 1e-6) v.mesh.lookAt(pos.clone().add(dir));
      v.last.copy(pos);
      const trail = trailOf(v.mesh);
      if (trail) this.fx.trail(trail, pos.x, pos.y, pos.z);
    }
    for (const [id, v] of this.projs) {
      if (live.has(id)) continue;
      v.mesh.removeFromParent();
      this.projs.delete(id);
    }
  }

  private syncSpells(game: Game, dt: number): void {
    // 飛行中的法術（火球、火箭、飛桶、箭雨）
    const live = new Set<number>();
    for (const s of game.spells) {
      if (s.delay <= 0) continue;
      live.add(s.id);
      let f = this.flights.get(s.id);
      if (!f) {
        const group = new Group();
        const meshes: Mesh[] = [];
        if (s.cardId === 'fireball') {
          const m = new Mesh(new SphereGeometry(0.5, 14, 10), new MeshBasicMaterial({ color: '#ff9a3a' }));
          const core = new Mesh(new SphereGeometry(0.3, 10, 8), new MeshBasicMaterial({ color: '#fff2a8' }));
          m.add(core);
          meshes.push(m);
        } else if (s.cardId === 'rocket') meshes.push(makeProjectileMesh('rocket'));
        else if (s.cardId === 'goblin_barrel') meshes.push(makeProjectileMesh('barrel'));
        else if (s.cardId === 'arrows') {
          for (let i = 0; i < 10; i++) {
            const m = makeProjectileMesh('arrow');
            m.userData.off = [(Math.random() - 0.5) * 2.6, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 2.2];
            meshes.push(m);
          }
        }
        for (const m of meshes) group.add(m);
        this.layer.add(group);
        f = { group, meshes, cardId: s.cardId };
        this.flights.set(s.id, f);
      }
      const k = 1 - s.delay / Math.max(0.0001, s.totalDelay);
      const fx = toX(s.fromX);
      const fz = toZ(s.fromY);
      const tx = toX(s.x);
      const tz = toZ(s.y);
      const arcH = s.cardId === 'rocket' ? 7 : s.cardId === 'arrows' ? 4.5 : 5;
      const at = (q: number) => new Vector3(fx + (tx - fx) * q, 3.2 * (1 - q) + 0.3 + arcH * 4 * q * (1 - q), fz + (tz - fz) * q);
      const pos = at(k);
      const ahead = at(Math.min(1, k + 0.02));
      for (const m of f.meshes) {
        const off = m.userData.off as [number, number, number] | undefined;
        m.position.set(pos.x + (off?.[0] ?? 0) * k, pos.y + (off?.[1] ?? 0), pos.z + (off?.[2] ?? 0) * k);
        if (s.cardId === 'goblin_barrel') m.rotation.x += dt * 9;
        else m.lookAt(ahead.x + (off?.[0] ?? 0) * k, ahead.y + (off?.[1] ?? 0), ahead.z + (off?.[2] ?? 0) * k);
      }
      if (s.cardId === 'fireball') {
        this.fx.trail('fire', pos.x, pos.y, pos.z);
        this.fx.trail('fire', pos.x, pos.y, pos.z);
      } else if (s.cardId === 'rocket') {
        this.fx.trail('smoke', pos.x, pos.y, pos.z);
        this.fx.trail('fire', pos.x, pos.y, pos.z);
      }
    }
    for (const [id, f] of this.flights) {
      if (live.has(id)) continue;
      f.group.removeFromParent();
      this.flights.delete(id);
    }

    // 毒霧範圍
    const liveA = new Set<number>();
    for (const a of game.areas) {
      liveA.add(a.id);
      let g = this.areas.get(a.id);
      if (!g) {
        g = new Group();
        const disc = new Mesh(this.poisonGeo, new MeshBasicMaterial({ color: '#8fd14f', transparent: true, opacity: 0.25, depthWrite: false, side: DoubleSide }));
        const ring = new Mesh(this.poisonRingGeo, new MeshBasicMaterial({ color: '#d6ff8a', transparent: true, opacity: 0.7, depthWrite: false, side: DoubleSide }));
        for (const m of [disc, ring]) {
          m.rotation.x = -Math.PI / 2;
          m.renderOrder = 3;
          g.add(m);
        }
        g.scale.setScalar(a.radius);
        g.position.set(toX(a.x), 0.07, toZ(a.y));
        this.layer.add(g);
        this.areas.set(a.id, g);
      }
      const fade = Math.min(1, a.timeLeft / 0.5);
      const disc = g.children[0] as Mesh;
      (disc.material as MeshBasicMaterial).opacity = (0.2 + Math.sin(this.time * 4) * 0.05) * fade;
      ((g.children[1] as Mesh).material as MeshBasicMaterial).opacity = 0.7 * fade;
      if (Math.random() < 0.6) this.fx.burst('poison', toX(a.x), 0.05, toZ(a.y), a.radius, 1);
    }
    for (const [id, g] of this.areas) {
      if (liveA.has(id)) continue;
      g.removeFromParent();
      this.areas.delete(id);
    }

    // 滾木
    const liveR = new Set<number>();
    for (const r of game.rollers) {
      liveR.add(r.id);
      let m = this.logs.get(r.id);
      if (!m) {
        m = makeProjectileMesh('log');
        this.layer.add(m);
        this.logs.set(r.id, m);
      }
      m.position.set(toX(r.x), 0.38, toZ(r.y));
      m.rotation.set((r.traveled / 0.38) * r.dir, 0, 0);
      if (Math.random() < 0.8) this.fx.burst('dust', toX(r.x) + (Math.random() - 0.5) * 3.6, 0, toZ(r.y), 0.5, 1);
    }
    for (const [id, m] of this.logs) {
      if (liveR.has(id)) continue;
      this.fx.burst('splinter', m.position.x, 0.4, m.position.z, 1, 12);
      m.removeFromParent();
      this.logs.delete(id);
    }

    // 死亡炸彈
    const liveB = new Set<number>();
    for (const b of game.bombs) {
      liveB.add(b.id);
      let m = this.bombs.get(b.id);
      if (!m) {
        m = makeProjectileMesh('gsbomb');
        m.material = this.bombMat.clone();
        m.scale.setScalar(b.unit === 'bomb_blimp' ? 0.6 : 1);
        this.layer.add(m);
        this.bombs.set(b.id, m);
      }
      const k = 1 - b.timer / Math.max(0.01, b.total);
      const fall = b.unit === 'bomb_blimp' ? Math.max(0, 1 - k * 2.2) * 2.4 : 0;
      m.position.set(toX(b.x), 0.45 + fall, toZ(b.y));
      const blink = Math.sin(this.time * (8 + k * 30)) > 0 ? 0.6 * k + 0.2 : 0;
      (m.material as MeshLambertMaterial).emissive.setRGB(blink, blink * 0.15, 0);
      if (Math.random() < 0.5) this.fx.trail('spark', m.position.x, m.position.y + 0.55, m.position.z);
    }
    for (const [id, m] of this.bombs) {
      if (liveB.has(id)) continue;
      m.removeFromParent();
      this.bombs.delete(id);
    }
  }

  private updateRain(dt: number): void {
    for (const r of this.rain) {
      if (r.t >= 1) continue;
      r.t += dt / 0.22;
      if (r.t < 0) continue;
      const k = Math.min(1, r.t);
      r.mesh.visible = k < 1;
      const y = 4.5 * (1 - k) + 0.1;
      r.mesh.position.set(r.x + r.dx * (1 - k), y, r.z - (1 - k) * 1.2);
      r.mesh.lookAt(r.x, -1, r.z + 0.3);
      if (k >= 1) {
        r.t = 1;
        r.mesh.visible = false;
        this.fx.burst('dust', r.x, 0, r.z, 0.3, 2);
      }
    }
  }

  // ───────── 2D 介面層 ─────────

  private drawOverlay(game: Game, dt: number): void {
    const o = this.overlay;
    o.begin();
    const k = this.k;
    for (const v of this.units.values()) {
      if (v.dyingT >= 0) continue;
      const e = v.e;
      const top = v.hover + v.height * v.scale + 0.2;
      const [sx, sy] = this.project(v.x, top, v.z);
      if (e.deployTimer > 0) {
        o.deployTimer(sx, sy - 4, Math.max(6, k * 0.32), 1 - e.deployTimer / Math.max(0.3, e.stats.deployTime), e.team);
        continue;
      }
      const isBuilding = e.kind === 'building';
      if (e.hp < e.maxHp - 0.5 || isBuilding) {
        const w = Math.max(18, Math.min(60, k * (isBuilding ? 1.9 : Math.max(0.9, visualRadius(e.unit) * 2))));
        o.unitBar(sx, sy, w, e.hp / e.maxHp, e.team, true);
      }
    }
    for (const t of this.towers.values()) {
      const e = t.e;
      if (!e.alive) continue;
      const king = e.unit === 'king';
      const [sx, sy] = this.project(toX(e.x), t.height + (king ? 0.35 : 0.2), toZ(e.y));
      const w = k * (king ? 3.0 : 2.4);
      o.towerBar(sx, sy, w, e.hp, e.hp / e.maxHp, e.team, king, Math.max(0.8, k / 20));
    }
    o.drawFloats(dt, (x, z) => this.project(x, 1.2, z));
    if (game.playing && game.timeLeft <= 10 && game.timeLeft > 0) {
      const n = Math.ceil(game.timeLeft);
      o.bigCountdown(n, game.timeLeft - Math.floor(game.timeLeft));
    }
  }

  // ───────── 自動畫質 ─────────

  private trackPerformance(dt: number): void {
    if (dt <= 0 || dt > 0.25) return;
    this.frameAvg = this.frameAvg * 0.95 + dt * 1000 * 0.05;
    if (this.frameAvg > 38) this.slowFrames++;
    else this.slowFrames = Math.max(0, this.slowFrames - 2);
    if (this.slowFrames > 150 && this.quality !== 'low') {
      this.quality = this.quality === 'high' ? 'medium' : 'low';
      this.slowFrames = 0;
      this.frameAvg = 16;
      if (this.quality === 'low') {
        this.gl.shadowMap.enabled = false;
        this.stage.sun.castShadow = false;
      } else {
        this.stage.sun.shadow.mapSize.set(1024, 1024);
        this.stage.sun.shadow.map?.dispose();
        this.stage.sun.shadow.map = null;
      }
      this.resize(this.cssW, this.cssH);
    }
  }

  dispose(): void {
    this.reset();
    this.gl.dispose();
  }
}
