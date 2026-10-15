import React from 'react';
import { useFitPulse } from '../context/FitPulseContext';

export const Toast: React.FC = () => {
  const { toast } = useFitPulse();

  if (!toast) return null;

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto bg-surface-container-highest text-on-surface rounded-xl p-space-sm shadow-2xl flex items-center justify-between border border-primary-container/20 animate-in fade-in slide-in-from-bottom-2 duration-200"
      id="sync-toast"
    >
      <div className="flex items-center gap-space-sm min-w-0">
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container flex-shrink-0 shadow-[0_0_10px_rgba(195,244,0,0.5)]">
          <span className="material-symbols-outlined text-[18px]">
            {toast.icon || 'cloud_done'}
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-headline-md text-[15px] text-primary leading-tight truncate uppercase">
            {toast.title}
          </span>
          <span className="font-label-code text-[11px] text-on-surface-variant truncate">
            {toast.subtitle}
          </span>
        </div>
      </div>
      {toast.statusBadge && (
        <span className="font-label-code text-[10px] text-primary-container font-bold uppercase tracking-wider pl-2 flex-shrink-0">
          {toast.statusBadge}
        </span>
      )}
    </div>
  );
};
