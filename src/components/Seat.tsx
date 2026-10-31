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
    // Glassmorphic Selected (Vibrant Glowing Cyan / Blue Glass)
    buttonClass +=
      'bg-gradient-to-b from-cyan-500/85 to-blue-600/90 border-cyan-300/90 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-[1.04] backdrop-blur-md ring-2 ring-cyan-400/40';
  } else if (isAvailable) {
    // Glassmorphic Available (Subtle Frosted Emerald Glass)
    buttonClass +=
      'bg-emerald-500/[0.07] hover:bg-emerald-500/[0.18] border-emerald-500/40 hover:border-emerald-400/80 text-emerald-300 hover:text-emerald-200 shadow-[0_4px_16px_0_rgba(16,185,129,0.08)] hover:shadow-[0_0_16px_rgba(16,185,129,0.3)] backdrop-blur-md active:scale-95';
  } else {
    // Glassmorphic Booked (Frosted Slate Glass Disabled)
    buttonClass +=
      'bg-white/[0.03] border-white/[0.07] text-slate-500/60 cursor-not-allowed opacity-40 backdrop-blur-xs';
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
      {/* Subtle top glass reflection shine */}
      <div className="absolute inset-x-0 top-0 h-[35%] rounded-t-xl sm:rounded-t-2xl bg-gradient-to-b from-white/[0.15] to-transparent pointer-events-none" />

      {/* Seat Icon / Indicator */}
      <div className="relative">
        <Armchair
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
            isSelected
              ? 'text-white scale-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]'
              : isAvailable
              ? 'text-emerald-400 group-hover:scale-110'
              : 'text-slate-500'
          }`}
        />

        {isSelected && (
          <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-cyan-300 text-slate-950 rounded-full flex items-center justify-center text-[8px] font-black shadow-sm">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        )}

        {isBooked && (
          <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-[7px] border border-white/10">
            <Lock className="w-2 h-2" />
          </span>
        )}
      </div>

      {/* Seat ID Label */}
      <span className="text-[11px] sm:text-xs font-extrabold tracking-tight mt-0.5 z-10">
        {seat.seatId}
      </span>

      {/* Price Mini text */}
      <span className="text-[9px] sm:text-[10px] font-medium opacity-85 leading-tight z-10">
        {isBooked ? 'Booked' : `₹${seat.price}`}
      </span>
    </button>
  );
};
