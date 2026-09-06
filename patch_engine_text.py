import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

# First we need to add state for the text
state_target = """  const [isExpanding, setIsExpanding] = useState(true);
  const [yOffset, setYOffset] = useState(0);"""

state_replacement = """  const [isExpanding, setIsExpanding] = useState(true);
  const [isSecondInhale, setIsSecondInhale] = useState(false);
  const [yOffset, setYOffset] = useState(0);"""

content = content.replace(state_target, state_replacement)

# Then we update the animation loop to set the text state
anim_target = """      if (expanding) {
        const progress = phase * 2; // 0 to 1
        // Ball movement mappedProgress (Smooth for ball in both cases)
        mappedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
        
        if (isSOS) {
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
        } else {
          // Standard smooth breathing
          circleMappedProgress = mappedProgress;
        }"""

anim_target_fallback = """      if (expanding) {
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
        }"""

if anim_target_fallback in content:
    content = content.replace(anim_target_fallback, anim_target)
    print("Replaced anim logic")
else:
    print("Failed to find anim logic")
    
# Finally we update the JSX to show the correct text
jsx_target = """              <span className="text-xl sm:text-3xl font-medium tracking-widest text-neutral-800 drop-shadow-sm select-none">
                {isExpanding ? 'ВДОХ' : 'ВЫДОХ'}
              </span>"""

jsx_replacement = """              <span className="text-xl sm:text-3xl font-medium tracking-widest text-neutral-800 drop-shadow-sm select-none transition-all duration-200">
                {isExpanding ? (isSOS && isSecondInhale ? 'ДО-ВДОХ' : 'ВДОХ') : 'ВЫДОХ'}
              </span>"""

if jsx_target in content:
    content = content.replace(jsx_target, jsx_replacement)
    print("Replaced JSX")
else:
    print("Failed to find JSX")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
