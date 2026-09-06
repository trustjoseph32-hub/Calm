const fs = require('fs');
let code = fs.readFileSync('src/lib/audio.ts', 'utf8');

const oldVars = `  private ctx: AudioContext | null = null;
  private volume: number = 0.25;`;

const newVars = `  private ctx: AudioContext | null = null;
  private volume: number = 0.25;
  private bilateralVolume: number = 0.25;`;

code = code.replace(oldVars, newVars);

const oldInit = `  init(volumePercentage: number, noiseType?: 'none' | 'wind' | 'rain' | 'sea') {
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
  }`;

const newInit = `  init(volumePercentage: number, noiseType?: 'none' | 'wind' | 'rain' | 'sea', bilateralVolumePercentage?: number) {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.volume = volumePercentage * 0.5; // Changed from percentage to 0-1 scale internally based on how it's passed. Wait, I changed the sliders to 0-1 range for settings.syncVolume in SynchronizedSetup? No, the slider was "Math.round(settings.syncVolume * 100)" and value was "Number / 100". So settings.syncVolume is 0-1.
    this.bilateralVolume = (bilateralVolumePercentage !== undefined ? bilateralVolumePercentage : volumePercentage) * 0.5;
    
    if (noiseType && noiseType !== 'none') {
      this.startNoise(noiseType);
    }
  }`;

code = code.replace(oldInit, newInit);

const oldPlayTone = `    // Envelope
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.volume, now + 0.05); // Attack
    gain.gain.setValueAtTime(this.volume, now + 0.15); // Sustain
    gain.gain.linearRampToValueAtTime(0, now + 0.4); // Release`;

const newPlayTone = `    // Envelope
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.bilateralVolume, now + 0.05); // Attack
    gain.gain.setValueAtTime(this.bilateralVolume, now + 0.15); // Sustain
    gain.gain.linearRampToValueAtTime(0, now + 0.4); // Release`;

code = code.replace(oldPlayTone, newPlayTone);

fs.writeFileSync('src/lib/audio.ts', code);
console.log("Patched audio.ts");
