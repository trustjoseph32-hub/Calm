import React, { useState } from 'react';
import { useAppStore } from '../store/AppProvider';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Activity, Maximize, Check } from 'lucide-react';

export function Onboarding() {
  const { completeOnboarding } = useAppStore();
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);

  const steps = [
    {
      title: 'Panic Attack Club',
      text: 'Передовые технологии и научно обоснованные практики для минимизации тревожности и телесного напряжения.',
      icon: <Wind className="w-12 h-12 text-slate-400 mb-6 drop-shadow-md" strokeWidth={1.5} />,
    },
    {
      title: 'Выбирай свой ритм',
      text: 'Дыхание, движение и grounding можно использовать отдельно или вместе.',
      icon: <Activity className="w-12 h-12 text-slate-400 mb-6 drop-shadow-md" strokeWidth={1.5} />,
    },
    {
      title: 'Ты всегда управляешь практикой',
      text: 'Можно остановиться, изменить скорость или выключить любой элемент.',
      icon: <Maximize className="w-12 h-12 text-slate-400 mb-6 drop-shadow-md" strokeWidth={1.5} />,
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
    <div className="flex-1 w-full min-h-[100svh] relative bg-[#050B14] overflow-hidden font-sans flex flex-col">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
        
        {/* Night Sky / Stars */}
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        
        {/* Bottom Fade */}
        <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-[#050B14] to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full flex flex-col items-center text-center z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center w-full"
            >
              {steps[step].icon}
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 text-white">
                {steps[step].title}
              </h1>
              {steps[step].text && (
                <p className="text-lg text-slate-400 leading-relaxed max-w-sm">
                  {steps[step].text}
                </p>
              )}
              {step === 3 && (
                <div className="mt-8 flex flex-col items-start text-left bg-white/5 p-6 rounded-2xl shadow-sm border border-white/10 backdrop-blur-md w-full">
                  <label className="flex items-start gap-4 cursor-pointer group w-full">
                    <div className="relative flex items-center justify-center mt-1 shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                      />
                      <div className={`w-6 h-6 rounded-md border-2 transition-colors flex items-center justify-center ${agreed ? 'bg-[#38BDF8] border-[#38BDF8]' : 'border-white/30 group-hover:border-white/50'}`}>
                        {agreed && <Check className="w-4 h-4 text-[#050B14]" strokeWidth={3} />}
                      </div>
                    </div>
                    <span className="text-slate-300 leading-relaxed text-sm">
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
                    i === step ? 'w-8 bg-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={step === 3 && !agreed}
              className="w-full flex items-center justify-center px-8 py-4 sm:py-5 rounded-[1.5rem] font-medium text-lg transition-all duration-300 group active:scale-[0.98] bg-gradient-to-r from-[#1E40AF] to-[#38BDF8] text-white shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] disabled:opacity-50 disabled:shadow-none"
            >
              {step === 3 ? 'Начать' : 'Далее'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
