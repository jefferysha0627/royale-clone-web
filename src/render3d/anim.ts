import type { Bone } from 'three';
import type { ModelInstance } from './kit';
import type { AnimProfile } from './models';

// 程式動畫：依模擬狀態（移動、出手準備、命中、受擊、暈眩）擺動骨頭。全部是骨頭旋轉／位移，不需要動畫檔。

export interface AnimState {
  t: number; // 累積時間（秒）
  walk: number; // 步伐相位
  moving: boolean;
  speed: number; // 移動速度（格／秒）
  windup: number; // 0～1：出手前的準備進度；-1 = 不在攻擊
  sinceHit: number; // 距離上次出手命中的秒數
  flinch: number; // 受擊後的晃動（1 → 0）
  charging: boolean;
  jumping: boolean;
  frozen: boolean;
  active: boolean; // 國王塔已喚醒
  aimYaw: number; // 砲塔／守衛相對本體的瞄準角
  wakeT: number; // 國王塔喚醒後經過的秒數
}

export function newAnimState(): AnimState {
  return { t: Math.random() * 10, walk: Math.random() * 6, moving: false, speed: 1, windup: -1, sinceHit: 9, flinch: 0, charging: false, jumping: false, frozen: false, active: false, aimYaw: 0, wakeT: 0 };
}

const ease = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));

function rot(b: Bone | undefined, x: number, y = 0, z = 0): void {
  if (!b) return;
  b.rotation.set(x, y, z);
}

/** 出手：準備（windup）往後拉、命中瞬間往前甩，之後 0.3 秒回復。回傳 -1（拉滿）～ +1（甩出）。 */
function strike(s: AnimState): number {
  if (s.sinceHit < 0.3) {
    const k = s.sinceHit / 0.3;
    return k < 0.25 ? 1 : 1 - ease((k - 0.25) / 0.75);
  }
  if (s.windup >= 0) return -ease(s.windup);
  return 0;
}

export function animate(inst: ModelInstance, p: AnimProfile, s: AnimState, dt: number): void {
  if (s.frozen) return; // 冰凍：保持當下姿勢
  s.t += dt;
  const cadence = p.cadence ?? 1;
  if (s.moving) s.walk += dt * Math.PI * 2 * 1.5 * cadence * Math.max(0.6, Math.min(1.8, s.speed)) * (s.charging ? 1.6 : 1);
  s.sinceHit += dt;
  s.flinch = Math.max(0, s.flinch - dt * 6);
  switch (p.rig) {
    case 'biped': return biped(inst, p, s);
    case 'mount': return mount(inst, p, s);
    case 'flyer': return flyer(inst, p, s);
    case 'blob': return blob(inst, s);
    case 'blimp': return blimp(inst, s, dt);
    case 'cannon': return cannon(inst, s);
    case 'inferno': return inferno(inst, s);
    case 'tomb': return tomb(inst, s);
    case 'princess': return princessTower(inst, s);
    case 'king': return kingTower(inst, s);
    default: return;
  }
}

function biped(inst: ModelInstance, p: AnimProfile, s: AnimState, seated = false): void {
  const b = inst.byName;
  const stride = p.stride ?? 1;
  const w = s.walk;
  const moving = s.moving && !seated;
  const sw = moving ? Math.sin(w) : 0;
  const breathe = Math.sin(s.t * 2.2) * 0.04;
  const hips = b.hips;
  if (hips && !seated) {
    const ri = inst.bones.indexOf(hips);
    const restY = inst.rest[ri].y;
    hips.position.y = restY + (moving ? Math.abs(Math.cos(w)) * 0.05 : 0) - s.flinch * 0.03;
    // 站著時重心左右輕輕擺動
    hips.rotation.z = moving ? Math.sin(w) * 0.05 : Math.sin(s.t * 0.9) * 0.025;
  }
  if (!seated) {
    rot(b.legL, sw * 0.75 * stride);
    rot(b.legR, -sw * 0.75 * stride);
  }
  const k = strike(s);
  const attacking = s.windup >= 0 || s.sinceHit < 0.3;
  // 近戰出手時身體跟著扭轉：蓄力往後轉、揮出時往前帶並前傾，有收招的慣性
  const melee = p.attack === 'swing' || p.attack === 'chop' || p.attack === 'stab' || p.attack === 'punch' || p.attack === 'slam' || p.attack === 'spin';
  const twist = attacking && melee ? (k < 0 ? 0.38 * -k : -0.3 * k) : 0;
  const lean = attacking && melee ? (k < 0 ? -0.1 * -k : 0.18 * k) : 0;
  rot(b.spine, (moving ? 0.12 : 0) + breathe - s.flinch * 0.3 + lean, (moving ? sw * 0.08 : 0) + twist);
  // 走路落地時上半身微微壓扁、彈起時拉長（卡通彈性）
  if (b.spine) {
    const sq = moving ? 0.045 * (1 - Math.abs(Math.cos(w))) - 0.015 : s.flinch * 0.05;
    b.spine.scale.set(1 + sq * 0.5, 1 - sq, 1 + sq * 0.5);
  }
  // 頭微微上仰，讓斜俯視的鏡頭看得到臉（Q 版角色的「看鏡頭」姿態）
  rot(b.head, -0.22 - breathe * 0.5 + s.flinch * 0.2 + lean * 0.4, -twist * 0.4, Math.sin(s.t * 1.3) * 0.04);
  let aL = -sw * 0.55 + 0.05;
  let aR = sw * 0.55 + 0.05;
  let zL = -0.08;
  let zR = 0.08;
  let yR = 0;
  switch (p.attack) {
    case 'swing':
      if (attacking) {
        aR = k < 0 ? -2.3 * -k : -2.3 + 3.0 * k;
        zR = 0.25;
      }
      break;
    case 'chop':
      if (attacking) {
        const a = k < 0 ? -2.7 * -k : -2.7 + 3.1 * k;
        aR = a;
        aL = a * 0.9;
        zL = -0.25;
        zR = 0.25;
      }
      break;
    case 'stab':
      if (attacking) aR = k < 0 ? -1.0 + 0.6 * -k : -1.0 - 0.6 * k;
      else if (s.charging) aR = -1.2;
      break;
    case 'punch': {
      if (attacking) {
        const a = k < 0 ? -1.2 - 1.2 * -k : -2.4 + 1.6 * k;
        aR = a;
        aL = -0.6;
      }
      break;
    }
    case 'slam':
      if (attacking) {
        const a = k < 0 ? -2.9 * -k : -2.9 + 3.4 * k;
        aL = a;
        aR = a;
        zL = -0.3;
        zR = 0.3;
      }
      break;
    case 'spin':
      if (attacking) {
        zL = -1.35;
        zR = 1.35;
        aL = 0;
        aR = 0;
        // 命中前 0.5 秒開始旋轉一整圈
        const spin = s.sinceHit < 0.3 ? 1 : s.windup >= 0 ? ease((s.windup - 0.4) / 0.6) : 0;
        if (b.hips) b.hips.rotation.y = spin * Math.PI * 2;
      } else if (b.hips) b.hips.rotation.y = 0;
      break;
    case 'shoot':
      if (attacking || s.windup >= 0) {
        aR = -1.45;
        aL = -1.35;
        zL = -0.45;
        if (s.sinceHit < 0.15) rot(b.spine, -0.15);
      }
      break;
    case 'bow':
      aL = attacking ? -1.5 : aL;
      zL = attacking ? -0.1 : zL;
      if (attacking) {
        aR = k < 0 ? -1.4 : -1.4 + 0.5 * k;
        yR = k < 0 ? -0.6 * -k : 0;
      }
      break;
    case 'cast':
      if (attacking) aR = k < 0 ? -0.6 - 1.6 * -k : -2.2 + 1.2 * k;
      break;
    case 'throw':
      if (attacking) aR = k < 0 ? -2.8 * -k : -2.8 + 3.4 * k;
      break;
    default:
      break;
  }
  rot(b.armL, aL, 0, zL);
  rot(b.armR, aR, yR, zR);
  if (seated) {
    rot(b.legL, -1.2, 0, 0.2);
    rot(b.legR, -1.2, 0, -0.2);
  }
}

function mount(inst: ModelInstance, p: AnimProfile, s: AnimState): void {
  const b = inst.byName;
  const w = s.walk;
  const mv = s.moving || s.jumping;
  const g = mv ? 0.85 : 0.05;
  rot(b.legFL, Math.sin(w) * g);
  rot(b.legFR, Math.sin(w + 0.6) * g);
  rot(b.legBL, Math.sin(w + Math.PI) * g);
  rot(b.legBR, Math.sin(w + Math.PI + 0.6) * g);
  if (s.jumping) {
    rot(b.legFL, -0.9);
    rot(b.legFR, -0.8);
    rot(b.legBL, 0.9);
    rot(b.legBR, 0.8);
  }
  const body = b.body;
  if (body) {
    const ri = inst.bones.indexOf(body);
    body.position.y = inst.rest[ri].y + (mv ? Math.abs(Math.sin(w)) * 0.06 : Math.sin(s.t * 2) * 0.01);
    body.rotation.x = mv ? Math.sin(w * 2) * 0.05 : 0;
    // 出手時坐騎前身微微抬起
    const k = strike(s);
    if (s.windup >= 0 || s.sinceHit < 0.3) body.rotation.x -= (k < 0 ? -k : 1 - k) * 0.12;
  }
  rot(b.mhead, mv ? Math.sin(w * 2) * 0.1 : Math.sin(s.t * 1.5) * 0.05);
  rot(b.tail, 0, Math.sin(s.t * (mv ? 9 : 3)) * 0.4);
  biped(inst, p, s, true);
}

function flyer(inst: ModelInstance, p: AnimProfile, s: AnimState): void {
  const b = inst.byName;
  const flap = Math.sin(s.t * (p.attack === 'breath' ? 9 : 14));
  rot(b.wingL, 0, 0, -0.2 + flap * 0.75);
  rot(b.wingR, 0, 0, 0.2 - flap * 0.75);
  const body = b.body;
  const k = strike(s);
  const attacking = s.windup >= 0 || s.sinceHit < 0.3;
  if (body) {
    const ri = inst.bones.indexOf(body);
    body.position.y = inst.rest[ri].y + Math.sin(s.t * 3) * 0.06;
    body.position.z = inst.rest[ri].z + (attacking && p.attack === 'bite' ? (k < 0 ? -0.15 * -k : 0.3 * (1 - k)) : 0);
    body.rotation.x = s.moving ? 0.25 : 0.05;
  }
  const headRot = attacking ? (k < 0 ? -0.35 * -k : 0.35 * (1 - k)) : Math.sin(s.t * 1.7) * 0.06;
  rot(b.head, headRot - s.flinch * 0.3);
  rot(b.tail, 0, Math.sin(s.t * 4) * 0.35);
  rot(b.armL, attacking ? -1.0 : -0.3);
  rot(b.armR, attacking ? -1.0 : -0.3);
}

function blob(inst: ModelInstance, s: AnimState): void {
  const body = inst.byName.body;
  if (!body) return;
  const ri = inst.bones.indexOf(body);
  const hop = s.moving ? Math.abs(Math.sin(s.walk)) : Math.abs(Math.sin(s.t * 3)) * 0.3;
  body.position.y = inst.rest[ri].y + hop * 0.22;
  const sq = 1 - (1 - hop) * 0.12;
  body.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
}

function blimp(inst: ModelInstance, s: AnimState, dt: number): void {
  const b = inst.byName;
  if (b.prop) b.prop.rotation.z += dt * 18;
  if (b.body) {
    b.body.rotation.z = Math.sin(s.t * 1.3) * 0.05;
    b.body.rotation.x = Math.sin(s.t * 0.9) * 0.03;
  }
  const k = strike(s);
  if (b.bay) b.bay.rotation.x = s.windup >= 0 || s.sinceHit < 0.3 ? (k < 0 ? -0.1 * -k : 0.15 * (1 - k)) : 0;
}

function cannon(inst: ModelInstance, s: AnimState): void {
  const b = inst.byName;
  if (b.turret) b.turret.rotation.y = s.aimYaw;
  if (b.barrel) {
    const ri = inst.bones.indexOf(b.barrel);
    const recoil = s.sinceHit < 0.25 ? (1 - s.sinceHit / 0.25) * 0.18 : 0;
    b.barrel.position.z = inst.rest[ri].z - recoil;
  }
}

function inferno(inst: ModelInstance, s: AnimState): void {
  const c = inst.byName.crystal;
  if (!c) return;
  const ri = inst.bones.indexOf(c);
  c.rotation.y = s.t * (s.windup >= 0 || s.sinceHit < 1 ? 4 : 0.8);
  c.position.y = inst.rest[ri].y + Math.sin(s.t * 2) * 0.06;
}

function tomb(inst: ModelInstance, s: AnimState): void {
  const st = inst.byName.stone;
  if (st) st.rotation.z = s.flinch * 0.08 * Math.sin(s.t * 40);
}

function guard(inst: ModelInstance, s: AnimState): void {
  const b = inst.byName;
  if (b.hips) b.hips.rotation.y = s.aimYaw;
  const k = strike(s);
  const attacking = s.windup >= 0 || s.sinceHit < 0.3;
  rot(b.armR, attacking ? -1.45 + (k > 0 ? -0.2 * (1 - k) : 0) : 0.05, 0, 0.1);
  rot(b.armL, attacking ? -1.3 : -0.05, 0, -0.3);
  rot(b.spine, Math.sin(s.t * 2) * 0.03 + (s.sinceHit < 0.15 ? -0.12 : 0));
  rot(b.head, 0, 0, Math.sin(s.t * 1.1) * 0.05);
}

function princessTower(inst: ModelInstance, s: AnimState): void {
  guard(inst, s);
}

function kingTower(inst: ModelInstance, s: AnimState): void {
  const b = inst.byName;
  // 喚醒：兩門砲從下垂慢慢抬起並轉向目標，靠目標那一側的砲開火後座；指揮官起身、舉權杖下令
  const wake = s.active ? ease(Math.min(1, s.wakeT / 1.6)) : 0;
  const side = s.aimYaw >= 0 ? 1 : -1;
  for (const [bone, sx] of [[b.cannon, 1], [b.cannon2, -1]] as const) {
    if (!bone) continue;
    const ri = inst.bones.indexOf(bone);
    const recoil = sx === side && s.sinceHit < 0.3 ? (1 - s.sinceHit / 0.3) * 0.22 : 0;
    bone.rotation.set((1 - wake) * 0.35, s.aimYaw * wake, 0);
    bone.position.y = inst.rest[ri].y - (1 - wake) * 0.12;
    bone.position.z = inst.rest[ri].z - recoil;
  }
  if (b.hips) b.hips.rotation.y = s.aimYaw * wake * 0.6;
  const command = s.active && s.sinceHit < 0.45;
  rot(b.head, s.active ? Math.sin(s.t * 1.7) * 0.05 - 0.12 : 0.35 + Math.sin(s.t * 1.2) * 0.05, 0, s.active ? 0 : 0.2);
  rot(b.armR, s.active ? (command ? -2.5 : -0.4) : 0.1, 0, command ? 0.35 : 0.2);
  rot(b.armL, s.active ? -0.25 : 0.1, 0, -0.3);
  rot(b.spine, s.active ? Math.sin(s.t * 2) * 0.03 - (command ? 0.08 : 0) : 0.25 + Math.sin(s.t * 1.2) * 0.04);
}
