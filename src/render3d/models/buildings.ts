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
  k.cyl(0.15, 0.2, 0.85, { at: [0, 0.68, 0.3], rot: [Math.PI / 2 - 0.15, 0, 0], color: '#363a42' }, 12);
  k.torus(0.16, 0.04, { at: [0, 0.74, 0.68], rot: [-0.15, 0, 0], color: '#555b66' }, 12);
  k.sphere(0.2, { at: [0, 0.62, -0.08], color: '#2c3036' }, 10);
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
  k.gem(0.3, { at: [0, 1.75, 0], scale: [0.8, 1.4, 0.8], color: '#ff6a1f' });
  k.gem(0.16, { at: [0, 1.78, 0], scale: [0.8, 1.4, 0.8], color: '#ffd36b' });
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

// ───────── 防禦塔 ─────────

/** 側塔：3×3 石塔、隊伍色屋簷，塔頂一名原創弩手守衛。 */
export function buildPrincessTower(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const top = k.addBone('top', root, [0, 2.15, 0]);
  k.bone = root;
  // 台座與塔身
  k.box(3.0, 0.3, 3.0, { at: [0, 0.15, 0], color: STONE_D });
  k.box(2.7, 1.55, 2.7, { at: [0, 1.0, 0], color: STONE });
  // 石磚紋路（橫條）
  for (const y of [0.55, 1.0, 1.45]) k.box(2.74, 0.05, 2.74, { at: [0, y, 0], color: STONE_D });
  // 四角柱
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    k.box(0.5, 1.9, 0.5, { at: [sx * 1.27, 1.0, sz * 1.27], color: STONE_L });
    k.cone(0.42, 0.55, { at: [sx * 1.27, 2.22, sz * 1.27], rot: [0, Math.PI / 4, 0], color: team.main }, 4);
  }
  // 正面拱門與隊伍色布幔
  k.box(0.8, 0.95, 0.1, { at: [0, 0.78, 1.36], color: '#4a3a2e' });
  k.cyl(0.4, 0.4, 0.1, { at: [0, 1.25, 1.36], rot: [Math.PI / 2, 0, 0], color: '#4a3a2e' }, 12);
  k.box(0.7, 0.9, 0.06, { at: [0.85, 1.25, 1.39], color: team.main });
  k.box(0.7, 0.9, 0.06, { at: [-0.85, 1.25, 1.39], color: team.main });
  k.cone(0.35, 0.25, { at: [0.85, 0.7, 1.39], rot: [Math.PI, 0, 0], scale: [1, 1, 0.15], color: team.main }, 3);
  k.cone(0.35, 0.25, { at: [-0.85, 0.7, 1.39], rot: [Math.PI, 0, 0], scale: [1, 1, 0.15], color: team.main }, 3);
  // 頂部平台與城垛
  k.box(2.9, 0.22, 2.9, { at: [0, 1.88, 0], color: STONE_D });
  for (let i = 0; i < 4; i++) {
    for (const s of [-1, 1]) {
      const t = -0.75 + i * 0.5;
      k.box(0.3, 0.28, 0.24, { at: [t, 2.1, s * 1.3], color: STONE_L });
      k.box(0.24, 0.28, 0.3, { at: [s * 1.3, 2.1, t], color: STONE_L });
    }
  }
  // 守衛（原創弩手）
  const guard: HumanoidSpec = {
    height: 0.9, skin: '#f2c9a0', face: 'dot', hair: { style: 'bob', color: '#6b3f22' }, torso: team.main, torso2: '#f2b233', legs: '#5a4a3a', boots: '#3a2a1e',
    hat: 'cap', hatColor: team.dark, hatColor2: '#f4f1e8', weapon: 'crossbow',
  };
  addHumanoid(k, guard, team, top, [0, 2.0, 0.1]);
  return k.build(3.2);
}

/** 國王塔：4×4 城堡，正面金色王冠徽章，塔頂大砲與原創指揮官（喚醒前在打盹）。 */
export function buildKingTower(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const cannonBone = k.addBone('cannon', root, [0, 2.75, 0.3]);
  k.bone = root;
  k.box(4.0, 0.35, 4.0, { at: [0, 0.17, 0], color: STONE_D });
  k.box(3.7, 2.05, 3.7, { at: [0, 1.3, 0], color: STONE });
  for (const y of [0.7, 1.25, 1.8]) k.box(3.74, 0.06, 3.74, { at: [0, y, 0], color: STONE_D });
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    k.cyl(0.45, 0.5, 2.6, { at: [sx * 1.75, 1.3, sz * 1.75], color: STONE_L }, 10);
    k.cone(0.55, 0.75, { at: [sx * 1.75, 2.95, sz * 1.75], color: team.main }, 10);
    k.sphere(0.1, { at: [sx * 1.75, 3.38, sz * 1.75], color: '#f2b233' }, 6);
  }
  // 正面隊伍色布幔與王冠徽章
  k.box(1.5, 1.4, 0.08, { at: [0, 1.35, 1.88], color: team.main });
  k.cone(0.75, 0.45, { at: [0, 0.48, 1.88], rot: [Math.PI, 0, 0], scale: [1, 1, 0.1], color: team.main }, 3);
  k.box(0.8, 0.28, 0.12, { at: [0, 1.25, 1.95], color: '#f2b233' });
  for (const sx of [-0.3, 0, 0.3]) k.cone(0.12, 0.3, { at: [sx, 1.5, 1.95], color: '#f2b233' }, 4);
  k.box(1.6, 0.12, 0.12, { at: [0, 2.08, 1.9], color: '#f2b233' });
  // 頂部平台與城垛
  k.box(3.9, 0.25, 3.9, { at: [0, 2.42, 0], color: STONE_D });
  for (let i = 0; i < 5; i++) {
    for (const s of [-1, 1]) {
      const t = -1.2 + i * 0.6;
      k.box(0.36, 0.34, 0.3, { at: [t, 2.7, s * 1.78], color: STONE_L });
      k.box(0.3, 0.34, 0.36, { at: [s * 1.78, 2.7, t], color: STONE_L });
    }
  }
  // 大砲（喚醒時抬起）
  k.bone = cannonBone;
  k.cyl(0.42, 0.5, 0.3, { at: [0, 2.7, 0.3], color: '#5a3a1e' }, 10);
  k.cyl(0.24, 0.32, 1.25, { at: [0, 2.95, 0.8], rot: [Math.PI / 2 - 0.12, 0, 0], color: '#30343b' }, 12);
  k.torus(0.26, 0.06, { at: [0, 3.02, 1.38], rot: [-0.12, 0, 0], color: '#f2b233' }, 12);
  // 指揮官（原創角色：圓盔、八字鬍、隊伍色披風）
  const lord: HumanoidSpec = {
    height: 1.25, build: 1.2, headScale: 1.05, skin: '#f1c39a', face: 'sleepy', nose: 'ball', mustache: '#e8e2d2', beard: { color: '#e8e2d2', size: 0.7 },
    torso: '#f2b233', torso2: team.dark, legs: '#5a4a3a', boots: '#3a2a1e', hat: 'crest', hatColor: '#d9a52b', hatColor2: team.main, cape: true, belly: true,
  };
  addHumanoid(k, lord, team, root, [0, 2.52, -0.75]);
  return k.build(4.0);
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
