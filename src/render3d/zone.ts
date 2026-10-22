import {
  CircleGeometry, DataTexture, DoubleSide, Group, Mesh, MeshBasicMaterial, NearestFilter, PlaneGeometry, RGBAFormat, RingGeometry, ShaderMaterial,
  type MeshLambertMaterial,
} from 'three';
import { ARENA, CARDS, UNITS, formation, type Game } from '../sim';
import type { DeployPreview } from '../render/types';
import { CX, CZ, TEAM_RGB, toX, toZ } from './coords';
import { instantiate, type ModelInstance } from './kit';
import { toonMaterial } from './materials';
import { getAsset, profileOf } from './models';

// 部署提示：拖曳卡牌時在地面畫出格線、不可部署區（紅色）、落點格，以及半透明的單位預覽與射程圈。

const ZONE_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const ZONE_FRAG = `
uniform sampler2D uMap;
uniform float uTime;
uniform vec2 uHover;
uniform float uHoverOn;
varying vec2 vUv;
void main() {
  vec2 grid = vec2(18.0, 32.0);
  vec2 p = vec2(vUv.x, 1.0 - vUv.y) * grid;
  vec2 cell = floor(p);
  float bad = texture2D(uMap, (cell + 0.5) / grid).r;
  vec2 f = fract(p);
  float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
  float line = 1.0 - smoothstep(0.02, 0.06, edge);
  vec4 col = vec4(0.0);
  if (bad > 0.5) {
    float stripe = step(0.5, fract((p.x + p.y) * 0.5 + uTime * 0.25));
    col = vec4(0.92, 0.18, 0.16, 0.28 + stripe * 0.08);
  } else {
    col = vec4(1.0, 1.0, 1.0, line * 0.32);
  }
  if (uHoverOn > 0.5 && cell == uHover) col = mix(col, vec4(1.0, 1.0, 1.0, 0.45), 0.7);
  gl_FragColor = col;
}`;

export class ZoneView {
  readonly group = new Group();
  private tex: DataTexture;
  private data = new Uint8Array(18 * 32 * 4);
  private mat: ShaderMaterial;
  private plane: Mesh;
  private key = '';
  private ghosts = new Map<string, { inst: ModelInstance; mat: MeshLambertMaterial }[]>();
  private activeGhosts: { inst: ModelInstance; mat: MeshLambertMaterial }[] = [];
  private spellDisc: Mesh;
  private spellRing: Mesh;
  private rangeRing: Mesh;
  private footprint: Mesh;
  private logPath: Mesh;

  constructor() {
    this.tex = new DataTexture(this.data, 18, 32, RGBAFormat);
    this.tex.magFilter = NearestFilter;
    this.tex.minFilter = NearestFilter;
    this.tex.flipY = false;
    this.mat = new ShaderMaterial({
      uniforms: { uMap: { value: this.tex }, uTime: { value: 0 }, uHover: { value: [0, 0] }, uHoverOn: { value: 0 } },
      vertexShader: ZONE_VERT,
      fragmentShader: ZONE_FRAG,
      transparent: true,
      depthWrite: false,
    });
    this.plane = new Mesh(new PlaneGeometry(ARENA.width, ARENA.height), this.mat);
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.position.set(0, 0.035, 0);
    this.plane.renderOrder = 2;
    this.group.add(this.plane);
    const basic = (color: string, opacity: number) => new MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: DoubleSide });
    this.spellDisc = new Mesh(new CircleGeometry(1, 40), basic('#ffffff', 0.22));
    this.spellRing = new Mesh(new RingGeometry(0.94, 1, 48), basic('#ffffff', 0.9));
    this.rangeRing = new Mesh(new RingGeometry(0.96, 1, 64), basic('#ffffff', 0.55));
    this.footprint = new Mesh(new PlaneGeometry(1, 1), basic('#ffffff', 0.3));
    this.logPath = new Mesh(new PlaneGeometry(1, 1), basic('#ffffff', 0.22));
    for (const m of [this.spellDisc, this.spellRing, this.rangeRing, this.footprint, this.logPath]) {
      m.rotation.x = -Math.PI / 2;
      m.renderOrder = 3;
      m.visible = false;
      this.group.add(m);
    }
    this.group.visible = false;
  }

  private refresh(game: Game, team: 0 | 1, cardId: string): void {
    const card = CARDS[cardId];
    const statics = game.entities.filter((e) => e.alive && e.half > 0).map((e) => e.id).join(',');
    const towersDown = game.towers(team === 0 ? 1 : 0).filter((t) => !t.alive).length;
    // 會鑽地的部隊可放到對方半場，禁區和一般部隊不同，要分開快取
    const rule = card.unit && UNITS[card.unit].stats.tunnelSpeed ? 'tunnel' : card.kind;
    const key = `${team}|${rule}|${statics}|${towersDown}`;
    if (key === this.key) return;
    this.key = key;
    const probe = card.kind === 'building' ? 'knight' : cardId;
    for (let ty = 0; ty < 32; ty++) {
      for (let tx = 0; tx < 18; tx++) {
        const ok = card.kind === 'spell' || game.canDeployAt(team, probe, tx + 0.5, ty + 0.5);
        const i = (ty * 18 + tx) * 4;
        this.data[i] = ok ? 0 : 255;
        this.data[i + 3] = 255;
      }
    }
    this.tex.needsUpdate = true;
  }

  private ghostSet(unit: string, n: number): { inst: ModelInstance; mat: MeshLambertMaterial }[] {
    let list = this.ghosts.get(unit);
    if (!list) {
      list = [];
      this.ghosts.set(unit, list);
    }
    while (list.length < n) {
      const mat = toonMaterial({ transparent: true, opacity: 0.55, depthWrite: false });
      const inst = instantiate(getAsset(unit, 0), mat);
      inst.mesh.castShadow = false;
      inst.mesh.renderOrder = 8;
      this.group.add(inst.mesh);
      list.push({ inst, mat });
    }
    return list;
  }

  update(game: Game, show: boolean, selected: string | null, preview: DeployPreview | null, t: number): void {
    const cardId = preview?.cardId ?? selected;
    this.group.visible = show && !!cardId;
    for (const g of this.activeGhosts) g.inst.mesh.visible = false;
    this.activeGhosts = [];
    for (const m of [this.spellDisc, this.spellRing, this.rangeRing, this.footprint, this.logPath]) m.visible = false;
    if (!this.group.visible || !cardId) return;
    const card = CARDS[cardId];
    this.mat.uniforms.uTime.value = t;
    // 法術沒有部署限制，只畫範圍
    this.plane.visible = card.kind !== 'spell';
    if (card.kind !== 'spell') this.refresh(game, 0, cardId);
    this.mat.uniforms.uHoverOn.value = preview ? 1 : 0;
    if (!preview) return;
    this.mat.uniforms.uHover.value = [Math.floor(preview.x), Math.floor(preview.y)];
    const legalColor = preview.legal ? '#ffffff' : '#ff5a4a';
    const px = toX(preview.x);
    const pz = toZ(preview.y);
    if (card.kind === 'spell') {
      const s = card.spell!;
      if (s.kind === 'roll') {
        this.logPath.visible = true;
        this.logPath.scale.set(s.radius * 2, s.rollRange!, 1);
        this.logPath.position.set(px, 0.06, pz - s.rollRange! / 2);
        (this.logPath.material as MeshBasicMaterial).color.set(TEAM_RGB[0].light);
      } else {
        this.spellDisc.visible = true;
        this.spellRing.visible = true;
        this.spellDisc.scale.setScalar(s.radius);
        this.spellRing.scale.setScalar(s.radius);
        this.spellDisc.position.set(px, 0.06, pz);
        this.spellRing.position.set(px, 0.065, pz);
        (this.spellRing.material as MeshBasicMaterial).color.set(TEAM_RGB[0].light);
      }
      return;
    }
    const def = UNITS[card.unit!];
    const offs = card.kind === 'building' ? [[0, 0]] : formation(card.count ?? 1);
    const set = this.ghostSet(def.id, offs.length);
    const prof = profileOf(def.id);
    offs.forEach(([ox, oy], i) => {
      const g = set[i];
      g.inst.mesh.visible = true;
      g.inst.mesh.position.set(px + ox, prof.hover ?? 0, pz + oy);
      g.inst.mesh.rotation.y = Math.PI; // 面向敵方
      g.mat.emissive.set(preview.legal ? '#202020' : '#a01a10');
      this.activeGhosts.push(g);
    });
    if (card.kind === 'building') {
      const half = def.stats.half ?? 1;
      this.footprint.visible = true;
      this.footprint.scale.set(half * 2, half * 2, 1);
      this.footprint.position.set(px, 0.05, pz);
      (this.footprint.material as MeshBasicMaterial).color.set(legalColor);
    }
    // 射程圈：遠程部隊與建築
    const st = def.stats;
    if ((st.projectile && !st.kamikaze) || (card.kind === 'building' && st.range > 0)) {
      this.rangeRing.visible = true;
      const r = st.range + (st.half ?? st.radius);
      this.rangeRing.scale.setScalar(r);
      this.rangeRing.position.set(px, 0.07, pz);
      (this.rangeRing.material as MeshBasicMaterial).color.set(legalColor);
    }
  }
}

export { CX, CZ };
