import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Ticket, Bus, ArrowRight, Armchair } from 'lucide-react';
import { BookingData, POPULAR_ROUTES } from '../services/api';
import { NavTab } from './TopMenuBar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingData[];
  onNavigate: (tab: NavTab) => void;
  onSelectBooking: (booking: BookingData) => void;
  onSelectRoute?: (from: string, to: string, routeId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onNavigate,
  onSelectBooking,
  onSelectRoute,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingBookings = q
    ? bookings.filter(
        (b) =>
          b.pnr.toLowerCase().includes(q) ||
          String(b.bookingId).includes(q) ||
          b.customer.name.toLowerCase().includes(q) ||
          b.customer.mobile.includes(q) ||
          b.seatIds.some((s) => s.toLowerCase().includes(q))
      )
    : [];

  const matchingRoutes = q
    ? POPULAR_ROUTES.filter(
        (r) =>
          r.from.toLowerCase().includes(q) ||
          r.to.toLowerCase().includes(q) ||
          r.operator.toLowerCase().includes(q) ||
          r.busType.toLowerCase().includes(q)
      )
    : POPULAR_ROUTES.slice(0, 3); // show top 3 suggestions when query is empty

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative overflow-hidden backdrop-blur-2xl bg-slate-900/95 border border-white/15 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-[0_12px_45px_0_rgba(0,0,0,0.7)] space-y-4 animate-scale-in">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />

        {/* Input Bar */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-cyan-400 absolute left-3.5" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search PNR, seats, passenger, or city routes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-black/50 border border-white/15 rounded-2xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-slate-500"
          />
          <button
            onClick={onClose}
            className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Matching Bookings */}
          {matchingBookings.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
                Found Bookings ({matchingBookings.length})
              </span>
              <div className="space-y-1.5">
                {matchingBookings.map((b) => (
                  <div
                    key={b.bookingId}
                    onClick={() => {
                      onSelectBooking(b);
                      onNavigate('my-bookings');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-400/40 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Ticket className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="font-mono font-bold text-white text-xs">{b.pnr}</span>
                        <span className="text-[11px] text-slate-400 ml-2">{b.customer.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-cyan-300 font-bold">Seats: {b.seatIds.join(', ')}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Routes */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
              {q ? 'Matching Routes' : 'Suggested Routes'}
            </span>
            <div className="space-y-1.5">
              {matchingRoutes.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    if (onSelectRoute) {
                      onSelectRoute(r.from, r.to, r.id);
                    } else {
                      onNavigate('ticket-booking');
                    }
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-400/40 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Bus className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="font-bold text-white text-xs">
                        {r.from} &rarr; {r.to}
                      </span>
                      <p className="text-[10px] text-slate-400">{r.busType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-cyan-300">₹{r.pricePerSeat}</span>
                    <Armchair className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* No results */}
          {q && matchingBookings.length === 0 && matchingRoutes.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              No bookings or routes found for &quot;{query}&quot;. Try searching for &quot;1001&quot; or &quot;Bangalore&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
