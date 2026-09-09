import re

with open('src/screens/Day1Engine.tsx', 'r') as f:
    content = f.read()

# Replace НАПРЯЧЬСЯ
target_tension = """            {mode === 'tension' && (
              <motion.div 
                className="absolute z-10 text-white/70 text-2xl font-light tracking-[0.2em] uppercase text-center pointer-events-none"
                animate={{ opacity: [0, 1, 1, 0, 0], scale: [0.9, 1, 1, 0.9, 0.9] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.4, 0.5, 0.9, 1]
                }}
              >
                НАПРЯЧЬСЯ
              </motion.div>
            )}"""
replacement_tension = """            {mode === 'tension' && (
              <motion.div 
                className="absolute z-10 text-white/70 text-2xl font-light tracking-[0.2em] uppercase text-center pointer-events-none"
                animate={{ opacity: [0, 1, 1, 0, 0, 0, 0, 0, 0], scale: [0.95, 1, 1, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0, 0.05, 0.4, 0.45, 0.5, 0.55, 0.9, 0.95, 1]
                }}
              >
                НАПРЯЧЬСЯ
              </motion.div>
            )}"""

# Replace ВДОХ
target_inhale = """            <motion.div 
              className="absolute z-10 text-white/70 text-2xl font-light tracking-[0.2em] uppercase text-center pointer-events-none"
              animate={{ opacity: [0, 1, 1, 0, 0], scale: [0.9, 1, 1, 0.9, 0.9] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.4, 0.5, 0.9, 1]
              }}
            >
              ВДОХ
            </motion.div>"""
replacement_inhale = """            <motion.div 
              className="absolute z-10 text-white/70 text-2xl font-light tracking-[0.2em] uppercase text-center pointer-events-none"
              animate={{ opacity: [0, 1, 1, 0, 0, 0, 0, 0, 0], scale: [0.95, 1, 1, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.05, 0.4, 0.45, 0.5, 0.55, 0.9, 0.95, 1]
              }}
            >
              ВДОХ
            </motion.div>"""

# Replace ВЫДОХ
target_exhale = """            <motion.div 
              className="absolute z-10 text-white/70 text-2xl font-light tracking-[0.2em] uppercase text-center pointer-events-none"
              animate={{ opacity: [1, 0, 0, 1, 1], scale: [1, 0.9, 0.9, 1, 1] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.4, 0.5, 0.9, 1]
              }}
            >
              ВЫДОХ
            </motion.div>"""
replacement_exhale = """            <motion.div 
              className="absolute z-10 text-white/70 text-2xl font-light tracking-[0.2em] uppercase text-center pointer-events-none"
              animate={{ opacity: [0, 0, 0, 0, 0, 1, 1, 0, 0], scale: [0.95, 0.95, 0.95, 0.95, 0.95, 1, 1, 0.95, 0.95] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.05, 0.4, 0.45, 0.5, 0.55, 0.9, 0.95, 1]
              }}
            >
              ВЫДОХ
            </motion.div>"""

# Replace РАССЛАБИТЬСЯ
target_relax = """        {/* Relax Text for tension mode */}
        {mode === 'tension' && (
          <motion.div 
            className="absolute z-10 text-white/70 text-2xl font-light tracking-[0.2em] uppercase text-center pointer-events-none"
            animate={{ opacity: [1, 0, 0, 1, 1], scale: [1, 0.9, 0.9, 1, 1] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.5, 0.9, 1]
            }}
          >
            РАССЛАБИТЬСЯ
          </motion.div>
        )}"""
replacement_relax = """        {/* Relax Text for tension mode */}
        {mode === 'tension' && (
          <motion.div 
            className="absolute z-10 text-white/70 text-2xl font-light tracking-[0.2em] uppercase text-center pointer-events-none"
            animate={{ opacity: [0, 0, 0, 0, 0, 1, 1, 0, 0], scale: [0.95, 0.95, 0.95, 0.95, 0.95, 1, 1, 0.95, 0.95] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.05, 0.4, 0.45, 0.5, 0.55, 0.9, 0.95, 1]
            }}
          >
            РАССЛАБИТЬСЯ
          </motion.div>
        )}"""

content = content.replace(target_tension, replacement_tension)
content = content.replace(target_inhale, replacement_inhale)
content = content.replace(target_exhale, replacement_exhale)
content = content.replace(target_relax, replacement_relax)

with open('src/screens/Day1Engine.tsx', 'w') as f:
    f.write(content)
print("Updated all text timings")
