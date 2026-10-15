export type TabType = 'dashboard' | 'heatmap' | 'log' | 'portfolio';

export type WorkoutType = 'all' | 'strength' | 'cardio' | 'rest' | 'missed';

export interface ExerciseSet {
  setNum: number;
  weight: number;
  reps: number;
  isPR?: boolean;
}

export interface ExerciseItem {
  id: string;
  name: string;
  setsCount: number;
  summaryText?: string;
  sets: ExerciseSet[];
}

export interface SessionRecord {
  id: string;
  date: string;
  title: string;
  type: 'strength' | 'cardio' | 'rest' | 'missed';
  intensity: 0 | 1 | 2 | 3; // 0: rest/missed, 1: cardio, 2: strength, 3: peak PR
  durationMinutes: number;
  volumeKg: number;
  exercises: ExerciseItem[];
  energyRating: number;
  notes: string;
  sleepHours: number;
  caffeineMg: number;
  targetTags: string[];
  peakHR?: number;
  prCount?: number;
  restPacingSec?: number;
  timestamp: string;
}

export interface DayMatrixItem {
  day: number;
  dateStr: string;
  type: 'strength' | 'cardio' | 'rest' | 'missed';
  intensity: 0 | 1 | 2 | 3;
  summary: string;
  isPR?: boolean;
  peakHR?: number;
  prCount?: number;
  restPacingSec?: number;
  volumeKg?: number;
  durationMinutes?: number;
  exercisesCount?: number;
  rpe?: number;
}

export interface WeightDataPoint {
  week: string;
  value: number;
}

export interface WeightProgressionConfig {
  metric: 'bodyweight' | 'bench' | 'squat' | 'deadlift';
  label: string;
  unit: string;
  starting: number;
  current: number;
  target: number;
  gain: number;
  pace: number;
  percentNet: number;
  points: WeightDataPoint[];
}

export interface ToastMessage {
  id: string;
  title: string;
  subtitle: string;
  statusBadge?: string;
  icon?: string;
}
