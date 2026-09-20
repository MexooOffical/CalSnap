import React from 'react';
import { Home, BookOpen, TrendingUp, User, Camera } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'diary' | 'progress' | 'profile';
  onSelectTab: (tab: 'home' | 'diary' | 'progress' | 'profile') => void;
  onOpenScan: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenScan,
}) => {
  return (
    <div
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-4 pt-1 pointer-events-none"
    >
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-3xl border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-4 py-2 flex items-center justify-between">
        {/* Home */}
        <button
          id="nav-tab-home"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center w-12 py-1 transition-all ${
            activeTab === 'home' ? 'text-zinc-900 font-semibold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Today</span>
        </button>

        {/* Diary */}
        <button
          id="nav-tab-diary"
          onClick={() => onSelectTab('diary')}
          className={`flex flex-col items-center justify-center w-12 py-1 transition-all ${
            activeTab === 'diary' ? 'text-zinc-900 font-semibold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'diary' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Diary</span>
        </button>

        {/* Central Prominent SCAN button */}
        <button
          id="nav-btn-scan-primary"
          onClick={onOpenScan}
          className="relative -top-3 flex items-center justify-center w-14 h-14 rounded-full bg-zinc-900 text-white shadow-[0_6px_20px_rgba(24,24,27,0.35)] hover:scale-105 active:scale-95 transition-transform"
          aria-label="Scan food with AI"
        >
          <Camera className="w-6 h-6 stroke-[2.2]" />
        </button>

        {/* Progress */}
        <button
          id="nav-tab-progress"
          onClick={() => onSelectTab('progress')}
          className={`flex flex-col items-center justify-center w-12 py-1 transition-all ${
            activeTab === 'progress' ? 'text-zinc-900 font-semibold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <TrendingUp className={`w-5 h-5 ${activeTab === 'progress' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Progress</span>
        </button>

        {/* Profile */}
        <button
          id="nav-tab-profile"
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center w-12 py-1 transition-all ${
            activeTab === 'profile' ? 'text-zinc-900 font-semibold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
        </button>
      </div>
    </div>
  );
};
