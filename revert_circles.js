import fs from 'node:fs';

// 1. Day1Engine.tsx
let day1 = fs.readFileSync('src/screens/Day1Engine.tsx', 'utf-8');
const day1Old = `<motion.div
                  initial="exhale"
                  variants={circleVariants}
                  animate={isActive ? phase : 'exhale'}
                  className="absolute w-[80vw] h-[80vw] max-w-[350px] max-h-[350px] sm:max-w-[450px] sm:max-h-[450px] rounded-full flex items-center justify-center pointer-events-none"
                >
                  <div className="absolute inset-0 rounded-full bg-[#38bdf8]/20 blur-[50px] sm:blur-[80px]" />
                  <div className="absolute inset-0 rounded-full border-[3px] border-[#38bdf8]/90 shadow-[0_0_30px_rgba(56,189,248,0.8),inset_0_0_30px_rgba(56,189,248,0.5)] bg-gradient-to-b from-[#38bdf8]/20 to-transparent backdrop-blur-sm" />
                  <div className="absolute inset-8 rounded-full bg-[#1e40af]/30 blur-[20px]" />
                </motion.div>`;
const day1New = `<motion.div
                  initial="exhale"
                  variants={circleVariants}
                  animate={isActive ? phase : 'exhale'}
                  className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-[#38bdf8]/40 blur-[60px] sm:blur-[100px] mix-blend-screen pointer-events-none"
                />`;
day1 = day1.replace(day1Old, day1New);
fs.writeFileSync('src/screens/Day1Engine.tsx', day1);

// 2. PracticeEngine.tsx
let practice = fs.readFileSync('src/screens/PracticeEngine.tsx', 'utf-8');
const practiceOld = `<motion.div
          initial={{ scale: 0.5, opacity: 0.1 }}
          animate={{
            scale: phase === 'in' ? 1.0 : 0.6,
            opacity: phase === 'in' ? 1 : 0.4,
          }}
          transition={{
            duration: phaseDuration,
            ease: "easeInOut"
          }}
          className="absolute w-[80vw] h-[80vw] max-w-[350px] max-h-[350px] sm:max-w-[450px] sm:max-h-[450px] rounded-full flex items-center justify-center pointer-events-none"
        >
          {/* Base outer glow */}
          <div className="absolute inset-0 rounded-full bg-[#38bdf8]/20 blur-[50px] sm:blur-[80px]" />
          {/* Inner neon ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-[#38bdf8]/90 shadow-[0_0_30px_rgba(56,189,248,0.8),inset_0_0_30px_rgba(56,189,248,0.5)] bg-gradient-to-b from-[#38bdf8]/20 to-transparent backdrop-blur-sm" />
          {/* Deep core */}
          <div className="absolute inset-8 rounded-full bg-[#1e40af]/30 blur-[20px]" />
        </motion.div>`;
const practiceNew = `<motion.div
          initial={{ scale: 0.5, opacity: 0.1 }}
          animate={{
            scale: phase === 'in' ? 1 : 0.6,
            opacity: phase === 'in' ? 0.8 : 0.2,
          }}
          transition={{
            duration: phaseDuration,
            ease: "easeInOut"
          }}
          className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-[#38bdf8]/40 blur-[60px] sm:blur-[100px] mix-blend-screen pointer-events-none"
        />`;
practice = practice.replace(practiceOld, practiceNew);
fs.writeFileSync('src/screens/PracticeEngine.tsx', practice);

// 3. SynchronizedEngine.tsx
let sync = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf-8');
const syncOld = `<div 
                className="absolute w-[80vw] h-[80vw] max-w-[350px] max-h-[350px] sm:max-w-[450px] sm:max-h-[450px] rounded-full flex items-center justify-center pointer-events-none"
                style={{
                  transform: \`scale(\${(circleScale - 1) * 0.8 + 0.6})\`,
                  opacity: (circleScale - 1) * 1 + 0.4,
                  transition: 'transform 0.05s linear, opacity 0.05s linear'
                }}
              >
                <div className="absolute inset-0 rounded-full bg-[#38bdf8]/20 blur-[50px] sm:blur-[80px]" />
                <div className="absolute inset-0 rounded-full border-[3px] border-[#38bdf8]/90 shadow-[0_0_30px_rgba(56,189,248,0.8),inset_0_0_30px_rgba(56,189,248,0.5)] bg-gradient-to-b from-[#38bdf8]/20 to-transparent backdrop-blur-sm" />
                <div className="absolute inset-8 rounded-full bg-[#1e40af]/30 blur-[20px]" />
              </div>`;
const syncNew = `<div 
                className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-[#38bdf8]/40 blur-[60px] sm:blur-[100px] mix-blend-screen pointer-events-none"
                style={{
                  transform: \`scale(\${(circleScale - 1) * 0.8 + 0.6})\`,
                  opacity: (circleScale - 1) * 1 + 0.2,
                  transition: 'transform 0.05s linear, opacity 0.05s linear'
                }}
              />`;
sync = sync.replace(syncOld, syncNew);
fs.writeFileSync('src/screens/SynchronizedEngine.tsx', sync);
