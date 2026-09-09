import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

target = """    content: '1. Честно оцените свое состояние по 4 базовым критериям (Тревожность, Физическое напряжение, Эмоциональный фон, Мысли), чтобы мы могли отслеживать прогресс. Для этого нажмите кнопку Оценка состояния.\\n\\n2. Пройдите пробную сессию для того чтобы понять принцип работы этого упражнения. Все подсказки будут на экране во время упражнения.\\nЧтобы начать упражнение нажмите кнопку Сессия\\n\\n3. Оцените свое состояние в конце дня по 4 базовым критериям. Для этого нажмите кнопку Вечерний итог.',"""
replacement = """    content: 'В первый день мы последовательно соберем базовый протокол саморегуляции: шаг за шагом освоим движение глаз, добавим дыхание, а затем — мышечный сброс.\\n\\nТакже мы сделаем замер уровня тревоги "До и После", чтобы ваш мозг получил физиологическое подтверждение того, что вы можете этим управлять.\\n\\nНажмите "Начать обучающую сессию", чтобы запустить процесс сборки.',"""

target_actions = """    actions: [
      { id: 'checkin', label: 'Оценка состояния', icon: 'Activity', type: 'checkin' },
      { id: 'session', label: 'Сессия', icon: 'Play', type: 'practice' },
      { id: 'evening_checkin', label: 'Вечерний итог', icon: 'Moon', type: 'checkin_evening' }
    ]"""

replacement_actions = """    actions: [
      { id: 'session', label: 'Начать обучающую сессию', icon: 'Play', type: 'practice' }
    ]"""

if target in content:
    content = content.replace(target, replacement)
if target_actions in content:
    content = content.replace(target_actions, replacement_actions)

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)
print("Updated course desc")
