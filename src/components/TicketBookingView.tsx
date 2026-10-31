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
  MapPin,
  ArrowRight,
  ArrowLeft,
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
}) => {
  const cityNames = Object.keys(CITIES_AND_STOPS);

  // Route & Search
  const [fromCity, setFromCity] = useState(initialFromCity);
  const [toCity, setToCity] = useState(initialToCity);

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const [journeyDate, setJourneyDate] = useState(todayStr);
  const [busFilter, setBusFilter] = useState<'ALL' | 'SLEEPER' | 'EV'>('ALL');

  // Available buses
  const availableBuses = useMemo(() => {
    return searchAvailableBuses(fromCity, toCity);
  }, [fromCity, toCity]);

  // Selected Bus State
  const [selectedBusId, setSelectedBusId] = useState<string>(() => {
    const match = availableBuses.find((b) => b.id === initialBusId);
    return match ? match.id : availableBuses[0]?.id || 'blr-chn-1';
  });

  const selectedBus = useMemo(() => {
    return availableBuses.find((b) => b.id === selectedBusId) || availableBuses[0];
  }, [availableBuses, selectedBusId]);

  useEffect(() => {
    if (initialFromCity) setFromCity(initialFromCity);
    if (initialToCity) setToCity(initialToCity);
    if (initialBusId) setSelectedBusId(initialBusId);
  }, [initialFromCity, initialToCity, initialBusId]);

  // Step flow: 'ROUTE_AND_BUSES' | 'SEAT_SELECTION'
  const [bookingStep, setBookingStep] = useState<'ROUTE_AND_BUSES' | 'SEAT_SELECTION'>('ROUTE_AND_BUSES');

  const handleSelectBusAndProceed = (busId: string) => {
    if (selectedBusId !== busId) {
      setSelectedBusId(busId);
      onClearSelection();
      onRefreshSeats(busId);
    }
    setBookingStep('SEAT_SELECTION');
  };

  const handleFromCityChange = (newCity: string) => {
    setFromCity(newCity);
    onClearSelection();
    setBookingStep('ROUTE_AND_BUSES');
  };

  const handleToCityChange = (newCity: string) => {
    setToCity(newCity);
    onClearSelection();
    setBookingStep('ROUTE_AND_BUSES');
  };

  const handleSwapCities = () => {
    const prevFrom = fromCity;
    const prevTo = toCity;
    setFromCity(prevTo);
    setToCity(prevFrom);
    onClearSelection();
    setBookingStep('ROUTE_AND_BUSES');
  };

  useEffect(() => {
    if (selectedBus) {
      onRefreshSeats(selectedBus.id);
    }
  }, [selectedBus?.id, onRefreshSeats]);

  // Passenger form
  const [passengerName, setPassengerName] = useState(userProfile.name || 'Kishor Khan');
  const [passengerMobile, setPassengerMobile] = useState(userProfile.mobile || '9876543210');
  const [passengerEmail, setPassengerEmail] = useState(userProfile.email || 'kishor@example.com');

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
    <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-3.5 sm:gap-5 animate-fade-in pb-4">
      {/* 1. Confirmed Ticket Pass (Inline, NO OVERLAY - Apple Liquid Glass Voucher) */}
      {confirmedBooking ? (
        <div className="w-full py-2 max-w-md mx-auto animate-scale-in">
          <div className="liquid-glass-card rounded-3xl p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Ticket Confirmed!</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  PNR: <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300">{confirmedBooking.pnr}</span>
                </p>
              </div>
            </div>

            <div className="liquid-glass rounded-2xl p-3.5 flex flex-col gap-2 text-xs">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white pb-1.5 border-b border-slate-200/50 dark:border-white/5">
                <span>{confirmedBooking.from} &rarr; {confirmedBooking.to}</span>
                <span className="text-cyan-700 dark:text-cyan-400">{confirmedBooking.departureTime}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Bus: {confirmedBooking.busName}</span>
                <span>Date: {confirmedBooking.journeyDate}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Passenger: {confirmedBooking.customer.name}</span>
                <span>+91 {confirmedBooking.customer.mobile}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200/50 dark:border-white/5">
                <span className="font-semibold text-slate-500">Seats ({confirmedBooking.seatIds.length}):</span>
                <div className="flex gap-1">
                  {confirmedBooking.seatIds.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-[10px] shadow-xs border border-white/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center font-bold text-sm pt-1 border-t border-slate-200/50 dark:border-white/5">
                <span>Fare Paid:</span>
                <span className="text-cyan-700 dark:text-cyan-300">₹{confirmedBooking.totalAmount}</span>
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
                  setConfirmedBooking(null);
                  setBookingStep('ROUTE_AND_BUSES');
                }}
                className="flex-1 py-2 rounded-xl liquid-glass-btn-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Armchair className="w-3.5 h-3.5" />
                <span>Book More</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Booking Flow */
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {/* STEP 1: ROUTE & AVAILABLE BUSES */}
          {bookingStep === 'ROUTE_AND_BUSES' && (
            <>
              {/* Route Selector Card: Compact Rectangular Apple Liquid Glass */}
              <div className="p-3.5 sm:p-4 rounded-2xl liquid-glass-card flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Travel Route</span>
                  </span>
                  <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 px-2.5 py-0.5 rounded-full bg-cyan-500/10 dark:bg-cyan-400/15 border border-cyan-500/20 backdrop-blur-md">
                    Flat ₹150 Fare
                  </span>
                </div>

                {/* Cities Grid: Origin + Swap + Destination */}
                <div className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center">
                  <div className="sm:col-span-5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                      From (Origin)
                    </label>
                    <select
                      value={fromCity}
                      onChange={(e) => handleFromCityChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
                    >
                      {cityNames.map((city) => (
                        <option key={city} value={city} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-1 flex items-center justify-center pt-1 sm:pt-4">
                    <button
                      type="button"
                      onClick={handleSwapCities}
                      className="w-8 h-8 rounded-xl liquid-glass-btn-secondary text-cyan-600 dark:text-cyan-400 flex items-center justify-center cursor-pointer active:scale-90"
                      title="Swap cities"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                      To (Destination)
                    </label>
                    <select
                      value={toCity}
                      onChange={(e) => handleToCityChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
                    >
                      {cityNames
                        .filter((c) => c !== fromCity)
                        .map((city) => (
                          <option key={city} value={city} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                            {city}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Date Row */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50 dark:border-white/5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Date:</span>
                    <input
                      type="date"
                      value={journeyDate}
                      min={todayStr}
                      onChange={(e) => setJourneyDate(e.target.value)}
                      className="px-2 py-1 liquid-glass-input rounded-lg text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setJourneyDate(todayStr)}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        journeyDate === todayStr
                          ? 'liquid-glass-btn-primary text-white'
                          : 'liquid-glass-btn-secondary text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setJourneyDate(tomorrowStr)}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        journeyDate === tomorrowStr
                          ? 'liquid-glass-btn-primary text-white'
                          : 'liquid-glass-btn-secondary text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Tomorrow
                    </button>
                  </div>
                </div>
              </div>

              {/* Buses Section */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Bus className="w-4 h-4 text-cyan-600" />
                    <span>Buses ({filteredBuses.length})</span>
                  </span>

                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    {(['ALL', 'SLEEPER', 'EV'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setBusFilter(filter)}
                        className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                          busFilter === filter
                            ? 'bg-cyan-600 text-white'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        {filter === 'ALL' ? 'All' : filter === 'SLEEPER' ? 'Sleeper' : 'EV'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rectangular Bus Cards: Clean, spacious, touch card or Select Seats goes to booking process */}
                <div className="flex flex-col gap-2.5">
                  {filteredBuses.map((bus) => {
                    const busAvailableSeats = getAvailableSeatsForBus(bus.id);

                    return (
                      <div
                        key={bus.id}
                        onClick={() => handleSelectBusAndProceed(bus.id)}
                        className="p-3 sm:p-4 rounded-2xl liquid-glass-card flex flex-row items-center justify-between gap-3 cursor-pointer active:scale-[0.99] group"
                      >
                        <div className="min-w-0 flex-1 flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-base group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate">
                              {bus.operator}
                            </span>
                            <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold shrink-0">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              <span>{bus.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {bus.departureTime} - {bus.arrivalTime}
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                              {busAvailableSeats} seats left
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-xs sm:text-base font-black text-slate-900 dark:text-white block">
                              ₹{bus.pricePerSeat}
                            </span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400">/ seat</span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectBusAndProceed(bus.id);
                            }}
                            className="px-3.5 py-1.5 rounded-xl liquid-glass-btn-primary text-white font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <Armchair className="w-3.5 h-3.5" />
                            <span>Select Seats</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </>
          )}

          {/* STEP 2: DEDICATED SEAT BOOKING PROCESS (ONLY VISIBLE ON SELECTING BUS) */}
          {bookingStep === 'SEAT_SELECTION' && selectedBus && (
            <div className="flex flex-col gap-3 animate-fade-in">
              {/* Back navigation & bus details strip */}
              <div className="p-3 rounded-2xl liquid-glass-card flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setBookingStep('ROUTE_AND_BUSES')}
                  className="inline-flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Back to Buses</span>
                </button>

                <div className="flex items-center gap-1.5 truncate text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white">{selectedBus.operator}</span>
                  <span>&bull;</span>
                  <span>{selectedBus.departureTime}</span>
                  <span>&bull;</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{selectedBus.pricePerSeat}</span>
                </div>
              </div>

              {/* Floating Action & Total Card */}
              <div className="p-3.5 rounded-2xl liquid-glass-card flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Selected Seats</span>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap min-h-[22px]">
                    {selectedSeatIds.length > 0 ? (
                      selectedSeatIds.map((id) => (
                        <span key={id} className="px-2 py-0.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-[10px] shadow-xs border border-white/30">
                          {id}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">Pick seats below</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Total</span>
                    <span className="text-base font-black text-cyan-700 dark:text-cyan-300 leading-tight">
                      ₹{totalAmount}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConfirmBooking()}
                    disabled={isSubmitting || selectedSeatIds.length === 0}
                    className="px-4 py-2 rounded-xl liquid-glass-btn-primary disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Booking...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Book Seats</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Passenger Details: Compact row */}
              <div className="p-3.5 rounded-2xl liquid-glass-card flex flex-col gap-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px]">
                  <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Passenger Details</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="Name"
                    className="p-2 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-semibold"
                  />
                  <input
                    type="tel"
                    maxLength={10}
                    value={passengerMobile}
                    onChange={(e) => setPassengerMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Mobile"
                    className="p-2 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-semibold"
                  />
                  <input
                    type="email"
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    placeholder="Email"
                    className="p-2 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-semibold"
                  />
                </div>
              </div>

              {bookingError && (
                <div className="p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-1.5 backdrop-blur-md">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Seat Legend */}
              <SeatLegend />

              {/* Physical Cabin Grid: 30 Seats with Apple Liquid Glass styling */}
              <div className="liquid-glass rounded-3xl p-3.5 sm:p-5 max-w-md mx-auto w-full flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-slate-300/80 dark:border-white/10 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <span>Front Windshield</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold backdrop-blur-md">
                    <Disc className="w-3 h-3 text-cyan-600 dark:text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Driver Cabin</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {rows.map((rowName) => {
                    const rowSeats = seats.filter((s) => s.rowName === rowName);
                    const leftBatch = rowSeats.slice(0, 3);
                    const rightBatch = rowSeats.slice(3, 6);

                    return (
                      <div key={rowName} className="flex items-center justify-between gap-1">
                        <div className="w-4 text-center text-xs font-black text-cyan-700 dark:text-cyan-400">
                          {rowName}
                        </div>

                        <div className="grid grid-cols-3 gap-1 flex-1">
                          {leftBatch.map((seat) => (
                            <Seat
                              key={seat.seatId}
                              seat={seat}
                              isSelected={selectedSeatIds.includes(seat.seatId)}
                              onToggle={onToggleSeat}
                            />
                          ))}
                        </div>

                        <div className="w-3 flex items-center justify-center">
                          <div className="h-6 w-[1px] bg-slate-300 dark:bg-slate-700" />
                        </div>

                        <div className="grid grid-cols-3 gap-1 flex-1">
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

                <div className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest pt-1 border-t border-slate-200 dark:border-slate-800">
                  Rear Exit
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
