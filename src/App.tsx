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
import { ThemeProvider } from './context/ThemeContext';
import { TopMenuBar, NavTab } from './components/TopMenuBar';
import { BottomMenuBar } from './components/BottomMenuBar';
import { HomeView } from './components/HomeView';
import { TicketBookingView } from './components/TicketBookingView';
import { HomeStaysView } from './components/HomeStaysView';
import { MyBookingsView } from './components/MyBookingsView';
import { ProfileView } from './components/ProfileView';
import { GlobalSearchModal } from './components/GlobalSearchModal';

function MainApp() {
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

  // Handle bus booking creation
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

  // Handle cancellation (Bus ticket or Homestay)
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

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full bg-slate-100/90 text-slate-900 dark:bg-[#070b14] dark:text-slate-100 flex flex-col font-sans overflow-hidden selection:bg-cyan-500 selection:text-white transition-colors duration-200">
      {/* Dynamic Ambient Liquid Mesh - Underneath Apple Frosted Glass */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 sm:w-[580px] h-96 sm:h-[580px] rounded-full bg-gradient-to-br from-cyan-400/20 via-sky-500/15 to-transparent dark:from-cyan-500/25 dark:via-blue-600/15 dark:to-transparent blur-[110px] sm:blur-[140px] animate-liquid-1" />
        <div className="absolute top-1/4 -right-40 w-96 sm:w-[620px] h-96 sm:h-[620px] rounded-full bg-gradient-to-bl from-indigo-400/15 via-purple-500/15 to-transparent dark:from-indigo-600/20 dark:via-purple-600/15 dark:to-transparent blur-[120px] sm:blur-[150px] animate-liquid-2" />
        <div className="absolute -bottom-40 left-1/3 w-96 sm:w-[560px] h-96 sm:h-[560px] rounded-full bg-gradient-to-tr from-emerald-400/15 via-teal-400/10 to-transparent dark:from-emerald-500/15 dark:via-cyan-600/10 dark:to-transparent blur-[130px] sm:blur-[160px] animate-liquid-3" />
        <div className="absolute top-1/2 left-10 w-64 h-64 rounded-full bg-pink-400/10 dark:bg-pink-500/10 blur-[100px] pointer-events-none" />
      </div>

      {/* Top Menu Bar with Theme Toggle - Static at top */}
      <div className="shrink-0 w-full z-40">
        <TopMenuBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          availableSeatsCount={availableSeatsCount}
          totalBookingsCount={bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length}
          userName={userProfile.name}
        />
      </div>

      {/* Main View Area - Only scrollable region constrained to 1280px, with generous bottom padding for fixed static bar */}
      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain flex flex-col max-w-[1280px] mx-auto px-2 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-20 sm:pb-24 w-full">
        {activeTab === 'home' && (
          <div key="home" className="animate-fade-in w-full">
            <HomeView
              onNavigate={setActiveTab}
              onOpenSearch={() => setIsSearchOpen(true)}
              onSelectRoute={handleSelectRouteFromHome}
            />
          </div>
        )}

        {activeTab === 'ticket-booking' && (
          <div key="ticket-booking" className="animate-fade-in w-full">
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
              onViewBookings={() => {
                loadBookings();
                setActiveTab('my-bookings');
              }}
            />
          </div>
        )}

        {activeTab === 'homestays' && (
          <div key="homestays" className="animate-fade-in w-full">
            <HomeStaysView
              userProfile={userProfile}
              onViewBookings={() => {
                loadBookings();
                setActiveTab('my-bookings');
              }}
              onNavigate={setActiveTab}
            />
          </div>
        )}

        {activeTab === 'my-bookings' && (
          <div key="my-bookings" className="animate-fade-in w-full">
            <MyBookingsView
              bookings={bookings}
              onCancelBooking={handleCancelBooking}
              onNavigate={setActiveTab}
              isLoading={isLoadingBookings}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div key="profile" className="animate-fade-in w-full">
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

      {/* Static Non-Scrollable Bottom Segmented Tab Bar */}
      <BottomMenuBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingsCount={bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        bookings={bookings}
        onNavigate={setActiveTab}
        onSelectRoute={handleSelectRouteFromHome}
        onSelectBooking={() => {
          setActiveTab('my-bookings');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
