import {
  CanvasTexture, Color, DoubleSide, Group, LinearMipmapLinearFilter, Mesh, MeshBasicMaterial, MeshLambertMaterial, PlaneGeometry, ShaderMaterial,
  SRGBColorSpace, type WebGLRenderer,
} from 'three';
import { ARENA, TOWER_LAYOUT } from '../sim';
import { Ambience } from './ambience';
import { CX, CZ } from './coords';
import { Kit, type V3 } from './kit';
import { shade } from './models/humanoid';
import { backTree, banner, brazier, crystal, lantern, lily, pumpkin, reeds, scatterProp, topiary, type ArenaStyle, type PropColors } from './props';

// 競技場：手繪感的草地格紋與石磚步道（Canvas 產生貼圖）、下凹的流動河道、3 格寬的橋、石牆與場外道具。
// 版面依原作公開截圖的結構（直向、雙橋、步道連接塔與橋）重新以原創風格繪製；
// 每座競技場有自己的牆色、橋、水色、燈光與場外道具（松樹、楓樹、柳樹與燈籠、水晶、金柱…）。

const PX = 48; // 每格貼圖像素
const RIVER_DEPTH = 0.32;

/** 場地燈光（昏暗的場地仍要讓紅藍兩隊看得清楚，只做輕微的色調變化）。 */
export interface ArenaLight {
  sky: string;
  ground: string;
  hemi: number;
  sun: string;
  sunI: number;
  bg: string;
}

/** 競技場外觀（獎盃累積到門檻會換場地，見 ui/progress.ts）：配色、牆、橋、水色、燈光與場外道具風格。 */
export interface ArenaPalette extends PropColors {
  style: ArenaStyle;
  grassA: string;
  grassB: string;
  path: string;
  pathLine: string;
  base: string;
  outside: string; // 場外草地
  wall: [string, string, string]; // 牆身、牆頂、暗部
  roof: string; // 角樓屋頂
  bridge: 'wood' | 'stone';
  wood: [string, string]; // 木橋板的兩種色
  water: [string, string]; // 深、淺
  light: ArenaLight;
}

const DAY: ArenaLight = { sky: '#fff6e0', ground: '#6f8f4f', hemi: 2.1, sun: '#fff1d6', sunI: 2.6, bg: '#2d4f2a' };

export const ARENA_THEMES: ArenaPalette[] = [
  // 0 綠野競技場：圓樹、石頭、花叢
  {
    style: 'meadow', grassA: '#8fcf5e', grassB: '#86c656', path: '#e5c98a', pathLine: 'rgba(150,110,60,0.45)', base: '#c9b07a', outside: '#3f7a35',
    trees: ['#3f8f3a', '#4a9a3e', '#5aae48'], rock: ['#9a958a', '#8a857a'], accent: '#ff8fb0',
    wall: ['#b3a994', '#cbc1ac', '#9a907d'], roof: '#b8423a', bridge: 'wood', wood: ['#a8743e', '#9a6834'],
    water: ['#6fbbe7', '#9cdaf7'], light: DAY,
  },
  // 1 石橋要塞：灰色花崗岩牆、銅綠屋頂、石橋、松樹與火盆
  {
    style: 'fort', grassA: '#94c76c', grassB: '#89bb62', path: '#cfcabb', pathLine: 'rgba(95,95,100,0.45)', base: '#b4ad9c', outside: '#386f3a',
    trees: ['#2f6b45', '#3a7a4f', '#4c8f5c'], rock: ['#9a978f', '#86837c'], accent: '#ffd36b',
    wall: ['#a19e97', '#bfbcb4', '#84817a'], roof: '#4a7a62', bridge: 'stone', wood: ['#a8743e', '#9a6834'],
    water: ['#5fa8d6', '#8ccbea'], light: { sky: '#f4f6ff', ground: '#6a7f5a', hemi: 2.1, sun: '#fff6e8', sunI: 2.6, bg: '#2c4a30' },
  },
  // 2 楓紅山谷：秋天的黃綠草地、楓樹、乾草捆與南瓜、落葉
  {
    style: 'autumn', grassA: '#b7c75c', grassB: '#abbb52', path: '#e6b878', pathLine: 'rgba(150,90,40,0.45)', base: '#cf9f62', outside: '#6f7a32',
    trees: ['#c4532a', '#e0782e', '#f2a63a'], rock: ['#a08f78', '#8c7c66'], accent: '#ff6b5a',
    wall: ['#b89a78', '#d2b593', '#9a7e5f'], roof: '#8a3b22', bridge: 'wood', wood: ['#a0603a', '#8f5530'],
    water: ['#62b0d8', '#96d2ec'], light: { sky: '#fff0d8', ground: '#8a7a4a', hemi: 2.0, sun: '#ffdcaa', sunI: 2.8, bg: '#4a4a24' },
  },
  // 3 月光湖畔：黃昏的冷色光、柳樹、燈籠、水面睡蓮
  {
    style: 'lake', grassA: '#7fc69a', grassB: '#74ba8f', path: '#dcd6c0', pathLine: 'rgba(90,110,120,0.45)', base: '#bdb9a2', outside: '#2f6455',
    trees: ['#2c6f6a', '#36807a', '#46958c'], rock: ['#8f9a9c', '#7c878a'], accent: '#9ec8ff',
    wall: ['#a7b2b8', '#c5ced3', '#8a959c'], roof: '#3b4a7a', bridge: 'wood', wood: ['#86644a', '#7a5a40'],
    water: ['#3f7fb8', '#6fa8dc'], light: { sky: '#c8d6ff', ground: '#3f5a62', hemi: 1.95, sun: '#e2e8ff', sunI: 2.25, bg: '#1d3346' },
  },
  // 4 雷霆高地：乾草地、尖石、枯樹與發光水晶
  {
    style: 'highland', grassA: '#a4bf6c', grassB: '#98b262', path: '#cdb48a', pathLine: 'rgba(120,95,60,0.45)', base: '#ad976c', outside: '#4d5f36',
    trees: ['#3f5a3a', '#4c6a42', '#5c7c4c'], rock: ['#8a8378', '#77706a'], accent: '#c99bff',
    wall: ['#8f877a', '#a89f90', '#746c60'], roof: '#5b3f7a', bridge: 'wood', wood: ['#8a7458', '#7c684e'],
    water: ['#4fa9bf', '#83cfdc'], light: { sky: '#eef0ff', ground: '#5e5a48', hemi: 2.0, sun: '#f2f0ff', sunI: 2.45, bg: '#33402a' },
  },
  // 5 黃金王座：白石牆＋金色屋頂、白石橋、盆栽與金球石柱
  {
    style: 'royal', grassA: '#92d66c', grassB: '#86cb61', path: '#f1d47e', pathLine: 'rgba(170,120,30,0.5)', base: '#e2c060', outside: '#3a8a3a',
    trees: ['#2f9a46', '#3aab52', '#52c062'], rock: ['#cfc6b0', '#b9b09a'], accent: '#ff5a6a',
    wall: ['#e6dcc4', '#f6eedb', '#cfc2a2'], roof: '#e2b23a', bridge: 'stone', wood: ['#a8743e', '#9a6834'],
    water: ['#5ec0f0', '#a0e4ff'], light: { sky: '#fff8e6', ground: '#7f9a4f', hemi: 2.15, sun: '#fff0cc', sunI: 2.7, bg: '#2e5a2e' },
  },
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

/** 各競技場草地上的小細節（淡淡的，不能蓋過格紋）：落葉、碎石與裂縫、小花、青苔。 */
function paintDetails(g: CanvasRenderingContext2D, style: ArenaStyle, w: number, h: number, r: () => number): void {
  const dot = (x: number, y: number, rx: number, ry: number, rot: number, color: string) => {
    g.fillStyle = color;
    g.beginPath();
    g.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    g.fill();
  };
  if (style === 'autumn') {
    const leaf = ['rgba(224,120,46,0.7)', 'rgba(196,83,42,0.65)', 'rgba(242,166,58,0.7)'];
    for (let i = 0; i < 420; i++) dot(r() * w, r() * h, 4 + r() * 3, 2 + r() * 1.5, r() * Math.PI, leaf[i % 3]);
  } else if (style === 'highland') {
    for (let i = 0; i < 260; i++) dot(r() * w, r() * h, 2 + r() * 3, 1.5 + r() * 2, r() * 3, r() < 0.5 ? 'rgba(120,112,100,0.35)' : 'rgba(170,160,140,0.35)');
    for (let i = 0; i < 60; i++) dot(r() * w, r() * h, 10 + r() * 14, 5 + r() * 6, r() * 3, 'rgba(200,180,110,0.16)');
    g.strokeStyle = 'rgba(90,80,60,0.22)';
    g.lineWidth = 1.5;
    for (let i = 0; i < 40; i++) {
      let x = r() * w;
      let y = r() * h;
      g.beginPath();
      g.moveTo(x, y);
      for (let j = 0; j < 3; j++) {
        x += (r() - 0.5) * 22;
        y += (r() - 0.5) * 22;
        g.lineTo(x, y);
      }
      g.stroke();
    }
  } else if (style === 'lake') {
    for (let i = 0; i < 300; i++) dot(r() * w, r() * h, 1.6 + r(), 1.6 + r(), 0, r() < 0.5 ? 'rgba(255,255,255,0.55)' : 'rgba(150,190,255,0.55)');
  } else if (style === 'royal') {
    for (let i = 0; i < 300; i++) dot(r() * w, r() * h, 1.6 + r(), 1.6 + r(), 0, r() < 0.5 ? 'rgba(255,220,90,0.55)' : 'rgba(255,140,170,0.5)');
  } else if (style === 'fort') {
    for (let i = 0; i < 120; i++) dot(r() * w, r() * h, 8 + r() * 12, 4 + r() * 6, r() * 3, 'rgba(50,100,50,0.13)');
  }
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
  paintDetails(g, pal.style, c.width, c.height, r);
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
uniform vec3 uDeep;
uniform vec3 uLite;
varying vec2 vUv;
void main() {
  vec2 p = vUv * vec2(18.0, 2.0);
  float w = sin(p.x * 1.7 + uTime * 1.4 + sin(p.y * 3.0 + uTime) * 1.2) * 0.5 + 0.5;
  float w2 = sin(p.x * 3.1 - uTime * 2.1 + p.y * 4.0) * 0.5 + 0.5;
  vec3 col = mix(uDeep, uLite, w * 0.6 + w2 * 0.25);
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
  readonly ambience = new Ambience();
  private water: ShaderMaterial;
  private canvas: HTMLCanvasElement;
  private tex: CanvasTexture;
  private decor: Group;
  private decors = new Map<number, Group>();
  private farMat: MeshLambertMaterial;
  private theme = 0;

  constructor(renderer: WebGLRenderer) {
    const W = ARENA.width;
    const pal = ARENA_THEMES[0];
    this.canvas = paintGround(pal);
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
    this.water = new ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uDeep: { value: new Color(pal.water[0]) }, uLite: { value: new Color(pal.water[1]) } },
      vertexShader: WATER_VERT,
      fragmentShader: WATER_FRAG,
    });
    const water = new Mesh(new PlaneGeometry(W + 6, ARENA.riverBottom - ARENA.riverTop), this.water);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -RIVER_DEPTH + 0.06, (ARENA.riverTop + ARENA.riverBottom) / 2 - CZ);
    this.group.add(water);

    this.decor = buildDecor(pal);
    this.decors.set(0, this.decor);
    this.group.add(this.decor);
    this.group.add(this.ambience.points);
    this.ambience.setStyle(pal.style, this.decor.userData.emitters as V3[]);

    // 遠方草地底色，避免寬螢幕露出背景
    this.farMat = new MeshLambertMaterial({ color: new Color(shade(pal.outside, -0.04)), side: DoubleSide });
    const far = new Mesh(new PlaneGeometry(120, 120), this.farMat);
    far.rotation.x = -Math.PI / 2;
    far.position.y = -0.7;
    far.receiveShadow = true;
    this.group.add(far);
  }

  /** 換競技場：重畫地面貼圖、換整組場外裝飾與水色（燈光由 Renderer3D 調整）。 */
  setTheme(i: number): void {
    const idx = themeIndex(i);
    if (idx === this.theme) return;
    this.theme = idx;
    const pal = ARENA_THEMES[idx];
    paintGround(pal, this.canvas);
    this.tex.needsUpdate = true;
    this.decor.visible = false;
    let d = this.decors.get(idx);
    if (!d) {
      d = buildDecor(pal);
      this.decors.set(idx, d);
      this.group.add(d);
    }
    d.visible = true;
    this.decor = d;
    this.ambience.setStyle(pal.style, d.userData.emitters as V3[]);
    this.farMat.color.set(shade(pal.outside, -0.04));
    this.water.uniforms.uDeep.value.set(pal.water[0]);
    this.water.uniforms.uLite.value.set(pal.water[1]);
  }

  update(t: number): void {
    this.water.uniforms.uTime.value = t;
    this.ambience.update(t);
  }

  /** 畫面縮放（每格多少像素），環境粒子的大小跟著換算。 */
  setScale(pxPerUnit: number): void {
    this.ambience.setScale(pxPerUnit);
  }
}

export function themeIndex(i: number): number {
  return Math.max(0, Math.min(ARENA_THEMES.length - 1, Math.floor(i) || 0));
}

/** 橋：木橋（木板＋欄杆）或石橋（石板＋矮護牆）。 */
function addBridge(k: Kit, glow: Kit, pal: ArenaPalette, x: number): void {
  const half = ARENA.bridgeHalfWidth;
  const z0 = ARENA.riverTop - CZ - 0.35;
  const len = ARENA.riverBottom - ARENA.riverTop + 0.7;
  if (pal.bridge === 'stone') {
    const [main, cap, dark] = pal.style === 'royal' ? ['#e9e1cd', '#f7f0de', '#cfc4a8'] : ['#aaa69c', '#c2beb4', '#8c887f'];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        k.box((half * 2) / 3 - 0.04, 0.14, len / 6 - 0.04, { at: [x - half + ((j + 0.5) * half * 2) / 3, 0.04, z0 + (i + 0.5) * (len / 6)], color: (i + j) % 2 ? main : shade(main, -0.05) });
      }
    }
    k.box(half * 2 + 0.3, 0.16, len, { at: [x, -0.06, z0 + len / 2], color: dark });
    for (const sx of [1, -1]) {
      k.box(0.22, 0.32, len, { at: [x + sx * (half + 0.06), 0.24, z0 + len / 2], color: main });
      k.box(0.3, 0.08, len + 0.1, { at: [x + sx * (half + 0.06), 0.43, z0 + len / 2], color: cap });
      for (const zz of [0, len]) {
        k.box(0.36, 0.62, 0.36, { at: [x + sx * (half + 0.06), 0.31, z0 + zz], color: main });
        if (pal.style === 'royal') k.sphere(0.13, { at: [x + sx * (half + 0.06), 0.72, z0 + zz], color: '#f2c14a' }, 8);
        else k.box(0.42, 0.08, 0.42, { at: [x + sx * (half + 0.06), 0.66, z0 + zz], color: cap });
      }
    }
    return;
  }
  for (let i = 0; i < 7; i++) {
    k.box(half * 2 + 0.1, 0.12, len / 7 - 0.04, { at: [x, 0.03, z0 + (i + 0.5) * (len / 7)], color: i % 2 ? pal.wood[0] : pal.wood[1] });
  }
  k.box(half * 2 + 0.2, 0.1, len, { at: [x, -0.05, z0 + len / 2], color: shade(pal.wood[1], -0.3) });
  for (const sx of [1, -1]) {
    if (pal.style === 'highland') {
      // 繩索欄杆：兩條細繩
      for (const y of [0.32, 0.5]) k.box(0.05, 0.05, len, { at: [x + sx * (half + 0.02), y, z0 + len / 2], color: '#c9b48a' });
    } else {
      k.box(0.14, 0.12, len, { at: [x + sx * (half + 0.02), 0.42, z0 + len / 2], color: shade(pal.wood[0], -0.12) });
    }
    for (const zz of [0.1, len / 2, len - 0.1]) {
      k.cyl(0.11, 0.13, 0.6, { at: [x + sx * (half + 0.02), 0.22, z0 + zz], color: shade(pal.wood[1], -0.25) }, 6);
    }
    // 湖畔：橋頭掛燈籠
    if (pal.style === 'lake') {
      for (const zz of [0.1, len - 0.1]) {
        k.box(0.16, 0.05, 0.16, { at: [x + sx * (half + 0.02), 0.55, z0 + zz], color: '#2e2620' });
        glow.box(0.13, 0.16, 0.13, { at: [x + sx * (half + 0.02), 0.65, z0 + zz], color: '#ffd27a' });
        k.box(0.16, 0.04, 0.16, { at: [x + sx * (half + 0.02), 0.75, z0 + zz], color: '#2e2620' });
      }
    }
  }
}

/** 場地裝飾（河岸、橋、圍牆、場外道具）；每座競技場一組，切換場地時換整組。 */
function buildDecor(pal: ArenaPalette): Group {
  const W = ARENA.width;
  const k = new Kit();
  k.addBone('root', -1, [0, 0, 0]);
  const glow = new Kit();
  glow.gradient = false;
  glow.trackParts = true;
  glow.addBone('root', -1, [0, 0, 0]);
  const [wallMain, wallCap, wallDark] = pal.wall;
  const bankZ = [ARENA.riverTop - CZ, ARENA.riverBottom - CZ];
  for (const z of bankZ) {
    const side = z < 0 ? 1 : -1; // 牆面朝向河中央
    k.box(W + 6, RIVER_DEPTH + 0.02, 0.2, { at: [0, -RIVER_DEPTH / 2, z + side * 0.1], color: shade(wallDark, -0.08) });
    for (let i = 0; i < 24; i++) {
      k.box(0.75, 0.1, 0.22, { at: [-W / 2 - 2.5 + i * 0.95 + (z > 0 ? 0.4 : 0), 0.02, z + side * 0.08], color: i % 2 ? shade(wallMain, -0.06) : shade(wallMain, -0.12) });
    }
  }
  for (const bx of ARENA.bridgeXs) addBridge(k, glow, pal, bx - CX);
  // 湖畔：河面上的睡蓮（避開橋）
  if (pal.style === 'lake') {
    const y = -RIVER_DEPTH + 0.075;
    const pads: [number, number, number, boolean][] = [[-8.1, -0.45, 1, true], [-7.2, 0.4, 0.8, false], [-2.6, 0.3, 1.1, true], [-1.4, -0.5, 0.75, false], [1.8, 0.45, 0.9, false], [2.7, -0.35, 1, true], [8.2, 0.2, 1, true]];
    for (const [px, pz, ps, fl] of pads) lily(k, px, y, pz, ps, fl);
  }
  // 場地左右的矮石牆與場外道具
  const r = rand(11);
  for (const sx of [1, -1]) {
    const wx = sx * (W / 2 + 0.35);
    k.box(0.5, 0.55, ARENA.height + 1, { at: [wx, 0.27, 0], color: wallMain });
    k.box(0.6, 0.12, ARENA.height + 1, { at: [wx, 0.58, 0], color: wallCap });
    for (let i = 0; i < 17; i++) k.box(0.62, 0.16, 0.08, { at: [wx, 0.36, -16 + i * 2], color: wallDark });
    if (pal.style === 'royal') k.box(0.1, 0.05, ARENA.height + 1, { at: [wx - sx * 0.24, 0.66, 0], color: '#e6b53c' });
    // 場外地面
    k.box(14, 0.1, ARENA.height + 14, { at: [sx * (W / 2 + 7.6), -0.06, 0], color: pal.outside });
    for (let i = 0; i < 26; i++) {
      const x = sx * (W / 2 + 1.4 + r() * 8);
      const z = -21 + r() * 42;
      if (Math.abs(z - (ARENA.riverTop + 1 - CZ)) < 1.6) continue;
      scatterProp(pal.style, k, glow, x, z, pal, r);
    }
    // 河道延伸到場外的兩岸：湖畔的蘆葦
    if (pal.style === 'lake') for (const z of [-1.6, 1.7]) reeds(k, sx * (W / 2 + 1.3), z, 1.1, r);
  }
  // 上方（對手後方）：城垛高牆、兩端角樓、隊伍色三角旗，牆後一排樹與遠丘；高牆在場地後面，不會擋到場上單位
  {
    const wz = -(ARENA.height / 2 + 0.6);
    k.box(W + 14, 0.1, 9, { at: [0, -0.06, wz - 4.2], color: shade(pal.outside, 0.06) });
    k.box(W + 2.4, 1.15, 0.8, { at: [0, 0.57, wz], color: wallMain });
    k.box(W + 2.6, 0.14, 0.92, { at: [0, 1.2, wz], color: wallCap });
    if (pal.style === 'royal') k.box(W + 2.62, 0.06, 0.94, { at: [0, 1.06, wz], color: '#e6b53c' });
    for (let i = 0; i < 21; i++) k.box(0.5, 0.34, 0.8, { at: [-W / 2 - 0.9 + i * 0.99, 1.43, wz], color: i % 2 ? shade(wallCap, -0.05) : wallCap });
    for (let i = 0; i < 10; i++) k.box(1.6, 0.05, 0.82, { at: [-W / 2 + 0.2 + i * 2, 0.42 + (i % 2) * 0.36, wz], color: wallDark });
    for (const fx of [-6.5, -2.2, 2.2, 6.5]) {
      k.cyl(0.05, 0.05, 1.5, { at: [fx, 1.9, wz], color: '#6b4426' }, 5);
      k.cone(0.2, 0.75, { at: [fx + 0.36, 2.42, wz], rot: [0, 0, -Math.PI / 2], scale: [1, 1, 0.15], color: '#de3b33' }, 3);
      k.sphere(0.06, { at: [fx, 2.66, wz], color: '#f2b233' }, 5);
    }
    for (const sx of [-1, 1]) {
      const tx = sx * (W / 2 + 1.0);
      k.cyl(0.95, 1.05, 2.3, { at: [tx, 1.15, wz - 0.2], color: wallMain }, 12);
      for (const y of [0.7, 1.4]) k.cyl(1.02, 1.02, 0.06, { at: [tx, y, wz - 0.2], color: wallDark }, 12);
      k.cyl(1.1, 1.0, 0.18, { at: [tx, 2.38, wz - 0.2], color: wallDark }, 12);
      k.cone(1.2, 1.5, { at: [tx, 3.22, wz - 0.2], color: pal.roof }, 12);
      k.sphere(0.12, { at: [tx, 4.0, wz - 0.2], color: '#f2b233' }, 6);
      k.box(0.3, 0.45, 0.06, { at: [tx, 1.55, wz + 0.82], color: '#3a2e26' });
      // 角樓前的風格裝飾
      if (pal.style === 'fort') brazier(k, glow, tx - sx * 1.6, wz + 0.9, 0.9);
      else if (pal.style === 'lake') lantern(k, glow, tx - sx * 1.5, wz + 0.85, 1);
      else if (pal.style === 'highland') crystal(k, glow, tx - sx * 1.6, wz + 0.9, 0.9, sx < 0 ? '#8fe8ff' : '#c99bff', r);
      else if (pal.style === 'royal') banner(k, tx - sx * 1.6, wz + 0.75, 1, '#c8323c', '#e6b53c');
      else if (pal.style === 'autumn') pumpkin(k, tx - sx * 1.5, wz + 0.9, 1.3);
    }
    // 牆後的樹與遠丘
    for (let i = 0; i < 16; i++) {
      const x = -W / 2 - 3 + i * 1.6 + (r() - 0.5) * 0.9;
      const z = wz - 1.4 - r() * 2.6;
      const s = 0.95 + r() * 0.55;
      backTree(pal.style, k, glow, x, z, s, pal, r);
    }
    for (let i = 0; i < 6; i++) {
      k.sphere(3.2, { at: [-W / 2 - 2 + i * 4.4, -1.2, wz - 6.5 - (i % 2) * 1.2], scale: [1.4, 0.75, 1], color: i % 2 ? shade(pal.outside, 0.02) : shade(pal.outside, 0.1) }, 12);
    }
  }
  // 下方（己方後方）：矮石牆、花台與灌木（保持低矮，避免擋住己方最後一排）
  {
    const wz = ARENA.height / 2 + 0.35;
    k.box(W + 1.2, 0.6, 0.5, { at: [0, 0.3, wz], color: wallMain });
    k.box(W + 1.2, 0.12, 0.6, { at: [0, 0.62, wz], color: wallCap });
    if (pal.style === 'royal') k.box(W + 1.22, 0.05, 0.62, { at: [0, 0.7, wz], color: '#e6b53c' });
    k.box(W + 14, 0.1, 6, { at: [0, -0.06, wz + 3.05], color: pal.outside });
    const flowers = BED_FLOWERS[pal.style];
    const planter = pal.style === 'fort' || pal.style === 'highland' ? [shade(wallMain, -0.1), shade(wallDark, -0.2)] : pal.style === 'royal' ? ['#e6dcc4', '#5a3a1e'] : ['#8a5a2e', '#5a3a1e'];
    for (let i = 0; i < 6; i++) {
      const x = -W / 2 + 1.2 + i * 3.1;
      k.box(2.2, 0.32, 0.6, { at: [x, 0.16, wz + 0.75], color: planter[0] });
      k.box(2.1, 0.1, 0.5, { at: [x, 0.34, wz + 0.75], color: planter[1] });
      if (pal.style === 'royal') k.box(2.22, 0.04, 0.62, { at: [x, 0.3, wz + 0.75], color: '#e6b53c' });
      if (pal.style === 'highland' && i % 2 === 0) {
        crystal(k, glow, x, wz + 0.75, 0.45, i % 4 ? '#8fe8ff' : '#c99bff', r);
        continue;
      }
      for (let j = 0; j < 6; j++) {
        k.sphere(0.13, { at: [x - 0.85 + j * 0.34, 0.45, wz + 0.72 + (j % 2) * 0.1], color: flowers[(i + j) % flowers.length] }, 6);
      }
    }
    if (pal.style === 'royal') for (const x of [-W / 2 - 0.3, W / 2 + 0.3]) topiary(k, x, wz + 0.9, 0.8);
    for (const fx of [-7, 7]) {
      k.cyl(0.06, 0.06, 2.2, { at: [fx, 1.1, wz], color: '#6b4426' }, 5);
      k.box(0.04, 0.7, 0.9, { at: [fx, 1.75, wz - 0.45], color: '#2f74e8' });
    }
  }
  const group = new Group();
  // 發光零件（火盆火焰、水晶、燈籠）的位置當環境粒子的發射點；只取畫面看得到的（場地兩側與後方牆前）
  group.userData.emitters = glow.partAt.filter((p) => Math.abs(p[0]) < W / 2 + 2 && Math.abs(p[2]) < ARENA.height / 2 + 2).map((p) => [p[0], p[1] + 0.2, p[2]] as V3);
  const lit = new Mesh(k.build(1).geometry, new MeshLambertMaterial({ vertexColors: true }));
  lit.castShadow = true;
  lit.receiveShadow = true;
  group.add(lit);
  if (glow.parts > 0) group.add(new Mesh(glow.build(1).geometry, new MeshBasicMaterial({ vertexColors: true })));
  return group;
}

/** 己方後方花台的花色。 */
const BED_FLOWERS: Record<ArenaStyle, string[]> = {
  meadow: ['#ff8fb0', '#ffd36b', '#ffffff', '#ff6b5a'],
  fort: ['#5aa046', '#4c8f3e', '#ffd36b', '#5aa046'],
  autumn: ['#f2a63a', '#e0782e', '#ffd36b', '#c4532a'],
  lake: ['#9ec8ff', '#ffffff', '#c9b5ff', '#7fb0f0'],
  highland: ['#c99bff', '#ffffff', '#8fe8ff', '#a0d070'],
  royal: ['#ff5a6a', '#ffffff', '#ffd36b', '#ff8fb0'],
};
