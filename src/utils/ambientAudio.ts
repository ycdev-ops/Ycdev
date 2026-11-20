// Synthesized futuristic ambient maritime/aerospace soundscape via Web Audio API.
// Attempts immediate playback on mount and seamlessly unlocks on the earliest browser
// activation event if Chromium autoplay policy suspends AudioContext initially.

export interface AmbientAudioState {
  isPlaying: boolean;
  isMuted: boolean;
  awaitingGesture: boolean;
}

class AmbientSoundController {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private pulseTimer: number | null = null;
  private muted = false;
  private started = false;
  private listeners = new Set<(state: AmbientAudioState) => void>();
  private unlockBound = false;

  public subscribe(cb: (state: AmbientAudioState) => void): () => void {
    this.listeners.add(cb);
    cb(this.getState());
    return () => {
      this.listeners.delete(cb);
    };
  }

  public getState(): AmbientAudioState {
    const running = this.ctx?.state === 'running' && this.started;
    return {
      isPlaying: running && !this.muted,
      isMuted: this.muted,
      awaitingGesture: !running && !this.muted,
    };
  }

  private emit() {
    const state = this.getState();
    this.listeners.forEach((cb) => cb(state));
  }

  private buildGraph(ctx: AudioContext) {
    if (this.started) return;
    this.started = true;

    const master = ctx.createGain();
    master.gain.setValueAtTime(this.muted ? 0 : 0.085, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(340, ctx.currentTime);
    filter.Q.setValueAtTime(1.4, ctx.currentTime);

    master.connect(ctx.destination);
    filter.connect(master);
    this.masterGain = master;

    // Warm futuristic space-maritime harmonic chord (A1 + E2 + B2 + C#3 gentle pad)
    const freqs = [55.0, 82.41, 123.47, 138.59];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.detune.setValueAtTime((idx - 1.5) * 4, ctx.currentTime);
      oscGain.gain.setValueAtTime(idx === 0 ? 0.34 : 0.14, ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      this.oscillators.push(osc);
    });

    // Subtle slow LFO modulating filter cutoff for breathing aerospace atmosphere
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.09, ctx.currentTime);
    lfoGain.gain.setValueAtTime(120, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.oscillators.push(lfo);

    // Gentle telemetry sonar ping every 6.5s when running & unmuted
    this.pulseTimer = window.setInterval(() => {
      if (!this.ctx || this.ctx.state !== 'running' || this.muted || !this.masterGain) {
        return;
      }
      try {
        const now = this.ctx.currentTime;
        const pingOsc = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        pingOsc.type = 'sine';
        pingOsc.frequency.setValueAtTime(659.25, now);
        pingOsc.frequency.exponentialRampToValueAtTime(440, now + 1.4);
        pingGain.gain.setValueAtTime(0.0001, now);
        pingGain.gain.linearRampToValueAtTime(0.045, now + 0.06);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
        pingOsc.connect(pingGain);
        pingGain.connect(this.masterGain);
        pingOsc.start(now);
        pingOsc.stop(now + 1.65);
      } catch {
        // Ignore transient Web Audio scheduling errors
      }
    }, 6500);
  }

  public initAutoPlay() {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      try {
        this.ctx = new AudioCtx();
      } catch {
        return;
      }
    }

    // Auto-start immediately if browser policy grants 'running' state without click.
    // Otherwise wait cleanly for a valid user activation event without emitting console warnings.
    if (this.ctx.state === 'running') {
      this.buildGraph(this.ctx);
      this.emit();
      return;
    }

    this.emit();

    if (!this.unlockBound) {
      this.unlockBound = true;
      const unlock = () => {
        if (!this.ctx) return;
        if (this.ctx.state !== 'running') {
          this.ctx
            .resume()
            .then(() => {
              if (this.ctx && this.ctx.state === 'running') {
                this.buildGraph(this.ctx);
                this.emit();
                detach();
              }
            })
            .catch(() => {});
        } else {
          this.buildGraph(this.ctx);
          this.emit();
          detach();
        }
      };

      const events = ['pointerdown', 'keydown', 'touchend', 'click'] as const;
      const detach = () => {
        events.forEach((ev) => window.removeEventListener(ev, unlock, true));
      };
      events.forEach((ev) => window.addEventListener(ev, unlock, { capture: true, passive: true }));
    }
  }

  public toggleMute() {
    this.muted = !this.muted;
    if (!this.muted && this.ctx && this.ctx.state === 'suspended') {
      this.ctx
        .resume()
        .then(() => {
          if (this.ctx) this.buildGraph(this.ctx);
          this.updateGain();
          this.emit();
        })
        .catch(() => {});
      return;
    }
    this.updateGain();
    this.emit();
  }

  private updateGain() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(this.muted ? 0 : 0.085, now + 0.15);
  }

  public dispose() {
    if (this.pulseTimer !== null) {
      window.clearInterval(this.pulseTimer);
      this.pulseTimer = null;
    }
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore already stopped
      }
    });
    this.oscillators = [];
    this.started = false;
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close().catch(() => {});
    }
    this.ctx = null;
  }
}

export const ambientAudio = new AmbientSoundController();
