import fs from 'node:fs';

let content = fs.readFileSync('src/screens/Day1Engine.tsx', 'utf-8');

const oldDotVariants = `  const dotVariants = {
    initial: { x: '-46vw', opacity: 0 },
    inhale1: { x: '20vw', opacity: 1, transition: { duration: 2.5, ease: 'linear' } },
    inhale2: { x: '46vw', opacity: 1, transition: { duration: 1.0, ease: 'easeOut' } },
    hold: { x: '46vw', opacity: 1, transition: { duration: 1.0, ease: 'linear' } },
    exhale: { x: '-46vw', opacity: 1, transition: { duration: 5.5, ease: 'easeInOut' } },
  };`;

const newDotVariants = `  const dotVariants = {
    initial: { x: '-46vw', opacity: 0 },
    inhale1: { x: '46vw', opacity: 1, transition: { duration: 3.5, ease: 'easeInOut' } }, // Total inhale time (2.5 + 1.0)
    inhale2: { x: '46vw', opacity: 1, transition: { duration: 0, ease: 'linear' } }, // No movement during inhale2 trigger
    hold: { x: '46vw', opacity: 1, transition: { duration: 1.0, ease: 'linear' } }, // Stay at edge during hold
    exhale: { x: '-46vw', opacity: 1, transition: { duration: 5.5, ease: 'easeInOut' } },
  };`;

content = content.replace(oldDotVariants, newDotVariants);
fs.writeFileSync('src/screens/Day1Engine.tsx', content);
