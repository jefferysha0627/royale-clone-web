// 以 WebAudio 即時合成所有音效與背景音樂（原創），不需要下載音檔。
// 使用者點擊開始後才建立／恢復 AudioContext；失敗時維持無聲繼續遊戲。

type Voice = (ctx: AudioContext, out: AudioNode, t: number) => void;

const MIN_GAP: Record<string, number> = { hit: 0.05, towerHit: 0.07, slash: 0.05, bow: 0.06, death: 0.08, bite: 0.06, punch: 0.08 };

export class Sound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfx: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private lastPlayed = new Map<string, number>();
  private voices = 0;
  muted = false;
  musicOn = true;
  private music: { timer: number; next: number; step: number; tempo: number; intensity: number } | null = null;

  /** 必須在使用者操作的事件處理中呼叫。失敗時維持靜音繼續遊戲。 */
  unlock(): void {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.55;
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -14;
        comp.ratio.value = 4;
        this.master.connect(comp).connect(this.ctx.destination);
        this.sfx = this.ctx.createGain();
        this.sfx.connect(this.master);
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.16;
        this.musicGain.connect(this.master);
        const len = this.ctx.sampleRate;
        this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = this.noiseBuf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume().catch(() => undefined);
    } catch {
      this.ctx = null;
    }
  }

  suspend(): void {
    if (this.ctx && this.ctx.state === 'running') void this.ctx.suspend().catch(() => undefined);
  }

  get state(): string {
    return this.ctx ? this.ctx.state : 'unavailable';
  }

  private ready(): AudioContext | null {
    const ctx = this.ctx;
    if (this.muted || !ctx || !this.sfx || ctx.state !== 'running') return null;
    return ctx;
  }

  play(name: string): void {
    const ctx = this.ready();
    if (!ctx) return;
    // 同類音效短時間內只播一次、同時發聲數有上限，避免大量部隊時堆疊爆音
    const now = ctx.currentTime;
    const last = this.lastPlayed.get(name) ?? -1;
    if (now - last < (MIN_GAP[name] ?? 0.06)) return;
    if (this.voices > 26 && !['win', 'lose', 'tower', 'kingDown', 'crown', 'go', 'count'].includes(name)) return;
    this.lastPlayed.set(name, now);
    const v = VOICES[name];
    if (!v) return;
    this.voices++;
    window.setTimeout(() => (this.voices = Math.max(0, this.voices - 1)), 400);
    try {
      v(ctx, this.sfx!, now + 0.005);
    } catch {
      // 個別音效失敗不影響遊戲
    }
  }

  // ───────── 背景音樂（原創的循環小調） ─────────

  startMusic(): void {
    const ctx = this.ctx;
    if (!ctx || !this.musicGain || this.music) return;
    this.music = { timer: 0, next: ctx.currentTime + 0.1, step: 0, tempo: 118, intensity: 0 };
    const tick = () => {
      if (!this.music || !this.ctx) return;
      const c = this.ctx;
      const m = this.music;
      const stepDur = 60 / m.tempo / 2; // 八分音符
      while (m.next < c.currentTime + 0.25) {
        if (!this.muted && this.musicOn && c.state === 'running') scheduleMusicStep(c, this.musicGain!, this.noiseBuf!, m.step, m.next, stepDur, m.intensity);
        m.next += stepDur;
        m.step = (m.step + 1) % 64;
      }
    };
    this.music.timer = window.setInterval(tick, 60);
    tick();
  }

  setMusicIntensity(level: number): void {
    if (!this.music) return;
    this.music.intensity = level;
    this.music.tempo = level >= 2 ? 136 : level === 1 ? 126 : 118;
  }

  stopMusic(): void {
    if (!this.music) return;
    clearInterval(this.music.timer);
    this.music = null;
  }
}

// ───────── 合成工具 ─────────

function env(g: GainNode, t: number, a: number, peak: number, d: number): void {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}

function tone(ctx: AudioContext, out: AudioNode, t: number, type: OscillatorType, f0: number, f1: number, dur: number, vol: number, attack = 0.005): void {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  env(g, t, attack, vol, dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + attack + dur + 0.05);
}

let sharedNoise: AudioBuffer | null = null;
function noiseBuffer(ctx: AudioContext): AudioBuffer {
  if (sharedNoise && sharedNoise.sampleRate === ctx.sampleRate) return sharedNoise;
  const len = ctx.sampleRate;
  sharedNoise = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = sharedNoise.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return sharedNoise;
}

function noise(ctx: AudioContext, out: AudioNode, t: number, dur: number, vol: number, type: BiquadFilterType, f0: number, f1 = f0, q = 1, attack = 0.003): void {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx);
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
  const g = ctx.createGain();
  env(g, t, attack, vol, dur);
  src.connect(f).connect(g).connect(out);
  src.start(t, Math.random() * 0.5);
  src.stop(t + attack + dur + 0.05);
}

const VOICES: Record<string, Voice> = {
  tap: (c, o, t) => tone(c, o, t, 'triangle', 880, 990, 0.05, 0.22),
  error: (c, o, t) => {
    tone(c, o, t, 'square', 220, 180, 0.12, 0.12);
    tone(c, o, t + 0.08, 'square', 180, 150, 0.12, 0.1);
  },
  deploy: (c, o, t) => {
    noise(c, o, t, 0.18, 0.35, 'bandpass', 600, 2400, 1.2);
    tone(c, o, t + 0.12, 'sine', 160, 70, 0.16, 0.5);
  },
  enemyDeploy: (c, o, t) => {
    noise(c, o, t, 0.15, 0.18, 'bandpass', 500, 1600, 1.2);
    tone(c, o, t + 0.1, 'sine', 140, 70, 0.14, 0.28);
  },
  thud: (c, o, t) => {
    tone(c, o, t, 'sine', 120, 40, 0.35, 0.8);
    noise(c, o, t, 0.25, 0.3, 'lowpass', 400, 120);
  },
  slash: (c, o, t) => {
    noise(c, o, t, 0.08, 0.25, 'bandpass', 3200, 1400, 2);
    tone(c, o, t + 0.04, 'triangle', 1400 + Math.random() * 300, 900, 0.07, 0.08);
  },
  punch: (c, o, t) => {
    tone(c, o, t, 'sine', 110, 50, 0.18, 0.6);
    noise(c, o, t, 0.12, 0.3, 'lowpass', 900, 200);
  },
  bite: (c, o, t) => noise(c, o, t, 0.06, 0.2, 'bandpass', 1800, 900, 3),
  hit: (c, o, t) => noise(c, o, t, 0.06, 0.18, 'bandpass', 1500 + Math.random() * 600, 700, 1.5),
  heavyHit: (c, o, t) => {
    noise(c, o, t, 0.12, 0.35, 'lowpass', 2200, 300);
    tone(c, o, t, 'sine', 95, 45, 0.2, 0.5);
  },
  towerHit: (c, o, t) => {
    noise(c, o, t, 0.1, 0.22, 'bandpass', 700, 300, 1);
    tone(c, o, t, 'sine', 180, 90, 0.1, 0.18);
  },
  bow: (c, o, t) => {
    tone(c, o, t, 'triangle', 420, 260, 0.08, 0.16);
    noise(c, o, t + 0.02, 0.1, 0.12, 'highpass', 3000, 5000, 0.7);
  },
  gun: (c, o, t) => {
    noise(c, o, t, 0.16, 0.55, 'lowpass', 4000, 300, 0.7, 0.001);
    tone(c, o, t, 'square', 150, 60, 0.08, 0.2);
  },
  cannon: (c, o, t) => {
    tone(c, o, t, 'sine', 140, 38, 0.38, 0.75);
    noise(c, o, t, 0.3, 0.45, 'lowpass', 1600, 150, 0.7, 0.001);
  },
  fire: (c, o, t) => noise(c, o, t, 0.28, 0.3, 'bandpass', 900, 400, 0.8, 0.02),
  magic: (c, o, t) => {
    tone(c, o, t, 'sine', 660, 990, 0.18, 0.14);
    tone(c, o, t + 0.05, 'sine', 990, 1320, 0.15, 0.1);
  },
  throw: (c, o, t) => noise(c, o, t, 0.12, 0.16, 'bandpass', 900, 2600, 1.5, 0.02),
  beam: (c, o, t) => tone(c, o, t, 'sawtooth', 90, 120, 0.25, 0.06, 0.03),
  boom: (c, o, t) => {
    noise(c, o, t, 0.55, 0.65, 'lowpass', 2600, 120, 0.8, 0.002);
    tone(c, o, t, 'sine', 110, 32, 0.5, 0.75);
  },
  bigBoom: (c, o, t) => {
    noise(c, o, t, 1.0, 0.8, 'lowpass', 3000, 80, 0.8, 0.002);
    tone(c, o, t, 'sine', 90, 25, 0.9, 0.95);
    noise(c, o, t + 0.12, 0.7, 0.3, 'bandpass', 600, 200, 0.6);
  },
  whoosh: (c, o, t) => noise(c, o, t, 0.4, 0.22, 'bandpass', 400, 1800, 1.2, 0.12),
  arrows: (c, o, t) => {
    for (let i = 0; i < 4; i++) noise(c, o, t + i * 0.03, 0.08, 0.14, 'highpass', 2500 + i * 300, 4000, 0.8);
  },
  zap: (c, o, t) => {
    noise(c, o, t, 0.3, 0.45, 'highpass', 1800, 6000, 0.7, 0.001);
    tone(c, o, t, 'sawtooth', 220, 80, 0.25, 0.22);
    tone(c, o, t + 0.05, 'square', 1800, 600, 0.12, 0.08);
  },
  freeze: (c, o, t) => {
    for (let i = 0; i < 4; i++) tone(c, o, t + i * 0.04, 'sine', 2200 + i * 380, 2600 + i * 380, 0.18, 0.07);
    noise(c, o, t, 0.25, 0.12, 'highpass', 5000, 8000, 0.7);
  },
  log: (c, o, t) => {
    noise(c, o, t, 1.1, 0.35, 'lowpass', 300, 160, 0.7, 0.05);
    tone(c, o, t, 'sine', 60, 50, 1.0, 0.3, 0.05);
  },
  poison: (c, o, t) => {
    for (let i = 0; i < 5; i++) tone(c, o, t + i * 0.06, 'sine', 300 + Math.random() * 200, 500, 0.08, 0.08);
  },
  death: (c, o, t) => {
    noise(c, o, t, 0.2, 0.18, 'bandpass', 900, 300, 1);
    tone(c, o, t, 'triangle', 520, 180, 0.2, 0.08);
  },
  crumble: (c, o, t) => {
    noise(c, o, t, 0.5, 0.4, 'lowpass', 1400, 200, 0.7);
    for (let i = 0; i < 4; i++) noise(c, o, t + 0.05 + i * 0.07, 0.07, 0.16, 'bandpass', 1200 - i * 150, 600, 2);
  },
  tower: (c, o, t) => {
    noise(c, o, t, 1.3, 0.85, 'lowpass', 2000, 70, 0.7, 0.002);
    tone(c, o, t, 'sine', 80, 24, 1.2, 0.95);
    for (let i = 0; i < 6; i++) noise(c, o, t + 0.2 + i * 0.09, 0.09, 0.22, 'bandpass', 1400 - i * 120, 500, 2);
  },
  kingDown: (c, o, t) => {
    VOICES.tower(c, o, t);
    VOICES.bigBoom(c, o, t + 0.25);
  },
  kingWake: (c, o, t) => {
    tone(c, o, t, 'square', 392, 392, 0.12, 0.08);
    tone(c, o, t + 0.12, 'square', 523, 523, 0.18, 0.08);
  },
  fuse: (c, o, t) => noise(c, o, t, 0.5, 0.1, 'highpass', 4000, 6000, 1, 0.05),
  charge: (c, o, t) => {
    for (let i = 0; i < 4; i++) noise(c, o, t + i * 0.09, 0.07, 0.25, 'lowpass', 500, 200, 1);
    tone(c, o, t, 'sawtooth', 220, 440, 0.25, 0.06);
  },
  phase: (c, o, t) => {
    [784, 988, 1175, 1568].forEach((f, i) => tone(c, o, t + i * 0.08, 'triangle', f, f, 0.16, 0.18));
  },
  overtime: (c, o, t) => {
    [440, 440, 554, 659].forEach((f, i) => tone(c, o, t + i * 0.14, 'square', f, f, 0.14, 0.1));
  },
  vs: (c, o, t) => {
    noise(c, o, t, 0.5, 0.3, 'bandpass', 200, 2400, 1, 0.2);
    tone(c, o, t + 0.45, 'sine', 120, 50, 0.45, 0.7);
  },
  count: (c, o, t) => tone(c, o, t, 'square', 660, 660, 0.12, 0.12),
  go: (c, o, t) => {
    tone(c, o, t, 'square', 880, 880, 0.3, 0.14);
    tone(c, o, t, 'sawtooth', 440, 440, 0.3, 0.08);
    noise(c, o, t, 0.4, 0.2, 'bandpass', 800, 3000, 1);
  },
  crown: (c, o, t) => {
    [1047, 1319, 1568].forEach((f, i) => tone(c, o, t + i * 0.05, 'triangle', f, f, 0.25, 0.16));
  },
  win: (c, o, t) => {
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(c, o, t + i * 0.13, 'square', f, f, i === 5 ? 0.5 : 0.16, 0.11));
    [262, 330, 392].forEach((f) => tone(c, o, t + 0.65, 'triangle', f, f, 0.7, 0.12));
  },
  lose: (c, o, t) => {
    [392, 370, 349, 262].forEach((f, i) => tone(c, o, t + i * 0.22, 'triangle', f, f * 0.98, i === 3 ? 0.7 : 0.22, 0.16));
  },
  draw: (c, o, t) => {
    [523, 494, 523].forEach((f, i) => tone(c, o, t + i * 0.18, 'triangle', f, f, 0.2, 0.14));
  },
};

// 背景音樂：D 多利安調式的原創旋律，每 64 個八分音符一循環；能量加倍／延長賽時加快並加入更多打擊。
const MEL = [62, -1, 65, 67, 69, -1, 67, 65, 64, -1, 62, -1, 60, 62, 64, -1, 62, -1, 65, 67, 69, 72, 71, 69, 67, -1, 65, -1, 64, 65, 67, -1];
const BASS = [38, 38, 41, 41, 43, 43, 36, 36];

function midi(n: number): number {
  return 440 * Math.pow(2, (n - 69) / 12);
}

function scheduleMusicStep(c: AudioContext, out: AudioNode, nb: AudioBuffer, step: number, t: number, dur: number, intensity: number): void {
  const beat = step % 8;
  // 大鼓
  if (beat === 0 || beat === 4 || (intensity >= 1 && beat === 6)) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    env(g, t, 0.003, 0.9, 0.16);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + 0.2);
  }
  // 小鼓
  if (beat === 2 || beat === 6) {
    const s = c.createBufferSource();
    s.buffer = nb;
    const f = c.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1800;
    const g = c.createGain();
    env(g, t, 0.002, 0.45, 0.12);
    s.connect(f).connect(g).connect(out);
    s.start(t, Math.random() * 0.4);
    s.stop(t + 0.16);
  }
  // 腳踏鈸（加倍時每拍都有）
  if (intensity >= 1 || step % 2 === 0) {
    const s = c.createBufferSource();
    s.buffer = nb;
    const f = c.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 7000;
    const g = c.createGain();
    env(g, t, 0.001, 0.12, 0.04);
    s.connect(f).connect(g).connect(out);
    s.start(t, Math.random() * 0.4);
    s.stop(t + 0.06);
  }
  // 低音
  if (step % 2 === 0) {
    const n = BASS[Math.floor(step / 8) % BASS.length];
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'triangle';
    o.frequency.value = midi(n);
    env(g, t, 0.01, 0.5, dur * 1.6);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + dur * 2);
  }
  // 旋律（撥弦感）
  const m = MEL[step % MEL.length];
  if (m > 0 && (step >= 32 || intensity >= 1)) {
    const o = c.createOscillator();
    const f = c.createBiquadFilter();
    const g = c.createGain();
    o.type = 'square';
    o.frequency.value = midi(m + (intensity >= 2 ? 12 : 0));
    f.type = 'lowpass';
    f.frequency.setValueAtTime(2600, t);
    f.frequency.exponentialRampToValueAtTime(600, t + dur * 1.5);
    env(g, t, 0.005, 0.22, dur * 1.4);
    o.connect(f).connect(g).connect(out);
    o.start(t);
    o.stop(t + dur * 1.6);
  }
}
