import React from 'react';
import { useFitPulse } from '../context/FitPulseContext';
import { TabType } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useFitPulse();

  const navItems: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'heatmap', label: 'Heatmap', icon: 'grid_view' },
    { id: 'log', label: 'Log', icon: 'fitness_center' },
    { id: 'portfolio', label: 'Portfolio', icon: 'terminal' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/85 backdrop-blur-2xl shadow-[0_-2px_16px_rgba(0,0,0,0.6)] border-t border-surface-container-highest/30">
      <div className="flex items-stretch justify-around h-16 px-space-xs max-w-md mx-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] transition-all group ${
                isActive
                  ? 'text-primary-container font-semibold drop-shadow-[0_0_10px_rgba(195,244,0,0.45)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-transform ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`}
                style={isActive && item.id === 'log' ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-code text-[10px] tracking-wider uppercase">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-primary-container -mt-0.5 shadow-[0_0_4px_rgba(195,244,0,0.8)]"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
