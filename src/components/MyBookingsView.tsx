import React, { useState } from 'react';
import {
  Ticket,
  Search,
  Armchair,
  Building2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Printer,
  Loader2,
  X,
  ExternalLink,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import { BookingData } from '../services/api';
import { NavTab } from './TopMenuBar';

interface MyBookingsViewProps {
  bookings: BookingData[];
  onCancelBooking: (bookingId: number) => Promise<void>;
  onNavigate: (tab: NavTab) => void;
  isLoading: boolean;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onCancelBooking,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BUS' | 'HOMESTAY' | 'CANCELLED'>('ALL');
  // Inline pass display (NO OVERLAY)
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<BookingData | null>(null);

  // Cancellation state
  const [bookingIdToCancel, setBookingIdToCancel] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.trim().toLowerCase();
    const isHomestay = b.bookingType === 'HOMESTAY';

    const matchesSearch =
      !q ||
      b.pnr.toLowerCase().includes(q) ||
      String(b.bookingId).includes(q) ||
      b.customer.name.toLowerCase().includes(q) ||
      b.customer.mobile.includes(q) ||
      (b.seatIds && b.seatIds.some((s) => s.toLowerCase().includes(q))) ||
      (b.from && b.from.toLowerCase().includes(q)) ||
      (b.to && b.to.toLowerCase().includes(q)) ||
      (b.stayName && b.stayName.toLowerCase().includes(q));

    let matchesFilter = true;
    if (statusFilter === 'CANCELLED') {
      matchesFilter = b.bookingStatus === 'CANCELLED';
    } else if (statusFilter === 'BUS') {
      matchesFilter = b.bookingType !== 'HOMESTAY' && b.bookingStatus !== 'CANCELLED';
    } else if (statusFilter === 'HOMESTAY') {
      matchesFilter = isHomestay && b.bookingStatus !== 'CANCELLED';
    }

    return matchesSearch && matchesFilter;
  });

  const handleConfirmCancel = async (booking: BookingData) => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      await onCancelBooking(booking.bookingId);
      setCancelFeedback(
        booking.bookingType === 'HOMESTAY'
          ? `Homestay #${booking.bookingId} cancelled.`
          : `Ticket #${booking.bookingId} cancelled.`
      );
      setBookingIdToCancel(null);
    } catch (err: unknown) {
      setCancelError(err instanceof Error ? err.message : 'Cancellation failed.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-3.5 sm:gap-5 animate-fade-in pb-4">
      {/* 1. If viewing Boarding Pass / Voucher inline (NO OVERLAY - Apple Liquid Glass) */}
      {selectedBookingForPass ? (
        <div className="w-full flex flex-col gap-3 animate-scale-in">
          <div className="flex items-center justify-between p-3 rounded-2xl liquid-glass-card">
            <button
              type="button"
              onClick={() => setSelectedBookingForPass(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Back to Bookings</span>
            </button>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {selectedBookingForPass.bookingType === 'HOMESTAY' ? 'Stay Voucher' : 'Boarding Pass'}
            </span>
          </div>

          <div className="p-4 sm:p-6 rounded-3xl liquid-glass-card flex flex-col gap-3.5 max-w-lg mx-auto w-full">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">PNR / ID</span>
              <span className="font-mono font-black text-cyan-700 dark:text-cyan-300 text-base">
                {selectedBookingForPass.pnr}
              </span>
            </div>

            {selectedBookingForPass.bookingType === 'HOMESTAY' ? (
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Property:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedBookingForPass.stayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Location:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedBookingForPass.stayLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Dates:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedBookingForPass.checkInDate} &rarr; {selectedBookingForPass.checkOutDate} ({selectedBookingForPass.nights}N)
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Route:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedBookingForPass.from} &rarr; {selectedBookingForPass.to}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Bus:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedBookingForPass.busName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Departure:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedBookingForPass.departureTime} &bull; {selectedBookingForPass.journeyDate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Seats:</span>
                  <div className="flex gap-1 flex-wrap">
                    {selectedBookingForPass.seatIds?.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-[10px] shadow-xs border border-white/30">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200/50 dark:border-white/5 flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Guest:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {selectedBookingForPass.customer.name} (+91 {selectedBookingForPass.customer.mobile})
              </span>
            </div>

            <div className="flex justify-between items-center font-bold text-xs pt-1 border-t border-slate-200/50 dark:border-white/5">
              <span className="text-slate-900 dark:text-white">Paid:</span>
              <span className="text-cyan-700 dark:text-cyan-300 text-sm">
                ₹{selectedBookingForPass.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl liquid-glass-btn-secondary text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedBookingForPass(null)}
                className="flex-1 py-2 rounded-xl liquid-glass-btn-primary text-white text-xs font-bold flex items-center justify-center cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Main Bookings List */
        <>
          {/* Header Strip */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl liquid-glass-card">
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>My Bookings</span>
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Active tickets and reservations
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onNavigate('ticket-booking')}
                className="px-3 py-1 rounded-xl liquid-glass-btn-primary text-white text-[11px] font-bold cursor-pointer active:scale-95"
              >
                + Bus
              </button>
              <button
                type="button"
                onClick={() => onNavigate('homestays')}
                className="px-3 py-1 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 border border-white/30 text-white text-[11px] font-bold cursor-pointer active:scale-95 shadow-xs"
              >
                + Stay
              </button>
            </div>
          </div>

          {/* Feedback banners */}
          {cancelFeedback && (
            <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between backdrop-blur-md">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {cancelFeedback}
              </span>
              <button onClick={() => setCancelFeedback(null)} className="cursor-pointer">&times;</button>
            </div>
          )}

          {cancelError && (
            <div className="p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-center justify-between backdrop-blur-md">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {cancelError}
              </span>
              <button onClick={() => setCancelError(null)} className="cursor-pointer">&times;</button>
            </div>
          )}

          {/* Search & Filter */}
          <div className="p-2.5 sm:p-3 rounded-2xl liquid-glass-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search PNR, city, name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-bold">
              {(['ALL', 'BUS', 'HOMESTAY', 'CANCELLED'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === tab
                      ? 'liquid-glass-btn-primary text-white'
                      : 'liquid-glass-btn-secondary text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab === 'BUS' ? 'Buses' : tab === 'HOMESTAY' ? 'Stays' : 'Cancelled'}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List in Compact Rectangular Format */}
          {filteredBookings.length > 0 ? (
            <div className="flex flex-col gap-2">
              {filteredBookings.map((b) => {
                const isHomestay = b.bookingType === 'HOMESTAY';
                const isCancellingThis = bookingIdToCancel === b.bookingId;

                return (
                  <div
                    key={b.bookingId}
                    className="p-3 sm:p-4 rounded-2xl liquid-glass-card flex flex-col gap-2.5"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 dark:text-white text-xs sm:text-base">
                          {b.pnr}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                            isHomestay 
                              ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30' 
                              : 'bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border-cyan-500/30'
                          }`}
                        >
                          {isHomestay ? 'Stay' : 'Bus'}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          b.bookingStatus === 'CONFIRMED'
                            ? 'bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/10 dark:bg-rose-400/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </div>

                    {/* Middle details: clean, spacious horizontal layout */}
                    <div className="flex items-center justify-between text-xs py-1.5 border-t border-slate-200/50 dark:border-white/5">
                      <div className="truncate flex-1 pr-3">
                        {isHomestay ? (
                          <>
                            <h4 className="font-bold text-slate-900 dark:text-white truncate text-xs sm:text-sm">
                              {b.stayName}
                            </h4>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                              {b.checkInDate} to {b.checkOutDate} ({b.nights} {b.nights === 1 ? 'night' : 'nights'})
                            </span>
                          </>
                        ) : (
                          <>
                            <h4 className="font-bold text-slate-900 dark:text-white truncate text-xs sm:text-sm">
                              {b.from} &rarr; {b.to}
                            </h4>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                              Seats: {b.seatIds?.join(', ')}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-base font-black text-slate-900 dark:text-white">
                          ₹{b.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>


                    {/* Inline Cancel Prompt OR Action Buttons */}
                    {isCancellingThis ? (
                      <div className="p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-2 text-xs backdrop-blur-md">
                        <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300">
                          Cancel this booking?
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setBookingIdToCancel(null)}
                            disabled={isCancelling}
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                          >
                            Keep
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmCancel(b)}
                            disabled={isCancelling}
                            className="px-2.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold cursor-pointer disabled:opacity-50"
                          >
                            {isCancelling ? 'Cancelling...' : 'Confirm'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForPass(b)}
                          className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{isHomestay ? 'View Voucher' : 'Boarding Pass'}</span>
                        </button>

                        {b.bookingStatus === 'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() => setBookingIdToCancel(b.bookingId)}
                            className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-2">
              <Ticket className="w-8 h-8 text-slate-400" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No bookings found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
