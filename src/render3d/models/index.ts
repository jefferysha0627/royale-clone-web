import { TEAM_RGB } from '../coords';
import { Kit, type ModelAsset } from '../kit';
import { buildCannon, buildInferno, buildKingTower, buildPrincessTower, buildRubble, buildTombstone } from './buildings';
import { buildBabyDragon, buildBat, buildBlimp, buildGargoyle, buildGolem, buildLancer, buildSpirit, buildWolfRider } from './creatures';
import { addHumanoid, buildHumanoid, type HumanoidSpec } from './humanoid';

export type Rig = 'biped' | 'mount' | 'flyer' | 'blob' | 'blimp' | 'cannon' | 'inferno' | 'tomb' | 'princess' | 'king' | 'static';
export type AttackStyle =
  | 'swing' | 'chop' | 'stab' | 'punch' | 'slam' | 'spin' | 'shoot' | 'bow' | 'cast' | 'throw' | 'bite' | 'spit' | 'breath' | 'drop' | 'fire' | 'beam' | 'hop' | 'none';

export interface AnimProfile {
  rig: Rig;
  attack: AttackStyle;
  stride?: number; // 走路擺幅倍率
  cadence?: number; // 步頻倍率
  hover?: number; // 畫面上的飛行高度（格）
  scale?: number;
}

type TeamPal = { main: string; dark: string; light: string };

const SKIN = '#f2c9a0';
const GOBLIN = '#7cbf4a';
const BONE = '#efe8d8';

// 人形單位的原創外觀設定
const HUMANOIDS: Record<string, (t: TeamPal) => HumanoidSpec> = {
  knight: () => ({
    height: 1.3, build: 1.1, skin: SKIN, face: 'dot', hat: 'helmet', hatColor: '#c9d1dc', plume: true, torso: '#9aa6b5', torso2: '#6b4426', legs: '#5a5f6b',
    boots: '#3a3f4a', arms: '#9aa6b5', hands: '#c9d1dc', pads: true, cape: true, weapon: 'sword', offhand: 'shield',
  }),
  archer: () => ({
    height: 1.1, skin: SKIN, face: 'dot', hair: { style: 'bob', color: '#d9894a' }, hat: 'hood', hatColor: '#3f7a4a', torso: '#4f8a5a', torso2: '#7a5230',
    legs: '#5a4a3a', boots: '#4a3a2a', sash: true, offhand: 'bow',
  }),
  giant: (t) => ({
    height: 2.15, build: 1.3, headScale: 0.62, torsoScale: 1.3, legScale: 1.15, skin: '#e0a878', face: 'angry', nose: 'ball', ears: 'round',
    beard: { color: '#3a2a1e', size: 1.1 }, hair: { style: 'tuft', color: '#3a2a1e' }, torso: '#8a6a4a', torso2: t.main, legs: '#6b5a40', boots: '#4a3a2a',
    arms: '#e0a878', hands: '#e0a878', belly: true,
  }),
  goblin: () => ({
    height: 0.85, skin: GOBLIN, ears: 'pointy', nose: 'long', face: 'angry', torso: '#8a6a3a', torso2: '#5a3a1e', legs: '#5a4a2a', boots: '#3a2a1e',
    hat: 'band', weapon: 'cleaver',
  }),
  spear_goblin: () => ({
    height: 0.85, skin: GOBLIN, ears: 'pointy', nose: 'long', face: 'dot', torso: '#6e5a3a', torso2: '#3a2a1e', legs: '#5a4a2a', boots: '#3a2a1e',
    hat: 'bandana', weapon: 'spear',
  }),
  skeleton: () => ({
    height: 0.95, skin: BONE, face: 'skull', bones: true, torso: '#e6dfcc', legs: '#e6dfcc', boots: '#d9d2c0', hands: BONE, pads: true, weapon: 'sword',
  }),
  musketeer: () => ({
    height: 1.2, skin: SKIN, face: 'dot', mustache: '#5a3a1e', hair: { style: 'bob', color: '#5a3a1e' }, hat: 'cap', hatColor: '#3a3f5a', torso: '#7a5a3a',
    apron: '#6a4a2a', torso2: '#3a2a1e', legs: '#4a4a5a', boots: '#2a2a33', sash: true, weapon: 'musket',
  }),
  wizard: () => ({
    height: 1.25, skin: SKIN, face: 'dot', beard: { color: '#f4f1e8', size: 1.1 }, mustache: '#f4f1e8', hat: 'wizard', hatColor: '#a8322a', hatColor2: '#f2b233',
    torso: '#c4432f', apron: '#a8322a', robe: true, legs: '#a8322a', boots: '#5a2a1e', sash: true, weapon: 'staff',
  }),
  iron_swordsman: () => ({
    height: 1.2, build: 1.15, skin: '#3a3f4a', face: 'visor', eyeColor: '#ffb347', hat: 'iron', hatColor: '#7d8ca3', torso: '#7d8ca3', torso2: '#3a3f4a',
    legs: '#5d6b80', boots: '#3a3f4a', arms: '#7d8ca3', hands: '#5d6b80', pads: true, weapon: 'greatsword',
  }),
  axe_dwarf: () => ({
    height: 1.05, build: 1.4, skin: SKIN, face: 'angry', beard: { color: '#d9692a', size: 1.3 }, mustache: '#c45a1e', hat: 'winged', hatColor: '#b8bec8',
    torso: '#8a5a3a', torso2: '#3a2a1e', legs: '#5a4a3a', boots: '#3a2a1e', arms: SKIN, pads: true, weapon: 'axe2', belly: true,
  }),
  bomber: () => ({
    height: 0.9, build: 1.05, skin: '#e8b890', face: 'dot', nose: 'long', beard: { color: '#f4f1e8', size: 0.7 }, hat: 'goggles', torso: '#d9822a',
    torso2: '#3a2a1e', legs: '#5a4a3a', boots: '#3a2a1e', sash: true, weapon: 'bomb',
  }),
  barbarian: () => ({
    height: 1.25, build: 1.15, skin: '#e8b07a', face: 'angry', hair: { style: 'braids', color: '#c9a24a' }, beard: { color: '#c9a24a' }, hat: 'horned',
    hatColor: '#8a8f99', torso: '#7a5230', arms: '#e8b07a', torso2: '#3a2a1e', legs: '#6b5a40', boots: '#4a3a2a', weapon: 'club',
  }),
  witch: () => ({
    height: 1.2, skin: '#cfe0c0', face: 'dot', eyeColor: '#5a1f7a', hair: { style: 'long', color: '#2a1a3a' }, hat: 'witch', hatColor: '#4a2a6a',
    torso: '#5a3a7a', robe: true, apron: '#4a2a6a', legs: '#3a2a4a', boots: '#2a1a2a', weapon: 'skullstaff', cape: true,
  }),
  giant_skeleton: () => ({
    height: 2.0, build: 1.25, headScale: 0.8, torsoScale: 1.15, skin: BONE, face: 'skull', bones: true, torso: '#e6dfcc', legs: '#e6dfcc', boots: '#d9d2c0',
    hands: BONE, hat: 'skull', hatColor: '#7a6a5a', pads: true,
  }),
};

export const PROFILES: Record<string, AnimProfile> = {
  knight: { rig: 'biped', attack: 'swing' },
  archer: { rig: 'biped', attack: 'bow' },
  giant: { rig: 'biped', attack: 'punch', stride: 0.8, cadence: 0.6 },
  goblin: { rig: 'biped', attack: 'swing', cadence: 1.5 },
  spear_goblin: { rig: 'biped', attack: 'throw', cadence: 1.5 },
  skeleton: { rig: 'biped', attack: 'swing', cadence: 1.3 },
  musketeer: { rig: 'biped', attack: 'shoot' },
  wizard: { rig: 'biped', attack: 'cast' },
  iron_swordsman: { rig: 'biped', attack: 'chop', cadence: 1.3 },
  axe_dwarf: { rig: 'biped', attack: 'spin' },
  bomber: { rig: 'biped', attack: 'throw' },
  barbarian: { rig: 'biped', attack: 'chop' },
  witch: { rig: 'biped', attack: 'cast' },
  giant_skeleton: { rig: 'biped', attack: 'punch', stride: 0.8, cadence: 0.7 },
  golem: { rig: 'biped', attack: 'slam', stride: 0.6, cadence: 0.5 },
  golemite: { rig: 'biped', attack: 'slam', stride: 0.7, cadence: 0.7 },
  ice_spirit: { rig: 'blob', attack: 'hop' },
  fire_spirit: { rig: 'blob', attack: 'hop' },
  bat: { rig: 'flyer', attack: 'bite', hover: 1.0 },
  gargoyle: { rig: 'flyer', attack: 'spit', hover: 0.9 },
  baby_dragon: { rig: 'flyer', attack: 'breath', hover: 1.4 },
  bomb_blimp: { rig: 'blimp', attack: 'drop', hover: 1.3 },
  wolf_rider: { rig: 'mount', attack: 'swing', cadence: 1.6 },
  lancer: { rig: 'mount', attack: 'stab', cadence: 1.1 },
  cannon: { rig: 'cannon', attack: 'fire' },
  inferno: { rig: 'inferno', attack: 'beam' },
  tombstone: { rig: 'tomb', attack: 'none' },
  princess: { rig: 'princess', attack: 'bow' },
  king: { rig: 'king', attack: 'fire' },
};

function buildGiantSkeleton(t: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const rig = addHumanoid(k, HUMANOIDS.giant_skeleton(t), t, root);
  // 胸腔裡發光的大炸彈
  k.sphere(0.24, { at: [0, 0.92, 0.02], color: '#2a2c33', bone: rig.spine }, 12);
  k.sphere(0.08, { at: [0, 1.2, 0.02], color: '#ffb347', bone: rig.spine }, 8);
  k.torus(0.25, 0.03, { at: [0, 0.92, 0.02], rot: [Math.PI / 2, 0, 0], color: t.main, bone: rig.spine }, 12);
  return k.build(2.0);
}

function buildAsset(unit: string, team: 0 | 1): ModelAsset {
  const t = TEAM_RGB[team];
  switch (unit) {
    case 'giant_skeleton': return buildGiantSkeleton(t);
    case 'golem': return buildGolem(t, false);
    case 'golemite': return buildGolem(t, true);
    case 'ice_spirit': return buildSpirit(t, 'ice');
    case 'fire_spirit': return buildSpirit(t, 'fire');
    case 'bat': return buildBat(t);
    case 'gargoyle': return buildGargoyle(t);
    case 'baby_dragon': return buildBabyDragon(t);
    case 'bomb_blimp': return buildBlimp(t);
    case 'wolf_rider': return buildWolfRider(t);
    case 'lancer': return buildLancer(t);
    case 'cannon': return buildCannon(t);
    case 'inferno': return buildInferno(t);
    case 'tombstone': return buildTombstone(t);
    case 'princess': return buildPrincessTower(t);
    case 'king': return buildKingTower(t);
    case 'rubble-princess': return buildRubble(3);
    case 'rubble-king': return buildRubble(4);
    default: {
      const spec = HUMANOIDS[unit] ?? HUMANOIDS.knight;
      return buildHumanoid(spec(t), t);
    }
  }
}

const cache = new Map<string, ModelAsset>();

/** 取得（並快取）某單位、某隊伍的模型資料；同一種單位的所有實例共用幾何資料。 */
export function getAsset(unit: string, team: 0 | 1): ModelAsset {
  const key = `${unit}|${team}`;
  let a = cache.get(key);
  if (!a) {
    a = buildAsset(unit, team);
    cache.set(key, a);
  }
  return a;
}

export function profileOf(unit: string): AnimProfile {
  return PROFILES[unit] ?? { rig: 'biped', attack: 'swing' };
}
