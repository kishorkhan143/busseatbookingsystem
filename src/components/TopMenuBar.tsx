import React from 'react';
import { Bus, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type NavTab = 'home' | 'ticket-booking' | 'homestays' | 'my-bookings' | 'profile';

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
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full shrink-0 z-30 liquid-glass-nav border-b border-white/60 dark:border-white/10 select-none transition-colors duration-200">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 h-12 sm:h-13 flex items-center justify-between w-full">
        {/* Left Side: Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform"
          role="button"
          tabIndex={0}
          aria-label="SeatEase Home"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setActiveTab('home');
          }}
        >
          <div className="relative w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_2px_8px_rgba(6,182,212,0.4)] border border-white/40">
            <div className="absolute inset-x-0 top-0 h-[40%] rounded-t-lg bg-white/30 pointer-events-none" />
            <Bus className="w-4 h-4 drop-shadow-xs" />
          </div>
          <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white">
            Seat<span className="text-cyan-600 dark:text-cyan-400">Ease</span>
          </span>
        </div>

        {/* Right Side: Theme, Search, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg liquid-glass-btn-secondary text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline text-[11px]">Dark</span>
              </>
            )}
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg liquid-glass-btn-secondary text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline text-[11px]">Search</span>
          </button>

          {/* Profile Shortcut */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer active:scale-95 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-[0_2px_8px_rgba(6,182,212,0.4)] border border-white/40'
                : 'liquid-glass-btn-secondary text-slate-700 dark:text-slate-200'
            }`}
            title={`Profile: ${userName}`}
            aria-label="User Profile"
          >
            {userName.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
};
