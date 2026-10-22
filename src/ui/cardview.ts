import { iconSvg } from '../art/icons';
import { CARDS, type CardDef } from '../sim';

/** 卡牌分類標籤，用於牌組編輯畫面。 */
export function cardTags(c: CardDef): string[] {
  if (c.kind === 'spell') return c.spell?.stun ? ['法術', '暈眩'] : ['法術'];
  const u = c.unit!;
  const tags: string[] = [];
  if (c.kind === 'building') tags.push('建築');
  else if (u.flying) tags.push('飛行');
  else if (u.targets === 'buildings') tags.push('只打建築');
  else tags.push(u.projectileSpeed ? '遠程' : '近戰');
  if (u.splash) tags.push('範圍');
  if (c.kind !== 'building' && u.targets === 'air-ground' && !u.flying) tags.push('可打空中');
  if ((c.count ?? 1) > 1) tags.push(`×${c.count}`);
  return tags;
}

/** 填入卡面內容（圖示、能量、名稱）。 */
export function fillCard(el: HTMLElement, cardId: string | undefined): void {
  const c = cardId ? CARDS[cardId] : undefined;
  if (!c) {
    el.innerHTML = '';
    el.style.removeProperty('--c');
    el.removeAttribute('aria-label');
    return;
  }
  el.style.setProperty('--c', c.color);
  el.dataset.card = c.id;
  el.setAttribute('aria-label', `${c.name}，${c.cost} 能量`);
  el.innerHTML = `<span class="cost"><b>${c.cost}</b></span><span class="card-art">${iconSvg(c.id)}</span><span class="card-name">${c.name}</span><span class="fill"></span>`;
}

export function avgCost(deck: readonly string[]): number {
  if (deck.length === 0) return 0;
  return deck.reduce((s, id) => s + (CARDS[id]?.cost ?? 0), 0) / deck.length;
}
