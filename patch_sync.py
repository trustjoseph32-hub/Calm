import re

with open('src/screens/Day1Engine.tsx', 'r') as f:
    content = f.read()

target = """        {/* EMDR Ball */}
        <motion.div
          className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-20 pointer-events-none"
          animate={{ x: ["-40vw", "40vw", "-40vw"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />"""

# To synchronize the ball with the breathing, its cycle should match the 8 seconds.
# But it moves from -40vw to 40vw and back. If we use the exact times array from breathing:
# times: [0, 0.4, 0.5, 0.9, 1]
# During 0-0.4 (inhale), it moves right.
# During 0.4-0.5 (hold), it stays right? Or keeps moving?
# Actually, box breathing typically halts movement or continues. If we want it perfectly aligned:
# Let's just make the ball's duration 8s, so one direction is 4s (matching inhale + hold), other is 4s (exhale + hold).
# `x: ["-40vw", "40vw", "40vw", "-40vw", "-40vw"]`
# `times: [0, 0.4, 0.5, 0.9, 1]`
# Let's do that!

replacement = """        {/* EMDR Ball */}
        <motion.div
          className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-20 pointer-events-none"
          animate={{ x: ["-40vw", "40vw", "40vw", "-40vw", "-40vw"] }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.4, 0.5, 0.9, 1]
          }}
        />"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced ball animation")
else:
    print("Failed to replace ball animation")

target_breath_text = """        {/* Relax Text for tension mode */}
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

replacement_breath_text = """        {/* Inhale/Exhale Text for Breath mode */}
        {mode === 'breath' && (
          <>
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
              ВДОХ
            </motion.div>
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
              ВЫДОХ
            </motion.div>
          </>
        )}

        {/* Relax Text for tension mode */}
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

if target_breath_text in content:
    content = content.replace(target_breath_text, replacement_breath_text)
    print("Replaced breath text")
else:
    print("Failed to replace breath text")

with open('src/screens/Day1Engine.tsx', 'w') as f:
    f.write(content)
