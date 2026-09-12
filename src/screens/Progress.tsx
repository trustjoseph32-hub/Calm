import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Calendar, Clock } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function Progress() {
  const navigate = useNavigate();
  const { sessions } = useAppStore();

  const courseSessions = useMemo(() => sessions.filter(s => !s.isSOS), [sessions]);

  const stats = useMemo(() => {
    if (courseSessions.length === 0) return null;
    
    // Only use valid sessions for outcome stats
    const validOutcomes = courseSessions.filter(s => s.validForOutcomeStats && s.anxietyBefore !== undefined && s.anxietyAfter !== undefined);
    const avgBefore = validOutcomes.length ? validOutcomes.reduce((sum, s) => sum + (s.anxietyBefore || 0), 0) / validOutcomes.length : 0;
    const avgAfter = validOutcomes.length ? validOutcomes.reduce((sum, s) => sum + (s.anxietyAfter || 0), 0) / validOutcomes.length : 0;
    
    // Total minutes can include all course sessions, maybe except 'not_started'
    const totalMinutes = courseSessions.filter(s => s.status !== 'not_started').reduce((sum, s) => sum + s.duration, 0) / 60;
    
    const uniqueDays = new Set(courseSessions.map(s => new Date(s.date).toDateString())).size;

    return {
      totalPractices: courseSessions.length,
      uniqueDays,
      avgBefore: avgBefore.toFixed(1),
      avgAfter: avgAfter.toFixed(1),
      avgDelta: (avgAfter - avgBefore).toFixed(1),
      totalMinutes: Math.round(totalMinutes),
      hasValidOutcomes: validOutcomes.length > 0
    };
  }, [courseSessions]);

  const chartData = useMemo(() => {
    const validOutcomes = courseSessions.filter(s => s.validForOutcomeStats && s.anxietyBefore !== undefined && s.anxietyAfter !== undefined);
    // Take last 14 practices
    return validOutcomes.slice(-14).map((s, i) => ({
      index: i + 1,
      before: s.anxietyBefore,
      after: s.anxietyAfter,
    }));
  }, [courseSessions]);

  return (
    <div className="flex-1 flex flex-col px-4 py-8 max-w-2xl mx-auto w-full">
      <header className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-blue-100/80 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 drop-shadow-md" />
        </button>
        <h1 className="text-xl font-medium ml-2 text-neutral-100">
          Мой прогресс
        </h1>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        {!stats ? (
          <div className="bg-white/10 p-12 rounded-3xl shadow-sm border border-white/10 flex flex-col items-center justify-center text-center">
            <Activity className="w-12 h-12 text-slate-500 mb-4" strokeWidth={1} />
            <h2 className="text-xl font-medium text-neutral-100 mb-2">Пока нет данных</h2>
            <p className="text-slate-500">Заверши свою первую практику, чтобы увидеть статистику.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-6 rounded-3xl shadow-sm border border-white/10 flex flex-col items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white flex items-center justify-center border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] mb-4">
                  <Activity className="w-5 h-5 drop-shadow-md text-indigo-50" />
                </div>
                <span className="text-3xl font-light text-neutral-100">{stats.totalPractices}</span>
                <span className="text-sm text-slate-500 mt-1">Всего практик</span>
              </div>
              <div className="bg-white/10 p-6 rounded-3xl shadow-sm border border-white/10 flex flex-col items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-emerald-400 via-emerald-600 to-emerald-800 text-white flex items-center justify-center border border-emerald-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(16,185,129,0.4)] mb-4">
                  <Calendar className="w-5 h-5 drop-shadow-md text-emerald-50" />
                </div>
                <span className="text-3xl font-light text-neutral-100">{stats.uniqueDays}</span>
                <span className="text-sm text-slate-500 mt-1">Дней с практикой</span>
              </div>
              <div className="col-span-2 bg-white/10 p-6 rounded-3xl shadow-sm border border-white/10 flex flex-col">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-6">Среднее изменение</h3>
                <div className="flex items-center justify-around w-full">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-slate-500 mb-1">До</span>
                    <span className="text-3xl font-light">{stats.avgBefore}</span>
                  </div>
                  <ArrowLeft className="w-6 h-6 text-slate-500 rotate-180" />
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-slate-500 mb-1">После</span>
                    <span className="text-3xl font-light">{stats.avgAfter}</span>
                  </div>
                  <div className="flex flex-col items-center pl-4 border-l border-white/10">
                    <span className="text-sm text-slate-500 mb-1">Дельта</span>
                    <span className="text-3xl font-medium text-neutral-100">{stats.avgDelta}</span>
                  </div>
                </div>
              </div>
            </div>

            {chartData.length > 1 && (
              <div className="bg-white/10 p-6 rounded-3xl shadow-sm border border-white/10 flex flex-col h-[300px]">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-6">Уровень тревоги (последние)</h3>
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
