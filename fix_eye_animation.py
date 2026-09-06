with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

# Let's check where the component was actually inserted
import re
print("Is EyeAnimation defined?", "const EyeAnimation" in content)

# It seems it wasn't inserted properly because the import index might have been wrong.
# Let's just insert it right before export default function
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

export default function SynchronizedEngine"""

content = re.sub(r'export default function SynchronizedEngine', eye_comp, content)

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
    
print("Fix applied")
