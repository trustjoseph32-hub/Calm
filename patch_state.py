import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

content = content.replace("  | 'ACTIVE_ROUND'", "  | 'ACTIVE_ROUND'\n  | 'SOS_PAUSE'")

state_insert = """  const [yOffset, setYOffset] = useState(0);

  // SOS state
  const [roundIndex, setRoundIndex] = useState(0);
  const [pauseTimeLeft, setPauseTimeLeft] = useState(10);
  const [sosConfig] = useState(() => [
    { axis: 'horizontal', dirX: Math.random() > 0.5 ? 1 : -1, dirY: 1 },
    { axis: 'vertical', dirX: 1, dirY: Math.random() > 0.5 ? 1 : -1 },
    { axis: 'diagonal', dirX: Math.random() > 0.5 ? 1 : -1, dirY: Math.random() > 0.5 ? 1 : -1 }
  ]);"""

content = content.replace("  const [isExpanding, setIsExpanding] = useState(true);", "  const [isExpanding, setIsExpanding] = useState(true);\n" + state_insert)

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
