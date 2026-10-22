// 開發用：以遊戲相機角度展示所有原創模型（?state=idle|walk|attack&zoom=1&only=knight,giant）。
import { Mesh, MeshLambertMaterial, OrthographicCamera, PlaneGeometry, Vector3 } from 'three';
import { animate, newAnimState } from '../src/render3d/anim';
import { CAM_ELEV } from '../src/render3d/coords';
import { instantiate } from '../src/render3d/kit';
import { toonMaterial } from '../src/render3d/materials';
import { getAsset, profileOf } from '../src/render3d/models';
import { createRenderer, createStage } from '../src/render3d/stage';

const params = new URLSearchParams(location.search);
const state = params.get('state') ?? 'idle';
const zoom = Number(params.get('zoom') ?? 1);
const only = params.get('only')?.split(',');
const units = only ?? [
  'knight', 'archer', 'giant', 'goblin', 'spear_goblin', 'skeleton', 'musketeer', 'wizard', 'iron_swordsman', 'axe_dwarf', 'lancer', 'bomber',
  'barbarian', 'golem', 'golemite', 'giant_skeleton', 'ice_spirit', 'fire_spirit', 'witch', 'baby_dragon', 'bat', 'gargoyle', 'bomb_blimp',
  'wolf_rider', 'cannon', 'inferno', 'tombstone',
];
const towers = params.get('towers') === '1';

const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = createRenderer(canvas, { preserve: true });
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
renderer.setSize(innerWidth, innerHeight, false);
const { scene } = createStage(renderer);
const ground = new Mesh(new PlaneGeometry(80, 80), new MeshLambertMaterial({ color: '#7fb85a' }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const cols = towers ? 3 : 7;
const gap = towers ? 5.5 : 2.6;
const items: { inst: ReturnType<typeof instantiate>; prof: ReturnType<typeof profileOf>; st: ReturnType<typeof newAnimState>; label: HTMLElement; pos: Vector3 }[] = [];
const list = towers ? ['princess', 'king', 'rubble-princess'] : units;
const rows = Math.ceil(list.length / cols);
list.forEach((u, i) => {
  for (const team of [0, 1] as const) {
    if (towers && team === 1 && u.startsWith('rubble')) continue;
    const inst = instantiate(getAsset(u, team), toonMaterial());
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = (c - (cols - 1) / 2) * gap + (team === 1 ? gap * 0.38 : -gap * 0.38) * (towers ? 0 : 1);
    const z = (r - (rows - 1) / 2) * gap * 1.25 + (towers && team === 1 ? gap * 1.6 * rows : 0);
    const prof = profileOf(u);
    inst.mesh.position.set(x, prof.hover ?? 0, z);
    if (towers && team === 1) inst.mesh.rotation.y = Math.PI;
    scene.add(inst.mesh);
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = team === 0 ? u : '';
    document.getElementById('labels')!.appendChild(label);
    const st = newAnimState();
    st.active = true;
    st.wakeT = 5;
    items.push({ inst, prof, st, label, pos: new Vector3(x, 0, z) });
  }
});

const aspect = innerWidth / innerHeight;
const halfH = ((rows * gap * 1.25) / 2 + 1.5) / zoom * (towers ? 2.2 : 1);
const cam = new OrthographicCamera(-halfH * aspect, halfH * aspect, halfH, -halfH, 0.1, 200);
cam.position.set(0, Math.sin(CAM_ELEV) * 60, Math.cos(CAM_ELEV) * 60);
cam.lookAt(0, 0, 0);

let last = performance.now();
function frame(now: number): void {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  for (const it of items) {
    it.st.moving = state === 'walk';
    if (state === 'attack') {
      const cyc = (it.st.t % 1.6) / 1.6;
      it.st.windup = cyc < 0.7 ? cyc / 0.7 : -1;
      if (cyc >= 0.7 && it.st.sinceHit > 0.5) it.st.sinceHit = 0;
    }
    animate(it.inst, it.prof, it.st, dt);
    const v = it.pos.clone().project(cam);
    it.label.style.left = `${((v.x + 1) / 2) * innerWidth}px`;
    it.label.style.top = `${((1 - v.y) / 2) * innerHeight + 8}px`;
  }
  renderer.render(scene, cam);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
(window as unknown as { __ready: boolean }).__ready = true;
