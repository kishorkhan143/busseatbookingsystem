import React from 'react';
import {
  Armchair,
  ArrowRight,
  Star,
  Bus,
} from 'lucide-react';
import { POPULAR_ROUTES, PopularRoute } from '../services/api';
import { NavTab } from './TopMenuBar';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenSearch?: () => void;
  availableSeatsCount?: number;
  totalSeatsCount?: number;
  bookedSeatsCount?: number;
  onSelectRoute?: (from: string, to: string, routeId?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectRoute,
}) => {
  return (
    <div className="space-y-8 sm:space-y-10 pb-24 animate-fade-in">

      {/* Popular Routes Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Bus className="w-5 h-5 text-cyan-400" />
              <span>Popular Luxury Routes</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any route to jump straight into live seat selection
            </p>
          </div>

          <button
            onClick={() => onNavigate('ticket-booking')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {POPULAR_ROUTES.map((route: PopularRoute) => (
            <div
              key={route.id}
              className="relative overflow-hidden backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_8px_25px_rgba(0,0,0,0.3)] space-y-4 group hover:border-cyan-400/40 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

              {/* Route Cities & Times */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base sm:text-lg font-black text-white">
                  <span>{route.from}</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                  <span>{route.to}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{route.rating}</span>
                </div>
              </div>

              {/* Operator & Bus Type */}
              <div>
                <p className="text-xs font-bold text-slate-200">{route.operator}</p>
                <p className="text-[11px] text-slate-400">{route.busType}</p>
              </div>

              {/* Timings & Duration */}
              <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Departs</span>
                  <span className="font-bold text-slate-200">{route.departureTime}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-cyan-400 font-bold block">{route.duration}</span>
                  <span className="text-[10px] text-slate-500">{route.distance}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Arrives</span>
                  <span className="font-bold text-slate-200">{route.arrivalTime}</span>
                </div>
              </div>

              {/* Amenities tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {route.amenities.slice(0, 3).map((amenity: string) => (
                  <span
                    key={amenity}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              {/* Card Footer: Price & CTA */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Starts from</span>
                  <span className="text-lg font-black text-cyan-300">₹{route.pricePerSeat}</span>
                </div>

                <button
                  onClick={() => {
                    if (onSelectRoute) {
                      onSelectRoute(route.from, route.to, route.id);
                    } else {
                      onNavigate('ticket-booking');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all cursor-pointer active:scale-95"
                >
                  <Armchair className="w-3.5 h-3.5" />
                  <span>Select Seats</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
