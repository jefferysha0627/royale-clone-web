import type { Game, GameEvent } from '../sim';

export interface DeployPreview {
  cardId: string;
  x: number;
  y: number;
  legal: boolean;
}

/** 對戰畫面渲染器（3D 為主，WebGL 不可用時退回 2D）。只讀模擬狀態，不改變對戰結果。 */
export interface BattleRenderer {
  readonly kind: '2d' | '3d';
  preview: DeployPreview | null;
  showZone: boolean;
  selectedCard: string | null;
  readonly effectCount: number;
  resize(cssW: number, cssH: number): void;
  /** 畫布 CSS 座標 → 場地格座標。 */
  toWorld(px: number, py: number): [number, number];
  /** 場地格座標（地面）→ 畫布 CSS 座標。 */
  toScreen(x: number, y: number): [number, number];
  reset(): void;
  /** 換競技場配色（獎盃進度），2D 畫面可以不支援。 */
  setArenaTheme?(theme: number): void;
  pushEvents(events: GameEvent[], game: Game): void;
  render(game: Game, alpha: number, dt: number): void;
  dispose?(): void;
}
