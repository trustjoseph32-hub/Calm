import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

target = """        {currentSlide < slides.length - 1 ? (
          <button 
            onClick={() => setCurrentSlide(prev => prev + 1)}
            className="flex-1 py-3 rounded-xl font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition-colors"
          >
            Далее
          </button>
        ) : (
          actions?.map((action, index) => {
            const Icon = (Icons as any)[action.icon];
            return (
              <button
                key={index}
                onClick={() => handleAction(action.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  action.type === 'practice'
                    ? 'bg-gradient-to-b from-neutral-700 to-neutral-800 text-white border border-neutral-600 shadow-md'
                    : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {action.label}
              </button>
            );
          })
        )}"""

# The issue is `Icons` is not defined. We import specific icons, not the whole `Icons` module.
# Let's fix this by using `Play` directly or mapping it correctly since the only action right now is 'Play'.

replacement = """        {currentSlide < slides.length - 1 ? (
          <button 
            onClick={() => setCurrentSlide(prev => prev + 1)}
            className="flex-1 py-3 rounded-xl font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition-colors"
          >
            Далее
          </button>
        ) : (
          actions?.map((action, index) => {
            return (
              <button
                key={index}
                onClick={() => handleAction(action.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  action.type === 'practice'
                    ? 'bg-gradient-to-b from-neutral-700 to-neutral-800 text-white border border-neutral-600 shadow-md'
                    : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                }`}
              >
                {action.icon === 'Play' && <Play className="w-4 h-4" />}
                {action.label}
              </button>
            );
          })
        )}"""

content = content.replace(target, replacement)

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)
print("Fixed icons reference")
