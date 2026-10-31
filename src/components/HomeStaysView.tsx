import React, { useState, useMemo } from 'react';
import {
  Building2,
  MapPin,
  Star,
  Users,
  Calendar,
  Sparkles,
  CheckCircle2,
  Search,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Printer,
  ChevronRight,
  Compass,
  Phone,
  User as UserIcon,
} from 'lucide-react';
import {
  HomeStayItem,
  SAMPLE_HOMESTAYS,
  createHomestayBooking,
  BookingData,
  UserProfile,
} from '../services/api';
import { NavTab } from './TopMenuBar';

interface HomeStaysViewProps {
  userProfile: UserProfile;
  onViewBookings: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const HomeStaysView: React.FC<HomeStaysViewProps> = ({
  userProfile,
  onViewBookings,
  onNavigate,
}) => {
  // Filters
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'RECOMMENDED' | 'PRICE_ASC' | 'PRICE_DESC' | 'RATING'>('RECOMMENDED');

  // Inline Reservation State (NO OVERLAY)
  const [selectedStay, setSelectedStay] = useState<HomeStayItem | null>(null);
  const [checkInDate, setCheckInDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [guestCount, setGuestCount] = useState<number>(2);
  const [guestName, setGuestName] = useState<string>(userProfile.name);
  const [guestMobile, setGuestMobile] = useState<string>(userProfile.mobile);
  const [guestEmail, setGuestEmail] = useState<string>(userProfile.email || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);

  // Available unique cities
  const availableCities = useMemo(() => {
    const set = new Set(SAMPLE_HOMESTAYS.map((s) => s.city));
    return Array.from(set);
  }, []);

  const stayTypes = [
    'ALL',
    'Plantation Estate',
    'Heritage Villa',
    'Cozy Cottage',
    'Beachfront Stay',
    'Mountain Bungalow',
  ];

  // Calculate nights
  const calculateNights = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const currentNights = useMemo(
    () => calculateNights(checkInDate, checkOutDate),
    [checkInDate, checkOutDate]
  );

  // Filtered & sorted homestays
  const filteredStays = useMemo(() => {
    let result = SAMPLE_HOMESTAYS.filter((stay) => {
      const matchesCity = selectedCity === 'ALL' || stay.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesType = selectedType === 'ALL' || stay.stayType === selectedType;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        stay.name.toLowerCase().includes(q) ||
        stay.location.toLowerCase().includes(q) ||
        stay.city.toLowerCase().includes(q);

      return matchesCity && matchesType && matchesSearch;
    });

    if (sortBy === 'PRICE_ASC') {
      result = [...result].sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === 'PRICE_DESC') {
      result = [...result].sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === 'RATING') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCity, selectedType, searchQuery, sortBy]);

  const handleStartBooking = (stay: HomeStayItem) => {
    setSelectedStay(stay);
    setGuestName(userProfile.name);
    setGuestMobile(userProfile.mobile);
    setGuestEmail(userProfile.email || '');
    setGuestCount(Math.min(2, stay.maxGuests));
    setBookingError(null);
    setConfirmedBooking(null);
  };

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStay) return;
    setBookingError(null);
    setIsSubmitting(true);

    try {
      const resp = await createHomestayBooking({
        stayId: selectedStay.id,
        stayName: selectedStay.name,
        stayLocation: selectedStay.location,
        stayImageUrl: selectedStay.imageUrl,
        hostName: selectedStay.hostName,
        pricePerNight: selectedStay.pricePerNight,
        name: guestName,
        mobile: guestMobile,
        email: guestEmail,
        checkInDate,
        checkOutDate,
        nights: currentNights,
        guestsCount: guestCount,
      });

      setConfirmedBooking(resp.data);
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : 'Reservation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-3.5 sm:gap-5 animate-fade-in pb-4">
      {/* 1. If currently in Inline Reservation / Confirmation Mode (NO OVERLAYS) */}
      {selectedStay ? (
        <div className="w-full flex flex-col gap-3.5 animate-scale-in">
          {/* Back button strip */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setSelectedStay(null);
                setConfirmedBooking(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Back to Stays</span>
            </button>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {confirmedBooking ? 'Reservation Confirmed' : 'Complete Reservation'}
            </span>
          </div>

          {confirmedBooking ? (
            /* Inline Confirmed Voucher - Apple Liquid Glass */
            <div className="p-4 sm:p-6 rounded-3xl liquid-glass-card flex flex-col gap-4 max-w-lg mx-auto w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Homestay Reserved!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PNR: <strong className="font-mono text-cyan-700 dark:text-cyan-300">{confirmedBooking.pnr}</strong>
                  </p>
                </div>
              </div>

              {/* Compact summary */}
              <div className="p-3.5 rounded-2xl liquid-glass text-xs flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Property:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedStay.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Dates:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate} ({confirmedBooking.nights} nights)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Guest:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {confirmedBooking.customer.name} ({confirmedBooking.guestsCount} guests)
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200/50 dark:border-white/5 font-bold">
                  <span className="text-slate-900 dark:text-white">Total Fare:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 text-sm">
                    ₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
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
                  onClick={() => {
                    setSelectedStay(null);
                    onViewBookings();
                  }}
                  className="flex-1 py-2 rounded-xl liquid-glass-btn-primary text-white text-xs font-bold flex items-center justify-center cursor-pointer"
                >
                  My Bookings
                </button>
              </div>
            </div>
          ) : (
            /* Inline Clean Reservation Form - Apple Liquid Glass */
            <form
              onSubmit={handleConfirmReservation}
              className="p-3.5 sm:p-5 rounded-3xl liquid-glass-card flex flex-col gap-3.5 max-w-xl mx-auto w-full"
            >
              {/* Selected stay concise row */}
              <div className="flex items-center gap-3 p-2.5 rounded-2xl liquid-glass">
                <img
                  src={selectedStay.imageUrl}
                  alt={selectedStay.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/30"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {selectedStay.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {selectedStay.location} &bull; {selectedStay.city}
                  </p>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ₹{selectedStay.pricePerNight.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">/ night</span>
                  </p>
                </div>
              </div>

              {/* Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>Check-in</span>
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                    className="w-full p-2 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>Check-out</span>
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                    className="w-full p-2 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-1">
                    <Users className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>Guests</span>
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full p-2 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-semibold cursor-pointer"
                  >
                    {Array.from({ length: selectedStay.maxGuests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n} className="bg-white dark:bg-slate-900">
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-1">
                    <UserIcon className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>Guest Name</span>
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    className="w-full p-2 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-1">
                    <Phone className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>Mobile Number</span>
                  </label>
                  <input
                    type="tel"
                    value={guestMobile}
                    onChange={(e) => setGuestMobile(e.target.value)}
                    required
                    maxLength={10}
                    className="w-full p-2 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Price Row */}
              <div className="p-2.5 rounded-2xl liquid-glass text-xs flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  ₹{selectedStay.pricePerNight} &times; {currentNights} {currentNights === 1 ? 'night' : 'nights'} + GST
                </span>
                <span className="text-sm font-black text-cyan-800 dark:text-cyan-300">
                  Total: ₹{Math.round(selectedStay.pricePerNight * currentNights * 1.12).toLocaleString('en-IN')}
                </span>
              </div>

              {bookingError && (
                <div className="p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold backdrop-blur-md">
                  {bookingError}
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 border border-white/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Reservation</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      ) : (
        /* 2. Standard Homestays Catalog (Clean Rectangular UX) */
        <>
          {/* Header strip: Apple Liquid Glass */}
          <div className="relative overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-800/90 via-teal-900/80 to-emerald-950/90 text-white flex items-center justify-between gap-3 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-2xl">
            <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h1 className="text-sm sm:text-lg font-black tracking-tight">Verified Home Stays</h1>
            </div>

            <button
              onClick={() => onNavigate('ticket-booking')}
              type="button"
              className="relative z-10 px-3 py-1.5 rounded-xl liquid-glass-btn-secondary text-white text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
            >
              <span>Bus Tickets</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Filter Bar: Apple Liquid Glass Card */}
          <div className="p-3 sm:p-3.5 rounded-2xl liquid-glass-card flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stays or city..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl liquid-glass-input text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-2.5 rounded-xl liquid-glass-input text-[11px] font-bold text-slate-800 dark:text-slate-200 cursor-pointer shrink-0"
              >
                <option value="RECOMMENDED" className="bg-white dark:bg-slate-900">Recommended</option>
                <option value="PRICE_ASC" className="bg-white dark:bg-slate-900">Price: Low to High</option>
                <option value="PRICE_DESC" className="bg-white dark:bg-slate-900">Price: High to Low</option>
                <option value="RATING" className="bg-white dark:bg-slate-900">Highest Rating</option>
              </select>
            </div>

            {/* City pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCity('ALL')}
                className={`px-3 py-1 rounded-xl font-bold text-[11px] whitespace-nowrap cursor-pointer transition-all ${
                  selectedCity === 'ALL'
                    ? 'liquid-glass-btn-primary text-white'
                    : 'liquid-glass-btn-secondary text-slate-600 dark:text-slate-300'
                }`}
              >
                All Cities
              </button>
              {availableCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1 rounded-xl font-bold text-[11px] whitespace-nowrap cursor-pointer transition-all ${
                    selectedCity === city
                      ? 'liquid-glass-btn-primary text-white'
                      : 'liquid-glass-btn-secondary text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Stays List: Small rectangular layouts on mobile */}
          <div className="flex flex-col gap-2.5">
            {filteredStays.length === 0 ? (
              <div className="p-8 text-center rounded-2xl liquid-glass-card flex flex-col items-center gap-2">
                <Compass className="w-8 h-8 text-slate-400" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No properties found</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity('ALL');
                    setSelectedType('ALL');
                    setSearchQuery('');
                  }}
                  className="px-3.5 py-1.5 rounded-xl liquid-glass-btn-primary text-white text-xs font-bold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredStays.map((stay) => (
                <div
                  key={stay.id}
                  className="rounded-2xl liquid-glass-card p-3 sm:p-4 flex flex-row items-center gap-3 sm:gap-4 transition-all"
                >
                  {/* Compact rectangular photo thumbnail */}
                  <div className="relative w-22 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-white/40 dark:border-white/10 shadow-xs">
                    <img
                      src={stay.imageUrl}
                      alt={stay.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded-md bg-black/50 backdrop-blur-md border border-white/20 text-white text-[8px] font-semibold">
                      {stay.city}
                    </div>
                  </div>

                  {/* Details: Clean and spacious without cluttering sublines */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full gap-2">
                    <div>
                      <div className="flex items-center justify-between gap-1.5">
                        <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">
                          {stay.name}
                        </h3>
                        <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold shrink-0">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          <span>{stay.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span className="truncate">{stay.location}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200/50 dark:border-white/5">
                      <div>
                        <span className="text-xs sm:text-base font-black text-slate-900 dark:text-white">
                          ₹{stay.pricePerNight.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal"> / night</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartBooking(stay)}
                        className="px-3.5 py-1.5 rounded-xl liquid-glass-btn-primary text-white font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
                      >
                        <span>Reserve</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
