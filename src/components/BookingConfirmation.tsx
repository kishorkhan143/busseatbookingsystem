import React from 'react';
import { BookingData } from '../services/api';
import { SEAT_PRICE } from '../utils/bookingRules';
import { CheckCircle2, Printer, Bus, Calendar, Clock, MapPin, User, Phone, Mail, QrCode, ArrowLeft, Ticket } from 'lucide-react';

interface BookingConfirmationProps {
  booking: BookingData;
  onBookAnother: () => void;
  onViewMyBookings: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onBookAnother,
  onViewMyBookings,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="py-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Success Notification Banner */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20 mb-3 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Booking Confirmed!
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Your bus seats have been successfully reserved and locked in the database.
        </p>
      </div>

      {/* Printable RedBus E-Ticket Card */}
      <div id="printable-ticket" className="bg-[#111C2E] border-2 border-cyan-500/50 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-cyan-900/60 via-blue-900/60 to-cyan-900/60 p-5 sm:p-6 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-300">
                Official Boarding Pass
              </span>
              <h2 className="text-xl font-black text-white">
                Seat<span className="text-cyan-400">Ease</span> Express
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase font-semibold text-slate-400">PNR / Booking ID</span>
            <p className="text-xl font-mono font-black text-cyan-400">
              {booking.pnr || `SE-${booking.bookingId}`}
            </p>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Status & Date */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 text-xs font-extrabold uppercase tracking-wide">
                {booking.bookingStatus}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Booked on: {formattedDate}</span>
            </div>
          </div>

          {/* Journey Route & Bus Details */}
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left items-center">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">From</span>
              <p className="text-lg font-extrabold text-white">{booking.from || 'Bangalore'}</p>
              <p className="text-xs text-slate-400 mt-0.5">Majestic Platform 3</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-cyan-400">
                {booking.busName || 'SeatEase Sleeper Express (2+1)'}
              </span>
              <div className="w-24 h-[2px] bg-cyan-500/40 my-1 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <span className="text-[10px] text-slate-500">Departure: {booking.departureTime || '21:30'}</span>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">To</span>
              <p className="text-lg font-extrabold text-white">{booking.to || 'Chennai'}</p>
              <p className="text-xs text-slate-400 mt-0.5">Central Bus Interchange</p>
            </div>
          </div>

          {/* Passenger & Seat Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Passenger Info */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                Passenger Details
              </h3>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-sm">{booking.customer.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>+91 {booking.customer.mobile}</span>
                </div>
                {booking.customer.email && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>{booking.customer.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seat Numbers & Fare */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                Seat &amp; Payment Summary
              </h3>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Reserved Seats:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {booking.seatIds.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-blue-600/40 border border-blue-400 text-cyan-300 font-bold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Seats:</span>
                  <span className="font-bold text-white">{booking.seatIds.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fare per Seat:</span>
                  <span className="font-bold text-white">₹{SEAT_PRICE}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-white text-sm">Total Paid:</span>
                  <span className="text-xl font-black text-cyan-400">₹{booking.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Verification for Viva demonstration */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-white">Conductor Verification QR</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Scan to verify PNR #{booking.pnr} on Java REST API.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-right">
              <p>College Java Mini Project</p>
              <p>MySQL seatease_db verified</p>
            </div>
          </div>
        </div>

        {/* Jagged / Perforated Border effect */}
        <div className="relative h-4 bg-slate-950 flex items-center justify-between px-2 overflow-hidden">
          <div className="w-full border-b border-dashed border-slate-700" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer border border-slate-700 shadow-md"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          Print / Save E-Ticket
        </button>

        <button
          onClick={onViewMyBookings}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer border border-slate-700 shadow-md"
        >
          <Ticket className="w-4 h-4 text-purple-400" />
          View in My Bookings
        </button>

        <button
          onClick={onBookAnother}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Bus className="w-4 h-4" />
          Book Another Ticket
        </button>
      </div>
    </div>
  );
};
