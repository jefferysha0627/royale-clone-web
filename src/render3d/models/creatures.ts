import { Kit, type ModelAsset } from '../kit';
import { addHumanoid, shade, type HumanoidSpec } from './humanoid';

type TeamPal = { main: string; dark: string; light: string };

// ───────── 石巨像（岩石人形） ─────────

export function buildGolem(team: TeamPal, small: boolean): ModelAsset {
  const k = new Kit();
  const S = small ? 0.55 : 1;
  const root = k.addBone('root', -1, [0, 0, 0]);
  const hipY = 0.55 * S;
  const hips = k.addBone('hips', root, [0, hipY, 0]);
  const spine = k.addBone('spine', hips, [0, hipY + 0.05 * S, 0]);
  const head = k.addBone('head', spine, [0, hipY + 1.0 * S, 0.12 * S]);
  const armL = k.addBone('armL', spine, [0.68 * S, hipY + 0.82 * S, 0]);
  const armR = k.addBone('armR', spine, [-0.68 * S, hipY + 0.82 * S, 0]);
  const legL = k.addBone('legL', hips, [0.28 * S, hipY, 0]);
  const legR = k.addBone('legR', hips, [-0.28 * S, hipY, 0]);
  const rock = '#8b8f86';
  const rockD = '#6c7068';
  const moss = '#6fa64a';
  const glow = '#ffb347';
  for (const [bone, sx] of [[legL, 1], [legR, -1]] as const) {
    k.rock(0.26 * S, { at: [sx * 0.28 * S, 0.3 * S, 0], scale: [1, 1.1, 1.1], color: rockD, bone });
    k.rock(0.2 * S, { at: [sx * 0.3 * S, 0.12 * S, 0.08 * S], scale: [1.2, 0.7, 1.3], color: rock, bone });
  }
  k.bone = spine;
  k.rock(0.62 * S, { at: [0, hipY + 0.5 * S, 0], scale: [1.15, 0.95, 0.9], color: rock }, 1);
  k.rock(0.3 * S, { at: [0.2 * S, hipY + 0.9 * S, -0.25 * S], color: rockD });
  k.rock(0.18 * S, { at: [-0.3 * S, hipY + 0.95 * S, 0.2 * S], color: moss });
  k.rock(0.14 * S, { at: [0.42 * S, hipY + 0.7 * S, 0.28 * S], color: moss });
  // 胸口的隊伍色晶石
  k.gem(0.13 * S, { at: [0, hipY + 0.55 * S, 0.5 * S], color: team.main });
  for (const [bone, sx] of [[armL, 1], [armR, -1]] as const) {
    k.rock(0.25 * S, { at: [sx * 0.75 * S, hipY + 0.7 * S, 0], color: rockD, bone });
    k.rock(0.3 * S, { at: [sx * 0.82 * S, hipY + 0.3 * S, 0.05 * S], scale: [1, 1.2, 1], color: rock, bone });
    k.rock(0.12 * S, { at: [sx * 0.7 * S, hipY + 0.92 * S, 0.05 * S], color: moss, bone });
  }
  k.bone = head;
  k.rock(0.3 * S, { at: [0, hipY + 1.18 * S, 0.12 * S], scale: [1.1, 0.85, 1], color: rock });
  for (const sx of [1, -1]) k.sphere(0.07 * S, { at: [sx * 0.11 * S, hipY + 1.2 * S, 0.38 * S], scale: [1.2, 0.8, 0.6], color: glow }, 8);
  k.box(0.2 * S, 0.05 * S, 0.06 * S, { at: [0, hipY + 1.08 * S, 0.38 * S], color: '#3a3d36' });
  return k.build(small ? 1.0 : 1.95);
}

// ───────── 精靈（冰／火）：圓滾滾的漂浮小團 ─────────

export function buildSpirit(team: TeamPal, kind: 'ice' | 'fire'): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const body = k.addBone('body', root, [0, 0.35, 0]);
  k.bone = body;
  if (kind === 'ice') {
    k.sphere(0.3, { at: [0, 0.38, 0], scale: [1, 0.95, 1], color: '#bfe8ff' }, 14);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      k.cone(0.07, 0.3, { at: [Math.cos(a) * 0.2, 0.62, Math.sin(a) * 0.2], rot: [Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6], color: '#e8f7ff' }, 5);
    }
    k.cone(0.09, 0.36, { at: [0, 0.75, 0], color: '#ffffff' }, 5);
  } else {
    k.sphere(0.3, { at: [0, 0.38, 0], color: '#ff7a2a' }, 14);
    k.cone(0.24, 0.5, { at: [0, 0.75, -0.04], rot: [-0.2, 0, 0], color: '#ffb347' }, 10);
    k.cone(0.12, 0.3, { at: [0.15, 0.7, 0.05], rot: [0, 0, -0.5], color: '#ffd36b' }, 8);
    k.cone(0.12, 0.3, { at: [-0.15, 0.7, 0.05], rot: [0, 0, 0.5], color: '#ffd36b' }, 8);
  }
  for (const sx of [1, -1]) {
    k.sphere(0.06, { at: [sx * 0.1, 0.42, 0.26], scale: [0.9, 1.2, 0.6], color: '#1b1b22' }, 8);
    k.sphere(0.022, { at: [sx * 0.1 + 0.015, 0.45, 0.3], color: '#ffffff' }, 5);
  }
  k.torus(0.2, 0.035, { at: [0, 0.16, 0], rot: [Math.PI / 2, 0, 0], color: team.main }, 14);
  return k.build(0.85);
}

// ───────── 飛行：蝙蝠、石像鬼、幼龍 ─────────

function wing(k: Kit, sx: number, bone: number, span: number, at: [number, number, number], color: string, membrane: string): void {
  // 骨架 + 兩片膜
  k.capsule(0.03, span * 0.8, { at: [at[0] + sx * span * 0.45, at[1] + 0.05, at[2]], rot: [0, 0, sx * 1.35], color, bone }, 5);
  k.blob(span, 0.05, span * 0.62, { at: [at[0] + sx * span * 0.5, at[1], at[2] - span * 0.12], rot: [0, sx * 0.25, 0], color: membrane, bone }, 8);
}

export function buildBat(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const body = k.addBone('body', root, [0, 0.3, 0]);
  const head = k.addBone('head', body, [0, 0.42, 0.05]);
  const wingL = k.addBone('wingL', body, [0.12, 0.34, 0]);
  const wingR = k.addBone('wingR', body, [-0.12, 0.34, 0]);
  k.bone = body;
  k.sphere(0.17, { at: [0, 0.3, 0], scale: [1, 1.1, 0.95], color: '#4b3566' }, 10);
  k.sphere(0.09, { at: [0, 0.22, 0.1], color: team.main }, 8);
  k.bone = head;
  k.sphere(0.15, { at: [0, 0.48, 0.06], color: '#5a4078' }, 10);
  for (const sx of [1, -1]) {
    k.cone(0.06, 0.18, { at: [sx * 0.09, 0.64, 0.04], rot: [0, 0, -sx * 0.3], color: '#5a4078' }, 5);
    k.sphere(0.035, { at: [sx * 0.06, 0.5, 0.19], color: '#ffe066' }, 6);
  }
  k.cone(0.02, 0.05, { at: [0.03, 0.4, 0.18], rot: [Math.PI, 0, 0], color: '#ffffff' }, 4);
  k.cone(0.02, 0.05, { at: [-0.03, 0.4, 0.18], rot: [Math.PI, 0, 0], color: '#ffffff' }, 4);
  wing(k, 1, wingL, 0.42, [0.12, 0.34, 0], '#3a2850', '#6e4f94');
  wing(k, -1, wingR, 0.42, [-0.12, 0.34, 0], '#3a2850', '#6e4f94');
  return k.build(0.7);
}

export function buildGargoyle(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const body = k.addBone('body', root, [0, 0.35, 0]);
  const head = k.addBone('head', body, [0, 0.62, 0.04]);
  const wingL = k.addBone('wingL', body, [0.15, 0.55, -0.08]);
  const wingR = k.addBone('wingR', body, [-0.15, 0.55, -0.08]);
  const armL = k.addBone('armL', body, [0.2, 0.5, 0.05]);
  const armR = k.addBone('armR', body, [-0.2, 0.5, 0.05]);
  const stone = '#7d8796';
  const stoneD = '#5b6472';
  k.bone = body;
  k.blob(0.38, 0.42, 0.32, { at: [0, 0.42, 0], color: stone }, 10);
  k.blob(0.26, 0.2, 0.24, { at: [0, 0.22, 0.02], color: stoneD }, 8);
  k.torus(0.15, 0.03, { at: [0, 0.58, 0.02], rot: [Math.PI / 2, 0, 0], color: team.main }, 12);
  k.cone(0.05, 0.3, { at: [0, 0.2, -0.22], rot: [-2.2, 0, 0], color: stoneD }, 5);
  for (const [bone, sx] of [[armL, 1], [armR, -1]] as const) {
    k.capsule(0.05, 0.15, { at: [sx * 0.24, 0.4, 0.08], rot: [0.5, 0, sx * 0.3], color: stone, bone }, 6);
    k.sphere(0.06, { at: [sx * 0.27, 0.3, 0.15], color: stoneD, bone }, 6);
  }
  k.bone = head;
  k.sphere(0.19, { at: [0, 0.75, 0.06], color: stone }, 12);
  k.blob(0.2, 0.12, 0.16, { at: [0, 0.68, 0.2], color: stoneD }, 8);
  for (const sx of [1, -1]) {
    k.cone(0.05, 0.22, { at: [sx * 0.12, 0.92, 0.0], rot: [-0.4, 0, -sx * 0.4], color: '#d8d0bc' }, 5);
    k.sphere(0.045, { at: [sx * 0.08, 0.78, 0.22], scale: [1.2, 0.8, 0.6], color: '#7ff0ff' }, 6);
  }
  wing(k, 1, wingL, 0.5, [0.15, 0.55, -0.08], stoneD, '#9aa4b2');
  wing(k, -1, wingR, 0.5, [-0.15, 0.55, -0.08], stoneD, '#9aa4b2');
  return k.build(0.95);
}

export function buildBabyDragon(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const body = k.addBone('body', root, [0, 0.45, 0]);
  const head = k.addBone('head', body, [0, 0.72, 0.32]);
  const wingL = k.addBone('wingL', body, [0.24, 0.7, -0.05]);
  const wingR = k.addBone('wingR', body, [-0.24, 0.7, -0.05]);
  const tail = k.addBone('tail', body, [0, 0.4, -0.4]);
  const skin = '#d0559a';
  const skinD = '#9c3a74';
  const belly = '#ffd98a';
  k.bone = body;
  k.sphere(0.4, { at: [0, 0.48, 0], scale: [1, 0.95, 1.1], color: skin }, 14);
  k.blob(0.5, 0.55, 0.3, { at: [0, 0.45, 0.26], color: belly }, 10);
  for (let i = 0; i < 4; i++) k.cone(0.05, 0.12, { at: [0, 0.85 - i * 0.05, -0.05 - i * 0.12], rot: [-0.6, 0, 0], color: team.main }, 5);
  for (const sx of [1, -1]) {
    k.capsule(0.07, 0.1, { at: [sx * 0.2, 0.18, 0.12], color: skinD }, 6);
    k.capsule(0.07, 0.1, { at: [sx * 0.22, 0.18, -0.15], color: skinD }, 6);
  }
  k.bone = tail;
  k.cone(0.14, 0.55, { at: [0, 0.35, -0.65], rot: [-1.9, 0, 0], color: skin }, 8);
  k.cone(0.07, 0.12, { at: [0, 0.27, -0.9], rot: [-1.2, 0, 0], color: team.main }, 4);
  k.bone = head;
  k.sphere(0.3, { at: [0, 0.82, 0.42], color: skin }, 14);
  k.blob(0.34, 0.2, 0.3, { at: [0, 0.72, 0.62], color: skin }, 10);
  k.blob(0.26, 0.08, 0.24, { at: [0, 0.65, 0.62], color: belly }, 8);
  for (const sx of [1, -1]) {
    k.cone(0.06, 0.22, { at: [sx * 0.15, 1.08, 0.3], rot: [-0.5, 0, -sx * 0.25], color: '#fff2c8' }, 6);
    k.sphere(0.075, { at: [sx * 0.13, 0.9, 0.66], scale: [0.9, 1.15, 0.6], color: '#1b1b22' }, 8);
    k.sphere(0.028, { at: [sx * 0.13 + 0.02, 0.93, 0.7], color: '#ffffff' }, 5);
    k.sphere(0.025, { at: [sx * 0.07, 0.76, 0.86], color: skinD }, 5);
  }
  wing(k, 1, wingL, 0.55, [0.24, 0.7, -0.05], skinD, '#f08cc0');
  wing(k, -1, wingR, 0.55, [-0.24, 0.7, -0.05], skinD, '#f08cc0');
  return k.build(1.15);
}

// ───────── 炸彈飛艇 ─────────

export function buildBlimp(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const body = k.addBone('body', root, [0, 0.7, 0]);
  const prop = k.addBone('prop', body, [0, 1.0, -0.95]);
  const bay = k.addBone('bay', body, [0, 0.4, 0.1]);
  k.bone = body;
  // 氣囊：前後兩段隊伍色、中間米白，前端金色鼻蓋
  k.sphere(0.5, { at: [0, 1.0, 0], scale: [1.0, 0.9, 1.7], color: '#c9b48e' }, 18);
  // 隊伍色的縱向布條，從上方俯視也看得到
  for (const sx of [-0.22, 0, 0.22]) k.sphere(0.5, { at: [sx, 1.02, 0], scale: [0.16, 0.92, 1.71], color: sx === 0 ? team.main : team.light }, 14);
  k.sphere(0.13, { at: [0, 1.0, 0.85], color: '#f2b233' }, 10);
  for (const [sx, sy] of [[1, 0], [-1, 0], [0, 1]] as const) {
    k.box(sy ? 0.06 : 0.5, sy ? 0.5 : 0.06, 0.45, { at: [sx * 0.38, 1.0 + sy * 0.38, -0.8], color: team.dark });
  }
  for (const sx of [1, -1]) k.cyl(0.015, 0.015, 0.4, { at: [sx * 0.18, 0.62, 0.1], rot: [0, 0, sx * 0.2], color: '#4a3a2a' }, 4);
  k.bone = bay;
  k.blob(0.5, 0.24, 0.62, { at: [0, 0.42, 0.12], color: '#8a5a2e' }, 10);
  k.torus(0.27, 0.035, { at: [0, 0.52, 0.12], rot: [Math.PI / 2, 0, 0], scale: [1, 1.3, 1], color: '#5a3a1e' }, 14);
  // 駕駛（小哥布林，戴護目鏡）與吊掛炸彈
  k.sphere(0.15, { at: [0, 0.66, 0.32], color: '#7cbf4a' }, 10);
  for (const sx of [1, -1]) k.cone(0.04, 0.15, { at: [sx * 0.16, 0.7, 0.3], rot: [0, 0, -sx * 1.3], color: '#7cbf4a' }, 5);
  for (const sx of [1, -1]) k.sphere(0.045, { at: [sx * 0.06, 0.7, 0.45], color: '#c9a24a' }, 6);
  k.sphere(0.15, { at: [0, 0.24, 0.0], color: '#2a2c33' }, 10);
  k.sphere(0.03, { at: [0, 0.4, 0.0], color: '#ffd36b' }, 6);
  k.bone = prop;
  k.box(0.55, 0.07, 0.03, { at: [0, 1.0, -1.0], color: '#7a5230' });
  k.box(0.07, 0.55, 0.03, { at: [0, 1.0, -1.0], color: '#7a5230' });
  k.sphere(0.06, { at: [0, 1.0, -1.0], color: '#c9a24a' }, 6);
  return k.build(1.4);
}

// ───────── 坐騎：狼騎兵、衝鋒騎士 ─────────

interface MountSpec {
  len: number;
  height: number;
  color: string;
  color2: string;
  mane: string;
  kind: 'wolf' | 'horse';
}

function addMount(k: Kit, m: MountSpec, team: TeamPal): { body: number; saddleY: number } {
  const root = k.boneIndex('root');
  const legH = m.height * 0.45;
  const body = k.addBone('body', root, [0, legH + 0.1, 0]);
  const head = k.addBone('mhead', body, [0, legH + m.height * 0.45, m.len * 0.48]);
  const tail = k.addBone('tail', body, [0, legH + m.height * 0.3, -m.len * 0.48]);
  const legs = [
    k.addBone('legFL', body, [0.17, legH, m.len * 0.32]),
    k.addBone('legFR', body, [-0.17, legH, m.len * 0.32]),
    k.addBone('legBL', body, [0.17, legH, -m.len * 0.32]),
    k.addBone('legBR', body, [-0.17, legH, -m.len * 0.32]),
  ];
  const bodyY = legH + m.height * 0.22;
  k.bone = body;
  k.blob(m.height * 0.62, m.height * 0.55, m.len, { at: [0, bodyY, 0], color: m.color }, 12);
  k.blob(m.height * 0.5, m.height * 0.3, m.len * 0.8, { at: [0, bodyY - m.height * 0.14, 0.02], color: m.color2 }, 10);
  // 背上的深色毛（狼）
  if (m.kind === 'wolf') k.blob(m.height * 0.42, m.height * 0.2, m.len * 0.85, { at: [0, bodyY + m.height * 0.2, -0.05], color: m.mane }, 10);
  // 隊伍色鞍布（邊緣金色流蘇）
  k.blob(m.height * 0.68, m.height * 0.2, m.len * 0.45, { at: [0, bodyY + m.height * 0.2, -0.02], color: team.main }, 10);
  for (const sx of [1, -1]) k.box(0.02, m.height * 0.08, m.len * 0.4, { at: [sx * m.height * 0.33, bodyY + m.height * 0.1, -0.02], color: '#d9b04a' });
  for (let i = 0; i < legs.length; i++) {
    const sx = i % 2 === 0 ? 1 : -1;
    const z = i < 2 ? m.len * 0.32 : -m.len * 0.32;
    k.capsule(0.07, legH * 0.75, { at: [sx * 0.17, legH * 0.5, z], color: m.color, bone: legs[i] }, 6);
    k.blob(0.13, 0.08, 0.16, { at: [sx * 0.17, 0.04, z + 0.02], color: m.kind === 'horse' ? '#3a2a1e' : m.color2, bone: legs[i] }, 6);
  }
  k.bone = tail;
  if (m.kind === 'wolf') {
    // 蓬鬆上翹的尾巴，尾尖淺色
    k.blob(0.2, 0.2, 0.55, { at: [0, legH + m.height * 0.42, -m.len * 0.72], rot: [0.75, 0, 0], color: m.color }, 10);
    k.blob(0.13, 0.13, 0.22, { at: [0, legH + m.height * 0.68, -m.len * 0.86], rot: [0.9, 0, 0], color: m.color2 }, 8);
  }
  else k.blob(0.12, 0.45, 0.14, { at: [0, legH + m.height * 0.12, -m.len * 0.58], rot: [-0.3, 0, 0], color: m.mane }, 8);
  k.bone = head;
  const hz = m.len * 0.55;
  const hy = legH + m.height * 0.55;
  if (m.kind === 'wolf') {
    // 頸部的蓬鬆毛領
    k.blob(0.42, 0.34, 0.3, { at: [0, hy - 0.1, hz - 0.18], color: m.color2 }, 12);
    k.sphere(0.22, { at: [0, hy, hz], color: m.color }, 14);
    // 長吻部、張開的嘴與尖牙
    k.blob(0.19, 0.13, 0.32, { at: [0, hy - 0.04, hz + 0.22], color: m.color2 }, 12);
    k.blob(0.15, 0.06, 0.24, { at: [0, hy - 0.14, hz + 0.2], rot: [0.25, 0, 0], color: shade(m.color2, -0.1) }, 10);
    k.blob(0.13, 0.04, 0.2, { at: [0, hy - 0.1, hz + 0.21], color: '#7a2a2a' }, 8);
    for (const sx of [1, -1]) k.cone(0.022, 0.07, { at: [sx * 0.06, hy - 0.08, hz + 0.3], rot: [Math.PI, 0, 0], color: '#f4f1e8' }, 4);
    k.sphere(0.055, { at: [0, hy + 0.0, hz + 0.39], color: '#1b1b22' }, 8);
    for (const sx of [1, -1]) {
      // 立起的大耳朵（內側粉色）
      k.cone(0.085, 0.24, { at: [sx * 0.11, hy + 0.24, hz - 0.04], rot: [-0.15, 0, -sx * 0.25], color: m.color }, 5);
      k.cone(0.045, 0.14, { at: [sx * 0.11, hy + 0.22, hz - 0.0], rot: [-0.15, 0, -sx * 0.25], color: '#d9a0a0' }, 5);
      // 黃色眼睛與粗眉
      k.sphere(0.04, { at: [sx * 0.085, hy + 0.06, hz + 0.18], color: '#ffd23a' }, 8);
      k.sphere(0.018, { at: [sx * 0.087, hy + 0.06, hz + 0.21], color: '#1b1b22' }, 6);
      k.box(0.08, 0.025, 0.03, { at: [sx * 0.085, hy + 0.11, hz + 0.19], rot: [0, 0, sx * 0.35], color: shade(m.color, -0.35) });
    }
    // 隊伍色項圈與金屬環
    k.torus(0.17, 0.04, { at: [0, hy - 0.13, hz - 0.1], rot: [Math.PI / 2 - 0.3, 0, 0], color: team.main }, 14);
    k.sphere(0.035, { at: [0, hy - 0.2, hz + 0.06], color: '#d9b04a' }, 6);
  } else {
    k.blob(0.18, 0.4, 0.2, { at: [0, hy - 0.05, hz - 0.08], rot: [0.5, 0, 0], color: m.color }, 10);
    k.blob(0.2, 0.2, 0.42, { at: [0, hy + 0.1, hz + 0.12], rot: [0.35, 0, 0], color: m.color }, 10);
    k.blob(0.06, 0.32, 0.3, { at: [0, hy + 0.12, hz - 0.12], rot: [0.5, 0, 0], color: m.mane }, 6);
    for (const sx of [1, -1]) {
      k.cone(0.04, 0.12, { at: [sx * 0.07, hy + 0.3, hz + 0.02], color: m.color }, 4);
      k.sphere(0.03, { at: [sx * 0.09, hy + 0.15, hz + 0.18], color: '#1b1b22' }, 6);
    }
    k.blob(0.22, 0.1, 0.14, { at: [0, hy + 0.12, hz + 0.08], color: team.main }, 8);
  }
  return { body, saddleY: bodyY + m.height * 0.25 };
}

export function buildWolfRider(team: TeamPal): ModelAsset {
  const k = new Kit();
  k.addBone('root', -1, [0, 0, 0]);
  const { body, saddleY } = addMount(k, { len: 1.1, height: 0.62, color: '#7d7066', color2: '#d8c8b2', mane: '#4a4038', kind: 'wolf' }, team);
  const rider: HumanoidSpec = {
    height: 0.92, skin: '#7cbf4a', ears: 'pointy', nose: 'long', face: 'angry', torso: '#7a5230', torso2: '#3a2a1e', legs: '#5a3a1e', boots: '#3a2a1e',
    hat: 'band', hatColor2: team.main, weapon: 'mace', pads: true,
  };
  addHumanoid(k, rider, team, body, [0, saddleY - 0.12, -0.05], true);
  return k.build(1.3);
}

export function buildLancer(team: TeamPal): ModelAsset {
  const k = new Kit();
  k.addBone('root', -1, [0, 0, 0]);
  const { body, saddleY } = addMount(k, { len: 1.25, height: 0.75, color: '#7a4a2a', color2: '#5c3820', mane: '#2a1a10', kind: 'horse' }, team);
  const rider: HumanoidSpec = {
    height: 0.95, skin: '#f2c9a0', face: 'dot', torso: '#c9d1dc', torso2: '#f2b233', legs: '#8a96a6', boots: '#5a6472', hands: '#c9d1dc',
    hat: 'helmet', hatColor: '#d6dde6', plume: true, weapon: 'lance', offhand: 'buckler', pads: true,
  };
  addHumanoid(k, rider, team, body, [0, saddleY - 0.15, -0.08], true);
  return k.build(1.75);
}

export { shade };
