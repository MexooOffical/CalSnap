import React from 'react';

interface CalAiNavigationProps {
  activeTab: 'home' | 'analytics' | 'settings' | 'diary' | 'progress' | 'profile';
  onSelectTab: (tab: 'home' | 'analytics' | 'settings') => void;
  onOpenScan: () => void;
}

export const CalAiNavigation: React.FC<CalAiNavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenScan,
}) => {
  const isHomeActive = activeTab === 'home' || activeTab === 'diary';
  const isAnalyticsActive = activeTab === 'analytics' || activeTab === 'progress';
  const isSettingsActive = activeTab === 'settings' || activeTab === 'profile';

  return (
    <div
      id="cal-ai-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-[390px] mx-auto bg-white/95 backdrop-blur-xl border-t border-black/[0.04] px-5 pt-1.5 pb-2 select-none"
    >
      <div className="flex items-center justify-between">
        {/* Left 3 items: Home, Analytics, Settings */}
        <div className="flex items-center gap-7 pl-1">
          {/* Home */}
          <button
            id="nav-tab-home"
            onClick={() => onSelectTab('home')}
            className={`flex flex-col items-center justify-center transition-all ${
              isHomeActive
                ? 'text-black font-semibold'
                : 'text-zinc-400 hover:text-zinc-600 font-normal'
            }`}
          >
            {/* Outline house with doorway */}
            <svg
              className={`w-6 h-6 ${isHomeActive ? 'stroke-[2]' : 'stroke-[1.6]'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20v-9.5z" />
              <path d="M9.5 21.5V13h5v8.5" />
            </svg>
            <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          </button>

          {/* Analytics (Exact 3-bar icon from screenshot) */}
          <button
            id="nav-tab-analytics"
            onClick={() => onSelectTab('analytics')}
            className={`flex flex-col items-center justify-center transition-all ${
              isAnalyticsActive
                ? 'text-black font-semibold'
                : 'text-zinc-400 hover:text-zinc-600 font-normal'
            }`}
          >
            <svg
              className={`w-6 h-6 ${isAnalyticsActive ? 'stroke-[2]' : 'stroke-[1.6]'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="11" width="4.5" height="10" rx="1.5" />
              <rect x="9.75" y="4" width="4.5" height="17" rx="1.5" />
              <rect x="15.5" y="14" width="4.5" height="7" rx="1.5" />
            </svg>
            <span className="text-[10px] mt-0.5 tracking-tight">Analytics</span>
          </button>

          {/* Settings */}
          <button
            id="nav-tab-settings"
            onClick={() => onSelectTab('settings')}
            className={`flex flex-col items-center justify-center transition-all ${
              isSettingsActive
                ? 'text-black font-semibold'
                : 'text-zinc-400 hover:text-zinc-600 font-normal'
            }`}
          >
            <svg
              className={`w-6 h-6 ${isSettingsActive ? 'stroke-[2]' : 'stroke-[1.6]'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span className="text-[10px] mt-0.5 tracking-tight">Settings</span>
          </button>
        </div>

        {/* Elevated Floating Circular Black Plus Button on the Right */}
        <button
          id="nav-btn-plus-scan"
          onClick={onOpenScan}
          className="w-12 h-12 rounded-full bg-[#141416] hover:bg-black text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.22)] active:scale-95 transition-transform cursor-pointer shrink-0 mr-1"
          aria-label="Scan or upload meal"
          title="Scan or upload food"
        >
          <svg className="w-5 h-5 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-32 h-1 bg-black rounded-full mx-auto mt-2 mb-0.5" />
    </div>
  );
};
