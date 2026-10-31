import React, { useState } from 'react';
import {
  Ticket,
  Search,
  Calendar,
  Armchair,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Printer,
  Bus,
  Loader2,
  X,
  ExternalLink,
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
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<BookingData | null>(null);

  // Cancellation state
  const [bookingToCancel, setBookingToCancel] = useState<BookingData | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Filter bookings based on search & status
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      b.pnr.toLowerCase().includes(q) ||
      String(b.bookingId).includes(q) ||
      b.customer.name.toLowerCase().includes(q) ||
      b.customer.mobile.includes(q) ||
      b.seatIds.some((s) => s.toLowerCase().includes(q)) ||
      (b.from && b.from.toLowerCase().includes(q)) ||
      (b.to && b.to.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      await onCancelBooking(bookingToCancel.bookingId);
      setCancelFeedback(`Booking #${bookingToCancel.bookingId} cancelled and seats released.`);
      setBookingToCancel(null);
    } catch (err: unknown) {
      setCancelError(err instanceof Error ? err.message : 'Cancellation failed.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto animate-fade-in">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Ticket className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            <span>My Bookings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your bus tickets, view digital boarding passes, or cancel bookings in real time.
          </p>
        </div>

        <button
          onClick={() => onNavigate('ticket-booking')}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.35)] transition-all cursor-pointer active:scale-95"
        >
          <Armchair className="w-3.5 h-3.5" />
          <span>Book New Ticket</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by PNR (SE-1001), Seat (A1), Passenger, or Route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.08] self-start md:self-auto">
          {(['ALL', 'CONFIRMED', 'CANCELLED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter === 'ALL' ? 'All Tickets' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {cancelFeedback && (
        <div className="p-3.5 rounded-2xl backdrop-blur-md bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{cancelFeedback}</span>
          </div>
          <button onClick={() => setCancelFeedback(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {cancelError && (
        <div className="p-3.5 rounded-2xl backdrop-blur-md bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{cancelError}</span>
          </div>
          <button onClick={() => setCancelError(null)} className="text-rose-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((b) => (
            <div
              key={b.bookingId}
              className="relative overflow-hidden backdrop-blur-2xl bg-slate-900/40 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-4 hover:border-cyan-400/40 transition-all duration-200"
            >
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

              {/* Card Header: PNR + Status */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-mono font-black text-xs">
                    PNR
                  </div>
                  <div>
                    <span className="text-base sm:text-lg font-mono font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] block leading-none">
                      {b.pnr}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Booking #{b.bookingId} &bull; {new Date(b.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      b.bookingStatus === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {b.bookingStatus}
                  </span>
                </div>
              </div>

              {/* Card Details: Route, Passenger, Seats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Route */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Route &amp; Bus</span>
                  <p className="font-bold text-white text-xs">
                    {b.from || 'Bangalore'} &rarr; {b.to || 'Chennai'}
                  </p>
                  <p className="text-[10px] text-cyan-400/90 pt-0.5 font-medium">
                    {b.departureTime || '07:30 AM'} &bull; {b.journeyDate || 'Today'}
                  </p>
                </div>

                {/* Passenger */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Passenger</span>
                  <p className="font-bold text-white text-xs">{b.customer.name}</p>
                  <p className="text-[11px] text-slate-400">+91 {b.customer.mobile}</p>
                </div>

                {/* Seats & Fare */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Seats ({b.seatIds.length})
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {b.seatIds.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-cyan-500/80 to-blue-600/90 text-white font-extrabold text-[11px] border border-cyan-300/80 shadow-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] font-black text-cyan-300 mt-1">
                    Total: ₹{b.totalAmount}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-2">
                <button
                  onClick={() => setSelectedBookingForPass(b)}
                  className="px-3.5 py-1.5 rounded-xl backdrop-blur-md bg-white/[0.05] hover:bg-white/[0.1] text-cyan-300 hover:text-cyan-200 border border-white/[0.1] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Boarding Pass</span>
                </button>

                {b.bookingStatus === 'CONFIRMED' && (
                  <button
                    onClick={() => setBookingToCancel(b)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Cancel Ticket</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-14 backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mx-auto">
            <Ticket className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No ticket matching "${searchQuery}". Check the PNR or mobile number.`
                : 'You have not reserved any seats yet. Start your journey today!'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('ticket-booking')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all cursor-pointer active:scale-95"
          >
            <Armchair className="w-4 h-4" />
            <span>Select &amp; Book Seats</span>
          </button>
        </div>
      )}

      {/* Boarding Pass Modal */}
      {selectedBookingForPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative overflow-hidden backdrop-blur-2xl bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-[0_12px_45px_0_rgba(0,0,0,0.6)] space-y-4 animate-scale-in">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Digital Boarding Pass</h3>
              </div>
              <button
                onClick={() => setSelectedBookingForPass(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Boarding pass content */}
            <div className="backdrop-blur-xl bg-black/40 rounded-2xl p-4 border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
                <span className="text-slate-400 uppercase text-[10px] font-bold">PNR Number</span>
                <span className="font-mono font-black text-cyan-300 text-base">{selectedBookingForPass.pnr}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Passenger Name:</span>
                <span className="font-bold text-white">{selectedBookingForPass.customer.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Mobile:</span>
                <span className="font-bold text-slate-200">+91 {selectedBookingForPass.customer.mobile}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Route:</span>
                <span className="font-bold text-white">
                  {selectedBookingForPass.from || 'Bangalore'} &rarr; {selectedBookingForPass.to || 'Chennai'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px]">
                <div>
                  <span className="text-slate-500 uppercase font-bold block">Departure</span>
                  <span className="text-slate-200 font-semibold truncate block">
                    {selectedBookingForPass.from || 'Origin'} ({selectedBookingForPass.departureTime || '07:30 AM'})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 uppercase font-bold block">Arrival</span>
                  <span className="text-slate-200 font-semibold truncate block">
                    {selectedBookingForPass.to || 'Destination'} ({selectedBookingForPass.arrivalTime || '01:30 PM'})
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Reserved Seats:</span>
                <div className="flex gap-1">
                  {selectedBookingForPass.seatIds.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-lg bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-extrabold text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center">
                <span className="font-bold text-white">Total Fare Paid:</span>
                <span className="text-lg font-black text-cyan-300">₹{selectedBookingForPass.totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setSelectedBookingForPass(null)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-xs font-black cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative overflow-hidden backdrop-blur-2xl bg-slate-900/90 border border-rose-500/30 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-[0_12px_45px_0_rgba(0,0,0,0.6)] space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Cancel Booking?</h3>
                <p className="text-xs text-slate-400">PNR: {bookingToCancel.pnr}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to cancel booking <strong className="text-white">#{bookingToCancel.bookingId}</strong>?
              This will update the booking status to <strong className="text-rose-400 font-bold">CANCELLED</strong> and
              immediately return seats{' '}
              <strong className="text-cyan-300">{bookingToCancel.seatIds.join(', ')}</strong> back to the open pool.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                disabled={isCancelling}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Releasing Seats...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Cancel &amp; Release</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
