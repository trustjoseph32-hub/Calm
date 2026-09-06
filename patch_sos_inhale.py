import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """        if (isSOS) {
          // 35% time for first inhale, 10% recoil, 55% time for second inhale
          if (progress < 0.35) {
            // First inhale (0 to 35% of time, grows exactly to 35% of max expansion to match timing)
            const localProgress = progress / 0.35;
            circleMappedProgress = 0.35 * Math.sin(localProgress * (Math.PI / 2));
            setIsSecondInhale(false);
          } else if (progress < 0.45) {
            // Recoil (35% to 45% of time) - shrinks slightly from 35% down to 25%
            const localProgress = (progress - 0.35) / 0.10;
            circleMappedProgress = 0.35 - 0.10 * (0.5 * (1 - Math.cos(Math.PI * localProgress)));
            setIsSecondInhale(false);
          } else {
            // Second inhale (45% to 100% of time). Grows sharply from 25% all the way to 100% max expansion!
            const localProgress = (progress - 0.45) / 0.55;
            const sharpEaseOut = 1 - Math.pow(1 - localProgress, 6);
            circleMappedProgress = 0.25 + 0.75 * sharpEaseOut;
            setIsSecondInhale(true);
          }
        } else {"""

replacement = """        if (isSOS) {
          // 30% time for first inhale, 70% time for second inhale (довдох)
          if (progress < 0.30) {
            // First inhale (0 to 30% of time, grows to ~40% of max expansion)
            const localProgress = progress / 0.30;
            circleMappedProgress = 0.40 * Math.sin(localProgress * (Math.PI / 2));
            setIsSecondInhale(false);
          } else {
            // Second inhale (30% to 100% of time). Grows sharply from 40% to 100%
            const localProgress = (progress - 0.30) / 0.70;
            const sharpEaseOut = 1 - Math.pow(1 - localProgress, 4);
            circleMappedProgress = 0.40 + 0.60 * sharpEaseOut;
            setIsSecondInhale(true);
          }
        } else {"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Failed to match target text")
