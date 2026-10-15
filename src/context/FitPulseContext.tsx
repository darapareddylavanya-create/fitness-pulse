import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TabType,
  DayMatrixItem,
  SessionRecord,
  ExerciseItem,
  ToastMessage,
} from '../types';
import {
  INITIAL_DAY_MATRIX,
  INITIAL_RECENT_SESSIONS,
  INITIAL_LOGGED_EXERCISES,
} from '../data/initialData';

interface FitPulseContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Cockpit Check-In State
  isCheckedIn: boolean;
  activeSessionSeconds: number;
  entryTimeStr: string;
  exitTimeStr: string | null;
  toggleCheckIn: () => void;
  recordExitStamp: () => void;

  // Matrix and Sessions
  attendanceMatrix: DayMatrixItem[];
  recentSessions: SessionRecord[];
  activePreviewDay: DayMatrixItem;
  setActivePreviewDay: (day: DayMatrixItem) => void;

  // Logging Form State
  logDate: string;
  setLogDate: (date: string) => void;
  logDuration: number;
  setLogDuration: (d: number | ((prev: number) => number)) => void;
  logEnergyRating: number;
  setLogEnergyRating: (r: number) => void;
  logTargetTags: string[];
  toggleTargetTag: (tag: string) => void;
  logExercises: ExerciseItem[];
  addExercise: (exercise: ExerciseItem) => void;
  removeExercise: (id: string) => void;
  appendSetToFirstExercise: () => void;
  logNotes: string;
  setLogNotes: (notes: string) => void;
  logSleep: number;
  setLogSleep: (s: number) => void;
  logCaffeine: number;
  setLogCaffeine: (c: number) => void;
  saveCurrentLogToGrid: () => void;
  discardCurrentLog: () => void;

  // Calculated Volume Payload
  totalLoggedVolume: number;

  // Telemetry JSON Sync
  isJsonModalOpen: boolean;
  setIsJsonModalOpen: (open: boolean) => void;
  exportTelemetryJSON: () => void;
  importTelemetryJSON: (jsonString: string) => boolean;
  resetAllCache: () => void;

  // Toast
  toast: ToastMessage | null;
  showToast: (msg: { title: string; subtitle: string; statusBadge?: string; icon?: string }) => void;
}

const FitPulseContext = createContext<FitPulseContextType | undefined>(undefined);

const STORAGE_KEY = 'fitpulse_telemetry_state_v2';

export const FitPulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Check-In Cockpit State
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(true);
  const [activeSessionSeconds, setActiveSessionSeconds] = useState<number>(48 * 60 + 27);
  const [entryTimeStr] = useState<string>('05:54 PM');
  const [exitTimeStr, setExitTimeStr] = useState<string | null>(null);

  // Core Data
  const [attendanceMatrix, setAttendanceMatrix] = useState<DayMatrixItem[]>(INITIAL_DAY_MATRIX);
  const [recentSessions, setRecentSessions] = useState<SessionRecord[]>(INITIAL_RECENT_SESSIONS);
  const [activePreviewDay, setActivePreviewDay] = useState<DayMatrixItem>(
    INITIAL_DAY_MATRIX.find(d => d.day === 18) || INITIAL_DAY_MATRIX[0]
  );

  // Log Workout Form
  const [logDate, setLogDate] = useState<string>('Today, Oct 24, 2024');
  const [logDuration, setLogDuration] = useState<number>(65);
  const [logEnergyRating, setLogEnergyRating] = useState<number>(4);
  const [logTargetTags, setLogTargetTags] = useState<string[]>([
    'Push - Chest & Triceps',
    'Legs - Quads & Hamstrings',
  ]);
  const [logExercises, setLogExercises] = useState<ExerciseItem[]>(INITIAL_LOGGED_EXERCISES);
  const [logNotes, setLogNotes] = useState<string>(
    'Felt strong on squats today, knee felt great with sleeves. Good sleep 8hrs, pre-workout kicked in fast.'
  );
  const [logSleep, setLogSleep] = useState<number>(8.0);
  const [logCaffeine, setLogCaffeine] = useState<number>(300);

  // Modals & Notifications
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Load from LocalStorage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.attendanceMatrix) setAttendanceMatrix(parsed.attendanceMatrix);
        if (parsed.recentSessions) setRecentSessions(parsed.recentSessions);
        if (typeof parsed.isCheckedIn === 'boolean') setIsCheckedIn(parsed.isCheckedIn);
        if (parsed.activeSessionSeconds) setActiveSessionSeconds(parsed.activeSessionSeconds);
        if (parsed.exitTimeStr) setExitTimeStr(parsed.exitTimeStr);
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  // Save changes to LocalStorage
  const saveToStorage = (updatedMatrix: DayMatrixItem[], updatedSessions: SessionRecord[]) => {
    try {
      const payload = {
        attendanceMatrix: updatedMatrix,
        recentSessions: updatedSessions,
        isCheckedIn,
        activeSessionSeconds,
        exitTimeStr,
        version: '2.4.0',
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // silent fail
    }
  };

  // Cockpit Clock / Timer Loop
  useEffect(() => {
    const timer = setInterval(() => {
      if (isCheckedIn) {
        setActiveSessionSeconds(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isCheckedIn]);

  const toggleCheckIn = () => {
    if (isCheckedIn) {
      // Checking out
      setIsCheckedIn(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setExitTimeStr(`${timeStr} (LOGGED)`);
      showToast({
        title: 'SESSION CONCLUDED',
        subtitle: `Check-out recorded at ${timeStr}. Active duration captured.`,
        statusBadge: 'LOGGED',
        icon: 'check_circle',
      });
    } else {
      // Checking in
      setIsCheckedIn(true);
      setExitTimeStr(null);
      showToast({
        title: 'SESSION INITIATED',
        subtitle: 'Geo-fence verified at MetroFlex Hub Zone A-04.',
        statusBadge: 'ACTIVE',
        icon: 'bolt',
      });
    }
  };

  const recordExitStamp = () => {
    if (isCheckedIn) {
      toggleCheckIn();
    } else {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setExitTimeStr(`${timeStr} (LOGGED)`);
    }
  };

  const toggleTargetTag = (tag: string) => {
    setLogTargetTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addExercise = (exercise: ExerciseItem) => {
    setLogExercises(prev => [...prev, exercise]);
  };

  const removeExercise = (id: string) => {
    setLogExercises(prev => prev.filter(e => e.id !== id));
  };

  const appendSetToFirstExercise = () => {
    if (logExercises.length === 0) return;
    setLogExercises(prev => {
      const first = prev[0];
      const lastSet = first.sets[first.sets.length - 1] || { weight: 100, reps: 8 };
      const newSet = {
        setNum: first.sets.length + 1,
        weight: lastSet.weight,
        reps: lastSet.reps,
      };
      const updatedFirst: ExerciseItem = {
        ...first,
        setsCount: first.sets.length + 1,
        sets: [...first.sets, newSet],
      };
      return [updatedFirst, ...prev.slice(1)];
    });
    showToast({
      title: 'SET APPENDED',
      subtitle: `Added Set to ${logExercises[0].name}.`,
      statusBadge: '+1 SET',
      icon: 'add_circle',
    });
  };

  // Calculate total volume
  const totalLoggedVolume = logExercises.reduce((acc, ex) => {
    return (
      acc +
      ex.sets.reduce((sAcc, s) => {
        return sAcc + s.weight * s.reps;
      }, 0)
    );
  }, 0) || 14250;

  const saveCurrentLogToGrid = () => {
    const todayNum = 24; // October 24
    const newSession: SessionRecord = {
      id: `S-${Date.now().toString().slice(-4)}`,
      date: '2024-10-24',
      title: logExercises[0]?.name ? `${logExercises[0].name} Focus` : 'Hypertrophy Session',
      type: 'strength',
      intensity: 3,
      durationMinutes: logDuration,
      volumeKg: totalLoggedVolume,
      energyRating: logEnergyRating,
      notes: logNotes,
      sleepHours: logSleep,
      caffeineMg: logCaffeine,
      targetTags: logTargetTags,
      peakHR: 178,
      prCount: 2,
      restPacingSec: 85,
      timestamp: 'Today • Just Now',
      exercises: logExercises,
    };

    // Update Recent Sessions
    const updatedSessions = [newSession, ...recentSessions];
    setRecentSessions(updatedSessions);

    // Update Attendance Matrix for day 24
    const updatedMatrix = attendanceMatrix.map(item => {
      if (item.day === todayNum) {
        return {
          ...item,
          intensity: 3 as const,
          type: 'strength' as const,
          isPR: true,
          durationMinutes: logDuration,
          volumeKg: totalLoggedVolume,
          summary: `Oct ${todayNum} • Heavy Hypertrophy • ${logDuration} mins • ${logExercises.length} Exercises • RPE 9.0`,
        };
      }
      return item;
    });

    setAttendanceMatrix(updatedMatrix);
    saveToStorage(updatedMatrix, updatedSessions);

    // Trigger visual toast
    showToast({
      title: 'TELEMETRY SYNCED',
      subtitle: 'Session stored in local storage & grid updated.',
      statusBadge: '200 OK',
      icon: 'cloud_done',
    });
  };

  const discardCurrentLog = () => {
    setLogNotes('');
    showToast({
      title: 'LOG DISCARDED',
      subtitle: 'Current uncommitted draft cleared.',
      statusBadge: 'CLEARED',
      icon: 'delete_sweep',
    });
  };

  const showToast = (msg: { title: string; subtitle: string; statusBadge?: string; icon?: string }) => {
    const id = Date.now().toString();
    setToast({
      id,
      title: msg.title,
      subtitle: msg.subtitle,
      statusBadge: msg.statusBadge || 'SUCCESS',
      icon: msg.icon || 'check_circle',
    });
    setTimeout(() => {
      setToast(curr => (curr?.id === id ? null : curr));
    }, 3500);
  };

  const exportTelemetryJSON = () => {
    const exportBundle = {
      version: '2.4.0',
      athlete: 'Alex Vance',
      last_checkin: new Date().toISOString(),
      streak_current: 6,
      longest_streak: 19,
      consistency_rate: 0.82,
      total_attended: 18,
      active_session_seconds: activeSessionSeconds,
      sessions: recentSessions,
      matrix: attendanceMatrix,
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitpulse-telemetry-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({
      title: 'TELEMETRY EXPORTED',
      subtitle: 'fitpulse_backup.json generated successfully.',
      statusBadge: 'DOWNLOADED',
      icon: 'file_download',
    });
  };

  const importTelemetryJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid JSON format');
      }

      if (data.matrix && Array.isArray(data.matrix)) {
        setAttendanceMatrix(data.matrix);
      }
      if (data.sessions && Array.isArray(data.sessions)) {
        setRecentSessions(data.sessions);
      }
      if (data.active_session_seconds) {
        setActiveSessionSeconds(data.active_session_seconds);
      }

      showToast({
        title: 'SCHEMA INGESTED',
        subtitle: `Imported ${data.sessions?.length || 0} sessions and matrix state.`,
        statusBadge: 'INGESTED',
        icon: 'cloud_upload',
      });
      return true;
    } catch {
      showToast({
        title: 'IMPORT REJECTED',
        subtitle: 'JSON failed schema verification or syntax check.',
        statusBadge: 'ERROR',
        icon: 'error',
      });
      return false;
    }
  };

  const resetAllCache = () => {
    setAttendanceMatrix(INITIAL_DAY_MATRIX);
    setRecentSessions(INITIAL_RECENT_SESSIONS);
    setLogExercises(INITIAL_LOGGED_EXERCISES);
    setActiveSessionSeconds(48 * 60 + 24);
    setIsCheckedIn(true);
    setExitTimeStr(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast({
      title: 'CACHE RESET',
      subtitle: 'Restored zero-state telemetry and local storage cache.',
      statusBadge: 'RESET',
      icon: 'device_reset',
    });
  };

  return (
    <FitPulseContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isCheckedIn,
        activeSessionSeconds,
        entryTimeStr,
        exitTimeStr,
        toggleCheckIn,
        recordExitStamp,
        attendanceMatrix,
        recentSessions,
        activePreviewDay,
        setActivePreviewDay,
        logDate,
        setLogDate,
        logDuration,
        setLogDuration,
        logEnergyRating,
        setLogEnergyRating,
        logTargetTags,
        toggleTargetTag,
        logExercises,
        addExercise,
        removeExercise,
        appendSetToFirstExercise,
        logNotes,
        setLogNotes,
        logSleep,
        setLogSleep,
        logCaffeine,
        setLogCaffeine,
        saveCurrentLogToGrid,
        discardCurrentLog,
        totalLoggedVolume,
        isJsonModalOpen,
        setIsJsonModalOpen,
        exportTelemetryJSON,
        importTelemetryJSON,
        resetAllCache,
        toast,
        showToast,
      }}
    >
      {children}
    </FitPulseContext.Provider>
  );
};

export const useFitPulse = () => {
  const context = useContext(FitPulseContext);
  if (!context) {
    throw new Error('useFitPulse must be used within a FitPulseProvider');
  }
  return context;
};
