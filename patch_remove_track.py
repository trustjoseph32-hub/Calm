import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """              {/* Subtle track line */}
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

replacement = """"""
content = content.replace(target, replacement)

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
