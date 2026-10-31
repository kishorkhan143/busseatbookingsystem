import React, { useState } from 'react';
import { Bus, Clock, Star, Wifi, BatteryCharging, Droplet, Shield, Armchair, ChevronRight, Filter } from 'lucide-react';

export interface BusService {
  id: string;
  name: string;
  type: string;
  category: 'AC Sleeper' | 'Volvo Multi-Axle' | 'Express Seater' | 'Super Deluxe';
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromLocation: string;
  toLocation: string;
  rating: number;
  reviewCount: number;
  basePrice: number;
  amenities: string[];
  isPrimo?: boolean;
}

interface BusListProps {
  fromCity: string;
  toCity: string;
  travelDate: string;
  availableSeatCount: number;
  totalSeats: number;
  selectedBusId: string;
  onSelectBus: (bus: BusService) => void;
  onViewSeatsClick: () => void;
}

export const BusList: React.FC<BusListProps> = ({
  fromCity,
  toCity,
  travelDate,
  availableSeatCount,
  totalSeats,
  selectedBusId,
  onSelectBus,
  onViewSeatsClick,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ac' | 'sleeper' | 'seater' | 'topRated'>('all');

  // Realistic mock bus fleet operating on the chosen route
  const busFleet: BusService[] = [
    {
      id: 'BUS-101',
      name: 'SeatEase Sleeper Express (2+1)',
      type: 'AC Sleeper / Seater Hybrid',
      category: 'AC Sleeper',
      departureTime: '21:30',
      arrivalTime: '05:30',
      duration: '8h 00m',
      fromLocation: `${fromCity} Central Majestic`,
      toLocation: `${toCity} Koyambedu / Koyal`,
      rating: 4.8,
      reviewCount: 428,
      basePrice: 150,
      amenities: ['WiFi', 'Charging Point', 'Blanket', 'Live GPS Tracking'],
      isPrimo: true,
    },
    {
      id: 'BUS-102',
      name: 'SRS Royal Volvo Multi-Axle B11R',
      type: 'Premium AC Semi-Sleeper',
      category: 'Volvo Multi-Axle',
      departureTime: '22:15',
      arrivalTime: '06:00',
      duration: '7h 45m',
      fromLocation: `${fromCity} Satellite Terminal`,
      toLocation: `${toCity} Central Station`,
      rating: 4.6,
      reviewCount: 312,
      basePrice: 150,
      amenities: ['Charging Point', 'Water Bottle', 'Emergency Exit', 'Air Suspension'],
      isPrimo: true,
    },
    {
      id: 'BUS-103',
      name: 'GreenLine InterCity Swift',
      type: 'Executive 2+2 Seater Express',
      category: 'Express Seater',
      departureTime: '18:45',
      arrivalTime: '02:30',
      duration: '7h 45m',
      fromLocation: `${fromCity} Shantinagar Bus Stand`,
      toLocation: `${toCity} Ring Road Hub`,
      rating: 4.3,
      reviewCount: 189,
      basePrice: 150,
      amenities: ['Reading Light', 'Charging Point', 'Emergency Hammer'],
    },
    {
      id: 'BUS-104',
      name: 'KSRTC Airavat Gold Class Deluxe',
      type: 'Govt. Certified AC Comfort',
      category: 'Super Deluxe',
      departureTime: '23:00',
      arrivalTime: '06:45',
      duration: '7h 45m',
      fromLocation: `${fromCity} Kempegowda Terminal`,
      toLocation: `${toCity} Bus Port`,
      rating: 4.5,
      reviewCount: 520,
      basePrice: 150,
      amenities: ['Water Bottle', 'Blanket', 'First Aid Box', 'GPS Tracking'],
    },
  ];

  // Filtering logic
  const filteredBuses = busFleet.filter((bus) => {
    if (activeFilter === 'ac') return bus.type.includes('AC');
    if (activeFilter === 'sleeper') return bus.category.includes('Sleeper');
    if (activeFilter === 'seater') return bus.category.includes('Seater');
    if (activeFilter === 'topRated') return bus.rating >= 4.6;
    return true;
  });

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Route & Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <span>{fromCity}</span>
            <span className="text-slate-500">&rarr;</span>
            <span>{toCity}</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-300 font-normal">
              {new Date(travelDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Available Buses ({filteredBuses.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a bus to inspect seat availability on the 30-seat interactive layout.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter:</span>
          </div>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Buses
          </button>
          <button
            onClick={() => setActiveFilter('ac')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFilter === 'ac'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            AC Only
          </button>
          <button
            onClick={() => setActiveFilter('sleeper')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFilter === 'sleeper'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Sleeper
          </button>
          <button
            onClick={() => setActiveFilter('seater')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFilter === 'seater'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Seater
          </button>
          <button
            onClick={() => setActiveFilter('topRated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFilter === 'topRated'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            4.6+ ★ Top Rated
          </button>
        </div>
      </div>

      {/* Responsive Bus Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBuses.map((bus) => {
          const isSelected = selectedBusId === bus.id;

          return (
            <div
              key={bus.id}
              className={`relative bg-[#111C2E] rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-500/80 ring-2 ring-cyan-500/30 shadow-xl shadow-cyan-950/40'
                  : 'border-slate-800 hover:border-slate-700 hover:shadow-lg'
              }`}
            >
              {/* Card Header & Operator Info */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {bus.name}
                      </h3>
                      {bus.isPrimo && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-600/40 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-amber-400" />
                          Primo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{bus.type}</p>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 rounded-lg text-emerald-300 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                    <span>{bus.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-emerald-400/70 font-normal">
                      ({bus.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Timing & Route Stops */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 items-center text-center">
                  <div className="text-left">
                    <p className="text-lg font-extrabold text-white">{bus.departureTime}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[120px]" title={bus.fromLocation}>
                      {fromCity}
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {bus.duration}
                    </span>
                    <div className="w-full flex items-center justify-center my-1">
                      <div className="h-[2px] w-12 bg-slate-700 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">Direct Route</span>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-extrabold text-white">{bus.arrivalTime}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[120px]" title={bus.toLocation}>
                      {toCity}
                    </p>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {bus.amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1"
                    >
                      {item.includes('WiFi') && <Wifi className="w-3 h-3 text-cyan-400" />}
                      {item.includes('Charging') && <BatteryCharging className="w-3 h-3 text-emerald-400" />}
                      {item.includes('Water') && <Droplet className="w-3 h-3 text-blue-400" />}
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Live Seat Count & Action Button */}
              <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Armchair className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">
                        {availableSeatCount} Seats Left
                      </span>
                      <span className="text-xs text-slate-500">
                        / {totalSeats} Total
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Starting at <span className="text-cyan-400 font-bold text-sm">₹{bus.basePrice}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectBus(bus);
                    onViewSeatsClick();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <Bus className="w-4 h-4" />
                  <span>{isSelected ? 'View Seat Layout' : 'Select Bus & Seats'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
