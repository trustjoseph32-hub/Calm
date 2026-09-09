import re

with open('src/screens/Day1Engine.tsx', 'r') as f:
    content = f.read()

target = """        {/* EMDR Ball */}
        <motion.div
          className="w-10 h-10 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] z-20"
          animate={{ x: ["-120px", "120px", "-120px"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />"""

replacement = """        {/* EMDR Ball */}
        <motion.div
          className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-20 pointer-events-none"
          animate={{ x: ["-40vw", "40vw", "-40vw"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced ball")

with open('src/screens/Day1Engine.tsx', 'w') as f:
    f.write(content)
