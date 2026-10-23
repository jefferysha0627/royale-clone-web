import {
  AdditiveBlending, AmbientLight, Box3, CanvasTexture, CircleGeometry, Color, DirectionalLight, Group, HemisphereLight, Mesh, MeshBasicMaterial, MeshLambertMaterial,
  NormalBlending, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, SphereGeometry, SRGBColorSpace, Vector3, WebGLRenderer, type Object3D,
} from 'three';
import { CARDS, UNITS } from '../sim';
import { animate, newAnimState } from './anim';
import { TEAM_RGB } from './coords';
import { instantiate, Kit } from './kit';
import { toonMaterial } from './materials';
import { getAsset, profileOf } from './models';
import { commanderSpec } from './models/buildings';
import { buildHumanoid, shade, type Face } from './models/humanoid';
import { ARENA_THEMES, themeIndex } from './arena';
import { banner, boulder, brazier, crag, crystal, flowerBush, goldPillar, hayBale, lantern, maple, pine, pumpkin, reeds, roundTree, topiary, willow } from './props';

// 卡面圖：用遊戲內同一套原創 3D 模型即時渲染成小插畫（主題色背景＋光暈＋地面影子），不需要下載任何圖檔。
// 在閒置時間分批產生，完成前卡面先顯示文字圖示。

const W = 216;
const H = 264;

// ───────── 卡面背景主題（原創配色） ─────────

interface Theme {
  top: string; // 天空上緣
  mid: string; // 地平線霧色
  glow: string; // 主體後方的光暈
  ground: string | null; // 地面顏色（null = 不畫地面，例如法術）
}

const THEMES: Record<string, Theme> = {
  meadow: { top: '#5aa8f0', mid: '#d6efff', glow: '#fff4c8', ground: '#79c457' },
  forest: { top: '#2e7a52', mid: '#c4eba6', glow: '#fff3b8', ground: '#5c9c3c' },
  dusk: { top: '#2e2464', mid: '#a58ad2', glow: '#efd8ff', ground: '#56634a' },
  ember: { top: '#a8301c', mid: '#ffb760', glow: '#fff1a6', ground: '#8a5a3a' },
  frost: { top: '#2f86d2', mid: '#dcf7ff', glow: '#ffffff', ground: '#cfe9f2' },
  canyon: { top: '#c0642a', mid: '#ffdca4', glow: '#fff3c6', ground: '#b88a5a' },
  steel: { top: '#334055', mid: '#b9c6d8', glow: '#eef4ff', ground: '#7d8794' },
  sky: { top: '#3f86d8', mid: '#e6f4ff', glow: '#ffffff', ground: null },
  storm: { top: '#1f2f7a', mid: '#86aef8', glow: '#e8f4ff', ground: null },
  toxic: { top: '#24521c', mid: '#acdf6c', glow: '#f3ffb6', ground: null },
  blaze: { top: '#8a1f14', mid: '#ff9a4a', glow: '#fff0a0', ground: null },
  timber: { top: '#3d6f3a', mid: '#e3eebd', glow: '#fff6cc', ground: '#6b9a44' },
};

const CARD_THEME: Record<string, string> = {
  goblins: 'forest', spear_goblins: 'forest', goblin_barrel: 'forest', wolf_rider: 'forest',
  skeletons: 'dusk', skeleton_army: 'dusk', giant_skeleton: 'dusk', witch: 'dusk', tombstone: 'dusk', bats: 'dusk', gargoyles: 'dusk',
  wizard: 'ember', fire_spirit: 'ember', inferno: 'ember', baby_dragon: 'ember',
  ice_spirit: 'frost',
  golem: 'canyon', cannon: 'canyon', bomber: 'canyon', axe_dwarf: 'canyon',
  iron_swordsman: 'steel', lancer: 'steel',
  bomb_blimp: 'sky', arrows: 'sky', rocket: 'sky',
  zap: 'storm', poison: 'toxic', fireball: 'blaze', log: 'timber',
  freeze: 'frost', rage: 'blaze', tunneler: 'canyon', elixir_collector: 'dusk',
};

function themeOf(cardId: string): Theme {
  return THEMES[CARD_THEME[cardId] ?? 'meadow'];
}

const BG_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const BG_FRAG = `
uniform vec3 uTop;
uniform vec3 uMid;
uniform vec3 uGlow;
varying vec2 vUv;
void main() {
  vec3 col = mix(uMid, uTop, smoothstep(0.28, 1.0, vUv.y));
  // 主體後方的柔和光暈與幾道放射光
  vec2 c = vUv - vec2(0.5, 0.6);
  float d = length(c * vec2(1.0, 0.85));
  float ang = atan(c.y, c.x);
  float rays = 0.5 + 0.5 * sin(ang * 9.0);
  col += uGlow * (1.0 - smoothstep(0.0, 0.62, d)) * (0.42 + 0.12 * rays);
  // 四周壓暗（暈影）
  float v = smoothstep(0.98, 0.38, length((vUv - 0.5) * vec2(1.0, 0.9)));
  col *= mix(0.55, 1.0, v);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

const groundTextures = new Map<string, CanvasTexture>();

/** 地面：中央有柔和接觸影子，往外淡出融進背景。 */
function groundTexture(color: string): CanvasTexture {
  let t = groundTextures.get(color);
  if (t) return t;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const base = new Color(color);
  const rgb = (k: number, a: number) => `rgba(${Math.round(base.r * 255 * k)},${Math.round(base.g * 255 * k)},${Math.round(base.b * 255 * k)},${a})`;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, rgb(0.45, 1));
  grad.addColorStop(0.16, rgb(0.62, 1));
  grad.addColorStop(0.32, rgb(1, 1));
  grad.addColorStop(0.62, rgb(1.05, 0.85));
  grad.addColorStop(1, rgb(1.1, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  groundTextures.set(color, t);
  return t;
}

type Listener = () => void;

// 表情貼圖：國王塔上的原創指揮官做出不同表情（取代系統表情符號，各平台看起來一致）
export const EMOTE_POSES: Record<string, { face: Face; arm: number }> = {
  good: { face: 'happy', arm: -2.6 },
  haha: { face: 'laugh', arm: -0.6 },
  wow: { face: 'wow', arm: -1.2 },
  thanks: { face: 'happy', arm: -1.5 },
  grr: { face: 'angry', arm: -2.3 },
  luck: { face: 'wink', arm: -2.0 },
};

interface RenderCtx {
  r: WebGLRenderer;
  scene: Scene;
  cam: OrthographicCamera;
  bgScene: Scene;
  bgMat: ShaderMaterial;
  bgCam: OrthographicCamera;
}

class PortraitStore {
  private urls = new Map<string, string>();
  private emotes = new Map<string, string>();
  private arts = new Map<number, string>();
  private listeners: Listener[] = [];
  private started = false;
  private failed = false;
  private ctx: RenderCtx | null = null;
  private cardQueue: string[] = [];
  private emoteJobs: [string, 0 | 1][] = [];
  private artQueue: number[] = [];
  private pumping = false;

  /** 表情貼圖（id、隊伍）；還沒產生好時回傳 undefined。 */
  emote(id: string, team: 0 | 1): string | undefined {
    return this.emotes.get(`${id}|${team}`);
  }

  /** 競技場小場景圖（主畫面插圖、獎盃之路）；還沒產生好時回傳 undefined，記得先 requestArt。 */
  arenaArt(theme: number): string | undefined {
    return this.arts.get(theme);
  }

  /** WebGL 不可用時卡面、表情與場景圖都不會產生（畫面改用文字圖示與 CSS 圖樣）。 */
  get unavailable(): boolean {
    return this.failed;
  }

  get(cardId: string): string | undefined {
    return this.urls.get(cardId);
  }

  onUpdate(fn: Listener): void {
    this.listeners.push(fn);
  }

  /** 開始在背景產生所有卡面（只會執行一次）：先做 order 裡的卡，再做場景圖、其他卡與表情。 */
  start(order: string[] = Object.keys(CARDS)): void {
    if (this.started || this.failed) return;
    this.started = true;
    this.cardQueue = [...new Set([...order, ...Object.keys(CARDS)])];
    for (const team of [0, 1] as const) for (const id of Object.keys(EMOTE_POSES)) this.emoteJobs.push([id, team]);
    this.pump();
  }

  /** 要求產生競技場小場景圖，完成後會通知 onUpdate。 */
  requestArt(themes: number[]): void {
    if (this.failed) return;
    for (const t of themes) if (!this.arts.has(t) && !this.artQueue.includes(t)) this.artQueue.push(t);
    if (this.artQueue.length) this.pump();
  }

  private pump(): void {
    if (this.pumping) return;
    this.pumping = true;
    setTimeout(this.step, 30);
  }

  private step = (): void => {
    const c = this.ensureCtx();
    if (!c) {
      this.pumping = false;
      for (const fn of this.listeners) fn();
      return;
    }
    const t0 = performance.now();
    const total = Object.keys(CARDS).length;
    const budget = () => performance.now() - t0 < 24;
    // 牌組的 8 張先做（主畫面最先看到），接著是場景圖，再來是其他卡與表情
    while (this.cardQueue.length > total - 8 && budget()) this.safeCard(c, this.cardQueue.shift()!);
    while (this.artQueue.length && (this.cardQueue.length <= total - 8 || !this.started) && budget()) {
      const theme = this.artQueue.shift()!;
      try {
        this.arts.set(theme, renderArenaArt(c, theme));
      } catch {
        this.arts.set(theme, '');
      }
    }
    while (this.cardQueue.length && !this.artQueue.length && budget()) this.safeCard(c, this.cardQueue.shift()!);
    while (!this.cardQueue.length && this.emoteJobs.length && budget()) {
      const [id, team] = this.emoteJobs.shift()!;
      try {
        this.renderEmote(c, id, team);
      } catch {
        // 表情貼圖失敗就用系統表情符號
      }
    }
    for (const fn of this.listeners) fn();
    if (this.cardQueue.length || this.emoteJobs.length || this.artQueue.length) setTimeout(this.step, 16);
    else {
      this.releaseCtx();
      this.pumping = false;
    }
  };

  /** 建立離屏渲染器與燈光（做完所有工作就釋放，之後有新的場景圖要求再建立）。 */
  private ensureCtx(): RenderCtx | null {
    if (this.ctx) return this.ctx;
    if (this.failed) return null;
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
      return null;
    }
    const scene = new Scene();
    scene.add(new AmbientLight('#ffffff', 0.55));
    scene.add(new HemisphereLight('#fff8e8', '#6f8f5a', 1.1));
    const key = new DirectionalLight('#fff1d6', 3.4);
    key.position.set(-2.5, 3.5, 4);
    scene.add(key);
    const rim = new DirectionalLight('#d6ecff', 2.6);
    rim.position.set(3, 2.5, -3);
    scene.add(rim);
    const cam = new OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    // 背景：全畫面漸層＋光暈（另一個場景，先畫）
    const bgScene = new Scene();
    const bgMat = new ShaderMaterial({
      uniforms: { uTop: { value: new Color() }, uMid: { value: new Color() }, uGlow: { value: new Color() } },
      vertexShader: BG_VERT,
      fragmentShader: BG_FRAG,
      depthWrite: false,
    });
    const bgQuad = new Mesh(new PlaneGeometry(2, 2), bgMat);
    bgQuad.frustumCulled = false;
    bgScene.add(bgQuad);
    const bgCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.ctx = { r, scene, cam, bgScene, bgMat, bgCam };
    return this.ctx;
  }

  private releaseCtx(): void {
    const c = this.ctx;
    if (!c) return;
    this.ctx = null;
    c.bgScene.traverse((o) => (o as Mesh).geometry?.dispose());
    c.bgMat.dispose();
    c.r.dispose();
    c.r.forceContextLoss();
  }

  private safeCard(c: RenderCtx, id: string): void {
    try {
      this.renderCard(c, id);
    } catch {
      // 單張失敗就保留文字圖示
    }
  }

  private renderCard(c: RenderCtx, id: string): void {
    const { r, scene, cam, bgScene, bgMat, bgCam } = c;
    const theme = themeOf(id);
    bgMat.uniforms.uTop.value.set(theme.top);
    bgMat.uniforms.uMid.value.set(theme.mid);
    bgMat.uniforms.uGlow.value.set(theme.glow);
    const subject = buildSubject(id);
    scene.add(subject);
    const ground = theme.ground ? addGround(subject, theme.ground) : null;
    frame(cam, subject, id);
    r.autoClear = false;
    r.clear();
    r.render(bgScene, bgCam);
    r.clearDepth();
    r.render(scene, cam);
    r.autoClear = true;
    this.urls.set(id, r.domElement.toDataURL('image/jpeg', 0.9));
    scene.remove(subject);
    if (ground) {
      ground.removeFromParent();
      ground.geometry.dispose();
      (ground.material as MeshBasicMaterial).dispose();
    }
    disposeTree(subject);
  }

  private renderEmote(c: RenderCtx, id: string, team: 0 | 1): void {
    const { r, scene, cam } = c;
    const pose = EMOTE_POSES[id];
    const pal = TEAM_RGB[team];
    const asset = buildHumanoid(commanderSpec(pal, pose.face, 0.55), pal);
    const inst = instantiate(asset, toonMaterial({ rim: 0.5 }));
    const st = newAnimState();
    st.t = 0.2;
    animate(inst, profileOf('knight'), st, 0.016);
    inst.byName.armR?.rotation.set(pose.arm, 0, 0.25);
    inst.byName.head?.rotation.set(-0.12, team === 0 ? -0.15 : 0.15, id === 'wow' ? 0.12 : 0);
    inst.mesh.rotation.y = team === 0 ? 0.25 : -0.25;
    const g = new Group();
    g.add(inst.mesh);
    scene.add(g);
    const EW = 128;
    r.setSize(EW, EW, false);
    g.updateMatrixWorld(true);
    const box = new Box3().setFromObject(g);
    const size = box.getSize(new Vector3());
    const center = new Vector3((box.min.x + box.max.x) / 2, box.min.y + size.y * 0.72, (box.min.z + box.max.z) / 2);
    const view = size.y * 0.62;
    cam.left = -view / 2;
    cam.right = view / 2;
    cam.top = view / 2;
    cam.bottom = -view / 2;
    cam.position.copy(center).addScaledVector(new Vector3(0, 0.25, 1).normalize(), 20);
    cam.lookAt(center);
    cam.updateProjectionMatrix();
    r.setClearColor(0x000000, 0);
    r.clear();
    r.render(scene, cam);
    this.emotes.set(`${id}|${team}`, r.domElement.toDataURL('image/png'));
    scene.remove(g);
    disposeTree(g);
    asset.geometry.dispose();
    inst.mesh.skeleton.dispose();
    r.setSize(W, H, false);
  }
}

/** 在主體腳下放一片淡出的地面（含接觸影子）；飛行單位的地面在下方較遠處。 */
function addGround(subject: Group, color: string): Mesh {
  subject.updateMatrixWorld(true);
  const box = new Box3().setFromObject(subject);
  const size = box.getSize(new Vector3());
  const radius = Math.max(size.x, size.z) * 1.15 + 0.4;
  const m = new Mesh(new CircleGeometry(radius, 40), new MeshBasicMaterial({ map: groundTexture(color), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.set((box.min.x + box.max.x) / 2, (subject.userData.groundY as number | undefined) ?? 0, (box.min.z + box.max.z) / 2);
  m.renderOrder = -1;
  subject.parent!.add(m);
  return m;
}

export const portraits = new PortraitStore();

function disposeTree(o: Object3D): void {
  o.traverse((c) => {
    const m = c as Mesh;
    if (m.material && !Array.isArray(m.material)) m.material.dispose();
    // 單位模型的幾何是共用快取，不能釋放；法術圖示的幾何是這張卡專用的
    if (m.geometry && !m.geometry.userData.shared) m.geometry.dispose();
  });
}

type HeroSlot = [unit: string, team: 0 | 1, scale: number];

/** 每座競技場插圖上的角色（左邊藍隊三名、右邊紅隊兩名、中間一隻飛行單位）。 */
const ARENA_CAST: [HeroSlot, HeroSlot, HeroSlot, HeroSlot, HeroSlot, HeroSlot][] = [
  [['knight', 0, 1.3], ['giant', 0, 1.1], ['musketeer', 0, 1.15], ['barbarian', 1, 1.25], ['goblin', 1, 1.3], ['baby_dragon', 0, 1.0]],
  [['iron_swordsman', 0, 1.3], ['giant', 0, 1.1], ['archer', 0, 1.25], ['knight', 1, 1.25], ['spear_goblin', 1, 1.3], ['gargoyle', 1, 1.1]],
  [['barbarian', 0, 1.3], ['golem', 0, 1.05], ['wizard', 0, 1.15], ['axe_dwarf', 1, 1.3], ['bomber', 1, 1.35], ['baby_dragon', 0, 1.0]],
  [['knight', 0, 1.3], ['giant_skeleton', 0, 1.05], ['witch', 0, 1.1], ['barbarian', 1, 1.25], ['skeleton', 1, 1.35], ['bat', 1, 1.3]],
  [['tunneler', 0, 1.35], ['golem', 0, 1.05], ['musketeer', 0, 1.15], ['iron_swordsman', 1, 1.25], ['goblin', 1, 1.3], ['bomb_blimp', 1, 0.9]],
  [['lancer', 0, 1.05], ['giant', 0, 1.1], ['wizard', 0, 1.15], ['knight', 1, 1.25], ['archer', 1, 1.3], ['baby_dragon', 0, 1.0]],
];

/** 競技場小場景：浮在空中的圓形草地（依競技場換地面、河水、橋與道具），兩座側塔與幾名原創角色。 */
function renderArenaArt(c: RenderCtx, theme: number): string {
  const { r, scene } = c;
  const idx = themeIndex(theme);
  const pal = ARENA_THEMES[idx];
  const HW = 480;
  const HH = 270;
  r.setSize(HW, HH, false);
  const g = new Group();
  const k = new Kit();
  k.addBone('root', -1, [0, 0, 0]);
  const glow = new Kit();
  glow.gradient = false;
  glow.addBone('root', -1, [0, 0, 0]);
  const soil = pal.style === 'highland' ? '#6f665a' : pal.style === 'royal' ? '#dccfb1' : pal.style === 'lake' ? '#56584c' : '#6b4a2a';
  k.cyl(4.6, 4.9, 0.6, { at: [0, -0.3, 0], color: soil }, 40);
  if (pal.style === 'royal') k.torus(4.72, 0.07, { at: [0, -0.08, 0], rot: [Math.PI / 2, 0, 0], color: '#e6b53c' }, 48);
  k.cyl(4.62, 4.62, 0.12, { at: [0, 0.02, 0], color: pal.grassA }, 40);
  k.box(1.4, 0.04, 8.6, { at: [-0.4, 0.09, 0], rot: [0, 0.5, 0], color: pal.path });
  k.box(5.2, 0.5, 1.8, { at: [0.6, -0.15, 0.4], rot: [0, 0.5, 0], color: pal.water[0] });
  if (pal.bridge === 'stone') {
    const stone = pal.style === 'royal' ? '#ece4d0' : '#b2aea4';
    k.box(1.9, 0.18, 2.4, { at: [0.6, 0.12, 0.4], rot: [0, 0.5, 0], color: stone });
    for (const sx of [-1, 1]) {
      const ox = Math.cos(0.5) * sx * 0.95;
      const oz = -Math.sin(0.5) * sx * 0.95;
      k.box(0.18, 0.3, 2.4, { at: [0.6 + ox, 0.3, 0.4 + oz], rot: [0, 0.5, 0], color: shade(stone, -0.08) });
    }
  } else {
    k.box(1.9, 0.18, 2.4, { at: [0.6, 0.12, 0.4], rot: [0, 0.5, 0], color: pal.wood[1] });
  }
  // 後緣的道具（依競技場風格）
  const rnd = (() => {
    let x = 7 + idx * 13;
    return () => ((x = (x * 16807) % 2147483647) / 2147483647);
  })();
  switch (pal.style) {
    case 'fort':
      pine(k, -1.1, -3.7, 1.0, pal);
      pine(k, 1.3, -3.8, 0.9, pal);
      brazier(k, glow, -3.9, -2.6, 0.8);
      boulder(k, 4.0, -2.4, 0.5, pal, rnd);
      break;
    case 'autumn':
      maple(k, -1.1, -3.7, 1.0, pal, rnd);
      maple(k, 1.3, -3.8, 0.85, pal, rnd);
      hayBale(k, -3.4, -2.7, 0.85, 0.4);
      pumpkin(k, 4.0, -2.3, 1.1);
      break;
    case 'lake':
      willow(k, -1.1, -3.7, 0.95, pal, rnd);
      willow(k, 1.4, -3.8, 0.8, pal, rnd);
      lantern(k, glow, -3.95, -2.5, 0.9);
      reeds(k, 4.0, -2.4, 1, rnd);
      break;
    case 'highland':
      crystal(k, glow, -1.1, -3.7, 1.1, '#8fe8ff', rnd);
      pine(k, 1.3, -3.8, 0.95, pal);
      crag(k, -3.9, -2.6, 0.8, pal, rnd);
      crystal(k, glow, 4.0, -2.4, 0.8, '#c99bff', rnd);
      break;
    case 'royal':
      topiary(k, -1.1, -3.7, 1.2);
      goldPillar(k, 1.3, -3.8, 1.0);
      topiary(k, -3.9, -2.6, 0.9);
      banner(k, 4.0, -2.4, 0.9, '#c8323c', '#e6b53c');
      break;
    default:
      roundTree(k, -1.1, -3.7, 1.0, pal, rnd);
      roundTree(k, 1.3, -3.8, 0.85, pal, rnd);
      flowerBush(k, -3.9, -2.7, 0.4, pal, rnd);
      flowerBush(k, 4.0, -2.4, 0.35, pal, rnd);
  }
  g.add(new Mesh(k.build(1).geometry, new MeshLambertMaterial({ vertexColors: true })));
  if (glow.parts > 0) g.add(new Mesh(glow.build(1).geometry, new MeshBasicMaterial({ vertexColors: true })));
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
  const [front, big, back, foeFront, foeSmall, fly] = ARENA_CAST[idx];
  put(front[0], front[1], -1.2, 1.4, 0.9, front[2], 0, 2);
  put(big[0], big[1], -2.4, 0.4, 0.7, big[2]);
  put(foeFront[0], foeFront[1], 1.2, 1.5, -1.0, foeFront[2], 0, 2);
  put(foeSmall[0], foeSmall[1], 2.4, 0.9, -0.8, foeSmall[2]);
  put(fly[0], fly[1], -0.2, -0.6, 0.6, fly[2], 2.3);
  put(back[0], back[1], -3.2, 2.2, 0.5, back[2]);
  scene.add(g);
  const cam = new OrthographicCamera(-5.4, 5.4, 3.04, -3.04, 0.1, 100);
  const dir = new Vector3(0, 0.62, 1).normalize();
  cam.position.copy(new Vector3(0, 0.9, 0)).addScaledVector(dir, 30);
  cam.lookAt(0, 0.9, 0);
  cam.updateProjectionMatrix();
  r.setClearColor(0x000000, 0);
  r.clear();
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
  const prof = profileOf(unit);
  // 飛行單位離地，卡面上看得出是在空中
  const lift = UNITS[unit].stats.flying ? Math.max(0.45, (prof.hover ?? 0.8) * 0.75) : 0;
  offsets.forEach(([ox, oy, oz], i) => {
    const inst = instantiate(getAsset(unit, 0), toonMaterial({ rim: 0.5 }));
    const st = newAnimState();
    // 最前面那隻擺出出手前的蓄力姿勢，其他的稍微錯開，卡面比較有動感
    st.t = 0.3 + i * 0.7;
    st.windup = card.kind === 'troop' && i === offsets.length - 1 ? 0.7 : -1;
    animate(inst, prof, st, 0.016);
    const m = inst.mesh;
    m.position.set(ox * getAsset(unit, 0).height, oy + lift, oz);
    m.rotation.y = -0.38 + ox * 0.3;
    g.add(m);
  });
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
  } else if (card.kind === 'building') {
    // 建築卡拉近一點，主體佔滿卡面
    viewH *= 0.82;
    center.y += size.y * 0.06;
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

/** 法術的原創圖示模型：實體部分用 Kit，發光部分用不受光的半透明球。 */
function spellIcon(cardId: string): Group {
  const g = new Group();
  const k = new Kit();
  k.addBone('root', -1, [0, 0, 0]);
  const glow = (color: string, r: number, x = 0, y = 0, z = 0, opacity = 1, additive = false) => {
    const m = new Mesh(
      new SphereGeometry(r, 18, 14),
      new MeshBasicMaterial({ color, transparent: opacity < 1 || additive, opacity, blending: additive ? AdditiveBlending : NormalBlending, depthWrite: !additive }),
    );
    m.position.set(x, y, z);
    g.add(m);
  };
  switch (cardId) {
    case 'fireball': {
      // 火球：亮黃核心、橘色火焰層、外圍光暈，往左下拖出火焰尾巴與火星
      glow('#fff6c0', 0.3, 0.22, 0.28, 0.2);
      glow('#ffb03a', 0.44, 0.2, 0.26, 0, 0.92);
      glow('#ff5a1a', 0.66, 0.2, 0.26, -0.1, 0.32, true);
      for (let i = 0; i < 7; i++) {
        const t = i / 6;
        k.cone(0.3 - t * 0.2, 0.75 - t * 0.2, {
          at: [-0.25 - t * 0.55, -0.12 - t * 0.5, -0.15 - t * 0.1], rot: [0, 0, 2.25 + (i % 2 ? 0.25 : -0.2)], color: i % 3 === 0 ? '#ffd36b' : i % 3 === 1 ? '#ff8a2a' : '#e8461e',
        }, 8);
      }
      for (let i = 0; i < 6; i++) glow(i % 2 ? '#ffe08a' : '#ff8a3a', 0.04 + (i % 3) * 0.015, -0.7 + i * 0.22, -0.55 + ((i * 37) % 5) * 0.12, 0.3, 1);
      break;
    }
    case 'arrows':
      // 三支箭斜斜落下，後面拖著速度線
      for (let i = 0; i < 3; i++) {
        const x = -0.45 + i * 0.45;
        const y = 0.15 - i * 0.12;
        k.cyl(0.04, 0.04, 1.25, { at: [x, y, 0], rot: [0, 0, 0.42], color: '#8a5a2e' }, 6);
        k.cone(0.11, 0.28, { at: [x - 0.27, y - 0.6, 0], rot: [0, 0, Math.PI + 0.42], color: '#dfe5ec' }, 6);
        for (const s2 of [-1, 1]) k.box(0.2, 0.26, 0.03, { at: [x + 0.23, y + 0.55, s2 * 0.05], rot: [s2 * 0.5, 0, 0.42], color: i === 1 ? '#f2b233' : '#5fbf7a' });
        for (let j = 0; j < 2; j++) {
          const m = new Mesh(new PlaneGeometry(0.035, 0.7), new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.55 }));
          m.position.set(x + 0.42 + j * 0.12, y + 0.85 + j * 0.1, -0.05);
          m.rotation.z = 0.42;
          g.add(m);
        }
      }
      break;
    case 'zap': {
      // 鋸齒閃電：黃色外框＋白色內芯，轉折處有藍白光暈與火花
      const pts: [number, number][] = [[0.25, 0.95], [-0.15, 0.2], [0.18, 0.12], [-0.25, -0.85]];
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i];
        const [x1, y1] = pts[i + 1];
        const len = Math.hypot(x1 - x0, y1 - y0);
        const ang = Math.atan2(y1 - y0, x1 - x0) - Math.PI / 2;
        k.box(0.26, len + 0.12, 0.14, { at: [(x0 + x1) / 2, (y0 + y1) / 2, 0], rot: [0, 0, ang], color: '#ffd23a' });
        k.box(0.1, len + 0.05, 0.16, { at: [(x0 + x1) / 2, (y0 + y1) / 2, 0.02], rot: [0, 0, ang], color: '#fffbe0' });
      }
      for (const [x, y] of pts) glow('#9fd8ff', 0.16, x, y, -0.05, 0.3, true);
      glow('#cfeaff', 0.6, 0, 0.05, -0.4, 0.1, true);
      for (let i = 0; i < 6; i++) {
        const a2 = i * 1.05;
        k.box(0.04, 0.18, 0.04, { at: [Math.cos(a2) * 0.55, Math.sin(a2) * 0.6, 0.1], rot: [0, 0, a2], color: '#fff2a0' });
      }
      break;
    }
    case 'rocket':
      // 火箭：條紋彈身、紅色彈頭與尾翼、尾焰與煙霧
      k.cyl(0.22, 0.22, 1.1, { at: [0.05, 0.05, 0], rot: [0, 0, -0.8], color: '#e6dfcc' }, 14);
      for (const t of [-0.25, 0.15]) k.cyl(0.225, 0.225, 0.1, { at: [0.05 + t * 0.72, 0.05 + t * 0.7, 0], rot: [0, 0, -0.8], color: '#c0392b' }, 14);
      k.cone(0.23, 0.48, { at: [0.6, 0.6, 0], rot: [0, 0, -0.8], color: '#c0392b' }, 14);
      for (const sx of [1, -1]) k.box(0.05, 0.4, 0.42, { at: [-0.38 + sx * 0.14, -0.38 - sx * 0.14, 0], rot: [0, 0, -0.8], color: '#a8301c' });
      for (let i = 0; i < 3; i++) k.cone(0.17 - i * 0.04, 0.42 + i * 0.12, { at: [-0.62 - i * 0.08, -0.62 - i * 0.08, 0], rot: [0, 0, 2.35], color: ['#fff3a0', '#ffb03a', '#ff6a2a'][i] }, 10);
      glow('#ffd36b', 0.28, -0.6, -0.6, 0.05, 0.5, true);
      for (let i = 0; i < 4; i++) glow('#d9d4cc', 0.16 + i * 0.05, -0.9 - i * 0.12, -0.95 - i * 0.05, -0.2, 0.7);
      break;
    case 'log':
      // 滾木：長木頭、年輪切面與尖刺，下方揚起塵土
      k.cyl(0.38, 0.38, 1.6, { rot: [0, 0, Math.PI / 2 - 0.25], color: '#8a5a2e' }, 16);
      k.cyl(0.33, 0.33, 0.05, { at: [0.78, 0.2, 0], rot: [0, 0, Math.PI / 2 - 0.25], color: '#d9b77a' }, 16);
      k.torus(0.2, 0.025, { at: [0.8, 0.205, 0], rot: [0, Math.PI / 2, 0.25], color: '#b88a50' }, 14);
      for (let i = 0; i < 5; i++) k.cone(0.07, 0.26, { at: [-0.6 + i * 0.3, 0.3 + i * 0.075, 0.22], rot: [0.4, 0, -0.25], color: '#5a3a1e' }, 5);
      for (let i = 0; i < 5; i++) glow('#d8c39a', 0.12 + (i % 2) * 0.06, -0.7 + i * 0.3, -0.42 - (i % 2) * 0.05, 0.3, 0.75);
      break;
    case 'poison':
      // 毒藥瓶：發光的綠色藥水、骷髏標籤、往上冒的泡泡
      k.lathe([[0.01, -0.6], [0.44, -0.54], [0.53, -0.22], [0.44, 0.14], [0.17, 0.3], [0.17, 0.56], [0.23, 0.62]], { color: '#3d6f2a' }, 18);
      k.cyl(0.15, 0.15, 0.2, { at: [0, 0.7, 0], color: '#8a5a2e' }, 10);
      glow('#9dff4a', 0.4, 0, -0.2, 0.12, 0.85);
      k.sphere(0.16, { at: [0, -0.15, 0.48], scale: [1, 1, 0.4], color: '#f4f1e8' }, 12);
      for (const sx of [1, -1]) k.sphere(0.04, { at: [sx * 0.055, -0.13, 0.54], color: '#2a3a1e' }, 6);
      for (let i = 0; i < 5; i++) glow('#d6ff8a', 0.05 + (i % 3) * 0.025, -0.15 + ((i * 29) % 7) * 0.05, 0.75 + i * 0.16, 0.1, 0.9);
      break;
    case 'freeze': {
      // 冰凍：六角雪花冰晶＋冰塊碎片
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        k.box(0.12, 0.95, 0.08, { at: [Math.sin(a) * 0.42, Math.cos(a) * 0.42, 0], rot: [0, 0, -a], color: '#d8f6ff' });
        for (const sgn of [1, -1]) {
          k.box(0.07, 0.32, 0.06, {
            at: [Math.sin(a) * 0.62 + Math.sin(a + sgn * 0.9) * 0.12, Math.cos(a) * 0.62 + Math.cos(a + sgn * 0.9) * 0.12, 0.02], rot: [0, 0, -a - sgn * 0.9], color: '#bfeeff',
          });
        }
      }
      k.gem(0.24, { at: [0, 0, 0.05], color: '#ffffff' });
      glow('#9fe2ff', 0.75, 0, 0, -0.3, 0.25, true);
      for (let i = 0; i < 5; i++) k.gem(0.07 + (i % 2) * 0.04, { at: [-0.75 + i * 0.38, -0.85 + ((i * 3) % 4) * 0.08, 0.2], color: '#e8faff' });
      break;
    }
    case 'rage': {
      // 狂暴：冒著紅色蒸氣的藥瓶與往上竄的火花
      k.lathe([[0.01, -0.62], [0.36, -0.58], [0.46, -0.32], [0.4, 0.0], [0.15, 0.18], [0.15, 0.42], [0.2, 0.47]], { color: '#7a2a4a' }, 18);
      glow('#ff3a6a', 0.36, 0, -0.28, 0.1, 0.9);
      k.cyl(0.13, 0.13, 0.16, { at: [0, 0.54, 0], color: '#8a5a2e' }, 10);
      for (let i = 0; i < 6; i++) glow(i % 2 ? '#ff9ab0' : '#ff4a6a', 0.07 + (i % 3) * 0.03, -0.25 + ((i * 37) % 5) * 0.12, 0.7 + i * 0.13, 0.05, 0.85);
      glow('#ff6a8a', 0.8, 0, 0.2, -0.4, 0.22, true);
      break;
    }
    case 'goblin_barrel':
      k.cyl(0.45, 0.45, 0.85, { rot: [0.2, 0, 0], color: '#9a6834' }, 14);
      k.torus(0.46, 0.04, { at: [0, 0.28, 0.06], rot: [Math.PI / 2 + 0.2, 0, 0], color: '#5a5f6b' }, 16);
      k.torus(0.46, 0.04, { at: [0, -0.28, -0.06], rot: [Math.PI / 2 + 0.2, 0, 0], color: '#5a5f6b' }, 16);
      k.sphere(0.24, { at: [0, 0.62, 0.05], color: '#7cbf4a' }, 12);
      for (const sx of [1, -1]) {
        k.cone(0.07, 0.25, { at: [sx * 0.28, 0.66, 0.05], rot: [0, 0, -sx * 1.3], color: '#7cbf4a' }, 5);
        k.sphere(0.05, { at: [sx * 0.08, 0.66, 0.26], color: '#1b1b22' }, 6);
      }
      for (let i = 0; i < 3; i++) {
        const m = new Mesh(new PlaneGeometry(0.04, 0.55), new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.5 }));
        m.position.set(-0.55 - i * 0.12, 0.5 + i * 0.12, -0.2);
        m.rotation.z = -0.9;
        g.add(m);
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
