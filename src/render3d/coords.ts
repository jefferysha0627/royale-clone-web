import { ARENA } from '../sim';

// 3D 世界座標：X = 格子 x − 9（中心為 0）、Z = 格子 y − 16（往玩家方向為 +Z）、Y 朝上；1 單位 = 1 格。
// 相機為正交投影、由玩家側上方俯視（仰角 CAM_ELEV），地面會因角度略為壓縮，與原作的斜俯視構圖相同。

export const CX = ARENA.width / 2;
export const CZ = ARENA.height / 2;

/** 相機仰角（與地面夾角）。原作截圖量測：縱向格距約為橫向的 0.79 倍 → 約 52°（本作量測，非官方數據）。 */
export const CAM_ELEV = (52 * Math.PI) / 180;
export const SIN_E = Math.sin(CAM_ELEV);
export const COS_E = Math.cos(CAM_ELEV);

export const toX = (x: number): number => x - CX;
export const toZ = (y: number): number => y - CZ;

/** 模擬中的朝向角（atan2(dy, dx)）→ 模型繞 Y 軸的旋轉（模型預設面向 +Z）。 */
export function yawOf(facing: number): number {
  const dx = Math.cos(facing);
  const dz = Math.sin(facing);
  return Math.atan2(dx, dz);
}

/** 角度內插（走最短方向）。 */
export function lerpAngle(a: number, b: number, t: number): number {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

export const TEAM_RGB: Record<0 | 1, { main: string; light: string; dark: string; bar: string }> = {
  0: { main: '#2f74e8', light: '#8fc2ff', dark: '#1b3f86', bar: '#3fa2ff' },
  1: { main: '#de3b33', light: '#ff9a8f', dark: '#86221d', bar: '#ff4d48' },
};
