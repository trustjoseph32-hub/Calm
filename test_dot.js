import fs from 'node:fs';

let content = fs.readFileSync('src/screens/Day1Engine.tsx', 'utf-8');

const oldDotVariants = `  const dotVariants = {
    inhale: { x: '46vw', opacity: 1, transition: { duration: 4.5, ease: 'easeOut' } },
    exhale: { x: '-46vw', opacity: 1, transition: { duration: 5.5, ease: 'easeInOut' } },
  };`;

const newDotVariants = `  const dotVariants = {
    initial: { x: '-46vw', opacity: 0 },
    inhale1: { x: '20vw', opacity: 1, transition: { duration: 2.5, ease: 'linear' } },
    inhale2: { x: '46vw', opacity: 1, transition: { duration: 1.0, ease: 'easeOut' } },
    hold: { x: '46vw', opacity: 1, transition: { duration: 1.0, ease: 'linear' } },
    exhale: { x: '-46vw', opacity: 1, transition: { duration: 5.5, ease: 'easeInOut' } },
  };`;

content = content.replace(oldDotVariants, newDotVariants);

const oldDotJSX = `                {/* Moving Target Dot */}
                {practiceStage >= 2 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-10 pointer-events-none"
                    variants={dotVariants}
                    animate={isActive ? (phase === 'exhale' ? 'exhale' : 'inhale') : 'exhale'}
                  />
                )}`;

const newDotJSX = `                {/* Moving Target Dot */}
                {practiceStage >= 2 && (
                  <motion.div 
                    initial="initial"
                    className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-10 pointer-events-none"
                    variants={dotVariants}
                    animate={isActive ? phase : 'initial'}
                  />
                )}`;

content = content.replace(oldDotJSX, newDotJSX);
fs.writeFileSync('src/screens/Day1Engine.tsx', content);
