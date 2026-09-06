const fs = require('fs');
let code = fs.readFileSync('src/store/AppProvider.tsx', 'utf8');

// Update defaultSettings
const defaultSettingsOld = `const defaultSettings: AppSettings = {
  bilateralSpeed: 'medium',
  bilateralAmplitude: 'normal',
  breathingIn: 4,
  breathingOut: 6,
  soundMode: 'none',
  hapticFeedback: true,
  showText: true,
  reducedMotion: false,
  theme: 'dark',
  syncInhaleDuration: 4,
  syncExhaleDuration: 6,
  syncBilateralAudio: false,
  syncVolume: 0.5,
  syncOrbSize: 'medium',
  syncVisualAmplitude: 'normal',
  syncReducedMotion: false,
  syncShowText: true,
  syncBreathingCircle: true,
  syncBackgroundNoise: 'none',
};`;

const defaultSettingsNew = `const defaultSettings: AppSettings = {
  bilateralSpeed: 'medium',
  bilateralAmplitude: 'normal',
  breathingIn: 4,
  breathingOut: 6,
  soundMode: 'none',
  hapticFeedback: true,
  showText: true,
  reducedMotion: false,
  theme: 'dark',
  syncInhaleDuration: 4,
  syncExhaleDuration: 6,
  syncBilateralAudio: false,
  syncBilateralVolume: 0.5,
  syncAmbientSound: 'none',
  syncVolume: 0.5,
  syncOrbSize: 'medium',
  syncVisualAmplitude: 'normal',
  syncReducedMotion: false,
  syncShowText: true,
  syncBreathingCircle: true,
};`;
code = code.replace(defaultSettingsOld, defaultSettingsNew);

// Add migration logic inside the try-catch block of AppProvider initialization
const migrationOld = `        return { 
          ...initialState, 
          ...parsed,
          settings: {
            ...initialState.settings,
            ...(parsed.settings || {})
          },
          courseProgress: {
            ...initialState.courseProgress,
            ...(parsed.courseProgress || {})
          }
        };`;

const migrationNew = `
        // Migrate old sessions
        const migratedSessions = (parsed.sessions || []).map(session => {
          if (!session.schemaVersion) {
            // Old version
            return {
              ...session,
              schemaVersion: 2,
              status: session.completed ? 'completed' : session.stoppedEarly ? 'interrupted' : 'not_started',
              completedRounds: 0,
              roundAnswers: [],
              usedGrounding: false,
              reducedMotion: !!session.reducedMotion,
              // If it's an old SOS session with preScore 10 (likely auto-filled), invalidate it
              validForOutcomeStats: session.isSOS && session.anxietyBefore === 10 ? false : true,
            };
          }
          return session;
        });

        // Migrate settings mapping (syncBackgroundNoise -> syncAmbientSound)
        const migratedSettings = {
          ...initialState.settings,
          ...(parsed.settings || {})
        };
        if (parsed.settings && parsed.settings.syncBackgroundNoise && !parsed.settings.syncAmbientSound) {
          migratedSettings.syncAmbientSound = parsed.settings.syncBackgroundNoise;
        }

        return { 
          ...initialState, 
          ...parsed,
          settings: migratedSettings,
          sessions: migratedSessions,
          courseProgress: {
            ...initialState.courseProgress,
            ...(parsed.courseProgress || {})
          }
        };`;
code = code.replace(migrationOld, migrationNew);

// Add updateCourseState method inside the AppProvider context
const storeContextOld = `  const saveCheckin = (checkin: import('../types').DailyCheckin) => {
    setState((prev) => ({
      ...prev,
      checkins: [...prev.checkins, checkin],
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,`;

const storeContextNew = `  const saveCheckin = (checkin: import('../types').DailyCheckin) => {
    setState((prev) => ({
      ...prev,
      checkins: [...prev.checkins, checkin],
    }));
  };

  const updateCourseTodayState = (updates: Partial<NonNullable<import('../types').CourseProgress['todayState']>>) => {
    setState(prev => ({
      ...prev,
      courseProgress: {
        ...prev.courseProgress,
        todayState: {
          ...(prev.courseProgress.todayState || { practiceStatus: 'not_started', checkinCompleted: false, eveningCheckinCompleted: false }),
          ...updates
        }
      }
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        updateCourseTodayState,`;
code = code.replace(storeContextOld, storeContextNew);

// Also need to add updateCourseTodayState to AppContextType
const appContextTypeOld = `  saveCheckin: (checkin: import('../types').DailyCheckin) => void;
}`;
const appContextTypeNew = `  saveCheckin: (checkin: import('../types').DailyCheckin) => void;
  updateCourseTodayState: (updates: Partial<NonNullable<import('../types').CourseProgress['todayState']>>) => void;
}`;
code = code.replace(appContextTypeOld, appContextTypeNew);

fs.writeFileSync('src/store/AppProvider.tsx', code);
console.log("Patched AppProvider.tsx");
