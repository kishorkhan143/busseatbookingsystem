import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Ticket, Bus, ArrowRight, Building2, MapPin } from 'lucide-react';
import { BookingData, POPULAR_ROUTES, SAMPLE_HOMESTAYS } from '../services/api';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingBookings = q
    ? bookings.filter(
        (b) =>
          b.pnr.toLowerCase().includes(q) ||
          String(b.bookingId).includes(q) ||
          b.customer.name.toLowerCase().includes(q) ||
          (b.from && b.from.toLowerCase().includes(q)) ||
          (b.to && b.to.toLowerCase().includes(q)) ||
          (b.stayName && b.stayName.toLowerCase().includes(q))
      )
    : [];

  const matchingRoutes = q
    ? POPULAR_ROUTES.filter(
        (r) =>
          r.from.toLowerCase().includes(q) ||
          r.to.toLowerCase().includes(q) ||
          r.operator.toLowerCase().includes(q)
      )
    : POPULAR_ROUTES.slice(0, 2);

  const matchingStays = q
    ? SAMPLE_HOMESTAYS.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q)
      )
    : SAMPLE_HOMESTAYS.slice(0, 2);

  return (
    /* Sleek Non-Blocking Dropdown Header Drawer (NO FULL SCREEN OVERLAY - Apple Liquid Glass) */
    <div className="fixed top-12 sm:top-13 inset-x-0 z-40 liquid-glass-nav border-b border-white/60 dark:border-white/10 shadow-xl animate-fade-in">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 py-3 flex flex-col gap-2.5">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400 absolute left-3.5" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search bookings, routes, homestays, PNR..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Concise Search Results Grid */}
        <div className="max-h-[50vh] overflow-y-auto flex flex-col gap-2 pb-1 text-xs">
          {matchingBookings.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bookings</span>
              {matchingBookings.map((b) => (
                <div
                  key={b.bookingId}
                  onClick={() => {
                    onSelectBooking(b);
                    onNavigate('my-bookings');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl liquid-glass flex items-center justify-between cursor-pointer active:scale-98 transition-all hover:border-cyan-400/50"
                >
                  <div className="flex items-center gap-2">
                    {b.bookingType === 'HOMESTAY' ? (
                      <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Ticket className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    )}
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{b.pnr}</span>
                    <span className="text-slate-600 dark:text-slate-300">{b.stayName || `${b.from} → ${b.to}`}</span>
                  </div>
                  <span className="font-bold text-cyan-700 dark:text-cyan-300">₹{b.totalAmount}</span>
                </div>
              ))}
            </div>
          )}

          {matchingRoutes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Routes</span>
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
                  className="p-2.5 rounded-xl liquid-glass flex items-center justify-between cursor-pointer active:scale-98 transition-all hover:border-cyan-400/50"
                >
                  <div className="flex items-center gap-2">
                    <Bus className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{r.from} &rarr; {r.to}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">{r.operator}</span>
                  </div>
                  <span className="font-bold text-cyan-700 dark:text-cyan-300">₹{r.pricePerSeat}</span>
                </div>
              ))}
            </div>
          )}

          {matchingStays.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Home Stays</span>
              {matchingStays.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    onNavigate('homestays');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl liquid-glass flex items-center justify-between cursor-pointer active:scale-98 transition-all hover:border-emerald-400/50"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">{s.city}</span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{s.pricePerNight}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
