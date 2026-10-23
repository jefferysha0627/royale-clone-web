import type { Kit } from './kit';

// 場景道具（原創造型）：競技場外圍與主畫面小場景共用。每座競技場有自己的一組道具與配色，
// 只換顏色看不出是不同地方，所以樹種、石頭、燈火等都依風格換造型。
// glow 是不受光照的網格（燈籠、火盆、水晶的亮部），在昏暗的場地也看得到。

export type Rand = () => number;

export type ArenaStyle = 'meadow' | 'fort' | 'autumn' | 'lake' | 'highland' | 'royal';

export interface PropColors {
  trees: [string, string, string]; // 樹冠深、中、亮
  rock: [string, string];
  accent: string; // 旗幟、花朵等點綴色
}

const TRUNK = '#6b4426';

export function roundTree(k: Kit, x: number, z: number, s: number, c: PropColors, r: Rand): void {
  k.cyl(0.14 * s, 0.2 * s, 0.9 * s, { at: [x, 0.45 * s, z], color: TRUNK }, 6);
  k.sphere(0.85 * s, { at: [x, 1.35 * s, z], scale: [1, 0.9, 1], color: r() < 0.5 ? c.trees[0] : c.trees[1] }, 9);
  k.sphere(0.6 * s, { at: [x + 0.25 * s, 1.85 * s, z + 0.1 * s], color: c.trees[2] }, 8);
}

/** 松樹：三層圓錐。 */
export function pine(k: Kit, x: number, z: number, s: number, c: PropColors): void {
  k.cyl(0.1 * s, 0.15 * s, 0.7 * s, { at: [x, 0.35 * s, z], color: '#5a3a22' }, 6);
  k.cone(0.95 * s, 1.1 * s, { at: [x, 1.1 * s, z], color: c.trees[0] }, 8);
  k.cone(0.74 * s, 0.95 * s, { at: [x, 1.65 * s, z], color: c.trees[1] }, 8);
  k.cone(0.48 * s, 0.8 * s, { at: [x, 2.15 * s, z], color: c.trees[2] }, 8);
}

/** 楓樹：一團一團不同暖色的樹冠。 */
export function maple(k: Kit, x: number, z: number, s: number, c: PropColors, r: Rand): void {
  k.cyl(0.13 * s, 0.2 * s, 1.0 * s, { at: [x, 0.5 * s, z], color: '#5e3b24' }, 6);
  const blobs: [number, number, number, number][] = [
    [0, 1.45, 0, 0.72], [0.48, 1.3, 0.12, 0.5], [-0.45, 1.32, -0.1, 0.52], [0.1, 1.95, 0.05, 0.5], [-0.12, 1.62, 0.42, 0.44],
  ];
  for (const [bx, by, bz, br] of blobs) k.sphere(br * s, { at: [x + bx * s, by * s, z + bz * s], color: c.trees[Math.floor(r() * 3)] }, 8);
}

/** 柳樹：扁圓樹冠＋垂下的枝條。 */
export function willow(k: Kit, x: number, z: number, s: number, c: PropColors, r: Rand): void {
  k.cyl(0.15 * s, 0.24 * s, 1.3 * s, { at: [x, 0.65 * s, z], color: '#5a4632' }, 6);
  k.sphere(0.9 * s, { at: [x, 1.78 * s, z], scale: [1.15, 0.65, 1.15], color: c.trees[1] }, 10);
  k.sphere(0.5 * s, { at: [x + 0.2 * s, 2.15 * s, z], scale: [1.2, 0.6, 1.2], color: c.trees[2] }, 8);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + r() * 0.25;
    const rr = 0.92 * s;
    const len = (0.8 + r() * 0.35) * s;
    k.box(0.13 * s, len, 0.05 * s, { at: [x + Math.cos(a) * rr, 1.65 * s - len / 2, z + Math.sin(a) * rr], rot: [0, -a + Math.PI / 2, 0], color: i % 2 ? c.trees[0] : c.trees[1] });
  }
}

/** 枯樹：光禿的枝幹（高地用）。 */
export function deadTree(k: Kit, x: number, z: number, s: number): void {
  const col = '#5b4a3a';
  k.cyl(0.1 * s, 0.19 * s, 1.5 * s, { at: [x, 0.75 * s, z], color: col }, 5);
  k.cyl(0.04 * s, 0.08 * s, 0.85 * s, { at: [x + 0.28 * s, 1.45 * s, z], rot: [0, 0, -0.85], color: col }, 4);
  k.cyl(0.035 * s, 0.07 * s, 0.7 * s, { at: [x - 0.24 * s, 1.3 * s, z + 0.05 * s], rot: [0.2, 0, 0.95], color: col }, 4);
  k.cyl(0.03 * s, 0.05 * s, 0.5 * s, { at: [x + 0.05 * s, 1.75 * s, z - 0.15 * s], rot: [-0.6, 0, 0.1], color: col }, 4);
}

export function boulder(k: Kit, x: number, z: number, s: number, c: PropColors, r: Rand): void {
  k.rock(s, { at: [x, s * 0.4, z], scale: [1.2, 0.8, 1], color: r() < 0.5 ? c.rock[0] : c.rock[1] });
}

/** 尖石群（高地）：幾根斜插的岩柱。 */
export function crag(k: Kit, x: number, z: number, s: number, c: PropColors, r: Rand): void {
  for (let i = 0; i < 3; i++) {
    const a = r() * Math.PI * 2;
    const h = (0.9 + r() * 0.8) * s;
    k.cone(0.32 * s, h, { at: [x + Math.cos(a) * 0.3 * s, h / 2 - 0.05, z + Math.sin(a) * 0.3 * s], rot: [Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25], color: i % 2 ? c.rock[0] : c.rock[1] }, 5);
  }
}

export function flowerBush(k: Kit, x: number, z: number, s: number, c: PropColors, r: Rand): void {
  k.sphere(s, { at: [x, s * 0.5, z], scale: [1.3, 0.8, 1.1], color: '#5aa046' }, 8);
  k.sphere(s * 0.18, { at: [x + s * 0.4, s * 0.85, z + s * 0.3], color: r() < 0.5 ? '#ffd36b' : c.accent }, 5);
  k.sphere(s * 0.15, { at: [x - s * 0.35, s * 0.8, z + s * 0.25], color: '#ffffff' }, 5);
}

/** 乾草捆：橫放的圓柱＋兩道綁繩。 */
export function hayBale(k: Kit, x: number, z: number, s: number, rotY: number): void {
  k.cyl(0.42 * s, 0.42 * s, 0.75 * s, { at: [x, 0.42 * s, z], rot: [0, rotY, Math.PI / 2], color: '#e2c25a' }, 12);
  for (const o of [-0.2, 0.2]) {
    k.cyl(0.435 * s, 0.435 * s, 0.05 * s, { at: [x + Math.cos(rotY) * o * s, 0.42 * s, z - Math.sin(rotY) * o * s], rot: [0, rotY, Math.PI / 2], color: '#a8862e' }, 12);
  }
}

export function pumpkin(k: Kit, x: number, z: number, s: number): void {
  k.sphere(0.32 * s, { at: [x, 0.26 * s, z], scale: [1.25, 0.85, 1.25], color: '#f08a24' }, 10);
  k.sphere(0.22 * s, { at: [x, 0.3 * s, z], scale: [1.6, 0.95, 0.6], color: '#e07818' }, 8);
  k.cyl(0.04 * s, 0.05 * s, 0.18 * s, { at: [x, 0.56 * s, z], rot: [0.2, 0, 0.15], color: '#4f6a2a' }, 5);
  k.sphere(0.1 * s, { at: [x + 0.12 * s, 0.52 * s, z], scale: [1.4, 0.35, 1], color: '#5f8a32' }, 6);
}

/** 燈籠柱：木柱、橫桿與發光的燈箱。 */
export function lantern(k: Kit, glow: Kit, x: number, z: number, s: number): void {
  k.cyl(0.05 * s, 0.065 * s, 1.55 * s, { at: [x, 0.78 * s, z], color: '#3e3328' }, 5);
  k.box(0.46 * s, 0.05 * s, 0.06 * s, { at: [x + 0.18 * s, 1.5 * s, z], color: '#3e3328' });
  k.box(0.24 * s, 0.06 * s, 0.24 * s, { at: [x + 0.36 * s, 1.4 * s, z], color: '#2e2620' });
  k.cone(0.17 * s, 0.14 * s, { at: [x + 0.36 * s, 1.49 * s, z], color: '#2e2620' }, 4);
  glow.box(0.17 * s, 0.24 * s, 0.17 * s, { at: [x + 0.36 * s, 1.24 * s, z], color: '#ffd27a' });
  k.box(0.22 * s, 0.04 * s, 0.22 * s, { at: [x + 0.36 * s, 1.1 * s, z], color: '#2e2620' });
}

/** 水晶簇：幾根發光的多角柱，底下一塊岩石。 */
export function crystal(k: Kit, glow: Kit, x: number, z: number, s: number, color: string, r: Rand): void {
  k.rock(0.38 * s, { at: [x, 0.06 * s, z], scale: [1.4, 0.5, 1.2], color: '#6f6a60' });
  const n = 3 + Math.floor(r() * 2);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const d = i === 0 ? 0 : 0.26 * s;
    const h = (i === 0 ? 1.15 : 0.55 + r() * 0.4) * s;
    const tilt = i === 0 ? 0 : 0.38;
    glow.cone((i === 0 ? 0.2 : 0.14) * s, h, { at: [x + Math.cos(a) * d, h / 2 + 0.05, z + Math.sin(a) * d], rot: [Math.sin(a) * tilt, 0, -Math.cos(a) * tilt], color }, 5);
  }
}

/** 火盆：石柱上的鐵盆與火焰。 */
export function brazier(k: Kit, glow: Kit, x: number, z: number, s: number): void {
  k.cyl(0.17 * s, 0.22 * s, 0.9 * s, { at: [x, 0.45 * s, z], color: '#8a8478' }, 8);
  k.cyl(0.32 * s, 0.2 * s, 0.22 * s, { at: [x, 1.0 * s, z], color: '#4a3e34' }, 10);
  glow.cone(0.24 * s, 0.5 * s, { at: [x, 1.33 * s, z], color: '#ff9a3a' }, 7);
  glow.cone(0.13 * s, 0.34 * s, { at: [x, 1.28 * s, z + 0.12 * s], color: '#ffe68a' }, 6);
}

/** 盆栽造景樹（黃金王座）：陶盆＋兩顆修剪成球的樹冠。 */
export function topiary(k: Kit, x: number, z: number, s: number): void {
  k.cyl(0.27 * s, 0.2 * s, 0.38 * s, { at: [x, 0.19 * s, z], color: '#c9773a' }, 10);
  k.cyl(0.3 * s, 0.3 * s, 0.07 * s, { at: [x, 0.39 * s, z], color: '#e8b070' }, 10);
  k.cyl(0.04 * s, 0.045 * s, 0.45 * s, { at: [x, 0.62 * s, z], color: '#5a3a22' }, 5);
  k.sphere(0.38 * s, { at: [x, 1.02 * s, z], color: '#3f9a4a' }, 10);
  k.sphere(0.25 * s, { at: [x, 1.5 * s, z], color: '#4aab55' }, 9);
}

/** 白石柱頂一顆金球（黃金王座）。 */
export function goldPillar(k: Kit, x: number, z: number, s: number): void {
  k.box(0.62 * s, 0.22 * s, 0.62 * s, { at: [x, 0.11 * s, z], color: '#e2d6ba' });
  k.cyl(0.18 * s, 0.21 * s, 1.4 * s, { at: [x, 0.92 * s, z], color: '#f2ead6' }, 10);
  for (let i = 0; i < 2; i++) k.torus(0.2 * s, 0.035 * s, { at: [x, (0.4 + i * 1.02) * s, z], rot: [Math.PI / 2, 0, 0], color: '#e6b53c' }, 14);
  k.box(0.5 * s, 0.14 * s, 0.5 * s, { at: [x, 1.68 * s, z], color: '#e2d6ba' });
  k.sphere(0.25 * s, { at: [x, 1.98 * s, z], color: '#f2c14a' }, 12);
}

/** 掛旗：木桿、橫桿與燕尾旗面。 */
export function banner(k: Kit, x: number, z: number, s: number, color: string, trim: string): void {
  k.cyl(0.05 * s, 0.05 * s, 2.3 * s, { at: [x, 1.15 * s, z], color: '#6b4426' }, 5);
  k.sphere(0.07 * s, { at: [x, 2.33 * s, z], color: trim }, 6);
  k.box(0.66 * s, 0.05 * s, 0.05 * s, { at: [x, 2.12 * s, z + 0.03 * s], color: trim });
  k.box(0.56 * s, 0.75 * s, 0.03 * s, { at: [x, 1.7 * s, z + 0.05 * s], color });
  for (const sx of [-1, 1]) k.cone(0.14 * s, 0.32 * s, { at: [x + sx * 0.14 * s, 1.18 * s, z + 0.05 * s], rot: [0, 0, Math.PI], scale: [1, 1, 0.12], color }, 3);
  k.box(0.56 * s, 0.05 * s, 0.035 * s, { at: [x, 1.36 * s, z + 0.06 * s], color: trim });
}

/** 蘆葦叢（水邊）。 */
export function reeds(k: Kit, x: number, z: number, s: number, r: Rand): void {
  for (let i = 0; i < 6; i++) {
    const ox = (r() - 0.5) * 0.5 * s;
    const oz = (r() - 0.5) * 0.4 * s;
    const h = (0.6 + r() * 0.5) * s;
    k.cyl(0.018 * s, 0.03 * s, h, { at: [x + ox, h / 2, z + oz], rot: [(r() - 0.5) * 0.3, 0, (r() - 0.5) * 0.3], color: i % 2 ? '#6f8f3a' : '#5f7f32' }, 4);
    if (i % 2 === 0) k.capsule(0.04 * s, 0.14 * s, { at: [x + ox, h + 0.02, z + oz], color: '#7a4f2a' }, 5);
  }
}

/** 睡蓮葉與花（浮在水面上）。 */
export function lily(k: Kit, x: number, y: number, z: number, s: number, flower: boolean): void {
  k.cyl(0.3 * s, 0.3 * s, 0.03, { at: [x, y, z], color: '#4f9a4a' }, 12);
  k.box(0.12 * s, 0.035, 0.3 * s, { at: [x + 0.12 * s, y + 0.004, z + 0.06 * s], rot: [0, 0.5, 0], color: '#3f7f8f' });
  if (flower) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      k.sphere(0.07 * s, { at: [x + Math.cos(a) * 0.06 * s, y + 0.07, z + Math.sin(a) * 0.06 * s], scale: [1, 0.6, 1.6], rot: [0, -a, 0], color: '#ff9ec4' }, 6);
    }
    k.sphere(0.04 * s, { at: [x, y + 0.1, z], color: '#ffe27a' }, 5);
  }
}

/**
 * 依競技場風格放一個場外道具（樹、石頭、燈火…）。big=false 時只放矮的東西（場地下方，避免擋到己方部隊）。
 */
export function scatterProp(style: ArenaStyle, k: Kit, glow: Kit, x: number, z: number, c: PropColors, r: Rand, big = true): void {
  const roll = r();
  const s = 0.8 + r() * 0.7;
  switch (style) {
    case 'fort':
      if (big && roll < 0.5) pine(k, x, z, s * 1.05, c);
      else if (roll < 0.82) boulder(k, x, z, 0.4 + r() * 0.55, c, r);
      else if (big) brazier(k, glow, x, z, 0.9);
      else flowerBush(k, x, z, 0.3 + r() * 0.2, c, r);
      return;
    case 'autumn':
      if (big && roll < 0.55) maple(k, x, z, s, c, r);
      else if (roll < 0.75) hayBale(k, x, z, 0.9 + r() * 0.4, r() * Math.PI);
      else if (roll < 0.9) pumpkin(k, x, z, 0.9 + r() * 0.6);
      else boulder(k, x, z, 0.35 + r() * 0.3, c, r);
      return;
    case 'lake':
      if (big && roll < 0.45) willow(k, x, z, s, c, r);
      else if (roll < 0.65) reeds(k, x, z, 1 + r() * 0.4, r);
      else if (roll < 0.82) lantern(k, glow, x, z, 1);
      else boulder(k, x, z, 0.35 + r() * 0.4, c, r);
      return;
    case 'highland':
      if (big && roll < 0.3) pine(k, x, z, s * 1.1, c);
      else if (big && roll < 0.45) deadTree(k, x, z, s);
      else if (roll < 0.7) crag(k, x, z, 0.7 + r() * 0.6, c, r);
      else if (roll < 0.85) crystal(k, glow, x, z, 0.8 + r() * 0.5, r() < 0.5 ? '#8fe8ff' : '#c99bff', r);
      else boulder(k, x, z, 0.4 + r() * 0.5, c, r);
      return;
    case 'royal':
      if (big && roll < 0.4) roundTree(k, x, z, s, c, r);
      else if (roll < 0.65) topiary(k, x, z, 0.9 + r() * 0.4);
      else if (big && roll < 0.8) goldPillar(k, x, z, 1);
      else flowerBush(k, x, z, 0.32 + r() * 0.25, c, r);
      return;
    default:
      if (big && roll < 0.55) roundTree(k, x, z, s, c, r);
      else if (roll < 0.8) boulder(k, x, z, 0.4 + r() * 0.5, c, r);
      else flowerBush(k, x, z, 0.35 + r() * 0.3, c, r);
  }
}

/** 牆後一排的大樹（依風格換樹種）。 */
export function backTree(style: ArenaStyle, k: Kit, glow: Kit, x: number, z: number, s: number, c: PropColors, r: Rand): void {
  switch (style) {
    case 'fort':
      pine(k, x, z, s * 1.15, c);
      return;
    case 'autumn':
      maple(k, x, z, s * 1.05, c, r);
      return;
    case 'lake':
      if (r() < 0.6) willow(k, x, z, s, c, r);
      else roundTree(k, x, z, s, c, r);
      return;
    case 'highland':
      if (r() < 0.65) pine(k, x, z, s * 1.2, c);
      else crystal(k, glow, x, z, s * 1.2, r() < 0.5 ? '#8fe8ff' : '#c99bff', r);
      return;
    default:
      roundTree(k, x, z, s, c, r);
  }
}
