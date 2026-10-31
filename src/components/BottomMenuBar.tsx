import React from 'react';
import { Home, Armchair, Building2, Ticket, User } from 'lucide-react';
import { NavTab } from './TopMenuBar';

interface BottomMenuBarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  bookingsCount: number;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const BottomMenuBar: React.FC<BottomMenuBarProps> = ({
  activeTab,
  setActiveTab,
  bookingsCount,
}) => {
  const items: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ticket-booking', label: 'Buses', icon: Armchair },
    { id: 'homestays', label: 'Stays', icon: Building2 },
    {
      id: 'my-bookings',
      label: 'Bookings',
      icon: Ticket,
      badge: bookingsCount > 0 ? bookingsCount : undefined,
    },
    { id: 'profile', label: 'Profile', icon: User },
  ];


  return (
    <nav
      className="shrink-0 w-full z-40 bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] select-none"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
      aria-label="Bottom Navigation Menu"
    >
      <div className="max-w-[1280px] mx-auto px-2 sm:px-6 pt-1.5 pb-1 flex items-center justify-center">
        {/* Fixed static tab bar container */}
        <div className="flex items-center justify-between w-full max-w-xl h-12 p-1 bg-slate-200/60 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                type="button"
                className={`relative flex-1 h-full flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-200 cursor-pointer min-w-0 active:scale-95 focus:outline-none ${
                  isActive
                    ? 'bg-white/95 dark:bg-white/[0.14] text-cyan-600 dark:text-cyan-300 font-bold shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] border border-white/80 dark:border-white/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-semibold'
                }`}
                aria-selected={isActive}
                role="tab"
              >
                {/* Active glossy shine */}
                {isActive && (
                  <div className="absolute inset-x-0 top-0 h-[45%] rounded-t-xl bg-gradient-to-b from-white/60 dark:from-white/20 to-transparent pointer-events-none" />
                )}

                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isActive ? 'stroke-[2.5] scale-110 text-cyan-600 dark:text-cyan-400 drop-shadow-xs' : 'stroke-[1.8]'
                    }`}
                  />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2.5 px-1 min-w-[14px] h-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[8px] font-black flex items-center justify-center shadow-xs border border-white/50">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className="text-[10px] truncate tracking-tight leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

