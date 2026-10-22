import { Color, DirectionalLight, HemisphereLight, PCFShadowMap, Scene, SRGBColorSpace, WebGLRenderer } from 'three';

// 共用的燈光與渲染器設定：暖色日光從右前上方照下（影子落向左後方，與原作截圖的光向一致），天空光補足暗部。

export interface Stage {
  renderer: WebGLRenderer;
  scene: Scene;
  sun: DirectionalLight;
  hemi: HemisphereLight;
}

export function createRenderer(canvas: HTMLCanvasElement, opts: { antialias?: boolean; preserve?: boolean; alpha?: boolean } = {}): WebGLRenderer {
  const r = new WebGLRenderer({
    canvas,
    antialias: opts.antialias ?? true,
    alpha: opts.alpha ?? false,
    preserveDrawingBuffer: opts.preserve ?? false,
    powerPreference: 'high-performance',
  });
  r.outputColorSpace = SRGBColorSpace;
  r.shadowMap.enabled = true;
  r.shadowMap.type = PCFShadowMap;
  return r;
}

export function createStage(renderer: WebGLRenderer, shadowSize = 2048): Stage {
  const scene = new Scene();
  scene.background = new Color('#2d4f2a');
  const hemi = new HemisphereLight('#fff6e0', '#6f8f4f', 2.1);
  scene.add(hemi);
  const sun = new DirectionalLight('#fff1d6', 2.6);
  sun.position.set(9, 22, 12);
  sun.target.position.set(0, 0, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  const cam = sun.shadow.camera;
  cam.left = -15;
  cam.right = 15;
  cam.top = 21;
  cam.bottom = -21;
  cam.near = 1;
  cam.far = 60;
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 2;
  scene.add(sun);
  scene.add(sun.target);
  return { renderer, scene, sun, hemi };
}
