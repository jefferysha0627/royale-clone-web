import { TEAM_RGB } from '../coords';
import { Kit, type ModelAsset } from '../kit';
import { buildCannon, buildCollector, buildInferno, buildKingTower, buildPrincessTower, buildRubble, buildTombstone } from './buildings';
import { buildBabyDragon, buildBat, buildBlimp, buildGargoyle, buildGolem, buildLancer, buildSpirit, buildWolfRider } from './creatures';
import { buildBombTurret, buildHeavyGargoyle, buildLavaBeast, buildMortar, buildSiegeRam, buildSpiritHut } from './extra';
import { buildFireDrake, buildRanger, buildVoltCart } from './batch4';
import { addHumanoid, buildHumanoid, type HumanoidSpec } from './humanoid';

export type Rig = 'biped' | 'mount' | 'flyer' | 'blob' | 'blimp' | 'cannon' | 'inferno' | 'tomb' | 'princess' | 'king' | 'cart' | 'static';
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
const IRON_BRACER = '#6b6f78';
const GOBLIN = '#7cbf4a';
const BONE = '#efe8d8';

// 人形單位的原創外觀設定
const HUMANOIDS: Record<string, (t: TeamPal) => HumanoidSpec> = {
  knight: () => ({
    height: 1.3, build: 1.1, skin: SKIN, face: 'dot', hat: 'helmet', hatColor: '#c9d1dc', plume: true, torso: '#9aa6b5', torso2: '#6b4426', legs: '#5a5f6b',
    boots: '#3a3f4a', arms: '#9aa6b5', hands: '#c9d1dc', pads: true, cape: true, tabard: true, weapon: 'sword', offhand: 'shield', metal: 0.55,
  }),
  archer: () => ({
    height: 1.1, skin: SKIN, face: 'dot', hair: { style: 'bob', color: '#d9894a' }, hat: 'hood', hatColor: '#3f7a4a', torso: '#4f8a5a', torso2: '#7a5230',
    legs: '#5a4a3a', boots: '#4a3a2a', sash: true, offhand: 'bow',
  }),
  giant: (t) => ({
    height: 2.15, build: 1.3, headScale: 0.62, torsoScale: 1.3, legScale: 1.15, skin: '#e0a878', face: 'angry', nose: 'ball', ears: 'round',
    beard: { color: '#6a4228', size: 1.5 }, mustache: '#5a3620', hair: { style: 'tuft', color: '#6a4228' }, torso: '#8a6a4a', torso2: t.main, legs: '#6b5a40', boots: '#4a3a2a',
    arms: '#e0a878', hands: '#e0a878', belly: true, strap: '#5a3a1e', bracers: '#6b4a2a',
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
    height: 0.95, skin: BONE, face: 'skull', bones: true, torso: '#e6dfcc', legs: '#e6dfcc', boots: '#d9d2c0', hands: BONE, scarf: true, weapon: 'sword',
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
    legs: '#5d6b80', boots: '#3a3f4a', arms: '#7d8ca3', hands: '#5d6b80', pads: true, weapon: 'greatsword', metal: 0.75,
  }),
  axe_dwarf: () => ({
    height: 1.05, build: 1.4, skin: SKIN, face: 'angry', beard: { color: '#d9692a', size: 1.3 }, mustache: '#c45a1e', hat: 'winged', hatColor: '#b8bec8',
    torso: '#8a5a3a', torso2: '#3a2a1e', legs: '#5a4a3a', boots: '#3a2a1e', arms: SKIN, pads: true, weapon: 'axe2', belly: true, bracers: '#6b6f78',
  }),
  bomber: () => ({
    height: 0.9, build: 1.05, skin: '#e8b890', face: 'dot', nose: 'long', beard: { color: '#f4f1e8', size: 0.7 }, hat: 'goggles', torso: '#d9822a',
    torso2: '#3a2a1e', legs: '#5a4a3a', boots: '#3a2a1e', sash: true, weapon: 'bomb',
  }),
  barbarian: () => ({
    height: 1.25, build: 1.15, skin: '#e8b07a', face: 'angry', hair: { style: 'braids', color: '#c9a24a' }, beard: { color: '#c9a24a' }, hat: 'horned',
    hatColor: '#8a8f99', torso: '#7a5230', arms: '#e8b07a', torso2: '#3a2a1e', legs: '#6b5a40', boots: '#4a3a2a', weapon: 'club', bracers: '#5a3a1e',
  }),
  witch: () => ({
    height: 1.2, skin: '#cfe0c0', face: 'dot', eyeColor: '#5a1f7a', hair: { style: 'long', color: '#2a1a3a' }, hat: 'witch', hatColor: '#4a2a6a',
    torso: '#5a3a7a', robe: true, apron: '#4a2a6a', legs: '#3a2a4a', boots: '#2a1a2a', weapon: 'skullstaff', cape: true,
  }),
  tunneler: () => ({
    height: 1.15, build: 1.18, skin: SKIN, face: 'dot', nose: 'ball', beard: { color: '#7a4a2a', size: 0.75 }, mustache: '#6b3f22', hat: 'hardhat',
    hatColor: '#e8b830', torso: '#7a6a52', torso2: '#3a2a1e', legs: '#4a5f7a', boots: '#3a2a1e', arms: '#7a6a52', hands: '#8a6a4a',
    strap: '#5a3a1e', bracers: '#5a4a3a', weapon: 'pickaxe', scarf: true,
  }),
  // v3 第二批
  siege_giant: (t) => ({
    height: 2.1, build: 1.3, headScale: 0.62, torsoScale: 1.25, legScale: 1.15, skin: '#d99f78', face: 'angry', nose: 'ball', ears: 'round',
    mustache: '#4a2e1e', hair: { style: 'mohawk', color: '#4a2e1e' }, torso: '#6a7484', torso2: '#3a2a1e', tabard: true, legs: '#5a5148', boots: '#3a2e26',
    arms: '#d99f78', hands: '#7a5a3a', pads: true, bracers: IRON_BRACER, belly: true, weapon: 'handcannon', strap: t.dark,
  }),
  berserker: () => ({
    height: 1.25, build: 1.12, skin: '#e8b07a', face: 'angry', hair: { style: 'mohawk', color: '#c4532a' }, beard: { color: '#c4532a', size: 0.85 },
    torso: '#5a3a24', torso2: '#3a2a1e', arms: '#e8b07a', legs: '#4a3a2a', boots: '#3a2a1e', bracers: IRON_BRACER, pads: true, strap: '#3a2a1e',
    weapon: 'handaxe', offhand: 'handaxe',
  }),
  blowgun_goblin: () => ({
    height: 0.85, skin: '#8ac45a', ears: 'pointy', nose: 'long', face: 'dot', eyeColor: '#2a1d10', hat: 'hood', hatColor: '#4a6a32',
    torso: '#6a4a2a', torso2: '#3a2a1e', legs: '#4a3a24', boots: '#3a2a1e', strap: '#5a3a1e', weapon: 'blowpipe',
  }),
  giant_skeleton: () => ({
    height: 2.0, build: 1.25, headScale: 0.8, torsoScale: 1.15, skin: BONE, face: 'skull', bones: true, torso: '#e6dfcc', legs: '#e6dfcc', boots: '#d9d2c0',
    hands: BONE, scarf: true,
  }),
  // v3 第四批
  heavy_warrior: (t) => ({
    // 重裝武士：深鋼板甲、金邊、隊伍色盔冠與披風，雙手巨劍；八字鬍、表情嚴肅
    height: 1.55, build: 1.32, headScale: 0.86, torsoScale: 1.08, skin: '#e8b890', face: 'angry', mustache: '#2a1e14', hat: 'crest', hatColor: '#4a5160',
    hatColor2: t.main, torso: '#4a5160', torso2: '#c9a24a', tabard: true, legs: '#3a3f4a', boots: '#2a2d33', arms: '#4a5160', hands: '#8a93a3', pads: true,
    cape: true, bracers: '#c9a24a', metal: 0.7, weapon: 'greatsword',
  }),
  ranger: () => ({
    height: 1.2, skin: '#f2d2b0', face: 'dot', eyeColor: '#2a5a3a', ears: 'pointy', hair: { style: 'long', color: '#f0c860' }, torso: '#3f6a4a',
    torso2: '#6a4a2a', legs: '#4a5a3a', boots: '#3a2a1e', arms: '#3f6a4a', cape: true, strap: '#5a3a1e', bracers: '#6a4a2a', offhand: 'bow',
  }),
  frost_mage: () => ({
    // 寒霜術士：銀白長髮配冰藍額環、淺藍長袍與隊伍色圍巾、冰晶法杖
    height: 1.2, skin: '#f0d6c0', face: 'dot', eyeColor: '#2a6aa8', hair: { style: 'long', color: '#e8f4ff' }, hat: 'band', hatColor2: '#9fdcff',
    torso: '#5aa0d8', apron: '#3a78b8', robe: true, legs: '#3a78b8', boots: '#2a4a6a', scarf: true, bracers: '#dff2ff', weapon: 'froststaff',
  }),
  storm_mage: () => ({
    // 風暴術士：深靛尖帽配冰藍帽帶、白色短鬍、深靛長袍與披風、引雷杖
    height: 1.22, skin: '#e8c0a0', face: 'angry', eyeColor: '#1e3a8a', beard: { color: '#f4f1e8', size: 0.7 }, mustache: '#f4f1e8',
    hat: 'wizard', hatColor: '#2a3070', hatColor2: '#7fd0ff', torso: '#3a3f7a', apron: '#2a2f5a', robe: true, legs: '#2a2f5a', boots: '#1e2238', sash: true,
    cape: true, weapon: 'stormstaff',
  }),
  hammer_knight: (t) => ({
    // 巨錘騎士：比一般騎士壯一圈的板甲、開面頭盔、火紅大鬍子，雙手巨錘
    height: 1.5, build: 1.45, headScale: 0.84, torsoScale: 1.05, skin: '#e8b890', face: 'angry', beard: { color: '#c4532a', size: 1.25 }, mustache: '#a8401e',
    hat: 'helmet', hatColor: '#7d8794', torso: '#7d8794', torso2: '#5a3a1e', legs: '#5d6b80', boots: '#3a3f4a', arms: '#7d8794', hands: '#9aa3b0', pads: true,
    belly: true, strap: t.dark, metal: 0.75, weapon: 'warhammer',
  }),
  axe_thrower: (t) => ({
    // 回旋斧手：光頭綁隊伍色頭巾、黑色大鬍子、皮圍裙與護腕，雙刃巨斧
    height: 1.35, build: 1.3, skin: '#e0a878', face: 'angry', nose: 'ball', beard: { color: '#2a1e14', size: 1.2 }, mustache: '#2a1e14', hat: 'bandana',
    hatColor2: t.main, torso: '#6a4a32', apron: '#4a3424', torso2: '#2a1e14', legs: '#4a3a2a', boots: '#2a1e14', arms: '#e0a878', bracers: '#5a3a1e',
    strap: '#3a2a1e', belly: true, weapon: 'axe2',
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
  tunneler: { rig: 'biped', attack: 'chop', cadence: 1.2 },
  elixir_collector: { rig: 'inferno', attack: 'none' },
  mega_gargoyle: { rig: 'flyer', attack: 'spit', hover: 1.0 },
  siege_ram: { rig: 'mount', attack: 'none', cadence: 1.2 },
  siege_giant: { rig: 'biped', attack: 'shoot', stride: 0.8, cadence: 0.6 },
  berserker: { rig: 'biped', attack: 'chop', cadence: 1.4 },
  blowgun_goblin: { rig: 'biped', attack: 'shoot', cadence: 1.6 },
  spirit_hut: { rig: 'inferno', attack: 'none' },
  bomb_turret: { rig: 'cannon', attack: 'fire' },
  lava_hound: { rig: 'flyer', attack: 'spit', hover: 1.7 },
  lava_pup: { rig: 'flyer', attack: 'spit', hover: 1.3 },
  mortar: { rig: 'cannon', attack: 'fire' },
  heavy_warrior: { rig: 'biped', attack: 'chop', stride: 0.85, cadence: 0.7 },
  ranger: { rig: 'biped', attack: 'bow' },
  inferno_drake: { rig: 'flyer', attack: 'breath', hover: 1.5 },
  frost_mage: { rig: 'biped', attack: 'cast' },
  storm_mage: { rig: 'biped', attack: 'cast', cadence: 1.2 },
  volt_cart: { rig: 'cart', attack: 'fire', cadence: 0.8 },
  hammer_knight: { rig: 'biped', attack: 'slam', stride: 0.85, cadence: 0.8 },
  axe_thrower: { rig: 'biped', attack: 'throw' },
  princess: { rig: 'princess', attack: 'bow' },
  king: { rig: 'king', attack: 'fire' },
};

function buildGiantSkeleton(t: TeamPal): ModelAsset {
  const k = new Kit();
  const root = k.addBone('root', -1, [0, 0, 0]);
  const rig = addHumanoid(k, HUMANOIDS.giant_skeleton(t), t, root);
  // 背上綁著的大炸彈（從後方看得到），導火線發光
  k.sphere(0.42, { at: [0, 1.05, -0.42], color: '#2a2c33', bone: rig.spine }, 14);
  k.torus(0.43, 0.04, { at: [0, 1.05, -0.42], rot: [0, 0, 0], color: '#6b4426', bone: rig.spine }, 16);
  k.torus(0.43, 0.04, { at: [0, 1.05, -0.42], rot: [0, Math.PI / 2, 0], color: '#6b4426', bone: rig.spine }, 16);
  k.cyl(0.04, 0.04, 0.22, { at: [0, 1.52, -0.42], color: '#c9a24a', bone: rig.spine }, 6);
  k.sphere(0.07, { at: [0, 1.65, -0.42], color: '#ffb347', bone: rig.spine }, 8);
  k.box(0.08, 0.7, 0.08, { at: [0.22, 1.05, -0.1], rot: [0.4, 0, 0], color: t.main, bone: rig.spine });
  k.box(0.08, 0.7, 0.08, { at: [-0.22, 1.05, -0.1], rot: [0.4, 0, 0], color: t.main, bone: rig.spine });
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
    case 'elixir_collector': return buildCollector(t);
    case 'mega_gargoyle': return buildHeavyGargoyle(t);
    case 'siege_ram': return buildSiegeRam(t);
    case 'spirit_hut': return buildSpiritHut(t);
    case 'bomb_turret': return buildBombTurret(t);
    case 'lava_hound': return buildLavaBeast(t, false);
    case 'lava_pup': return buildLavaBeast(t, true);
    case 'mortar': return buildMortar(t);
    case 'ranger': return buildRanger(HUMANOIDS.ranger(t), t);
    case 'inferno_drake': return buildFireDrake(t);
    case 'volt_cart': return buildVoltCart(t);
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
    // 共用、常駐的幾何（不隨單位消失而釋放）；GPU 資源統計時要和真正的洩漏分開
    a.geometry.userData.shared = true;
    cache.set(key, a);
  }
  return a;
}

export function profileOf(unit: string): AnimProfile {
  return PROFILES[unit] ?? { rig: 'biped', attack: 'swing' };
}
