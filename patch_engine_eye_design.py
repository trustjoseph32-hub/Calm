with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

import re

target_regex = r"const EyeAnimation = \(\{ axis \}: \{ axis: 'horizontal' \| 'vertical' \| 'diagonal' \}\) => \{.*?^\};"

new_eye_comp = """const EyeAnimation = ({ axis }: { axis: 'horizontal' | 'vertical' | 'diagonal' }) => {
  const pupilVariants = {
    horizontal: { x: [-18, 18, -18], y: 0 },
    vertical: { x: 0, y: [-12, 12, -12] },
    diagonal: { x: [-14, 14, -14], y: [-10, 10, -10] }
  };
  
  return (
    <div className="flex justify-center items-center gap-4 sm:gap-8 mt-6">
      {[1, 2].map((i) => (
        <div key={i} className="w-16 h-8 sm:w-20 sm:h-10 bg-neutral-100 rounded-[50%] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.3),inset_0_-1px_3px_rgba(0,0,0,0.1)] relative overflow-hidden border-t-[3px] border-neutral-500">
           <motion.div 
             animate={axis} 
             variants={pupilVariants} 
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
      ))}
    </div>
  );
};"""

content = re.sub(target_regex, new_eye_comp, content, flags=re.MULTILINE | re.DOTALL)

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
    
print("Eye design updated")
