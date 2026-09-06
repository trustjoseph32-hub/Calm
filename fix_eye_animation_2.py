with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

eye_comp = """
const EyeAnimation = ({ axis }: { axis: 'horizontal' | 'vertical' | 'diagonal' }) => {
  const pupilVariants = {
    horizontal: { x: [-12, 12, -12], y: 0 },
    vertical: { x: 0, y: [-8, 8, -8] },
    diagonal: { x: [-10, 10, -10], y: [-6, 6, -6] }
  };
  
  return (
    <div className="flex justify-center items-center gap-6 mt-6">
      {[1, 2].map((i) => (
        <div key={i} className="w-16 h-12 bg-neutral-900 rounded-[50%] flex items-center justify-center border border-neutral-800 overflow-hidden relative shadow-inner">
           <motion.div 
             animate={axis} 
             variants={pupilVariants} 
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             className="w-6 h-6 bg-indigo-500 rounded-full shadow-sm" 
           />
        </div>
      ))}
    </div>
  );
};

export function SynchronizedEngine() {"""

import re
content = re.sub(r'export function SynchronizedEngine\(\) \{', eye_comp, content)

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
    
print("Fix applied again")
