import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """      // Breathing cycle animation
      let mappedProgress = 0;
      if (expanding) {
        const progress = phase * 2; // 0 to 1
        if (isSOS) {
          if (progress < 0.65) {
            // First deep inhale (takes 65% of the inhale time, goes to 85% of volume)
            const localProgress = progress / 0.65;
            // Using ease-out for a deep start
            mappedProgress = 0.85 * Math.sin(localProgress * (Math.PI / 2));
          } else if (progress < 0.8) {
            // Plateau / Pause (takes 15% of the inhale time)
            mappedProgress = 0.85;
          } else {
            // Second sharp inhale "sigh" (takes final 20% of the inhale time)
            const localProgress = (progress - 0.8) / 0.2;
            // Using ease-out for the final snap
            mappedProgress = 0.85 + 0.15 * Math.sin(localProgress * (Math.PI / 2));
          }
        } else {
          // Standard smooth breathing
          mappedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
        }
        setCircleScale(1 + mappedProgress * 0.5);
      } else {
        // Exhale
        const progress = (phase - 0.5) * 2; // 0 to 1
        // Smooth ease in/out for exhale
        mappedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
        // Reverse for exhale
        setCircleScale(1.5 - mappedProgress * 0.5);
      }
      
      // Bilateral Movement
      if (!reducedMotion) {
        let sineProgress = 0;
        if (expanding) {
          sineProgress = -1 + mappedProgress * 2;
        } else {
          sineProgress = 1 - mappedProgress * 2;
        }"""

replacement = """      // Breathing cycle animation
      let mappedProgress = 0;
      let circleMappedProgress = 0;
      
      if (expanding) {
        const progress = phase * 2; // 0 to 1
        // Ball movement mappedProgress (Smooth for ball in both cases)
        mappedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
        
        if (isSOS) {
          // 50% time for first inhale, 50% time for second inhale (with small plateau in between for visual separation)
          if (progress < 0.45) {
            // First inhale (0 to 45% of time, grows to 70% of scale)
            const localProgress = progress / 0.45;
            circleMappedProgress = 0.7 * Math.sin(localProgress * (Math.PI / 2));
          } else if (progress < 0.55) {
            // Plateau / Pause (45% to 55% of time)
            circleMappedProgress = 0.7;
          } else {
            // Second inhale (55% to 100% of time, grows from 70% to 100% of scale)
            const localProgress = (progress - 0.55) / 0.45;
            circleMappedProgress = 0.7 + 0.3 * Math.sin(localProgress * (Math.PI / 2));
          }
        } else {
          // Standard smooth breathing
          circleMappedProgress = mappedProgress;
        }
        setCircleScale(1 + circleMappedProgress * 0.5);
      } else {
        // Exhale
        const progress = (phase - 0.5) * 2; // 0 to 1
        // Smooth ease in/out for exhale
        mappedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
        circleMappedProgress = mappedProgress;
        
        // Reverse for exhale
        setCircleScale(1.5 - circleMappedProgress * 0.5);
      }
      
      // Bilateral Movement
      if (!reducedMotion) {
        let sineProgress = 0;
        if (expanding) {
          // The ball ALWAYS uses the smooth mappedProgress, never the jerky circle one
          sineProgress = -1 + mappedProgress * 2;
        } else {
          sineProgress = 1 - mappedProgress * 2;
        }"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Failed to match target")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
