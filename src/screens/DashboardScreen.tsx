import React, { useState, useEffect } from 'react';
import { useFitPulse } from '../context/FitPulseContext';

export const DashboardScreen: React.FC = () => {
  const {
    isCheckedIn,
    activeSessionSeconds,
    entryTimeStr,
    exitTimeStr,
    toggleCheckIn,
    recordExitStamp,
    recentSessions,
    setActiveTab,
    exportTelemetryJSON,
  } = useFitPulse();

  // Realtime clock
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full px-margin-sm space-y-space-md max-w-md mx-auto">
      {/* TOP HERO: LIVE CHECK-IN COCKPIT */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-high p-space-md shadow-xl border border-surface-container-highest/40">
        {/* Ambient Neon Bloom Glows */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-primary-container/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col space-y-space-md">
          {/* Cockpit Header: Gym Geo & Live Clock */}
          <div className="flex items-center justify-between gap-space-xs">
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="material-symbols-outlined text-primary-container text-[18px] animate-pulse">
                fmd_good
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-code text-label-code text-primary-container uppercase tracking-wider truncate font-bold">
                  METROFLEX HUB • VERIFIED
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Geo-Fence: Zone A-04 (GPS Validated)
                </span>
              </div>
            </div>

            {/* Realtime System Clock */}
            <div className="flex items-center gap-space-xs bg-surface-container-lowest/90 px-space-sm py-1 rounded border border-surface-container-highest/50 flex-shrink-0">
              <span className="material-symbols-outlined text-secondary-container text-[14px]">
                schedule
              </span>
              <span className="font-metric-val text-[13px] text-secondary tracking-normal">
                {currentTimeStr || '11:45:22 PM'}
              </span>
            </div>
          </div>

          {/* Live Session State Visualizer */}
          <div className="bg-surface-container-lowest/90 rounded-lg p-space-md flex flex-col items-center justify-center relative overflow-hidden border border-surface-container-highest/60">
            <div className="w-full flex flex-col items-center space-y-space-md">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-space-xs">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isCheckedIn
                        ? 'bg-primary-container animate-ping'
                        : 'bg-on-surface-variant'
                    }`}
                  ></span>
                  <span className="font-label-code text-label-code uppercase text-on-surface tracking-widest font-semibold">
                    {isCheckedIn ? 'SESSION IN PROGRESS' : 'SESSION COMPLETED'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full border border-primary-container/20">
                  <span className="material-symbols-outlined text-primary-container text-[14px]">
                    bolt
                  </span>
                  <span className="font-label-code text-[10px] text-primary-container uppercase font-bold tracking-widest">
                    ZONE 4 ACTIVE
                  </span>
                </div>
              </div>

              {/* Pulsing Interactive Main Kinetic Action Area */}
              <div className="relative my-space-xs flex items-center justify-center">
                {/* Pulsing Rings when Checked In */}
                {isCheckedIn && (
                  <>
                    <div className="absolute w-36 h-36 rounded-full bg-primary-container/20 animate-ping pointer-events-none"></div>
                    <div className="absolute w-28 h-28 rounded-full bg-primary-container/30 blur-sm pointer-events-none"></div>
                  </>
                )}

                <button
                  onClick={toggleCheckIn}
                  className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all group ${
                    isCheckedIn
                      ? 'bg-primary-container text-on-primary-container shadow-[0_0_24px_rgba(195,244,0,0.5)]'
                      : 'bg-secondary-container text-on-secondary shadow-[0_0_24px_rgba(0,238,252,0.4)]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">
                    {isCheckedIn ? 'how_to_reg' : 'login'}
                  </span>
                  <span className="font-headline-md text-[13px] tracking-wider uppercase font-bold leading-none mt-0.5">
                    {isCheckedIn ? 'CHECK OUT' : 'CHECK IN'}
                  </span>
                </button>
              </div>

              {/* Session Active Duration Metric */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-widest">
                  ACTIVE DURATION
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-metric-val text-headline-lg-mobile text-primary tracking-tight font-bold text-[32px]">
                    {formatTimer(activeSessionSeconds)}
                  </span>
                  <span className="font-label-code text-label-code text-primary-container uppercase font-bold">
                    MINS
                  </span>
                </div>
              </div>

              {/* Exit Logging Confirmation Bar */}
              <div className="w-full pt-space-xs flex items-center justify-between text-on-surface-variant font-label-code text-[10px] border-t border-surface-container-highest/40">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-secondary-container">
                    login
                  </span>
                  ENTRY: <span className="text-on-surface font-semibold">{entryTimeStr}</span>
                </span>
                <span
                  onClick={recordExitStamp}
                  className="flex items-center gap-1 text-primary-container cursor-pointer hover:underline"
                >
                  <span className="material-symbols-outlined text-[13px]">timer</span>
                  EXIT STAMP:{' '}
                  <span className="font-bold">
                    {exitTimeStr || 'RECORD NOW'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY STATS HUD: 4 COMPACT ATHLETIC METRICS */}
      <div className="grid grid-cols-2 gap-gutter-sm">
        {/* 1. Total Attended */}
        <div className="bg-surface-container rounded-lg p-space-sm flex flex-col justify-between shadow-md relative overflow-hidden border border-surface-container-highest/40">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-[10px] uppercase text-on-surface-variant tracking-wider">
              TOTAL ATTENDED
            </span>
            <span className="material-symbols-outlined text-secondary-container text-[16px]">
              calendar_month
            </span>
          </div>
          <div className="mt-space-xs flex items-baseline gap-1">
            <span className="font-metric-val text-headline-md text-primary font-bold">18</span>
            <span className="font-label-code text-label-code text-on-surface-variant">
              / 22 DAYS
            </span>
          </div>
          <div className="mt-space-xs flex items-center gap-1 font-label-code text-[10px] text-primary-container">
            <span className="material-symbols-outlined text-[12px]">trending_up</span>
            <span>+14% vs PREV MONTH</span>
          </div>
        </div>

        {/* 2. Current Streak */}
        <div className="bg-surface-container rounded-lg p-space-sm flex flex-col justify-between shadow-md relative overflow-hidden border border-surface-container-highest/40">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-[10px] uppercase text-on-surface-variant tracking-wider">
              CURRENT STREAK
            </span>
            <span
              className="material-symbols-outlined text-tertiary-fixed-dim text-[18px] animate-bounce"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
          </div>
          <div className="mt-space-xs flex items-baseline gap-1">
            <span className="font-metric-val text-headline-md text-primary font-bold">06</span>
            <span className="font-label-code text-label-code text-tertiary-fixed-dim font-bold">
              DAYS FIRE
            </span>
          </div>
          <div className="mt-space-xs flex items-center gap-1 font-label-code text-[10px] text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
            <span>TARGET MET TODAY</span>
          </div>
        </div>

        {/* 3. Longest Streak */}
        <div className="bg-surface-container rounded-lg p-space-sm flex flex-col justify-between shadow-md relative overflow-hidden border border-surface-container-highest/40">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-[10px] uppercase text-on-surface-variant tracking-wider">
              LONGEST STREAK
            </span>
            <span className="material-symbols-outlined text-primary-container text-[16px]">
              electric_bolt
            </span>
          </div>
          <div className="mt-space-xs flex items-baseline gap-1">
            <span className="font-metric-val text-headline-md text-primary font-bold">19</span>
            <span className="font-label-code text-label-code text-on-surface-variant">
              DAYS RECORD
            </span>
          </div>
          <div className="mt-space-xs flex items-center gap-1 font-label-code text-[10px] text-secondary-container">
            <span className="material-symbols-outlined text-[12px]">verified</span>
            <span>SET IN OCT 2024</span>
          </div>
        </div>

        {/* 4. Monthly Consistency */}
        <div className="bg-surface-container rounded-lg p-space-sm flex flex-col justify-between shadow-md relative overflow-hidden border border-surface-container-highest/40">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-[10px] uppercase text-on-surface-variant tracking-wider">
              CONSISTENCY
            </span>
            <span className="material-symbols-outlined text-secondary text-[16px]">
              donut_large
            </span>
          </div>
          <div className="mt-space-xs flex items-center justify-between gap-1">
            <span className="font-metric-val text-headline-md text-primary font-bold">82%</span>
            {/* Radial Visual */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-high"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                ></path>
                <path
                  className="text-primary-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="82, 100"
                  strokeLinecap="round"
                  strokeWidth="4.5"
                ></path>
              </svg>
            </div>
          </div>
          <div className="mt-space-xs flex items-center gap-1 font-label-code text-[10px] text-on-surface-variant">
            <span>GRADE: </span>
            <span className="text-primary font-bold">OPTIMAL A+</span>
          </div>
        </div>
      </div>

      {/* MINI-STRIP HEATMAP PREVIEW: LAST 7 DAYS */}
      <div className="bg-surface-container rounded-lg p-space-md shadow-md flex flex-col space-y-space-sm border border-surface-container-highest/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[16px] text-primary-container">
              grid_view
            </span>
            <span className="font-label-code text-label-code text-on-surface uppercase tracking-wider font-bold">
              7-DAY TELEMETRY MATRIX
            </span>
          </div>
          <button
            onClick={() => setActiveTab('heatmap')}
            className="font-label-code text-[11px] text-secondary-container hover:text-primary flex items-center gap-0.5 tracking-wider uppercase group"
          >
            <span>FULL HEATMAP</span>
            <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-0.5">
              chevron_right
            </span>
          </button>
        </div>

        {/* 7 Day Micro-Blocks */}
        <div className="grid grid-cols-7 gap-1.5 pt-space-xs">
          {/* Mon: Strength */}
          <div
            onClick={() => setActiveTab('heatmap')}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-full h-8 rounded bg-primary-container/40 flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-primary-container text-[14px]">
                fitness_center
              </span>
            </div>
            <span className="font-label-code text-[9px] text-on-surface-variant uppercase">
              MON
            </span>
          </div>

          {/* Tue: Cardio */}
          <div
            onClick={() => setActiveTab('heatmap')}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-full h-8 rounded bg-secondary-container/30 flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-secondary-container text-[14px]">
                directions_run
              </span>
            </div>
            <span className="font-label-code text-[9px] text-on-surface-variant uppercase">
              TUE
            </span>
          </div>

          {/* Wed: Strength */}
          <div
            onClick={() => setActiveTab('heatmap')}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-full h-8 rounded bg-primary-container/40 flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-primary-container text-[14px]">
                fitness_center
              </span>
            </div>
            <span className="font-label-code text-[9px] text-on-surface-variant uppercase">
              WED
            </span>
          </div>

          {/* Thu: Rest */}
          <div
            onClick={() => setActiveTab('heatmap')}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-full h-8 rounded bg-surface-container-highest flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="font-label-code text-[9px] text-on-surface-variant">
                REST
              </span>
            </div>
            <span className="font-label-code text-[9px] text-on-surface-variant uppercase">
              THU
            </span>
          </div>

          {/* Fri: Peak PR */}
          <div
            onClick={() => setActiveTab('heatmap')}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-full h-8 rounded bg-primary-container flex items-center justify-center shadow-[0_0_12px_rgba(195,244,0,0.5)] transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-on-primary-container text-[15px] font-bold">
                bolt
              </span>
            </div>
            <span className="font-label-code text-[9px] text-primary-container font-bold uppercase">
              FRI
            </span>
          </div>

          {/* Sat: Cardio */}
          <div
            onClick={() => setActiveTab('heatmap')}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-full h-8 rounded bg-secondary-container/30 flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-secondary-container text-[14px]">
                directions_run
              </span>
            </div>
            <span className="font-label-code text-[9px] text-on-surface-variant uppercase">
              SAT
            </span>
          </div>

          {/* Today: Peak Strength (Live Glow) */}
          <div
            onClick={() => setActiveTab('log')}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-full h-8 rounded bg-primary-container/90 flex items-center justify-center shadow-[0_0_14px_rgba(195,244,0,0.7)] transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-on-primary-container text-[16px] animate-pulse">
                fitness_center
              </span>
            </div>
            <span className="font-label-code text-[9px] text-primary font-bold uppercase">
              TODAY
            </span>
          </div>
        </div>

        {/* Micro Legend */}
        <div className="flex items-center justify-between pt-space-xs text-[9px] font-label-code text-on-surface-variant border-t border-surface-container-highest/30">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-surface-container-highest"></span>
            <span>REST</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary-container/50"></span>
            <span>CARDIO</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-container/50"></span>
            <span>STRENGTH</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_6px_rgba(195,244,0,0.8)]"></span>
            <span className="text-primary-container font-bold">PEAK PR</span>
          </div>
        </div>
      </div>

      {/* ATHLETIC ACTIVITY FEED */}
      <div className="flex flex-col space-y-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-headline-md text-headline-md tracking-wider uppercase text-primary">
            SESSION LOGBOOK
          </span>
          <span className="font-label-code text-[11px] text-on-surface-variant uppercase">
            LATEST INGESTIONS
          </span>
        </div>

        {/* Feed Items */}
        <div className="space-y-space-xs">
          {recentSessions.map(session => (
            <div
              key={session.id}
              onClick={() => setActiveTab('log')}
              className="bg-surface-container rounded-lg p-space-sm flex items-center justify-between shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer border border-surface-container-highest/40"
            >
              <div className="flex items-center gap-space-sm min-w-0">
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
                    session.intensity === 3
                      ? 'bg-primary-container/20 text-primary-container'
                      : session.type === 'cardio'
                      ? 'bg-surface-container-highest text-secondary'
                      : 'bg-surface-container-highest text-secondary-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {session.type === 'cardio'
                      ? 'directions_run'
                      : session.intensity === 3
                      ? 'bolt'
                      : 'fitness_center'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-title-sm text-[15px] text-primary truncate font-bold">
                      {session.title}
                    </span>
                    {session.intensity === 3 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-code text-[9px] font-bold">
                        PR 180KG
                      </span>
                    )}
                    {session.intensity === 2 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-surface-container-highest text-secondary-container font-label-code text-[9px] uppercase font-bold">
                        STRENGTH
                      </span>
                    )}
                    {session.type === 'cardio' && (
                      <span className="px-1.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary-container font-label-code text-[9px] uppercase font-bold">
                        CARDIO
                      </span>
                    )}
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {session.notes || `${session.exercises.length} Exercises • ${session.durationMinutes} mins`}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end flex-shrink-0 pl-2">
                <span className="font-label-code text-[11px] text-primary-container font-bold uppercase">
                  {session.timestamp.includes('Today') ? 'TODAY' : session.timestamp.split('•')[0].trim()}
                </span>
                <span className="font-label-code text-[10px] text-on-surface-variant">
                  {session.timestamp.includes('•') ? session.timestamp.split('•')[1]?.trim() : 'LOGGED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOCAL STORAGE SYNC & DATA EXPORT TELEMETRY BAR */}
      <div className="bg-surface-container-lowest rounded-lg p-space-sm flex items-center justify-between text-on-surface-variant shadow-inner border border-surface-container-highest/40 mb-6">
        <div className="flex items-center gap-space-xs min-w-0">
          <span className="material-symbols-outlined text-primary-container text-[18px]">
            database
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-label-code text-[11px] text-primary tracking-wide truncate font-semibold">
              LOCAL STATE SYNCED
            </span>
            <span className="font-label-code text-[10px] text-on-surface-variant">
              24 sessions cached in IndexedDB
            </span>
          </div>
        </div>
        <button
          onClick={exportTelemetryJSON}
          className="h-8 px-space-sm rounded bg-surface-container hover:bg-surface-container-high active:scale-95 transition-all flex items-center gap-1.5 text-secondary-container font-label-code text-[10px] uppercase tracking-wider border border-surface-container-highest"
        >
          <span className="material-symbols-outlined text-[15px]">file_download</span>
          <span>EXPORT JSON</span>
        </button>
      </div>
    </div>
  );
};
