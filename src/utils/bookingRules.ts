/**
 * Core pure business logic rules for SeatEase
 * Decoupled from UI to ensure fast, deterministic unit testing.
 */

export interface SeatItem {
  seatId: string;
  rowName: string;
  seatNumber: number;
  price: number;
  status: 'AVAILABLE' | 'SELECTED' | 'BOOKED';
}

export const SEAT_PRICE = 150;

/**
 * Validates passenger details.
 */
export function validatePassenger(name: string, mobile: string, selectedSeatIds: string[]): {
  isValid: boolean;
  errors: { name?: string; mobile?: string; seats?: string };
} {
  const errors: { name?: string; mobile?: string; seats?: string } = {};

  if (!name || name.trim().length === 0) {
    errors.name = 'Customer name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  const cleanMobile = mobile ? mobile.trim() : '';
  const mobileRegex = /^[0-9]{10}$/;
  if (!cleanMobile) {
    errors.mobile = 'Mobile number is required.';
  } else if (!mobileRegex.test(cleanMobile)) {
    errors.mobile = 'Mobile number must contain exactly 10 digits.';
  }

  if (!selectedSeatIds || selectedSeatIds.length === 0) {
    errors.seats = 'At least one seat must be selected.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calculates total booking amount dynamically based on selected seats.
 */
export function calculateTotalAmount(seatCount: number, pricePerSeat: number = SEAT_PRICE): number {
  if (seatCount <= 0) return 0;
  return seatCount * pricePerSeat;
}

/**
 * Generates the standard 30 seats (A1-A6 to E1-E6)
 */
export function generateInitialSeats(): SeatItem[] {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatsPerRow = 6;
  const seats: SeatItem[] = [];

  for (const row of rows) {
    for (let num = 1; num <= seatsPerRow; num++) {
      seats.push({
        seatId: `${row}${num}`,
        rowName: row,
        seatNumber: num,
        price: SEAT_PRICE,
        status: 'AVAILABLE',
      });
    }
  }

  return seats;
}

/**
 * Handles toggling a seat selection.
 * Returns updated selected seat IDs array.
 */
export function toggleSeatSelection(
  currentSelected: string[],
  seatId: string,
  isAvailable: boolean
): string[] {
  if (!isAvailable) {
    return currentSelected; // Cannot select booked seats
  }

  if (currentSelected.includes(seatId)) {
    return currentSelected.filter((id) => id !== seatId);
  } else {
    return [...currentSelected, seatId].sort();
  }
}

/**
 * Validates if all requested seats are available in the current seat map.
 */
export function areSeatsAvailable(seats: SeatItem[], requestedSeatIds: string[]): boolean {
  if (requestedSeatIds.length === 0) return false;

  for (const reqId of requestedSeatIds) {
    const seat = seats.find((s) => s.seatId === reqId);
    if (!seat || seat.status !== 'AVAILABLE') {
      return false;
    }
  }
  return true;
}
