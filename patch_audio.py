import re

with open('src/lib/audio.ts', 'r') as f:
    content = f.read()

target = """    // Pink noise generation (Paul Kellet's approximation) for softer sound
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] = pink * 0.11; // Normalize
        b6 = white * 0.115926;
    }"""

replacement = """    // Brown noise generation for a much softer, warmer, non-harsh sound
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = lastOut * 3.5; // Scale to approximately [-1, 1] without clipping
    }"""
content = content.replace(target, replacement)

target2 = """    if (type === 'wind') {
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
      this.noiseFilter2.frequency.value = 100;"""

replacement2 = """    if (type === 'wind') {
      // Wind: lowpass with modulating frequency
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.Q.value = 0.5; // Reduced Q to avoid resonance clipping
      this.noiseFilter.frequency.value = 250;
      this.noiseFilter2.type = 'highpass';
      this.noiseFilter2.frequency.value = 50;
      this.noiseLFO = this.ctx.createOscillator();
      this.noiseLFO.type = 'sine';
      this.noiseLFO.frequency.value = 0.15; // slow gust
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 100; // Reduced frequency swing
      this.noiseLFO.connect(lfoGain);
      lfoGain.connect(this.noiseFilter.frequency);
      this.noiseLFO.start(now);
      this.noiseGain.gain.value = this.volume * 0.6; // Reduced volume
    } else if (type === 'rain') {
      // Rain: bandpass to sound like rain
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.Q.value = 0.1; // Reduced Q
      this.noiseFilter.frequency.value = 1500;
      this.noiseFilter2.type = 'highpass';
      this.noiseFilter2.frequency.value = 200;
      this.noiseGain.gain.value = this.volume * 0.3; // Reduced volume
    } else if (type === 'sea') {
      // Sea: lowpass with very slow modulation of both cutoff and volume
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.Q.value = 0.1; // Reduced Q
      this.noiseFilter.frequency.value = 350;
      this.noiseFilter2.type = 'highpass';
      this.noiseFilter2.frequency.value = 80;"""
content = content.replace(target2, replacement2)

target3 = """    osc.type = 'sine';
    osc.frequency.value = 250; // Calming low frequency (250Hz)
    let panValue = 0;"""

replacement3 = """    osc.type = 'sine';
    osc.frequency.value = 200; // Lower, softer tone (200Hz)
    let panValue = 0;"""
content = content.replace(target3, replacement3)

with open('src/lib/audio.ts', 'w') as f:
    f.write(content)
