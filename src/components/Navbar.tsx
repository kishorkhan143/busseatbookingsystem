import React from 'react';
import { Bus, Ticket, BookOpen, Database, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'buses' | 'seats' | 'my-bookings' | 'viva' | 'database';
  setActiveTab: (tab: 'home' | 'buses' | 'seats' | 'my-bookings' | 'viva' | 'database') => void;
  selectedSeatsCount: number;
  isLiveBackend: boolean;
  onRefreshBackend: () => void;
  isCheckingBackend: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedSeatsCount,
  isLiveBackend,
  onRefreshBackend,
  isCheckingBackend,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0B1220]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                Seat<span className="text-cyan-400">Ease</span>
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'home'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('buses')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'buses'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Available Buses
            </button>
            <button
              onClick={() => setActiveTab('seats')}
              className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'seats'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Seat Layout (30)
              {selectedSeatsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-xs font-bold">
                  {selectedSeatsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'my-bookings'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Ticket className="w-4 h-4" />
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('viva')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'viva'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Viva Guide (20 Q&A)
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'database'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-4 h-4" />
              SQL & Schema
            </button>
          </nav>

          {/* Backend Status Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isLiveBackend
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                  : 'bg-indigo-950/80 text-indigo-300 border-indigo-800'
              }`}
              title={
                isLiveBackend
                  ? 'Connected to Live Java 17 HttpServer on port 8080'
                  : 'Operating in High-Fidelity Java OOP In-Memory Simulation'
              }
            >
              {isLiveBackend ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">Java 8080:</span> Live
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Engine:</span> Standalone Simulation
                </>
              )}
            </div>

            <button
              onClick={onRefreshBackend}
              disabled={isCheckingBackend}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Check Java Backend Status (port 8080)"
              aria-label="Refresh backend connection"
            >
              <RefreshCw className={`w-4 h-4 ${isCheckingBackend ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-800/80 overflow-x-auto text-xs gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'home' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('buses')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'buses' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Buses
          </button>
          <button
            onClick={() => setActiveTab('seats')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'seats' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Seats {selectedSeatsCount > 0 ? `(${selectedSeatsCount})` : ''}
          </button>
          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'my-bookings' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'viva' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Viva Prep
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'database' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
            }`}
          >
            SQL
          </button>
        </div>
      </div>
    </header>
  );
};
