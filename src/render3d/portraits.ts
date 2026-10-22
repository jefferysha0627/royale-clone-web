import {
  AmbientLight, Box3, Color, DirectionalLight, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, OrthographicCamera, Scene, SphereGeometry, SRGBColorSpace,
  Vector3, WebGLRenderer, type Object3D,
} from 'three';
import { CARDS, UNITS } from '../sim';
import { animate, newAnimState } from './anim';
import { TEAM_RGB } from './coords';
import { instantiate, Kit } from './kit';
import { toonMaterial } from './materials';
import { getAsset, profileOf } from './models';

// 卡面圖：用遊戲內同一套原創 3D 模型即時渲染成小圖（透明背景），不需要下載任何圖檔。
// 在閒置時間分批產生，完成前卡面先顯示文字圖示。

const W = 192;
const H = 232;

type Listener = () => void;

class PortraitStore {
  private urls = new Map<string, string>();
  private heroUrl: string | undefined;

  /** 主畫面插圖（原創角色與塔的小場景）。 */
  hero(): string | undefined {
    return this.heroUrl;
  }
  private listeners: Listener[] = [];
  private started = false;
  private failed = false;

  get(cardId: string): string | undefined {
    return this.urls.get(cardId);
  }

  onUpdate(fn: Listener): void {
    this.listeners.push(fn);
  }

  /** 開始在背景產生所有卡面（只會執行一次）。 */
  start(order: string[] = Object.keys(CARDS)): void {
    if (this.started || this.failed) return;
    this.started = true;
    let r: WebGLRenderer;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      r = new WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
      r.setPixelRatio(1);
      r.setSize(W, H, false);
      r.outputColorSpace = SRGBColorSpace;
      r.setClearColor(0x000000, 0);
    } catch {
      this.failed = true;
      return;
    }
    const scene = new Scene();
    scene.add(new AmbientLight('#ffffff', 1.1));
    const key = new DirectionalLight('#fff3dc', 3.2);
    key.position.set(-2, 3, 4);
    scene.add(key);
    const rim = new DirectionalLight('#bfe0ff', 2.2);
    rim.position.set(3, 2, -3);
    scene.add(rim);
    const cam = new OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    const queue = [...new Set([...order, ...Object.keys(CARDS)])];
    const step = () => {
      const t0 = performance.now();
      while (queue.length && performance.now() - t0 < 24) {
        const id = queue.shift()!;
        try {
          const subject = buildSubject(id);
          scene.add(subject);
          frame(cam, subject, id);
          r.render(scene, cam);
          this.urls.set(id, r.domElement.toDataURL('image/png'));
          scene.remove(subject);
          disposeTree(subject);
        } catch {
          // 單張失敗就保留文字圖示
        }
      }
      if (!this.heroUrl && queue.length < Object.keys(CARDS).length - 8) {
        try {
          this.heroUrl = renderHero(r, scene);
        } catch {
          this.heroUrl = '';
        }
      }
      for (const fn of this.listeners) fn();
      if (queue.length) setTimeout(step, 16);
      else {
        r.dispose();
        r.forceContextLoss();
      }
    };
    setTimeout(step, 30);
  }
}

export const portraits = new PortraitStore();

function disposeTree(o: Object3D): void {
  o.traverse((c) => {
    const m = c as Mesh;
    if (m.material && !Array.isArray(m.material)) m.material.dispose();
  });
}

/** 主畫面插圖：草地平台上的側塔與幾名原創角色。 */
function renderHero(r: WebGLRenderer, scene: Scene): string {
  const HW = 480;
  const HH = 270;
  r.setSize(HW, HH, false);
  const g = new Group();
  const k = new Kit();
  k.addBone('root', -1, [0, 0, 0]);
  k.cyl(4.6, 4.9, 0.6, { at: [0, -0.3, 0], color: '#6b4a2a' }, 40);
  k.cyl(4.62, 4.62, 0.12, { at: [0, 0.02, 0], color: '#8fcf5e' }, 40);
  k.box(1.4, 0.04, 8.6, { at: [-0.4, 0.09, 0], rot: [0, 0.5, 0], color: '#e5c98a' });
  k.box(5.2, 0.5, 1.8, { at: [0.6, -0.15, 0.4], rot: [0, 0.5, 0], color: '#58b2ea' });
  k.box(1.9, 0.18, 2.4, { at: [0.6, 0.12, 0.4], rot: [0, 0.5, 0], color: '#9a6834' });
  const base = new Mesh(k.build(1).geometry, new MeshLambertMaterial({ vertexColors: true }));
  g.add(base);
  const put = (unit: string, team: 0 | 1, x: number, z: number, rotY: number, sc = 1, y = 0, pose = 0.3) => {
    const inst = instantiate(getAsset(unit, team), toonMaterial({ rim: 0.45 }));
    const st = newAnimState();
    st.t = pose;
    st.windup = pose > 1 ? 0.8 : -1;
    animate(inst, profileOf(unit), st, 0.016);
    inst.mesh.position.set(x, y, z);
    inst.mesh.rotation.y = rotY;
    inst.mesh.scale.setScalar(sc);
    g.add(inst.mesh);
  };
  put('princess', 0, -2.9, -1.4, 0.2, 0.62);
  put('princess', 1, 3.0, -1.6, -0.3, 0.55);
  put('knight', 0, -1.2, 1.4, 0.9, 1.3, 0, 2);
  put('giant', 0, -2.4, 0.4, 0.7, 1.1);
  put('barbarian', 1, 1.2, 1.5, -1.0, 1.25, 0, 2);
  put('goblin', 1, 2.4, 0.9, -0.8, 1.3);
  put('baby_dragon', 0, -0.2, -0.6, 0.6, 1.0, 2.3);
  put('musketeer', 0, -3.2, 2.2, 0.5, 1.15);
  scene.add(g);
  const cam = new OrthographicCamera(-5.4, 5.4, 3.04, -3.04, 0.1, 100);
  const dir = new Vector3(0, 0.62, 1).normalize();
  cam.position.copy(new Vector3(0, 0.9, 0)).addScaledVector(dir, 30);
  cam.lookAt(0, 0.9, 0);
  cam.updateProjectionMatrix();
  r.render(scene, cam);
  const url = r.domElement.toDataURL('image/png');
  scene.remove(g);
  disposeTree(g);
  r.setSize(W, H, false);
  return url;
}

/** 依卡牌組出畫面主體：單位（多隻的卡放 2～4 隻）、建築或法術圖示。 */
function buildSubject(cardId: string): Group {
  const card = CARDS[cardId];
  const g = new Group();
  g.userData.kind = card.kind;
  if (card.kind === 'spell') {
    g.add(spellIcon(cardId));
    return g;
  }
  const unit = card.unit!;
  const n = Math.min(card.count ?? 1, cardId === 'skeleton_army' ? 4 : 3);
  const offsets: [number, number, number][] =
    n === 1 ? [[0, 0, 0]] : n === 2 ? [[-0.38, 0, -0.2], [0.38, 0, 0.15]] : n === 3 ? [[-0.5, 0, -0.3], [0.5, 0, -0.25], [0, 0, 0.2]] : [[-0.6, 0, -0.4], [0.6, 0, -0.4], [-0.3, 0, 0.15], [0.35, 0, 0.25]];
  const scale = 1 / Math.max(0.8, UNITS[unit].stats.half ? 1.4 : getAsset(unit, 0).height * 0.85);
  for (const [ox, oy, oz] of offsets) {
    const inst = instantiate(getAsset(unit, 0), toonMaterial({ rim: 0.5 }));
    const st = newAnimState();
    st.t = 0.3;
    animate(inst, profileOf(unit), st, 0.016);
    const m = inst.mesh;
    m.position.set(ox * getAsset(unit, 0).height, oy, oz);
    m.rotation.y = -0.38 + ox * 0.3;
    g.add(m);
  }
  g.scale.setScalar(scale);
  g.userData.unit = unit;
  return g;
}

function frame(cam: OrthographicCamera, subject: Group, cardId: string): void {
  const card = CARDS[cardId];
  // 正面略偏上方的視角，人形單位取腰部以上的特寫
  const dir = new Vector3(-0.35, 0.42, 1).normalize();
  subject.updateMatrixWorld(true);
  const box = new Box3().setFromObject(subject);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  let viewH = Math.max(size.y, size.x * (H / W)) * 1.08;
  if (card.kind === 'troop') {
    const prof = profileOf(card.unit!);
    if (prof.rig === 'biped') {
      // 上半身特寫
      center.y = box.min.y + size.y * 0.66;
      viewH = size.y * 0.78;
      viewH = Math.max(viewH, size.x * (H / W) * 0.82);
    } else {
      viewH *= 0.95;
    }
  }
  const viewW = viewH * (W / H);
  cam.left = -viewW / 2;
  cam.right = viewW / 2;
  cam.top = viewH / 2;
  cam.bottom = -viewH / 2;
  cam.position.copy(center).addScaledVector(dir, 20);
  cam.lookAt(center);
  cam.updateProjectionMatrix();
}

/** 法術的原創圖示模型。 */
function spellIcon(cardId: string): Group {
  const g = new Group();
  const k = new Kit();
  k.addBone('root', -1, [0, 0, 0]);
  const glow = (color: string, r: number, x = 0, y = 0, z = 0) => {
    const m = new Mesh(new SphereGeometry(r, 16, 12), new MeshBasicMaterial({ color }));
    m.position.set(x, y, z);
    g.add(m);
  };
  switch (cardId) {
    case 'fireball':
      glow('#ff7a2a', 0.55, 0.15, 0.2, 0);
      glow('#ffd36b', 0.32, 0.2, 0.25, 0.3);
      for (let i = 0; i < 5; i++) k.cone(0.16 - i * 0.02, 0.7, { at: [-0.45 - i * 0.12, -0.25 - i * 0.15, -0.1], rot: [0, 0, 2.3], color: i % 2 ? '#ffb347' : '#ff6a2a' }, 8);
      break;
    case 'arrows':
      for (let i = 0; i < 3; i++) {
        const x = -0.4 + i * 0.4;
        k.cyl(0.035, 0.035, 1.3, { at: [x, 0.1, 0], rot: [0, 0, 0.35], color: '#8a5a2e' }, 6);
        k.cone(0.1, 0.25, { at: [x - 0.25, -0.55, 0], rot: [0, 0, Math.PI + 0.35], color: '#cfd6de' }, 6);
        k.box(0.22, 0.25, 0.03, { at: [x + 0.2, 0.68, 0], rot: [0, 0, 0.35], color: '#5fbf7a' });
      }
      break;
    case 'zap':
      k.box(0.22, 0.7, 0.12, { at: [0.1, 0.35, 0], rot: [0, 0, -0.5], color: '#ffe45c' });
      k.box(0.6, 0.18, 0.12, { at: [0, 0, 0], color: '#ffe45c' });
      k.box(0.22, 0.7, 0.12, { at: [-0.1, -0.35, 0], rot: [0, 0, -0.5], color: '#ffe45c' });
      glow('#bfe8ff', 0.18, 0.3, 0.7, -0.1);
      break;
    case 'rocket':
      k.cyl(0.22, 0.22, 1.2, { rot: [0, 0, -0.8], color: '#d8d0bc' }, 12);
      k.cone(0.23, 0.45, { at: [0.6, 0.55, 0], rot: [0, 0, -0.8], color: '#c0392b' }, 12);
      for (const sx of [1, -1]) k.box(0.05, 0.38, 0.38, { at: [-0.45 + sx * 0.12, -0.45 - sx * 0.12, 0], rot: [0, 0, -0.8], color: '#c0392b' });
      glow('#ffb347', 0.22, -0.62, -0.62, 0);
      break;
    case 'log':
      k.cyl(0.36, 0.36, 1.6, { rot: [0, 0, Math.PI / 2 - 0.25], color: '#8a5a2e' }, 14);
      k.cyl(0.31, 0.31, 0.05, { at: [0.78, 0.2, 0], rot: [0, 0, Math.PI / 2 - 0.25], color: '#d9b77a' }, 14);
      for (let i = 0; i < 4; i++) k.cone(0.06, 0.22, { at: [-0.5 + i * 0.35, 0.28 + i * 0.09, 0.2], color: '#6b4426' }, 4);
      break;
    case 'poison':
      k.lathe([[0.01, -0.55], [0.42, -0.5], [0.5, -0.2], [0.42, 0.15], [0.16, 0.3], [0.16, 0.55], [0.22, 0.6]], { color: '#4f8f2a' }, 16);
      k.cyl(0.14, 0.14, 0.18, { at: [0, 0.68, 0], color: '#8a5a2e' }, 10);
      glow('#b8f06a', 0.12, 0.15, -0.1, 0.42);
      glow('#d6ff8a', 0.08, -0.2, 0.05, 0.4);
      break;
    case 'goblin_barrel':
      k.cyl(0.45, 0.45, 0.85, { rot: [0.2, 0, 0], color: '#9a6834' }, 14);
      k.torus(0.46, 0.04, { at: [0, 0.28, 0.06], rot: [Math.PI / 2 + 0.2, 0, 0], color: '#5a5f6b' }, 16);
      k.torus(0.46, 0.04, { at: [0, -0.28, -0.06], rot: [Math.PI / 2 + 0.2, 0, 0], color: '#5a5f6b' }, 16);
      k.sphere(0.24, { at: [0, 0.62, 0.05], color: '#7cbf4a' }, 12);
      for (const sx of [1, -1]) {
        k.cone(0.07, 0.25, { at: [sx * 0.28, 0.66, 0.05], rot: [0, 0, -sx * 1.3], color: '#7cbf4a' }, 5);
        k.sphere(0.05, { at: [sx * 0.08, 0.66, 0.26], color: '#1b1b22' }, 6);
      }
      break;
    default:
      glow('#ffffff', 0.4);
  }
  const asset = k.build(1);
  if (asset.geometry.attributes.position.count > 0) {
    const m = new Mesh(asset.geometry, new MeshLambertMaterial({ vertexColors: true }));
    g.add(m);
  }
  return g;
}

/** 卡面背景色（依稀有度），給 CSS 用。 */
export const RARITY_COLORS: Record<string, [string, string]> = {
  common: ['#7f9bb8', '#4d6a88'],
  rare: ['#f0a443', '#b5651d'],
  epic: ['#c46be8', '#7a2fa8'],
  legendary: ['#7ee0d8', '#d48ae8'],
};

export const TEAM_ACCENT = TEAM_RGB[0].main;
export { Color };
