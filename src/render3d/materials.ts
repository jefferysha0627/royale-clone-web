import { Color, MeshLambertMaterial, type MeshLambertMaterialParameters } from 'three';

// 卡通明亮風：Lambert 漫射 + 邊緣光（rim light）+ 受擊閃白（用 emissive）。所有單位共用同一個 shader 程式。

const RIM_COLOR = new Color('#fff4dc');

export interface ToonOptions extends MeshLambertMaterialParameters {
  rim?: number; // 邊緣光強度
}

export function toonMaterial(opts: ToonOptions = {}): MeshLambertMaterial {
  const { rim = 0.38, ...rest } = opts;
  const m = new MeshLambertMaterial({ vertexColors: true, ...rest });
  m.userData.rim = rim;
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uRim = { value: m.userData.rim };
    shader.uniforms.uRimColor = { value: RIM_COLOR };
    m.userData.shader = shader;
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uRim;\nuniform vec3 uRimColor;')
      .replace(
        '#include <opaque_fragment>',
        // 正交相機下觀看方向固定為視角座標 +Z；法線越側向越亮，做出卡通角色的輪廓光
        `float rimF = 1.0 - clamp(dot(normalize(normal), vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
        outgoingLight += uRimColor * pow(rimF, 2.6) * uRim;
        #include <opaque_fragment>`,
      );
  };
  m.customProgramCacheKey = () => 'toon-rim';
  return m;
}

/** 受擊閃白、冰凍、暈眩等狀態色，寫入 emissive。 */
export function setStatusTint(m: MeshLambertMaterial, flash: number, frozen: boolean, stunned: boolean): void {
  let r = flash;
  let g = flash;
  let b = flash;
  if (frozen) {
    r += 0.05;
    g += 0.22;
    b += 0.42;
  } else if (stunned) {
    r += 0.2;
    g += 0.2;
    b += 0.04;
  }
  m.emissive.setRGB(Math.min(1, r), Math.min(1, g), Math.min(1, b));
}
