import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePassenger,
  calculateTotalAmount,
  generateInitialSeats,
  toggleSeatSelection,
  areSeatsAvailable,
} from './bookingRules';

test('calculateTotalAmount returns correct price', () => {
  assert.equal(calculateTotalAmount(0), 0);
  assert.equal(calculateTotalAmount(1), 150);
  assert.equal(calculateTotalAmount(2), 300);
  assert.equal(calculateTotalAmount(4), 600);
});

test('generateInitialSeats creates exactly 30 seats across rows A to E', () => {
  const seats = generateInitialSeats();
  assert.equal(seats.length, 30);
  assert.equal(seats[0].seatId, 'A1');
  assert.equal(seats[29].seatId, 'E6');

  const rows = new Set(seats.map((s) => s.rowName));
  assert.deepEqual(Array.from(rows).sort(), ['A', 'B', 'C', 'D', 'E']);
});

test('validatePassenger catches missing or invalid fields', () => {
  // Empty name
  let res = validatePassenger('', '9876543210', ['A1']);
  assert.equal(res.isValid, false);
  assert.ok(res.errors.name);

  // Invalid mobile (< 10 digits or characters)
  res = validatePassenger('Kishor', '98765', ['A1']);
  assert.equal(res.isValid, false);
  assert.ok(res.errors.mobile);

  res = validatePassenger('Kishor', '987654321A', ['A1']);
  assert.equal(res.isValid, false);
  assert.ok(res.errors.mobile);

  // Empty seats
  res = validatePassenger('Kishor', '9876543210', []);
  assert.equal(res.isValid, false);
  assert.ok(res.errors.seats);

  // Valid input
  res = validatePassenger('Kishor', '9876543210', ['A1', 'A2']);
  assert.equal(res.isValid, true);
  assert.equal(Object.keys(res.errors).length, 0);
});

test('toggleSeatSelection selects, deselects, and refuses booked seats', () => {
  // Select available
  let selected = toggleSeatSelection([], 'A1', true);
  assert.deepEqual(selected, ['A1']);

  // Add another
  selected = toggleSeatSelection(selected, 'B2', true);
  assert.deepEqual(selected, ['A1', 'B2']);

  // Deselect A1
  selected = toggleSeatSelection(selected, 'A1', true);
  assert.deepEqual(selected, ['B2']);

  // Try to select booked seat
  selected = toggleSeatSelection(selected, 'C3', false);
  assert.deepEqual(selected, ['B2']); // Unchanged
});

test('areSeatsAvailable accurately checks seat states', () => {
  const seats = generateInitialSeats();
  seats[0].status = 'BOOKED'; // A1 booked

  assert.equal(areSeatsAvailable(seats, ['A2', 'A3']), true);
  assert.equal(areSeatsAvailable(seats, ['A1', 'A2']), false); // A1 is booked
  assert.equal(areSeatsAvailable(seats, ['Z9']), false); // Non-existent
});
