import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target1 = """              {/* Subtle track line */}
              {!reducedMotion && (
                <div 
                  className="absolute w-full h-1 flex items-center justify-center opacity-30 transition-transform duration-1000"
                  style={{
                    transform: isSOS 
                      ? (sosConfig[roundIndex]?.axis === 'vertical' ? 'rotate(90deg)' : 
                         sosConfig[roundIndex]?.axis === 'diagonal' ? (sosConfig[roundIndex].dirX === sosConfig[roundIndex].dirY ? 'rotate(30deg)' : 'rotate(-30deg)') : 'none')
                      : 'none'
                  }}
                >
                  <div className="w-[80vw] h-[1px] bg-white/20 rounded-full" />
                </div>
              )}"""

replacement1 = """              {/* Subtle track line */}
              {!reducedMotion && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0">
                  {isSOS ? (
                    <line 
                      x1={`calc(50% - ${sosConfig[roundIndex]?.axis !== 'vertical' ? 40 * (sosConfig[roundIndex]?.dirX || 1) : 0}vw)`}
                      y1={`calc(50% - ${sosConfig[roundIndex]?.axis !== 'horizontal' ? 38 * (sosConfig[roundIndex]?.dirY || 1) : 0}vh)`}
                      x2={`calc(50% + ${sosConfig[roundIndex]?.axis !== 'vertical' ? 40 * (sosConfig[roundIndex]?.dirX || 1) : 0}vw)`}
                      y2={`calc(50% + ${sosConfig[roundIndex]?.axis !== 'horizontal' ? 38 * (sosConfig[roundIndex]?.dirY || 1) : 0}vh)`}
                      stroke="white" 
                      strokeWidth="1" 
                      strokeOpacity="0.4"
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  ) : (
                    <line 
                      x1="calc(50% - 40vw)" 
                      y1="50%" 
                      x2="calc(50% + 40vw)" 
                      y2="50%" 
                      stroke="white" 
                      strokeWidth="1" 
                      strokeOpacity="0.4" 
                      strokeLinecap="round" 
                    />
                  )}
                </svg>
              )}"""
content = content.replace(target1, replacement1)

target2 = """              {/* Target */}
              <div 
                className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-10 pointer-events-none"
                style={{
                  transform: `translate(calc(${xOffset} * 40vw), calc(${yOffset} * 20vh))`,
                  transition: 'transform 0.05s linear'
                }}
              />"""

replacement2 = """              {/* Target */}
              <div 
                className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-10 pointer-events-none"
                style={{
                  transform: `translate(calc(${xOffset} * 40vw), calc(${yOffset} * 38vh))`,
                  transition: 'transform 0.05s linear'
                }}
              />"""
content = content.replace(target2, replacement2)

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
