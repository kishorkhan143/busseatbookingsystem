import React, { useState } from 'react';
import { User, Phone, Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { SEAT_PRICE, calculateTotalAmount, validatePassenger } from '../utils/bookingRules';
import { BusService } from './BusList';

interface BookingFormProps {
  selectedSeatIds: string[];
  bus?: BusService;
  onBackToSeats: () => void;
  onSubmitBooking: (customer: { name: string; mobile: string; email: string }) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedSeatIds,
  bus,
  onBackToSeats,
  onSubmitBooking,
  isSubmitting,
  errorMessage,
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [boardingPoint, setBoardingPoint] = useState('Majestic Central Bus Stand (Platform 3)');
  const [droppingPoint, setDroppingPoint] = useState('Central Terminal Interchange');
  const [errors, setErrors] = useState<{ name?: string; mobile?: string; seats?: string }>({});

  const totalAmount = calculateTotalAmount(selectedSeatIds.length, SEAT_PRICE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePassenger(name, mobile, selectedSeatIds);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    await onSubmitBooking({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
    });
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(val);
    if (errors.mobile && val.length === 10) {
      setErrors((prev) => ({ ...prev, mobile: undefined }));
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={onBackToSeats}
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Seat Selection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Passenger Details Form */}
        <div className="md:col-span-7 bg-[#111C2E] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-6">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Passenger Details</h2>
              <p className="text-xs text-slate-400">
                Tickets and SMS updates will be sent to these details.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-bold">Booking Request Failed</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Passenger Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Passenger Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Kishor Kumar"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-900 border rounded-xl text-white text-sm focus:outline-none transition-colors ${
                    errors.name
                      ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/20'
                      : 'border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mobile Number (10 Digits) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-slate-400 border-r border-slate-700 pr-2">
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={mobile}
                  onChange={handleMobileChange}
                  disabled={isSubmitting}
                  className={`w-full pl-16 pr-4 py-2.5 bg-slate-900 border rounded-xl text-white text-sm focus:outline-none transition-colors font-mono tracking-wider ${
                    errors.mobile
                      ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/20'
                      : 'border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                  }`}
                />
              </div>
              {errors.mobile ? (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.mobile}</p>
              ) : (
                <p className="text-[10px] text-slate-500 mt-1">
                  Required by Java backend for customer verification &amp; PNR retrieval.
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address <span className="text-slate-500 font-normal">(Optional for E-Ticket)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="passenger@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Boarding Point */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Boarding Point
              </label>
              <select
                value={boardingPoint}
                onChange={(e) => setBoardingPoint(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Majestic Central Bus Stand (Platform 3)">Majestic Central Bus Stand (Platform 3) - 21:00</option>
                <option value="Electronic City Toll Gate">Electronic City Toll Gate - 21:45</option>
                <option value="Silk Board Junction">Silk Board Junction - 21:30</option>
                <option value="Airport Toll Plaza">Airport Toll Plaza - 20:30</option>
              </select>
            </div>

            {/* Dropping Point */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Dropping Point
              </label>
              <select
                value={droppingPoint}
                onChange={(e) => setDroppingPoint(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Central Terminal Interchange">Central Terminal Interchange - 05:30</option>
                <option value="Airport Ring Road">Airport Ring Road - 06:00</option>
                <option value="Koyambedu Main Entrance">Koyambedu Main Entrance - 05:45</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || selectedSeatIds.length === 0}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Executing Java JDBC Transaction...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm &amp; Book Seats (₹{totalAmount})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Booking Summary Ticket Preview */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-[#111C2E] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Fare Breakdown</h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-[11px] text-slate-400">Bus Operator</p>
                <p className="font-bold text-white mt-0.5">{bus?.name || 'SeatEase Sleeper Express'}</p>
                <p className="text-[11px] text-cyan-400 mt-0.5">{bus?.type || 'AC Sleeper 2+1'}</p>
              </div>

              <div>
                <p className="text-[11px] text-slate-400 mb-1.5">Selected Seats:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeatIds.map((id) => (
                    <span
                      key={id}
                      className="px-2.5 py-1 rounded bg-blue-600/30 border border-blue-500 text-cyan-300 font-bold text-xs"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span>Seats Count:</span>
                  <span className="font-bold text-white">{selectedSeatIds.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per Seat:</span>
                  <span className="font-bold text-white">₹{SEAT_PRICE}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-white">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST / Platform Fee:</span>
                  <span className="text-emerald-400 font-semibold">₹0.00</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total Payable:</span>
                <span className="text-2xl font-black text-cyan-400">₹{totalAmount}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Safe &amp; Instant. No payment gateway required (College Mini Project).</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
