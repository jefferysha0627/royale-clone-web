import { CylinderGeometry } from 'three';
import { Kit, type ModelAsset } from '../kit';
import { addHumanoid, type HumanoidSpec } from './humanoid';

// v3 第四批單位的原創模型：公主（背箭袋）、地獄飛龍、電磁炮。

type TeamPal = { main: string; dark: string; light: string };

const WOOD = '#8a5a2e';
const WOOD_D = '#5a3a1e';
const IRON = '#5d636e';
const COPPER = '#c87a3a';

function wing(k: Kit, sx: number, bone: number, span: number, at: [number, number, number], color: string, membrane: string): void {
  k.capsule(0.045, span * 0.8, { at: [at[0] + sx * span * 0.45, at[1] + 0.07, at[2]], rot: [0, 0, sx * 1.3], color, bone }, 5);
  k.blob(span, 0.06, span * 0.66, { at: [at[0] + sx * span * 0.5, at[1], at[2] - span * 0.14], rot: [0, sx * 0.28, 0], color: membrane, bone }, 8);
  for (const f of [0.55, 0.85]) k.cone(0.03, 0.1, { at: [at[0] + sx * span * f, at[1] + 0.1, at[2] - span * 0.05], rot: [0, 0, -sx * 0.5], color: '#2a1a14', bone }, 4);
}

/** 公主：尖耳、金色長髮、綠色皮甲與披風，左手長弓、背後箭袋（隊伍色箭羽）。 */
export function buildRanger(spec: HumanoidSpec, team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const rig = addHumanoid(k, spec, team, root);
  const H = spec.height / 1.25;
  k.bone = rig.spine;
  // 背後斜背的箭袋：皮革筒、金色箍、露出三支箭的箭羽
  k.cyl(0.075 * H, 0.06 * H, 0.42 * H, { at: [0.06 * H, 0.56 * H, -0.19 * H], rot: [0.25, 0, -0.35], color: '#6a4a2a', bone: rig.spine }, 8);
  k.torus(0.076 * H, 0.014 * H, { at: [0.12 * H, 0.74 * H, -0.24 * H], rot: [Math.PI / 2 + 0.25, 0, -0.35], color: '#c9a24a', bone: rig.spine, shine: 0.8 }, 10);
  for (let i = 0; i < 3; i++) {
    const dx = (i - 1) * 0.035 * H;
    k.cyl(0.008, 0.008, 0.2 * H, { at: [0.15 * H + dx, 0.84 * H, -0.26 * H], rot: [0.25, 0, -0.35], color: '#d9c9a8', bone: rig.spine }, 3);
    k.blob(0.03 * H, 0.09 * H, 0.012 * H, { at: [0.18 * H + dx, 0.93 * H, -0.28 * H], rot: [0.25, 0, -0.35], color: team.main, bone: rig.spine }, 5);
  }
  return k.build(spec.height);
}

/**
 * 地獄飛龍：比飛龍寶寶大一號，暗紅鱗片、熔岩橘的腹甲與發光的喉嚨，兩對往後彎的角、隊伍色背棘，翼膜是餘燼般的深橘色。
 */
export function buildFireDrake(team: TeamPal): ModelAsset {
  const S = 1.12;
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const body = k.addBone('body', root, [0, 0.45 * S, 0]);
  const head = k.addBone('head', body, [0, 0.74 * S, 0.34 * S]);
  const wingL = k.addBone('wingL', body, [0.26 * S, 0.72 * S, -0.06 * S]);
  const wingR = k.addBone('wingR', body, [-0.26 * S, 0.72 * S, -0.06 * S]);
  const tail = k.addBone('tail', body, [0, 0.4 * S, -0.42 * S]);
  const skin = '#8e2f2a';
  const skinD = '#5e1c1a';
  const belly = '#ff9a3c';
  const glow = '#ffd36b';
  k.bone = body;
  k.sphere(0.4 * S, { at: [0, 0.5 * S, 0], scale: [1, 0.92, 1.15], color: skin }, 14);
  k.blob(0.48 * S, 0.5 * S, 0.3 * S, { at: [0, 0.46 * S, 0.27 * S], color: belly }, 10);
  // 腹甲的發光裂紋
  for (const yy of [0.36, 0.5, 0.64]) k.box(0.3 * S, 0.025 * S, 0.02 * S, { at: [0, yy * S, 0.42 * S], color: glow });
  for (let i = 0; i < 5; i++) k.cone(0.055 * S, 0.15 * S, { at: [0, (0.9 - i * 0.05) * S, (-0.04 - i * 0.12) * S], rot: [-0.65, 0, 0], color: team.main }, 5);
  for (const sx of [1, -1]) {
    k.capsule(0.075 * S, 0.1 * S, { at: [sx * 0.21 * S, 0.18 * S, 0.12 * S], color: skinD }, 6);
    k.capsule(0.075 * S, 0.1 * S, { at: [sx * 0.23 * S, 0.18 * S, -0.16 * S], color: skinD }, 6);
    for (const dz of [0.04, 0.1]) k.cone(0.02 * S, 0.06 * S, { at: [sx * 0.21 * S, 0.08 * S, (0.12 + dz) * S], rot: [1.3, 0, 0], color: '#2a1a14' }, 4);
  }
  k.bone = tail;
  k.cone(0.15 * S, 0.62 * S, { at: [0, 0.36 * S, -0.7 * S], rot: [-1.85, 0, 0], color: skin }, 8);
  // 尾巴末端的火焰狀尖刺
  k.cone(0.09 * S, 0.2 * S, { at: [0, 0.3 * S, -1.0 * S], rot: [-1.2, 0, 0], color: belly }, 5);
  k.cone(0.05 * S, 0.14 * S, { at: [0, 0.36 * S, -1.04 * S], rot: [-0.9, 0, 0], color: glow }, 4);
  k.bone = head;
  k.sphere(0.28 * S, { at: [0, 0.86 * S, 0.42 * S], color: skin }, 14);
  // 細長的吻部（上顎）與微張的下顎，嘴裡透出火光
  k.blob(0.24 * S, 0.15 * S, 0.44 * S, { at: [0, 0.8 * S, 0.72 * S], rot: [0.12, 0, 0], color: skin }, 10);
  k.blob(0.2 * S, 0.07 * S, 0.36 * S, { at: [0, 0.66 * S, 0.68 * S], rot: [-0.18, 0, 0], color: belly }, 8);
  k.sphere(0.075 * S, { at: [0, 0.72 * S, 0.8 * S], color: glow }, 8);
  for (const sx of [1, -1]) {
    k.sphere(0.022 * S, { at: [sx * 0.06 * S, 0.86 * S, 0.94 * S], color: '#2a1a14' }, 5);
    // 嘴角的小尖牙
    k.cone(0.02 * S, 0.06 * S, { at: [sx * 0.08 * S, 0.7 * S, 0.88 * S], rot: [Math.PI, 0, 0], color: '#fff2c8' }, 4);
  }
  for (const sx of [1, -1]) {
    // 兩對往後彎的角
    k.cone(0.065 * S, 0.3 * S, { at: [sx * 0.15 * S, 1.06 * S, 0.24 * S], rot: [-1.05, 0, -sx * 0.3], color: '#3a2620' }, 6);
    k.cone(0.045 * S, 0.18 * S, { at: [sx * 0.23 * S, 0.94 * S, 0.3 * S], rot: [-1.2, 0, -sx * 0.7], color: '#3a2620' }, 5);
    // 半瞇的眼睛（亮橘瞳孔）
    k.sphere(0.07 * S, { at: [sx * 0.14 * S, 0.94 * S, 0.6 * S], scale: [1, 0.8, 0.6], color: '#fff0c0' }, 8);
    k.sphere(0.035 * S, { at: [sx * 0.14 * S, 0.94 * S, 0.64 * S], color: '#ff7a1a' }, 6);
    k.box(0.12 * S, 0.03 * S, 0.06 * S, { at: [sx * 0.14 * S, 1.0 * S, 0.6 * S], rot: [0, 0, sx * 0.35], color: skinD });
  }
  wing(k, 1, wingL, 0.62 * S, [0.26 * S, 0.72 * S, -0.06 * S], skinD, '#c8582a');
  wing(k, -1, wingR, 0.62 * S, [-0.26 * S, 0.72 * S, -0.06 * S], skinD, '#c8582a');
  return k.build(1.25);
}

function wheel(k: Kit, x: number, y: number, z: number, r: number, bone: number): void {
  k.cyl(r, r, 0.08, { at: [x, y, z], rot: [0, 0, Math.PI / 2], color: WOOD_D, bone }, 14);
  k.torus(r * 0.98, 0.03, { at: [x + Math.sign(x) * 0.045, y, z], rot: [0, Math.PI / 2, 0], color: IRON, bone, shine: 0.8 }, 16);
  for (let i = 0; i < 4; i++) {
    k.box(0.03, r * 1.7, 0.04, { at: [x + Math.sign(x) * 0.05, y, z], rot: [(i / 4) * Math.PI, 0, 0], color: WOOD, bone });
  }
  k.cyl(0.06, 0.06, 0.12, { at: [x + Math.sign(x) * 0.05, y, z], rot: [0, 0, Math.PI / 2], color: COPPER, bone, shine: 0.85 }, 8);
}

/**
 * 電磁炮：四輪木車上架著銅製鍋爐與三圈線圈，頂端是蓄電用的雷球，前方一支喇叭狀放電砲口；兩側隊伍色護板與小旗。
 * 骨頭：body（車身）、wheelF／wheelB（前後輪軸）、orb（雷球，蓄力時放大）。
 */
export function buildVoltCart(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const body = k.addBone('body', root, [0, 0.42, 0]);
  const wheelF = k.addBone('wheelF', root, [0, 0.27, 0.42]);
  const wheelB = k.addBone('wheelB', root, [0, 0.27, -0.42]);
  const orb = k.addBone('orb', body, [0, 1.32, -0.1]);
  for (const [bone, z] of [[wheelF, 0.42], [wheelB, -0.42]] as const) {
    for (const sx of [1, -1]) wheel(k, sx * 0.47, 0.27, z, 0.25, bone);
    k.cyl(0.035, 0.035, 0.9, { at: [0, 0.27, z], rot: [0, 0, Math.PI / 2], color: IRON, bone, shine: 0.7 }, 6);
  }
  k.bone = body;
  // 車身：木製車斗、側板與隊伍色護板
  k.box(0.82, 0.18, 1.2, { at: [0, 0.46, 0], color: WOOD });
  for (const sx of [1, -1]) {
    k.box(0.06, 0.24, 1.18, { at: [sx * 0.42, 0.62, 0], color: WOOD_D });
    k.box(0.04, 0.18, 0.62, { at: [sx * 0.46, 0.62, 0.02], color: team.main, shine: 0.3 });
    k.box(0.05, 0.05, 1.2, { at: [sx * 0.43, 0.76, 0], color: IRON, shine: 0.7 });
  }
  k.box(0.82, 0.24, 0.06, { at: [0, 0.62, -0.6], color: WOOD_D });
  // 銅鍋爐、鉚釘環與三圈線圈
  k.cyl(0.28, 0.32, 0.5, { at: [0, 0.82, -0.1], color: COPPER, shine: 0.85 }, 14);
  for (const yy of [0.62, 1.02]) k.torus(0.31, 0.03, { at: [0, yy, -0.1], rot: [Math.PI / 2, 0, 0], color: '#8a4a22', shine: 0.8 }, 16);
  k.cyl(0.08, 0.1, 0.24, { at: [0, 1.14, -0.1], color: IRON, shine: 0.75 }, 8);
  for (const [yy, r] of [[1.04, 0.22], [1.12, 0.18], [1.2, 0.14]] as const) k.torus(r, 0.022, { at: [0, yy, -0.1], rot: [Math.PI / 2, 0, 0], color: '#e0a060', shine: 0.9 }, 14);
  // 前方放電砲口（喇叭狀）與支架
  k.add(new CylinderGeometry(0.17, 0.07, 0.42, 12, 1, true), { at: [0, 0.86, 0.5], rot: [Math.PI / 2, 0, 0], color: '#b8bec8', shine: 0.9 });
  k.cyl(0.07, 0.07, 0.3, { at: [0, 0.86, 0.22], rot: [Math.PI / 2, 0, 0], color: IRON, shine: 0.7 }, 8);
  k.sphere(0.06, { at: [0, 0.86, 0.68], color: '#bfe8ff', shine: 1 }, 8);
  // 後方小旗
  k.cyl(0.015, 0.015, 0.6, { at: [0.3, 0.98, -0.55], color: WOOD_D }, 4);
  k.box(0.02, 0.18, 0.26, { at: [0.3, 1.2, -0.42], color: team.main });
  k.bone = orb;
  k.sphere(0.17, { at: [0, 1.32, -0.1], color: '#a8e4ff', shine: 1 }, 12);
  k.torus(0.22, 0.012, { at: [0, 1.32, -0.1], rot: [0.7, 0.2, 0], color: '#e8f8ff' }, 14);
  k.torus(0.2, 0.012, { at: [0, 1.32, -0.1], rot: [-0.6, 0.9, 0], color: '#e8f8ff' }, 14);
  return k.build(1.35);
}
