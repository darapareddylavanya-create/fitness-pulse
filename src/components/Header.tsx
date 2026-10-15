import React from 'react';
import { useFitPulse } from '../context/FitPulseContext';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, setIsJsonModalOpen } = useFitPulse();

  const getSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'heatmap':
        return 'Heatmap';
      case 'log':
        return 'Log Workout';
      case 'portfolio':
        return 'Dev Portfolio';
      default:
        return 'Telemetry HUD';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-b border-surface-container-highest/30">
      <div className="h-16 px-margin-sm max-w-md mx-auto flex items-center justify-between gap-space-sm">
        {/* Brand / Logo */}
        <div
          className="flex items-center gap-space-sm min-w-0 cursor-pointer group"
          onClick={() => setActiveTab('dashboard')}
        >
          <img
            alt="FitPulse Logo"
            className="h-8 w-auto object-contain flex-shrink-0 transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VhQYiCEntWLYqhQDhS-eEdQC7UUeesFfKjtA1gq5squEYueEjG2J35-vLMHDDTNpW1b4WXHlyW3m0UcWaqltjD0wP57cLPhA89UvK79Zir8HKeDaGltiti4eVSXH_a5aWu6WVOEozqr788zjbqp5pe2Eups5G1KcyPbhNWJY_d96mUupGVJHEYo_u-8s4aaVkrOpY7_vn2l6Er4t0G4JAfzcNuGB502TzuBjkDqObsUfYb_PIhaB-UY3aY"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-md text-headline-md tracking-wider uppercase text-primary leading-none">
                FITPULSE
              </span>
              <span className="flex h-2 w-2 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
              </span>
            </div>
            <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-widest truncate">
              {getSubtitle()}
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-space-xs flex-shrink-0">
          <button
            onClick={() => setIsJsonModalOpen(true)}
            aria-label="Export or Import JSON telemetry"
            className="h-9 px-space-sm rounded-lg flex items-center gap-space-xs bg-surface-container hover:bg-surface-container-high transition-colors text-secondary-container active:scale-95 border border-surface-container-highest/60"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">sync_alt</span>
            <span className="font-label-code text-label-code uppercase tracking-wider hidden xs:inline">
              JSON
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            aria-label="View Engineer Portfolio"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 transition-transform"
            type="button"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
