import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """      // Breathing cycle animation
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
        const sineProgress = -Math.cos(phase * Math.PI * 2);"""

replacement = """      // Breathing cycle animation
      let mappedProgress = 0;
      if (expanding) {
        const progress = phase * 2; // 0 to 1
        if (isSOS) {
          if (progress < 0.75) {
            const localProgress = progress / 0.75;
            mappedProgress = 0.8 * (0.5 * (1 - Math.cos(Math.PI * localProgress)));
          } else {
            const localProgress = (progress - 0.75) / 0.25;
            mappedProgress = 0.8 + 0.2 * (0.5 * (1 - Math.cos(Math.PI * localProgress)));
          }
        } else {
          mappedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
        }
        setCircleScale(1 + mappedProgress * 0.5);
      } else {
        const progress = (phase - 0.5) * 2; // 0 to 1
        mappedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
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

if target in content:
    content = content.replace(target, replacement)
else:
    print("Failed to match target")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
