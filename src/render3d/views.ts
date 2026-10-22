import {
  AdditiveBlending, CircleGeometry, Group, InstancedMesh, Mesh, MeshBasicMaterial, MeshLambertMaterial, Object3D, SphereGeometry, Vector3,
  type BufferGeometry,
} from 'three';
import { ARENA, UNITS, type Entity } from '../sim';
import { animate, newAnimState, type AnimState } from './anim';
import { lerpAngle, toX, toZ, yawOf } from './coords';
import { instantiate, Kit, type ModelInstance } from './kit';
import { setStatusTint, toonMaterial } from './materials';
import { getAsset, profileOf, type AnimProfile } from './models';

// 每個模擬實體對應的畫面物件：位置內插、轉向、動畫狀態、受擊閃白、部署落下與死亡倒地。

const ease = (x: number): number => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - (1 - x) * (1 - x));

export class UnitView {
  readonly inst: ModelInstance;
  readonly prof: AnimProfile;
  readonly st: AnimState = newAnimState();
  readonly mat: MeshLambertMaterial;
  readonly height: number;
  yaw: number;
  flash = 0;
  dropT = 1; // 0 → 1：從空中落下
  popT = 1; // 0 → 1：召喚冒出
  dyingT = -1; // ≥ 0：死亡動畫進行中
  kamikaze = false;
  x = 0;
  z = 0;
  hover = 0;
  shadowIdx = -1;
  lastAttackSeen = -99;
  removed = false;
  /** 畫面放大倍率：部隊模型比碰撞範圍大一些，手機上才看得清楚（不影響判定）。 */
  readonly scale: number;

  constructor(readonly e: Entity, parent: Object3D) {
    this.prof = profileOf(e.unit);
    this.mat = toonMaterial();
    const asset = getAsset(e.unit, e.team);
    this.height = asset.height;
    this.inst = instantiate(asset, this.mat);
    this.yaw = yawOf(e.facing);
    this.hover = this.prof.hover ?? 0;
    this.scale = e.kind === 'troop' ? (this.height < 1.1 ? 1.6 : this.height > 1.8 ? 1.26 : 1.48) : 1;
    parent.add(this.inst.mesh);
    if (e.kind === 'building') {
      // 建築固定朝向敵方
      this.yaw = e.team === 0 ? Math.PI : 0;
    }
  }

  get id(): number {
    return this.e.id;
  }

  update(alpha: number, dt: number, animDt: number, simTime: number): void {
    const e = this.e;
    const x = e.px + (e.x - e.px) * alpha;
    const y = e.py + (e.y - e.py) * alpha;
    this.x = toX(x);
    this.z = toZ(y);
    const st = this.st;
    if (this.dyingT < 0) {
      st.moving = e.moving;
      st.speed = e.stats.speed * (e.charging ? 2 : 1);
      st.charging = e.charging;
      st.jumping = e.jumping;
      st.frozen = e.frozen && e.stunTimer > 0;
      // 出手準備：冷卻剩餘時間落在 loadTime 內時拉弓／舉起武器
      if (e.attacking && e.deployTimer <= 0 && e.stunTimer <= 0) {
        const lt = Math.max(0.15, e.stats.loadTime);
        st.windup = e.cooldown <= lt ? 1 - e.cooldown / lt : -1;
      } else st.windup = -1;
      if (e.lastAttack !== this.lastAttackSeen) {
        this.lastAttackSeen = e.lastAttack;
        if (simTime - e.lastAttack < 0.2) st.sinceHit = 0;
      }
      if (e.kind !== 'building') {
        const target = yawOf(e.facing);
        this.yaw = lerpAngle(this.yaw, target, Math.min(1, dt * 10));
      } else if (e.targetId >= 0 && e.attacking) {
        st.aimYaw = 0; // 由外部設定
      }
    }
    animate(this.inst, this.prof, st, animDt);
    const m = this.inst.mesh;
    let lift = this.hover > 0 ? this.hover + Math.sin(st.t * 2.2) * 0.08 : 0;
    // 跳河：在河道範圍內做拋物線
    if (e.jumping) {
      const k = (y - ARENA.riverTop) / (ARENA.riverBottom - ARENA.riverTop);
      lift += Math.sin(Math.max(0, Math.min(1, k)) * Math.PI) * 0.9;
    }
    let sx = 1;
    let sy = 1;
    if (this.dropT < 1) {
      this.dropT = Math.min(1, this.dropT + dt / 0.32);
      const d = this.dropT;
      lift += (1 - ease(d)) * 2.6;
      if (d > 0.85) {
        const sq = Math.sin(((d - 0.85) / 0.15) * Math.PI) * 0.22;
        sy = 1 - sq;
        sx = 1 + sq * 0.6;
      }
    }
    if (this.popT < 1) {
      this.popT = Math.min(1, this.popT + dt / 0.25);
      const p = ease(this.popT);
      sx *= p;
      sy *= p;
    }
    if (this.dyingT >= 0) {
      this.dyingT += dt;
      const k = Math.min(1, this.dyingT / 0.55);
      // 倒地：先被打得微微彈起，再往後、往一側倒下（左右依單位編號錯開，不會整排同一個方向）
      const side = this.e.id % 2 ? 1 : -1;
      const fall = ease(k * 1.4);
      m.rotation.set(-1.15 * fall, this.yaw, side * 0.55 * fall, 'YXZ');
      lift += Math.sin(Math.min(1, k * 2.5) * Math.PI) * 0.22;
      lift -= k * 0.35 + (this.hover > 0 ? this.hover * ease(k) : 0);
      this.mat.transparent = true;
      this.mat.opacity = 1 - ease((k - 0.35) / 0.65);
    } else {
      m.rotation.set(0, this.yaw, 0);
    }
    m.position.set(this.x, lift, this.z);
    m.scale.set(sx * this.scale, sy * this.scale, sx * this.scale);
    this.flash = Math.max(0, this.flash - dt * 9);
    const deploying = e.deployTimer > 0 && this.dyingT < 0;
    setStatusTint(this.mat, this.flash * this.flash * 0.5, st.frozen, e.stunTimer > 0 && !e.frozen);
    if (this.dyingT < 0) {
      this.mat.transparent = deploying;
      this.mat.opacity = deploying ? 0.55 + 0.45 * (1 - e.deployTimer / Math.max(0.3, e.stats.deployTime)) : 1;
    }
  }

  get done(): boolean {
    return this.dyingT >= 0.6;
  }

  dispose(): void {
    this.inst.mesh.removeFromParent();
    // 每個骨架都有自己的骨頭貼圖，要釋放，否則長時間遊玩會累積顯示記憶體
    this.inst.mesh.skeleton.dispose();
    this.mat.dispose();
    this.removed = true;
  }
}

/** 防禦塔：塔身＋守衛／大砲動畫，倒塌後換成瓦礫。 */
export class TowerView {
  readonly inst: ModelInstance;
  readonly mat: MeshLambertMaterial;
  readonly st: AnimState = newAnimState();
  rubble: Mesh | null = null;
  flash = 0;
  down = false;
  readonly height: number;
  private lastAttackSeen = -99;
  private collapseT = 1; // 倒塌動畫進度（0→1），1 = 沒有在倒塌

  constructor(readonly e: Entity, private readonly parent: Object3D) {
    this.mat = toonMaterial({ rim: 0.22 });
    const asset = getAsset(e.unit, e.team);
    this.height = asset.height;
    this.inst = instantiate(asset, this.mat);
    const m = this.inst.mesh;
    m.position.set(toX(e.x), 0, toZ(e.y));
    m.rotation.y = e.team === 0 ? Math.PI : 0;
    m.receiveShadow = true;
    parent.add(m);
  }

  update(dt: number, simTime: number, targetPos: Vector3 | null): void {
    const e = this.e;
    if (!e.alive) {
      if (!this.down) this.collapse();
      this.animateCollapse(dt);
      return;
    }
    const st = this.st;
    st.active = e.active;
    if (e.active) st.wakeT += dt;
    if (e.attacking && e.cooldown <= e.stats.loadTime) st.windup = 1 - e.cooldown / Math.max(0.1, e.stats.loadTime);
    else st.windup = -1;
    if (e.lastAttack !== this.lastAttackSeen) {
      this.lastAttackSeen = e.lastAttack;
      if (simTime - e.lastAttack < 0.2) st.sinceHit = 0;
    }
    if (targetPos) {
      const m = this.inst.mesh;
      const dx = targetPos.x - m.position.x;
      const dz = targetPos.z - m.position.z;
      const world = Math.atan2(dx, dz);
      st.aimYaw = lerpAngle(st.aimYaw, world - m.rotation.y, Math.min(1, dt * 8));
    }
    animate(this.inst, profileOf(e.unit), st, dt);
    this.flash = Math.max(0, this.flash - dt * 6);
    setStatusTint(this.mat, this.flash * 0.35, e.frozen && e.stunTimer > 0, e.stunTimer > 0 && !e.frozen);
  }

  collapse(): void {
    this.down = true;
    this.collapseT = 0;
    const asset = getAsset(this.e.unit === 'king' ? 'rubble-king' : 'rubble-princess', this.e.team);
    this.rubble = new Mesh(asset.geometry, new MeshLambertMaterial({ vertexColors: true }));
    this.rubble.position.copy(this.inst.mesh.position);
    this.rubble.scale.setScalar(0.3);
    this.rubble.castShadow = true;
    this.rubble.receiveShadow = true;
    this.parent.add(this.rubble);
  }

  /** 倒塌：塔身一邊抖動一邊往下陷、壓扁，瓦礫堆同時長出來。 */
  private animateCollapse(dt: number): void {
    if (this.collapseT >= 1) return;
    this.collapseT = Math.min(1, this.collapseT + dt / 0.6);
    const k = this.collapseT;
    const sink = k * k * (3 - 2 * k);
    const m = this.inst.mesh;
    m.scale.set(1 + sink * 0.1, Math.max(0.02, 1 - sink * 0.96), 1 + sink * 0.1);
    m.position.y = -sink * 0.25;
    m.rotation.z = Math.sin(k * 46) * 0.05 * (1 - k);
    if (k >= 1) m.visible = false;
    this.rubble?.scale.setScalar(0.3 + 0.7 * Math.min(1, k * 1.4));
  }

  dispose(): void {
    this.inst.mesh.removeFromParent();
    this.inst.mesh.skeleton.dispose();
    this.rubble?.removeFromParent();
    (this.rubble?.material as MeshLambertMaterial | undefined)?.dispose();
    this.mat.dispose();
  }
}

// ───────── 投射物 ─────────

const projGeoCache = new Map<string, BufferGeometry>();

function projGeometry(kind: string): BufferGeometry {
  let g = projGeoCache.get(kind);
  if (g) return g;
  const k = new Kit();
  k.addBone('root', -1, [0, 0, 0]);
  switch (kind) {
    case 'arrow':
    case 'tower-arrow':
      k.cyl(0.025, 0.025, 0.7, { rot: [Math.PI / 2, 0, 0], color: '#8a5a2e' }, 5);
      k.cone(0.06, 0.16, { at: [0, 0, 0.42], rot: [Math.PI / 2, 0, 0], color: '#cfd6de' }, 5);
      k.box(0.12, 0.02, 0.14, { at: [0, 0, -0.3], color: kind === 'tower-arrow' ? '#ffffff' : '#5fbf7a' });
      break;
    case 'spear':
      k.cyl(0.03, 0.03, 0.9, { rot: [Math.PI / 2, 0, 0], color: '#8a5a2e' }, 5);
      k.cone(0.07, 0.2, { at: [0, 0, 0.55], rot: [Math.PI / 2, 0, 0], color: '#dfe5ec' }, 5);
      break;
    case 'bomb':
      k.sphere(0.2, { color: '#2a2c33' }, 10);
      k.cyl(0.03, 0.03, 0.12, { at: [0, 0.22, 0], color: '#c9a24a' }, 5);
      break;
    case 'cannonball':
    case 'king-ball':
      k.sphere(kind === 'king-ball' ? 0.24 : 0.18, { color: '#30343b' }, 10);
      break;
    case 'rocket':
      k.cyl(0.16, 0.16, 1.0, { rot: [Math.PI / 2, 0, 0], color: '#d8d0bc' }, 10);
      k.cone(0.17, 0.4, { at: [0, 0, 0.7], rot: [Math.PI / 2, 0, 0], color: '#c0392b' }, 10);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        k.box(0.04, 0.3, 0.3, { at: [Math.cos(a) * 0.2, Math.sin(a) * 0.2, -0.4], rot: [0, 0, a], color: '#c0392b' });
      }
      break;
    case 'barrel':
      k.cyl(0.38, 0.38, 0.7, { rot: [0, 0, Math.PI / 2], color: '#9a6834' }, 12);
      k.torus(0.39, 0.04, { at: [0.22, 0, 0], rot: [0, Math.PI / 2, 0], color: '#5a5f6b' }, 14);
      k.torus(0.39, 0.04, { at: [-0.22, 0, 0], rot: [0, Math.PI / 2, 0], color: '#5a5f6b' }, 14);
      break;
    case 'log':
      k.cyl(0.38, 0.38, 3.9, { rot: [0, 0, Math.PI / 2], color: '#8a5a2e' }, 12);
      k.cyl(0.33, 0.33, 0.05, { at: [1.96, 0, 0], rot: [0, 0, Math.PI / 2], color: '#d9b77a' }, 12);
      k.cyl(0.33, 0.33, 0.05, { at: [-1.96, 0, 0], rot: [0, 0, Math.PI / 2], color: '#d9b77a' }, 12);
      for (let i = 0; i < 6; i++) k.cone(0.06, 0.25, { at: [-1.6 + i * 0.65, 0.36, 0], color: '#6b4426' }, 4);
      break;
    case 'gsbomb':
      k.sphere(0.45, { color: '#2a2c33' }, 12);
      k.cyl(0.05, 0.05, 0.2, { at: [0, 0.5, 0], color: '#c9a24a' }, 5);
      break;
    default:
      k.sphere(0.16, { color: '#ffffff' }, 8);
  }
  g = k.build(1).geometry;
  g.userData.shared = true;
  projGeoCache.set(kind, g);
  return g;
}

const GLOW: Record<string, { color: string; r: number; trail: 'fire' | 'magic' | 'ice' | 'spark' | 'smoke' | null }> = {
  bullet: { color: '#fff2a8', r: 0.11, trail: 'spark' },
  fireball: { color: '#ff9a3a', r: 0.3, trail: 'fire' },
  fire: { color: '#ff8a2a', r: 0.26, trail: 'fire' },
  magic: { color: '#c86bff', r: 0.24, trail: 'magic' },
  ice: { color: '#bfe8ff', r: 0.26, trail: 'ice' },
  spit: { color: '#7fe0ff', r: 0.14, trail: null },
};

const glowGeo = new SphereGeometry(1, 10, 8);
glowGeo.userData.shared = true;
const sharedLambert = new MeshLambertMaterial({ vertexColors: true });
const glowMats = new Map<string, MeshBasicMaterial>();

export function makeProjectileMesh(visual: string): Mesh {
  const glow = GLOW[visual];
  if (glow) {
    // 同一種發光投射物共用材質，避免每發子彈都建立新材質
    let mat = glowMats.get(visual);
    if (!mat) {
      mat = new MeshBasicMaterial({ color: glow.color, transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false });
      glowMats.set(visual, mat);
    }
    const m = new Mesh(glowGeo, mat);
    m.scale.setScalar(glow.r);
    m.userData.trail = glow.trail;
    return m;
  }
  const m = new Mesh(projGeometry(visual), sharedLambert);
  m.castShadow = true;
  m.userData.trail = visual === 'bomb' ? 'spark' : visual === 'rocket' ? 'smoke' : null;
  return m;
}

export function trailOf(m: Mesh): 'fire' | 'magic' | 'ice' | 'spark' | 'smoke' | null {
  return m.userData.trail ?? null;
}

// ───────── 飛行單位的地面影子（一個 InstancedMesh 全部畫完） ─────────

export class BlobShadows {
  readonly mesh: InstancedMesh;
  private dummy = new Object3D();
  private n = 0;

  constructor(private readonly cap = 160) {
    const mat = new MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.28, depthWrite: false });
    this.mesh = new InstancedMesh(new CircleGeometry(1, 16), mat, cap);
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.renderOrder = 1;
    this.mesh.frustumCulled = false;
  }

  begin(): void {
    this.n = 0;
  }

  add(x: number, z: number, r: number): void {
    if (this.n >= this.cap) return;
    this.dummy.position.set(x, 0.04, z);
    this.dummy.rotation.set(-Math.PI / 2, 0, 0);
    this.dummy.scale.set(r, r * 0.8, 1);
    this.dummy.updateMatrix();
    this.mesh.setMatrixAt(this.n++, this.dummy.matrix);
  }

  end(): void {
    this.mesh.count = this.n;
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}

/** 單位大小（畫面上的血條寬度、影子大小用）。 */
export function visualRadius(unit: string): number {
  const u = UNITS[unit];
  if (!u) return 1.4;
  return u.stats.half ?? u.stats.radius;
}

export { Group };
