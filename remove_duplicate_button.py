import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

target = """                  ) : lesson.actions ? (
                    <>
                      {lesson.actions.map((act, idx) => {"""

replacement = """                  ) : lesson.actions && !lesson.slides ? (
                    <>
                      {lesson.actions.map((act, idx) => {"""

target2 = """                      {isCompleted && (
                         <div className="flex items-center justify-center gap-2 text-sm text-green-400 font-medium bg-green-900/10 py-2.5 rounded-xl border border-green-900/30">
                            <CheckCircle2 className="w-4 h-4" /> Сессия прослушана
                         </div>
                      )}
                    </div>
                  ) : ("""

replacement2 = """                      {isCompleted && (
                         <div className="flex items-center justify-center gap-2 text-sm text-green-400 font-medium bg-green-900/10 py-2.5 rounded-xl border border-green-900/30">
                            <CheckCircle2 className="w-4 h-4" /> Сессия прослушана
                         </div>
                      )}
                    </div>
                  ) : lesson.slides ? null : ("""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced target 1")
else:
    print("Failed to replace target 1")
    
if target2 in content:
    content = content.replace(target2, replacement2)
    print("Replaced target 2")
else:
    print("Failed to replace target 2")

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)
