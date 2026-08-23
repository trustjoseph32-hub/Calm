import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

export function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings, clearHistory } = useAppStore();

  const handleClearHistory = () => {
    if (window.confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
      clearHistory();
      navigate('/');
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-8 max-w-2xl mx-auto w-full">
      <header className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-neutral-500 hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium ml-2 text-neutral-100">
          Настройки
        </h1>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        <section className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col gap-6">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Анимация и движение</h2>
          
          <div className="flex justify-between items-center">
            <span className="text-neutral-100">Скорость движения</span>
            <select 
              value={settings.bilateralSpeed}
              onChange={(e) => updateSettings({ bilateralSpeed: e.target.value as any })}
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-500"
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
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-500"
            >
              <option value="narrow">Узкая</option>
              <option value="normal">Обычная</option>
              <option value="wide">Широкая</option>
            </select>
          </div>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-neutral-100 flex flex-col">
              <span>Уменьшение движения</span>
              <span className="text-xs text-neutral-500 mt-1">Заменяет движение на мягкую смену подсветки</span>
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

        <section className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col gap-6">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Дыхание</h2>
          
          <div className="flex justify-between items-center">
            <span className="text-neutral-100">Вдох и выдох (секунды)</span>
            <select 
              value={settings.breathingIn}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateSettings({ breathingIn: val, breathingOut: val });
              }}
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-500"
            >
              {[3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} с</option>)}
            </select>
          </div>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-neutral-100 flex flex-col">
              <span>Текст «Вдох / Выдох»</span>
              <span className="text-xs text-neutral-500 mt-1">Отображать подсказки на экране</span>
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

        <section className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col gap-6">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Данные</h2>
          
          <button
            onClick={handleClearHistory}
            className="w-full py-4 rounded-xl border border-red-900/50 text-red-400 bg-red-950/30 hover:bg-red-900/30 transition-colors text-center font-medium"
          >
            Удалить мои данные
          </button>
        </section>
      </main>
    </div>
  );
}
