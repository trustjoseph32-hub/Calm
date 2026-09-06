import re

with open('src/screens/Instruction.tsx', 'r') as f:
    content = f.read()

target = """          <div className="flex justify-center mt-8 mb-4">
            <div className="flex gap-6">
              {/* Left Eye */}
              <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] relative overflow-hidden">
                <motion.div
                  animate={{ x: [-14, 14, -14] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-6 h-6 bg-neutral-900 rounded-full shadow-sm"
                />
              </div>
              {/* Right Eye */}
              <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] relative overflow-hidden">
                <motion.div
                  animate={{ x: [-14, 14, -14] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-6 h-6 bg-neutral-900 rounded-full shadow-sm"
                />
              </div>
            </div>
          </div>"""

replacement = """          <div className="flex justify-center mt-8 mb-6">
            <div className="flex gap-4 sm:gap-8">
              {/* Left Eye */}
              <div className="w-20 h-10 sm:w-24 sm:h-12 bg-neutral-100 rounded-[50%] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.3),inset_0_-1px_3px_rgba(0,0,0,0.1)] relative overflow-hidden border-t-[3px] border-neutral-500">
                <motion.div
                  animate={{ x: [-16, 16, -16] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-neutral-900 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] relative"
                >
                  {/* Pupil */}
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-black rounded-full" />
                  {/* Catchlight */}
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/80 rounded-full absolute top-2 right-2 sm:top-2.5 sm:right-2.5 blur-[0.5px]" />
                </motion.div>
                {/* Eyelid shadow overlay */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Right Eye */}
              <div className="w-20 h-10 sm:w-24 sm:h-12 bg-neutral-100 rounded-[50%] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.3),inset_0_-1px_3px_rgba(0,0,0,0.1)] relative overflow-hidden border-t-[3px] border-neutral-500">
                <motion.div
                  animate={{ x: [-16, 16, -16] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-neutral-900 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] relative"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-black rounded-full" />
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/80 rounded-full absolute top-2 right-2 sm:top-2.5 sm:right-2.5 blur-[0.5px]" />
                </motion.div>
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>"""

content = content.replace(target, replacement)

with open('src/screens/Instruction.tsx', 'w') as f:
    f.write(content)
