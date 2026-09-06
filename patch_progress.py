import re

with open('src/screens/Progress.tsx', 'r') as f:
    content = f.read()

# Replace the direct use of sessions with a filtered array inside the component
replacement = """  const { sessions } = useAppStore();

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
  }, [courseSessions]);"""

# Using regex to replace the section from "const { sessions }" up to the end of chartData useMemo
pattern = re.compile(r'  const { sessions } = useAppStore\(\);\s+const stats = useMemo\(\(\) => \{.*?\n  \}, \[sessions\]\);\s+const chartData = useMemo\(\(\) => \{.*?\n  \}, \[sessions\]\);', re.DOTALL)

if pattern.search(content):
    content = pattern.sub(replacement, content)
else:
    print("Pattern not found!")

with open('src/screens/Progress.tsx', 'w') as f:
    f.write(content)
