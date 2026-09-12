import re

with open('src/types.ts', 'r') as f:
    content = f.read()

# We will append the new types at the end of the file.

new_types = """
export type AnxietyPattern = 'body' | 'worry' | 'mixed' | null;

export type OutcomeType =
  | 'arousal'
  | 'thought-believability'
  | 'tolerance'
  | 'pattern'
  | 'expectancy'
  | 'urge'
  | 'choice';

export type DayRoute = 'universal' | 'body' | 'worry' | 'final';

export interface ProtocolStep {
  id: string;
  type: 'intro' | 'oneTapChoice' | 'slider' | 'mechanic' | 'timedObservation' | 'reflection' | 'realWorldTask' | 'outcome' | 'finish';
  title?: string;
  subtitle?: string;
  mechanicConfig?: any;
  options?: { id: string; label: string }[];
  duration?: number; // for timed Observation or mechanic
  // specific logic fields
  saveToProfile?: 'primaryFear' | 'primaryBodySensation' | 'commonSafetyBehavior' | 'commonWorryBehavior';
}

export interface DayConfig {
  day: number;
  title: string;
  route: DayRoute;
  objective: string;
  outcomeType: OutcomeType;
  steps: ProtocolStep[];
}

export interface CourseProfile {
  anxietyPattern: AnxietyPattern;
  patternScores: {
    body: number;
    worry: number;
  };
  primaryFear?: string;
  primaryBodySensation?: string;
  commonSafetyBehavior?: string;
  commonWorryBehavior?: string;
  exposureSafety?: {
    completed: boolean;
    eligibleForPhysicalExposure: boolean;
  };
  mechanicExperience: {
    regulation: boolean;
    orientation: boolean;
    defusion: boolean;
    somaticObserve: boolean;
    attentionTraining: boolean;
  };
  worryWindow?: string;
}
"""

if "AnxietyPattern" not in content:
    content += "\n" + new_types

# Extend PracticeSession
if "thoughtBelievabilityBefore?:" not in content:
    content = content.replace(
        "isSOS?: boolean; // Keep track if it was an SOS session",
        """isSOS?: boolean; // Keep track if it was an SOS session
  // New Course fields
  route?: DayRoute;
  outcomeType?: OutcomeType;
  thoughtBelievabilityBefore?: number;
  thoughtBelievabilityAfter?: number;
  expectancy?: number;
  actualOutcome?: string;
  urgeBefore?: number;
  urgeAfter?: number;
  toleranceDuration?: number;
  choice?: string;"""
    )

if "courseProfile?:" not in content:
    content = content.replace(
        "courseProgress: CourseProgress;",
        "courseProgress: CourseProgress;\n  courseProfile?: CourseProfile;"
    )

with open('src/types.ts', 'w') as f:
    f.write(content)

print("Updated types.ts")
