import {
  Bone, BoxGeometry, BufferAttribute, BufferGeometry, CapsuleGeometry, Color, ConeGeometry, CylinderGeometry, DodecahedronGeometry,
  Euler, IcosahedronGeometry, LatheGeometry, Matrix4, Quaternion, Skeleton, SkinnedMesh, SphereGeometry, TorusGeometry, Vector2, Vector3,
  type Material,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// 程式建模工具：把簡單幾何體（方塊、球、膠囊、圓柱…）組合成一個網格，
// 每個零件綁定到一根骨頭（剛性綁定），整隻角色只需一次繪製呼叫，由程式控制骨頭做動畫。

export type V3 = [number, number, number];

export interface BoneDef {
  name: string;
  parent: number; // -1 = 根
  at: V3; // 模型空間中的關節位置（靜止姿勢）
}

export interface PartOpts {
  at?: V3;
  rot?: V3;
  scale?: V3;
  color: string;
  bone?: number;
}

export interface ModelAsset {
  geometry: BufferGeometry;
  bones: BoneDef[];
  boneInverses: Matrix4[];
  height: number; // 模型大約高度（格），用來放血條
}

const tmpColor = new Color();

export class Kit {
  private geos: BufferGeometry[] = [];
  bones: BoneDef[] = [];
  /** 之後加入的零件預設綁到這根骨頭。 */
  bone = 0;

  addBone(name: string, parent: number, at: V3): number {
    this.bones.push({ name, parent, at });
    return this.bones.length - 1;
  }

  boneIndex(name: string): number {
    const i = this.bones.findIndex((b) => b.name === name);
    if (i < 0) throw new Error(`bone ${name}`);
    return i;
  }

  add(src: BufferGeometry, o: PartOpts): this {
    const g = src.index ? src : src.toNonIndexed();
    if (!g.index) {
      // 非索引幾何（極少用到）轉成有索引，與其他零件一致才能合併
      const n = g.attributes.position.count;
      const idx = new Uint32Array(n);
      for (let i = 0; i < n; i++) idx[i] = i;
      g.setIndex(new BufferAttribute(idx, 1));
    }
    for (const name of Object.keys(g.attributes)) if (name !== 'position' && name !== 'normal') g.deleteAttribute(name);
    const m = new Matrix4().compose(
      new Vector3(...(o.at ?? [0, 0, 0])),
      new Quaternion().setFromEuler(new Euler(...(o.rot ?? [0, 0, 0]))),
      new Vector3(...(o.scale ?? [1, 1, 1])),
    );
    g.applyMatrix4(m);
    const n = g.attributes.position.count;
    tmpColor.set(o.color);
    const col = new Float32Array(n * 3);
    const si = new Uint16Array(n * 4);
    const sw = new Float32Array(n * 4);
    const bone = o.bone ?? this.bone;
    for (let i = 0; i < n; i++) {
      col[i * 3] = tmpColor.r;
      col[i * 3 + 1] = tmpColor.g;
      col[i * 3 + 2] = tmpColor.b;
      si[i * 4] = bone;
      sw[i * 4] = 1;
    }
    g.setAttribute('color', new BufferAttribute(col, 3));
    g.setAttribute('skinIndex', new BufferAttribute(si, 4));
    g.setAttribute('skinWeight', new BufferAttribute(sw, 4));
    this.geos.push(g);
    return this;
  }

  box(w: number, h: number, d: number, o: PartOpts): this {
    return this.add(new BoxGeometry(w, h, d), o);
  }

  /** 圓角方塊：以縮放過的低面數球近似（卡通感較方塊柔和）。 */
  blob(w: number, h: number, d: number, o: PartOpts, seg = 10): this {
    const s = o.scale ?? [1, 1, 1];
    return this.add(new SphereGeometry(0.5, seg, Math.max(6, Math.round(seg * 0.75))), { ...o, scale: [w * s[0], h * s[1], d * s[2]] });
  }

  sphere(r: number, o: PartOpts, seg = 12): this {
    return this.add(new SphereGeometry(r, seg, Math.max(6, Math.round(seg * 0.7))), o);
  }

  /** 半球／球殼：thetaLen 控制從頂部往下包多少（π/2 = 半球）；phi 參數可在正面留開口。 */
  shell(r: number, o: PartOpts, thetaLen = Math.PI / 2, phiStart = 0, phiLen = Math.PI * 2, seg = 14): this {
    const g = new SphereGeometry(r, seg, Math.max(5, Math.round(seg * 0.6)), phiStart, phiLen, 0, thetaLen);
    // 開口的殼兩面都要看得到：再疊一層法線反向的內殼
    const inner = g.clone();
    inner.scale(0.97, 0.97, 0.97);
    const idx = inner.index!;
    for (let i = 0; i < idx.count; i += 3) {
      const a = idx.getX(i);
      idx.setX(i, idx.getX(i + 2));
      idx.setX(i + 2, a);
    }
    const nrm = inner.attributes.normal;
    for (let i = 0; i < nrm.count; i++) nrm.setXYZ(i, -nrm.getX(i), -nrm.getY(i), -nrm.getZ(i));
    this.add(g, o);
    return this.add(inner, { ...o, color: o.color });
  }

  capsule(r: number, len: number, o: PartOpts, seg = 8): this {
    return this.add(new CapsuleGeometry(r, len, 3, seg), o);
  }

  cyl(rTop: number, rBot: number, h: number, o: PartOpts, seg = 10): this {
    return this.add(new CylinderGeometry(rTop, rBot, h, seg), o);
  }

  cone(r: number, h: number, o: PartOpts, seg = 10): this {
    return this.add(new ConeGeometry(r, h, seg), o);
  }

  torus(R: number, r: number, o: PartOpts, seg = 14, arc = Math.PI * 2): this {
    return this.add(new TorusGeometry(R, r, 6, seg, arc), o);
  }

  rock(r: number, o: PartOpts, detail = 0): this {
    return this.add(new IcosahedronGeometry(r, detail), o);
  }

  gem(r: number, o: PartOpts): this {
    return this.add(new DodecahedronGeometry(r, 0), o);
  }

  /** 旋轉體：points 為 [半徑, 高度] 由下而上。 */
  lathe(points: [number, number][], o: PartOpts, seg = 12): this {
    return this.add(new LatheGeometry(points.map(([r, y]) => new Vector2(r, y)), seg), o);
  }

  build(height: number): ModelAsset {
    const geometry = mergeGeometries(this.geos, false);
    if (!geometry) throw new Error('merge failed');
    geometry.computeBoundingSphere();
    for (const g of this.geos) g.dispose();
    this.geos = [];
    const bones = this.bones.length ? this.bones : [{ name: 'root', parent: -1, at: [0, 0, 0] as V3 }];
    // 靜止姿勢下每根骨頭的世界矩陣只有位移，反矩陣就是負位移
    const boneInverses = bones.map((b) => new Matrix4().makeTranslation(-b.at[0], -b.at[1], -b.at[2]));
    return { geometry, bones, boneInverses, height };
  }
}

export interface ModelInstance {
  mesh: SkinnedMesh;
  bones: Bone[];
  byName: Record<string, Bone>;
  rest: Vector3[]; // 每根骨頭相對父骨頭的靜止位置（動畫做位移時用）
}

export function instantiate(asset: ModelAsset, material: Material): ModelInstance {
  const bones = asset.bones.map((b) => {
    const bone = new Bone();
    bone.name = b.name;
    return bone;
  });
  const rest: Vector3[] = [];
  asset.bones.forEach((b, i) => {
    const p = b.parent >= 0 ? asset.bones[b.parent].at : [0, 0, 0];
    bones[i].position.set(b.at[0] - p[0], b.at[1] - p[1], b.at[2] - p[2]);
    rest.push(bones[i].position.clone());
    if (b.parent >= 0) bones[b.parent].add(bones[i]);
  });
  const mesh = new SkinnedMesh(asset.geometry, material);
  mesh.add(bones[0]);
  mesh.updateMatrixWorld(true);
  mesh.bind(new Skeleton(bones, asset.boneInverses.map((m) => m.clone())));
  mesh.frustumCulled = false;
  mesh.castShadow = true;
  const byName: Record<string, Bone> = {};
  for (const b of bones) byName[b.name] = b;
  return { mesh, bones, byName, rest };
}

/** 依名稱讀骨頭，沒有就回傳 undefined（動畫共用時方便判斷）。 */
export function boneOf(inst: ModelInstance, name: string): Bone | undefined {
  return inst.byName[name];
}
