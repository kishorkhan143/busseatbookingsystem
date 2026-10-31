import React from 'react';
import { Armchair, Check, Lock } from 'lucide-react';
import { SeatItem } from '../utils/bookingRules';

interface SeatProps {
  seat: SeatItem;
  isSelected: boolean;
  onToggle: (seatId: string, isAvailable: boolean) => void;
}

export const Seat: React.FC<SeatProps> = ({ seat, isSelected, onToggle }) => {
  const isBooked = seat.status === 'BOOKED';
  const isAvailable = seat.status === 'AVAILABLE';

  let buttonClass =
    'relative group flex flex-col items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer select-none border ';

  if (isSelected) {
    // Vibrant Selected (Cyan-Blue Gradient)
    buttonClass +=
      'bg-gradient-to-b from-cyan-500 to-blue-600 border-cyan-400 text-white shadow-md shadow-cyan-500/30 dark:shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-[1.04] backdrop-blur-md ring-2 ring-cyan-400/50';
  } else if (isAvailable) {
    // Available: crisp emerald in light mode, glowing frosted emerald in dark mode
    buttonClass +=
      'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 hover:border-emerald-500 text-emerald-800 shadow-xs dark:bg-emerald-500/[0.08] dark:hover:bg-emerald-500/[0.2] dark:border-emerald-500/40 dark:hover:border-emerald-400/80 dark:text-emerald-300 dark:hover:text-emerald-200 dark:shadow-[0_4px_16px_0_rgba(16,185,129,0.08)] backdrop-blur-md active:scale-95';
  } else {
    // Booked: muted neutral disabled state
    buttonClass +=
      'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.07] text-slate-400 dark:text-slate-500/60 cursor-not-allowed opacity-60 backdrop-blur-xs';
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(seat.seatId, isAvailable)}
      disabled={isBooked}
      aria-label={`Seat ${seat.seatId}, status: ${isSelected ? 'selected' : seat.status}, price: ₹${seat.price}`}
      title={
        isBooked
          ? `Seat ${seat.seatId} is booked`
          : isSelected
          ? `Seat ${seat.seatId} selected - click to deselect`
          : `Seat ${seat.seatId} available - ₹${seat.price}`
      }
      className={`${buttonClass} min-w-[36px] xs:min-w-[40px] sm:min-w-[48px] py-1.5 sm:py-2 px-1`}
    >
      {/* Subtle top reflection shine */}
      <div className="absolute inset-x-0 top-0 h-[35%] rounded-t-xl sm:rounded-t-2xl bg-gradient-to-b from-white/30 dark:from-white/[0.15] to-transparent pointer-events-none" />

      {/* Seat Icon / Indicator */}
      <div className="relative">
        <Armchair
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
            isSelected
              ? 'text-white scale-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]'
              : isAvailable
              ? 'text-emerald-600 dark:text-emerald-400 group-hover:scale-110'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        />

        {isSelected && (
          <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-cyan-300 text-slate-950 rounded-full flex items-center justify-center text-[8px] font-black shadow-xs">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        )}

        {isBooked && (
          <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full flex items-center justify-center text-[7px] border border-slate-300 dark:border-white/10">
            <Lock className="w-2 h-2" />
          </span>
        )}
      </div>

      {/* Seat ID Label */}
      <span className="text-[11px] sm:text-xs font-extrabold tracking-tight mt-0.5 z-10 text-slate-900 dark:text-white">
        {seat.seatId}
      </span>

      {/* Price Mini text */}
      <span className="text-[9px] sm:text-[10px] font-medium leading-tight z-10 text-slate-600 dark:text-slate-400">
        {isBooked ? 'Booked' : `₹${seat.price}`}
      </span>
    </button>
  );
};
