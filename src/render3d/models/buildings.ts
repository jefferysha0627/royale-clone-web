import { Kit, type ModelAsset } from '../kit';
import { addHumanoid, type HumanoidSpec } from './humanoid';

type TeamPal = { main: string; dark: string; light: string };

const STONE = '#b9b4aa';
const STONE_D = '#8f8a80';
const STONE_L = '#d6d1c6';
const WOOD = '#8a5a2e';
const WOOD_D = '#5a3a1e';

// ───────── 卡牌建築（2×2） ─────────

export function buildCannon(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const turret = k.addBone('turret', root, [0, 0.42, 0]);
  const barrel = k.addBone('barrel', turret, [0, 0.62, 0]);
  k.bone = root;
  k.cyl(0.8, 0.88, 0.3, { at: [0, 0.15, 0], color: WOOD_D }, 10);
  k.cyl(0.74, 0.8, 0.12, { at: [0, 0.34, 0], color: WOOD }, 10);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    k.box(0.12, 0.08, 0.12, { at: [Math.cos(a) * 0.72, 0.42, Math.sin(a) * 0.72], color: team.main });
  }
  k.bone = turret;
  k.box(0.5, 0.32, 0.55, { at: [0, 0.55, -0.05], color: WOOD });
  for (const sx of [1, -1]) k.cyl(0.18, 0.18, 0.08, { at: [sx * 0.3, 0.5, 0.05], rot: [0, 0, Math.PI / 2], color: '#3a2a1e' }, 10);
  k.bone = barrel;
  k.cyl(0.15, 0.2, 0.85, { at: [0, 0.68, 0.3], rot: [Math.PI / 2 - 0.15, 0, 0], color: '#363a42', shine: 0.7 }, 12);
  k.torus(0.16, 0.04, { at: [0, 0.74, 0.68], rot: [-0.15, 0, 0], color: '#555b66', shine: 0.8 }, 12);
  k.sphere(0.2, { at: [0, 0.62, -0.08], color: '#2c3036', shine: 0.7 }, 10);
  return k.build(1.0);
}

export function buildInferno(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const crystal = k.addBone('crystal', root, [0, 1.55, 0]);
  k.bone = root;
  k.cyl(0.62, 0.8, 0.35, { at: [0, 0.18, 0], color: STONE_D }, 8);
  k.cyl(0.42, 0.58, 1.0, { at: [0, 0.82, 0], color: '#5c5250' }, 8);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    k.box(0.16, 0.9, 0.16, { at: [Math.cos(a) * 0.5, 0.8, Math.sin(a) * 0.5], rot: [0, -a, 0], color: '#3e3634' });
  }
  k.cyl(0.55, 0.45, 0.16, { at: [0, 1.35, 0], color: '#3e3634' }, 8);
  k.torus(0.5, 0.06, { at: [0, 1.4, 0], rot: [Math.PI / 2, 0, 0], color: team.main }, 14);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    k.cone(0.07, 0.3, { at: [Math.cos(a) * 0.42, 1.55, Math.sin(a) * 0.42], rot: [Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4], color: '#2c2624' }, 5);
  }
  k.bone = crystal;
  k.gem(0.3, { at: [0, 1.75, 0], scale: [0.8, 1.4, 0.8], color: '#ff6a1f', shine: 1 });
  k.gem(0.16, { at: [0, 1.78, 0], scale: [0.8, 1.4, 0.8], color: '#ffd36b', shine: 1 });
  return k.build(2.0);
}

export function buildTombstone(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const stone = k.addBone('stone', root, [0, 0.1, 0]);
  k.bone = root;
  k.blob(1.6, 0.25, 1.4, { at: [0, 0.06, 0.1], color: '#6e5a40' }, 10);
  for (let i = 0; i < 5; i++) k.rock(0.12, { at: [Math.cos(i * 1.3) * 0.6, 0.1, 0.35 + Math.sin(i * 1.3) * 0.35], color: '#7d7468' });
  k.bone = stone;
  k.box(0.95, 1.05, 0.28, { at: [0, 0.62, -0.25], color: '#8d8a95' });
  k.cyl(0.475, 0.475, 0.28, { at: [0, 1.14, -0.25], rot: [Math.PI / 2, 0, 0], color: '#8d8a95' }, 14);
  k.box(0.75, 0.08, 0.06, { at: [0, 0.95, -0.1], color: '#6a6774' });
  // 骷髏浮雕
  k.sphere(0.17, { at: [0, 0.72, -0.08], scale: [1, 1, 0.5], color: '#e8e2d2' }, 10);
  for (const sx of [1, -1]) k.sphere(0.045, { at: [sx * 0.06, 0.74, 0.0], color: '#2a1d2e' }, 6);
  k.box(0.98, 0.12, 0.3, { at: [0, 0.18, -0.25], color: team.main });
  k.cyl(0.05, 0.05, 0.22, { at: [0.35, 0.35, 0.18], color: '#efe3c2' }, 6);
  k.sphere(0.045, { at: [0.35, 0.5, 0.18], color: '#ffd36b' }, 6);
  return k.build(1.4);
}

/** 聖水收集器（原創造型「能量井」）：石砌井座裡是粉紫色能量液，木架上吊著一顆會旋轉發光的能量水晶。 */
export function buildCollector(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const crystal = k.addBone('crystal', root, [0, 1.45, 0]);
  k.bone = root;
  k.cyl(0.92, 0.98, 0.18, { at: [0, 0.09, 0], color: STONE_D }, 14);
  k.cyl(0.78, 0.86, 0.5, { at: [0, 0.38, 0], color: STONE }, 14);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    k.box(0.3, 0.14, 0.18, { at: [Math.cos(a) * 0.8, 0.66, Math.sin(a) * 0.8], rot: [0, -a, 0], color: STONE_L });
  }
  // 井裡的能量液（略高於井口，避免和石面重疊閃爍）
  k.cyl(0.7, 0.7, 0.05, { at: [0, 0.66, 0], color: '#d35ad8' }, 18);
  k.cyl(0.38, 0.38, 0.05, { at: [0, 0.675, 0], color: '#f2a8f2' }, 14);
  // 木架與橫樑
  for (const sx of [1, -1]) {
    k.box(0.12, 1.5, 0.12, { at: [sx * 0.72, 0.95, 0], color: WOOD });
    k.box(0.16, 0.14, 0.2, { at: [sx * 0.72, 1.72, 0], color: WOOD_D });
  }
  k.box(1.6, 0.12, 0.12, { at: [0, 1.82, 0], color: WOOD });
  k.cyl(0.02, 0.02, 0.18, { at: [0, 1.7, 0], color: '#4a4a52' }, 4);
  // 隊伍色小旗
  k.box(0.04, 0.3, 0.3, { at: [0.8, 1.98, 0.12], color: team.main });
  k.cyl(0.025, 0.025, 0.4, { at: [0.78, 1.95, 0], color: WOOD_D }, 5);
  // 旁邊的瓶罐
  k.cyl(0.1, 0.12, 0.26, { at: [0.95, 0.13, 0.55], color: '#8a5a2e' }, 8);
  k.sphere(0.12, { at: [-0.95, 0.12, 0.5], color: '#c85ad0' }, 8);
  k.cyl(0.04, 0.04, 0.08, { at: [-0.95, 0.27, 0.5], color: '#8a5a2e' }, 6);
  // 會旋轉的能量水晶
  k.bone = crystal;
  k.gem(0.3, { at: [0, 1.32, 0], scale: [0.85, 1.45, 0.85], color: '#e25ae8', shine: 1 });
  k.gem(0.17, { at: [0, 1.34, 0], scale: [0.85, 1.45, 0.85], color: '#ffd0ff', shine: 1 });
  k.torus(0.26, 0.03, { at: [0, 1.32, 0], rot: [Math.PI / 2, 0, 0], color: '#f2b233', shine: 0.9 }, 14);
  return k.build(2.0);
}

// ───────── 防禦塔 ─────────

const GOLD = '#f2b233';
const GOLD_D = '#c98a1a';

/** 上窄下寬的塔身：w 為底寬，taper 為頂寬比例；回傳某高度的半寬。 */
function towerBody(k: Kit, w: number, y0: number, h: number, taper: number, color: string, z = 0): (y: number) => number {
  k.frustum(w, h, w, taper, { at: [0, y0 + h / 2, z], color });
  return (y: number) => (w / 2) * (1 - (1 - taper) * Math.min(1, Math.max(0, (y - y0) / h)));
}

/** 石磚層：每層一道淺溝，四角交錯的角石。 */
function masonry(k: Kit, half: (y: number) => number, ys: number[], courseH: number, z = 0): void {
  ys.forEach((y, i) => {
    const hw = half(y) + 0.015;
    k.box(hw * 2, 0.045, hw * 2, { at: [0, y, z], color: STONE_D });
    // 角石：長短交錯，比牆面略突出
    const cy = y + courseH / 2;
    const ch = half(cy);
    const long = i % 2 === 0;
    for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      k.box(long ? 0.5 : 0.32, courseH - 0.06, long ? 0.32 : 0.5, {
        at: [sx * (ch - (long ? 0.2 : 0.11)), cy, z + sz * (ch - (long ? 0.11 : 0.2))], color: STONE_L,
      });
    }
  });
}

/** 塔頂外挑的胸牆：托石、牆、城垛。 */
function parapet(k: Kit, hw: number, y: number, merlons: number, wallH: number, z = 0): void {
  const n = merlons * 2 + 1;
  // 托石
  for (let i = 0; i < n; i++) {
    const t = -hw + 0.18 + (i * (hw * 2 - 0.36)) / (n - 1);
    for (const s of [-1, 1]) {
      k.box(0.16, 0.2, 0.2, { at: [t, y - 0.1, z + s * (hw - 0.04)], color: STONE_D });
      k.box(0.2, 0.2, 0.16, { at: [s * (hw - 0.04), y - 0.1, z + t], color: STONE_D });
    }
  }
  k.box(hw * 2 + 0.12, 0.12, hw * 2 + 0.12, { at: [0, y + 0.06, z], color: STONE_D });
  for (const s of [-1, 1]) {
    k.box(hw * 2 + 0.1, wallH, 0.24, { at: [0, y + 0.12 + wallH / 2, z + s * (hw - 0.07)], color: STONE });
    k.box(0.24, wallH, hw * 2 + 0.1, { at: [s * (hw - 0.07), y + 0.12 + wallH / 2, z], color: STONE });
  }
  // 城垛（每邊 merlons 個，含四角）
  const top = y + 0.12 + wallH;
  const step = (hw * 2 - 0.3) / (merlons - 1);
  for (let i = 0; i < merlons; i++) {
    const t = -hw + 0.15 + i * step;
    for (const s of [-1, 1]) {
      k.box(0.3, 0.26, 0.28, { at: [t, top + 0.13, z + s * (hw - 0.07)], color: STONE_L });
      if (i > 0 && i < merlons - 1) k.box(0.28, 0.26, 0.3, { at: [s * (hw - 0.07), top + 0.13, z + t], color: STONE_L });
    }
  }
}

/** 隊伍色長旗：從 y 往下垂 h，下緣剪成燕尾。 */
function banner(k: Kit, x: number, y: number, z: number, w: number, h: number, color: string, trim: string, face: 1 | -1): void {
  k.box(w + 0.12, 0.08, 0.1, { at: [x, y, z], color: WOOD_D });
  k.box(w, h, 0.05, { at: [x, y - h / 2, z + face * 0.02], color });
  k.box(w, 0.06, 0.06, { at: [x, y - 0.12, z + face * 0.03], color: trim });
  for (const sx of [-1, 1]) {
    k.cone(w / 4, 0.28, { at: [x + sx * (w / 4), y - h - 0.13, z + face * 0.02], rot: [Math.PI, 0, 0], scale: [1, 1, 0.2], color }, 3);
  }
}

/** 原創的太陽紋章（金色圓盤＋八道光芒），貼在牆面或旗面上。 */
function sunBadge(k: Kit, x: number, y: number, z: number, size: number): void {
  k.cyl(0.17 * size, 0.17 * size, 0.06, { at: [x, y, z], rot: [Math.PI / 2, 0, 0], color: GOLD }, 12);
  k.cyl(0.09 * size, 0.09 * size, 0.07, { at: [x, y, z + 0.01], rot: [Math.PI / 2, 0, 0], color: '#fff2b0' }, 10);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const r = (i % 2 ? 0.24 : 0.29) * size;
    k.cone(0.055 * size, (i % 2 ? 0.1 : 0.15) * size, { at: [x + Math.sin(a) * r, y + Math.cos(a) * r, z], rot: [0, 0, -a], scale: [1, 1, 0.3], color: GOLD_D }, 3);
  }
}

/** 圓形砲台：外圈城垛，頂部開口（大砲另外綁在砲台骨頭上）。 */
function bastion(k: Kit, x: number, z: number, r: number, h: number): void {
  k.cyl(r * 0.94, r, h, { at: [x, 0.3 + h / 2, z], color: STONE_L }, 14);
  for (const y of [0.9, 1.5, 2.1]) if (y < h) k.cyl(r * 0.99, r * 0.99, 0.05, { at: [x, y, z], color: STONE_D }, 14);
  k.cyl(r * 1.1, r * 0.98, 0.16, { at: [x, 0.3 + h + 0.02, z], color: STONE_D }, 14);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.2;
    k.box(0.24, 0.26, 0.2, { at: [x + Math.sin(a) * r * 0.98, 0.3 + h + 0.23, z + Math.cos(a) * r * 0.98], rot: [0, a, 0], color: STONE });
  }
}

/** 側塔：3×3 暖色砂岩瞭望塔，上窄下寬、外挑托石城垛；正面燕尾長旗配太陽紋章，背面拱門與隊伍色雨遮；塔頂一名放大的原創弩手守衛。 */
export function buildPrincessTower(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const FLOOR = 2.86;
  const top = k.addBone('top', root, [0, FLOOR, 0]);
  k.bone = root;
  k.box(2.95, 0.18, 2.95, { at: [0, 0.09, 0], color: STONE_D });
  k.box(2.72, 0.14, 2.72, { at: [0, 0.25, 0], color: STONE });
  const half = towerBody(k, 2.5, 0.32, 2.36, 0.87, STONE);
  masonry(k, half, [0.76, 1.2, 1.64, 2.08, 2.52], 0.44);
  parapet(k, 1.18, 2.68, 3, 0.3);
  k.box(2.05, 0.06, 2.05, { at: [0, FLOOR - 0.02, 0], color: '#8f8576' });
  for (const t of [-0.5, 0, 0.5]) k.box(2.0, 0.065, 0.03, { at: [0, FLOOR - 0.01, t], color: '#7a7264' });
  // 正面（面向對手）：燕尾長旗＋太陽紋章、兩側箭孔
  const zf = half(1.6) + 0.01;
  banner(k, 0, 2.56, zf, 0.78, 1.3, team.main, GOLD, 1);
  sunBadge(k, 0, 1.75, zf + 0.06, 1.2);
  for (const sx of [-1, 1]) k.box(0.1, 0.42, 0.06, { at: [sx * 0.76, 1.6, half(1.6) + 0.01], color: '#2e2620' });
  // 背面（己方看得到）：拱形木門、門楣隊伍色盾徽、兩側小長旗、上方窗
  const zb = -(half(0.8) + 0.01);
  k.box(0.74, 0.86, 0.08, { at: [0, 0.75, zb], color: WOOD });
  k.cyl(0.37, 0.37, 0.08, { at: [0, 1.18, zb], rot: [Math.PI / 2, 0, 0], color: WOOD }, 12);
  k.box(0.06, 1.15, 0.1, { at: [0, 0.86, zb - 0.02], color: WOOD_D });
  for (const y of [0.55, 0.98]) k.box(0.76, 0.06, 0.1, { at: [0, y, zb - 0.02], color: '#4a4a52' });
  k.torus(0.41, 0.06, { at: [0, 1.18, zb - 0.02], color: STONE_L }, 12, Math.PI);
  const zs = -(half(1.75) + 0.01);
  k.cyl(0.2, 0.2, 0.06, { at: [0, 1.75, zs - 0.02], rot: [Math.PI / 2, 0, 0], color: team.main }, 10);
  k.cone(0.2, 0.22, { at: [0, 1.58, zs - 0.02], rot: [Math.PI, 0, 0], scale: [1, 1, 0.3], color: team.main }, 3);
  k.sphere(0.07, { at: [0, 1.76, zs - 0.06], color: GOLD }, 6);
  for (const sx of [-1, 1]) banner(k, sx * 0.78, 2.56, -(half(2.2) + 0.01), 0.36, 0.7, team.main, GOLD, -1);
  k.box(0.3, 0.34, 0.06, { at: [0, 2.3, -(half(2.3) + 0.01)], color: '#2e2620' });
  // 側面箭孔
  for (const sx of [-1, 1]) k.box(0.06, 0.42, 0.1, { at: [sx * (half(1.6) + 0.01), 1.6, 0], color: '#2e2620' });
  // 塔頂後方的隊伍色三角旗
  k.cyl(0.035, 0.035, 1.25, { at: [0.72, FLOOR + 0.62, -0.72], color: WOOD_D }, 6);
  k.cone(0.22, 0.6, { at: [0.72 + 0.3, FLOOR + 1.08, -0.72], rot: [0, 0, -Math.PI / 2], scale: [1, 1, 0.12], color: team.main }, 3);
  k.sphere(0.06, { at: [0.72, FLOOR + 1.27, -0.72], color: GOLD }, 6);
  // 守衛（原創弩手：大頭、兜帽、隊伍色斗篷）
  const guard: HumanoidSpec = {
    height: 1.38, build: 1.12, headScale: 1.12, skin: '#f2c9a0', face: 'dot', hair: { style: 'bob', color: '#6b3f22' }, hat: 'hood', hatColor: team.main,
    torso: team.main, torso2: GOLD_D, legs: '#5a4a3a', boots: '#3a2a1e', arms: team.dark, cape: true, weapon: 'crossbow',
  };
  addHumanoid(k, guard, team, top, [0, FLOOR, 0.12]);
  return k.build(4.3);
}

/** 國王塔上的指揮官（原創角色：白色長鬍、王族軟帽、隊伍色披風、金色權杖）；表情可換，表情貼圖也用同一個角色。 */
export function commanderSpec(team: TeamPal, face: HumanoidSpec['face'], beard = 1.0): HumanoidSpec {
  return {
    height: 1.7, build: 1.25, headScale: 1.12, skin: '#f1c39a', face, nose: 'ball', mustache: '#f4f1e8', beard: { color: '#f4f1e8', size: beard },
    torso: team.dark, torso2: GOLD, apron: team.main, legs: '#4a3a3a', boots: '#3a2a1e', arms: team.main, hands: '#f4f1e8', hat: 'royal', hatColor2: team.main,
    cape: true, belly: true, weapon: 'scepter', pads: true,
  };
}

/** 國王塔：4×4 原創城堡——中央主堡（指揮官站在頂上）、前方兩座圓形砲台各架一門砲、後方兩座尖頂角樓，正面城牆有城門與長旗。 */
export function buildKingTower(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const FLOOR = 3.0;
  const BX = 1.38;
  const BZ = 1.12;
  const BH = 2.2;
  const cannonL = k.addBone('cannon', root, [BX, 0.3 + BH + 0.2, BZ]);
  const cannonR = k.addBone('cannon2', root, [-BX, 0.3 + BH + 0.2, BZ]);
  k.bone = root;
  k.box(4.05, 0.18, 4.05, { at: [0, 0.09, 0], color: STONE_D });
  k.box(3.85, 0.14, 3.85, { at: [0, 0.25, 0], color: STONE });
  // 後方尖頂角樓
  for (const sx of [-1, 1]) {
    const x = sx * 1.52;
    const z = -1.5;
    k.cyl(0.4, 0.46, 3.25, { at: [x, 0.3 + 1.62, z], color: STONE_L }, 12);
    for (const y of [1.1, 2.0, 2.9]) k.cyl(0.445, 0.445, 0.05, { at: [x, y, z], color: STONE_D }, 12);
    k.cyl(0.52, 0.48, 0.14, { at: [x, 3.6, z], color: STONE_D }, 12);
    k.cone(0.58, 0.95, { at: [x, 4.14, z], color: team.main }, 12);
    k.cone(0.6, 0.14, { at: [x, 3.72, z], color: team.dark }, 12);
    k.sphere(0.1, { at: [x, 4.66, z], color: GOLD }, 6);
  }
  // 中央主堡（往後退，讓出前方砲台）
  const KZ = -0.3;
  const half = towerBody(k, 2.55, 0.32, 2.5, 0.9, STONE, KZ);
  masonry(k, half, [0.8, 1.28, 1.76, 2.24], 0.48, KZ);
  parapet(k, 1.24, 2.82, 4, 0.24, KZ);
  k.box(2.2, 0.06, 2.2, { at: [0, FLOOR - 0.02, KZ], color: '#9a7a52' });
  // 前方矮城牆與城門（兩座砲台之間）
  const wz = BZ + 0.08;
  k.box(1.9, 1.45, 0.4, { at: [0, 0.3 + 0.72, wz], color: STONE });
  for (let i = 0; i < 4; i++) k.box(0.28, 0.22, 0.4, { at: [-0.69 + i * 0.46, 0.3 + 1.45 + 0.11, wz], color: STONE_L });
  k.box(0.84, 0.9, 0.06, { at: [0, 0.75, wz + 0.2], color: '#3a2a20' });
  k.cyl(0.42, 0.42, 0.06, { at: [0, 1.2, wz + 0.2], rot: [Math.PI / 2, 0, 0], color: '#3a2a20' }, 12);
  for (let i = 0; i < 5; i++) k.box(0.05, 1.22, 0.05, { at: [-0.3 + i * 0.15, 0.9, wz + 0.24], color: '#5d636e' });
  for (const y of [0.58, 1.0]) k.box(0.8, 0.05, 0.05, { at: [0, y, wz + 0.24], color: '#5d636e' });
  // 主堡正面長旗與太陽紋章（在城牆上方露出）
  const zf = KZ + half(2.2) + 0.01;
  banner(k, 0, 2.72, zf, 1.05, 0.72, team.main, GOLD, 1);
  sunBadge(k, 0, 2.28, zf + 0.06, 1.2);
  // 主堡背面（己方看得到）：城門、隊伍色長旗
  const zb = KZ - (half(0.95) + 0.01);
  k.box(1.0, 1.1, 0.08, { at: [0, 0.87, zb], color: WOOD });
  k.cyl(0.5, 0.5, 0.08, { at: [0, 1.42, zb], rot: [Math.PI / 2, 0, 0], color: WOOD }, 14);
  k.box(0.06, 1.6, 0.1, { at: [0, 1.12, zb - 0.02], color: WOOD_D });
  for (const y of [0.6, 1.16]) k.box(1.02, 0.07, 0.1, { at: [0, y, zb - 0.02], color: '#4a4a52' });
  k.torus(0.54, 0.06, { at: [0, 1.42, zb - 0.02], color: STONE_L }, 14, Math.PI);
  banner(k, 0, 2.72, KZ - (half(2.4) + 0.01), 0.85, 0.5, team.main, GOLD, -1);
  // 前方兩座砲台
  for (const sx of [-1, 1]) bastion(k, sx * BX, BZ, 0.56, BH);
  // 兩門砲（喚醒時抬起、朝目標轉；靠目標那一側的砲開火）
  for (const [bone, sx] of [[cannonL, 1], [cannonR, -1]] as const) {
    k.bone = bone;
    const x = sx * BX;
    const y = 0.3 + BH + 0.2;
    k.cyl(0.32, 0.36, 0.16, { at: [x, y - 0.06, BZ], color: WOOD_D }, 10);
    k.cyl(0.17, 0.23, 0.95, { at: [x, y + 0.16, BZ + 0.3], rot: [Math.PI / 2 - 0.1, 0, 0], color: '#3a3530', shine: 0.65 }, 12);
    k.torus(0.19, 0.05, { at: [x, y + 0.21, BZ + 0.76], rot: [-0.1, 0, 0], color: '#b87333', shine: 0.85 }, 12);
    k.sphere(0.22, { at: [x, y + 0.12, BZ - 0.12], color: '#3a3530', shine: 0.65 }, 10);
  }
  k.bone = root;
  addHumanoid(k, commanderSpec(team, 'sleepy'), team, root, [0, FLOOR, KZ + 0.15]);
  return k.build(4.75);
}

/** 倒塌後的瓦礫堆。 */
export function buildRubble(size: number): ModelAsset {
  const k = new Kit();
  k.addBone('root', -1, [0, 0, 0]);
  const s = size / 3;
  k.box(2.9 * s, 0.35, 2.9 * s, { at: [0, 0.17, 0], color: STONE_D });
  const pieces: [number, number, number, number][] = [
    [-0.8, 0.45, 0.6, 0.45], [0.7, 0.5, -0.5, 0.5], [0.2, 0.35, 0.9, 0.35], [-0.5, 0.6, -0.7, 0.4], [0.9, 0.3, 0.8, 0.3], [-1.0, 0.3, -0.1, 0.32], [0.1, 0.75, 0.0, 0.45],
  ];
  pieces.forEach(([x, y, z, r], i) => k.rock(r * s, { at: [x * s, y, z * s], color: i % 2 ? STONE : STONE_L }));
  for (const [x, z] of [[-1.1, 1.1], [1.1, -1.1], [1.15, 1.0]]) k.box(0.45 * s, 0.8, 0.45 * s, { at: [x * s, 0.5, z * s], rot: [0.1, 0.4, 0.15], color: STONE });
  k.box(0.9 * s, 0.12, 0.6 * s, { at: [0.4 * s, 0.42, 0.2 * s], rot: [0.3, 0.6, 0.2], color: WOOD });
  return k.build(1.0);
}
