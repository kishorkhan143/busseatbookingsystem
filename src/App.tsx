import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchSeats,
  createBooking,
  getAllBookings,
  cancelBooking,
  getUserProfile,
  saveUserProfile,
  resetSimulatedData,
  BookingData,
  UserProfile,
} from './services/api';
import { SeatItem, toggleSeatSelection } from './utils/bookingRules';
import { TopMenuBar, NavTab } from './components/TopMenuBar';
import { BottomMenuBar } from './components/BottomMenuBar';
import { HomeView } from './components/HomeView';
import { TicketBookingView } from './components/TicketBookingView';
import { MyBookingsView } from './components/MyBookingsView';
import { ProfileView } from './components/ProfileView';
import { GlobalSearchModal } from './components/GlobalSearchModal';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Active Route & Bus
  const [selectedFromCity, setSelectedFromCity] = useState<string>('Bangalore');
  const [selectedToCity, setSelectedToCity] = useState<string>('Chennai');
  const [currentBusId, setCurrentBusId] = useState<string>('blr-chn-1');

  // Seats State
  const [seats, setSeats] = useState<SeatItem[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);

  // Bookings State
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());

  // Load seats from backend or local engine
  const loadSeats = useCallback(async (busId?: string) => {
    const targetBus = busId || currentBusId;
    setIsLoadingSeats(true);
    try {
      const resp = await fetchSeats(targetBus);
      setSeats(resp.data);
      if (busId && busId !== currentBusId) {
        setCurrentBusId(busId);
      }
    } catch (err) {
      console.error('Failed to load seats:', err);
    } finally {
      setIsLoadingSeats(false);
    }
  }, [currentBusId]);

  // Load all bookings
  const loadBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    loadSeats();
    loadBookings();
  }, [loadSeats, loadBookings]);

  // Handle seat selection toggle
  const handleToggleSeat = (seatId: string, isAvailable: boolean) => {
    if (!isAvailable) return;
    setSelectedSeatIds((prev) => toggleSeatSelection(prev, seatId, isAvailable));
  };

  const handleClearSelection = () => {
    setSelectedSeatIds([]);
  };

  // Handle booking creation
  const handleBookSeats = async (payload: {
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
  }): Promise<BookingData> => {
    const result = await createBooking({
      ...payload,
      seatIds: selectedSeatIds,
    });

    setSelectedSeatIds([]);
    await loadSeats(payload.busId);
    await loadBookings();
    return result.data;
  };

  // Handle cancellation
  const handleCancelBooking = async (bookingId: number) => {
    await cancelBooking(bookingId);
    await loadSeats(currentBusId);
    await loadBookings();
  };

  // Route selected from Home View
  const handleSelectRouteFromHome = (from: string, to: string, routeId?: string) => {
    setSelectedFromCity(from);
    setSelectedToCity(to);
    let targetBus = 'blr-chn-1';
    if (routeId) {
      targetBus = `${routeId}-1`;
    }
    setCurrentBusId(targetBus);
    loadSeats(targetBus);
    setSelectedSeatIds([]);
    setActiveTab('ticket-booking');
  };

  // Handle Profile Update
  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    saveUserProfile(updated);
  };

  // Handle full reset of simulated data
  const handleResetAllData = () => {
    resetSimulatedData();
    setUserProfile(getUserProfile());
    loadSeats('blr-chn-1');
    loadBookings();
    setActiveTab('home');
  };

  const availableSeatsCount = seats.filter((s) => s.status === 'AVAILABLE').length;
  const bookedSeatsCount = seats.length - availableSeatsCount;

  return (
    <div className="relative min-h-screen bg-[#070C16] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Dynamic Ambient Glassmorphism Glow Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-80 sm:w-[540px] h-80 sm:h-[540px] rounded-full bg-cyan-500/[0.12] blur-[100px] sm:blur-[140px] animate-float-slow" />
        <div className="absolute top-1/3 -right-32 w-80 sm:w-[560px] h-80 sm:h-[560px] rounded-full bg-indigo-500/[0.12] blur-[110px] sm:blur-[150px]" />
        <div className="absolute -bottom-32 left-1/4 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-emerald-500/[0.08] blur-[120px] sm:blur-[160px]" />
      </div>

      {/* Top Menu Bar */}
      <TopMenuBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        availableSeatsCount={availableSeatsCount}
        totalBookingsCount={bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length}
        userName={userProfile.name}
      />

      {/* Main View Area with Butter-Smooth Page Transitions */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 w-full">
        {activeTab === 'home' && (
          <div key="home" className="animate-fade-in">
            <HomeView
              onNavigate={setActiveTab}
              onOpenSearch={() => setIsSearchOpen(true)}
              availableSeatsCount={availableSeatsCount}
              totalSeatsCount={seats.length || 30}
              bookedSeatsCount={bookedSeatsCount}
              onSelectRoute={handleSelectRouteFromHome}
            />
          </div>
        )}

        {activeTab === 'ticket-booking' && (
          <div key="ticket-booking" className="animate-fade-in">
            <TicketBookingView
              seats={seats}
              selectedSeatIds={selectedSeatIds}
              onToggleSeat={handleToggleSeat}
              onClearSelection={handleClearSelection}
              onRefreshSeats={loadSeats}
              isLoadingSeats={isLoadingSeats}
              onBookSeats={handleBookSeats}
              userProfile={userProfile}
              initialFromCity={selectedFromCity}
              initialToCity={selectedToCity}
              initialBusId={currentBusId}
              onViewBookings={() => setActiveTab('my-bookings')}
            />
          </div>
        )}

        {activeTab === 'my-bookings' && (
          <div key="my-bookings" className="animate-fade-in">
            <MyBookingsView
              bookings={bookings}
              onCancelBooking={handleCancelBooking}
              onNavigate={setActiveTab}
              isLoading={isLoadingBookings}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div key="profile" className="animate-fade-in">
            <ProfileView
              profile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onNavigate={setActiveTab}
              onResetAllData={handleResetAllData}
              totalBookingsCount={bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length}
            />
          </div>
        )}
      </main>

      {/* Bottom Liquid Glass Menu Bar */}
      <BottomMenuBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingsCount={bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length}
      />

      {/* Global Liquid Glass Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        bookings={bookings}
        onNavigate={setActiveTab}
        onSelectRoute={handleSelectRouteFromHome}
        onSelectBooking={(b) => {
          setActiveTab('my-bookings');
        }}
      />
    </div>
  );
}
