import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePassenger,
  calculateTotalAmount,
  generateInitialSeats,
  toggleSeatSelection,
} from './bookingRules';

test('validatePassenger returns valid when inputs are correct', () => {
  const result = validatePassenger('Kishor Khan', '9876543210', ['A1']);
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('validatePassenger flags missing or invalid fields', () => {
  const result = validatePassenger('', '123', []);
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.mobile);
  assert.ok(result.errors.seats);
});

test('calculateTotalAmount calculates correct price', () => {
  assert.equal(calculateTotalAmount(0), 0);
  assert.equal(calculateTotalAmount(1, 150), 150);
  assert.equal(calculateTotalAmount(3, 150), 450);
});

test('generateInitialSeats creates 30 seats', () => {
  const seats = generateInitialSeats();
  assert.equal(seats.length, 30);
  assert.equal(seats[0].seatId, 'A1');
  assert.equal(seats[29].seatId, 'E6');
});

test('toggleSeatSelection toggles seat selection state', () => {
  let selected = toggleSeatSelection([], 'A1', true);
  assert.deepEqual(selected, ['A1']);

  selected = toggleSeatSelection(selected, 'B2', true);
  assert.deepEqual(selected, ['A1', 'B2']);

  selected = toggleSeatSelection(selected, 'A1', true);
  assert.deepEqual(selected, ['B2']);
});
