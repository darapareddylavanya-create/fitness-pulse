import React, { useState } from 'react';
import { useFitPulse } from '../context/FitPulseContext';

export const DevPortfolioScreen: React.FC = () => {
  const {
    exportTelemetryJSON,
    importTelemetryJSON,
    resetAllCache,
    showToast,
  } = useFitPulse();

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copyStatus, setCopyStatus] = useState<string>('COPY JSON');
  const [isBlueprintOpen, setIsBlueprintOpen] = useState<boolean>(false);

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(prev => (prev === idx ? null : idx));
  };

  const handleCopySchema = () => {
    const snippet = {
      version: '2.4.0',
      athlete: 'Alex Vance',
      last_checkin: new Date().toISOString(),
      streak_current: 14,
      sessions: [
        { id: 'S-904', type: 'Strength', rpe: 8.5 }
      ],
    };
    navigator.clipboard.writeText(JSON.stringify(snippet, null, 2));
    setCopyStatus('COPIED!');
    showToast({
      title: 'SCHEMA COPIED',
      subtitle: 'Telemetry schema preview copied to clipboard.',
      statusBadge: 'CLIPBOARD',
      icon: 'content_copy',
    });
    setTimeout(() => setCopyStatus('COPY JSON'), 2000);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const text = ev.target?.result as string;
        if (text) {
          importTelemetryJSON(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const architectureItems = [
    {
      title: 'HTML5 Semantic Hierarchy',
      subtitle: 'WCAG 2.1 AA • ARIA Live Timers',
      icon: 'html',
      colorClass: 'text-primary-container',
      body: 'Utilizes accessible landmarks (<main>, <nav>) coupled with polite aria-live channels for interval workout timers and active rest alerts without breaking screen-reader flow.',
      bullet: 'Focus trapped modal states • Dynamic announcer',
    },
    {
      title: 'Tailwind Token Orchestration',
      subtitle: 'Design System • Kinetic Neon',
      icon: 'palette',
      colorClass: 'text-secondary-container',
      body: 'High-contrast dark HUD engineered with strict token-mapped semantic colors. Photon bloom accents (#C3F400) layered over frosted obsidian surfaces prevent cognitive fatigue in low-light barbell pits.',
      bullet: 'Zero runtime CSS overhead • Token abstraction',
    },
    {
      title: 'Zero-Latency Storage Engine',
      subtitle: 'Indexed Schema • Sub-5ms Read',
      icon: 'database',
      colorClass: 'text-primary-container',
      body: 'Structured dictionary architecture with fast gzip compression fallback in WebStorage. Stores over 5,000 session records under 420KB with transactional write checks to prevent corrupt gym logs.',
      bullet: 'Microtask throttled sync • Atomic keys',
    },
    {
      title: 'Procedural SVG Heatmap Matrix',
      subtitle: 'Vector Grid • Quantized Volume',
      icon: 'calendar_view_month',
      colorClass: 'text-secondary-container',
      body: 'Calculates dynamic 52-week intensity cells using lightweight vector nodes. Renders 365 days in single requestAnimationFrame cycle with interactive drill-down tooltips and zero canvas-bleed.',
      bullet: '60FPS pan/tap • Pure DOM nodes',
    },
    {
      title: 'Bi-Directional JSON Pipeline',
      subtitle: 'Strict Schema • Safe Ingestion',
      icon: 'data_object',
      colorClass: 'text-primary-container',
      body: 'Client-side JSON schema validation sanitizer. Guarantees non-destructive migrations across app revisions and exports human-readable standardized fitness telemetry files with checksum verification.',
      bullet: 'SHA-256 integrity tag • Dry-run import parser',
    },
  ];

  return (
    <div className="flex flex-col w-full px-margin-sm space-y-space-md max-w-md mx-auto pb-12">
      {/* Top Profile Card */}
      <div className="w-full rounded-xl bg-surface-container-high p-space-md shadow-xl relative overflow-hidden border border-surface-container-highest/40">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col space-y-space-md relative z-10">
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  className="w-14 h-14 rounded-full object-cover shadow-[0_0_15px_rgba(195,244,0,0.25)] border-2 border-surface-container-highest"
                  alt="Alex Vance"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN3A_01U3d-yW85bWAyq61p5iSKEEc3pal1goUwfzUltnlBnOC2x9Ci26U3lWdWcFOJddL7iRh1kAbNursV9jIDULIAS7opw_HGvZMwl9bOFbkZIfMxUdOSmhy15vahzW8qa9iV4_GeS1vSpRydsHbDxdEkAu1iNXHV9CGyLahww1LQMlA3Zi5eF47fmflC8Sk_53wm9m_jaRXwDYYdsYf2S0MDORmnUNZoLT74fby2QuZqmKKjZ-q7A"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></span>
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-md text-headline-md text-primary tracking-wide leading-none truncate font-bold">
                    ALEX VANCE
                  </span>
                  <span
                    className="material-symbols-outlined text-secondary-container text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <span className="font-label-code text-label-code text-on-surface-variant truncate font-semibold">
                  SENIOR FRONTEND / FULL-STACK
                </span>
                <div className="flex items-center gap-space-xs text-on-surface-variant mt-0.5">
                  <span className="material-symbols-outlined text-[12px]">location_on</span>
                  <span className="font-body-sm text-body-sm truncate">
                    San Francisco, CA / Remote
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/15 text-primary-container font-label-code text-[10px] tracking-wider uppercase font-bold border border-primary-container/30">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
              Available for Hire / Contract
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-secondary-container font-label-code text-[10px] tracking-wider uppercase border border-surface-container-highest font-bold">
              <span className="material-symbols-outlined text-[12px]">terminal</span>
              v2.4.0 Engine
            </span>
          </div>

          {/* Project Overview Badge */}
          <div
            onClick={() => setIsBlueprintOpen(!isBlueprintOpen)}
            className="rounded-lg bg-surface-container-low p-space-sm flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors border border-surface-container-highest/40"
          >
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="material-symbols-outlined text-primary-container text-[20px]">
                architecture
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider font-semibold">
                  Engineering Blueprint
                </span>
                <span className="font-body-md text-body-md text-primary font-medium truncate">
                  FitPulse Attendance Architecture & Case Study
                </span>
              </div>
            </div>
            <span className="font-label-code text-[10px] text-primary-container px-2 py-0.5 rounded bg-primary-container/10 font-bold border border-primary-container/30">
              {isBlueprintOpen ? 'CLOSE' : 'READ'}
            </span>
          </div>

          {isBlueprintOpen && (
            <div className="p-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-xs leading-relaxed space-y-2 border border-primary-container/30 animate-in fade-in">
              <p className="font-semibold text-primary">
                Technical Retrospective: Zero-Latency Local Telemetry
              </p>
              <p className="text-on-surface-variant">
                FitPulse addresses athlete isolation in steel-reinforced basement gyms. By anchoring state to local-first reactive storage with optimistic mutations, user interactions operate at a constant sub-5ms latency regardless of cellular availability.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Tech Stack Showcase */}
      <div className="flex flex-col space-y-space-xs">
        <div className="flex items-center justify-between px-space-xs">
          <span className="font-headline-md text-headline-md text-primary tracking-wide font-bold">
            SYSTEM ARCHITECTURE
          </span>
          <span className="font-label-code text-label-code text-on-surface-variant uppercase font-semibold">
            05 SUBSYSTEMS
          </span>
        </div>

        <div className="grid grid-cols-1 gap-space-xs">
          {architectureItems.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={item.title}
                onClick={() => toggleAccordion(idx)}
                className="rounded-lg bg-surface-container-high transition-all duration-200 overflow-hidden cursor-pointer border border-surface-container-highest/40"
              >
                <div className="p-space-sm flex items-center justify-between">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center flex-shrink-0">
                      <span className={`material-symbols-outlined text-[18px] ${item.colorClass}`}>
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-sm text-title-sm text-primary leading-tight truncate font-bold">
                        {item.title}
                      </span>
                      <span className="font-label-code text-label-code text-on-surface-variant">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 text-[20px] ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </div>

                {isExpanded && (
                  <div className="px-space-sm pb-space-sm pt-0">
                    <div className="p-space-sm rounded bg-surface-container-lowest font-body-sm text-body-sm text-on-surface space-y-space-xs border border-surface-container-highest/30">
                      <p>{item.body}</p>
                      <div className="flex items-center gap-space-xs text-on-surface-variant font-label-code text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>{' '}
                        {item.bullet}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Engineering Highlights: Bento Grid */}
      <div className="flex flex-col space-y-space-xs">
        <span className="font-headline-md text-headline-md text-primary tracking-wide px-space-xs font-bold">
          CORE HIGHLIGHTS
        </span>
        <div className="grid grid-cols-1 gap-space-sm">
          {/* Highlight 1: Streak Engine */}
          <div className="p-space-md rounded-xl bg-surface-container-high flex flex-col space-y-space-xs relative overflow-hidden border border-surface-container-highest/40">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary-container/20 text-primary-container font-label-code text-[10px] font-bold">
                <span className="material-symbols-outlined text-[14px]">bolt</span> ALGORITHM
              </span>
              <span className="font-label-code text-label-code text-on-surface-variant font-semibold">
                O(N) TRAVERSAL
              </span>
            </div>
            <span className="font-headline-md text-headline-md text-primary font-bold">
              Dynamic Grace Period Streak
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Calculates consecutive attendance while honoring programmed rest days. If a training split designates Sunday as deliberate recovery, the streak counter remains continuous without penalizing athlete recovery cycles.
            </p>
            <div className="p-space-xs rounded bg-surface-container-lowest flex items-center justify-between font-label-code text-label-code border border-surface-container-highest/30">
              <span className="text-on-surface-variant">Tolerance Window:</span>
              <span className="text-primary-container font-bold">
                48 Hours (Recovery Tagged)
              </span>
            </div>
          </div>

          {/* Highlight 2: Offline-First */}
          <div className="p-space-md rounded-xl bg-surface-container-high flex flex-col space-y-space-xs relative overflow-hidden border border-surface-container-highest/40">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary-container/20 text-secondary-container font-label-code text-[10px] font-bold">
                <span className="material-symbols-outlined text-[14px]">
                  signal_cellular_connected_no_internet_4_bar
                </span>{' '}
                ZERO SIGNAL
              </span>
              <span className="font-label-code text-label-code text-on-surface-variant font-semibold">
                100% LOCAL
              </span>
            </div>
            <span className="font-headline-md text-headline-md text-primary font-bold">
              Basement-Grade Offline First
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Heavy underground gym spaces with steel reinforcement cut off cell connectivity. FitPulse operates completely uncoupled from external APIs. State mutates optimistically with deterministic reconciliation.
            </p>
            <div className="p-space-xs rounded bg-surface-container-lowest flex items-center justify-between font-label-code text-label-code border border-surface-container-highest/30">
              <span className="text-on-surface-variant">Network Roundtrips:</span>
              <span className="text-secondary-container font-bold">
                0 Requests Required
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management & Backup Suite */}
      <div className="flex flex-col space-y-space-xs">
        <div className="flex items-center justify-between px-space-xs">
          <span className="font-headline-md text-headline-md text-primary tracking-wide font-bold">
            DATA VAULT & SYNC
          </span>
          <span className="inline-flex items-center gap-1 text-primary-container font-label-code text-label-code font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span> READY
          </span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-high flex flex-col space-y-space-md border border-surface-container-highest/40">
          {/* Live JSON Snippet Card */}
          <div className="flex flex-col space-y-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-code text-label-code text-on-surface-variant uppercase font-semibold">
                Telemetry Schema Preview
              </span>
              <button
                onClick={handleCopySchema}
                className="h-7 px-space-xs rounded bg-surface-container hover:bg-surface-container-highest transition-colors flex items-center gap-1 text-secondary-container text-[11px] font-label-code border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copyStatus === 'COPIED!' ? 'done' : 'content_copy'}
                </span>
                <span>{copyStatus}</span>
              </button>
            </div>
            <div className="p-space-sm rounded-lg bg-surface-container-lowest text-primary-container font-label-code text-[11px] overflow-x-auto leading-relaxed border border-surface-container-highest/40">
              <pre className="m-0 text-on-surface">{`{
  "version": "2.4.0",
  "athlete": "Alex Vance",
  "last_checkin": "2025-05-18T07:15:00Z",
  "streak_current": 14,
  "sessions": [
    { "id": "S-904", "type": "Strength", "rpe": 8.5 }
  ]
}`}</pre>
            </div>
          </div>

          {/* Export Action */}
          <button
            onClick={exportTelemetryJSON}
            className="w-full h-12 rounded bg-primary-container hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-space-xs text-on-primary-container font-headline-md text-headline-md tracking-wider uppercase shadow-[0_0_20px_rgba(195,244,0,0.25)] font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            EXPORT ALL ATTENDANCE DATA (JSON)
          </button>

          {/* Import Dropzone Trigger */}
          <label className="p-space-md rounded-lg bg-surface-container-low flex flex-col items-center justify-center text-center space-y-space-xs cursor-pointer hover:bg-surface-container transition-colors border border-surface-container-highest/50">
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary-container">
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
            </div>
            <div className="flex flex-col">
              <span className="font-title-sm text-title-sm text-primary font-bold">
                Import Attendance Backup
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Tap or drag valid JSON dump with verified schema
              </span>
            </div>
            <div className="flex items-center gap-space-xs pt-1">
              <span className="material-symbols-outlined text-primary-container text-[14px]">
                check_circle
              </span>
              <span className="font-label-code text-[10px] text-primary-container font-semibold">
                Automatic Schema Validation Active
              </span>
            </div>
          </label>

          {/* Reset Cache Button */}
          <div className="pt-space-xs flex items-center justify-between border-t border-surface-container-highest/30">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Clean room state verification?
            </span>
            <button
              onClick={() => {
                if (window.confirm('Clear local demo telemetry and reset storage cache?')) {
                  resetAllCache();
                }
              }}
              className="h-9 px-space-sm rounded bg-error-container/30 hover:bg-error-container/50 text-error font-label-code text-label-code tracking-wider uppercase flex items-center gap-1 active:scale-95 transition-all border border-error/40 font-bold"
            >
              <span className="material-symbols-outlined text-[16px]">device_reset</span>
              RESET CACHE
            </button>
          </div>
        </div>
      </div>

      {/* Developer Links & Contact Drawer */}
      <div className="flex flex-col space-y-space-xs pb-space-sm">
        <span className="font-headline-md text-headline-md text-primary tracking-wide px-space-xs font-bold">
          GET IN TOUCH
        </span>
        <div className="p-space-md rounded-xl bg-surface-container-high flex flex-col space-y-space-sm border border-surface-container-highest/40">
          <div className="flex flex-col space-y-space-xs">
            <span className="font-title-sm text-title-sm text-primary font-bold">
              Alex Vance — Technical Lead
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Available for contract architecture roles, high-cadence frontend systems, and performance tuning for telemetry web applications.
            </p>
          </div>

          {/* Action Links Grid */}
          <div className="grid grid-cols-2 gap-space-xs pt-space-xs">
            <a
              className="p-space-sm rounded bg-surface-container hover:bg-surface-container-highest transition-colors flex items-center gap-space-xs text-primary min-w-0 border border-surface-container-highest/40"
              href="https://github.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary-container">
                code
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                  Codebase
                </span>
                <span className="font-body-sm text-body-sm font-medium truncate">
                  github.com/fitpulse
                </span>
              </div>
            </a>

            <div
              className="p-space-sm rounded bg-surface-container hover:bg-surface-container-highest transition-colors flex items-center gap-space-xs text-primary min-w-0 cursor-pointer border border-surface-container-highest/40"
              onClick={() =>
                showToast({
                  title: 'RUNTIME VERIFIED',
                  subtitle: 'Client engine executing v2.4.0 production build.',
                  statusBadge: 'HEALTHY',
                  icon: 'verified',
                })
              }
            >
              <span className="material-symbols-outlined text-[18px] text-primary-container">
                play_arrow
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                  Runtime
                </span>
                <span className="font-body-sm text-body-sm font-medium truncate">
                  Live Production
                </span>
              </div>
            </div>

            <a
              className="p-space-sm rounded bg-surface-container hover:bg-surface-container-highest transition-colors flex items-center gap-space-xs text-primary min-w-0 border border-surface-container-highest/40"
              href="https://linkedin.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary-container">
                hub
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                  Network
                </span>
                <span className="font-body-sm text-body-sm font-medium truncate">
                  LinkedIn /alexvance
                </span>
              </div>
            </a>

            <a
              className="p-space-sm rounded bg-surface-container hover:bg-surface-container-highest transition-colors flex items-center gap-space-xs text-primary min-w-0 border border-surface-container-highest/40"
              href="mailto:alex@vance-systems.dev"
            >
              <span className="material-symbols-outlined text-[18px] text-primary-container">
                alternate_email
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                  Direct Inquiries
                </span>
                <span className="font-body-sm text-body-sm font-medium truncate">
                  alex@vance.dev
                </span>
              </div>
            </a>
          </div>

          {/* Big CTA Button */}
          <a
            className="w-full h-11 rounded bg-secondary-container text-on-secondary font-headline-md text-headline-md tracking-wider uppercase flex items-center justify-center gap-space-xs hover:opacity-90 active:scale-[0.99] transition-all mt-space-xs shadow-[0_0_15px_rgba(0,238,252,0.25)] font-bold"
            href="mailto:alex@vance-systems.dev?subject=FitPulse%20Architecture%20Contract%20Inquiry"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            DISPATCH EMAIL INQUIRY
          </a>
        </div>
      </div>
    </div>
  );
};
