import React from 'react';
import { SeatItem, SEAT_PRICE, calculateTotalAmount } from '../utils/bookingRules';
import { Seat } from './Seat';
import { SeatLegend } from './SeatLegend';
import { Disc, ArrowRight, X, AlertTriangle, ShieldCheck, Bus, RefreshCw } from 'lucide-react';
import { BusService } from './BusList';

interface SeatGridProps {
  seats: SeatItem[];
  selectedSeatIds: string[];
  onToggleSeat: (seatId: string, isAvailable: boolean) => void;
  onClearSelection: () => void;
  onProceedToForm: () => void;
  onRefreshSeats: () => void;
  isLoadingSeats: boolean;
  bus?: BusService;
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
  onClearSelection,
  onProceedToForm,
  onRefreshSeats,
  isLoadingSeats,
  bus,
}) => {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const totalAmount = calculateTotalAmount(selectedSeatIds.length, SEAT_PRICE);

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Bus Header Bar */}
      <div className="bg-[#111C2E] border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {bus ? bus.name : 'SeatEase Sleeper Express (2+1)'}
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 30-Seat Bus Layout &bull; ₹{SEAT_PRICE} per seat &bull; Standard Luxury Coach
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshSeats}
            disabled={isLoadingSeats}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            title="Reload seat availability from Java database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSeats ? 'animate-spin text-cyan-400' : ''}`} />
            Refresh Layout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Visual Seating Layout */}
        <div className="lg:col-span-7 bg-[#111C2E] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          {/* Legend */}
          <SeatLegend />

          {/* Bus Physical Shell Visualization */}
          <div className="relative bg-slate-950/70 border-2 border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-inner max-w-lg mx-auto">
            {/* Front Screen / Windshield & Driver Cabin */}
            <div className="border-b-2 border-dashed border-slate-700 pb-4 mb-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  <span>FRONT / SCREEN INDICATOR</span>
                </div>

                {/* Driver Steering wheel */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold shadow-sm">
                  <Disc className="w-4 h-4 text-cyan-400" />
                  <span>DRIVER</span>
                </div>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent mt-3 rounded-full" />
            </div>

            {/* 30-Seat Grid: 5 Rows (A to E) with 6 Seats per row */}
            <div className="space-y-4">
              {rows.map((rowName) => {
                const rowSeats = seats.filter((s) => s.rowName === rowName);

                // Split into 3 seats, aisle walkway, 3 seats
                const leftBatch = rowSeats.slice(0, 3);
                const rightBatch = rowSeats.slice(3, 6);

                return (
                  <div key={rowName} className="flex items-center justify-between gap-1 sm:gap-2">
                    {/* Row Indicator Badge */}
                    <div className="w-6 text-center text-xs font-black text-cyan-400/80">
                      {rowName}
                    </div>

                    {/* Left 3 Seats (e.g. 1, 2, 3) */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 flex-1">
                      {leftBatch.map((seat) => (
                        <Seat
                          key={seat.seatId}
                          seat={seat}
                          isSelected={selectedSeatIds.includes(seat.seatId)}
                          onToggle={onToggleSeat}
                        />
                      ))}
                    </div>

                    {/* Walkway Aisle */}
                    <div className="w-6 sm:w-8 flex flex-col items-center justify-center text-[10px] uppercase font-bold text-slate-600 tracking-tighter">
                      <span className="hidden sm:inline">AISLE</span>
                    </div>

                    {/* Right 3 Seats (e.g. 4, 5, 6) */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 flex-1">
                      {rightBatch.map((seat) => (
                        <Seat
                          key={seat.seatId}
                          seat={seat}
                          isSelected={selectedSeatIds.includes(seat.seatId)}
                          onToggle={onToggleSeat}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rear of the Bus */}
            <div className="mt-6 pt-3 border-t border-slate-800 text-center text-[11px] text-slate-500 font-medium">
              &bull; REAR EXIT &amp; EMERGENCY DOOR &bull;
            </div>
          </div>
        </div>

        {/* Right: Selection Summary & Continue Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#111C2E] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl sticky top-20">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Booking Summary</span>
              {selectedSeatIds.length > 0 && (
                <button
                  onClick={onClearSelection}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear All
                </button>
              )}
            </h3>

            {/* Selected Seats Pills */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-400 mb-2">Selected Seats:</p>
              {selectedSeatIds.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSeatIds.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/30 border border-blue-500 text-cyan-300 text-xs font-bold"
                    >
                      {id}
                      <button
                        onClick={() => onToggleSeat(id, true)}
                        className="hover:text-white"
                        aria-label={`Remove seat ${id}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-dashed border-slate-800 text-slate-400 text-xs text-center">
                  No seats selected yet. Click on any green seat to select.
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Number of Seats:</span>
                <span className="font-bold text-white">{selectedSeatIds.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Base Price per Seat:</span>
                <span className="font-bold text-white">₹{SEAT_PRICE}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Taxes &amp; Convenience:</span>
                <span className="text-emerald-400 font-semibold">₹0.00 (Waived)</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total Amount:</span>
                <span className="text-2xl font-black text-cyan-400">
                  ₹{totalAmount}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                *Final amount calculated safely on the Java backend.
              </p>
            </div>

            {/* Validation Notice or Action Button */}
            <div className="mt-6">
              {selectedSeatIds.length === 0 ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 text-amber-300 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Please select at least 1 seat to proceed.</span>
                </div>
              ) : (
                <button
                  onClick={onProceedToForm}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Continue to Passenger Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Trust badge */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ACID Pessimistic Locking prevents double-booking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
