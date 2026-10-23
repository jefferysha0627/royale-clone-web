import type { GameMode } from '../sim';

// 活動對戰的名稱與說明（規則本身在 sim/game.ts 的 elixirMultiplier 與建構式）。

export interface ModeInfo {
  id: GameMode;
  name: string;
  badge: string; // 卡片上的大字
  desc: string;
  /** 開戰時橫幅的副標。 */
  rule: string;
}

export const EVENT_MODES: ModeInfo[] = [
  { id: 'double', name: '雙倍能量', badge: 'x2', desc: '整場能量 2 倍、延長賽 3 倍，推進一波接一波。', rule: '整場能量 2 倍' },
  { id: 'triple', name: '三倍能量', badge: 'x3', desc: '從頭到尾 3 倍能量，重型部隊也能接連上場。', rule: '整場能量 3 倍' },
  { id: 'sudden', name: '驟死對決', badge: '1', desc: '開場就是延長賽：先推倒任一座塔立刻獲勝，能量 2 倍、最後 60 秒 3 倍。', rule: '能量 2 倍・先推倒任一座塔就獲勝' },
];

export function modeInfo(m: GameMode | undefined): ModeInfo | null {
  return EVENT_MODES.find((x) => x.id === m) ?? null;
}
