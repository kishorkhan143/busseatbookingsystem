import React, { useState } from 'react';
import { BookingData, cancelBooking, getBookingById } from '../services/api';
import { Search, Ticket, Calendar, Armchair, AlertCircle, CheckCircle2, XCircle, Trash2, Loader2, ArrowRight } from 'lucide-react';

interface MyBookingsProps {
  onRefreshSeats: () => void;
  onBookNew: () => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({ onRefreshSeats, onBookNew }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<BookingData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Cancellation state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError('Please enter a Booking ID, PNR, or Mobile number.');
      return;
    }

    setIsLoading(true);
    setSearchError(null);
    setCancelMessage(null);

    try {
      const match = await getBookingById(searchQuery.trim());
      setSearchedBooking(match);
      setHasSearched(true);
      if (!match) {
        setSearchError(`No booking record found for "${searchQuery.trim()}".`);
      }
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : 'Error fetching booking.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!searchedBooking) return;

    setIsCancelling(true);
    setSearchError(null);

    try {
      const res = await cancelBooking(searchedBooking.bookingId);
      // Update local state
      setSearchedBooking({
        ...searchedBooking,
        bookingStatus: 'CANCELLED',
      });
      setCancelMessage(res.message);
      setIsCancelModalOpen(false);
      // Notify parent to refresh seat layout
      onRefreshSeats();
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : 'Cancellation failed.');
      setIsCancelModalOpen(false);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Ticket className="w-7 h-7 text-cyan-400" />
          <span>My Bookings &amp; Cancellation</span>
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Look up your reserved tickets by Booking ID (e.g. 1001, SE-1001) or Mobile Number.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-[#111C2E] border border-slate-800 rounded-2xl p-5 shadow-xl mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Booking ID (1001), PNR (SE-1001), or 10-digit Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Find Booking</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Pill Chips */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span>Quick Demo IDs:</span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('1001');
            }}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-mono border border-slate-700 cursor-pointer"
          >
            1001 (Rahul - Confirmed)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('1002');
            }}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-mono border border-slate-700 cursor-pointer"
          >
            1002 (Priya - Confirmed)
          </button>
        </div>
      </div>

      {/* Notifications */}
      {searchError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{searchError}</span>
        </div>
      )}

      {cancelMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{cancelMessage}</span>
        </div>
      )}

      {/* Booking Details Card */}
      {searchedBooking && (
        <div className="bg-[#111C2E] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Card Top Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                  Booking #{searchedBooking.bookingId}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                    searchedBooking.bookingStatus === 'CONFIRMED'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}
                >
                  {searchedBooking.bookingStatus}
                </span>
              </div>
              <p className="text-lg font-bold text-white mt-1">
                PNR: <span className="font-mono text-cyan-400">{searchedBooking.pnr}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Total Paid</span>
              <p className="text-2xl font-black text-cyan-400">₹{searchedBooking.totalAmount}</p>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Passenger Info */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <p className="text-[11px] font-bold uppercase text-slate-400">Customer Details</p>
                <p className="text-sm font-bold text-white">{searchedBooking.customer.name}</p>
                <p className="text-slate-300">Mobile: +91 {searchedBooking.customer.mobile}</p>
                {searchedBooking.customer.email && (
                  <p className="text-slate-400">Email: {searchedBooking.customer.email}</p>
                )}
              </div>

              {/* Journey Info */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <p className="text-[11px] font-bold uppercase text-slate-400">Bus &amp; Schedule</p>
                <p className="text-sm font-bold text-white">{searchedBooking.busName || 'SeatEase Sleeper Express'}</p>
                <p className="text-slate-300">
                  {searchedBooking.from || 'Bangalore'} &rarr; {searchedBooking.to || 'Chennai'}
                </p>
                <p className="text-slate-400">
                  Departure: {searchedBooking.departureTime || '21:30'}
                </p>
              </div>
            </div>

            {/* Reserved Seats List */}
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 mb-2">Reserved Seats:</p>
              <div className="flex flex-wrap gap-2">
                {searchedBooking.seatIds.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/30 border border-blue-500 text-cyan-300 text-xs font-bold"
                  >
                    <Armchair className="w-3.5 h-3.5" />
                    Seat {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>
                Booking Timestamp:{' '}
                {new Date(searchedBooking.bookingDate).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-slate-900/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              {searchedBooking.bookingStatus === 'CONFIRMED'
                ? 'Ticket can be cancelled anytime before departure.'
                : 'This booking has been cancelled and seats were released.'}
            </span>

            {searchedBooking.bookingStatus === 'CONFIRMED' ? (
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900/90 text-rose-300 border border-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                Cancel Ticket &amp; Release Seats
              </button>
            ) : (
              <span className="text-xs text-slate-500 font-medium italic">
                No further actions possible
              </span>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!searchedBooking && hasSearched && !isLoading && !searchError && (
        <div className="text-center py-12 bg-[#111C2E] border border-slate-800 rounded-2xl p-6">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Bookings Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            We could not find any active or past booking matching your query.
          </p>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {isCancelModalOpen && searchedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111C2E] border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Confirm Cancellation</h3>
                <p className="text-xs text-slate-400">Booking #{searchedBooking.bookingId}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to cancel booking <strong className="text-white">#{searchedBooking.bookingId}</strong>?
              This will update the database status to <strong className="text-rose-400">CANCELLED</strong> and
              immediately release seats <strong className="text-cyan-400">{searchedBooking.seatIds.join(', ')}</strong> back
              to <strong className="text-emerald-400">AVAILABLE</strong> in the MySQL table.
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <p className="font-semibold text-slate-300">Java Transaction Notice:</p>
              <p className="mt-0.5">
                Executes: <code className="text-cyan-300">UPDATE bookings SET booking_status = 'CANCELLED'...</code> and restores seats atomically.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isCancelling}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
