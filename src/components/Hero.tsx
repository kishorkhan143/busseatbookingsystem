import React from 'react';
import { Bus, MapPin, Calendar, ArrowRight, ShieldCheck, Armchair, Sparkles } from 'lucide-react';

interface HeroProps {
  totalSeats: number;
  availableCount: number;
  bookedCount: number;
  onBookClick: () => void;
  onSearchBuses: (from: string, to: string, date: string) => void;
  fromCity: string;
  setFromCity: (val: string) => void;
  toCity: string;
  setToCity: (val: string) => void;
  travelDate: string;
  setTravelDate: (val: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalSeats,
  availableCount,
  bookedCount,
  onBookClick,
  onSearchBuses,
  fromCity,
  setFromCity,
  toCity,
  setToCity,
  travelDate,
  setTravelDate,
}) => {
  const cities = ['Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Jaipur'];

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchBuses(fromCity, toCity, travelDate);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0B1220] via-[#0E172A] to-[#0B1220] pt-6 pb-12 border-b border-slate-800/80">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-r from-cyan-500/10 via-blue-500/15 to-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* College Badge Banner */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 shadow-md">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300">
              Java OOP Mini Project &bull; RedBus Architecture &bull; Strict JDBC Transactions
            </span>
          </div>
        </div>

        {/* Hero Title & Subheading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Your Seat, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Your Choice</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Welcome to <span className="font-semibold text-white">SeatEase</span> — an online bus seat reservation system.
            Experience live 30-seat visual mapping, atomic lock reservation, and instant printable boarding passes.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onBookClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Armchair className="w-5 h-5" />
              Book Your Seat (₹150)
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10">
          <div className="bg-[#111C2E]/90 border border-slate-800 p-4 rounded-xl text-center shadow-sm">
            <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Total Seats</p>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{totalSeats}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Rows A–E (6 seats/row)</p>
          </div>
          <div className="bg-[#111C2E]/90 border border-emerald-900/50 p-4 rounded-xl text-center shadow-sm">
            <p className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">Available</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">{availableCount}</p>
            <p className="text-[11px] text-emerald-500/70 mt-0.5">Ready to reserve</p>
          </div>
          <div className="bg-[#111C2E]/90 border border-slate-800 p-4 rounded-xl text-center shadow-sm">
            <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Booked</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-400 mt-1">{bookedCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Locked & confirmed</p>
          </div>
          <div className="bg-[#111C2E]/90 border border-cyan-900/50 p-4 rounded-xl text-center shadow-sm">
            <p className="text-xs uppercase font-semibold text-cyan-400 tracking-wider">Fixed Fare</p>
            <p className="text-2xl sm:text-3xl font-bold text-cyan-400 mt-1">₹150</p>
            <p className="text-[11px] text-cyan-500/70 mt-0.5">Per seat (No hidden fees)</p>
          </div>
        </div>

        {/* RedBus-Style Bus Search Bar */}
        <div className="bg-[#111C2E] border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Bus className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              RedBus Search &mdash; Find Bus Routes
            </h2>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* From City */}
            <div className="md:col-span-4 relative">
              <label className="block text-xs font-medium text-slate-400 mb-1">From</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                >
                  {cities.map((c) => (
                    <option key={c} value={c} disabled={c === toCity}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button (desktop) */}
            <div className="hidden md:flex md:col-span-1 justify-center pt-5">
              <button
                type="button"
                onClick={handleSwap}
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 hover:border-cyan-500 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-colors"
                title="Swap origin and destination"
                aria-label="Swap cities"
              >
                &harr;
              </button>
            </div>

            {/* To City */}
            <div className="md:col-span-4 relative">
              <label className="block text-xs font-medium text-slate-400 mb-1">To</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                >
                  {cities.map((c) => (
                    <option key={c} value={c} disabled={c === fromCity}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Travel Date */}
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-400 mb-1">Travel Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-12 mt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bus className="w-4 h-4" />
                Search Available Buses
              </button>
            </div>
          </form>
        </div>

        {/* 4 Simple Booking Steps */}
        <div className="mt-10 max-w-4xl mx-auto">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold text-center mb-4">
            How to Book in 4 Simple Steps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
              <div className="w-7 h-7 mx-auto rounded-full bg-cyan-950 text-cyan-300 font-bold text-xs flex items-center justify-center mb-2 border border-cyan-800">
                1
              </div>
              <p className="text-xs font-semibold text-white">Select Bus Route</p>
              <p className="text-[11px] text-slate-400 mt-1">Pick your preferred bus operator and timing.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
              <div className="w-7 h-7 mx-auto rounded-full bg-emerald-950 text-emerald-300 font-bold text-xs flex items-center justify-center mb-2 border border-emerald-800">
                2
              </div>
              <p className="text-xs font-semibold text-white">Choose Seats (A1–E6)</p>
              <p className="text-[11px] text-slate-400 mt-1">Click green available seats on the 30-seat grid.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
              <div className="w-7 h-7 mx-auto rounded-full bg-blue-950 text-blue-300 font-bold text-xs flex items-center justify-center mb-2 border border-blue-800">
                3
              </div>
              <p className="text-xs font-semibold text-white">Enter Details</p>
              <p className="text-[11px] text-slate-400 mt-1">Provide passenger name & 10-digit mobile number.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
              <div className="w-7 h-7 mx-auto rounded-full bg-purple-950 text-purple-300 font-bold text-xs flex items-center justify-center mb-2 border border-purple-800">
                4
              </div>
              <p className="text-xs font-semibold text-white">Instant E-Ticket</p>
              <p className="text-[11px] text-slate-400 mt-1">Receive confirmed PNR & printable boarding pass.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
