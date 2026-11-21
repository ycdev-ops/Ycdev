import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProjectEstimate,
  filterItemsByDiscipline,
  formatIdrRange,
  validateConsultationForm,
} from './projectEstimator';

test('calculateProjectEstimate returns invalid state when no disciplines selected', () => {
  const result = calculateProjectEstimate({
    disciplines: [],
    scale: 'pilot',
    urgency: 'standard',
  });

  assert.equal(result.isValid, false);
  assert.equal(result.weeksMin, 0);
  assert.equal(result.formattedBudget, '—');
});

test('calculateProjectEstimate scales investment and reduces timeline when accelerated', () => {
  const standard = calculateProjectEstimate({
    disciplines: ['iot', 'cybersecurity'],
    scale: 'production',
    urgency: 'standard',
  });

  const accelerated = calculateProjectEstimate({
    disciplines: ['iot', 'cybersecurity'],
    scale: 'production',
    urgency: 'accelerated',
  });

  assert.equal(standard.isValid, true);
  assert.ok(accelerated.weeksMin < standard.weeksMin);
  assert.ok(accelerated.budgetMinMillions > standard.budgetMinMillions);
  assert.ok(standard.recommendedStack.includes('mTLS'));
  assert.equal(standard.deliverables.length, 2);
});

test('formatIdrRange formats millions clearly in Indonesian Rupiah', () => {
  assert.equal(formatIdrRange(25, 40), 'Rp 25 Juta – Rp 40 Juta');
});

test('filterItemsByDiscipline filters correctly for all vs single discipline', () => {
  const sample = [
    { id: '1', discipline: 'iot' as const },
    { id: '2', discipline: 'fullstack' as const },
    { id: '3', discipline: 'cybersecurity' as const },
  ];

  assert.equal(filterItemsByDiscipline(sample, 'all').length, 3);
  assert.deepEqual(
    filterItemsByDiscipline(sample, 'cybersecurity').map((x) => x.id),
    ['3']
  );
});

test('validateConsultationForm rejects invalid inputs and accepts valid phone or email', () => {
  const invalid = validateConsultationForm({
    name: 'A',
    contact: 'invalid-contact',
    company: '',
    message: 'terlalu pendek',
  });

  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.contact);
  assert.ok(invalid.errors.message);

  const validPhone = validateConsultationForm({
    name: 'Budi Santoso',
    contact: '081238668332',
    company: 'PT Logistik Nusantara',
    message: 'Kami membutuhkan sistem monitoring suhu gudang IoT dan dasbor web.',
  });
  assert.equal(validPhone.isValid, true);
  assert.deepEqual(validPhone.errors, {});

  const validEmail = validateConsultationForm({
    name: 'Sari Dewi',
    contact: 'sari@perusahaan.co.id',
    company: '',
    message: 'Audit keamanan aplikasi web dan REST API sebelum peluncuran kuartal depan.',
  });
  assert.equal(validEmail.isValid, true);
});
