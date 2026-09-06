import re

with open('src/screens/Instruction.tsx', 'r') as f:
    content = f.read()

import_statement = "import { motion } from 'motion/react';\n"
if "motion/react" not in content:
    content = content.replace("import { ArrowLeft", import_statement + "import { ArrowLeft")

target = """          <p className="text-neutral-500 mb-4 leading-relaxed">
            Следи за точкой только в комфортной амплитуде. Не нужно напрягать глаза или доводить движение до боли. Дыши мягко и без усилия. Если заданный ритм неудобен, дыши в своём темпе. Ритмическое движение может помогать переключать внимание и снижать субъективное напряжение у некоторых людей.
          </p>"""

replacement = """          <p className="text-neutral-500 mb-4 leading-relaxed">
            Следи за точкой только в комфортной амплитуде. Не нужно напрягать глаза или доводить движение до боли. Дыши мягко и без усилия. Если заданный ритм неудобен, дыши в своём темпе. Ритмическое движение может помогать переключать внимание и снижать субъективное напряжение у некоторых людей.
          </p>
          
          <div className="flex justify-center mt-8 mb-4">
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

content = content.replace(target, replacement)

with open('src/screens/Instruction.tsx', 'w') as f:
    f.write(content)
