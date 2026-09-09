import re

with open('src/screens/Day1Engine.tsx', 'r') as f:
    content = f.read()

target = """        {step === 'PRE_WATER' && (
          <motion.div key="pre_water" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8 text-center">
            <h2 className="text-2xl font-medium text-white">Рефлекс ныряльщика</h2>
            <p className="text-neutral-400">Перед тем как мы начнем, сходите в ванную и умойте лицо ледяной водой (или приложите холодное полотенце).</p>
            <p className="text-neutral-400">Это активирует «рефлекс ныряльщика» и мгновенно замедлит ваш пульс на физиологическом уровне.</p>
            <button 
              onClick={() => setStep('PRE_ASSESS')}
              className="w-full py-4 mt-8 bg-indigo-600 rounded-full font-medium"
            >
              Я сделал(а), идем дальше
            </button>
          </motion.div>
        )}"""

replacement = """        {step === 'PRE_WATER' && (
          <motion.div key="pre_water" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8 text-center">
            <p className="text-neutral-400">Перед тем как мы начнем, сходите в ванную и умойте лицо ледяной водой (или приложите холодное полотенце).</p>
            <p className="text-neutral-400">Это активирует нужное состояние на физиологическом уровне.</p>
            <button 
              onClick={() => setStep('PRE_ASSESS')}
              className="w-full py-4 mt-8 bg-indigo-600 rounded-full font-medium"
            >
              Я сделал(а), идем дальше
            </button>
          </motion.div>
        )}"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced water step")
else:
    print("Target not found")

with open('src/screens/Day1Engine.tsx', 'w') as f:
    f.write(content)

