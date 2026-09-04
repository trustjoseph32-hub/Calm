export type PracticeType = 'breathing' | 'bilateral' | 'combined' | 'grounding' | 'course' | 'synchronized';

export interface PracticeSession {
  sessionId: string;
  date: string;
  practiceType: PracticeType;
  duration: number; // in seconds
  anxietyBefore?: number;
  anxietyAfter?: number;
  anxietyDelta?: number;
  breathingPattern?: string; // e.g. "4-6"
  bilateralSpeed?: 'slow' | 'medium' | 'fast';
  soundMode?: string;
  completed: boolean;
  stoppedEarly: boolean;
  discomfortTriggered: boolean;
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
  reducedMotion: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Synchronized practice settings
  syncInhaleDuration: number;
  syncExhaleDuration: number;
  syncBilateralAudio: boolean;
  syncVolume: number;
  syncOrbSize: 'small' | 'medium' | 'large';
  syncVisualAmplitude: 'narrow' | 'normal' | 'wide';
  syncReducedMotion: boolean;
  syncShowText: boolean;
  syncBreathingCircle: boolean;
  syncBackgroundNoise: 'none' | 'wind' | 'rain' | 'sea';
}

export interface CourseProgress {
  currentDay: number;
  completedDays: number[];
  completedFocusDays?: number[];
  lastCompletedDate?: string;
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
