import React from 'react';
import { Armchair, Disc } from 'lucide-react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="relative overflow-hidden backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-2.5 sm:p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.25)] mb-4">
      {/* Subtle glass reflection highlight */}
      <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

      <div className="relative flex flex-wrap items-center justify-between sm:justify-around gap-2.5 sm:gap-3 text-xs">
        {/* Available */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-emerald-500/[0.12] border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)] backdrop-blur-md">
            <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-200 text-[11px] sm:text-xs">Available</span>
            <p className="text-[10px] text-emerald-400">₹150</p>
          </div>
        </div>

        {/* Selected */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-gradient-to-b from-cyan-500/80 to-blue-600/90 border border-cyan-300 flex items-center justify-center text-white font-bold shadow-[0_0_12px_rgba(34,211,238,0.4)] backdrop-blur-md">
            <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-200 text-[11px] sm:text-xs">Selected</span>
            <p className="text-[10px] text-cyan-300">Your choice</p>
          </div>
        </div>

        {/* Booked */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-500 font-bold opacity-60 backdrop-blur-sm">
            <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-400 text-[11px] sm:text-xs">Booked</span>
            <p className="text-[10px] text-slate-500">Unavailable</p>
          </div>
        </div>

        {/* Driver Cabin */}
        <div className="hidden md:flex items-center gap-2 text-slate-400">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-300 backdrop-blur-sm">
            <Disc className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-[11px] sm:text-xs text-slate-400">Steering Cabin</span>
        </div>
      </div>
    </div>
  );
};
