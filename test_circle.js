import fs from 'node:fs';

let content = fs.readFileSync('src/screens/Day1Engine.tsx', 'utf-8');

const oldCircle = `<motion.div
                  initial="exhale"
                  className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-400/30 blur-2xl sm:blur-3xl mix-blend-screen pointer-events-none"
                  variants={circleVariants}
                  animate={isActive ? phase : 'exhale'}
                />`;

const newCircle = `<motion.div
                  initial="exhale"
                  variants={circleVariants}
                  animate={isActive ? phase : 'exhale'}
                  className="absolute w-[80vw] h-[80vw] max-w-[350px] max-h-[350px] sm:max-w-[450px] sm:max-h-[450px] rounded-full flex items-center justify-center pointer-events-none"
                >
                  <div className="absolute inset-0 rounded-full bg-[#38bdf8]/20 blur-[50px] sm:blur-[80px]" />
                  <div className="absolute inset-0 rounded-full border-[3px] border-[#38bdf8]/90 shadow-[0_0_30px_rgba(56,189,248,0.8),inset_0_0_30px_rgba(56,189,248,0.5)] bg-gradient-to-b from-[#38bdf8]/20 to-transparent backdrop-blur-sm" />
                  <div className="absolute inset-8 rounded-full bg-[#1e40af]/30 blur-[20px]" />
                </motion.div>`;

content = content.replace(oldCircle, newCircle);
fs.writeFileSync('src/screens/Day1Engine.tsx', content);
