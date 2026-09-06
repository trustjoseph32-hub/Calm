import re

with open('src/lib/audio.ts', 'r') as f:
    content = f.read()

# I will replace the startNoise method entirely to ensure all settings are perfect.
# It starts at: private startNoise(type: 'wind' | 'rain' | 'sea') {
# It ends right before: private stopNoise() {

target_pattern = re.compile(r'  private startNoise\(type: \'wind\' \| \'rain\' \| \'sea\'\) \{.*?  private stopNoise\(\) \{', re.DOTALL)

replacement = """  private masterCompressor: DynamicsCompressorNode | null = null;

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

  private stopNoise() {"""

content = target_pattern.sub(replacement, content)

# Replace playTone connections to also use the masterCompressor if possible,
# or just drastically lower its volume and prevent clipping.
# We'll just patch the playTone routing directly:

target_tone = """    gain.connect(this.ctx.destination);"""
replacement_tone = """    if (this.masterCompressor) {
      gain.connect(this.masterCompressor);
    } else {
      gain.connect(this.ctx.destination);
    }"""
content = content.replace(target_tone, replacement_tone)

with open('src/lib/audio.ts', 'w') as f:
    f.write(content)
