import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """  const [sosConfig] = useState(() => [
    { axis: 'horizontal', dirX: Math.random() > 0.5 ? 1 : -1, dirY: 1 },
    { axis: 'vertical', dirX: 1, dirY: Math.random() > 0.5 ? 1 : -1 },
    { axis: 'diagonal', dirX: Math.random() > 0.5 ? 1 : -1, dirY: Math.random() > 0.5 ? 1 : -1 }
  ]);"""

replacement = """  const [sosConfig] = useState(() => [
    { axis: 'horizontal', dirX: Math.random() > 0.5 ? 1 : -1, dirY: 1 },
    { axis: 'vertical', dirX: 1, dirY: -1 }, // Always -1 so inhale (sineProgress -1 to 1) translates to bottom(1) to top(-1)
    { axis: 'diagonal', dirX: Math.random() > 0.5 ? 1 : -1, dirY: -1 } // Always -1 for vertical component to match bottom-to-top inhale
  ]);"""

content = content.replace(target, replacement)

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
