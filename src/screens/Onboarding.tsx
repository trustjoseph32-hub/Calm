import React, { useState } from 'react';
import { useAppStore } from '../store/AppProvider';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Activity, Maximize, ArrowRight } from 'lucide-react';

export function Onboarding() {
  const { completeOnboarding } = useAppStore();
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);

  const steps = [
    {
      title: 'Calm Motion',
      text: 'Небольшие практики для моментов, когда внутри слишком много напряжения.',
      icon: <Wind className="w-12 h-12 text-neutral-500 mb-6" strokeWidth={1.5} />,
    },
    {
      title: 'Выбирай свой ритм',
      text: 'Дыхание, движение и grounding можно использовать отдельно или вместе.',
      icon: <Activity className="w-12 h-12 text-neutral-500 mb-6" strokeWidth={1.5} />,
    },
    {
      title: 'Ты всегда управляешь практикой',
      text: 'Можно остановиться, изменить скорость или выключить любой элемент.',
      icon: <Maximize className="w-12 h-12 text-neutral-500 mb-6" strokeWidth={1.5} />,
    },
    {
      title: 'Готово',
      text: '',
      icon: null,
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else if (agreed) {
      completeOnboarding();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-neutral-900">
      <div className="max-w-md w-full flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            {steps[step].icon}
            <h1 className="text-3xl font-medium tracking-tight mb-4 text-neutral-100">
              {steps[step].title}
            </h1>
            {steps[step].text && (
              <p className="text-lg text-neutral-500 leading-relaxed max-w-sm">
                {steps[step].text}
              </p>
            )}

            {step === 3 && (
              <div className="mt-8 flex flex-col items-start text-left bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-700">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <div className={`w-6 h-6 rounded border-2 transition-colors flex items-center justify-center ${agreed ? 'bg-neutral-800 border-neutral-800' : 'border-neutral-600 group-hover:border-neutral-400'}`}>
                      {agreed && <ArrowRight className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <span className="text-neutral-500 leading-relaxed text-sm">
                    Я понимаю, что приложение предназначено для саморегуляции и не заменяет профессиональную психологическую или медицинскую помощь.
                  </span>
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 w-full flex flex-col items-center gap-8">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-neutral-800' : 'w-2 bg-neutral-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={step === 3 && !agreed}
            className="w-full max-w-xs py-4 rounded-full bg-white text-neutral-900 text-lg font-medium transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 hover:bg-neutral-200"
          >
            {step === 3 ? 'Начать' : 'Далее'}
          </button>
        </div>
      </div>
    </div>
  );
}
