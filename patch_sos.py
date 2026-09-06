import re

with open('src/screens/SosInstruction.tsx', 'r') as f:
    content = f.read()

import_statement = "import { motion } from 'motion/react';\n"
if "motion/react" not in content:
    content = content.replace("import { ArrowLeft", import_statement + "import { ArrowLeft")

target = """        <div className="flex gap-6 items-start">
          <div className="text-2xl sm:text-4xl font-light text-neutral-500">2</div>
          <p className="text-lg sm:text-2xl font-medium text-neutral-100 leading-tight">
            Направляйте взгляд вместе с шариком до самого конца и до небольшого ощущения напряжения в мышцах глаз в крайних точках.
          </p>
        </div>"""

replacement = """        <div className="flex gap-6 items-start">
          <div className="text-2xl sm:text-4xl font-light text-neutral-500">2</div>
          <div className="flex flex-col gap-4 w-full">
            <p className="text-lg sm:text-2xl font-medium text-neutral-100 leading-tight">
              Направляйте взгляд вместе с шариком до самого конца и до небольшого ощущения напряжения в мышцах глаз в крайних точках.
            </p>
            
            <div className="flex justify-center mt-2 mb-2 w-full">
              <div className="flex gap-4 sm:gap-8">
                {/* Left Eye */}
                <div className="w-16 h-8 sm:w-20 sm:h-10 bg-neutral-100 rounded-[50%] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.3),inset_0_-1px_3px_rgba(0,0,0,0.1)] relative overflow-hidden border-t-[3px] border-neutral-500">
                  <motion.div
                    animate={{ x: [-18, 18, -18] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-neutral-900 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] relative"
                  >
                    {/* Pupil */}
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full" />
                    {/* Catchlight */}
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/80 rounded-full absolute top-1.5 right-1.5 sm:top-2 sm:right-2 blur-[0.5px]" />
                  </motion.div>
                  {/* Eyelid shadow overlay */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Right Eye */}
                <div className="w-16 h-8 sm:w-20 sm:h-10 bg-neutral-100 rounded-[50%] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.3),inset_0_-1px_3px_rgba(0,0,0,0.1)] relative overflow-hidden border-t-[3px] border-neutral-500">
                  <motion.div
                    animate={{ x: [-18, 18, -18] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-neutral-900 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] relative"
                  >
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full" />
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/80 rounded-full absolute top-1.5 right-1.5 sm:top-2 sm:right-2 blur-[0.5px]" />
                  </motion.div>
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>"""

content = content.replace(target, replacement)

with open('src/screens/SosInstruction.tsx', 'w') as f:
    f.write(content)
