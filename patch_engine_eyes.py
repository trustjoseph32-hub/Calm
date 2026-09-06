import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

# 1. We need to define EyeAnimation component
eye_animation_component = """
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
"""

# Insert it before export default function SynchronizedEngine
import_index = content.find("export default function SynchronizedEngine")
if import_index != -1:
    content = content[:import_index] + eye_animation_component + "\n" + content[import_index:]

# 2. Update SOS_PAUSE render to include this component
pause_target = """          {engineState === 'SOS_PAUSE' && (
            <motion.div key="sos_pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 max-w-sm">
              <h2 className="text-2xl font-medium">Отдых</h2>
              <div className="text-neutral-400">
                <p>Сделай глубокий вдох и медленный выдох.</p>
                <p className="mt-2">Готовимся к следующему этапу.</p>
              </div>
              <div className="text-8xl font-light text-neutral-100 mt-8">{pauseTimeLeft}</div>
            </motion.div>
          )}"""

pause_replacement = """          {engineState === 'SOS_PAUSE' && (
            <motion.div key="sos_pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 max-w-sm">
              <h2 className="text-2xl font-medium">Отдых</h2>
              <div className="text-neutral-400">
                <p>Сделай глубокий вдох и медленный выдох.</p>
                <p className="mt-2">Готовимся к следующему этапу (движение {sosConfig[roundIndex + 1]?.axis === 'horizontal' ? 'горизонтальное' : sosConfig[roundIndex + 1]?.axis === 'vertical' ? 'вертикальное' : 'диагональное'}).</p>
              </div>
              <EyeAnimation axis={sosConfig[roundIndex + 1]?.axis || 'horizontal'} />
              <div className="text-8xl font-light text-neutral-100 mt-8">{pauseTimeLeft}</div>
            </motion.div>
          )}"""

if pause_target in content:
    content = content.replace(pause_target, pause_replacement)
    print("Replaced pause screen successfully")
else:
    print("Failed to match pause target")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
