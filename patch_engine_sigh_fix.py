import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """      // Breathing cycle animation
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
      }"""

# In the previous code, mappedProgress inside the else block of the double inhale
# started exactly at 0.8. However, because we want a distinct STOP/PAUSE effect 
# before the second inhale, we need to explicitly flatten the curve.
# We will create a clear plateau between 0.65 and 0.8 progress (the pause), 
# then a sharp second inhale from 0.8 to 1.0.

replacement = """      // Breathing cycle animation
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
      }"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Failed to match target")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
