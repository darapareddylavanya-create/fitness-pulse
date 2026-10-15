import React, { useState } from 'react';
import { useFitPulse } from '../context/FitPulseContext';

export const JsonModal: React.FC = () => {
  const {
    isJsonModalOpen,
    setIsJsonModalOpen,
    exportTelemetryJSON,
    importTelemetryJSON,
    attendanceMatrix,
    recentSessions,
    activeSessionSeconds,
  } = useFitPulse();

  const [jsonInput, setJsonInput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isJsonModalOpen) return null;

  const sampleExport = {
    version: '2.4.0',
    athlete: 'Alex Vance',
    last_checkin: new Date().toISOString(),
    streak_current: 6,
    active_session_seconds: activeSessionSeconds,
    sessions_count: recentSessions.length,
    matrix_days: attendanceMatrix.length,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleExport, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const text = event.target?.result as string;
        if (text) {
          const success = importTelemetryJSON(text);
          if (success) {
            setIsJsonModalOpen(false);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleManualImport = () => {
    if (!jsonInput.trim()) return;
    const success = importTelemetryJSON(jsonInput);
    if (success) {
      setIsJsonModalOpen(false);
      setJsonInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-surface-container rounded-xl w-full max-w-md p-space-md border border-surface-container-highest shadow-2xl space-y-space-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-surface-container-highest">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container text-[20px]">
              sync_alt
            </span>
            <span className="font-headline-md text-headline-md text-primary uppercase">
              Telemetry JSON Pipeline
            </span>
          </div>
          <button
            onClick={() => setIsJsonModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Schema Preview */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              Current Schema Preview
            </span>
            <button
              onClick={handleCopy}
              className="text-secondary-container hover:text-primary font-label-code text-[11px] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'done' : 'content_copy'}
              </span>
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>
          <pre className="p-space-sm rounded-lg bg-surface-container-lowest text-primary-container font-label-code text-[11px] overflow-x-auto border border-surface-container-highest/40">
            {JSON.stringify(sampleExport, null, 2)}
          </pre>
        </div>

        {/* Action: Export */}
        <button
          onClick={() => {
            exportTelemetryJSON();
            setIsJsonModalOpen(false);
          }}
          className="w-full py-3 rounded-lg bg-primary-container text-on-primary-container font-headline-md text-headline-md uppercase tracking-wider shadow-[0_0_16px_rgba(195,244,0,0.35)] flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
          <span>Export Full Telemetry (.JSON)</span>
        </button>

        {/* Action: Import */}
        <div className="space-y-2 pt-2 border-t border-surface-container-highest">
          <span className="font-label-code text-label-code text-on-surface-variant uppercase block">
            Import Validated Backup
          </span>

          <label className="border-2 border-dashed border-surface-container-highest hover:border-secondary-container/60 rounded-xl p-space-md flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-surface-container-low group">
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
            <span className="material-symbols-outlined text-secondary-container text-[28px] group-hover:scale-110 transition-transform mb-1">
              cloud_upload
            </span>
            <span className="font-title-sm text-title-sm text-primary">
              Choose or Drop JSON File
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Validates schema, streaks, and attendance records
            </span>
          </label>

          {/* Paste Raw JSON */}
          <div className="pt-2">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase block mb-1">
              Or Paste Raw JSON string
            </span>
            <textarea
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              placeholder='Paste JSON telemetry object here...'
              rows={3}
              className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg p-space-xs font-label-code text-[11px] text-on-surface focus:outline-none focus:border-secondary-container"
            />
            <button
              onClick={handleManualImport}
              disabled={!jsonInput.trim()}
              className="w-full mt-2 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright disabled:opacity-40 text-secondary-container font-label-code text-label-code uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">publish</span>
              <span>Ingest Raw Payload</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
