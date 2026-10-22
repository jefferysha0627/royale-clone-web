import { CylinderGeometry } from 'three';
import { Kit, type ModelAsset, type V3 } from '../kit';

// 參數化 Q 版人形：大頭、短身、粗四肢。面向 +Z，腳底在原點；角色的右手在 −X。
// 所有角色外觀皆為本作原創的通用奇幻造型。

export type Hat =
  | 'none' | 'helmet' | 'horned' | 'wizard' | 'hood' | 'cap' | 'band' | 'iron' | 'winged' | 'skull' | 'bandana' | 'witch' | 'crest' | 'goggles' | 'royal';
export type Weapon =
  | 'none' | 'sword' | 'greatsword' | 'axe2' | 'club' | 'spear' | 'musket' | 'staff' | 'skullstaff' | 'bow' | 'bomb' | 'lance' | 'mace' | 'crossbow' | 'cleaver' | 'scepter';
export type Face = 'dot' | 'angry' | 'skull' | 'visor' | 'glow' | 'sleepy';

export interface HumanoidSpec {
  height: number; // 約略身高（格）
  build?: number; // 體型寬度倍率
  headScale?: number;
  skin: string;
  face?: Face;
  eyeColor?: string;
  nose?: 'ball' | 'long' | 'none';
  ears?: 'pointy' | 'round' | 'none';
  hair?: { style: 'tuft' | 'bob' | 'long' | 'mohawk' | 'braids'; color: string };
  beard?: { color: string; size?: number };
  mustache?: string;
  hat?: Hat;
  hatColor?: string;
  hatColor2?: string;
  torso: string;
  torso2?: string; // 腰帶／裝飾
  apron?: string; // 下擺（裙甲、長袍）
  robe?: boolean; // 長袍蓋到腳
  legs: string;
  boots: string;
  arms?: string; // 袖子；預設同 torso
  hands?: string; // 手套；預設同 skin
  pads?: boolean; // 肩甲（隊伍色）
  scarf?: boolean; // 圍巾（隊伍色）
  cape?: boolean; // 披風（隊伍色）
  sash?: boolean; // 斜背帶（隊伍色）
  plume?: boolean; // 頭盔羽飾（隊伍色）
  weapon?: Weapon;
  offhand?: 'none' | 'shield' | 'bow' | 'buckler' | 'lantern';
  bones?: boolean; // 骷髏：細骨頭四肢與肋骨
  belly?: boolean;
  torsoScale?: number; // 軀幹長度倍率（巨人比例較成人）
  legScale?: number;
}

export interface HumanoidRig {
  hips: number;
  spine: number;
  head: number;
  armL: number;
  armR: number;
  legL: number;
  legR: number;
}

/** 把人形加到 Kit（可接在坐騎的骨頭下）。回傳骨頭索引。 */
export function addHumanoid(k: Kit, s: HumanoidSpec, team: { main: string; dark: string; light: string }, rootBone: number, origin: V3 = [0, 0, 0], seated = false): HumanoidRig {
  const H = s.height / 1.25; // 以 1.25 格高為基準縮放
  const B = (s.build ?? 1) * H;
  const hs = (s.headScale ?? 1) * H;
  const [ox, oy, oz] = origin;
  const legLen = (seated ? 0.2 : 0.3) * H * (s.legScale ?? 1);
  const hipY = oy + legLen;
  const torsoH = 0.42 * H * (s.torsoScale ?? 1);
  const neckY = hipY + torsoH;
  const headR = 0.27 * hs;
  const shoulderX = 0.27 * B + 0.02;
  const shoulderY = neckY - 0.08 * H;

  const hips = k.addBone('hips', rootBone, [ox, hipY, oz]);
  const spine = k.addBone('spine', hips, [ox, hipY + 0.02 * H, oz]);
  const head = k.addBone('head', spine, [ox, neckY, oz]);
  const armL = k.addBone('armL', spine, [ox + shoulderX, shoulderY, oz]);
  const armR = k.addBone('armR', spine, [ox - shoulderX, shoulderY, oz]);
  const legL = k.addBone('legL', hips, [ox + 0.11 * B, hipY, oz]);
  const legR = k.addBone('legR', hips, [ox - 0.11 * B, hipY, oz]);

  const limbR = s.bones ? 0.035 * B : 0.085 * B;
  const armLen = 0.24 * H;

  // ── 腿與靴
  for (const [bone, sx] of [[legL, 1], [legR, -1]] as const) {
    const lx = ox + sx * 0.11 * B;
    if (seated) {
      k.capsule(limbR, legLen * 0.6, { at: [lx + sx * 0.08 * B, hipY - legLen * 0.3, oz + 0.06], rot: [0.5, 0, sx * 0.5], color: s.legs, bone });
      k.blob(0.16 * B, 0.12 * H, 0.22 * B, { at: [lx + sx * 0.16 * B, hipY - legLen * 0.75, oz + 0.12], color: s.boots, bone });
    } else {
      k.capsule(limbR, legLen * 0.55, { at: [lx, hipY - legLen * 0.45, oz], color: s.legs, bone });
      k.blob(0.17 * B, 0.12 * H, 0.24 * B, { at: [lx, oy + 0.055 * H, oz + 0.03], color: s.boots, bone });
    }
  }

  // ── 身體
  k.bone = spine;
  const torsoCY = hipY + torsoH * 0.48;
  if (s.bones) {
    // 脊椎與肋骨
    k.cyl(0.035 * B, 0.035 * B, torsoH, { at: [ox, torsoCY, oz - 0.02], color: s.torso });
    for (let i = 0; i < 3; i++) {
      k.torus(0.13 * B - i * 0.012, 0.022 * B, { at: [ox, hipY + torsoH * (0.42 + i * 0.17), oz], rot: [Math.PI / 2, 0, 0], color: s.torso }, 12);
    }
    k.blob(0.26 * B, 0.1 * H, 0.18 * B, { at: [ox, hipY + 0.02, oz], color: s.torso }); // 骨盆
  } else {
    k.blob(0.5 * B, torsoH * 1.08, 0.4 * B, { at: [ox, torsoCY, oz], color: s.torso }, 12);
    if (s.belly) k.blob(0.4 * B, torsoH * 0.7, 0.3 * B, { at: [ox, torsoCY - 0.03, oz + 0.09 * B], color: s.torso }, 10);
    if (s.torso2) k.torus(0.235 * B, 0.035 * H, { at: [ox, hipY + 0.05 * H, oz], rot: [Math.PI / 2, 0, 0], scale: [1, 0.85, 1], color: s.torso2 }, 14);
    if (s.apron) k.cone(0.29 * B, 0.22 * H, { at: [ox, hipY - 0.02, oz], rot: [Math.PI, 0, 0], scale: [1, 1, 0.85], color: s.apron }, 12);
    if (s.robe) k.cyl(0.2 * B, 0.3 * B, legLen + 0.06, { at: [ox, oy + (legLen + 0.06) / 2, oz], color: s.apron ?? s.torso }, 12);
  }
  if (s.sash) k.box(0.1 * B, torsoH * 1.05, 0.42 * B, { at: [ox, torsoCY, oz], rot: [0, 0, 0.7], color: team.main });
  if (s.scarf) {
    k.torus(0.11 * B + 0.04, 0.045 * H, { at: [ox, neckY - 0.03, oz], rot: [Math.PI / 2, 0, 0], color: team.main }, 12);
    k.box(0.08 * H, 0.18 * H, 0.03, { at: [ox + 0.06, neckY - 0.12, oz - 0.13 * B], rot: [0.3, 0, 0.2], color: team.main });
  }
  if (s.cape) {
    k.box(0.44 * B, torsoH * 1.25 + legLen * 0.6, 0.04, { at: [ox, hipY + torsoH * 0.35, oz - 0.21 * B], rot: [-0.12, 0, 0], color: team.main });
    k.box(0.46 * B, 0.06, 0.08, { at: [ox, neckY - 0.03, oz - 0.18 * B], color: team.dark });
  }

  // ── 手臂
  for (const [bone, sx] of [[armL, 1], [armR, -1]] as const) {
    const ax = ox + sx * shoulderX;
    k.capsule(limbR * 0.95, armLen * 0.6, { at: [ax + sx * 0.02, shoulderY - armLen * 0.45, oz], rot: [0, 0, sx * 0.12], color: s.bones ? s.torso : s.arms ?? s.torso, bone });
    k.sphere(s.bones ? 0.05 * B : 0.085 * B, { at: [ax + sx * 0.04, shoulderY - armLen * 0.95, oz + 0.01], color: s.hands ?? s.skin, bone }, 8);
    if (s.pads) k.sphere((s.bones ? 0.07 : 0.12) * B, { at: [ax + sx * 0.015, shoulderY + 0.01, oz], scale: [1.1, 0.75, 1.05], color: team.main, bone }, 10);
  }
  const handR: V3 = [ox - shoulderX - 0.04, shoulderY - armLen * 0.95, oz + 0.01];
  const handL: V3 = [ox + shoulderX + 0.04, shoulderY - armLen * 0.95, oz + 0.01];
  addWeapon(k, s.weapon ?? 'none', handR, armR, H, team);
  addOffhand(k, s.offhand ?? 'none', handL, armL, H, team);

  // ── 頭
  k.bone = head;
  const hy = neckY + headR * 0.92;
  const face = s.face ?? 'dot';
  if (face === 'skull') {
    k.sphere(headR, { at: [ox, hy, oz], scale: [0.95, 0.9, 0.95], color: s.skin }, 14);
    k.blob(headR * 1.2, headR * 0.55, headR * 1.05, { at: [ox, hy - headR * 0.62, oz + headR * 0.12], color: s.skin }, 10);
  } else {
    k.sphere(headR, { at: [ox, hy, oz], color: s.skin }, 16);
  }
  const fz = oz + headR * 0.86;
  const eyeY = hy + headR * 0.05;
  const eyeX = headR * 0.38;
  const eyeCol = s.eyeColor ?? '#1b1b22';
  if (face === 'skull') {
    for (const sx of [1, -1]) k.sphere(headR * 0.22, { at: [ox + sx * eyeX, eyeY, fz - 0.02], scale: [1, 1.1, 0.6], color: s.eyeColor ?? '#2a1d2e' }, 8);
    k.cone(headR * 0.1, headR * 0.16, { at: [ox, eyeY - headR * 0.3, fz], rot: [Math.PI, 0, 0], color: '#3a2d33' }, 4);
  } else if (face === 'visor') {
    k.box(headR * 1.5, headR * 0.16, 0.05, { at: [ox, eyeY, fz + 0.02], color: '#141418' });
    for (const sx of [1, -1]) k.sphere(headR * 0.08, { at: [ox + sx * eyeX * 0.8, eyeY, fz + 0.045], color: s.eyeColor ?? '#ff4a3a' }, 6);
  } else if (face === 'glow') {
    for (const sx of [1, -1]) k.sphere(headR * 0.14, { at: [ox + sx * eyeX, eyeY, fz], scale: [1.2, 0.8, 0.6], color: s.eyeColor ?? '#ffb347' }, 8);
  } else {
    for (const sx of [1, -1]) {
      const ey = face === 'sleepy' ? eyeY - headR * 0.04 : eyeY;
      k.sphere(headR * 0.16, { at: [ox + sx * eyeX, ey, fz], scale: [0.85, face === 'sleepy' ? 0.3 : 1.2, 0.6], color: eyeCol }, 8);
      if (face !== 'sleepy') k.sphere(headR * 0.055, { at: [ox + sx * eyeX + 0.015, ey + headR * 0.07, fz + headR * 0.08], color: '#ffffff' }, 6);
      if (face === 'angry') k.box(headR * 0.36, headR * 0.08, 0.04, { at: [ox + sx * eyeX, eyeY + headR * 0.22, fz + 0.01], rot: [0, 0, sx * -0.42], color: s.hair?.color ?? '#3a2a1e' });
    }
  }
  // 眉毛與嘴巴：Q 版角色的表情主要靠這兩個（有大鬍子的角色嘴巴被蓋住就不畫）
  if (face === 'dot' || face === 'sleepy') {
    const browCol = s.hair?.color ?? s.beard?.color ?? shade(s.skin, -0.55);
    for (const sx of [1, -1]) {
      k.box(headR * 0.3, headR * 0.07, 0.035, {
        at: [ox + sx * eyeX, eyeY + headR * (face === 'sleepy' ? 0.17 : 0.27), oz + headR * 0.9], rot: [-0.35, 0, sx * (face === 'sleepy' ? 0.28 : -0.12)], color: browCol,
      });
    }
  }
  if (face !== 'skull' && face !== 'visor' && face !== 'glow' && !(s.beard && (s.beard.size ?? 1) >= 0.7)) {
    const my = eyeY - headR * (s.mustache ? 0.5 : 0.44);
    // 嘴巴貼在球面上：臉的下半部球面比眼睛那一圈更靠後，不能直接用 fz
    const mz = oz + headR * 0.95;
    if (face === 'angry') {
      // 咬牙：深色嘴型＋一排白牙
      k.box(headR * 0.42, headR * 0.15, 0.03, { at: [ox, my, mz], color: '#3a1a1a' });
      k.box(headR * 0.36, headR * 0.06, 0.035, { at: [ox, my + headR * 0.025, mz + 0.004], color: '#f4f1e8' });
    } else if (face === 'sleepy') {
      k.sphere(headR * 0.08, { at: [ox, my, mz], scale: [1, 0.8, 0.5], color: '#5a2a2a' }, 6);
    } else {
      // 微笑：半圓弧
      k.torus(headR * 0.15, headR * 0.035, { at: [ox, my + headR * 0.07, mz], rot: [0, 0, Math.PI], color: '#5a2a2a' }, 8, Math.PI);
    }
  }
  const nose = s.nose ?? 'ball';
  if (face !== 'skull' && face !== 'visor') {
    if (nose === 'ball') k.sphere(headR * 0.15, { at: [ox, eyeY - headR * 0.2, fz + headR * 0.08], color: shade(s.skin, -0.12) }, 8);
    if (nose === 'long') k.cone(headR * 0.13, headR * 0.5, { at: [ox, eyeY - headR * 0.18, fz + headR * 0.2], rot: [Math.PI / 2, 0, 0], color: shade(s.skin, -0.1) }, 8);
  }
  if (s.ears === 'pointy') {
    for (const sx of [1, -1]) k.cone(headR * 0.22, headR * 0.75, { at: [ox + sx * headR * 1.0, hy + headR * 0.12, oz], rot: [0, 0, -sx * 1.25], color: s.skin }, 6);
  } else if (s.ears === 'round') {
    for (const sx of [1, -1]) k.sphere(headR * 0.18, { at: [ox + sx * headR * 0.97, hy, oz], scale: [0.5, 1, 0.8], color: s.skin }, 6);
  }
  if (s.beard) {
    const bs = s.beard.size ?? 1;
    k.blob(headR * 1.25 * bs, headR * 0.95 * bs, headR * 0.8, { at: [ox, hy - headR * 0.55, oz + headR * 0.45], color: s.beard.color }, 10);
  }
  if (s.mustache) {
    for (const sx of [1, -1]) k.capsule(headR * 0.1, headR * 0.28, { at: [ox + sx * headR * 0.2, eyeY - headR * 0.36, fz + 0.01], rot: [0, 0, sx * 1.2], color: s.mustache }, 6);
  }
  if (s.hair) addHair(k, s.hair, ox, hy, oz, headR);
  addHat(k, s.hat ?? 'none', s, ox, hy, oz, headR, team);
  return { hips, spine, head, armL, armR, legL, legR };
}

function addHair(k: Kit, hair: NonNullable<HumanoidSpec['hair']>, ox: number, hy: number, oz: number, r: number): void {
  const c = hair.color;
  switch (hair.style) {
    case 'tuft':
      k.cone(r * 0.25, r * 0.5, { at: [ox, hy + r * 1.05, oz], rot: [0.3, 0, 0], color: c }, 6);
      break;
    case 'bob':
      k.sphere(r * 1.06, { at: [ox, hy + r * 0.12, oz - r * 0.12], scale: [1, 0.92, 0.95], color: c }, 12);
      break;
    case 'long':
      k.sphere(r * 1.06, { at: [ox, hy + r * 0.12, oz - r * 0.14], scale: [1, 0.95, 0.95], color: c }, 12);
      k.blob(r * 1.7, r * 1.4, r * 0.6, { at: [ox, hy - r * 0.55, oz - r * 0.62], color: c }, 10);
      break;
    case 'mohawk':
      k.box(r * 0.22, r * 0.55, r * 1.3, { at: [ox, hy + r * 1.0, oz - r * 0.1], color: c });
      break;
    case 'braids':
      k.sphere(r * 1.05, { at: [ox, hy + r * 0.15, oz - r * 0.12], scale: [1, 0.9, 0.95], color: c }, 12);
      for (const sx of [1, -1]) k.capsule(r * 0.16, r * 0.8, { at: [ox + sx * r * 0.85, hy - r * 0.55, oz - r * 0.05], color: c }, 6);
      break;
  }
}

function addHat(k: Kit, hat: Hat, s: HumanoidSpec, ox: number, hy: number, oz: number, r: number, team: { main: string; dark: string; light: string }): void {
  const c = s.hatColor ?? '#9aa3ad';
  const c2 = s.hatColor2 ?? team.main;
  switch (hat) {
    case 'helmet':
    case 'crest':
      // 開面頭盔：只包住頭頂與後腦，臉露出來
      k.shell(r * 1.1, { at: [ox, hy + r * 0.05, oz - r * 0.05], rot: [-0.55, 0, 0], color: c }, Math.PI * 0.56);
      k.torus(r * 0.93, r * 0.09, { at: [ox, hy + r * 0.62, oz + r * 0.35], rot: [Math.PI / 2 - 0.55, 0, 0], color: shade(c, -0.15) }, 16);
      if (s.plume || hat === 'crest') k.blob(r * 0.3, r * 0.75, r * 1.3, { at: [ox, hy + r * 1.12, oz - r * 0.25], rot: [0.35, 0, 0], color: c2 }, 8);
      break;
    case 'horned':
      k.shell(r * 1.09, { at: [ox, hy + r * 0.08, oz - r * 0.05], rot: [-0.5, 0, 0], color: c }, Math.PI * 0.52);
      k.torus(r * 0.9, r * 0.08, { at: [ox, hy + r * 0.66, oz + r * 0.32], rot: [Math.PI / 2 - 0.5, 0, 0], color: c2 }, 16);
      for (const sx of [1, -1]) k.cone(r * 0.2, r * 0.75, { at: [ox + sx * r * 0.95, hy + r * 0.62, oz - r * 0.1], rot: [0, 0, -sx * 0.9], color: '#efe3c2' }, 8);
      break;
    case 'winged':
      k.shell(r * 1.09, { at: [ox, hy + r * 0.08, oz - r * 0.05], rot: [-0.5, 0, 0], color: c }, Math.PI * 0.52);
      for (const sx of [1, -1]) k.blob(r * 0.15, r * 0.7, r * 0.55, { at: [ox + sx * r * 0.95, hy + r * 0.6, oz - r * 0.15], rot: [0, 0, -sx * 0.5], color: '#f4f1e8' }, 8);
      k.box(r * 0.55, r * 0.13, r * 0.13, { at: [ox, hy + r * 0.72, oz + r * 0.55], rot: [-0.5, 0, 0], color: c2 });
      break;
    case 'iron':
      // 全罩鐵盔：高聳的隊伍色盔冠、兩側護頰
      k.sphere(r * 1.12, { at: [ox, hy + r * 0.05, oz], scale: [1, 1.05, 1], color: c }, 14);
      k.blob(r * 0.22, r * 0.9, r * 1.7, { at: [ox, hy + r * 1.05, oz - r * 0.15], color: c2 }, 8);
      for (const sx of [1, -1]) k.blob(r * 0.25, r * 0.85, r * 0.8, { at: [ox + sx * r * 0.95, hy - r * 0.25, oz + r * 0.2], color: shade(c, -0.2) }, 8);
      break;
    case 'wizard':
    case 'witch': {
      const bend = hat === 'witch' ? -0.55 : -0.3;
      k.cyl(r * 1.18, r * 1.22, r * 0.1, { at: [ox, hy + r * 0.72, oz - r * 0.1], rot: [-0.3, 0, 0], color: c }, 16);
      k.cone(r * 0.78, r * 1.6, { at: [ox, hy + r * 1.45, oz - r * 0.45], rot: [bend, 0, 0], color: c }, 12);
      k.torus(r * 0.78, r * 0.09, { at: [ox, hy + r * 0.8, oz - r * 0.12], rot: [Math.PI / 2 - 0.3, 0, 0], color: c2 }, 14);
      break;
    }
    case 'hood':
      // 兜帽：正面開口
      k.shell(r * 1.16, { at: [ox, hy + r * 0.04, oz - r * 0.08], color: c }, Math.PI * 0.82, Math.PI / 2 + 0.85, Math.PI * 2 - 1.7);
      k.cone(r * 0.45, r * 0.8, { at: [ox, hy + r * 0.55, oz - r * 1.0], rot: [-1.25, 0, 0], color: c }, 8);
      break;
    case 'cap':
      k.cyl(r * 0.98, r * 0.98, r * 0.1, { at: [ox, hy + r * 0.7, oz - r * 0.05], rot: [-0.25, 0, 0.15], color: c }, 14);
      k.sphere(r * 0.75, { at: [ox, hy + r * 0.8, oz - r * 0.1], scale: [1, 0.5, 1], color: c }, 10);
      k.blob(r * 0.25, r * 0.25, r * 1.6, { at: [ox - r * 0.6, hy + r * 1.0, oz - r * 0.45], rot: [0.9, 0.3, 0], color: c2 }, 8);
      break;
    case 'band':
    case 'bandana':
      k.torus(r * 0.98, r * 0.12, { at: [ox, hy + r * 0.38, oz], rot: [Math.PI / 2 - 0.15, 0, 0], color: c2 }, 16);
      if (hat === 'bandana') k.blob(r * 0.3, r * 0.15, r * 0.6, { at: [ox + r * 0.4, hy + r * 0.3, oz - r * 1.05], rot: [0.5, 0, 0.4], color: c2 }, 6);
      break;
    case 'skull':
      k.shell(r * 1.06, { at: [ox, hy + r * 0.08, oz - r * 0.05], rot: [-0.45, 0, 0], color: c }, Math.PI * 0.45);
      break;
    case 'royal':
      // 原創的王族軟帽：白色毛皮帽緣、隊伍色天鵝絨帽頂、金色細環與寶石（不是尖齒王冠）
      k.torus(r * 0.98, r * 0.17, { at: [ox, hy + r * 0.62, oz - r * 0.05], rot: [Math.PI / 2 - 0.2, 0, 0], color: '#f4f1e8' }, 16);
      k.sphere(r * 0.92, { at: [ox, hy + r * 1.02, oz - r * 0.12], scale: [1, 0.72, 1], color: c2 }, 14);
      k.torus(r * 0.86, r * 0.05, { at: [ox, hy + r * 0.82, oz - r * 0.08], rot: [Math.PI / 2 - 0.2, 0, 0], color: '#f2b233' }, 16);
      k.sphere(r * 0.17, { at: [ox, hy + r * 1.55, oz - r * 0.2], color: '#f2b233' }, 8);
      k.gem(r * 0.15, { at: [ox, hy + r * 0.78, oz + r * 0.86], color: '#7fd6ff' });
      break;
    case 'goggles':
      k.torus(r * 0.98, r * 0.09, { at: [ox, hy + r * 0.32, oz], rot: [Math.PI / 2 - 0.2, 0, 0], color: '#4a3a2a' }, 16);
      for (const sx of [1, -1]) k.cyl(r * 0.22, r * 0.22, r * 0.18, { at: [ox + sx * r * 0.32, hy + r * 0.45, oz + r * 0.85], rot: [Math.PI / 2 - 0.3, 0, 0], color: '#c9a24a' }, 10);
      break;
    default:
      break;
  }
}

function addWeapon(k: Kit, w: Weapon, h: V3, armR: number, H: number, team: { main: string; dark: string; light: string }): void {
  const [x, y, z] = h;
  const steel = '#dfe5ec';
  const wood = '#8a5a2e';
  const gold = '#f2b233';
  switch (w) {
    case 'sword':
      k.box(0.07 * H, 0.5 * H, 0.025 * H, { at: [x, y + 0.27 * H, z + 0.04], color: steel, bone: armR });
      k.box(0.2 * H, 0.04 * H, 0.05 * H, { at: [x, y + 0.03 * H, z + 0.04], color: gold, bone: armR });
      k.cyl(0.025 * H, 0.025 * H, 0.1 * H, { at: [x, y - 0.04 * H, z + 0.04], color: wood, bone: armR }, 6);
      break;
    case 'greatsword':
      k.box(0.13 * H, 0.82 * H, 0.04 * H, { at: [x, y + 0.45 * H, z + 0.06], color: '#c9d1dc', bone: armR });
      k.box(0.05 * H, 0.7 * H, 0.045 * H, { at: [x, y + 0.45 * H, z + 0.065], color: team.light, bone: armR });
      k.box(0.32 * H, 0.06 * H, 0.08 * H, { at: [x, y + 0.03 * H, z + 0.06], color: '#3a3f4a', bone: armR });
      k.cyl(0.03 * H, 0.03 * H, 0.16 * H, { at: [x, y - 0.06 * H, z + 0.06], color: '#2a2d33', bone: armR }, 6);
      break;
    case 'axe2':
      k.cyl(0.03 * H, 0.03 * H, 0.9 * H, { at: [x, y + 0.25 * H, z + 0.05], color: wood, bone: armR }, 6);
      // 雙刃巨斧：兩片半月形斧刃＋中間的金屬套環
      for (const sx of [1, -1]) {
        k.add(new CylinderGeometry(0.24 * H, 0.24 * H, 0.035 * H, 14, 1, false, sx > 0 ? 0 : Math.PI, Math.PI), {
          at: [x + sx * 0.03 * H, y + 0.6 * H, z + 0.05], rot: [0, 0, Math.PI / 2], scale: [1, 1, 1.15], color: steel, bone: armR,
        });
      }
      k.cyl(0.06 * H, 0.06 * H, 0.14 * H, { at: [x, y + 0.6 * H, z + 0.05], color: '#8a6a3a', bone: armR }, 8);
      break;
    case 'club':
      k.cyl(0.07 * H, 0.035 * H, 0.45 * H, { at: [x, y + 0.2 * H, z + 0.05], color: wood, bone: armR }, 7);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        k.cone(0.025 * H, 0.06 * H, { at: [x + Math.cos(a) * 0.07 * H, y + 0.36 * H, z + 0.05 + Math.sin(a) * 0.07 * H], rot: [Math.sin(a) * 1.4, 0, -Math.cos(a) * 1.4], color: '#d9d2c0', bone: armR }, 4);
      }
      break;
    case 'cleaver':
      k.box(0.18 * H, 0.32 * H, 0.025 * H, { at: [x - 0.05 * H, y + 0.24 * H, z + 0.05], color: steel, bone: armR });
      k.cyl(0.03 * H, 0.03 * H, 0.14 * H, { at: [x, y + 0.02 * H, z + 0.05], color: wood, bone: armR }, 6);
      break;
    case 'spear':
      k.cyl(0.022 * H, 0.022 * H, 0.95 * H, { at: [x, y + 0.2 * H, z + 0.04], color: wood, bone: armR }, 6);
      k.cone(0.05 * H, 0.16 * H, { at: [x, y + 0.75 * H, z + 0.04], color: steel, bone: armR }, 6);
      break;
    case 'lance':
      k.cone(0.08 * H, 1.25 * H, { at: [x, y + 0.1 * H, z + 0.62 * H], rot: [Math.PI / 2, 0, 0], color: '#d9d2c0', bone: armR }, 10);
      k.cone(0.13 * H, 0.18 * H, { at: [x, y + 0.1 * H, z + 0.02], rot: [-Math.PI / 2, 0, 0], color: team.main, bone: armR }, 10);
      break;
    case 'musket':
      k.cyl(0.03 * H, 0.03 * H, 0.75 * H, { at: [x + 0.08 * H, y + 0.08 * H, z + 0.3 * H], rot: [Math.PI / 2, 0, 0], color: '#2c2f36', bone: armR }, 8);
      k.box(0.07 * H, 0.1 * H, 0.32 * H, { at: [x + 0.08 * H, y + 0.04 * H, z - 0.02 * H], color: wood, bone: armR });
      break;
    case 'crossbow':
      k.box(0.06 * H, 0.06 * H, 0.42 * H, { at: [x, y + 0.04 * H, z + 0.16 * H], color: wood, bone: armR });
      k.torus(0.2 * H, 0.02 * H, { at: [x, y + 0.04 * H, z + 0.3 * H], rot: [Math.PI / 2, 0, 0], color: '#5a3a1e', bone: armR }, 10, Math.PI);
      break;
    case 'staff':
    case 'skullstaff':
      k.cyl(0.025 * H, 0.03 * H, 1.0 * H, { at: [x, y + 0.25 * H, z + 0.04], color: '#6b4426', bone: armR }, 6);
      if (w === 'staff') {
        k.sphere(0.1 * H, { at: [x, y + 0.8 * H, z + 0.04], color: '#ffb347', bone: armR }, 10);
        k.torus(0.1 * H, 0.025 * H, { at: [x, y + 0.75 * H, z + 0.04], rot: [Math.PI / 2, 0, 0], color: gold, bone: armR }, 10);
      } else {
        k.sphere(0.11 * H, { at: [x, y + 0.82 * H, z + 0.04], scale: [1, 1.05, 1], color: '#efe8d8', bone: armR }, 10);
        for (const sx of [1, -1]) k.sphere(0.03 * H, { at: [x + sx * 0.04 * H, y + 0.83 * H, z + 0.13 * H], color: '#7dff8a', bone: armR }, 6);
      }
      break;
    case 'bomb':
      k.sphere(0.14 * H, { at: [x, y + 0.08 * H, z + 0.08], color: '#2a2c33', bone: armR }, 10);
      k.cyl(0.02 * H, 0.02 * H, 0.08 * H, { at: [x, y + 0.24 * H, z + 0.08], color: '#c9a24a', bone: armR }, 5);
      k.sphere(0.035 * H, { at: [x, y + 0.29 * H, z + 0.08], color: '#ffd36b', bone: armR }, 6);
      break;
    case 'scepter':
      k.cyl(0.028 * H, 0.028 * H, 0.62 * H, { at: [x, y + 0.24 * H, z + 0.05], color: gold, bone: armR }, 6);
      k.sphere(0.085 * H, { at: [x, y + 0.6 * H, z + 0.05], color: gold, bone: armR }, 10);
      k.gem(0.07 * H, { at: [x, y + 0.71 * H, z + 0.05], color: team.light, bone: armR });
      k.torus(0.07 * H, 0.018 * H, { at: [x, y + 0.5 * H, z + 0.05], rot: [Math.PI / 2, 0, 0], color: gold, bone: armR }, 10);
      break;
    case 'mace':
      k.cyl(0.03 * H, 0.03 * H, 0.42 * H, { at: [x, y + 0.18 * H, z + 0.05], color: wood, bone: armR }, 6);
      k.sphere(0.1 * H, { at: [x, y + 0.42 * H, z + 0.05], color: '#5d636e', bone: armR }, 8);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        k.cone(0.025 * H, 0.08 * H, { at: [x + Math.cos(a) * 0.1 * H, y + 0.42 * H, z + 0.05 + Math.sin(a) * 0.1 * H], rot: [Math.sin(a) * 1.57, 0, -Math.cos(a) * 1.57], color: '#c9ced6', bone: armR }, 4);
      }
      break;
    default:
      break;
  }
}

function addOffhand(k: Kit, o: NonNullable<HumanoidSpec['offhand']>, h: V3, armL: number, H: number, team: { main: string; dark: string; light: string }): void {
  const [x, y, z] = h;
  switch (o) {
    case 'shield':
      k.cyl(0.24 * H, 0.24 * H, 0.05 * H, { at: [x + 0.06 * H, y + 0.1 * H, z + 0.07 * H], rot: [0, 0, Math.PI / 2], color: team.main, bone: armL }, 14);
      k.torus(0.24 * H, 0.03 * H, { at: [x + 0.09 * H, y + 0.1 * H, z + 0.07 * H], rot: [0, Math.PI / 2, 0], color: '#cfd5dc', bone: armL }, 16);
      k.sphere(0.06 * H, { at: [x + 0.1 * H, y + 0.1 * H, z + 0.07 * H], color: '#f2b233', bone: armL }, 8);
      break;
    case 'buckler':
      k.cyl(0.15 * H, 0.15 * H, 0.04 * H, { at: [x + 0.05 * H, y + 0.06 * H, z + 0.04], rot: [0, 0, Math.PI / 2], color: '#7a5230', bone: armL }, 10);
      k.sphere(0.04 * H, { at: [x + 0.08 * H, y + 0.06 * H, z + 0.04], color: team.main, bone: armL }, 6);
      break;
    case 'bow':
      k.torus(0.32 * H, 0.025 * H, { at: [x + 0.03, y + 0.05 * H, z + 0.1 * H], rot: [0, Math.PI / 2, 0], color: '#8b5a2b', bone: armL }, 12, Math.PI);
      k.cyl(0.006, 0.006, 0.64 * H, { at: [x + 0.03, y + 0.05 * H, z + 0.1 * H], color: '#f1e7d0', bone: armL }, 3);
      break;
    case 'lantern':
      k.box(0.12 * H, 0.16 * H, 0.12 * H, { at: [x, y - 0.06 * H, z + 0.04], color: '#ffd36b', bone: armL });
      break;
    default:
      break;
  }
}

/** 調亮（amt>0）或調暗（amt<0）hex 色。 */
export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt))));
  r = f(r);
  g = f(g);
  b = f(b);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/** 單獨一個人形單位的模型。 */
export function buildHumanoid(spec: HumanoidSpec, team: { main: string; dark: string; light: string }): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  addHumanoid(k, spec, team, root);
  return k.build(spec.height);
}
