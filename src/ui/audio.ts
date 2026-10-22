// 以 WebAudio 即時合成音效，不需下載音檔。使用者點擊開始後才建立／恢復 AudioContext。
export type SoundName = 'deploy' | 'enemyDeploy' | 'hit' | 'death' | 'tower' | 'spell' | 'win' | 'lose' | 'tap' | 'error' | 'phase';

export class Sound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private lastPlayed = new Map<SoundName, number>();
  muted = false;

  /** 必須在使用者操作的事件處理中呼叫。失敗時維持靜音繼續遊戲。 */
  unlock(): void {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.5;
        this.master.connect(this.ctx.destination);
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

  play(name: SoundName): void {
    const ctx = this.ctx;
    if (this.muted || !ctx || !this.master || ctx.state !== 'running') return;
    // 同類音效 60ms 內只播一次，避免大量堆疊
    const now = ctx.currentTime;
    const last = this.lastPlayed.get(name) ?? -1;
    if (now - last < 0.06) return;
    this.lastPlayed.set(name, now);
    switch (name) {
      case 'tap': this.tone(660, 0.05, 'triangle', 0.25); break;
      case 'deploy': this.sweep(300, 600, 0.12, 'triangle', 0.35); break;
      case 'enemyDeploy': this.sweep(420, 260, 0.1, 'triangle', 0.18); break;
      case 'hit': this.noise(0.05, 0.12, 1800); break;
      case 'death': this.sweep(500, 120, 0.18, 'square', 0.12); break;
      case 'tower': this.noise(0.6, 0.6, 400); this.sweep(160, 40, 0.6, 'sawtooth', 0.25); break;
      case 'spell': this.noise(0.3, 0.4, 900); break;
      case 'error': this.tone(180, 0.12, 'square', 0.15); break;
      case 'phase': this.tone(880, 0.1, 'triangle', 0.3); setTimeout(() => this.tone(1175, 0.15, 'triangle', 0.3), 120); break;
      case 'win': [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.22, 'triangle', 0.35), i * 140)); break;
      case 'lose': [392, 330, 262].forEach((f, i) => setTimeout(() => this.tone(f, 0.3, 'triangle', 0.3), i * 180)); break;
    }
  }

  private tone(freq: number, dur: number, type: OscillatorType, vol: number): void {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g).connect(this.master!);
    o.start();
    o.stop(ctx.currentTime + dur + 0.02);
  }

  private sweep(f1: number, f2: number, dur: number, type: OscillatorType, vol: number): void {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f1, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(f2, ctx.currentTime + dur);
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g).connect(this.master!);
    o.start();
    o.stop(ctx.currentTime + dur + 0.02);
  }

  private noise(dur: number, vol: number, cutoff: number): void {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = cutoff;
    const g = ctx.createGain();
    g.gain.value = vol;
    src.connect(f).connect(g).connect(this.master!);
    src.start();
  }
}
