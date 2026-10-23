import { Color, MeshLambertMaterial, type MeshLambertMaterialParameters } from 'three';

// 卡通明亮風：Lambert 漫射 + 邊緣光（rim light）+ 金屬／寶石的鏡面高光 + 受擊閃白（用 emissive）。所有單位共用同一個 shader 程式。
// 光澤度是每個頂點的屬性（Kit 零件的 shine），盔甲、刀劍、金飾會反光，布料與皮膚不會。

const RIM_COLOR = new Color('#fff4dc');

export interface ToonOptions extends MeshLambertMaterialParameters {
  rim?: number; // 邊緣光強度
  spec?: number; // 鏡面高光強度
}

export function toonMaterial(opts: ToonOptions = {}): MeshLambertMaterial {
  const { rim = 0.38, spec = 0.42, ...rest } = opts;
  const m = new MeshLambertMaterial({ vertexColors: true, ...rest });
  m.userData.rim = rim;
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uRim = { value: m.userData.rim };
    shader.uniforms.uRimColor = { value: RIM_COLOR };
    shader.uniforms.uSpec = { value: spec };
    m.userData.shader = shader;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float shine;\nvarying float vShine;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvShine = shine;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uRim;\nuniform vec3 uRimColor;\nuniform float uSpec;\nvarying float vShine;')
      .replace(
        '#include <opaque_fragment>',
        // 正交相機下觀看方向固定為視角座標 +Z；法線越側向越亮，做出卡通角色的輪廓光
        `vec3 nrm = normalize(normal);
        float rimF = 1.0 - clamp(dot(nrm, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
        outgoingLight += uRimColor * pow(rimF, 2.6) * uRim * (1.0 + vShine * 0.8);
        #if NUM_DIR_LIGHTS > 0
        if (vShine > 0.01) {
          // 主光源的 Blinn-Phong 高光：一小塊亮點＋較寬的柔和光暈，金屬看起來會「閃」
          vec3 hv = normalize(directionalLights[0].direction + vec3(0.0, 0.0, 1.0));
          float nh = max(dot(nrm, hv), 0.0);
          float sp = pow(nh, 48.0) + 0.1 * pow(nh, 8.0);
          outgoingLight += directionalLights[0].color * sp * vShine * uSpec;
        }
        #endif
        #include <opaque_fragment>`,
      );
  };
  m.customProgramCacheKey = () => 'toon-rim-spec';
  return m;
}

/** 受擊閃白、冰凍、暈眩等狀態色，寫入 emissive。 */
export function setStatusTint(m: MeshLambertMaterial, flash: number, frozen: boolean, stunned: boolean, raged = 0, slowed = false): void {
  let r = flash;
  let g = flash;
  let b = flash;
  // 狂暴：脈動的紅光（raged = 0～1 的強度）
  if (raged > 0) {
    r += 0.32 * raged;
    g += 0.02 * raged;
    b += 0.08 * raged;
  }
  if (frozen) {
    r += 0.05;
    g += 0.22;
    b += 0.42;
  } else if (stunned) {
    r += 0.2;
    g += 0.2;
    b += 0.04;
  } else if (slowed) {
    // 被冰彈減速：淡淡的冰藍色
    g += 0.1;
    b += 0.24;
  }
  m.emissive.setRGB(Math.min(1, r), Math.min(1, g), Math.min(1, b));
}
