import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """    const inhaleDuration = settings.syncInhaleDuration * 1000;
    const exhaleDuration = settings.syncExhaleDuration * 1000;
    const cycleDuration = inhaleDuration + exhaleDuration;
    
    // Bilateral speed (time for one full left-right sweep)
    const speedMap = { slow: 4000, medium: 2000, fast: 1000 };
    const sweepDuration = speedMap[currentSpeed];
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - roundStartTimeRef.current;
      
      // Update time left
      const remaining = Math.max(0, 20 - Math.floor(elapsed / 1000));
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        handleRoundComplete();
        return;
      }
      
      // Breathing cycle
      const cycleTime = elapsed % cycleDuration;
      const expanding = cycleTime < inhaleDuration;
      setIsExpanding(expanding);
      
      if (expanding) {
        const progress = cycleTime / inhaleDuration;
        const ease = 0.5 * (1 - Math.cos(Math.PI * progress));
        setCircleScale(1 + ease * 0.5);
      } else {
        const progress = (cycleTime - inhaleDuration) / exhaleDuration;
        const ease = 0.5 * (1 - Math.cos(Math.PI * progress));
        setCircleScale(1.5 - ease * 0.5);
      }
      
      // Bilateral Movement
      if (!reducedMotion) {
        const sweepTime = elapsed % sweepDuration;
        const progress = sweepTime / sweepDuration;
        // 0 to 1 -> -1 to 1 to -1 using sine
        const sineProgress = Math.sin(progress * Math.PI * 2);
        setXOffset(sineProgress); 
        
        // Pan ambient noise along with ball movement
        audioRef.current.setNoisePan(sineProgress);

        // Audio tone playing at extremes
        if (settings.syncBilateralAudio) {
          if (Math.abs(sineProgress) > 0.95 && now - lastAudioToneTime > sweepDuration / 2) {
            audioRef.current.playTone(sineProgress > 0 ? 'right' : 'left');
            lastAudioToneTime = now;
          }
        }
      } else {
        setXOffset(0);
        audioRef.current.setNoisePan(0);
      }"""

replacement = """    let lastFrameTime = Date.now();
    let phase = 0; // 0 to 1 for a full cycle (inhale + exhale)
    
    const animate = () => {
      const now = Date.now();
      const dt = now - lastFrameTime;
      lastFrameTime = now;
      const elapsed = now - roundStartTimeRef.current;
      
      // Update time left
      const remaining = Math.max(0, 20 - Math.floor(elapsed / 1000));
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        handleRoundComplete();
        return;
      }
      
      // Interpolate duration from 3s to 2.5s based on round progress (0 to 20 seconds)
      const roundProgress = Math.min(1, elapsed / 20000); 
      const currentHalfDuration = 3000 - (roundProgress * 500); // 3s down to 2.5s
      const currentFullDuration = currentHalfDuration * 2;
      
      // Update phase seamlessly based on delta time
      phase += dt / currentFullDuration;
      if (phase >= 1) phase -= 1;
      
      const expanding = phase < 0.5;
      setIsExpanding(expanding);
      
      // Breathing cycle animation
      if (expanding) {
        const progress = phase * 2; // 0 to 1
        const ease = 0.5 * (1 - Math.cos(Math.PI * progress));
        setCircleScale(1 + ease * 0.5);
      } else {
        const progress = (phase - 0.5) * 2; // 0 to 1
        const ease = 0.5 * (1 - Math.cos(Math.PI * progress));
        setCircleScale(1.5 - ease * 0.5);
      }
      
      // Bilateral Movement
      if (!reducedMotion) {
        // -cos(phase * 2PI) maps:
        // phase 0 (start inhale) -> -1 (left)
        // phase 0.5 (end inhale / start exhale) -> 1 (right)
        // phase 1.0 (end exhale) -> -1 (left)
        const sineProgress = -Math.cos(phase * Math.PI * 2);
        setXOffset(sineProgress); 
        
        // Pan ambient noise along with ball movement
        audioRef.current.setNoisePan(sineProgress);

        // Audio tone playing at extremes
        if (settings.syncBilateralAudio) {
          if (Math.abs(sineProgress) > 0.95 && now - lastAudioToneTime > currentHalfDuration * 0.8) {
            audioRef.current.playTone(sineProgress > 0 ? 'right' : 'left');
            lastAudioToneTime = now;
          }
        }
      } else {
        setXOffset(0);
        audioRef.current.setNoisePan(0);
      }"""

content = content.replace(target, replacement)
with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
