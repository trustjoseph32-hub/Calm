import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """          // 30% time for first inhale, 70% time for second inhale (довдох)
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
          }"""

replacement = """          // 30% time for first inhale, 70% time for second inhale (довдох)
          if (progress < 0.30) {
            // First inhale (0 to 30% of time, grows to ~40% of max expansion)
            const localProgress = progress / 0.30;
            circleMappedProgress = 0.40 * Math.sin(localProgress * (Math.PI / 2));
            setIsSecondInhale(false);
          } else {
            // Second inhale (30% to 100% of time). Grows from 40% to 100%
            const localProgress = (progress - 0.30) / 0.70;
            // Smooth ease-in-out ensures the circle accelerates from the pause and decelerates perfectly in sync with the ball at the end
            const easeInOut = 0.5 * (1 - Math.cos(Math.PI * localProgress));
            circleMappedProgress = 0.40 + 0.60 * easeInOut;
            setIsSecondInhale(true);
          }"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Failed to match")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
