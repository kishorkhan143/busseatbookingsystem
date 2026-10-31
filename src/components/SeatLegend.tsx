import React from 'react';
import { Armchair, Disc } from 'lucide-react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="relative overflow-hidden liquid-glass rounded-2xl p-2.5 sm:p-3.5 mb-3 transition-colors">
      <div className="relative flex flex-wrap items-center justify-between sm:justify-around gap-2.5 sm:gap-3 text-xs">
        {/* Available */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shadow-xs">
            <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs">Available</span>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">₹150</p>
          </div>
        </div>

        {/* Selected */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-b from-cyan-500 to-blue-600 border border-white/40 flex items-center justify-center text-white font-bold shadow-xs">
            <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs">Selected</span>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-300 font-medium">Your choice</p>
          </div>
        </div>

        {/* Booked */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-slate-200/60 dark:bg-white/[0.05] border border-slate-300/60 dark:border-white/[0.08] flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold">
            <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs">Booked</span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Unavailable</p>
          </div>
        </div>

        {/* Driver Cabin */}
        <div className="hidden md:flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-white/60 dark:bg-white/[0.06] border border-white/60 dark:border-white/[0.1] flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Disc className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <span className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium">Driver Cabin</span>
        </div>
      </div>
    </div>
  );
};
