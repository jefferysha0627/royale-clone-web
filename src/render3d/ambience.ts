import { BufferAttribute, BufferGeometry, NormalBlending, Points, ShaderMaterial } from 'three';
import type { ArenaStyle } from './props';

// 競技場的環境動態（純裝飾，不影響對戰）：綠野的花粉、要塞火盆的火星、楓紅山谷的落葉、湖畔的螢火蟲、
// 高地水晶的閃光、黃金王座的金色亮片。數量固定（物件池），大多在場地外圍，飄進場內的很稀疏。

const VERT = `
attribute float aSize;
attribute float aAlpha;
attribute float aSpin;
attribute vec3 aColor;
uniform float uScale;
varying float vAlpha;
varying float vSpin;
varying vec3 vColor;
void main() {
  vAlpha = aAlpha;
  vSpin = aSpin;
  vColor = aColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uScale;
}`;

const FRAG = `
uniform float uLeaf;
varying float vAlpha;
varying float vSpin;
varying vec3 vColor;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float c = cos(vSpin);
  float s = sin(vSpin);
  d = vec2(c * d.x - s * d.y, s * d.x + c * d.y);
  // 落葉是旋轉的細長橢圓；其他是偏白的亮心＋半透明光暈（明亮的草地上也看得到）
  vec3 col = vColor;
  float a;
  if (uLeaf > 0.5) {
    a = smoothstep(0.5, 0.4, length(d * vec2(1.0, 2.3)));
  } else {
    float r = length(d);
    float core = smoothstep(0.24, 0.06, r);
    a = max(core, smoothstep(0.5, 0.14, r) * 0.42);
    col = mix(vColor, vec3(1.0), core * 0.5);
  }
  a *= vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a);
  #include <colorspace_fragment>
}`;

type V3 = [number, number, number];

interface Mote {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  age: number;
  life: number;
  phase: number;
  size: number;
  spin: number;
  spinRate: number;
  r: number;
  g: number;
  b: number;
}

interface StyleDef {
  count: number;
  leaf: boolean;
  colors: string[];
  size: [number, number];
  alpha: number;
  spawn(m: Mote, rnd: () => number, emitters: V3[]): void;
  move(m: Mote, dt: number, t: number): void;
  /** 0～1：依年齡算出的不透明度倍率。 */
  fade(m: Mote, t: number): number;
}

const CAP = 48;
const FIELD_X = 9;
const FIELD_Z = 16;

/**
 * 畫面看得到的隨機位置：inside 機率落在場內，其餘在左右牆邊與後方牆前的窄帶
 * （直向手機只看得到場地本身，再往外撒就看不到了）。
 */
function aroundField(rnd: () => number, inside = 0.5): [number, number] {
  if (rnd() < inside) return [(rnd() - 0.5) * 2 * FIELD_X, (rnd() - 0.5) * 2 * FIELD_Z];
  if (rnd() < 0.7) return [(rnd() < 0.5 ? -1 : 1) * (FIELD_X - 0.6 + rnd() * 1.8), (rnd() - 0.5) * 2 * FIELD_Z];
  return [(rnd() - 0.5) * 2 * FIELD_X, -FIELD_Z - rnd() * 2];
}

const fadeInOut = (m: Mote): number => Math.min(1, m.age / 0.6, (m.life - m.age) / 0.8);

const STYLES: Record<ArenaStyle, StyleDef> = {
  meadow: {
    count: 30, leaf: false, colors: ['#fffbe0', '#fff1a0', '#ffffff'], size: [0.26, 0.36], alpha: 0.8,
    spawn(m, rnd) {
      [m.x, m.z] = aroundField(rnd, 0.6);
      m.y = 0.4 + rnd() * 2;
      m.vx = (rnd() - 0.5) * 0.3;
      m.vz = (rnd() - 0.5) * 0.3;
      m.vy = 0;
      m.life = 6 + rnd() * 6;
    },
    move(m, dt, t) {
      m.x += (m.vx + Math.sin(t * 0.7 + m.phase) * 0.15) * dt;
      m.z += m.vz * dt;
      m.y += Math.sin(t * 1.3 + m.phase) * 0.12 * dt;
    },
    fade: fadeInOut,
  },
  fort: {
    count: 36, leaf: false, colors: ['#ffb347', '#ff8a2a', '#ffe08a'], size: [0.26, 0.38], alpha: 1,
    spawn(m, rnd, em) {
      const e = em.length ? em[Math.floor(rnd() * em.length)] : ([(rnd() - 0.5) * 20, 1.2, -18] as V3);
      m.x = e[0] + (rnd() - 0.5) * 0.25;
      m.y = e[1];
      m.z = e[2] + (rnd() - 0.5) * 0.25;
      m.vx = (rnd() - 0.5) * 0.25;
      m.vz = (rnd() - 0.5) * 0.25;
      m.vy = 0.7 + rnd() * 0.6;
      m.life = 1.2 + rnd() * 1.3;
    },
    move(m, dt, t) {
      m.x += (m.vx + Math.sin(t * 5 + m.phase) * 0.2) * dt;
      m.z += m.vz * dt;
      m.y += m.vy * dt;
      m.vy *= 1 - 0.4 * dt;
    },
    fade: (m) => Math.min(1, m.age / 0.15) * (1 - m.age / m.life),
  },
  autumn: {
    count: 30, leaf: true, colors: ['#e0782e', '#c4532a', '#f2a63a', '#d9692a'], size: [0.5, 0.66], alpha: 0.95,
    spawn(m, rnd) {
      [m.x, m.z] = aroundField(rnd, 0.55);
      m.y = 2.6 + rnd() * 1.6;
      m.vx = 0.15 + rnd() * 0.25;
      m.vz = (rnd() - 0.5) * 0.2;
      m.vy = -(0.35 + rnd() * 0.25);
      m.life = 9;
      m.spinRate = (rnd() < 0.5 ? -1 : 1) * (1.2 + rnd() * 1.8);
    },
    move(m, dt, t) {
      if (m.y > 0.03) {
        m.x += (m.vx + Math.sin(t * 1.6 + m.phase) * 0.45) * dt;
        m.z += m.vz * dt;
        m.y = Math.max(0.03, m.y + m.vy * dt);
        m.spin += m.spinRate * dt;
      } else if (m.age < m.life - 1.2) {
        // 落地後停一會兒再淡出
        m.age = m.life - 1.2;
      }
    },
    fade: (m) => Math.min(1, m.age / 0.5, (m.life - m.age) / 1.2),
  },
  lake: {
    count: 30, leaf: false, colors: ['#e6ff8a', '#c8ff6a', '#fff3a0'], size: [0.34, 0.46], alpha: 1,
    spawn(m, rnd) {
      [m.x, m.z] = aroundField(rnd, 0.5);
      // 河岸附近多一些
      if (rnd() < 0.35) m.z = (rnd() - 0.5) * 4;
      m.y = 0.3 + rnd() * 1.6;
      m.vx = (rnd() - 0.5) * 0.4;
      m.vz = (rnd() - 0.5) * 0.4;
      m.vy = 0;
      m.life = 5 + rnd() * 5;
    },
    move(m, dt, t) {
      m.x += (m.vx + Math.sin(t * 0.9 + m.phase * 2) * 0.25) * dt;
      m.z += (m.vz + Math.cos(t * 0.8 + m.phase) * 0.25) * dt;
      m.y += Math.sin(t * 1.7 + m.phase) * 0.18 * dt;
    },
    // 螢火蟲一閃一閃
    fade: (m, t) => fadeInOut(m) * (0.25 + 0.75 * Math.max(0, Math.sin(t * 2.4 + m.phase * 3))),
  },
  highland: {
    count: 34, leaf: false, colors: ['#8fe8ff', '#c99bff', '#e8f6ff'], size: [0.28, 0.4], alpha: 1,
    spawn(m, rnd, em) {
      if (em.length && rnd() < 0.75) {
        const e = em[Math.floor(rnd() * em.length)];
        m.x = e[0] + (rnd() - 0.5) * 0.5;
        m.y = e[1] * (0.4 + rnd() * 0.6);
        m.z = e[2] + (rnd() - 0.5) * 0.5;
      } else {
        [m.x, m.z] = aroundField(rnd, 0.6);
        m.y = 0.3 + rnd() * 1.5;
      }
      m.vx = (rnd() - 0.5) * 0.15;
      m.vz = (rnd() - 0.5) * 0.15;
      m.vy = 0.25 + rnd() * 0.35;
      m.life = 1.6 + rnd() * 1.6;
    },
    move(m, dt) {
      m.x += m.vx * dt;
      m.z += m.vz * dt;
      m.y += m.vy * dt;
    },
    fade: (m, t) => Math.min(1, m.age / 0.3, (m.life - m.age) / 0.6) * (0.5 + 0.5 * Math.sin(t * 9 + m.phase * 5)),
  },
  royal: {
    count: 30, leaf: false, colors: ['#ffe27a', '#fff3c4', '#f2c14a'], size: [0.26, 0.36], alpha: 1,
    spawn(m, rnd) {
      [m.x, m.z] = aroundField(rnd, 0.6);
      m.y = 1.5 + rnd() * 2.5;
      m.vx = (rnd() - 0.5) * 0.2;
      m.vz = (rnd() - 0.5) * 0.2;
      m.vy = -(0.12 + rnd() * 0.15);
      m.life = 6 + rnd() * 5;
    },
    move(m, dt, t) {
      m.x += (m.vx + Math.sin(t + m.phase) * 0.1) * dt;
      m.z += m.vz * dt;
      m.y = Math.max(0.05, m.y + m.vy * dt);
    },
    fade: (m, t) => fadeInOut(m) * (0.35 + 0.65 * Math.abs(Math.sin(t * 3.2 + m.phase * 4))),
  },
};

export class Ambience {
  readonly points: Points;
  private material: ShaderMaterial;
  private pos = new Float32Array(CAP * 3);
  private col = new Float32Array(CAP * 3);
  private size = new Float32Array(CAP);
  private alpha = new Float32Array(CAP);
  private spin = new Float32Array(CAP);
  private motes: Mote[] = [];
  private def: StyleDef = STYLES.meadow;
  private emitters: V3[] = [];
  private seed = 1;
  private lastT = -1;
  enabled = true;

  constructor() {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(this.pos, 3));
    geo.setAttribute('aColor', new BufferAttribute(this.col, 3));
    geo.setAttribute('aSize', new BufferAttribute(this.size, 1));
    geo.setAttribute('aAlpha', new BufferAttribute(this.alpha, 1));
    geo.setAttribute('aSpin', new BufferAttribute(this.spin, 1));
    this.material = new ShaderMaterial({
      uniforms: { uScale: { value: 20 }, uLeaf: { value: 0 } },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
    });
    this.points = new Points(geo, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 4;
    for (let i = 0; i < CAP; i++) {
      this.motes.push({ x: 0, y: -5, z: 0, vx: 0, vy: 0, vz: 0, age: 0, life: 0, phase: 0, size: 0, spin: 0, spinRate: 0, r: 1, g: 1, b: 1 });
    }
    this.setStyle('meadow', []);
  }

  private rnd = (): number => {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  };

  setScale(pxPerUnit: number): void {
    this.material.uniforms.uScale.value = pxPerUnit;
  }

  /** 換競技場：換粒子種類與發射點（火盆、水晶的位置），重新撒一輪。 */
  setStyle(style: ArenaStyle, emitters: V3[]): void {
    this.def = STYLES[style];
    this.emitters = emitters;
    this.material.uniforms.uLeaf.value = this.def.leaf ? 1 : 0;
    this.motes.forEach((m, i) => {
      if (i < this.def.count) {
        this.respawn(m);
        m.age = this.rnd() * m.life; // 一開始就分散在各個階段
      } else {
        m.life = 0;
      }
    });
  }

  private respawn(m: Mote): void {
    const d = this.def;
    m.age = 0;
    m.phase = this.rnd() * Math.PI * 2;
    m.spin = this.rnd() * Math.PI;
    m.spinRate = 0;
    m.size = d.size[0] + this.rnd() * (d.size[1] - d.size[0]);
    const c = d.colors[Math.floor(this.rnd() * d.colors.length)];
    const n = parseInt(c.slice(1), 16);
    m.r = ((n >> 16) & 255) / 255;
    m.g = ((n >> 8) & 255) / 255;
    m.b = (n & 255) / 255;
    d.spawn(m, this.rnd, this.emitters);
  }

  update(t: number): void {
    const dt = this.lastT < 0 ? 0 : Math.min(0.1, Math.max(0, t - this.lastT));
    this.lastT = t;
    this.points.visible = this.enabled;
    if (!this.enabled) return;
    const d = this.def;
    for (let i = 0; i < CAP; i++) {
      const m = this.motes[i];
      if (i >= d.count) {
        this.alpha[i] = 0;
        continue;
      }
      m.age += dt;
      if (m.age >= m.life) this.respawn(m);
      d.move(m, dt, t);
      this.pos[i * 3] = m.x;
      this.pos[i * 3 + 1] = m.y;
      this.pos[i * 3 + 2] = m.z;
      // 顏色存線性值（輸出時會轉回 sRGB）
      this.col[i * 3] = m.r * m.r;
      this.col[i * 3 + 1] = m.g * m.g;
      this.col[i * 3 + 2] = m.b * m.b;
      this.size[i] = m.size;
      this.spin[i] = m.spin;
      this.alpha[i] = Math.max(0, Math.min(1, d.fade(m, t))) * d.alpha;
    }
    const g = this.points.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.aColor.needsUpdate = true;
    g.attributes.aSize.needsUpdate = true;
    g.attributes.aAlpha.needsUpdate = true;
    g.attributes.aSpin.needsUpdate = true;
  }
}
