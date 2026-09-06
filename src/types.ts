export type PracticeType = 'breathing' | 'bilateral' | 'combined' | 'grounding' | 'course' | 'synchronized';

export type SessionStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'interrupted' | 'switched_to_grounding' | 'closed_safely';

export interface PracticeSession {
  sessionId: string;
  date: string;
  endTime?: string;
  practiceType: PracticeType;
  duration: number; // in seconds
  anxietyBefore?: number;
  anxietyAfter?: number;
  anxietyDelta?: number;
  breathingPattern?: string;
  bilateralSpeed?: 'slow' | 'medium' | 'fast';
  
  // New specific fields
  status: SessionStatus;
  completedRounds: number;
  roundAnswers: ('easier' | 'same' | 'harder')[];
  usedGrounding: boolean;
  interruptionReason?: string;
  reducedMotion: boolean;
  validForOutcomeStats: boolean;
  schemaVersion: number;
  isSOS?: boolean; // Keep track if it was an SOS session
  courseDay?: number; // Keep track if it was a course day

  // Legacy/other fields
  soundMode?: string;
  completed?: boolean;
  stoppedEarly?: boolean;
  discomfortTriggered?: boolean;
  optionalNote?: string;
  inhaleDuration?: number;
  exhaleDuration?: number;
  bilateralAudioEnabled?: boolean;
  volume?: number;
  feedback?: string[];
}

export interface AppSettings {
  bilateralSpeed: 'slow' | 'medium' | 'fast';
  bilateralAmplitude: 'narrow' | 'normal' | 'wide';
  breathingIn: number;
  breathingOut: number;
  soundMode: 'none' | 'breathing' | 'bilateral';
  hapticFeedback: boolean;
  showText: boolean;
  reducedMotion: boolean; // Main toggle for reduced motion across the app
  theme: 'light' | 'dark' | 'system';
  
  // Synchronized practice settings
  syncInhaleDuration: number;
  syncExhaleDuration: number;
  syncBilateralAudio: boolean;
  syncBilateralVolume: number; // NEW
  syncAmbientSound: 'none' | 'wind' | 'rain' | 'sea'; // NEW
  syncVolume: number; // General volume (can be used for ambient)
  syncOrbSize: 'small' | 'medium' | 'large';
  syncVisualAmplitude: 'narrow' | 'normal' | 'wide';
  syncReducedMotion: boolean;
  syncShowText: boolean;
  syncBreathingCircle: boolean;
  syncBackgroundNoise?: 'none' | 'wind' | 'rain' | 'sea'; // Legacy
}

export interface CourseProgress {
  currentDay: number;
  completedDays: number[];
  completedFocusDays?: number[];
  lastCompletedDate?: string;
  // State of the current day to allow pausing and resuming
  todayState?: {
    practiceStatus: 'not_started' | 'started' | 'completed' | 'stopped';
    checkinCompleted: boolean;
    eveningCheckinCompleted: boolean;
  };
}

export interface DailyCheckin {
  date: string;
  anxiety: number;
  physical: number;
  emotional: number;
  thoughts: number;
}

export interface AppState {
  hasCompletedOnboarding: boolean;
  settings: AppSettings;
  sessions: PracticeSession[];
  courseProgress: CourseProgress;
  checkins: DailyCheckin[];
}
