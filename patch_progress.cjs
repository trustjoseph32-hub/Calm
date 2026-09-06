const fs = require('fs');
let code = fs.readFileSync('src/screens/Progress.tsx', 'utf8');

const statsOld = `  const stats = useMemo(() => {
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
  }, [sessions]);`;

const statsNew = `  const stats = useMemo(() => {
    if (sessions.length === 0) return null;
    
    // Only use valid sessions for outcome stats
    const validOutcomes = sessions.filter(s => s.validForOutcomeStats && s.anxietyBefore !== undefined && s.anxietyAfter !== undefined);
    const avgBefore = validOutcomes.length ? validOutcomes.reduce((sum, s) => sum + (s.anxietyBefore || 0), 0) / validOutcomes.length : 0;
    const avgAfter = validOutcomes.length ? validOutcomes.reduce((sum, s) => sum + (s.anxietyAfter || 0), 0) / validOutcomes.length : 0;
    
    // Total minutes can include all sessions, maybe except 'not_started'
    const totalMinutes = sessions.filter(s => s.status !== 'not_started').reduce((sum, s) => sum + s.duration, 0) / 60;
    
    const uniqueDays = new Set(sessions.map(s => new Date(s.date).toDateString())).size;

    return {
      totalPractices: sessions.length,
      uniqueDays,
      avgBefore: avgBefore.toFixed(1),
      avgAfter: avgAfter.toFixed(1),
      avgDelta: (avgAfter - avgBefore).toFixed(1),
      totalMinutes: Math.round(totalMinutes),
      hasValidOutcomes: validOutcomes.length > 0
    };
  }, [sessions]);

  const chartData = useMemo(() => {
    const validOutcomes = sessions.filter(s => s.validForOutcomeStats && s.anxietyBefore !== undefined && s.anxietyAfter !== undefined);
    // Take last 14 practices
    return validOutcomes.slice(-14).map((s, i) => ({
      index: i + 1,
      before: s.anxietyBefore,
      after: s.anxietyAfter,
    }));
  }, [sessions]);`;

code = code.replace(statsOld, statsNew);

// In render, hide chart or show message if no valid outcomes
const renderOld = `{stats && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-neutral-800 p-4 rounded-2xl border border-neutral-700 shadow-sm flex flex-col justify-between">`;
const renderNew = `{stats && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-neutral-800 p-4 rounded-2xl border border-neutral-700 shadow-sm flex flex-col justify-between">`;

fs.writeFileSync('src/screens/Progress.tsx', code);
console.log("Patched Progress.tsx");
