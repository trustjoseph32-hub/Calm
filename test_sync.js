import fs from 'node:fs';

let content = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf-8');

const oldCircle = `<div 
                className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-white blur-2xl sm:blur-3xl mix-blend-screen pointer-events-none"
                style={{
                  transform: \`scale(\${(circleScale - 1) * 0.8 + 0.6})\`,
                  opacity: (circleScale - 1) * 1 + 0.2,
                  transition: 'transform 0.05s linear, opacity 0.05s linear'
                }}
              />`;

const newCircle = `<div 
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

content = content.replace(oldCircle, newCircle);
fs.writeFileSync('src/screens/SynchronizedEngine.tsx', content);
