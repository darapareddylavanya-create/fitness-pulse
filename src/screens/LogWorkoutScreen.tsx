import React, { useState } from 'react';
import { useFitPulse } from '../context/FitPulseContext';
import { ExerciseItem } from '../types';

export const LogWorkoutScreen: React.FC = () => {
  const {
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
    appendSetToFirstExercise,
    logNotes,
    setLogNotes,
    logSleep,
    setLogSleep,
    logCaffeine,
    setLogCaffeine,
    totalLoggedVolume,
    saveCurrentLogToGrid,
    discardCurrentLog,
  } = useFitPulse();

  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(24);
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState<boolean>(false);
  const [newExName, setNewExName] = useState<string>('');
  const [newExWeight, setNewExWeight] = useState<number>(100);
  const [newExReps, setNewExReps] = useState<number>(8);
  const [newExSetsCount, setNewExSetsCount] = useState<number>(3);
  const [newExIsPR, setNewExIsPR] = useState<boolean>(false);

  const availableTags = [
    'Push - Chest & Triceps',
    'Pull - Back & Biceps',
    'Legs - Quads & Hamstrings',
    'Shoulders & Delts',
    'Core & Abs',
    'HIIT / Cardio',
    'Active Recovery',
  ];

  const energyRatingTexts: Record<number, string> = {
    1: 'Rating: 1/5 (Depleted)',
    2: 'Rating: 2/5 (Low Output)',
    3: 'Rating: 3/5 (Baseline)',
    4: 'Rating: 4/5 (High Energy)',
    5: 'Rating: 5/5 (Peak Kinetic)',
  };

  const dayList = [
    { dayName: 'Mon', num: 21 },
    { dayName: 'Tue', num: 22 },
    { dayName: 'Wed', num: 23 },
    { dayName: 'Thu', num: 24 },
    { dayName: 'Fri', num: 25 },
    { dayName: 'Sat', num: 26 },
  ];

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const sets = Array.from({ length: newExSetsCount }, (_, i) => ({
      setNum: i + 1,
      weight: newExWeight,
      reps: newExReps,
      isPR: i === newExSetsCount - 1 && newExIsPR,
    }));

    const newEx: ExerciseItem = {
      id: String(logExercises.length + 1).padStart(2, '0'),
      name: newExName.trim(),
      setsCount: newExSetsCount,
      sets,
    };

    addExercise(newEx);
    setNewExName('');
    setIsAddExerciseModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full px-margin-sm space-y-space-md max-w-md mx-auto pb-space-xl">
      {/* Date Selector Banner */}
      <section className="bg-surface-container rounded-xl p-space-md shadow-lg relative overflow-hidden border border-surface-container-highest/40">
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-space-xs">
            <span
              className="material-symbols-outlined text-primary-container text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              calendar_today
            </span>
            <span className="font-label-code text-label-code uppercase tracking-wider text-on-surface-variant font-semibold">
              Telemetry Session Date
            </span>
          </div>
          <button
            aria-label="Open full calendar"
            className="text-secondary-container hover:text-primary transition-colors flex items-center gap-1 font-label-code text-label-code uppercase font-semibold"
            type="button"
          >
            <span>Calendar</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </div>

        <div className="flex items-baseline justify-between mb-space-md">
          <div className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
            {logDate}
          </div>
          <span className="bg-surface-container-high text-primary-container font-label-code text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm font-bold border border-primary-container/30">
            Sync: Ready
          </span>
        </div>

        {/* Quick Day Scroller */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1" id="day-selector">
          {dayList.map(item => {
            const isSelected = selectedDayNumber === item.num;
            return (
              <button
                key={item.num}
                onClick={() => {
                  setSelectedDayNumber(item.num);
                  setLogDate(`Today, Oct ${item.num}, 2024`);
                }}
                className={`flex-1 min-w-[44px] py-2 flex flex-col items-center justify-center rounded-lg transition-all ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(195,244,0,0.35)] font-bold'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                <span className="font-label-code text-[10px] uppercase font-bold">
                  {item.dayName}
                </span>
                <span className="font-metric-val text-sm font-bold">{item.num}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Routine & Muscle Groups Cloud */}
      <section className="bg-surface-container rounded-xl p-space-md shadow-lg space-y-space-sm border border-surface-container-highest/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary-container text-[18px]">
              hub
            </span>
            <span className="font-headline-md text-headline-md text-primary tracking-wide uppercase font-bold">
              Target Focus
            </span>
          </div>
          <span className="font-label-code text-label-code text-on-surface-variant">
            MULTI-SELECT
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1" id="routine-tag-cloud">
          {availableTags.map(tag => {
            const isSelected = logTargetTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTargetTag(tag)}
                className={`px-3 py-1.5 rounded-full font-label-code text-[11px] tracking-wide uppercase transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(195,244,0,0.3)]'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-primary border border-surface-container-highest/50'
                }`}
                type="button"
              >
                {isSelected && <span>⚡</span>}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Workout Performance Inputs */}
      <section className="bg-surface-container rounded-xl p-space-md shadow-lg space-y-space-md border border-surface-container-highest/40">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-secondary-container text-[18px]">
            speed
          </span>
          <span className="font-headline-md text-headline-md text-primary tracking-wide uppercase font-bold">
            Telemetry Gauges
          </span>
        </div>

        {/* Energy Level */}
        <div className="bg-surface-container-low rounded-lg p-space-sm space-y-space-xs border border-surface-container-highest/30">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code uppercase tracking-wider text-on-surface-variant">
              Energy Output
            </span>
            <span className="font-label-code text-label-code font-bold text-primary-container uppercase">
              {energyRatingTexts[logEnergyRating]}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            {[1, 2, 3, 4, 5].map(lvl => {
              const isActive = lvl <= logEnergyRating;
              const isPeak = lvl === logEnergyRating;
              return (
                <button
                  key={lvl}
                  onClick={() => setLogEnergyRating(lvl)}
                  className={`flex-1 h-9 rounded flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-surface-container-high text-primary-container'
                      : 'bg-surface-container-high/40 text-outline'
                  } ${isPeak ? 'shadow-[0_0_12px_rgba(195,244,0,0.4)]' : ''}`}
                  type="button"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    bolt
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration & Total Volume Grid */}
        <div className="grid grid-cols-2 gap-space-sm">
          {/* Session Duration */}
          <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col justify-between border border-surface-container-highest/30">
            <div className="flex items-center justify-between">
              <span className="font-label-code text-label-code uppercase tracking-wider text-on-surface-variant">
                Duration
              </span>
              <span className="material-symbols-outlined text-[16px] text-secondary-container">
                timer
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="font-metric-val text-metric-val text-primary leading-none font-bold text-[30px]">
                {logDuration}
              </span>
              <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                MIN
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLogDuration(prev => Math.max(5, prev - 5))}
                className="flex-1 h-7 rounded bg-surface-container-high hover:bg-surface-bright active:scale-95 text-primary flex items-center justify-center transition-all border border-surface-container-highest"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <button
                onClick={() => setLogDuration(prev => prev + 5)}
                className="flex-1 h-7 rounded bg-surface-container-high hover:bg-surface-bright active:scale-95 text-primary flex items-center justify-center transition-all border border-surface-container-highest"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>

          {/* Volume Tracker */}
          <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col justify-between border border-surface-container-highest/30">
            <div className="flex items-center justify-between">
              <span className="font-label-code text-label-code uppercase tracking-wider text-on-surface-variant">
                Vol Payload
              </span>
              <span className="material-symbols-outlined text-[16px] text-primary-container">
                weight
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="font-metric-val text-metric-val text-primary-container leading-none font-bold text-[30px]">
                {totalLoggedVolume.toLocaleString()}
              </span>
              <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                KG
              </span>
            </div>
            <div className="flex items-center gap-1 font-label-code text-[10px] text-secondary-container font-semibold">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              <span>+8.4% VS PREV</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Biometric Context */}
      <section className="bg-surface-container rounded-xl overflow-hidden shadow-lg relative border border-surface-container-highest/40">
        <div
          className="bg-cover bg-center w-full h-28 relative"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD85BhZS9LtmwMsNvzx3L5r5Fo3RY_-u7oiOyZjXfwa0sm-E5R5QeR-okM3YSEV4E8DOMOX-foTuV_VOciC6jr0Q9r1i2-XsC04ZUV9_vdTwNTbLOE2Pt5v4Ek_YQdNSF9oaUNo9YbtyFeR7FoejsYcUAyv9kx4eIGEkKOqHjG0204oB0akFDm5nhykdMMgdjaaKiTBcLOzgiZXm7p6cwYEveUPnf7VomKjy-hYwr0oTr4IkErYscKsUA')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/60 to-transparent flex items-end p-space-md">
            <div className="flex items-center justify-between w-full">
              <div>
                <span className="font-label-code text-[10px] uppercase text-primary-container tracking-widest block font-bold">
                  Neural Focus Mode
                </span>
                <span className="font-title-sm text-title-sm text-primary font-bold">
                  Heavy Hypertrophy Protocol
                </span>
              </div>
              <span className="material-symbols-outlined text-primary-container text-[24px]">
                verified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Milestone & Exercise Log Table */}
      <section className="bg-surface-container rounded-xl p-space-md shadow-lg space-y-space-sm border border-surface-container-highest/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary-container text-[18px]">
              fitness_center
            </span>
            <span className="font-headline-md text-headline-md text-primary tracking-wide uppercase font-bold">
              Exercise Breakdown
            </span>
          </div>
          <span className="font-label-code text-label-code text-primary-container font-bold">
            {logExercises.length} LOGGED
          </span>
        </div>

        {/* Exercise List */}
        <div className="space-y-space-xs">
          {logExercises.map((ex, idx) => (
            <div
              key={ex.id || idx}
              className="bg-surface-container-low rounded-lg p-space-sm space-y-space-xs border border-surface-container-highest/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-label-code text-[10px] bg-surface-container-high text-on-surface px-1.5 py-0.5 rounded uppercase font-bold">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="font-title-sm text-title-sm text-primary font-bold">
                    {ex.name}
                  </span>
                </div>
                <span className="font-label-code text-[11px] text-on-surface-variant">
                  {ex.sets.length} SETS
                </span>
              </div>

              {/* Sets pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {ex.sets.map((s, sIdx) => {
                  if (s.isPR) {
                    return (
                      <div
                        key={sIdx}
                        className="bg-primary-container text-on-primary-container px-2 py-1 rounded font-label-code text-[11px] font-bold shadow-[0_0_12px_rgba(195,244,0,0.3)] flex items-center gap-1"
                      >
                        <span>
                          S{s.setNum}: {s.weight}kg × {s.reps}
                        </span>
                        <span className="bg-on-primary-container text-primary-container text-[9px] px-1 rounded uppercase tracking-wider font-extrabold">
                          PR!
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={sIdx}
                      className="bg-surface-container-high px-2 py-1 rounded text-on-surface font-label-code text-[11px] flex items-center gap-1 border border-surface-container-highest/40"
                    >
                      <span className="text-on-surface-variant font-medium">S{s.setNum}:</span>{' '}
                      {s.weight > 0 ? `${s.weight}kg × ${s.reps}` : `${s.reps} reps`}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Add Exercise Action Link */}
        <button
          onClick={() => setIsAddExerciseModalOpen(true)}
          className="w-full py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-secondary-container transition-all flex items-center justify-center gap-1.5 font-label-code text-label-code uppercase tracking-wider font-semibold border border-surface-container-highest/50"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Add Exercise</span>
        </button>
      </section>

      {/* Daily Notes & Bio-Journal */}
      <section className="bg-surface-container rounded-xl p-space-md shadow-lg space-y-space-xs border border-surface-container-highest/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary-container text-[18px]">
              edit_note
            </span>
            <span className="font-headline-md text-headline-md text-primary tracking-wide uppercase font-bold">
              Session Telemetry Notes
            </span>
          </div>
          <span className="font-label-code text-label-code text-on-surface-variant">
            MARKDOWN
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-space-sm border border-surface-container-highest/30">
          <textarea
            value={logNotes}
            onChange={e => setLogNotes(e.target.value)}
            className="w-full bg-transparent text-on-surface font-body-md text-body-md focus:outline-none resize-none leading-relaxed placeholder:text-outline"
            placeholder="Record qualitative signals, sleep, nutrition, micro-adjustments..."
            rows={3}
          />
          <div className="flex items-center justify-between pt-2 border-t border-surface-container-highest/20">
            <div className="flex items-center gap-3 text-on-surface-variant font-label-code text-[11px]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary-container">
                  bed
                </span>{' '}
                <input
                  type="number"
                  step="0.1"
                  value={logSleep}
                  onChange={e => setLogSleep(parseFloat(e.target.value) || 0)}
                  className="w-10 bg-transparent text-on-surface border-b border-surface-container-highest focus:outline-none"
                />
                h
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary-container">
                  local_cafe
                </span>{' '}
                <input
                  type="number"
                  step="10"
                  value={logCaffeine}
                  onChange={e => setLogCaffeine(parseInt(e.target.value, 10) || 0)}
                  className="w-12 bg-transparent text-on-surface border-b border-surface-container-highest focus:outline-none"
                />
                mg
              </span>
            </div>
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase font-semibold">
              Auto-Drafted
            </span>
          </div>
        </div>
      </section>

      {/* Master Action Controls */}
      <section className="space-y-space-sm pt-space-xs">
        <button
          onClick={saveCurrentLogToGrid}
          className="w-full py-3.5 px-space-md rounded-xl bg-primary-container text-on-primary-container font-headline-md text-headline-md uppercase tracking-wider shadow-[0_0_24px_rgba(195,244,0,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-bold cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">save</span>
          <span>Save & Sync to Attendance Grid</span>
        </button>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={appendSetToFirstExercise}
            className="flex-1 py-2.5 rounded-lg bg-surface-container text-secondary-container hover:bg-surface-container-high transition-colors font-label-code text-label-code uppercase tracking-wider flex items-center justify-center gap-1 border border-surface-container-highest/60 font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Append Sets</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Discard uncommitted changes in this telemetry log?')) {
                discardCurrentLog();
              }
            }}
            className="flex-1 py-2.5 rounded-lg bg-surface-container-high text-error hover:bg-surface-bright transition-colors font-label-code text-label-code uppercase tracking-wider flex items-center justify-center gap-1 border border-error/30 font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            <span>Discard</span>
          </button>
        </div>
      </section>

      {/* Modal: Add Custom Exercise */}
      {isAddExerciseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container rounded-xl w-full max-w-sm p-space-md border border-surface-container-highest shadow-2xl space-y-space-sm">
            <div className="flex items-center justify-between pb-1 border-b border-surface-container-highest">
              <span className="font-headline-md text-headline-md text-primary uppercase">
                Add Exercise
              </span>
              <button
                onClick={() => setIsAddExerciseModalOpen(false)}
                className="text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-3">
              <div>
                <label className="font-label-code text-[10px] text-on-surface-variant uppercase block mb-1">
                  Exercise Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Incline DB Bench Press"
                  value={newExName}
                  onChange={e => setNewExName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-surface-container-highest rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-label-code text-[10px] text-on-surface-variant uppercase block mb-1">
                    Sets
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newExSetsCount}
                    onChange={e => setNewExSetsCount(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-surface-container-lowest border border-surface-container-highest rounded px-2 py-1.5 text-sm text-on-surface font-metric-val"
                  />
                </div>
                <div>
                  <label className="font-label-code text-[10px] text-on-surface-variant uppercase block mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="2.5"
                    value={newExWeight}
                    onChange={e => setNewExWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-container-lowest border border-surface-container-highest rounded px-2 py-1.5 text-sm text-on-surface font-metric-val"
                  />
                </div>
                <div>
                  <label className="font-label-code text-[10px] text-on-surface-variant uppercase block mb-1">
                    Reps
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newExReps}
                    onChange={e => setNewExReps(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-surface-container-lowest border border-surface-container-highest rounded px-2 py-1.5 text-sm text-on-surface font-metric-val"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newExIsPR}
                  onChange={e => setNewExIsPR(e.target.checked)}
                  className="rounded accent-primary-container"
                />
                <span className="font-label-code text-[11px] text-primary-container font-bold uppercase">
                  Flag as New Personal Record (PR!)
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-container font-headline-md text-headline-md uppercase tracking-wider font-bold mt-2 shadow-[0_0_12px_rgba(195,244,0,0.3)]"
              >
                Insert Exercise
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
