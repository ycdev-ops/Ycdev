import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScrollProgress } from './scrollProgress';

test('calculateScrollProgress returns 0 at top and 1 at bottom', () => {
  assert.equal(calculateScrollProgress(0, 3000, 900), 0);
  assert.equal(calculateScrollProgress(2100, 3000, 900), 1);
});

test('calculateScrollProgress computes accurate midpoint fraction', () => {
  assert.equal(calculateScrollProgress(1050, 3000, 900), 0.5);
});

test('calculateScrollProgress clamps negative and overscroll values', () => {
  assert.equal(calculateScrollProgress(-120, 3000, 900), 0);
  assert.equal(calculateScrollProgress(5000, 3000, 900), 1);
});

test('calculateScrollProgress returns 0 when page is not scrollable', () => {
  assert.equal(calculateScrollProgress(0, 900, 900), 0);
  assert.equal(calculateScrollProgress(50, 600, 900), 0);
});
