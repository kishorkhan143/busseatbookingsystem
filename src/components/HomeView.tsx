import React from 'react';
import {
  Armchair,
  ArrowRight,
  Star,
  Bus,
  Building2,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { POPULAR_ROUTES, PopularRoute, SAMPLE_HOMESTAYS } from '../services/api';
import { NavTab } from './TopMenuBar';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenSearch?: () => void;
  onSelectRoute?: (from: string, to: string, routeId?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectRoute,
}) => {
  return (
    <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-3.5 sm:gap-5 animate-fade-in pb-4">
      {/* Concierge Banner: Sleek Apple Liquid Glass Bar */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-indigo-950/80 to-slate-900/90 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-2xl">
        {/* Subtle Specular Arc Highlight */}
        <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
        
        <div className="flex flex-col gap-1 relative z-10">
          <h1 className="text-base sm:text-xl font-black tracking-tight leading-tight">
            Book Bus Tickets &amp; Local Stays
          </h1>
        </div>

        {/* Dual Actions with Apple Liquid Glass Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => onNavigate('ticket-booking')}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl liquid-glass-btn-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Book Bus</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('homestays')}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 border border-white/30 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-[0_4px_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Home Stays</span>
          </button>
        </div>
      </section>

      {/* Popular Routes: Clean, Spacious Rectangular Liquid Glass Cards */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <Bus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Popular Routes</span>
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('ticket-booking')}
            className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {POPULAR_ROUTES.map((route: PopularRoute) => (
            <div
              key={route.id}
              className="p-3.5 sm:p-4 rounded-2xl liquid-glass-card flex flex-row items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-base truncate">
                    {route.from} &rarr; {route.to}
                  </span>
                  <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold shrink-0">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    <span>{route.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white block">
                    ₹{route.pricePerSeat}
                  </span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400">/ seat</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onSelectRoute) {
                      onSelectRoute(route.from, route.to, route.id);
                    } else {
                      onNavigate('ticket-booking');
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl liquid-glass-btn-primary text-white font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Armchair className="w-3.5 h-3.5" />
                  <span>Select</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Stays: Clean, Spacious Rectangular Liquid Glass Cards */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Curated Home Stays</span>
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('homestays')}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {SAMPLE_HOMESTAYS.slice(0, 3).map((stay) => (
            <div
              key={stay.id}
              className="p-3 sm:p-3.5 rounded-2xl liquid-glass-card flex flex-row items-center gap-3 sm:gap-4"
            >
              <div className="relative w-20 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-white/40 dark:border-white/10 shadow-xs">
                <img
                  src={stay.imageUrl}
                  alt={stay.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded-md bg-black/50 backdrop-blur-md border border-white/20 text-white text-[8px] font-semibold">
                  {stay.city}
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between h-full gap-2">
                <div className="flex items-center justify-between gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {stay.name}
                  </h3>
                  <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold shrink-0">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    <span>{stay.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50 dark:border-white/5">
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    ₹{stay.pricePerNight.toLocaleString('en-IN')}{' '}
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">/ night</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onNavigate('homestays')}
                    className="px-3 py-1 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 border border-white/30 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer active:scale-95 shrink-0 shadow-xs"
                  >
                    <span>Reserve</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
