// 自製向量圖示（48×48 座標），卡面用 SVG、場上單位用 Canvas Path2D，兩邊共用同一份路徑。
export interface IconPart {
  d: string;
  fill?: string;
  stroke?: string;
  w?: number;
}

const circle = (cx: number, cy: number, r: number): string =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`;

export const ICONS: Record<string, IconPart[]> = {
  swordsman: [
    { d: 'M35 5 L43 5 L43 13 L19 37 L11 29 Z', fill: '#e9eef5', stroke: '#5b6470', w: 1.5 },
    { d: 'M37 9 L21 25', stroke: '#b9c3cf', w: 1.5 },
    { d: 'M7 25 L23 41 L20 44 L4 28 Z', fill: '#f2b233', stroke: '#7a5410', w: 1.2 },
    { d: 'M10 36 L13 39 L7 45 L4 42 Z', fill: '#7b4a26' },
    { d: circle(4.5, 44, 2.6), fill: '#f2b233' },
  ],
  archers: [
    { d: 'M15 4 Q44 24 15 44', stroke: '#8b5a2b', w: 4.5 },
    { d: 'M15 4 L15 44', stroke: '#f1e7d0', w: 1.4 },
    { d: 'M6 24 L40 24', stroke: '#d9c8a6', w: 2.4 },
    { d: 'M40 24 L33 19 L35 24 L33 29 Z', fill: '#cfd6de' },
    { d: 'M6 24 L2 20 L9 24 L2 28 Z', fill: '#5fbf7a' },
  ],
  musketeer: [
    { d: 'M6 38 L36 8 L40 12 L10 42 Z', fill: '#3a3f47' },
    { d: 'M4 40 L14 30 L22 38 L12 46 Z', fill: '#8b5a2b', stroke: '#4e2f12', w: 1 },
    { d: 'M34 6 L42 6 L42 10 L38 14 Z', fill: '#c9ced6' },
    { d: 'M24 20 C20 10 28 4 36 6 C30 8 28 14 30 20 Z', fill: '#d65d9a' },
    { d: circle(18, 30, 2.5), fill: '#f2b233' },
  ],
  golem: [
    { d: 'M10 42 L5 26 L13 10 L29 5 L42 15 L43 33 L33 43 Z', fill: '#8d9098', stroke: '#4a4d54', w: 2 },
    { d: 'M14 14 L22 22 L18 32 M30 9 L28 18 L36 24 M24 34 L32 38', stroke: '#5b5f67', w: 1.6 },
    { d: circle(18, 22, 3), fill: '#7df9ff' },
    { d: circle(31, 22, 3), fill: '#7df9ff' },
    { d: 'M16 32 Q24 36 33 31', stroke: '#3e4147', w: 2 },
  ],
  raider: [
    { d: 'M13 44 L15 29 C12 22 15 13 23 9 L27 3 L31 9 C38 11 43 17 43 24 L37 27 L30 23 L28 31 L31 44 Z', fill: '#8a5530', stroke: '#4a2a12', w: 1.5 },
    { d: 'M23 9 C19 15 17 22 18 30 L15 29 C12 22 15 13 23 9 Z', fill: '#3b2412' },
    { d: circle(31, 15, 2), fill: '#fff' },
    { d: 'M20 34 L30 34 L30 38 L20 38 Z', fill: '#c8c8c8' },
  ],
  imps: [
    { d: 'M17 6 L20 13 L14 12 Z M31 6 L28 13 L34 12 Z', fill: '#e9e2c0' },
    { d: circle(24, 16, 8), fill: '#62b84a', stroke: '#2f5e22', w: 1.5 },
    { d: circle(12, 33, 8), fill: '#62b84a', stroke: '#2f5e22', w: 1.5 },
    { d: circle(36, 33, 8), fill: '#62b84a', stroke: '#2f5e22', w: 1.5 },
    { d: `${circle(21, 15, 1.6)} ${circle(27, 15, 1.6)} ${circle(9, 32, 1.6)} ${circle(15, 32, 1.6)} ${circle(33, 32, 1.6)} ${circle(39, 32, 1.6)}`, fill: '#ffef7a' },
  ],
  firemage: [
    { d: 'M24 3 C31 13 39 18 37 30 C36 39 31 45 24 45 C16 45 11 39 11 31 C11 24 16 20 17 13 C21 17 22 21 24 24 C26 17 26 10 24 3 Z', fill: '#ff6a2a', stroke: '#9c2b0a', w: 1.5 },
    { d: 'M24 22 C28 28 32 31 31 36 C30 41 27 43 24 43 C20 43 17 40 17 36 C17 31 21 30 22 25 C23 28 24 29 24 22 Z', fill: '#ffd36b' },
  ],
  dragon: [
    { d: 'M6 30 C9 17 21 9 33 11 L44 6 L40 15 C44 19 44 25 40 29 L30 30 L26 37 L17 35 Z', fill: '#2fae9f', stroke: '#145a52', w: 1.5 },
    { d: 'M16 22 C10 12 4 12 2 14 C6 16 8 22 8 28 Z', fill: '#1f7f75' },
    { d: circle(33, 18, 2.2), fill: '#ffe066' },
    { d: 'M40 27 L46 30 L41 32 Z', fill: '#ff8a2a' },
  ],
  bats: [
    { d: 'M24 18 C22 14 20 14 19 16 C16 11 9 11 3 15 C8 18 10 22 10 27 C13 24 16 24 18 28 C20 26 22 26 24 31 C26 26 28 26 30 28 C32 24 35 24 38 27 C38 22 40 18 45 15 C39 11 32 11 29 16 C28 14 26 14 24 18 Z', fill: '#6c4a99', stroke: '#2e1b47', w: 1.4 },
    { d: 'M21 16 L20 11 L23 15 Z M27 16 L28 11 L25 15 Z', fill: '#6c4a99' },
    { d: `${circle(22, 20, 1.2)} ${circle(26, 20, 1.2)}`, fill: '#ffef7a' },
  ],
  cannon: [
    { d: 'M8 23 L37 11 L41 21 L13 33 Z', fill: '#454a52', stroke: '#1d2025', w: 1.5 },
    { d: 'M35 10 L41 8 L45 18 L39 21 Z', fill: '#2c3036' },
    { d: circle(17, 34, 9), fill: '#8b5a2b', stroke: '#4a2a12', w: 2 },
    { d: circle(17, 34, 3), fill: '#f2b233' },
  ],
  fireball: [
    { d: 'M4 44 L18 26 L22 30 Z M6 34 L19 24 L21 28 Z M14 46 L22 30 L26 32 Z', fill: '#ffb347' },
    { d: circle(29, 19, 13), fill: '#ff6a2a', stroke: '#9c2b0a', w: 1.5 },
    { d: circle(31, 17, 7), fill: '#ffd36b' },
  ],
  arrows: [
    { d: 'M12 4 L12 34 M24 8 L24 38 M36 4 L36 34', stroke: '#d9c8a6', w: 2.6 },
    { d: 'M12 44 L6 32 L18 32 Z M24 47 L18 35 L30 35 Z M36 44 L30 32 L42 32 Z', fill: '#cfd6de', stroke: '#5b6470', w: 1 },
    { d: 'M9 4 L12 9 L15 4 M21 8 L24 13 L27 8 M33 4 L36 9 L39 4', stroke: '#5fbf7a', w: 2 },
  ],
  zap: [
    { d: 'M29 3 L11 27 L22 27 L17 45 L38 18 L27 18 L33 3 Z', fill: '#ffe45c', stroke: '#2e86c9', w: 2 },
    { d: 'M27 9 L18 23 L24 23', stroke: '#ffffff', w: 1.5 },
  ],
};

export function iconSvg(id: string): string {
  const parts = ICONS[id] ?? [];
  const body = parts
    .map((p) => {
      const fill = p.fill ?? 'none';
      const stroke = p.stroke ? ` stroke="${p.stroke}" stroke-width="${p.w ?? 1}" stroke-linecap="round" stroke-linejoin="round"` : '';
      return `<path d="${p.d}" fill="${fill}"${stroke}/>`;
    })
    .join('');
  return `<svg viewBox="0 0 48 48" aria-hidden="true">${body}</svg>`;
}

const pathCache = new Map<string, Path2D[]>();

/** 在 Canvas 上以 (cx, cy) 為中心、邊長 size 畫出圖示。 */
export function drawIcon(ctx: CanvasRenderingContext2D, id: string, cx: number, cy: number, size: number): void {
  const parts = ICONS[id];
  if (!parts) return;
  let paths = pathCache.get(id);
  if (!paths) {
    paths = parts.map((p) => new Path2D(p.d));
    pathCache.set(id, paths);
  }
  const k = size / 48;
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(k, k);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p.fill) {
      ctx.fillStyle = p.fill;
      ctx.fill(paths[i]);
    }
    if (p.stroke) {
      ctx.strokeStyle = p.stroke;
      ctx.lineWidth = p.w ?? 1;
      ctx.stroke(paths[i]);
    }
  }
  ctx.restore();
}
