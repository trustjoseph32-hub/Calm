import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """        if (isSOS) {
          // 50% time for first inhale, 50% time for second inhale (with small plateau in between for visual separation)
          if (progress < 0.45) {
            // First inhale (0 to 45% of time, grows to 70% of scale)
            const localProgress = progress / 0.45;
            circleMappedProgress = 0.7 * Math.sin(localProgress * (Math.PI / 2));
            setIsSecondInhale(false);
          } else if (progress < 0.55) {
            // Plateau / Pause (45% to 55% of time)
            circleMappedProgress = 0.7;
            setIsSecondInhale(false);
          } else {
            // Second inhale (55% to 100% of time, grows from 70% to 100% of scale)
            const localProgress = (progress - 0.55) / 0.45;
            circleMappedProgress = 0.7 + 0.3 * Math.sin(localProgress * (Math.PI / 2));
            setIsSecondInhale(true);
          }
        }"""

replacement = """        if (isSOS) {
          // 50% time for first inhale, 50% time for second inhale (with recoil in between for visual separation)
          if (progress < 0.45) {
            // First inhale (0 to 45% of time, grows to 75% of max expansion)
            const localProgress = progress / 0.45;
            circleMappedProgress = 0.75 * Math.sin(localProgress * (Math.PI / 2));
            setIsSecondInhale(false);
          } else if (progress < 0.55) {
            // Recoil (45% to 55% of time) - shrinks down by 15% (from 75% to 60%)
            const localProgress = (progress - 0.45) / 0.10;
            circleMappedProgress = 0.75 - 0.15 * (0.5 * (1 - Math.cos(Math.PI * localProgress)));
            setIsSecondInhale(false);
          } else {
            // Second inhale (55% to 100% of time, grows from 60% to 100% of max expansion)
            const localProgress = (progress - 0.55) / 0.45;
            circleMappedProgress = 0.60 + 0.40 * Math.sin(localProgress * (Math.PI / 2));
            setIsSecondInhale(true);
          }
        }"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Failed to match target")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
