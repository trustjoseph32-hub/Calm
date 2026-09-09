import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """          {engineState === 'SOS_OUTRO' && (
            <motion.div key="sos_outro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 max-w-sm">
              <h2 className="text-2xl font-medium">Отлично.</h2>
              <div className="text-neutral-400">
                <p>А теперь давайте немного заземлимся.</p>
                <p className="mt-4 text-neutral-200 font-medium leading-relaxed">Найдите сейчас 5 предметов, которые видите вокруг себя, и назовите их про себя.</p>
                <p className="mt-4 text-neutral-200 font-medium leading-relaxed">После того, как сделаете это, прикоснитесь руками также к 5 разным предметам.</p>
              </div>
              <button"""

replacement = """          {engineState === 'SOS_OUTRO' && (
            <motion.div key="sos_outro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center space-y-8 max-w-sm w-full px-4">
              <h2 className="text-2xl font-medium">Отлично.</h2>
              <div className="text-neutral-400">
                <p className="mb-6">А теперь давайте немного заземлимся.</p>
                <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 p-6 sm:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
                  <p className="text-neutral-200 font-medium leading-relaxed relative z-10">Найдите сейчас <span className="text-indigo-300">5 предметов</span>, которые видите вокруг себя, и назовите их про себя.</p>
                  
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent my-5 relative z-10" />
                  
                  <p className="text-neutral-200 font-medium leading-relaxed relative z-10">После того, как сделаете это, прикоснитесь руками также к <span className="text-indigo-300">5 разным предметам</span>.</p>
                </div>
              </div>
              <button"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Failed to match")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
