import React from 'react';
import { Bus, Heart, Sparkles, BookOpen, Terminal, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1220] border-t border-slate-800 text-slate-400 py-10 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                <Bus className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-white">
                Seat<span className="text-cyan-400">Ease</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Online Seat Booking System &mdash; Built for college project presentation, practical demonstrations, and external viva examination.
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Technology Stack
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Java 17 (com.sun.net.httpserver)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Raw JDBC + MySQL Connector/J
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Google Gson (JSON Parsing)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                React 19 + Vite + Tailwind CSS
              </li>
            </ul>
          </div>

          {/* OOP Principles */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Demonstrated Concepts
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>&bull; Encapsulation in Model Classes</li>
              <li>&bull; Composition (Booking HAS Customer)</li>
              <li>&bull; DAO (Data Access Object) Pattern</li>
              <li>&bull; ACID Transactions &amp; SELECT FOR UPDATE</li>
              <li>&bull; Strict PreparedStatement Sanitization</li>
            </ul>
          </div>

          {/* Quick Links / Guide */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              College Project Info
            </h4>
            <p className="text-[11px] text-slate-400 mb-2">
              Fixed seat fare: <strong className="text-cyan-300">₹150</strong> per seat across 30 seats (A1&ndash;E6).
            </p>
            <p className="text-[11px] text-slate-500">
              Backend source files located in <code className="text-cyan-400">backend/src/main/java</code>.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} SeatEase &mdash; Online Seat Booking System. Academic Project.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed for college evaluation &amp; RedBus UI experience</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
