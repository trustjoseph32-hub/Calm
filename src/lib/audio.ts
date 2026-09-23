export class BilateralAudioEngine {
  private ctx: AudioContext | null = null;
  private volume: number = 0.25;
  private bilateralVolume: number = 0.25;

  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseModGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseFilter2: BiquadFilterNode | null = null;
  private noisePanner: StereoPannerNode | null = null;
  private noiseLFO: OscillatorNode | null = null;
  private ampLFO: OscillatorNode | null = null;

  constructor() {}

  init(volumePercentage: number, noiseType?: 'none' | 'wind' | 'rain' | 'sea', bilateralVolumePercentage?: number) {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.volume = volumePercentage * 0.2125; // Lowered volume by an additional 15% // Lowered volume from 0.5 to 0.25 for softer sound
    this.bilateralVolume = (bilateralVolumePercentage !== undefined ? bilateralVolumePercentage : volumePercentage) * 0.5;
    
    if (noiseType && noiseType !== 'none') {
      this.startNoise(noiseType);
    }
  }

  private masterCompressor: DynamicsCompressorNode | null = null;

  private startNoise(type: 'wind' | 'rain' | 'sea') {
    if (!this.ctx) return;
    this.stopNoise(); // Clear existing
    
    // Create master compressor to prevent clipping
    if (!this.masterCompressor) {
      this.masterCompressor = this.ctx.createDynamicsCompressor();
      this.masterCompressor.threshold.value = -24;
      this.masterCompressor.knee.value = 30;
      this.masterCompressor.ratio.value = 12;
      this.masterCompressor.attack.value = 0.003;
      this.masterCompressor.release.value = 0.25;
      this.masterCompressor.connect(this.ctx.destination);
    }

    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Very gentle Brown noise generation
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        // Scale to a safe range well within [-1, 1], removing the * 3.5 multiplier
        data[i] = lastOut * 1.5; 
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = buffer;
    this.noiseSource.loop = true;

    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter2 = this.ctx.createBiquadFilter();
    this.noiseGain = this.ctx.createGain();
    this.noiseModGain = this.ctx.createGain();
    this.noisePanner = this.ctx.createStereoPanner();

    this.noiseSource.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseFilter2);
    this.noiseFilter2.connect(this.noiseGain);
    this.noiseGain.connect(this.noiseModGain);
    this.noiseModGain.connect(this.noisePanner);
    this.noisePanner.connect(this.masterCompressor);

    const now = this.ctx.currentTime;
    
    if (type === 'wind') {
      // Wind: lowpass with modulating frequency
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.Q.value = 0.5; // Low Q, no harsh resonance
      this.noiseFilter.frequency.value = 250;
      
      this.noiseFilter2.type = 'highpass';
      this.noiseFilter2.frequency.value = 50;
      
      this.noiseLFO = this.ctx.createOscillator();
      this.noiseLFO.type = 'sine';
      this.noiseLFO.frequency.value = 0.15; // slow gust
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 100; // soft frequency swing
      this.noiseLFO.connect(lfoGain);
      lfoGain.connect(this.noiseFilter.frequency);
      this.noiseLFO.start(now);
      
      this.noiseGain.gain.value = this.volume * 0.5;
      
    } else if (type === 'rain') {
      // Rain: bandpass to sound like rain
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.Q.value = 0.1;
      this.noiseFilter.frequency.value = 1500;
      
      this.noiseFilter2.type = 'highpass';
      this.noiseFilter2.frequency.value = 200;
      
      this.noiseGain.gain.value = this.volume * 0.25;
      
    } else if (type === 'sea') {
      // Sea: lowpass with very slow modulation of both cutoff and volume
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.Q.value = 0.1;
      this.noiseFilter.frequency.value = 350;
      
      this.noiseFilter2.type = 'highpass';
      this.noiseFilter2.frequency.value = 80;
      
      this.noiseLFO = this.ctx.createOscillator();
      this.noiseLFO.type = 'sine';
      this.noiseLFO.frequency.value = 0.08; // 12.5 seconds per wave
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 200; 
      this.noiseLFO.connect(lfoGain);
      lfoGain.connect(this.noiseFilter.frequency);
      this.noiseLFO.start(now);
      
      this.ampLFO = this.ctx.createOscillator();
      this.ampLFO.type = 'sine';
      this.ampLFO.frequency.value = 0.08;
      const ampGain = this.ctx.createGain();
      ampGain.gain.value = this.volume * 0.2;
      this.ampLFO.connect(ampGain);
      ampGain.connect(this.noiseGain.gain);
      this.ampLFO.start(now);
      
      this.noiseGain.gain.value = this.volume * 0.15;
    }
    
    this.noiseSource.start(now);
  }

  private stopNoise() {
    if (this.noiseSource) {
      try { this.noiseSource.stop(); } catch(e) {}
      this.noiseSource.disconnect();
      this.noiseSource = null;
    }
    if (this.noiseLFO) {
      try { this.noiseLFO.stop(); } catch(e) {}
      this.noiseLFO.disconnect();
      this.noiseLFO = null;
    }
    if (this.ampLFO) {
      try { this.ampLFO.stop(); } catch(e) {}
      this.ampLFO.disconnect();
      this.ampLFO = null;
    }
    if (this.noisePanner) {
      this.noisePanner.disconnect();
      this.noisePanner = null;
    }
    if (this.noiseModGain) {
      this.noiseModGain.disconnect();
      this.noiseModGain = null;
    }
  }

  setNoisePan(panValue: number) {
    if (this.noisePanner && this.ctx) {
      const now = this.ctx.currentTime;
      // Small ramp time to prevent clicking, but fast enough to track movement smoothly
      this.noisePanner.pan.setTargetAtTime(panValue, now, 0.05);
    }
  }

  setNoiseVolumeMod(verticalRatio: number) {
    if (this.noiseModGain && this.ctx) {
      const now = this.ctx.currentTime;
      // verticalRatio goes from -1 (top, loudest) to 1 (bottom, quietest)
      // Base volume is 1. We modulate between 0.8 (bottom) and 1.2 (top)
      const targetGain = 1.0 - (verticalRatio * 0.2);
      this.noiseModGain.gain.setTargetAtTime(targetGain, now, 0.05);
    }
  }

  playTone(side: 'left' | 'right' | 'center' | number) {

    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner();

    osc.type = 'sine';
    osc.frequency.value = 250; // Calming low frequency (250Hz)

    let panValue = 0;
    if (typeof side === 'number') {
      panValue = side;
    } else {
      panValue = side === 'left' ? -1 : side === 'right' ? 1 : 0;
    }
    panner.pan.value = panValue;

    // Envelope
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.bilateralVolume, now + 0.05); // Attack
    gain.gain.setValueAtTime(this.bilateralVolume, now + 0.15); // Sustain
    gain.gain.linearRampToValueAtTime(0, now + 0.4); // Release

    osc.connect(panner);
    panner.connect(gain);
    if (this.masterCompressor) {
      gain.connect(this.masterCompressor);
    } else {
      gain.connect(this.ctx.destination);
    }

    osc.start(now);
    osc.stop(now + 0.5);
  }

  stopAll() {
    this.stopNoise();
    if (this.ctx) {
      this.ctx.suspend();
    }
  }
  
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  destroy() {
    this.stopNoise();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

// Global shared helper for soft, calming bilateral / extreme-point beep
let globalAudioCtx: AudioContext | null = null;

export function playSoftBeep(side?: 'left' | 'right' | number, volume: number = 0.16) {
  try {
    if (!globalAudioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      globalAudioCtx = new AudioCtx();
    }
    if (globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume();
    }

    const ctx = globalAudioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    
    // Lowpass biquad filter for warm, rounded cutoff without harsh high frequencies
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(450, now);
    lowpass.frequency.exponentialRampToValueAtTime(220, now + 0.28);
    lowpass.Q.value = 1.0;

    osc.type = 'sine';
    // Warm, deep, non-piercing baseline tone (210Hz gliding smoothly to 175Hz - calming deep chime)
    osc.frequency.setValueAtTime(210, now);
    osc.frequency.exponentialRampToValueAtTime(175, now + 0.24);

    let panVal = 0;
    if (typeof side === 'number') {
      panVal = Math.max(-1, Math.min(1, side));
    } else if (side === 'left') {
      panVal = -0.7;
    } else if (side === 'right') {
      panVal = 0.7;
    }
    panner.pan.value = panVal;

    // Very soft and gentle bell-like cushion envelope (soft 35ms attack, gradual smooth decay)
    const targetGain = Math.min(0.12, volume);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(targetGain, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    // Audio graph: osc -> lowpass cutoff -> panner -> gain -> destination
    osc.connect(lowpass);
    lowpass.connect(panner);
    panner.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    // AudioContext might be blocked until user interaction
  }
}

// Soft muted tap click/knock with lowpass filter for gentle tactile tapping rhythm
export function playSoftTap(side?: 'left' | 'right' | 'center', volume: number = 0.12) {
  try {
    if (!globalAudioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      globalAudioCtx = new AudioCtx();
    }
    if (globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume();
    }

    const ctx = globalAudioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    const lowpass = ctx.createBiquadFilter();

    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(300, now);
    lowpass.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    osc.type = 'sine';
    // Very low warm woody thud (140Hz down to 80Hz)
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.07);

    let panVal = 0;
    if (side === 'left') panVal = -0.65;
    else if (side === 'right') panVal = 0.65;
    panner.pan.value = panVal;

    const targetGain = Math.min(0.14, volume);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(targetGain, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(lowpass);
    lowpass.connect(panner);
    panner.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {
    // audio context blocked
  }
}
