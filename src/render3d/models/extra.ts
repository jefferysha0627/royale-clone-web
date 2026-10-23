import { Kit, type ModelAsset } from '../kit';
import { addHumanoid, shade, type HumanoidSpec } from './humanoid';

// v3 第二批單位的原創模型：重甲石像鬼、攻城衝車（兩名扛槌手＋金屬羊頭撞槌）、火靈小屋、炸彈砲塔。

type TeamPal = { main: string; dark: string; light: string };

const STONE = '#b9b4aa';
const STONE_D = '#8f8a80';
const STONE_L = '#d6d1c6';
const WOOD = '#8a5a2e';
const WOOD_D = '#5a3a1e';
const IRON = '#5d636e';

function wing(k: Kit, sx: number, bone: number, span: number, at: [number, number, number], color: string, membrane: string): void {
  k.capsule(0.04, span * 0.8, { at: [at[0] + sx * span * 0.45, at[1] + 0.06, at[2]], rot: [0, 0, sx * 1.35], color, bone }, 5);
  k.blob(span, 0.06, span * 0.62, { at: [at[0] + sx * span * 0.5, at[1], at[2] - span * 0.12], rot: [0, sx * 0.25, 0], color: membrane, bone }, 8);
  // 翼尖的爪
  k.cone(0.035, 0.12, { at: [at[0] + sx * span * 0.92, at[1] + 0.14, at[2]], rot: [0, 0, -sx * 0.4], color: '#d8d0bc', bone }, 4);
}

/** 重甲石像鬼：比石像鬼大一號、深色岩身，戴金屬頭盔、胸甲與隊伍色肩甲，眼睛發橘光。 */
export function buildHeavyGargoyle(team: TeamPal): ModelAsset {
  const S = 1.22;
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const body = k.addBone('body', root, [0, 0.35 * S, 0]);
  const head = k.addBone('head', body, [0, 0.64 * S, 0.04 * S]);
  const wingL = k.addBone('wingL', body, [0.17 * S, 0.56 * S, -0.08 * S]);
  const wingR = k.addBone('wingR', body, [-0.17 * S, 0.56 * S, -0.08 * S]);
  const armL = k.addBone('armL', body, [0.22 * S, 0.5 * S, 0.05 * S]);
  const armR = k.addBone('armR', body, [-0.22 * S, 0.5 * S, 0.05 * S]);
  const stone = '#5f6776';
  const stoneD = '#454c59';
  const metal = '#9aa3b0';
  k.bone = body;
  k.blob(0.42 * S, 0.46 * S, 0.36 * S, { at: [0, 0.42 * S, 0], color: stone }, 12);
  k.blob(0.28 * S, 0.22 * S, 0.26 * S, { at: [0, 0.2 * S, 0.02 * S], color: stoneD }, 8);
  // 胸甲（金屬）＋隊伍色腰帶
  k.blob(0.34 * S, 0.3 * S, 0.12 * S, { at: [0, 0.48 * S, 0.14 * S], color: metal, shine: 0.85 }, 10);
  k.torus(0.17 * S, 0.035 * S, { at: [0, 0.3 * S, 0.02 * S], rot: [Math.PI / 2, 0, 0], color: team.main }, 12);
  k.cone(0.06 * S, 0.34 * S, { at: [0, 0.18 * S, -0.24 * S], rot: [-2.2, 0, 0], color: stoneD }, 5);
  for (const [bone, sx] of [[armL, 1], [armR, -1]] as const) {
    k.capsule(0.06 * S, 0.16 * S, { at: [sx * 0.27 * S, 0.4 * S, 0.08 * S], rot: [0.5, 0, sx * 0.3], color: stone, bone }, 6);
    k.sphere(0.075 * S, { at: [sx * 0.3 * S, 0.29 * S, 0.16 * S], color: stoneD, bone }, 6);
    // 隊伍色肩甲
    k.sphere(0.1 * S, { at: [sx * 0.24 * S, 0.56 * S, 0.02 * S], scale: [1.1, 0.7, 1], color: team.main, bone, shine: 0.45 }, 8);
  }
  k.bone = head;
  k.sphere(0.2 * S, { at: [0, 0.78 * S, 0.06 * S], color: stone }, 12);
  k.blob(0.21 * S, 0.12 * S, 0.17 * S, { at: [0, 0.7 * S, 0.21 * S], color: stoneD }, 8);
  // 開面頭盔與盔冠
  k.shell(0.215 * S, { at: [0, 0.8 * S, 0.04 * S], rot: [-0.5, 0, 0], color: metal, shine: 0.85 }, Math.PI * 0.5);
  k.box(0.04 * S, 0.12 * S, 0.3 * S, { at: [0, 1.0 * S, 0.0], color: team.main });
  for (const sx of [1, -1]) {
    k.cone(0.055 * S, 0.24 * S, { at: [sx * 0.15 * S, 0.94 * S, -0.02 * S], rot: [-0.3, 0, -sx * 0.7], color: '#d8d0bc' }, 5);
    k.sphere(0.045 * S, { at: [sx * 0.08 * S, 0.8 * S, 0.24 * S], scale: [1.3, 0.7, 0.6], color: '#ffb347' }, 6);
  }
  wing(k, 1, wingL, 0.58 * S, [0.17 * S, 0.56 * S, -0.08 * S], stoneD, '#7a8292');
  wing(k, -1, wingR, 0.58 * S, [-0.17 * S, 0.56 * S, -0.08 * S], stoneD, '#7a8292');
  return k.build(1.15);
}

/** 扛撞槌的蠻族壯漢（衝車的兩名扛手）。 */
const carrier = (t: TeamPal): HumanoidSpec => ({
  height: 0.98, build: 1.15, skin: '#e8b07a', face: 'angry', beard: { color: '#8a4a2a', size: 0.85 }, hair: { style: 'tuft', color: '#8a4a2a' },
  hat: 'band', hatColor2: t.main, torso: '#7a5230', torso2: '#3a2a1e', arms: '#e8b07a', legs: '#6b5a40', boots: '#4a3a2a', bracers: '#5a3a1e',
});

/**
 * 攻城衝車：一根大圓木（前端包金屬、做成捲角羊頭），左右各一名扛手。
 * 骨架沿用坐騎的四條腿：左邊扛手的雙腳＝legFL／legBL、右邊扛手＝legFR／legBR（相位剛好一前一後）。
 */
export function buildSiegeRam(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const body = k.addBone('body', root, [0, 0.42, 0]);
  k.addBone('mhead', body, [0, 0.42, 0.75]);
  k.addBone('tail', body, [0, 0.42, -0.75]);
  const logY = 0.4;
  k.bone = body;
  // 圓木與樹皮環、兩道繩綁
  k.cyl(0.17, 0.19, 1.45, { at: [0, logY, -0.05], rot: [Math.PI / 2, 0, 0], color: '#7a5230' }, 12);
  for (const z of [-0.55, -0.15, 0.3]) k.torus(0.185, 0.02, { at: [0, logY, z], color: '#5e3e22' }, 14);
  for (const z of [-0.38, 0.12]) k.torus(0.2, 0.03, { at: [0, logY, z], color: '#3a2a1e' }, 14);
  k.cyl(0.19, 0.17, 0.06, { at: [0, logY, -0.79], rot: [Math.PI / 2, 0, 0], color: '#c9a070' }, 12);
  // 前端：金屬包頭＋捲角羊頭（銅）＋隊伍色布條
  k.cyl(0.22, 0.2, 0.26, { at: [0, logY, 0.72], rot: [Math.PI / 2, 0, 0], color: IRON, shine: 0.8 }, 12);
  k.sphere(0.2, { at: [0, logY + 0.02, 0.88], scale: [1, 0.95, 0.85], color: '#7d8794', shine: 0.85 }, 12);
  k.cone(0.09, 0.14, { at: [0, logY - 0.02, 1.02], rot: [Math.PI / 2, 0, 0], color: '#7d8794', shine: 0.85 }, 8);
  for (const sx of [1, -1]) {
    k.torus(0.1, 0.035, { at: [sx * 0.19, logY + 0.08, 0.82], rot: [0, Math.PI / 2, 0], color: '#b87333', shine: 0.85 }, 12, Math.PI * 1.5);
    k.sphere(0.03, { at: [sx * 0.09, logY + 0.08, 1.02], color: '#ffd36b', shine: 1 }, 6);
  }
  k.torus(0.23, 0.04, { at: [0, logY, 0.58], color: team.main }, 14);
  // 兩名扛手：左前、右後
  const crew: [number, number, string, string][] = [[0.48, 0.22, 'legFL', 'legBL'], [-0.48, -0.32, 'legFR', 'legBR']];
  crew.forEach(([x, z, legA, legB], i) => {
    const first = k.bones.length;
    addHumanoid(k, carrier(team), team, body, [x, 0, z]);
    // 改名：腿交給坐騎步態；其他骨頭加上編號避免兩人重名
    for (let b = first; b < k.bones.length; b++) {
      const n = k.bones[b].name;
      k.bones[b].name = n === 'legL' ? legA : n === 'legR' ? legB : `${n}${i + 1}`;
    }
  });
  return k.build(1.05);
}

/** 火靈小屋：石砌圓屋、隊伍色尖頂、門裡透出火光，煙囪冒火（火精靈從這裡出來）。 */
export function buildSpiritHut(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const flame = k.addBone('crystal', root, [0.36, 1.78, -0.22]);
  k.bone = root;
  k.cyl(0.86, 0.95, 0.22, { at: [0, 0.11, 0], color: STONE_D }, 12);
  k.cyl(0.7, 0.78, 0.78, { at: [0, 0.6, 0], color: STONE }, 12);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    k.box(0.26, 0.12, 0.06, { at: [Math.cos(a) * 0.74, 0.36 + (i % 2) * 0.28, Math.sin(a) * 0.74], rot: [0, -a + Math.PI / 2, 0], color: i % 3 ? STONE_L : STONE_D });
  }
  k.cyl(0.78, 0.78, 0.08, { at: [0, 1.02, 0], color: WOOD_D }, 12);
  k.cone(0.84, 0.66, { at: [0, 1.38, 0], color: team.main }, 12);
  k.cone(0.42, 0.32, { at: [0, 1.62, 0], color: shade(team.main, 0.18) }, 12);
  k.torus(0.8, 0.04, { at: [0, 1.06, 0], rot: [Math.PI / 2, 0, 0], color: '#d9b04a', shine: 0.8 }, 16);
  // 門洞與裡面的火光
  k.box(0.44, 0.52, 0.08, { at: [0, 0.48, 0.74], color: '#2a1a12' });
  k.cyl(0.22, 0.22, 0.08, { at: [0, 0.74, 0.74], rot: [Math.PI / 2, 0, 0], color: '#2a1a12' }, 12);
  k.box(0.32, 0.4, 0.04, { at: [0, 0.46, 0.77], color: '#ff8a2a' });
  k.sphere(0.13, { at: [0, 0.5, 0.79], scale: [1, 1.2, 0.5], color: '#ffd36b' }, 8);
  k.box(0.5, 0.06, 0.14, { at: [0, 0.2, 0.8], color: STONE_L });
  // 煙囪
  k.box(0.26, 0.55, 0.26, { at: [0.36, 1.48, -0.22], color: STONE_D });
  k.box(0.32, 0.06, 0.32, { at: [0.36, 1.77, -0.22], color: STONE_L });
  k.bone = flame;
  k.cone(0.15, 0.42, { at: [0.36, 1.98, -0.22], color: '#ff9a3a' }, 7);
  k.cone(0.08, 0.26, { at: [0.36, 1.95, -0.15], color: '#ffe68a' }, 6);
  return k.build(1.9);
}

/** 炸彈砲塔：城垛石塔上一門朝前上方的短臼砲，旁邊堆著備用炸彈。 */
export function buildBombTurret(team: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const turret = k.addBone('turret', root, [0, 1.05, 0]);
  const barrel = k.addBone('barrel', turret, [0, 1.3, 0.05]);
  k.bone = root;
  k.cyl(0.86, 0.95, 0.24, { at: [0, 0.12, 0], color: STONE_D }, 10);
  k.cyl(0.7, 0.8, 0.78, { at: [0, 0.63, 0], color: STONE }, 10);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    k.box(0.24, 0.2, 0.18, { at: [Math.cos(a) * 0.72, 1.1, Math.sin(a) * 0.72], rot: [0, -a + Math.PI / 2, 0], color: STONE_L });
  }
  k.torus(0.76, 0.05, { at: [0, 0.86, 0], rot: [Math.PI / 2, 0, 0], color: team.main }, 16);
  for (const [x, z] of [[0.42, -0.42], [0.55, -0.22], [0.3, -0.56]] as const) k.sphere(0.12, { at: [x, 1.12, z], color: '#2a2c33', shine: 0.5 }, 8);
  k.bone = turret;
  k.cyl(0.44, 0.5, 0.16, { at: [0, 1.06, 0], color: WOOD_D }, 12);
  k.box(0.56, 0.24, 0.46, { at: [0, 1.24, -0.06], color: WOOD });
  for (const sx of [1, -1]) k.cyl(0.13, 0.13, 0.06, { at: [sx * 0.3, 1.22, 0.02], rot: [0, 0, Math.PI / 2], color: '#3a2a1e' }, 10);
  k.bone = barrel;
  // 短而粗的臼砲朝前上方（Rx 0.75）＋銅砲口環
  k.cyl(0.21, 0.26, 0.56, { at: [0, 1.48, 0.17], rot: [0.75, 0, 0], color: '#3a3d44', shine: 0.65 }, 12);
  k.torus(0.22, 0.045, { at: [0, 1.68, 0.36], rot: [-0.82, 0, 0], color: '#b87333', shine: 0.85 }, 12);
  k.sphere(0.24, { at: [0, 1.32, 0.0], color: '#33363c', shine: 0.6 }, 10);
  return k.build(1.75);
}
