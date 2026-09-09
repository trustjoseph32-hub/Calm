import re

with open('src/screens/Day1Engine.tsx', 'r') as f:
    content = f.read()

target = """        {/* Breathing Circle Background */}
        {(mode === 'breath' || mode === 'tension') && (
          <motion.div
            className="absolute rounded-full border-2 border-indigo-500/20 bg-indigo-500/5 flex items-center justify-center"
            animate={{
              width: ['150px', '320px', '320px', '150px', '150px'],
              height: ['150px', '320px', '320px', '150px', '150px'],
              opacity: [0.3, 0.8, 0.8, 0.3, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.4, 0.5, 0.9, 1]
            }}
          >
            {mode === 'tension' && (
              <motion.div 
                className="text-indigo-200/50 text-2xl font-bold tracking-widest text-center"
                animate={{ opacity: [0, 1, 1, 0, 0], scale: [0.8, 1, 1, 0.8, 0.8] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0, 0.4, 0.5, 0.9, 1]
                }}
              >
                НАПРЯЧЬСЯ
              </motion.div>
            )}
          </motion.div>
        )}"""

replacement = """        {/* Breathing Circle Background */}
        {(mode === 'breath' || mode === 'tension') && (
          <>
            <motion.div
              className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-white blur-2xl sm:blur-3xl mix-blend-screen pointer-events-none"
              animate={{
                scale: [0.6, 1.4, 1.4, 0.6, 0.6],
                opacity: [0.2, 0.8, 0.8, 0.2, 0.2]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.4, 0.5, 0.9, 1]
              }}
            />
            {mode === 'tension' && (
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
            )}
          </>
        )}"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced breathing circle")
else:
    print("Failed to replace")

# Fix the relax text to match the same style
target_relax = """        {/* Relax Text for tension mode */}
        {mode === 'tension' && (
          <motion.div 
            className="absolute z-10 text-emerald-400/50 text-2xl font-bold tracking-widest"
            animate={{ opacity: [1, 0, 0, 1, 1], scale: [1, 0.8, 0.8, 1, 1] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
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

if target_relax in content:
    content = content.replace(target_relax, replacement_relax)
    print("Replaced relax text")
else:
    print("Failed to replace relax text")


with open('src/screens/Day1Engine.tsx', 'w') as f:
    f.write(content)
