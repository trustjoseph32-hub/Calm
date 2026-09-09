import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

# Let's import useState
if "import { useState } from 'react';" not in content:
    content = content.replace("import React from 'react';", "import React, { useState } from 'react';")

# Add SlideRenderer component right before the Course function.
slide_renderer = """
const SlideRenderer = ({ slides, actions, handleAction }: { slides: string[], actions: any[], handleAction: (id: string) => void }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  return (
    <div className="space-y-6">
      <div className="relative min-h-[120px] bg-neutral-900/50 rounded-xl p-4 border border-neutral-800 flex items-center justify-center text-center">
        <p className="text-neutral-300 text-base leading-relaxed">
          {slides[currentSlide]}
        </p>
      </div>
      
      <div className="flex justify-center gap-2">
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full transition-colors ${i === currentSlide ? 'bg-indigo-500' : 'bg-neutral-700'}`} 
          />
        ))}
      </div>

      <div className="flex gap-4">
        {currentSlide > 0 && (
          <button 
            onClick={() => setCurrentSlide(prev => prev - 1)}
            className="flex-1 py-3 rounded-xl font-medium text-neutral-400 bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
          >
            Назад
          </button>
        )}
        {currentSlide < slides.length - 1 ? (
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
        )}
      </div>
    </div>
  );
};

export function Course() {
"""

content = content.replace("export function Course() {", slide_renderer)

# Replace the rendering part
target_render = """                {lesson.content ? (
                  <div className="whitespace-pre-wrap text-neutral-400 leading-relaxed text-base">
                    {lesson.content}
                  </div>
                ) : lesson.session ? (
                  <div className="space-y-2">
                    <div className="font-medium text-neutral-200">Сессия по протоколу:</div>
                    <div className="whitespace-pre-wrap pl-3 border-l-2 border-neutral-700/60 text-neutral-400 leading-relaxed">
                      {lesson.session}
                    </div>
                  </div>
                ) : null}"""

replacement_render = """                {lesson.slides ? (
                  <SlideRenderer slides={lesson.slides} actions={lesson.actions} handleAction={(id) => handleAction(id, lesson.day)} />
                ) : lesson.content ? (
                  <div className="whitespace-pre-wrap text-neutral-400 leading-relaxed text-base">
                    {lesson.content}
                  </div>
                ) : lesson.session ? (
                  <div className="space-y-2">
                    <div className="font-medium text-neutral-200">Сессия по протоколу:</div>
                    <div className="whitespace-pre-wrap pl-3 border-l-2 border-neutral-700/60 text-neutral-400 leading-relaxed">
                      {lesson.session}
                    </div>
                  </div>
                ) : null}"""

content = content.replace(target_render, replacement_render)

# Now we need to hide the normal actions block if it's rendered by SlideRenderer
target_actions = """                {isAvailable && lesson.actions && (
                  <div className="pt-2 flex flex-col gap-3">
                    {lesson.actions.map((action, index) => {"""

replacement_actions = """                {isAvailable && lesson.actions && !lesson.slides && (
                  <div className="pt-2 flex flex-col gap-3">
                    {lesson.actions.map((action, index) => {"""

content = content.replace(target_actions, replacement_actions)

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)
print("Updated Course.tsx with slides logic")
