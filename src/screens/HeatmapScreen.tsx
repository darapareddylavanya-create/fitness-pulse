import React, { useState } from 'react';
import { useFitPulse } from '../context/FitPulseContext';
import { DayMatrixItem, WorkoutType } from '../types';
import { WEIGHT_PROGRESSION_DATA } from '../data/initialData';

export const HeatmapScreen: React.FC = () => {
  const { attendanceMatrix, activePreviewDay, setActivePreviewDay } = useFitPulse();

  const [activeFilter, setActiveFilter] = useState<WorkoutType>('all');
  const [selectedMetric, setSelectedMetric] = useState<'bodyweight' | 'bench' | 'squat' | 'deadlift'>('bodyweight');

  const filterOptions: Array<{ id: WorkoutType; label: string }> = [
    { id: 'all', label: 'All Workouts' },
    { id: 'strength', label: 'Strength' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'rest', label: 'Rest Days' },
    { id: 'missed', label: 'Missed' },
  ];

  const progression = WEIGHT_PROGRESSION_DATA[selectedMetric] || WEIGHT_PROGRESSION_DATA.bodyweight;

  // Active workout count
  const activeCount = attendanceMatrix.filter(d => d.type === 'strength' || d.type === 'cardio').length;

  const handleCellClick = (item: DayMatrixItem) => {
    setActivePreviewDay(item);
  };

  // Helper to determine intensity badge
  const getIntensityBadge = (intensity: number, type: string) => {
    if (type === 'missed') {
      return { tag: 'MISSED SESSION', colorClass: 'text-error font-bold' };
    }
    if (intensity === 3) {
      return { tag: 'PEAK INTENSITY PR', colorClass: 'text-primary-container font-bold' };
    }
    if (intensity === 2) {
      return { tag: 'STRENGTH LOAD', colorClass: 'text-secondary-container font-bold' };
    }
    if (intensity === 1) {
      return { tag: 'AEROBIC CADENCE', colorClass: 'text-secondary font-bold' };
    }
    return { tag: 'REST / DELOAD', colorClass: 'text-outline font-bold' };
  };

  const previewBadge = getIntensityBadge(activePreviewDay.intensity, activePreviewDay.type);

  // Compute SVG Path points for progression chart
  const points = progression.points;
  const minVal = Math.min(...points.map(p => p.value)) * 0.98;
  const maxVal = Math.max(...points.map(p => p.value), progression.target) * 1.02;
  const range = maxVal - minVal || 1;

  // Map 8 points along X (18 to 345) and Y (115 down to 36)
  const svgCoords = points.map((p, idx) => {
    const x = 18 + (idx / (points.length - 1)) * (345 - 18);
    const y = 118 - ((p.value - minVal) / range) * (118 - 32);
    return { x, y, ...p };
  });

  const linePathD = svgCoords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x},${curr.y}`;
    const prev = svgCoords[idx - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
  }, '');

  const areaPathD = `${linePathD} L ${svgCoords[svgCoords.length - 1].x},120 L ${svgCoords[0].x},120 Z`;

  return (
    <div className="flex flex-col w-full px-margin-sm gap-space-md max-w-md mx-auto pb-12">
      {/* Month Selector & Cadence Telemetry */}
      <div className="flex flex-col gap-space-xs mt-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <button
              aria-label="Previous month"
              className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface hover:text-primary active:scale-95 transition-all border border-surface-container-highest/40"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <div className="flex flex-col">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-wide uppercase leading-none">
                OCTOBER 2024
              </span>
              <span className="font-label-code text-label-code text-primary-container tracking-widest uppercase font-semibold">
                CYCLE 10 // HYBRID SPLIT
              </span>
            </div>
            <button
              aria-label="Next month"
              className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface hover:text-primary active:scale-95 transition-all border border-surface-container-highest/40"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-high px-space-sm py-1 rounded-full shadow-sm border border-primary-container/30">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-label-code text-label-code text-primary-container font-bold">
              {activeCount} / 31 ACTIVE
            </span>
          </div>
        </div>

        {/* Filter Pills (Scrollable Row) */}
        <div className="flex items-center gap-space-xs overflow-x-auto py-1 no-scrollbar -mx-margin-sm px-margin-sm">
          {filterOptions.map(f => {
            const isSelected = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`h-7 px-space-sm rounded-full font-label-code text-label-code uppercase tracking-wider flex-shrink-0 transition-all ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(195,244,0,0.35)]'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface border border-surface-container-highest/50'
                }`}
                type="button"
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Heatmap Canvas Container */}
      <div className="flex flex-col bg-surface-container rounded-xl p-space-md shadow-xl relative overflow-hidden border border-surface-container-highest/50">
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center justify-between pb-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-md text-headline-md uppercase text-primary font-bold">
              ATTENDANCE MATRIX
            </span>
            <span className="material-symbols-outlined text-secondary-container text-[18px]">
              bolt
            </span>
          </div>
          <div className="font-label-code text-label-code text-on-surface-variant font-semibold">
            74.2% FREQ
          </div>
        </div>

        {/* Calendar Day-of-Week Bar */}
        <div className="grid grid-cols-7 gap-space-xs mb-space-xs text-center">
          <span className="font-label-code text-label-code text-on-surface-variant uppercase">M</span>
          <span className="font-label-code text-label-code text-on-surface-variant uppercase">T</span>
          <span className="font-label-code text-label-code text-on-surface-variant uppercase">W</span>
          <span className="font-label-code text-label-code text-on-surface-variant uppercase">T</span>
          <span className="font-label-code text-label-code text-on-surface-variant uppercase">F</span>
          <span className="font-label-code text-label-code text-primary-container/70 uppercase font-bold">S</span>
          <span className="font-label-code text-label-code text-primary-container/70 uppercase font-bold">S</span>
        </div>

        {/* Interactive Calendar Grid */}
        <div className="grid grid-cols-7 gap-space-xs">
          {/* Prior Month Offset (Mon prior placeholder 30) */}
          <div className="aspect-square rounded bg-surface-container-lowest/40 opacity-30 flex items-center justify-center pointer-events-none border border-surface-container-highest/20">
            <span className="font-label-code text-label-code text-on-surface-variant">30</span>
          </div>

          {/* Days 1 to 31 */}
          {attendanceMatrix.map(cell => {
            const isMatch = activeFilter === 'all' || cell.type === activeFilter;
            const isSelected = activePreviewDay.day === cell.day;

            let bgStyle = 'bg-surface-container-lowest text-on-surface-variant/40';
            let dotEl = null;

            if (cell.type === 'missed') {
              bgStyle = 'bg-surface-container-lowest text-error/70';
              dotEl = (
                <span className="material-symbols-outlined text-[10px] text-error absolute bottom-0.5">
                  close
                </span>
              );
            } else if (cell.intensity === 3) {
              bgStyle =
                'bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(195,244,0,0.5)]';
              dotEl = (
                <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest absolute bottom-1"></span>
              );
            } else if (cell.intensity === 2) {
              bgStyle = 'bg-surface-tint/60 text-surface-container-lowest font-medium';
            } else if (cell.intensity === 1) {
              bgStyle = 'bg-surface-variant text-on-surface-variant';
            }

            return (
              <button
                key={cell.day}
                onClick={() => handleCellClick(cell)}
                className={`aspect-square rounded font-label-code text-label-code flex flex-col items-center justify-center relative active:scale-90 transition-all ${bgStyle} ${
                  isSelected ? 'ring-2 ring-primary-container scale-105 z-10' : ''
                } ${!isMatch ? 'opacity-15 grayscale' : 'opacity-100'}`}
                type="button"
              >
                <span>{String(cell.day).padStart(2, '0')}</span>
                {dotEl}
              </button>
            );
          })}

          {/* Next Month Placeholders */}
          <div className="aspect-square rounded bg-surface-container-lowest/40 opacity-30 flex items-center justify-center pointer-events-none">
            <span className="font-label-code text-label-code text-on-surface-variant">01</span>
          </div>
          <div className="aspect-square rounded bg-surface-container-lowest/40 opacity-30 flex items-center justify-center pointer-events-none">
            <span className="font-label-code text-label-code text-on-surface-variant">02</span>
          </div>
          <div className="aspect-square rounded bg-surface-container-lowest/40 opacity-30 flex items-center justify-center pointer-events-none">
            <span className="font-label-code text-label-code text-on-surface-variant">03</span>
          </div>
        </div>

        {/* Quick Filter Legend with Dot Indicators */}
        <div className="flex items-center justify-between pt-space-md mt-space-sm border-t border-surface-container-highest">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-surface-container-lowest border border-surface-container-highest"></span>
            <span className="font-label-code text-label-code text-on-surface-variant">Rest</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-surface-variant"></span>
            <span className="font-label-code text-label-code text-on-surface-variant">Cardio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-surface-tint/60"></span>
            <span className="font-label-code text-label-code text-on-surface-variant">Strength</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container shadow-[0_0_6px_rgba(195,244,0,0.8)]"></span>
            <span className="font-label-code text-label-code text-primary-container font-semibold">
              Peak PR
            </span>
          </div>
        </div>
      </div>

      {/* Floating Active Day Modal Preview */}
      <div className="bg-surface-container-high rounded-xl p-space-md shadow-2xl relative overflow-hidden transition-all duration-300 border border-surface-container-highest/60">
        <div className="flex items-start justify-between">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs">
              <span
                className={`font-label-code text-label-code tracking-wider uppercase ${previewBadge.colorClass}`}
              >
                {previewBadge.tag}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
              <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                {activePreviewDay.type === 'missed' ? 'INCOMPLETE' : 'COMPLETED'}
              </span>
            </div>
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary uppercase tracking-wide mt-1">
              {activePreviewDay.summary.split('•')[0]?.trim()} •{' '}
              {activePreviewDay.summary.split('•')[1]?.trim() || 'Session'}
            </span>
            <p className="font-label-code text-label-code text-on-surface-variant mt-0.5 truncate">
              {activePreviewDay.summary.split('•').slice(2).join(' • ') ||
                `${activePreviewDay.durationMinutes} mins • RPE ${activePreviewDay.rpe || 8.0}`}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(195,244,0,0.4)]">
            <span className="material-symbols-outlined text-[26px]">
              local_fire_department
            </span>
          </div>
        </div>

        {/* Mini Telemetry Row inside Preview */}
        <div className="grid grid-cols-3 gap-space-xs mt-space-sm pt-space-xs">
          <div className="bg-surface-container rounded-lg p-2 flex flex-col border border-surface-container-highest/40">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
              Peak HR
            </span>
            <span className="font-metric-val text-title-sm text-primary font-bold">
              {activePreviewDay.peakHR || 178}{' '}
              <span className="font-label-code text-[10px] text-on-surface-variant font-normal">
                BPM
              </span>
            </span>
          </div>
          <div className="bg-surface-container rounded-lg p-2 flex flex-col border border-surface-container-highest/40">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
              PR Sets
            </span>
            <span className="font-metric-val text-title-sm text-primary-container font-bold">
              {activePreviewDay.prCount ?? (activePreviewDay.intensity === 3 ? 3 : 0)}{' '}
              <span className="font-label-code text-[10px] text-on-surface-variant font-normal">
                LIFTS
              </span>
            </span>
          </div>
          <div className="bg-surface-container rounded-lg p-2 flex flex-col border border-surface-container-highest/40">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
              Rest Pacing
            </span>
            <span className="font-metric-val text-title-sm text-secondary-container font-bold">
              {activePreviewDay.restPacingSec || 88}s{' '}
              <span className="font-label-code text-[10px] text-on-surface-variant font-normal">
                AVG
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Consistency Breakdown & Insights */}
      <div className="flex flex-col gap-space-sm bg-surface-container rounded-xl p-space-md shadow-xl border border-surface-container-highest/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-md text-headline-md uppercase text-primary font-bold">
              MUSCLE SPLIT RATIO
            </span>
            <span className="material-symbols-outlined text-primary-container text-[18px]">
              pie_chart
            </span>
          </div>
          <span className="font-label-code text-label-code text-primary-container uppercase font-semibold">
            OCT TARGET MET
          </span>
        </div>

        {/* Stacked Distribution Bar */}
        <div className="w-full h-4 rounded-full bg-surface-container-lowest flex overflow-hidden p-0.5 gap-0.5 border border-surface-container-highest/40">
          <div
            className="h-full rounded-l-full bg-primary-container"
            style={{ width: '32%' }}
            title="Push: 32%"
          ></div>
          <div
            className="h-full bg-secondary-container"
            style={{ width: '28%' }}
            title="Pull: 28%"
          ></div>
          <div
            className="h-full bg-surface-tint"
            style={{ width: '24%' }}
            title="Legs: 24%"
          ></div>
          <div
            className="h-full rounded-r-full bg-tertiary-fixed-dim"
            style={{ width: '16%' }}
            title="Cardio: 16%"
          ></div>
        </div>

        {/* Segment Breakdown Labels */}
        <div className="grid grid-cols-4 gap-space-xs pt-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
              <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                Push
              </span>
            </div>
            <span className="font-metric-val text-body-lg text-primary font-bold">32%</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
              <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                Pull
              </span>
            </div>
            <span className="font-metric-val text-body-lg text-primary font-bold">28%</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
              <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                Legs
              </span>
            </div>
            <span className="font-metric-val text-body-lg text-primary font-bold">24%</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
              <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                Cardio
              </span>
            </div>
            <span className="font-metric-val text-body-lg text-primary font-bold">16%</span>
          </div>
        </div>
      </div>

      {/* Monthly Attendance Milestones & Streaks */}
      <div className="grid grid-cols-1 gap-space-sm">
        {/* Milestone 1 */}
        <div className="bg-surface-container rounded-xl p-space-md flex items-center justify-between shadow-md relative overflow-hidden border border-surface-container-highest/40">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[28px]">verified</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-title-sm text-title-sm text-primary truncate font-bold">
                  Iron Habit Achieved
                </span>
                <span className="font-label-code text-[10px] px-1.5 py-0.5 rounded bg-primary-container/20 text-primary-container uppercase font-bold">
                  Unlocked
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                23 completed workouts vs. 15 target threshold
              </span>
            </div>
          </div>
          <span className="font-metric-val text-metric-val text-primary-container flex-shrink-0 ml-2 font-bold">
            153%
          </span>
        </div>

        {/* Milestone 2 */}
        <div className="bg-surface-container rounded-xl p-space-md flex items-center justify-between shadow-md relative overflow-hidden border border-surface-container-highest/40">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="w-12 h-12 rounded-xl bg-secondary-container/20 text-secondary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[28px]">shield</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-title-sm text-title-sm text-primary truncate font-bold">
                  Weekend Warrior
                </span>
                <span className="font-label-code text-[10px] px-1.5 py-0.5 rounded bg-secondary-container/20 text-secondary-container uppercase font-bold">
                  4/4 Streak
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Logged endurance or lifting on every Saturday & Sunday
              </span>
            </div>
          </div>
          <span className="font-metric-val text-metric-val text-secondary-container flex-shrink-0 ml-2 font-bold">
            100%
          </span>
        </div>
      </div>

      {/* Visual Cadence Graph Section */}
      <div className="bg-surface-container rounded-xl p-space-md shadow-xl flex flex-col gap-space-xs border border-surface-container-highest/40">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md uppercase text-primary font-bold">
              WEEKLY VOLUME TREND
            </span>
            <span className="font-label-code text-label-code text-on-surface-variant">
              OCTOBER LOAD DISTRIBUTION (KG × REPS)
            </span>
          </div>
          <div className="font-metric-val text-title-sm text-primary-container font-bold">
            +14.2%{' '}
            <span className="font-label-code text-[10px] text-on-surface-variant font-normal">
              MoM
            </span>
          </div>
        </div>

        {/* Micro Sparkline Bars */}
        <div className="h-20 w-full flex items-end justify-between gap-2 pt-space-sm">
          <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div className="w-full bg-surface-container-high rounded-t" style={{ height: '60%' }}></div>
            <span className="font-label-code text-[10px] text-on-surface-variant">W1</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div className="w-full bg-surface-container-high rounded-t" style={{ height: '75%' }}></div>
            <span className="font-label-code text-[10px] text-on-surface-variant">W2</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div
              className="w-full bg-primary-container rounded-t shadow-[0_0_8px_rgba(195,244,0,0.5)]"
              style={{ height: '98%' }}
            ></div>
            <span className="font-label-code text-[10px] text-primary-container font-bold">
              W3
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div className="w-full bg-surface-container-high rounded-t" style={{ height: '85%' }}></div>
            <span className="font-label-code text-[10px] text-on-surface-variant">W4</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div className="w-full bg-surface-variant rounded-t" style={{ height: '45%' }}></div>
            <span className="font-label-code text-[10px] text-on-surface-variant">W5</span>
          </div>
        </div>
      </div>

      {/* Weight Progression Telemetry Section */}
      <div className="bg-surface-container rounded-xl p-space-md shadow-xl flex flex-col gap-space-md border border-surface-container-highest/40">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary-container text-[20px]">
                monitoring
              </span>
              <span className="font-headline-md text-headline-md uppercase text-primary tracking-wide font-bold">
                WEIGHT PROGRESSION
              </span>
            </div>
            <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider truncate">
              BODY MASS & COMPOUND 1RM TRAJECTORY
            </span>
          </div>
          <div className="flex items-center gap-1 bg-primary-container/10 border border-primary-container/30 px-space-sm py-1 rounded-full shadow-sm flex-shrink-0">
            <span className="material-symbols-outlined text-primary-container text-[14px]">
              trending_up
            </span>
            <span className="font-label-code text-[11px] text-primary-container font-bold tracking-wider">
              +{progression.gain} {progression.unit} (8 WKS)
            </span>
          </div>
        </div>

        {/* Filter / Toggle Pills */}
        <div className="flex items-center gap-space-xs overflow-x-auto py-0.5 no-scrollbar -mx-margin-sm px-margin-sm">
          {(['bodyweight', 'bench', 'squat', 'deadlift'] as const).map(key => {
            const item = WEIGHT_PROGRESSION_DATA[key];
            const isSelected = selectedMetric === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`h-7 px-space-sm rounded-full font-label-code text-label-code uppercase tracking-wider flex-shrink-0 transition-all ${
                  isSelected
                    ? 'bg-primary-container text-surface-container-lowest font-bold shadow-[0_0_12px_rgba(195,244,0,0.4)]'
                    : 'bg-surface-container-high border border-surface-container-highest text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Primary Progression SVG Chart */}
        <div className="relative bg-surface-container-low rounded-lg p-space-sm border border-surface-container-highest/60 overflow-hidden flex flex-col">
          {/* Chart Callout Tooltip Badge */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_6px_rgba(195,244,0,0.8)]"></span>
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                LIVE TRAJECTORY
              </span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded border border-primary-container/40 shadow-md">
              <span className="font-label-code text-[11px] text-primary-container font-bold">
                {progression.current} {progression.unit}
              </span>
              <span className="font-label-code text-[10px] text-on-surface-variant">
                (+0.3kg this wk)
              </span>
            </div>
          </div>

          {/* Responsive Vector SVG Canvas */}
          <div className="w-full h-44 relative">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 360 140"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="weight-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c3f400" stopOpacity="0.35"></stop>
                  <stop offset="70%" stopColor="#c3f400" stopOpacity="0.05"></stop>
                  <stop offset="100%" stopColor="#c3f400" stopOpacity="0.0"></stop>
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="3"
                    floodColor="#c3f400"
                    floodOpacity="0.8"
                  ></feDropShadow>
                </filter>
              </defs>

              {/* Subtle Horizontal Grid Lines */}
              <line
                x1="10"
                y1="20"
                x2="350"
                y2="20"
                stroke="#31353e"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.5"
              ></line>
              <text
                x="348"
                y="16"
                textAnchor="end"
                fill="#c3f400"
                fontFamily="JetBrains Mono"
                fontSize="9"
                letterSpacing="0.05em"
              >
                TARGET: {progression.target} {progression.unit}
              </text>

              <line x1="10" y1="55" x2="350" y2="55" stroke="#262a33" strokeWidth="1" opacity="0.4"></line>
              <line x1="10" y1="90" x2="350" y2="90" stroke="#262a33" strokeWidth="1" opacity="0.4"></line>
              <line x1="10" y1="120" x2="350" y2="120" stroke="#31353e" strokeWidth="1" opacity="0.6"></line>

              {/* Area Fill Gradient */}
              <path d={areaPathD} fill="url(#weight-glow)"></path>

              {/* Trend Smooth Stroke Line */}
              <path
                d={linePathD}
                fill="none"
                stroke="#c3f400"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              ></path>

              {/* Data Point Nodes */}
              {svgCoords.map((coord, i) => {
                const isLast = i === svgCoords.length - 1;
                if (isLast) {
                  return (
                    <g key={i}>
                      <circle cx={coord.x} cy={coord.y} r="6" fill="#c3f400" fillOpacity="0.3"></circle>
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r="3.5"
                        fill="#0a0e16"
                        stroke="#c3f400"
                        strokeWidth="2.5"
                      ></circle>
                    </g>
                  );
                }
                return (
                  <circle
                    key={i}
                    cx={coord.x}
                    cy={coord.y}
                    r="2.5"
                    fill="#181c24"
                    stroke="#c3f400"
                    strokeWidth="1.5"
                    opacity={i === 0 ? 1 : 0.8}
                  ></circle>
                );
              })}
            </svg>
          </div>

          {/* X-Axis Labels */}
          <div className="flex items-center justify-between pt-1 border-t border-surface-container-highest/50 px-1">
            {progression.points.map((p, idx) => {
              const isLast = idx === progression.points.length - 1;
              return (
                <span
                  key={p.week}
                  className={`font-label-code text-[10px] ${
                    isLast
                      ? 'text-primary-container font-bold'
                      : 'text-on-surface-variant'
                  } ${idx % 2 === 1 ? 'hidden xs:inline' : ''}`}
                >
                  {p.week} <span className="text-[9px] opacity-70">{p.value}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Quick Telemetry Stat Grid (3 columns) */}
        <div className="grid grid-cols-3 gap-space-xs">
          <div className="bg-surface-container-high rounded-lg p-space-sm flex flex-col justify-between border border-surface-container-highest/40">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
              STARTING
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-metric-val text-title-sm text-primary font-bold">
                {progression.starting}
              </span>
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                {progression.unit}
              </span>
            </div>
            <span className="font-label-code text-[10px] text-on-surface-variant/70 mt-0.5">
              BASELINE W1
            </span>
          </div>

          <div className="bg-surface-container-high rounded-lg p-space-sm flex flex-col justify-between border border-surface-container-highest/40">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
              CURRENT
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-metric-val text-title-sm text-primary-container font-bold">
                {progression.current}
              </span>
              <span className="font-label-code text-[10px] text-primary-container uppercase font-bold">
                {progression.unit}
              </span>
            </div>
            <span className="font-label-code text-[10px] text-primary-container mt-0.5 font-bold">
              +{progression.percentNet}% NET
            </span>
          </div>

          <div className="bg-surface-container-high rounded-lg p-space-sm flex flex-col justify-between border border-surface-container-highest/40">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
              GOAL PACE
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-metric-val text-title-sm text-secondary-container font-bold">
                +{progression.pace}
              </span>
              <span className="font-label-code text-[10px] text-secondary-container uppercase">
                {progression.unit}/WK
              </span>
            </div>
            <span className="font-label-code text-[10px] text-on-surface-variant/70 mt-0.5 truncate">
              OPTIMAL SURPLUS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
