import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/AppProvider';

export function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings, clearHistory } = useAppStore();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleClearHistory = () => {
    clearHistory();
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-8 max-w-2xl mx-auto w-full relative">
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white/10 p-6 rounded-3xl w-full max-w-sm border border-white/10 shadow-xl"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium text-white">Удалить все данные?</h3>
                <p className="text-slate-400 text-sm">
                  Это действие необратимо. Ваш прогресс и история сессий будут стерты.
                </p>
                <div className="flex gap-3 w-full mt-4">
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="flex-1 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-xl font-medium transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-blue-100/80 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 drop-shadow-md" />
        </button>
        <h1 className="text-xl font-medium ml-2 text-neutral-100">
          Настройки
        </h1>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        <section className="bg-white/10 p-6 rounded-3xl shadow-sm border border-white/10 flex flex-col gap-6">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Анимация и движение</h2>
          
          <div className="flex justify-between items-center">
            <span className="text-neutral-100">Скорость движения</span>
            <select 
              value={settings.bilateralSpeed}
              onChange={(e) => updateSettings({ bilateralSpeed: e.target.value as any })}
              className="bg-transparent border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-500"
            >
              <option value="slow">Медленно</option>
              <option value="medium">Средне</option>
              <option value="fast">Быстрее</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-100">Амплитуда</span>
            <select 
              value={settings.bilateralAmplitude}
              onChange={(e) => updateSettings({ bilateralAmplitude: e.target.value as any })}
              className="bg-transparent border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-500"
            >
              <option value="narrow">Узкая</option>
              <option value="normal">Обычная</option>
              <option value="wide">Широкая</option>
            </select>
          </div>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-neutral-100 flex flex-col">
              <span>Уменьшение движения</span>
              <span className="text-xs text-slate-500 mt-1">Заменяет движение на мягкую смену подсветки</span>
            </span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.reducedMotion}
                onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              />
              <div className="w-11 h-6 bg-neutral-700 rounded-full peer peer-checked:bg-neutral-400 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </div>
          </label>
        </section>

        <section className="bg-white/10 p-6 rounded-3xl shadow-sm border border-white/10 flex flex-col gap-6">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Дыхание</h2>
          
          <div className="flex justify-between items-center">
            <span className="text-neutral-100">Вдох и выдох (секунды)</span>
            <select 
              value={settings.breathingIn}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateSettings({ breathingIn: val, breathingOut: val });
              }}
              className="bg-transparent border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-500"
            >
              {[3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} с</option>)}
            </select>
          </div>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-neutral-100 flex flex-col">
              <span>Текст «Вдох / Выдох»</span>
              <span className="text-xs text-slate-500 mt-1">Отображать подсказки на экране</span>
            </span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.showText}
                onChange={(e) => updateSettings({ showText: e.target.checked })}
              />
              <div className="w-11 h-6 bg-neutral-700 rounded-full peer peer-checked:bg-neutral-400 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </div>
          </label>
        </section>

        <section className="bg-white/10 p-6 rounded-3xl shadow-sm border border-white/10 flex flex-col gap-6">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Данные</h2>
          
          <button
            onClick={() => setShowConfirmClear(true)}
            className="w-full py-4 rounded-xl border border-red-900/50 text-red-400 bg-red-950/30 hover:bg-red-900/30 transition-colors text-center font-medium"
          >
            Удалить мои данные
          </button>
        </section>
      </main>
    </div>
  );
}
