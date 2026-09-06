import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """              {/* Subtle track line */}
              {!reducedMotion && (
                <div className="absolute w-full h-1 flex items-center justify-center opacity-30">
                  <div className="w-[80vw] h-[1px] bg-white/20 rounded-full" />
                </div>
              )}"""

replacement = """              {/* Subtle track line */}
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

content = content.replace(target, replacement)
with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
