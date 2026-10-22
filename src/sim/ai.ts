import { ARENA, DT, MATCH } from './config';
import { CARDS, canHitAir, type CardDef } from './cards';
import { Game, viewY, type Entity, type Team } from './game';
import type { Rng } from './rng';

export interface AiOptions {
  reaction: number; // 平均思考間隔（秒）
  pushElixir: number; // 無威脅時累積到多少能量才進攻
  ignoreHp: number; // 威脅總血量低於此值且尚未逼近時，交給防禦塔處理
  skill: number; // 0～1：選到最佳應對卡、及時反應、跟進支援的機率
  noise: number; // 部署位置的隨機偏差（格）
  patience: number; // 敵方前排推進到己方視角的這個 y 之前，先不派部隊防守（讓防禦塔先輸出）
}

export type AiLevel = 'easy' | 'normal' | 'hard';

// 難度只改變反應速度與積極程度；所有難度都遵守同一套能量、手牌與部署規則。
export const AI_LEVELS: Record<AiLevel, AiOptions> = {
  easy: { reaction: 1.4, pushElixir: 9.5, ignoreHp: 900, skill: 0.3, noise: 2.5, patience: 13 },
  normal: { reaction: 0.9, pushElixir: 8.5, ignoreHp: 350, skill: 0.7, noise: 1, patience: 15 },
  hard: { reaction: 0.5, pushElixir: 9, ignoreHp: 600, skill: 1, noise: 0.4, patience: 17 },
};

export const AI_NORMAL: AiOptions = AI_LEVELS.normal;

interface HandCard {
  index: number;
  card: CardDef;
}

/**
 * 電腦對手：只透過 Game.deploy() 出牌，與玩家遵循相同的能量、手牌與部署區規則。
 * 以「隊伍自身視角」思考（己方在下方），再換算回世界座標。
 */
export class AiController {
  private thinkTimer: number;

  constructor(
    private readonly game: Game,
    readonly team: Team,
    private readonly rng: Rng,
    private readonly opts: AiOptions = AI_NORMAL,
  ) {
    this.thinkTimer = 1.5 + rng.range(0, 1);
  }

  update(): void {
    if (this.game.phase === 'ended') return;
    this.thinkTimer -= DT;
    if (this.thinkTimer > 0) return;
    this.thinkTimer = this.opts.reaction * this.rng.range(0.7, 1.3);
    this.think();
  }

  private get enemy(): Team {
    return this.team === 0 ? 1 : 0;
  }

  private vy(y: number): number {
    return viewY(this.team, y);
  }

  private hand(): HandCard[] {
    const p = this.game.players[this.team];
    return p.hand.map((id, index) => ({ index, card: CARDS[id] })).filter((h) => h.card.cost <= p.elixir);
  }

  private chance(p: number): boolean {
    return this.rng.next() < p;
  }

  private tryDeploy(h: HandCard, x: number, vy: number): boolean {
    if (this.opts.noise > 0) {
      x += this.rng.range(-this.opts.noise, this.opts.noise);
      vy += this.rng.range(-this.opts.noise, this.opts.noise) * 0.6;
    }
    // 依序嘗試附近位置，找到合法點才出牌
    const offsets: [number, number][] = [[0, 0], [0, 1], [1, 0], [-1, 0], [0, 2], [1.5, 1], [-1.5, 1], [0, 3]];
    for (const [ox, oy] of offsets) {
      const px = Math.max(1, Math.min(ARENA.width - 1, x + ox));
      const py = viewY(this.team, vy + oy);
      if (!this.game.canDeployAt(this.team, h.card.id, px, py)) continue;
      return this.game.deploy(this.team, h.index, px, py).ok;
    }
    return false;
  }

  private think(): void {
    const g = this.game;
    const p = g.players[this.team];
    const threats = g.entities.filter((e) => e.alive && e.team === this.enemy && e.kind === 'troop' && this.vy(e.y) > 13);

    const skill = this.opts.skill;
    // 技巧較低時偶爾慢半拍才反應
    if (threats.length > 0 && this.chance(0.35 + skill * 0.65) && this.defend(threats)) return;
    if (skill >= 0.5 && this.finisher()) return;
    if (threats.length === 0 && this.chance(skill) && this.support()) return;
    if (threats.length === 0 && p.elixir >= this.opts.pushElixir + this.rng.range(-0.5, 1)) {
      if (this.push()) return;
    }
    if (p.elixir >= MATCH.maxElixir - 0.2) this.dumpCheapest();
  }

  private defend(threats: Entity[]): boolean {
    const hand = this.hand();
    if (hand.length === 0) return false;
    const threatHp = threats.reduce((s, e) => s + e.hp, 0);
    const lead = threats.reduce((a, b) => (this.vy(b.y) > this.vy(a.y) ? b : a));
    // 威脅很小且還沒逼近時交給防禦塔
    if (threatHp < this.opts.ignoreHp && this.vy(lead.y) < 22) return false;

    // 1) 密集小部隊 → 範圍法術
    const cluster = this.bestCluster(threats, 2.5);
    if (cluster.count >= 3 || (cluster.count >= 2 && cluster.hp >= 600)) {
      const spell = hand
        .filter((h) => h.card.kind === 'spell')
        .find((h) => threats.filter((t) => Math.hypot(t.x - cluster.x, t.y - cluster.y) <= h.card.spell!.radius).length >= 2);
      if (spell && this.game.deploy(this.team, spell.index, cluster.x, cluster.y).ok) return true;
    }

    const flying = threats.some((t) => t.stats.flying);
    const buildingHunter = threats.some((t) => t.stats.targets === 'buildings');
    // 等前排過河再出部隊防守；只打建築的部隊例外（要先放建築把它拉到中間）
    if (this.vy(lead.y) < this.opts.patience && !buildingHunter) return false;
    const swarm = cluster.count >= 3;

    const candidates = hand.filter((h) => h.card.kind !== 'spell' && h.card.unit!.targets !== 'buildings');
    if (candidates.length === 0) return false;
    const score = (h: HandCard): number => {
      const c = h.card;
      const u = c.unit!;
      let s = u.hp / 400 + (u.damage / u.hitSpeed) / 100;
      if (flying && !canHitAir(c)) s -= 10;
      if (swarm && u.splash) s += 4;
      if (buildingHunter && c.kind === 'building') s += 5;
      if (buildingHunter && (c.count ?? 1) >= 3) s += 2;
      s -= c.cost * 0.4;
      return s + this.rng.range(0, 0.5);
    };
    candidates.sort((a, b) => score(b) - score(a));
    const pick = this.chance(this.opts.skill) ? candidates[0] : this.rng.pick(candidates);
    if (score(pick) < -5) return false;

    const leadVy = this.vy(lead.y);
    let x = lead.x;
    let vy: number;
    if (pick.card.kind === 'building') {
      x = ARENA.width / 2 + (lead.x < ARENA.width / 2 ? -1 : 1);
      vy = 23;
    } else {
      const ranged = !!pick.card.unit!.projectileSpeed;
      vy = Math.min(27.5, Math.max(19, leadVy + (ranged ? 4 : 2)));
    }
    return this.tryDeploy(pick, x, vy);
  }

  private bestCluster(units: Entity[], radius: number): { x: number; y: number; count: number; hp: number } {
    let best = { x: 0, y: 0, count: 0, hp: 0 };
    for (const c of units) {
      const near = units.filter((u) => Math.hypot(u.x - c.x, u.y - c.y) <= radius);
      const hp = near.reduce((s, u) => s + u.hp, 0);
      if (near.length > best.count || (near.length === best.count && hp > best.hp)) {
        const x = near.reduce((s, u) => s + u.x, 0) / near.length;
        const y = near.reduce((s, u) => s + u.y, 0) / near.length;
        best = { x, y, count: near.length, hp };
      }
    }
    return best;
  }

  /** 對方塔血量低於法術對塔傷害時直接收尾。 */
  private finisher(): boolean {
    for (const h of this.hand()) {
      if (h.card.kind !== 'spell') continue;
      const s = h.card.spell!;
      const dmg = Math.round(s.damage * s.towerDamagePct);
      const tower = this.game.towers(this.enemy).find((t) => t.alive && t.hp <= dmg);
      if (tower && this.game.deploy(this.team, h.index, tower.x, tower.y).ok) return true;
    }
    return false;
  }

  private targetLane(): number {
    const towers = this.game.towers(this.enemy).filter((t) => t.cardId === 'princess');
    const down = towers.find((t) => !t.alive);
    if (down) return down.lane;
    const [a, b] = towers;
    if (Math.abs(a.hp - b.hp) > 200) return a.hp < b.hp ? a.lane : b.lane;
    return this.rng.int(2);
  }

  private laneX(lane: number): number {
    return ARENA.bridgeXs[lane];
  }

  private push(): boolean {
    const hand = this.hand();
    if (hand.length === 0) return false;
    const lane = this.targetLane();
    const x = this.laneX(lane);
    const tank = hand.find((h) => h.card.id === 'golem');
    if (tank) return this.tryDeploy(tank, x, 30.5);
    const hunter = hand.find((h) => h.card.id === 'raider');
    if (hunter) return this.tryDeploy(hunter, x, 18);
    const troops = hand.filter((h) => h.card.kind === 'troop').sort((a, b) => b.card.unit!.hp - a.card.unit!.hp);
    if (troops.length === 0) return false;
    const pick = troops[0];
    return this.tryDeploy(pick, x, pick.card.unit!.projectileSpeed ? 21 : 19);
  }

  /** 己方坦克推進中，或防守後的部隊正要過河反攻時，在後方補支援。 */
  private support(): boolean {
    const g = this.game;
    const mine = g.entities.filter((e) => e.alive && e.team === this.team && e.kind === 'troop' && this.vy(e.y) < 27 && this.vy(e.y) > 13);
    let tank = mine.find((e) => e.stats.hp >= 1400 && this.vy(e.y) > 17);
    if (!tank && this.opts.skill >= 0.7) {
      // 反攻：存活部隊總血量夠高時，跟上前排
      const total = mine.reduce((sum, e) => sum + e.hp, 0);
      if (total >= 900) tank = mine.reduce((a, b) => (this.vy(b.y) < this.vy(a.y) ? b : a));
    }
    if (!tank) return false;
    const p = g.players[this.team];
    const supports = this.hand().filter((h) => h.card.kind === 'troop' && h.card.unit!.targets !== 'buildings' && h.card.unit!.hp < 1400);
    const pick = supports.find((h) => p.elixir - h.card.cost >= 1);
    if (!pick) return false;
    return this.tryDeploy(pick, tank.x, Math.max(18, this.vy(tank.y) + 2));
  }

  private dumpCheapest(): void {
    const hand = this.hand()
      .filter((h) => h.card.kind !== 'spell')
      .sort((a, b) => a.card.cost - b.card.cost);
    const pick = hand[0];
    if (!pick) return;
    const lane = this.rng.int(2);
    this.tryDeploy(pick, this.laneX(lane), pick.card.kind === 'building' ? 23 : 28);
  }
}
