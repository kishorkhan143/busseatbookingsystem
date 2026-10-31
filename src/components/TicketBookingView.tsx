import React, { useState, useEffect, useMemo } from 'react';
import {
  Armchair,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Printer,
  RefreshCw,
  Disc,
  User,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  MapPin,
  ArrowRight,
  ArrowLeftRight,
  Calendar,
  Bus,
  Star,
  Zap,
} from 'lucide-react';
import {
  BookingData,
  UserProfile,
  CITIES_AND_STOPS,
  searchAvailableBuses,
  getAvailableSeatsForBus,
} from '../services/api';
import { SeatItem, SEAT_PRICE, calculateTotalAmount } from '../utils/bookingRules';
import { Seat } from './Seat';
import { SeatLegend } from './SeatLegend';

interface TicketBookingViewProps {
  seats: SeatItem[];
  selectedSeatIds: string[];
  onToggleSeat: (seatId: string, isAvailable: boolean) => void;
  onClearSelection: () => void;
  onRefreshSeats: (busId?: string) => void;
  isLoadingSeats: boolean;
  onBookSeats: (payload: {
    name: string;
    mobile: string;
    email?: string;
    busId: string;
    busName: string;
    busType: string;
    from: string;
    boardingPoint: string;
    to: string;
    droppingPoint: string;
    departureTime: string;
    arrivalTime: string;
    journeyDate: string;
  }) => Promise<BookingData>;
  userProfile: UserProfile;
  initialFromCity?: string;
  initialToCity?: string;
  initialBusId?: string;
  onViewBookings?: () => void;
}

export const TicketBookingView: React.FC<TicketBookingViewProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
  onClearSelection,
  onRefreshSeats,
  isLoadingSeats,
  onBookSeats,
  userProfile,
  initialFromCity = 'Bangalore',
  initialToCity = 'Chennai',
  initialBusId = 'blr-chn-1',
  onViewBookings,
}) => {
  // Cities list from CITIES_AND_STOPS
  const cityNames = Object.keys(CITIES_AND_STOPS);

  // Route & Search States
  const [fromCity, setFromCity] = useState(initialFromCity);
  const [toCity, setToCity] = useState(initialToCity);

  // Date state (defaults to today)
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const [journeyDate, setJourneyDate] = useState(todayStr);

  // Filter for bus type: 'ALL' | 'SLEEPER' | 'EV'
  const [busFilter, setBusFilter] = useState<'ALL' | 'SLEEPER' | 'EV'>('ALL');

  // Available buses matching the route
  const availableBuses = useMemo(() => {
    return searchAvailableBuses(fromCity, toCity);
  }, [fromCity, toCity]);

  // Selected Bus State (auto-selects first bus or initialBusId)
  const [selectedBusId, setSelectedBusId] = useState<string>(() => {
    const match = availableBuses.find((b) => b.id === initialBusId);
    return match ? match.id : availableBuses[0]?.id || 'blr-chn-1';
  });

  const selectedBus = useMemo(() => {
    return availableBuses.find((b) => b.id === selectedBusId) || availableBuses[0];
  }, [availableBuses, selectedBusId]);

  // Sync cities
  const handleFromCityChange = (newCity: string) => {
    setFromCity(newCity);
    onClearSelection();
  };

  const handleToCityChange = (newCity: string) => {
    setToCity(newCity);
    onClearSelection();
  };

  // Swap From <-> To
  const handleSwapCities = () => {
    const prevFrom = fromCity;
    const prevTo = toCity;
    setFromCity(prevTo);
    setToCity(prevFrom);
    onClearSelection();
  };

  // When selected bus changes, refresh seats for that bus
  useEffect(() => {
    if (selectedBus) {
      onRefreshSeats(selectedBus.id);
    }
  }, [selectedBus?.id, onRefreshSeats]);

  // Passenger form states (defaulting to profile details for effortless 1-click booking)
  const [passengerName, setPassengerName] = useState(userProfile.name || 'Kishor Khan');
  const [passengerMobile, setPassengerMobile] = useState(userProfile.mobile || '9876543210');
  const [passengerEmail, setPassengerEmail] = useState(userProfile.email || 'kishorkhan.dev@gmail.com');
  const [showPassengerOptions, setShowPassengerOptions] = useState(false);

  // Submission & Confirmed Ticket
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);

  const rows = ['A', 'B', 'C', 'D', 'E'];
  const totalAmount = calculateTotalAmount(selectedSeatIds.length, SEAT_PRICE);

  const handleConfirmBooking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedSeatIds.length === 0 || !selectedBus) return;

    setBookingError(null);
    setIsSubmitting(true);

    try {
      const ticket = await onBookSeats({
        name: passengerName.trim() || 'Passenger',
        mobile: passengerMobile.trim() || '9876543210',
        email: passengerEmail.trim(),
        busId: selectedBus.id,
        busName: selectedBus.operator,
        busType: selectedBus.busType,
        from: fromCity,
        boardingPoint: fromCity,
        to: toCity,
        droppingPoint: toCity,
        departureTime: selectedBus.departureTime,
        arrivalTime: selectedBus.arrivalTime,
        journeyDate,
      });
      setConfirmedBooking(ticket);
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : 'Booking failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered buses
  const filteredBuses = useMemo(() => {
    if (busFilter === 'SLEEPER') {
      return availableBuses.filter((b) => b.busType.toLowerCase().includes('sleeper'));
    }
    if (busFilter === 'EV') {
      return availableBuses.filter(
        (b) => b.busType.toLowerCase().includes('electric') || b.busType.toLowerCase().includes('ev')
      );
    }
    return availableBuses;
  }, [availableBuses, busFilter]);

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto animate-fade-in">
      {/* If a ticket was just confirmed, render the Liquid Glass Digital Boarding Pass */}
      {confirmedBooking ? (
        <div className="w-full py-4 max-w-md mx-auto animate-scale-in">
          <div className="relative overflow-hidden backdrop-blur-2xl bg-slate-900/60 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_12px_45px_0_rgba(0,0,0,0.6)] space-y-6">
            {/* Refractive Top Edge Sheen */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Success Badge */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.35)] mb-3">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Booking Confirmed!
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Your digital boarding pass is locked &amp; issued.
              </p>
            </div>

            {/* Digital Boarding Pass Ticket */}
            <div className="backdrop-blur-xl bg-white/[0.04] rounded-2xl p-5 border border-white/10 space-y-4 shadow-inner">
              {/* PNR & Status */}
              <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block">
                    PNR / Booking ID
                  </span>
                  <span className="text-lg font-mono font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                    {confirmedBooking.pnr}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase text-[10px] tracking-wide">
                  {confirmedBooking.bookingStatus}
                </span>
              </div>

              {/* Journey Route & Points */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{confirmedBooking.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{confirmedBooking.to}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Departure</span>
                    <span className="text-slate-300 font-medium block truncate">
                      {confirmedBooking.from}
                    </span>
                    <span className="text-cyan-400 font-semibold">{confirmedBooking.departureTime}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Arrival</span>
                    <span className="text-slate-300 font-medium block truncate">
                      {confirmedBooking.to}
                    </span>
                    <span className="text-slate-400 font-semibold">{confirmedBooking.arrivalTime}</span>
                  </div>
                </div>
              </div>

              {/* Passenger & Date */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Passenger</span>
                  <span className="font-bold text-white text-xs block">{confirmedBooking.customer.name}</span>
                  <span className="text-[11px] text-slate-400">+91 {confirmedBooking.customer.mobile}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Date &amp; Bus</span>
                  <span className="font-bold text-white text-xs block">
                    {confirmedBooking.journeyDate || todayStr}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {confirmedBooking.busName || 'SeatEase Express'}
                  </span>
                </div>
              </div>

              {/* Booked Seats Badges */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-slate-400 text-xs font-medium">Booked Seats:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {confirmedBooking.seatIds.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500/80 to-blue-600/90 border border-cyan-300 text-white font-extrabold text-xs shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center">
                <span className="font-bold text-white text-sm">Total Paid:</span>
                <span className="text-2xl font-black text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                  ₹{confirmedBooking.totalAmount}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.1] text-white font-semibold text-xs flex items-center gap-1.5 transition-all border border-white/15 cursor-pointer shadow-sm active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Print Ticket</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmedBooking(null)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.35)] active:scale-95"
              >
                <Armchair className="w-3.5 h-3.5" />
                <span>Book More Seats</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Booking Flow: Search Route -> Available Buses -> Seat Cabin Selection */
        <div className="space-y-6">
          {/* 1. TRAVEL ROUTE SEARCH & PICKER CARD (Liquid Glassmorphism) */}
          <div className="relative overflow-hidden backdrop-blur-2xl bg-slate-900/50 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-[0_12px_40px_0_rgba(0,0,0,0.5)] space-y-4">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <span>Search Travel Route &amp; Buses</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select origin and destination cities
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>₹150 Flat Fare</span>
                </span>
              </div>
            </div>

            {/* From City + Swap + To City */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
              {/* FROM SECTION (5 Cols) */}
              <div className="md:col-span-5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-cyan-400/40 transition-colors">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>FROM (ORIGIN CITY)</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">City</span>
                </div>
                <select
                  value={fromCity}
                  onChange={(e) => handleFromCityChange(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {cityNames.map((city) => (
                    <option key={city} value={city} className="bg-slate-900 text-white">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* SWAP BUTTON (1 Col) */}
              <div className="md:col-span-1 flex items-center justify-center py-1 md:py-0">
                <button
                  type="button"
                  onClick={handleSwapCities}
                  className="w-10 h-10 rounded-2xl backdrop-blur-xl bg-white/[0.05] hover:bg-cyan-500/20 text-cyan-400 hover:text-white border border-white/10 hover:border-cyan-400/40 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90"
                  title="Swap Origin and Destination"
                  aria-label="Swap Origin and Destination"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* TO SECTION (5 Cols) */}
              <div className="md:col-span-5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-cyan-400/40 transition-colors">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-blue-400 tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>TO (DESTINATION CITY)</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">City</span>
                </div>
                <select
                  value={toCity}
                  onChange={(e) => handleToCityChange(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {cityNames
                    .filter((c) => c !== fromCity)
                    .map((city) => (
                      <option key={city} value={city} className="bg-slate-900 text-white">
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Travel Date Selector & Quick Pills */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-300">Journey Date:</span>
                <input
                  type="date"
                  value={journeyDate}
                  min={todayStr}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="px-3 py-1.5 bg-black/50 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setJourneyDate(todayStr)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    journeyDate === todayStr
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06]'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setJourneyDate(tomorrowStr)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    journeyDate === tomorrowStr
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06]'
                  }`}
                >
                  Tomorrow
                </button>
              </div>
            </div>
          </div>

          {/* 2. AVAILABLE BUSES LIST SECTION */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <Bus className="w-5 h-5 text-cyan-400" />
                  <span>Available Buses ({filteredBuses.length})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Route: <strong className="text-white">{fromCity}</strong> &rarr;{' '}
                  <strong className="text-white">{toCity}</strong> &bull; Click any bus to view and select seats
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.08] self-start sm:self-auto">
                {(['ALL', 'SLEEPER', 'EV'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setBusFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      busFilter === filter
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter === 'ALL' ? 'All Buses' : filter === 'SLEEPER' ? 'Sleeper' : 'EV Electric'}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Bus Cards */}
            <div className="grid grid-cols-1 gap-3.5">
              {filteredBuses.map((bus) => {
                const isSelected = selectedBus?.id === bus.id;
                const busAvailableSeats = getAvailableSeatsForBus(bus.id);

                return (
                  <div
                    key={bus.id}
                    className={`relative overflow-hidden backdrop-blur-2xl rounded-3xl p-4 sm:p-5 transition-all duration-200 border ${
                      isSelected
                        ? 'bg-slate-900/80 border-cyan-400/60 shadow-[0_8px_30px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/40'
                        : 'bg-slate-900/40 border-white/10 hover:border-white/25 shadow-md hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Operator & Bus Details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-black text-white">{bus.operator}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                            {bus.busNumber}
                          </span>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{bus.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 font-medium">{bus.busType}</p>

                        {/* Timings & Cities */}
                        <div className="flex items-center gap-4 text-xs pt-1">
                          <div>
                            <span className="text-lg font-black text-white block">{bus.departureTime}</span>
                            <span className="text-[11px] text-slate-400 truncate max-w-[160px] block font-medium">
                              {fromCity}
                            </span>
                          </div>

                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-cyan-400 font-bold">{bus.duration}</span>
                            <div className="w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent my-1" />
                            <span className="text-[9px] text-slate-500">{bus.distance}</span>
                          </div>

                          <div>
                            <span className="text-lg font-black text-white block">{bus.arrivalTime}</span>
                            <span className="text-[11px] text-slate-400 truncate max-w-[160px] block font-medium">
                              {toCity}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Seat Availability, Price & CTA */}
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.08]">
                        <div className="text-left md:text-right">
                          <div className="flex items-center gap-1.5 md:justify-end">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-400">
                              {busAvailableSeats} Seats Available
                            </span>
                          </div>
                          <span className="text-xl sm:text-2xl font-black text-cyan-300 block">
                            ₹{bus.pricePerSeat}{' '}
                            <span className="text-[11px] text-slate-400 font-normal">/ seat</span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (selectedBusId !== bus.id) {
                              setSelectedBusId(bus.id);
                              onClearSelection();
                            }
                          }}
                          className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 ${
                            isSelected
                              ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                              : 'bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/10'
                          }`}
                        >
                          <Armchair className="w-3.5 h-3.5" />
                          <span>{isSelected ? 'Seats Active' : 'Select Seats'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. INTERACTIVE 30-SEAT CABIN LAYOUT FOR SELECTED BUS */}
          {selectedBus && (
            <div className="relative overflow-hidden backdrop-blur-2xl bg-slate-900/50 border border-white/15 rounded-3xl p-4 sm:p-6 shadow-[0_12px_45px_0_rgba(0,0,0,0.5)] space-y-4">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

              {/* Selected Bus Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] flex-wrap gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Armchair className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    <span>Live 30-Seat Cabin &bull; {selectedBus.operator}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {fromCity} &rarr; {toCity} &bull; Dep: {selectedBus.departureTime} &bull; Date: {journeyDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedSeatIds.length > 0 && (
                    <button
                      onClick={onClearSelection}
                      className="text-[11px] text-rose-300 hover:text-rose-200 font-semibold px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 cursor-pointer backdrop-blur-md active:scale-95 transition-all"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => onRefreshSeats(selectedBus.id)}
                    disabled={isLoadingSeats}
                    className="p-1.5 rounded-xl backdrop-blur-md bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all border border-white/[0.08] cursor-pointer active:scale-95"
                    title="Refresh seat availability"
                    aria-label="Refresh seats"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSeats ? 'animate-spin text-cyan-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Floating Action & Total Price Card */}
              <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 border border-cyan-400/35 rounded-2xl p-3 sm:p-4.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_8px_25px_rgba(0,0,0,0.35)]">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Selected Seats:</span>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap min-h-[26px]">
                      {selectedSeatIds.length > 0 ? (
                        selectedSeatIds.map((id) => (
                          <span
                            key={id}
                            className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-cyan-500/80 to-blue-600/90 border border-cyan-300/80 text-white font-extrabold text-xs shadow-[0_0_10px_rgba(34,211,238,0.35)] backdrop-blur-md"
                          >
                            {id}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No seats selected yet</span>
                      )}
                    </div>
                  </div>

                  <div className="border-l border-white/[0.1] pl-3 sm:pl-4">
                    <span className="text-[11px] text-slate-400 block font-medium">Total:</span>
                    <span className="text-xl sm:text-2xl font-black text-cyan-300 block leading-tight drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                {/* Instant Book Action */}
                <button
                  type="button"
                  onClick={() => handleConfirmBooking()}
                  disabled={isSubmitting || selectedSeatIds.length === 0}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_28px_rgba(34,211,238,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Locking Seats...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                      <span>
                        {selectedSeatIds.length > 0
                          ? `Book ${selectedSeatIds.length} Seat${selectedSeatIds.length > 1 ? 's' : ''} (₹${totalAmount})`
                          : 'Pick Seats to Book'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Passenger Customization Details */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassengerOptions(!showPassengerOptions)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 font-semibold cursor-pointer transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    Passenger Details: <strong className="text-white">{passengerName}</strong> (+91 {passengerMobile})
                  </span>
                  {showPassengerOptions ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>

                {showPassengerOptions && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 animate-fade-in">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        Passenger Name
                      </label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        placeholder="e.g. Kishor Khan"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        10-Digit Mobile
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={passengerMobile}
                        onChange={(e) => setPassengerMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Error Callout */}
              {bookingError && (
                <div className="p-3 rounded-xl backdrop-blur-md bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 shadow-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Seat Legend */}
              <SeatLegend />

              {/* Physical Bus Seating Cabin Grid */}
              <div className="relative overflow-hidden backdrop-blur-2xl bg-black/45 border border-white/[0.09] rounded-3xl p-3 sm:p-5 md:p-6 shadow-inner max-w-lg mx-auto">
                {/* Radial Interior Ambient Light */}
                <div className="absolute inset-0 bg-radial from-cyan-500/[0.04] via-transparent to-transparent pointer-events-none" />

                {/* Front / Driver Indicator */}
                <div className="border-b border-dashed border-white/[0.12] pb-2.5 mb-4 sm:mb-5">
                  <div className="flex items-center justify-between px-1 sm:px-2">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px] sm:text-xs font-semibold">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                      <span className="tracking-wider">FRONT OF CABIN</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl backdrop-blur-md bg-white/[0.04] border border-white/[0.08] text-slate-300 text-[11px] sm:text-xs font-bold shadow-sm">
                      <Disc className="w-3.5 h-3.5 text-cyan-400" />
                      <span>DRIVER</span>
                    </div>
                  </div>
                </div>

                {/* Rows A to E (3 seats left, aisle, 3 seats right) */}
                <div className="space-y-2.5 sm:space-y-3.5">
                  {rows.map((rowName) => {
                    const rowSeats = seats.filter((s) => s.rowName === rowName);
                    const leftBatch = rowSeats.slice(0, 3);
                    const rightBatch = rowSeats.slice(3, 6);

                    return (
                      <div
                        key={rowName}
                        className="flex items-center justify-between gap-1 sm:gap-2"
                      >
                        {/* Row Identifier */}
                        <div className="w-4 sm:w-6 text-center text-xs sm:text-sm font-black text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]">
                          {rowName}
                        </div>

                        {/* Left 3 seats */}
                        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2 flex-1">
                          {leftBatch.map((seat) => (
                            <Seat
                              key={seat.seatId}
                              seat={seat}
                              isSelected={selectedSeatIds.includes(seat.seatId)}
                              onToggle={onToggleSeat}
                            />
                          ))}
                        </div>

                        {/* Frosted Aisle Separator */}
                        <div className="w-3 sm:w-5 flex items-center justify-center">
                          <div className="h-7 sm:h-9 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
                        </div>

                        {/* Right 3 seats */}
                        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2 flex-1">
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

                {/* Rear Exit */}
                <div className="mt-4 sm:mt-5 pt-2.5 border-t border-white/[0.08] text-center text-[10px] text-slate-500 font-semibold tracking-widest uppercase">
                  &bull; REAR EMERGENCY EXIT &bull;
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
