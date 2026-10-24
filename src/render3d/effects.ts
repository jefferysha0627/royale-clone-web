import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CircleGeometry, Color, CylinderGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial, NormalBlending,
  Points, RingGeometry, ShaderMaterial, SphereGeometry, Vector3, type Blending,
} from 'three';

// 特效：兩組粒子（一般混合：煙塵碎石；加法混合：火花火焰），加上擴散光環、焦痕、閃電與光束。
// 全部使用物件池，數量有上限，不會隨對戰時間增加。

const PARTICLE_VERT = `
attribute float aSize;
attribute float aAlpha;
attribute vec3 aColor;
uniform float uScale;
varying float vAlpha;
varying vec3 vColor;
void main() {
  vAlpha = aAlpha;
  vColor = aColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uScale;
}`;

const PARTICLE_FRAG = `
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d);
  float a = smoothstep(0.5, 0.18, r) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
  #include <colorspace_fragment>
}`;

interface PState {
  life: number;
  max: number;
  vx: number;
  vy: number;
  vz: number;
  grav: number;
  drag: number;
  size0: number;
  size1: number;
  a0: number;
  r: number;
  g: number;
  b: number;
  r1: number;
  g1: number;
  b1: number;
}

class ParticlePool {
  readonly points: Points;
  private pos: Float32Array;
  private col: Float32Array;
  private size: Float32Array;
  private alpha: Float32Array;
  private st: PState[] = [];
  private next = 0;
  readonly material: ShaderMaterial;
  count = 0;

  constructor(private readonly cap: number, blending: Blending) {
    const geo = new BufferGeometry();
    this.pos = new Float32Array(cap * 3);
    this.col = new Float32Array(cap * 3);
    this.size = new Float32Array(cap);
    this.alpha = new Float32Array(cap);
    geo.setAttribute('position', new BufferAttribute(this.pos, 3));
    geo.setAttribute('aColor', new BufferAttribute(this.col, 3));
    geo.setAttribute('aSize', new BufferAttribute(this.size, 1));
    geo.setAttribute('aAlpha', new BufferAttribute(this.alpha, 1));
    this.material = new ShaderMaterial({
      uniforms: { uScale: { value: 20 } },
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      blending,
    });
    this.points = new Points(geo, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = blending === AdditiveBlending ? 6 : 5;
    for (let i = 0; i < cap; i++) {
      this.st.push({ life: 0, max: 0, vx: 0, vy: 0, vz: 0, grav: 0, drag: 0, size0: 0, size1: 0, a0: 0, r: 0, g: 0, b: 0, r1: 0, g1: 0, b1: 0 });
    }
  }

  emit(x: number, y: number, z: number, vx: number, vy: number, vz: number, life: number, size0: number, size1: number, c0: Color, c1: Color, alpha: number, grav: number, drag: number): void {
    const i = this.next;
    this.next = (this.next + 1) % this.cap;
    const s = this.st[i];
    s.life = life;
    s.max = life;
    s.vx = vx;
    s.vy = vy;
    s.vz = vz;
    s.grav = grav;
    s.drag = drag;
    s.size0 = size0;
    s.size1 = size1;
    s.a0 = alpha;
    s.r = c0.r;
    s.g = c0.g;
    s.b = c0.b;
    s.r1 = c1.r;
    s.g1 = c1.g;
    s.b1 = c1.b;
    this.pos[i * 3] = x;
    this.pos[i * 3 + 1] = y;
    this.pos[i * 3 + 2] = z;
  }

  update(dt: number): void {
    let alive = 0;
    for (let i = 0; i < this.cap; i++) {
      const s = this.st[i];
      if (s.life <= 0) {
        if (this.alpha[i] !== 0) this.alpha[i] = 0;
        continue;
      }
      alive++;
      s.life -= dt;
      const k = 1 - Math.max(0, s.life) / s.max; // 0 → 1
      const damp = Math.max(0, 1 - s.drag * dt);
      s.vx *= damp;
      s.vz *= damp;
      s.vy = s.vy * damp - s.grav * dt;
      this.pos[i * 3] += s.vx * dt;
      this.pos[i * 3 + 1] += s.vy * dt;
      this.pos[i * 3 + 2] += s.vz * dt;
      if (this.pos[i * 3 + 1] < 0.02 && s.grav > 0) {
        this.pos[i * 3 + 1] = 0.02;
        s.vy = Math.abs(s.vy) * 0.3;
        s.vx *= 0.6;
        s.vz *= 0.6;
      }
      this.size[i] = s.size0 + (s.size1 - s.size0) * k;
      this.alpha[i] = s.a0 * (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85);
      this.col[i * 3] = s.r + (s.r1 - s.r) * k;
      this.col[i * 3 + 1] = s.g + (s.g1 - s.g) * k;
      this.col[i * 3 + 2] = s.b + (s.b1 - s.b) * k;
    }
    this.count = alive;
    const g = this.points.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.aColor.needsUpdate = true;
    g.attributes.aSize.needsUpdate = true;
    g.attributes.aAlpha.needsUpdate = true;
  }

  clear(): void {
    for (const s of this.st) s.life = 0;
    this.alpha.fill(0);
  }
}

interface RingFx {
  mesh: Mesh;
  t: number;
  life: number;
  r0: number;
  r1: number;
  a0: number;
}

interface DecalFx {
  mesh: Mesh;
  t: number;
  life: number;
}

interface BoltFx {
  mesh: Mesh;
  t: number;
  life: number;
}

interface FlashFx {
  mesh: Mesh;
  t: number;
  life: number;
  r0: number;
  r1: number;
  a0: number;
}

const tmpC0 = new Color();
const tmpC1 = new Color();

export type Burst =
  | 'dust' | 'smoke' | 'spark' | 'fire' | 'ice' | 'poison' | 'debris' | 'magic' | 'blood' | 'splinter' | 'elixir' | 'stun' | 'heal' | 'water' | 'rage';

export class Effects {
  readonly group = new Group();
  private soft = new ParticlePool(1400, NormalBlending);
  private glow = new ParticlePool(1400, AdditiveBlending);
  private rings: RingFx[] = [];
  private decals: DecalFx[] = [];
  private bolts: BoltFx[] = [];
  private flashes: FlashFx[] = [];
  private flashGeo = new SphereGeometry(1, 16, 12);
  private ringGeo = new RingGeometry(0.86, 1, 40);
  private discGeo = new CircleGeometry(1, 28);
  private boltGeo = new CylinderGeometry(0.06, 0.06, 1, 4, 1, true);

  constructor() {
    this.group.add(this.soft.points, this.glow.points);
    this.boltGeo.translate(0, 0.5, 0);
  }

  setScale(pxPerUnit: number): void {
    this.soft.material.uniforms.uScale.value = pxPerUnit;
    this.glow.material.uniforms.uScale.value = pxPerUnit;
  }

  /** 進行中的特效數（物件池裡閒置的不算）。 */
  get count(): number {
    const active = (list: { t: number; life: number }[]) => list.filter((f) => f.t < f.life).length;
    return this.soft.count + this.glow.count + active(this.rings) + active(this.decals) + active(this.bolts) + active(this.flashes);
  }

  /** 在 (x, y, z) 產生一團粒子。power 大約對應範圍（格）。 */
  burst(kind: Burst, x: number, y: number, z: number, power = 1, n?: number): void {
    const R = Math.random;
    const emitN = (count: number, f: (i: number) => void) => {
      for (let i = 0; i < count; i++) f(i);
    };
    switch (kind) {
      case 'dust':
        emitN(n ?? Math.round(10 * power), () => {
          const a = R() * Math.PI * 2;
          const sp = (0.8 + R() * 1.6) * power;
          tmpC0.set('#d9c9a8');
          tmpC1.set('#bfae8c');
          this.soft.emit(x, y + 0.1, z, Math.cos(a) * sp, 0.4 + R() * 0.6, Math.sin(a) * sp, 0.5 + R() * 0.4, 0.35 * power, 0.9 * power, tmpC0, tmpC1, 0.7, 0.6, 3);
        });
        break;
      case 'smoke':
        emitN(n ?? Math.round(8 * power), () => {
          tmpC0.set('#d8d4cc');
          tmpC1.set('#f4f2ee');
          const sz = Math.min(1.1, 0.45 * power);
          this.soft.emit(x + (R() - 0.5) * power * 0.8, y + R() * 0.3, z + (R() - 0.5) * power * 0.8, (R() - 0.5) * 0.8, 0.9 + R() * 0.8, (R() - 0.5) * 0.8, 0.7 + R() * 0.6, sz, sz * 2, tmpC0, tmpC1, 0.42, -0.2, 1.5);
        });
        break;
      case 'spark':
        emitN(n ?? Math.round(8 * power), () => {
          const a = R() * Math.PI * 2;
          const sp = (2 + R() * 4) * power;
          tmpC0.set('#fff7c2');
          tmpC1.set('#ffb347');
          this.glow.emit(x, y, z, Math.cos(a) * sp, 1 + R() * 3, Math.sin(a) * sp, 0.18 + R() * 0.2, 0.22, 0.05, tmpC0, tmpC1, 1, 9, 2);
        });
        break;
      case 'fire':
        emitN(n ?? Math.round(14 * power), () => {
          const a = R() * Math.PI * 2;
          const sp = (0.5 + R() * 2.5) * power;
          tmpC0.set(R() < 0.5 ? '#ffe08a' : '#ffb347');
          tmpC1.set('#d8401a');
          this.glow.emit(x, y + R() * 0.3, z, Math.cos(a) * sp, 0.6 + R() * 1.8, Math.sin(a) * sp, 0.35 + R() * 0.35, 0.7 * power, 0.25 * power, tmpC0, tmpC1, 0.9, -1, 3);
        });
        break;
      case 'ice':
        emitN(n ?? Math.round(12 * power), () => {
          const a = R() * Math.PI * 2;
          const sp = (0.8 + R() * 2) * power;
          tmpC0.set('#f2fbff');
          tmpC1.set('#7fd3ff');
          this.glow.emit(x, y + R() * 0.4, z, Math.cos(a) * sp, 0.5 + R() * 1.5, Math.sin(a) * sp, 0.4 + R() * 0.4, 0.3 * power, 0.1, tmpC0, tmpC1, 0.9, 3, 2);
        });
        break;
      case 'poison':
        emitN(n ?? Math.round(4 * power), () => {
          const a = R() * Math.PI * 2;
          const rr = Math.sqrt(R()) * power;
          tmpC0.set('#b8f06a');
          tmpC1.set('#4f8f2a');
          this.soft.emit(x + Math.cos(a) * rr, y + 0.05, z + Math.sin(a) * rr, 0, 0.5 + R() * 0.6, 0, 0.8 + R() * 0.6, 0.35, 0.6, tmpC0, tmpC1, 0.6, -0.2, 1);
        });
        break;
      case 'debris':
        emitN(n ?? Math.round(12 * power), () => {
          const a = R() * Math.PI * 2;
          const sp = (1.5 + R() * 3) * power;
          tmpC0.set(R() < 0.5 ? '#9a958a' : '#7a7468');
          tmpC1.set('#6a655a');
          this.soft.emit(x, y + 0.4, z, Math.cos(a) * sp, 3 + R() * 4, Math.sin(a) * sp, 0.8 + R() * 0.5, 0.32, 0.28, tmpC0, tmpC1, 1, 14, 0.5);
        });
        break;
      case 'splinter':
        emitN(n ?? 10, () => {
          const a = R() * Math.PI * 2;
          const sp = 2 + R() * 2.5;
          tmpC0.set('#b07a42');
          tmpC1.set('#7a5230');
          this.soft.emit(x, y + 0.3, z, Math.cos(a) * sp, 2 + R() * 3, Math.sin(a) * sp, 0.6 + R() * 0.3, 0.2, 0.16, tmpC0, tmpC1, 1, 12, 0.5);
        });
        break;
      case 'magic':
        emitN(n ?? Math.round(10 * power), () => {
          const a = R() * Math.PI * 2;
          const sp = (0.6 + R() * 1.8) * power;
          tmpC0.set('#e6b8ff');
          tmpC1.set('#7a2fd0');
          this.glow.emit(x, y + R() * 0.3, z, Math.cos(a) * sp, 0.4 + R() * 1.2, Math.sin(a) * sp, 0.4 + R() * 0.3, 0.35 * power, 0.1, tmpC0, tmpC1, 0.9, 0, 2);
        });
        break;
      case 'elixir':
        emitN(n ?? 10, () => {
          const a = R() * Math.PI * 2;
          const sp = 0.8 + R() * 1.2;
          tmpC0.set('#ffb8f0');
          tmpC1.set('#c03ad8');
          this.glow.emit(x, y + 0.2, z, Math.cos(a) * sp, 1 + R(), Math.sin(a) * sp, 0.45 + R() * 0.2, 0.28, 0.08, tmpC0, tmpC1, 0.9, 2, 2);
        });
        break;
      case 'rage':
        // 狂暴：從地面往上冒的紅色火花
        emitN(n ?? Math.round(6 * power), () => {
          const a = R() * Math.PI * 2;
          const r = Math.sqrt(R()) * power;
          tmpC0.set(R() < 0.5 ? '#ff9ab0' : '#ff6a88');
          tmpC1.set('#a0163a');
          this.glow.emit(x + Math.cos(a) * r, y, z + Math.sin(a) * r, 0, 1.2 + R() * 1.2, 0, 0.5 + R() * 0.4, 0.3, 0.06, tmpC0, tmpC1, 0.9, -0.5, 1);
        });
        break;
      case 'stun':
        emitN(n ?? 6, () => {
          const a = R() * Math.PI * 2;
          tmpC0.set('#fffbd0');
          tmpC1.set('#8fdcff');
          this.glow.emit(x + Math.cos(a) * 0.3, y, z + Math.sin(a) * 0.3, Math.cos(a) * 1.2, 1.5 + R(), Math.sin(a) * 1.2, 0.25, 0.25, 0.05, tmpC0, tmpC1, 1, 4, 1);
        });
        break;
      case 'heal':
      case 'blood':
      case 'water':
        emitN(n ?? 8, () => {
          const a = R() * Math.PI * 2;
          tmpC0.set(kind === 'water' ? '#e8f7ff' : '#ffffff');
          tmpC1.set(kind === 'water' ? '#6fc3ff' : '#dddddd');
          this.soft.emit(x, y, z, Math.cos(a) * 1.5, 1.5 + R() * 2, Math.sin(a) * 1.5, 0.4, 0.2, 0.1, tmpC0, tmpC1, 0.9, 8, 1);
        });
        break;
    }
  }

  /** 拖尾：每幀從移動物體呼叫。 */
  trail(kind: 'fire' | 'smoke' | 'magic' | 'ice' | 'spark', x: number, y: number, z: number): void {
    const R = Math.random;
    switch (kind) {
      case 'fire':
        tmpC0.set('#ffd36b');
        tmpC1.set('#d8401a');
        this.glow.emit(x + (R() - 0.5) * 0.15, y + (R() - 0.5) * 0.15, z + (R() - 0.5) * 0.15, 0, 0.6, 0, 0.3, 0.55, 0.15, tmpC0, tmpC1, 0.9, -1, 1);
        break;
      case 'smoke':
        tmpC0.set('#c9c9c9');
        tmpC1.set('#efefef');
        this.soft.emit(x, y, z, (R() - 0.5) * 0.3, 0.3, (R() - 0.5) * 0.3, 0.8, 0.3, 0.9, tmpC0, tmpC1, 0.5, -0.3, 1);
        break;
      case 'magic':
        tmpC0.set('#f0c8ff');
        tmpC1.set('#7a2fd0');
        this.glow.emit(x, y, z, (R() - 0.5) * 0.5, 0.3, (R() - 0.5) * 0.5, 0.35, 0.35, 0.05, tmpC0, tmpC1, 0.9, 0, 1);
        break;
      case 'ice':
        tmpC0.set('#ffffff');
        tmpC1.set('#7fd3ff');
        this.glow.emit(x, y, z, (R() - 0.5) * 0.4, 0.2, (R() - 0.5) * 0.4, 0.3, 0.3, 0.05, tmpC0, tmpC1, 0.9, 0, 1);
        break;
      case 'spark':
        tmpC0.set('#fff2a8');
        tmpC1.set('#ff8a2a');
        this.glow.emit(x, y, z, (R() - 0.5) * 1.5, R() * 1.5, (R() - 0.5) * 1.5, 0.2, 0.15, 0.04, tmpC0, tmpC1, 1, 6, 1);
        break;
    }
  }

  ring(x: number, z: number, r0: number, r1: number, color: string, life = 0.45, alpha = 0.85, y = 0.06): void {
    let fx = this.rings.find((f) => f.t >= f.life);
    if (!fx) {
      if (this.rings.length >= 40) return;
      const mesh = new Mesh(this.ringGeo, new MeshBasicMaterial({ transparent: true, depthWrite: false, side: DoubleSide }));
      mesh.rotation.x = -Math.PI / 2;
      mesh.renderOrder = 4;
      this.group.add(mesh);
      fx = { mesh, t: 0, life, r0, r1, a0: alpha };
      this.rings.push(fx);
    }
    fx.t = 0;
    fx.life = life;
    fx.r0 = r0;
    fx.r1 = r1;
    fx.a0 = alpha;
    fx.mesh.visible = true;
    fx.mesh.position.set(x, y, z);
    (fx.mesh.material as MeshBasicMaterial).color.set(color);
  }

  decal(x: number, z: number, r: number, color = '#2a2218', life = 4): void {
    let fx = this.decals.find((f) => f.t >= f.life);
    if (!fx) {
      if (this.decals.length >= 24) return;
      const mesh = new Mesh(this.discGeo, new MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: 0.3 }));
      mesh.rotation.x = -Math.PI / 2;
      mesh.renderOrder = 1;
      this.group.add(mesh);
      fx = { mesh, t: 0, life };
      this.decals.push(fx);
    }
    fx.t = 0;
    fx.life = life;
    fx.mesh.visible = true;
    fx.mesh.position.set(x, 0.025, z);
    fx.mesh.scale.setScalar(r);
    (fx.mesh.material as MeshBasicMaterial).color.set(color);
  }

  /** 爆炸瞬間的閃光：發光球快速膨脹後淡出（火球、火箭、炸彈、塔倒塌）。 */
  flash(x: number, y: number, z: number, r0: number, r1: number, color: string, life = 0.28, alpha = 0.9): void {
    let fx = this.flashes.find((f) => f.t >= f.life);
    if (!fx) {
      if (this.flashes.length >= 16) return;
      const mesh = new Mesh(this.flashGeo, new MeshBasicMaterial({ transparent: true, depthWrite: false, blending: AdditiveBlending }));
      mesh.renderOrder = 8;
      this.group.add(mesh);
      fx = { mesh, t: 0, life, r0, r1, a0: alpha };
      this.flashes.push(fx);
    }
    fx.t = 0;
    fx.life = life;
    fx.r0 = r0;
    fx.r1 = r1;
    fx.a0 = alpha;
    fx.mesh.visible = true;
    fx.mesh.position.set(x, y, z);
    fx.mesh.scale.setScalar(r0);
    (fx.mesh.material as MeshBasicMaterial).color.set(color);
  }

  /** 從高空劈到 (x, z) 的鋸齒閃電。 */
  bolt(x: number, z: number, color = '#bfe8ff'): void {
    const segs = 5;
    let px = x + (Math.random() - 0.5) * 1.5;
    let py = 7;
    let pz = z - 1.5;
    for (let i = 1; i <= segs; i++) {
      const t = i / segs;
      const nx = i === segs ? x : x + (Math.random() - 0.5) * 1.2 * (1 - t);
      const ny = 7 * (1 - t) + 0.1;
      const nz = i === segs ? z : z - 1.5 * (1 - t) + (Math.random() - 0.5) * 0.6;
      this.segment(new Vector3(px, py, pz), new Vector3(nx, ny, nz), color, 0.22);
      px = nx;
      py = ny;
      pz = nz;
    }
  }

  /** 兩點之間的鋸齒電弧（閃電法師的電擊、電磁炮的放電）。 */
  arc(ax: number, ay: number, az: number, bx: number, by: number, bz: number, color = '#bfe8ff', jitter = 0.35): void {
    const segs = 4;
    let p = new Vector3(ax, ay, az);
    for (let i = 1; i <= segs; i++) {
      const t = i / segs;
      const n =
        i === segs
          ? new Vector3(bx, by, bz)
          : new Vector3(ax + (bx - ax) * t + (Math.random() - 0.5) * jitter, ay + (by - ay) * t + (Math.random() - 0.5) * jitter, az + (bz - az) * t + (Math.random() - 0.5) * jitter);
      this.segment(p, n, color, 0.16);
      p = n;
    }
  }

  private segment(a: Vector3, b: Vector3, color: string, life: number): void {
    let fx = this.bolts.find((f) => f.t >= f.life);
    if (!fx) {
      if (this.bolts.length >= 60) return;
      const mesh = new Mesh(this.boltGeo, new MeshBasicMaterial({ transparent: true, depthWrite: false, blending: AdditiveBlending }));
      mesh.renderOrder = 7;
      this.group.add(mesh);
      fx = { mesh, t: 0, life };
      this.bolts.push(fx);
    }
    fx.t = 0;
    fx.life = life;
    fx.mesh.visible = true;
    const d = b.clone().sub(a);
    const len = d.length();
    fx.mesh.position.copy(a);
    fx.mesh.scale.set(1.6, len, 1.6);
    fx.mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), d.normalize());
    (fx.mesh.material as MeshBasicMaterial).color.set(color);
  }

  update(dt: number): void {
    this.soft.update(dt);
    this.glow.update(dt);
    for (const f of this.rings) {
      if (f.t >= f.life) continue;
      f.t += dt;
      const k = Math.min(1, f.t / f.life);
      const r = f.r0 + (f.r1 - f.r0) * (1 - (1 - k) * (1 - k));
      f.mesh.scale.setScalar(Math.max(0.01, r));
      (f.mesh.material as MeshBasicMaterial).opacity = f.a0 * (1 - k);
      if (f.t >= f.life) f.mesh.visible = false;
    }
    for (const f of this.decals) {
      if (f.t >= f.life) continue;
      f.t += dt;
      const k = f.t / f.life;
      (f.mesh.material as MeshBasicMaterial).opacity = 0.3 * (k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3);
      if (f.t >= f.life) f.mesh.visible = false;
    }
    for (const f of this.flashes) {
      if (f.t >= f.life) continue;
      f.t += dt;
      const k = Math.min(1, f.t / f.life);
      f.mesh.scale.setScalar(f.r0 + (f.r1 - f.r0) * (1 - (1 - k) * (1 - k) * (1 - k)));
      (f.mesh.material as MeshBasicMaterial).opacity = f.a0 * (1 - k) * (1 - k);
      if (f.t >= f.life) f.mesh.visible = false;
    }
    for (const f of this.bolts) {
      if (f.t >= f.life) continue;
      f.t += dt;
      (f.mesh.material as MeshBasicMaterial).opacity = Math.max(0, 1 - f.t / f.life) * (Math.random() < 0.3 ? 0.4 : 1);
      if (f.t >= f.life) f.mesh.visible = false;
    }
  }

  clear(): void {
    this.soft.clear();
    this.glow.clear();
    for (const f of [...this.rings, ...this.decals, ...this.bolts, ...this.flashes]) {
      f.t = f.life;
      f.mesh.visible = false;
    }
  }
}
