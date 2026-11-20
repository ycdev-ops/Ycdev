import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAssistantResponse } from './virtualAssistant';

test('generateAssistantResponse returns studio address and Yuan Nugroho phone on contact query', () => {
  const res = generateAssistantResponse('Dimana alamat kantor dan nomor Yuan Nugroho?');
  assert.match(res.text, /Jalan Puri Eksekutif A1, Tawangsari, Semarang Barat/);
  assert.match(res.text, /081238668332/);
  assert.match(res.text, /Yuan Nugroho/);
});

test('generateAssistantResponse matches Marine IoT Gateway IP67 product cleanly', () => {
  const res = generateAssistantResponse('Tolong jelaskan Marine IoT Gateway IP67 NMEA');
  assert.ok(res.matchedProduct);
  assert.equal(res.matchedProduct?.id, 'marine-iot-gateway');
  assert.match(res.text, /IP67/);
});

test('generateAssistantResponse matches Hybrid Satcom & Starlink Maritime query', () => {
  const res = generateAssistantResponse('Bagaimana cara kerja Starlink Maritime dan 5G?');
  assert.ok(res.matchedProduct);
  assert.equal(res.matchedProduct?.id, 'hybrid-satcom-terminal');
});

test('generateAssistantResponse answers client experience query mentioning Pelindo, Pemerintah, Tesla', () => {
  const res = generateAssistantResponse('Siapa saja klien seperti Pelindo atau Tesla?');
  assert.match(res.text, /Pelindo/);
  assert.match(res.text, /Tesla/);
  assert.match(res.text, /Pemerintah/);
});

test('generateAssistantResponse answers autodidact and certification queries cleanly', () => {
  const res = generateAssistantResponse('Apa saja sertifikat keahlian dan pengalaman autodidak?');
  assert.match(res.text, /OSCP/);
  assert.match(res.text, /AWS/);
  assert.match(res.text, /autodidak/);
});
