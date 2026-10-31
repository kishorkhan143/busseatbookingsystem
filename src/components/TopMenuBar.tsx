import React from 'react';
import { Bus, Search } from 'lucide-react';

export type NavTab = 'home' | 'ticket-booking' | 'my-bookings' | 'profile';

interface TopMenuBarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenSearch: () => void;
  availableSeatsCount?: number;
  totalBookingsCount?: number;
  userName?: string;
}

export const TopMenuBar: React.FC<TopMenuBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  userName = 'Kishor Khan',
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-slate-950/60 border-b border-white/[0.09] shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      {/* Top Edge Refraction Sheen */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Application Name */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none transition-transform duration-200 active:scale-95"
          role="button"
          tabIndex={0}
          aria-label="SeatEase Home"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setActiveTab('home');
          }}
        >
          {/* Liquid Glowing Logo */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-lg">
              <div className="w-full h-full rounded-[15px] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
                <Bus className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                Seat<span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">Ease</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Search Button and Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.1] hover:border-cyan-400/40 text-slate-300 hover:text-white text-xs font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Search Bookings or Routes"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xs:inline">Search</span>
            <kbd className="hidden md:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] border border-white/[0.1] text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Profile Shortcut */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full p-[1px] transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                : 'bg-white/[0.1] hover:bg-white/[0.2]'
            }`}
            title={`Profile: ${userName}`}
            aria-label="User Profile"
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <span className="text-[11px] font-bold text-cyan-300">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
