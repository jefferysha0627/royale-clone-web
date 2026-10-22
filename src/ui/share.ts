export function shareUrl(): string {
  return `${location.origin}${location.pathname}`;
}

export type ShareOutcome = 'shared' | 'copied' | 'manual' | 'cancelled';

/** 觸控裝置才用原生分享面板；桌面直接複製連結比較直覺。 */
function preferNativeShare(): boolean {
  if (typeof navigator.share !== 'function') return false;
  try {
    return window.matchMedia('(pointer: coarse)').matches;
  } catch {
    return false;
  }
}

/** 觸控裝置優先原生分享，其次剪貼簿，最後顯示可手動複製的網址。 */
export async function shareGame(text: string): Promise<ShareOutcome> {
  const url = shareUrl();
  if (preferNativeShare()) {
    try {
      await navigator.share({ title: document.title, text, url });
      return 'shared';
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return 'cancelled';
    }
  }
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(url);
      return 'copied';
    } catch {
      // 改用手動複製
    }
  }
  return 'manual';
}
