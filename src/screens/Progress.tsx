import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Calendar, Clock, TrendingDown } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function Progress() {
  const navigate = useNavigate();
  const { sessions, courseProgress } = useAppStore();

  const courseSessions = useMemo(() => {
    return sessions
      .filter(s => s.practiceType === 'course' || (!s.isSOS && s.courseDay))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions]);

  const stats = useMemo(() => {
    if (courseSessions.length === 0) return null;
    
    const validOutcomes = courseSessions.filter(
      s => s.anxietyBefore !== undefined && s.anxietyAfter !== undefined
    );
    const avgBefore = validOutcomes.length 
      ? validOutcomes.reduce((sum, s) => sum + (s.anxietyBefore || 0), 0) / validOutcomes.length 
      : 0;
    const avgAfter = validOutcomes.length 
      ? validOutcomes.reduce((sum, s) => sum + (s.anxietyAfter || 0), 0) / validOutcomes.length 
      : 0;
    
    const totalMinutes = courseSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60;
    const completedDaysCount = courseProgress.completedDays.length;

    return {
      totalPractices: courseSessions.length,
      completedDaysCount,
      avgBefore: avgBefore.toFixed(1),
      avgAfter: avgAfter.toFixed(1),
      avgDelta: (avgBefore - avgAfter).toFixed(1),
      totalMinutes: Math.round(totalMinutes),
      hasValidOutcomes: validOutcomes.length > 0
    };
  }, [courseSessions, courseProgress]);

  const chartData = useMemo(() => {
    const validOutcomes = [...courseSessions]
      .reverse()
      .filter(s => s.anxietyBefore !== undefined && s.anxietyAfter !== undefined);
    
    return validOutcomes.map((s, i) => ({
      index: s.courseDay ? `День ${s.courseDay}` : `#${i + 1}`,
      before: s.anxietyBefore,
      after: s.anxietyAfter,
      day: s.courseDay || i + 1,
    }));
  }, [courseSessions]);

  return (
    <div className="flex-1 flex flex-col px-4 py-8 max-w-2xl mx-auto w-full min-h-[100svh] bg-[#050B14] text-white">
      <header className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-light ml-3 text-white">
          Мой прогресс
        </h1>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        {!stats ? (
          <div className="bg-white/5 p-12 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center">
            <Activity className="w-12 h-12 text-white/30 mb-4" strokeWidth={1} />
            <h2 className="text-xl font-light text-white mb-2">Пока нет данных</h2>
            <p className="text-white/50 text-sm">Завершите первую практику курса, чтобы увидеть динамику наблюдений.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 flex flex-col items-start">
                <div className="w-10 h-10 rounded-2xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-3xl font-light text-white">{stats.completedDaysCount} / 14</span>
                <span className="text-xs text-white/50 mt-1">Пройдено дней курса</span>
              </div>

              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 flex flex-col items-start">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-3xl font-light text-white">{stats.totalMinutes} мин</span>
                <span className="text-xs text-white/50 mt-1">Время в практике</span>
              </div>

              <div className="col-span-2 bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col">
                <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-5">
                  Средний балл ощущения в теле
                </h3>
                <div className="flex items-center justify-around w-full">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-white/40 mb-1">До</span>
                    <span className="text-3xl font-light text-white/80">{stats.avgBefore}</span>
                  </div>
                  <div className="text-white/20">→</div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-white/40 mb-1">После</span>
                    <span className="text-3xl font-light text-[#38bdf8]">{stats.avgAfter}</span>
                  </div>
                  <div className="flex flex-col items-center pl-4 border-l border-white/10">
                    <span className="text-xs text-white/40 mb-1 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-[#38bdf8]" />
                      Изменение
                    </span>
                    <span className="text-3xl font-medium text-[#38bdf8]">{stats.avgDelta}</span>
                  </div>
                </div>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col h-[280px]">
                <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-4">
                  Динамика ощущений (по дням)
                </h3>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                      <XAxis dataKey="index" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0A1325', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                        itemStyle={{ fontSize: '13px' }}
                      />
                      <Line type="monotone" name="До" dataKey="before" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#64748b' }} />
                      <Line type="monotone" name="После" dataKey="after" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4, fill: '#38bdf8' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Course History List */}
            <div className="flex flex-col gap-3 mt-2">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider px-1">
                История дней курса
              </h3>
              {courseSessions.map((session) => (
                <div 
                  key={session.sessionId}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        День {session.courseDay || 1}
                      </span>
                      {session.practiceCategory && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                          {session.practiceCategory === 'A' ? 'Внимание + дыхание' : session.practiceCategory === 'B' ? 'Ритм + вибрация' : session.practiceCategory}
                        </span>
                      )}
                      <span className="text-xs text-[#38bdf8]">
                        {session.bodyLocationBefore || 'Тело'}
                      </span>
                    </div>
                    {session.anxietySituation && (
                      <p className="text-xs text-white/50 truncate max-w-[240px] italic">
                        «{session.anxietySituation}»
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-base text-white/50 font-light">{session.anxietyBefore ?? '-'}</span>
                    <span className="text-xs text-white/30">→</span>
                    <span className="text-base text-[#38bdf8] font-medium">{session.anxietyAfter ?? '-'}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
