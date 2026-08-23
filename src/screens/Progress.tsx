import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Calendar, Clock } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function Progress() {
  const navigate = useNavigate();
  const { sessions } = useAppStore();

  const stats = useMemo(() => {
    if (sessions.length === 0) return null;
    
    const completed = sessions.filter(s => s.completed);
    const avgBefore = completed.length ? completed.reduce((sum, s) => sum + (s.anxietyBefore || 0), 0) / completed.length : 0;
    const avgAfter = completed.length ? completed.reduce((sum, s) => sum + (s.anxietyAfter || 0), 0) / completed.length : 0;
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    
    const uniqueDays = new Set(sessions.map(s => new Date(s.date).toDateString())).size;

    return {
      totalPractices: sessions.length,
      uniqueDays,
      avgBefore: avgBefore.toFixed(1),
      avgAfter: avgAfter.toFixed(1),
      avgDelta: (avgAfter - avgBefore).toFixed(1),
      totalMinutes: Math.round(totalMinutes),
    };
  }, [sessions]);

  const chartData = useMemo(() => {
    const completed = sessions.filter(s => s.completed && s.anxietyBefore !== undefined && s.anxietyAfter !== undefined);
    // Take last 14 practices
    return completed.slice(-14).map((s, i) => ({
      index: i + 1,
      before: s.anxietyBefore,
      after: s.anxietyAfter,
    }));
  }, [sessions]);

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
          Мой прогресс
        </h1>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        {!stats ? (
          <div className="bg-neutral-800 p-12 rounded-3xl shadow-sm border border-neutral-700 flex flex-col items-center justify-center text-center">
            <Activity className="w-12 h-12 text-neutral-500 mb-4" strokeWidth={1} />
            <h2 className="text-xl font-medium text-neutral-100 mb-2">Пока нет данных</h2>
            <p className="text-neutral-500">Заверши свою первую практику, чтобы увидеть статистику.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col items-start">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-3xl font-light text-neutral-100">{stats.totalPractices}</span>
                <span className="text-sm text-neutral-500 mt-1">Всего практик</span>
              </div>
              <div className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col items-start">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 mb-4">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-3xl font-light text-neutral-100">{stats.uniqueDays}</span>
                <span className="text-sm text-neutral-500 mt-1">Дней с практикой</span>
              </div>
              <div className="col-span-2 bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col">
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-6">Среднее изменение</h3>
                <div className="flex items-center justify-around w-full">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-neutral-500 mb-1">До</span>
                    <span className="text-3xl font-light">{stats.avgBefore}</span>
                  </div>
                  <ArrowLeft className="w-6 h-6 text-neutral-500 rotate-180" />
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-neutral-500 mb-1">После</span>
                    <span className="text-3xl font-light">{stats.avgAfter}</span>
                  </div>
                  <div className="flex flex-col items-center pl-4 border-l border-neutral-700">
                    <span className="text-sm text-neutral-500 mb-1">Дельта</span>
                    <span className="text-3xl font-medium text-neutral-100">{stats.avgDelta}</span>
                  </div>
                </div>
              </div>
            </div>

            {chartData.length > 1 && (
              <div className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col h-[300px]">
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-6">Уровень тревоги (последние)</h3>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <XAxis dataKey="index" tick={false} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#a3a3a3', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '14px' }}
                      />
                      <Line type="monotone" name="До" dataKey="before" stroke="#a3a3a3" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      <Line type="monotone" name="После" dataKey="after" stroke="#171717" strokeWidth={3} dot={{r: 4, fill: '#171717'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
