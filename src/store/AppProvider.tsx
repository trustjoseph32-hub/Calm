import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, AppSettings, PracticeSession } from '../types';

const defaultSettings: AppSettings = {
  bilateralSpeed: 'medium',
  bilateralAmplitude: 'normal',
  breathingIn: 4,
  breathingOut: 4,
  soundMode: 'none',
  hapticFeedback: false,
  showText: true,
  reducedMotion: false,
  theme: 'system',
  
  syncInhaleDuration: 4,
  syncExhaleDuration: 4,
  syncBilateralAudio: false,
  syncVolume: 25,
  syncOrbSize: 'medium',
  syncVisualAmplitude: 'normal',
  syncReducedMotion: false,
  syncShowText: true,
  syncBreathingCircle: true,
  syncAmbientSound: 'none',
  syncBilateralVolume: 0.5,
};

const initialState: AppState = {
  hasCompletedOnboarding: false,
  settings: defaultSettings,
  sessions: [],
  courseProgress: {
    currentDay: 1,
    completedDays: [],
    completedFocusDays: [],
  },
  checkins: [],
};

interface AppContextType extends AppState {
  completeOnboarding: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addSession: (session: PracticeSession) => void;
  clearHistory: () => void;
  markCourseDayCompleted: (day: number) => void;
  toggleCourseFocusDay: (day: number) => void;
  skipWaitTime: () => void;
  saveCheckin: (checkin: import('../types').DailyCheckin) => void;
  updateCourseTodayState: (updates: Partial<NonNullable<import('../types').CourseProgress['todayState']>>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'panicClubStateV2';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

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
        };
      } catch (e) {
        console.error('Failed to parse state from localStorage', e);
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const completeOnboarding = () => {
    setState((prev) => ({ ...prev, hasCompletedOnboarding: true }));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const addSession = (session: PracticeSession) => {
    setState((prev) => ({
      ...prev,
      sessions: [...prev.sessions, session],
    }));
  };

  const clearHistory = () => {
    setState((prev) => ({
      ...prev,
      sessions: [],
      courseProgress: { currentDay: 1, completedDays: [], completedFocusDays: [] },
    }));
  };

  const toggleCourseFocusDay = (day: number) => {
    setState((prev) => {
      const focusDays = prev.courseProgress.completedFocusDays || [];
      const newFocusDays = focusDays.includes(day)
        ? focusDays.filter((d) => d !== day)
        : [...focusDays, day];
      return {
        ...prev,
        courseProgress: {
          ...prev.courseProgress,
          completedFocusDays: newFocusDays,
        },
      };
    });
  };

  const markCourseDayCompleted = (day: number) => {
    setState((prev) => {
      const newCompleted = Array.from(new Set([...prev.courseProgress.completedDays, day]));
      const nextDay = Math.max(prev.courseProgress.currentDay, day + 1);
      return {
        ...prev,
        courseProgress: {
          ...prev.courseProgress,
          completedDays: newCompleted,
          currentDay: nextDay > 14 ? 14 : nextDay,
          lastCompletedDate: new Date().toISOString(),
        },
      };
    });
  };

  const skipWaitTime = () => {
    setState((prev) => {
      // Set lastCompletedDate to yesterday to simulate a day passing
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        ...prev,
        courseProgress: {
          ...prev.courseProgress,
          lastCompletedDate: yesterday.toISOString(),
        },
      };
    });
  };

  const saveCheckin = (checkin: import('../types').DailyCheckin) => {
    setState((prev) => ({
      ...prev,
      checkins: [...(prev.checkins || []), checkin],
    }));
  };

  const updateCourseTodayState = (updates: Partial<NonNullable<import('../types').CourseProgress['todayState']>>) => {
    setState((prev) => ({
      ...prev,
      courseProgress: {
        ...prev.courseProgress,
        todayState: {
          ...(prev.courseProgress.todayState || {
            practiceStatus: 'not_started',
            checkinCompleted: false,
            eveningCheckinCompleted: false
          }),
          ...updates
        }
      }
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        completeOnboarding,
        updateSettings,
        addSession,
        clearHistory,
        markCourseDayCompleted,
        toggleCourseFocusDay,
        skipWaitTime,
        saveCheckin,
        updateCourseTodayState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
