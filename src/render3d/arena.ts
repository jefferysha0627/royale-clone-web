import {
  CanvasTexture, Color, DoubleSide, Group, LinearMipmapLinearFilter, Mesh, MeshLambertMaterial, PlaneGeometry, ShaderMaterial, SRGBColorSpace,
  type WebGLRenderer,
} from 'three';
import { ARENA, TOWER_LAYOUT } from '../sim';
import { CX, CZ } from './coords';
import { Kit } from './kit';
import { shade } from './models/humanoid';

// 競技場：手繪感的草地格紋與石磚步道（Canvas 產生貼圖）、下凹的流動河道、3 格寬木橋、石牆與場外樹木。
// 版面依原作公開截圖的結構（直向、雙橋、步道連接塔與橋）重新以原創風格繪製。

const PX = 48; // 每格貼圖像素
const RIVER_DEPTH = 0.32;

/** 競技場配色（獎盃累積到門檻會換場地，見 ui/progress.ts）。 */
interface ArenaPalette {
  grassA: string;
  grassB: string;
  path: string;
  pathLine: string;
  base: string;
  trees: [string, string, string]; // 樹冠深、中、亮
  outside: string; // 場外草地
}

export const ARENA_THEMES: ArenaPalette[] = [
  // 0 綠野競技場
  { grassA: '#8fcf5e', grassB: '#86c656', path: '#e5c98a', pathLine: 'rgba(150,110,60,0.45)', base: '#c9b07a', trees: ['#3f8f3a', '#4a9a3e', '#5aae48'], outside: '#3f7a35' },
  // 1 石橋要塞：偏冷的草地、灰色石板路
  { grassA: '#94c76c', grassB: '#89bb62', path: '#cfcabb', pathLine: 'rgba(95,95,100,0.45)', base: '#b4ad9c', trees: ['#2f7a45', '#3a874f', '#4c9a5c'], outside: '#386f3a' },
  // 2 楓紅山谷：秋天的黃綠草地與楓紅樹
  { grassA: '#b7c75c', grassB: '#abbb52', path: '#e6b878', pathLine: 'rgba(150,90,40,0.45)', base: '#cf9f62', trees: ['#c4532a', '#e0782e', '#f2a63a'], outside: '#6f7a32' },
  // 3 月光湖畔：帶藍的青草、淡色石路
  { grassA: '#7fc69a', grassB: '#74ba8f', path: '#dcd6c0', pathLine: 'rgba(90,110,120,0.45)', base: '#bdb9a2', trees: ['#2c6f6a', '#36807a', '#46958c'], outside: '#2f6455' },
  // 4 雷霆高地：乾草地、深色樹
  { grassA: '#a4bf6c', grassB: '#98b262', path: '#cdb48a', pathLine: 'rgba(120,95,60,0.45)', base: '#ad976c', trees: ['#46603a', '#556f42', '#66814c'], outside: '#4d5f36' },
  // 5 黃金王座：鮮綠草地、金色步道
  { grassA: '#92d66c', grassB: '#86cb61', path: '#f1d47e', pathLine: 'rgba(170,120,30,0.5)', base: '#e2c060', trees: ['#2f9a46', '#3aab52', '#52c062'], outside: '#3a8a3a' },
];

function rand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 畫出整片地面貼圖（含河道區域的河床）。 */
function paintGround(pal: ArenaPalette, c = document.createElement('canvas')): HTMLCanvasElement {
  const W = ARENA.width;
  const H = ARENA.height;
  c.width = W * PX;
  c.height = H * PX;
  const g = c.getContext('2d')!;
  const r = rand(7);
  // 草地格紋（兩種綠交錯）
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      const even = (tx + ty) % 2 === 0;
      g.fillStyle = even ? pal.grassA : pal.grassB;
      g.fillRect(tx * PX, ty * PX, PX, PX);
    }
  }
  // 草叢細節
  for (let i = 0; i < 1400; i++) {
    const x = r() * c.width;
    const y = r() * c.height;
    g.fillStyle = r() < 0.5 ? 'rgba(60,120,40,0.18)' : 'rgba(200,240,140,0.16)';
    g.beginPath();
    g.ellipse(x, y, 2 + r() * 4, 1 + r() * 2, r() * 3, 0, Math.PI * 2);
    g.fill();
  }
  // 石磚步道：塔基、塔與塔之間、兩條路線
  const path = (x0: number, y0: number, x1: number, y1: number) => {
    const x = Math.min(x0, x1) * PX;
    const y = Math.min(y0, y1) * PX;
    const w = Math.abs(x1 - x0) * PX;
    const h = Math.abs(y1 - y0) * PX;
    g.fillStyle = pal.path;
    g.fillRect(x, y, w, h);
    // 石磚分隔線
    g.strokeStyle = pal.pathLine;
    g.lineWidth = 2;
    const step = PX / 2;
    for (let yy = y; yy <= y + h; yy += step) {
      g.beginPath();
      g.moveTo(x, yy);
      g.lineTo(x + w, yy);
      g.stroke();
    }
    for (let yy = y, row = 0; yy < y + h; yy += step, row++) {
      for (let xx = x + (row % 2 ? step / 2 : 0); xx <= x + w; xx += step) {
        g.beginPath();
        g.moveTo(xx, yy);
        g.lineTo(xx, Math.min(y + h, yy + step));
        g.stroke();
      }
    }
    g.strokeStyle = 'rgba(120,85,45,0.6)';
    g.lineWidth = 3;
    g.strokeRect(x, y, w, h);
  };
  for (const flip of [false, true]) {
    const fy = (y: number) => (flip ? H - y : y);
    const king = TOWER_LAYOUT.find((t) => t.type === 'king')!;
    // 國王塔兩側往側塔的橫向步道
    path(3, fy(king.y - 0.6), 15, fy(king.y + 0.6));
    for (const t of TOWER_LAYOUT.filter((tt) => tt.type === 'princess')) {
      // 路線：側塔 → 橋
      const y0 = fy(t.y);
      const y1 = flip ? ARENA.riverTop : ARENA.riverBottom;
      path(t.x - 0.7, Math.min(y0, y1), t.x + 0.7, Math.max(y0, y1));
      path(t.x - 0.7, Math.min(fy(king.y), y0), t.x + 0.7, Math.max(fy(king.y), y0));
    }
    // 塔基石板
    for (const t of TOWER_LAYOUT) {
      const half = t.type === 'king' ? 2.4 : 1.9;
      const ty = fy(t.y);
      g.fillStyle = pal.base;
      g.fillRect((t.x - half) * PX, (ty - half) * PX, half * 2 * PX, half * 2 * PX);
      g.strokeStyle = 'rgba(110,80,40,0.55)';
      g.lineWidth = 4;
      g.strokeRect((t.x - half) * PX, (ty - half) * PX, half * 2 * PX, half * 2 * PX);
    }
  }
  // 河床（被水面蓋住，只在岸邊看得到）
  g.fillStyle = '#2f6f8f';
  g.fillRect(0, ARENA.riverTop * PX, c.width, (ARENA.riverBottom - ARENA.riverTop) * PX);
  // 外框陰影
  const grad = g.createLinearGradient(0, 0, PX * 0.6, 0);
  grad.addColorStop(0, 'rgba(0,0,0,0.25)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, PX * 0.6, c.height);
  const grad2 = g.createLinearGradient(c.width, 0, c.width - PX * 0.6, 0);
  grad2.addColorStop(0, 'rgba(0,0,0,0.25)');
  grad2.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad2;
  g.fillRect(c.width - PX * 0.6, 0, PX * 0.6, c.height);
  return c;
}

const WATER_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const WATER_FRAG = `
uniform float uTime;
varying vec2 vUv;
void main() {
  vec2 p = vUv * vec2(18.0, 2.0);
  float w = sin(p.x * 1.7 + uTime * 1.4 + sin(p.y * 3.0 + uTime) * 1.2) * 0.5 + 0.5;
  float w2 = sin(p.x * 3.1 - uTime * 2.1 + p.y * 4.0) * 0.5 + 0.5;
  vec3 deep = vec3(0.16, 0.50, 0.80);
  vec3 lite = vec3(0.33, 0.70, 0.93);
  vec3 col = mix(deep, lite, w * 0.6 + w2 * 0.25);
  // 波光
  float glint = smoothstep(0.93, 1.0, sin(p.x * 5.0 + uTime * 2.5 + sin(p.y * 7.0)) * w2);
  col += glint * 0.35;
  // 岸邊白沫
  float edge = min(vUv.y, 1.0 - vUv.y);
  col = mix(vec3(0.85, 0.95, 1.0), col, smoothstep(0.0, 0.12, edge + sin(p.x * 6.0 + uTime * 3.0) * 0.02));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

export class ArenaView {
  readonly group = new Group();
  private water: ShaderMaterial;
  private canvas: HTMLCanvasElement;
  private tex: CanvasTexture;
  private decor: Mesh;
  private decors = new Map<number, Mesh>();
  private farMat: MeshLambertMaterial;
  private theme = 0;

  constructor(renderer: WebGLRenderer) {
    const W = ARENA.width;
    this.canvas = paintGround(ARENA_THEMES[0]);
    const tex = (this.tex = new CanvasTexture(this.canvas));
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    tex.minFilter = LinearMipmapLinearFilter;
    const groundMat = new MeshLambertMaterial({ map: tex });
    // 地面分成上下兩半，中間的河道下凹
    const halves: [number, number][] = [[0, ARENA.riverTop], [ARENA.riverBottom, ARENA.height]];
    for (const [y0, y1] of halves) {
      const geo = new PlaneGeometry(W, y1 - y0);
      const uv = geo.attributes.uv;
      for (let i = 0; i < uv.count; i++) {
        const v = uv.getY(i); // 1 在上（y0）、0 在下（y1）
        const yy = y0 + (1 - v) * (y1 - y0);
        uv.setY(i, 1 - yy / ARENA.height);
      }
      const m = new Mesh(geo, groundMat);
      m.rotation.x = -Math.PI / 2;
      m.position.set(0, 0, (y0 + y1) / 2 - CZ);
      m.receiveShadow = true;
      this.group.add(m);
    }
    // 河岸石牆與水面
    this.water = new ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader: WATER_VERT, fragmentShader: WATER_FRAG });
    const water = new Mesh(new PlaneGeometry(W + 6, ARENA.riverBottom - ARENA.riverTop), this.water);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -RIVER_DEPTH + 0.06, (ARENA.riverTop + ARENA.riverBottom) / 2 - CZ);
    this.group.add(water);

    this.decor = this.buildDecor(ARENA_THEMES[0]);
    this.decors.set(0, this.decor);
    this.group.add(this.decor);

    // 遠方草地底色，避免寬螢幕露出背景
    this.farMat = new MeshLambertMaterial({ color: new Color(shade(ARENA_THEMES[0].outside, -0.04)), side: DoubleSide });
    const far = new Mesh(new PlaneGeometry(120, 120), this.farMat);
    far.rotation.x = -Math.PI / 2;
    far.position.y = -0.7;
    far.receiveShadow = true;
    this.group.add(far);
  }

  /** 換競技場配色：重畫地面貼圖、換整組裝飾。 */
  setTheme(i: number): void {
    const idx = Math.max(0, Math.min(ARENA_THEMES.length - 1, Math.floor(i)));
    if (idx === this.theme) return;
    this.theme = idx;
    const pal = ARENA_THEMES[idx];
    paintGround(pal, this.canvas);
    this.tex.needsUpdate = true;
    this.decor.visible = false;
    let d = this.decors.get(idx);
    if (!d) {
      d = this.buildDecor(pal);
      this.decors.set(idx, d);
      this.group.add(d);
    }
    d.visible = true;
    this.decor = d;
    this.farMat.color.set(shade(pal.outside, -0.04));
  }

  update(t: number): void {
    this.water.uniforms.uTime.value = t;
  }

  /** 場地裝飾（河岸、橋、圍牆、場外樹木）；依競技場配色建立，切換場地時換整組。 */
  private buildDecor(pal: ArenaPalette): Mesh {
    const W = ARENA.width;
    const k = new Kit();
    k.addBone('root', -1, [0, 0, 0]);
    const bankZ = [ARENA.riverTop - CZ, ARENA.riverBottom - CZ];
    for (const z of bankZ) {
      const side = z < 0 ? 1 : -1; // 牆面朝向河中央
      k.box(W + 6, RIVER_DEPTH + 0.02, 0.2, { at: [0, -RIVER_DEPTH / 2, z + side * 0.1], color: '#8a8478' });
      for (let i = 0; i < 24; i++) {
        k.box(0.75, 0.1, 0.22, { at: [-W / 2 - 2.5 + i * 0.95 + (z > 0 ? 0.4 : 0), 0.02, z + side * 0.08], color: i % 2 ? '#a39d90' : '#958f82' });
      }
    }
    // 橋：木板、兩側欄杆與柱子
    for (const bx of ARENA.bridgeXs) {
      const x = bx - CX;
      const half = ARENA.bridgeHalfWidth;
      const z0 = ARENA.riverTop - CZ - 0.35;
      const len = ARENA.riverBottom - ARENA.riverTop + 0.7;
      for (let i = 0; i < 7; i++) {
        k.box(half * 2 + 0.1, 0.12, len / 7 - 0.04, { at: [x, 0.03, z0 + (i + 0.5) * (len / 7)], color: i % 2 ? '#a8743e' : '#9a6834' });
      }
      k.box(half * 2 + 0.2, 0.1, len, { at: [x, -0.05, z0 + len / 2], color: '#6e4826' });
      for (const sx of [1, -1]) {
        k.box(0.14, 0.12, len, { at: [x + sx * (half + 0.02), 0.42, z0 + len / 2], color: '#7a5230' });
        for (const zz of [0.1, len / 2, len - 0.1]) {
          k.cyl(0.11, 0.13, 0.6, { at: [x + sx * (half + 0.02), 0.22, z0 + zz], color: '#5a3a1e' }, 6);
        }
      }
    }
    // 場地左右的矮石牆與場外裝飾
    const r = rand(11);
    for (const sx of [1, -1]) {
      const wx = sx * (W / 2 + 0.35);
      k.box(0.5, 0.55, ARENA.height + 1, { at: [wx, 0.27, 0], color: '#a49e90' });
      k.box(0.6, 0.12, ARENA.height + 1, { at: [wx, 0.58, 0], color: '#c2bcad' });
      for (let i = 0; i < 17; i++) k.box(0.62, 0.16, 0.08, { at: [wx, 0.36, -16 + i * 2], color: '#8a8478' });
      // 場外地面
      k.box(14, 0.1, ARENA.height + 14, { at: [sx * (W / 2 + 7.6), -0.06, 0], color: pal.outside });
      for (let i = 0; i < 26; i++) {
        const x = sx * (W / 2 + 1.4 + r() * 8);
        const z = -21 + r() * 42;
        if (Math.abs(z - (ARENA.riverTop + 1 - CZ)) < 1.6) continue;
        const kind = r();
        if (kind < 0.55) {
          // 樹：樹幹＋兩層樹冠
          const s = 0.8 + r() * 0.7;
          k.cyl(0.14 * s, 0.2 * s, 0.9 * s, { at: [x, 0.45 * s, z], color: '#6b4426' }, 6);
          k.sphere(0.85 * s, { at: [x, 1.35 * s, z], scale: [1, 0.9, 1], color: r() < 0.5 ? pal.trees[0] : pal.trees[1] }, 9);
          k.sphere(0.6 * s, { at: [x + 0.25 * s, 1.85 * s, z + 0.1 * s], color: pal.trees[2] }, 8);
        } else if (kind < 0.8) {
          const s = 0.4 + r() * 0.5;
          k.rock(s, { at: [x, s * 0.4, z], scale: [1.2, 0.8, 1], color: r() < 0.5 ? '#9a958a' : '#8a857a' });
        } else {
          const s = 0.35 + r() * 0.3;
          k.sphere(s, { at: [x, s * 0.5, z], scale: [1.3, 0.8, 1.1], color: '#5aa046' }, 8);
          k.sphere(s * 0.18, { at: [x + s * 0.4, s * 0.85, z + s * 0.3], color: r() < 0.5 ? '#ffd36b' : '#ff8fb0' }, 5);
        }
      }
    }
    // 上方（對手後方）：城垛高牆、兩端角樓、隊伍色三角旗，牆後一排樹與遠丘；高牆在場地後面，不會擋到場上單位
    {
      const wz = -(ARENA.height / 2 + 0.6);
      k.box(W + 14, 0.1, 9, { at: [0, -0.06, wz - 4.2], color: shade(pal.outside, 0.06) });
      k.box(W + 2.4, 1.15, 0.8, { at: [0, 0.57, wz], color: '#b8ad98' });
      k.box(W + 2.6, 0.14, 0.92, { at: [0, 1.2, wz], color: '#cfc5b0' });
      for (let i = 0; i < 21; i++) k.box(0.5, 0.34, 0.8, { at: [-W / 2 - 0.9 + i * 0.99, 1.43, wz], color: i % 2 ? '#c4b9a3' : '#cbc1ab' });
      for (let i = 0; i < 10; i++) k.box(1.6, 0.05, 0.82, { at: [-W / 2 + 0.2 + i * 2, 0.42 + (i % 2) * 0.36, wz], color: '#a39883' });
      for (const fx of [-6.5, -2.2, 2.2, 6.5]) {
        k.cyl(0.05, 0.05, 1.5, { at: [fx, 1.9, wz], color: '#6b4426' }, 5);
        k.cone(0.2, 0.75, { at: [fx + 0.36, 2.42, wz], rot: [0, 0, -Math.PI / 2], scale: [1, 1, 0.15], color: '#de3b33' }, 3);
        k.sphere(0.06, { at: [fx, 2.66, wz], color: '#f2b233' }, 5);
      }
      for (const sx of [-1, 1]) {
        const tx = sx * (W / 2 + 1.0);
        k.cyl(0.95, 1.05, 2.3, { at: [tx, 1.15, wz - 0.2], color: '#c4b9a3' }, 12);
        for (const y of [0.7, 1.4]) k.cyl(1.02, 1.02, 0.06, { at: [tx, y, wz - 0.2], color: '#a39883' }, 12);
        k.cyl(1.1, 1.0, 0.18, { at: [tx, 2.38, wz - 0.2], color: '#a39883' }, 12);
        k.cone(1.2, 1.5, { at: [tx, 3.22, wz - 0.2], color: '#b8423a' }, 12);
        k.sphere(0.12, { at: [tx, 4.0, wz - 0.2], color: '#f2b233' }, 6);
        k.box(0.3, 0.45, 0.06, { at: [tx, 1.55, wz + 0.82], color: '#3a2e26' });
      }
      // 牆後的樹與遠丘
      for (let i = 0; i < 16; i++) {
        const x = -W / 2 - 3 + i * 1.6 + (r() - 0.5) * 0.9;
        const z = wz - 1.4 - r() * 2.6;
        const s = 0.95 + r() * 0.55;
        k.cyl(0.15 * s, 0.22 * s, 1.0 * s, { at: [x, 0.5 * s, z], color: '#6b4426' }, 6);
        k.sphere(0.95 * s, { at: [x, 1.5 * s, z], scale: [1, 0.9, 1], color: i % 3 === 0 ? pal.trees[0] : pal.trees[1] }, 9);
        k.sphere(0.62 * s, { at: [x + 0.3 * s, 2.05 * s, z + 0.15 * s], color: pal.trees[2] }, 8);
      }
      for (let i = 0; i < 6; i++) {
        k.sphere(3.2, { at: [-W / 2 - 2 + i * 4.4, -1.2, wz - 6.5 - (i % 2) * 1.2], scale: [1.4, 0.75, 1], color: i % 2 ? '#3f7d36' : '#46883c' }, 12);
      }
    }
    // 下方（己方後方）：矮石牆、花台與灌木（保持低矮，避免擋住己方最後一排）
    {
      const wz = ARENA.height / 2 + 0.35;
      k.box(W + 1.2, 0.6, 0.5, { at: [0, 0.3, wz], color: '#a49e90' });
      k.box(W + 1.2, 0.12, 0.6, { at: [0, 0.62, wz], color: '#c2bcad' });
      k.box(W + 14, 0.1, 6, { at: [0, -0.06, wz + 3.05], color: pal.outside });
      for (let i = 0; i < 6; i++) {
        const x = -W / 2 + 1.2 + i * 3.1;
        k.box(2.2, 0.32, 0.6, { at: [x, 0.16, wz + 0.75], color: '#8a5a2e' });
        k.box(2.1, 0.1, 0.5, { at: [x, 0.34, wz + 0.75], color: '#5a3a1e' });
        for (let j = 0; j < 6; j++) {
          k.sphere(0.13, { at: [x - 0.85 + j * 0.34, 0.45, wz + 0.72 + (j % 2) * 0.1], color: ['#ff8fb0', '#ffd36b', '#ffffff', '#ff6b5a'][(i + j) % 4] }, 6);
        }
      }
      for (const fx of [-7, 7]) {
        k.cyl(0.06, 0.06, 2.2, { at: [fx, 1.1, wz], color: '#6b4426' }, 5);
        k.box(0.04, 0.7, 0.9, { at: [fx, 1.75, wz - 0.45], color: '#2f74e8' });
      }
    }
    const decor = new Mesh(k.build(1).geometry, new MeshLambertMaterial({ vertexColors: true }));
    decor.castShadow = true;
    decor.receiveShadow = true;
    return decor;
  }

}
