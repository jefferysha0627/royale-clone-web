import { CARDS, UNITS, type CardDef } from '../sim';
import { portraits } from '../render3d/portraits';

/** 卡牌分類標籤，用於牌組編輯畫面。 */
export function cardTags(c: CardDef): string[] {
  if (c.kind === 'spell') {
    const s = c.spell!;
    const tags = ['法術'];
    if (s.stun) tags.push('暈眩');
    if (s.pushback) tags.push('擊退');
    if (s.kind === 'area') tags.push('持續');
    if (s.spawn) tags.push('召喚');
    if (!s.hitsAir) tags.push('只打地面');
    return tags;
  }
  const u = UNITS[c.unit!].stats;
  const tags: string[] = [];
  if (c.kind === 'building') tags.push('建築');
  else if (u.flying) tags.push('飛行');
  else if (u.targets === 'buildings') tags.push('只打建築');
  else tags.push(u.projectile && !u.kamikaze ? '遠程' : '近戰');
  if (u.splash || u.projectile?.splash) tags.push('範圍');
  if (c.kind !== 'building' && u.targets === 'air-ground' && !u.flying) tags.push('可打空中');
  if ((c.count ?? 1) > 1) tags.push(`×${c.count}`);
  return tags;
}

const RARITY_NAME: Record<string, string> = { common: '普通', rare: '稀有', epic: '史詩', legendary: '傳奇' };

export function rarityName(r: string): string {
  return RARITY_NAME[r] ?? r;
}

/** 填入卡面內容（3D 渲染的卡圖、費用、名稱、稀有度外框）。卡圖還沒產生好時先顯示單字圖示。 */
export function fillCard(el: HTMLElement, cardId: string | undefined): void {
  const c = cardId ? CARDS[cardId] : undefined;
  el.classList.remove('r-common', 'r-rare', 'r-epic', 'r-legendary');
  if (!c) {
    el.innerHTML = '';
    delete el.dataset.card;
    el.removeAttribute('aria-label');
    return;
  }
  el.classList.add(`r-${c.rarity}`);
  el.dataset.card = c.id;
  el.setAttribute('aria-label', `${c.name}，${c.cost} 能量`);
  const url = portraits.get(c.id);
  const art = url ? `<img class="card-img" src="${url}" alt="" draggable="false" />` : `<span class="card-glyph">${c.glyph}</span>`;
  el.innerHTML = `${art}<span class="cost"><b>${c.cost}</b></span><span class="card-name">${c.name}</span><span class="fill"></span>`;
}

/** 卡圖產生完成後，把頁面上已經畫好的卡片換成圖。 */
export function refreshPortraits(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.card[data-card]').forEach((el) => {
    const id = el.dataset.card!;
    const url = portraits.get(id);
    if (!url) return;
    const glyph = el.querySelector('.card-glyph');
    if (glyph) {
      const img = document.createElement('img');
      img.className = 'card-img';
      img.src = url;
      img.alt = '';
      img.draggable = false;
      glyph.replaceWith(img);
    }
  });
}

export function avgCost(deck: readonly string[]): number {
  if (deck.length === 0) return 0;
  return deck.reduce((s, id) => s + (CARDS[id]?.cost ?? 0), 0) / deck.length;
}

/** 皇冠圖示（原創造型）。 */
export function crownSvg(): string {
  return '<svg viewBox="0 0 24 20" aria-hidden="true"><path d="M2 17 L3.5 5 L8.5 10 L12 2 L15.5 10 L20.5 5 L22 17 Z" /><rect x="2" y="16.5" width="20" height="3" rx="1" /></svg>';
}

export function crownSlots(el: HTMLElement, n: number, on: number): void {
  if (el.childElementCount !== n) {
    el.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      s.className = 'crown-i';
      s.innerHTML = crownSvg();
      el.appendChild(s);
    }
  }
  Array.from(el.children).forEach((c, i) => {
    const was = c.classList.contains('on');
    const now = i < on;
    c.classList.toggle('on', now);
    if (now && !was) {
      c.classList.remove('pop');
      void (c as HTMLElement).offsetWidth;
      c.classList.add('pop');
    }
  });
}
