import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """    const animate = () => {
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
      const roundProgress = Math.min(1, elapsed / 20000); """

replacement = """    const ROUND_DURATION = isSOS ? 60 : 20;
    const ROUND_DURATION_MS = ROUND_DURATION * 1000;
    
    const animate = () => {
      const now = Date.now();
      const dt = now - lastFrameTime;
      lastFrameTime = now;
      const elapsed = now - roundStartTimeRef.current;
      
      // Update time left
      const remaining = Math.max(0, ROUND_DURATION - Math.floor(elapsed / 1000));
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        handleRoundComplete();
        return;
      }
      
      // Interpolate duration from 3s to 2.5s based on round progress
      const roundProgress = Math.min(1, elapsed / ROUND_DURATION_MS); """

content = content.replace(target, replacement)

target2 = """      // Bilateral Movement
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

replacement2 = """      // Bilateral Movement
      if (!reducedMotion) {
        const sineProgress = -Math.cos(phase * Math.PI * 2);
        
        let newX = 0;
        let newY = 0;
        
        if (isSOS) {
          const config = sosConfig[roundIndex] || sosConfig[0];
          if (config.axis === 'horizontal') {
            newX = sineProgress * config.dirX;
          } else if (config.axis === 'vertical') {
            newY = sineProgress * config.dirY;
          } else if (config.axis === 'diagonal') {
            newX = sineProgress * config.dirX;
            newY = sineProgress * config.dirY;
          }
        } else {
          newX = sineProgress;
        }

        setXOffset(newX);
        setYOffset(newY);
        
        // Pan ambient noise along with horizontal ball movement
        audioRef.current.setNoisePan(newX);

        // Audio tone playing at extremes (use raw sineProgress since EMDR relies on left/right oscillation)
        if (settings.syncBilateralAudio) {
          if (Math.abs(sineProgress) > 0.95 && now - lastAudioToneTime > currentHalfDuration * 0.8) {
            audioRef.current.playTone(sineProgress > 0 ? 'right' : 'left');
            lastAudioToneTime = now;
          }
        }
      } else {
        setXOffset(0);
        setYOffset(0);
        audioRef.current.setNoisePan(0);
      }"""

content = content.replace(target2, replacement2)

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
