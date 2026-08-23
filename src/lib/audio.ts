export class BilateralAudioEngine {
  private ctx: AudioContext | null = null;
  private volume: number = 0.25;

  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseModGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseFilter2: BiquadFilterNode | null = null;
  private noisePanner: StereoPannerNode | null = null;
  private noiseLFO: OscillatorNode | null = null;
  private ampLFO: OscillatorNode | null = null;

  constructor() {}

  init(volumePercentage: number, noiseType?: 'none' | 'wind' | 'rain' | 'sea') {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.volume = (volumePercentage / 100) * 0.5; // Scale to safe max 0.5
    
    if (noiseType && noiseType !== 'none') {
      this.startNoise(noiseType);
    }
  }

  private startNoise(type: 'wind' | 'rain' | 'sea') {
    if (!this.ctx) return;
    this.stopNoise(); // Clear existing

    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // White noise
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
    this.noisePanner.connect(this.ctx.destination);

    const now = this.ctx.currentTime;

    if (type === 'wind') {
      // Wind: lowpass with modulating frequency
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.Q.value = 2;
      this.noiseFilter.frequency.value = 250;

      this.noiseFilter2.type = 'highpass';
      this.noiseFilter2.frequency.value = 50;

      this.noiseLFO = this.ctx.createOscillator();
      this.noiseLFO.type = 'sine';
      this.noiseLFO.frequency.value = 0.15; // slow gust

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 200; // frequency swing

      this.noiseLFO.connect(lfoGain);
      lfoGain.connect(this.noiseFilter.frequency);
      this.noiseLFO.start(now);

      this.noiseGain.gain.value = this.volume * 0.8;
    } else if (type === 'rain') {
      // Rain: bandpass to sound like rain
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.Q.value = 0.5;
      this.noiseFilter.frequency.value = 2000;

      this.noiseFilter2.type = 'highpass';
      this.noiseFilter2.frequency.value = 400;

      this.noiseGain.gain.value = this.volume * 0.4;
    } else if (type === 'sea') {
      // Sea: lowpass with very slow modulation of both cutoff and volume
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.Q.value = 0.5;
      this.noiseFilter.frequency.value = 400;

      this.noiseFilter2.type = 'highpass';
      this.noiseFilter2.frequency.value = 100;

      this.noiseLFO = this.ctx.createOscillator();
      this.noiseLFO.type = 'sine';
      this.noiseLFO.frequency.value = 0.08; // 12.5 seconds per wave

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 300; 

      this.noiseLFO.connect(lfoGain);
      lfoGain.connect(this.noiseFilter.frequency);
      this.noiseLFO.start(now);

      this.ampLFO = this.ctx.createOscillator();
      this.ampLFO.type = 'sine';
      this.ampLFO.frequency.value = 0.08;

      const ampGain = this.ctx.createGain();
      ampGain.gain.value = this.volume * 0.3;

      this.ampLFO.connect(ampGain);
      ampGain.connect(this.noiseGain.gain);
      this.ampLFO.start(now);

      this.noiseGain.gain.value = this.volume * 0.2;
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
    gain.gain.linearRampToValueAtTime(this.volume, now + 0.05); // Attack
    gain.gain.setValueAtTime(this.volume, now + 0.15); // Sustain
    gain.gain.linearRampToValueAtTime(0, now + 0.4); // Release

    osc.connect(panner);
    panner.connect(gain);
    gain.connect(this.ctx.destination);

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