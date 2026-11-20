import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterMaritimeSolutions,
  formatMaritimeInquiryScope,
  MARITIME_CATEGORIES,
  MARITIME_SOLUTIONS,
} from './maritimeCatalog';

test('MARITIME_SOLUTIONS contains all 12 items evenly across 3 categories', () => {
  assert.equal(MARITIME_SOLUTIONS.length, 12);
  assert.equal(MARITIME_CATEGORIES.length, 3);
  assert.equal(filterMaritimeSolutions(MARITIME_SOLUTIONS, 'hardware').length, 4);
  assert.equal(filterMaritimeSolutions(MARITIME_SOLUTIONS, 'software').length, 4);
  assert.equal(filterMaritimeSolutions(MARITIME_SOLUTIONS, 'services').length, 4);
});

test('filterMaritimeSolutions returns full catalog when filter is all', () => {
  const all = filterMaritimeSolutions(MARITIME_SOLUTIONS, 'all');
  assert.equal(all.length, 12);
});

test('formatMaritimeInquiryScope includes category label, product name, and standards', () => {
  const gateway = MARITIME_SOLUTIONS.find((item) => item.id === 'marine-iot-gateway');
  assert.ok(gateway);
  const summary = formatMaritimeInquiryScope(gateway);
  assert.match(summary, /YcDev Marine IoT Gateway \(Edge Box\)/);
  assert.match(summary, /IP67/);
  assert.match(summary, /NMEA 0183\/2000/);
});
