import React from 'react';
import { Home, Armchair, Ticket, User } from 'lucide-react';
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
    { id: 'ticket-booking', label: 'Ticket Booking', icon: Armchair },
    {
      id: 'my-bookings',
      label: 'My Bookings',
      icon: Ticket,
      badge: bookingsCount > 0 ? bookingsCount : undefined,
    },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] select-none"
      aria-label="Bottom Navigation Menu"
    >
      {/* Floating Liquid Glass Dock */}
      <div className="relative backdrop-blur-2xl bg-slate-950/80 border border-white/15 rounded-full p-1.5 sm:p-2 shadow-[0_12px_40px_rgba(0,0,0,0.65)] ring-1 ring-white/10 flex items-center gap-1 sm:gap-2">
        {/* Subtle Ambient Backglow */}
        <div className="absolute -inset-1 rounded-full bg-cyan-500/10 blur-xl pointer-events-none -z-10" />

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all duration-300 ease-out cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/30 via-blue-600/35 to-indigo-600/30 border border-cyan-400/60 text-white shadow-[0_0_20px_rgba(34,211,238,0.35)] backdrop-blur-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {/* Icon with Glow when Active */}
              <div className="relative">
                <Icon
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all duration-200 ${
                    isActive
                      ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-110'
                      : 'text-slate-400'
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`whitespace-nowrap transition-opacity duration-200 ${
                  isActive ? 'block' : 'hidden md:block'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
