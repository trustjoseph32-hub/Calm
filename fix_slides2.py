import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

# We need to update the data structure. Let's add a `slides` array instead of `content` for day 1.

target_data = """    content: 'В первый день мы последовательно соберем базовый протокол саморегуляции: шаг за шагом освоим движение глаз, добавим дыхание, а затем — мышечный сброс.\\n\\nТакже мы сделаем замер уровня тревоги "До и После", чтобы ваш мозг получил физиологическое подтверждение того, что вы можете этим управлять.\\n\\nНажмите "Начать обучающую сессию", чтобы запустить процесс сборки.',"""

replacement_data = """    slides: [
      'В первый день мы последовательно соберем базовый протокол саморегуляции: шаг за шагом освоим движение глаз, добавим дыхание, а затем — мышечный сброс.',
      'Также мы сделаем замер уровня тревоги "До и После", чтобы ваш мозг получил физиологическое подтверждение того, что вы можете этим управлять.',
      'Нажмите "Начать обучающую сессию", чтобы запустить процесс сборки.'
    ],"""

if target_data in content:
    content = content.replace(target_data, replacement_data)
    print("Replaced data")

# Now let's update the rendering logic for slides.
# We need state to track the active slide, but wait! The Course.tsx renders a list of cards.
# Wait, each card in Course.tsx renders lesson data directly inline!
# If we add state to track the current slide for Day 1 inside a mapped array, we need a separate component for the Card.
