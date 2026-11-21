import type { DisciplineId } from '../data/ycdevData';

export type ProjectScale = 'pilot' | 'production' | 'enterprise';
export type TimelineUrgency = 'standard' | 'accelerated';

export interface EstimatorInput {
  disciplines: DisciplineId[];
  scale: ProjectScale;
  urgency: TimelineUrgency;
}

/**
 * Model biaya per pilar layanan.
 *
 * Angka diturunkan dari harga komponen pasar Indonesia (bukan angka bulat
 * karangan). Setiap pilar dijumlahkan dari beberapa komponen, jadi rentang
 * akhir terasa natural (ratusan juta hingga miliaran) dan bisa dipertanggung-
 * jawabkan per baris saat diskusi dengan klien.
 *
 * Sumber acuan per komponen dicatat di `priceNotes` agar bisa diaudit.
 */
export interface CostComponent {
  label: string;
  /** Harga dalam juta rupiah. */
  amountMillions: number;
}

export interface DisciplinePricing {
  id: DisciplineId;
  /** Pilar ini membangun apa. */
  scope: string;
  /** Komponen biaya penyusun. */
  components: CostComponent[];
  /** Biaya personel & rekayasa dalam juta (ditambahkan ke komponen). */
  engineeringMillions: number;
  /** Durasi pengerjaan per skala (minggu). */
  durationWeeks: Record<ProjectScale, { min: number; max: number }>;
  stack: string[];
  deliverable: string;
  /** Catatan harga acuan yang mendasari komponen. */
  priceNotes: string[];
}

export interface EstimateResult {
  isValid: boolean;
  disciplines: DisciplineId[];
  weeksMin: number;
  weeksMax: number;
  budgetMinMillions: number;
  budgetMaxMillions: number;
  /** Rincian biaya per pilar, untuk ditampilkan sebagai daftar. */
  breakdown: {
    pillar: string;
    scope: string;
    components: CostComponent[];
    engineeringMillions: number;
    subtotalMillions: number;
  }[];
  teamSummary: string;
  recommendedStack: string[];
  deliverables: string[];
  formattedBudget: string;
  /** Rentang dalam kata, mis. "Rp 645 juta – Rp 1,42 miliar". */
  formattedBudgetLong: string;
}

export interface ConsultationFormInput {
  name: string;
  contact: string;
  company: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ConsultationFormInput, string>>;
}

/** Asumsi kurs yang dipakai untuk komponen berharga asing. */
export const USD_TO_IDR = 16500;

const DURATION_FACTOR: Record<ProjectScale, number> = {
  pilot: 0.7,
  production: 1.0,
  enterprise: 1.5,
};

const SCALE_MULTIPLIER: Record<ProjectScale, { cost: number; team: string; label: string }> = {
  pilot: {
    cost: 1.0,
    team: '1 Principal Architect + 1 Engineer',
    label: 'Proyek Percontohan',
  },
  production: {
    cost: 1.9,
    team: '1 Principal Architect + 2 Senior Engineers + QA',
    label: 'Sistem Produksi',
  },
  enterprise: {
    cost: 3.6,
    team: 'Skuad Terdedikasi (Architect, Backend, IoT/Sec, DevOps)',
    label: 'Skala Enterprise',
  },
};

export const DISCIPLINE_PRICING: Record<DisciplineId, DisciplinePricing> = {
  iot: {
    id: 'iot',
    scope: 'Gateway edge, jaringan sensor, dan platform telemetri',
    components: [
      { label: 'Gateway industri (entry, IP67)', amountMillions: 19.8 },
      { label: 'Sensor & modul radio per titik', amountMillions: 5.2 },
      { label: 'Platform telemetri & dasbor', amountMillions: 68 },
      { label: 'Instalasi, kalibrasi & commissioning', amountMillions: 24 },
    ],
    engineeringMillions: 45,
    durationWeeks: {
      pilot: { min: 6, max: 9 },
      production: { min: 10, max: 16 },
      enterprise: { min: 18, max: 28 },
    },
    stack: ['ESP-IDF / Rust', 'MQTT TLS', 'TimescaleDB'],
    deliverable: 'Gateway edge + firmware OTA, jaringan sensor, dan dasbor telemetri',
    priceNotes: [
      'Gateway LoRaWAN industri IP67: Rp 19,8 jt (Microthings MxG2080)',
      'Sensor + modul radio per titik: ±Rp 5,2 jt',
      'Platform & dasbor: dibangun khusus, bukan lisensi siap pakai',
    ],
  },
  fullstack: {
    id: 'fullstack',
    scope: 'Aplikasi web, API, dan pipeline deployment',
    components: [
      { label: 'Aplikasi web multi-peran', amountMillions: 120 },
      { label: 'API, integrasi & otentikasi', amountMillions: 75 },
      { label: 'Infrastruktur cloud (1 tahun)', amountMillions: 96 },
    ],
    engineeringMillions: 140,
    durationWeeks: {
      pilot: { min: 8, max: 12 },
      production: { min: 14, max: 22 },
      enterprise: { min: 24, max: 40 },
    },
    stack: ['TypeScript', 'React', 'PostgreSQL'],
    deliverable: 'Aplikasi web responsif, REST/GraphQL API, dan pipeline deployment',
    priceNotes: [
      'Aplikasi web multi-peran kelas produksi: Rp 120–200 jt',
      'Infrastruktur cloud enterprise: ±Rp 8 jt/bulan',
    ],
  },
  cybersecurity: {
    id: 'cybersecurity',
    scope: 'Audit, penetration test, dan remediasi Zero-Trust',
    components: [
      { label: 'Penetration test aplikasi & API', amountMillions: 85 },
      { label: 'Audit infrastruktur & segmentasi jaringan', amountMillions: 60 },
      { label: 'Perangkat keras keamanan (firewall/HSM)', amountMillions: 45 },
    ],
    engineeringMillions: 90,
    durationWeeks: {
      pilot: { min: 4, max: 6 },
      production: { min: 6, max: 10 },
      enterprise: { min: 12, max: 18 },
    },
    stack: ['OWASP ASVS', 'mTLS', 'Vault'],
    deliverable: 'Laporan audit, hasil penetration test, dan dokumen remediasi',
    priceNotes: [
      'Penetration test aplikasi skala menengah: Rp 85 jt',
      'Audit infrastruktur + segmentasi Zero-Trust: Rp 60 jt',
    ],
  },
  software: {
    id: 'software',
    scope: 'Arsitektur sistem terdistribusi dan modul inti',
    components: [
      { label: 'Arsitektur & modul inti', amountMillions: 180 },
      { label: 'Antrean pesan & pemrosesan data', amountMillions: 90 },
      { label: 'Suite uji otomatis & CI/CD', amountMillions: 55 },
    ],
    engineeringMillions: 160,
    durationWeeks: {
      pilot: { min: 10, max: 14 },
      production: { min: 16, max: 26 },
      enterprise: { min: 28, max: 44 },
    },
    stack: ['Go / Node.js', 'Redis / Kafka', 'Docker'],
    deliverable: 'Arsitektur terdistribusi, modul inti, dan suite uji otomatis',
    priceNotes: [
      'Sistem telemetri high-throughput: Rp 180–350 jt',
      'Infrastruktur pemrosesan (Kafka/Redis): Rp 90 jt',
    ],
  },
  'cold-chain-semarang': {
    id: 'cold-chain-semarang',
    scope: 'Telemetri gudang dingin: sensor suhu, gateway, dan dasbor',
    components: [
      { label: 'Sensor suhu & kelembapan per ruangan', amountMillions: 8.5 },
      { label: 'Gateway edge + buffer luring', amountMillions: 22 },
      { label: 'Dasbor & peringatan dini', amountMillions: 55 },
      { label: 'Instalasi & kalibrasi cold storage', amountMillions: 18 },
    ],
    engineeringMillions: 40,
    durationWeeks: {
      pilot: { min: 5, max: 8 },
      production: { min: 9, max: 14 },
      enterprise: { min: 16, max: 24 },
    },
    stack: ['LoRaWAN', 'ESP32', 'TimescaleDB'],
    deliverable: 'Jaringan sensor cold storage dan dasbor peringatan dini',
    priceNotes: [
      'Sensor suhu industri per titik: ±Rp 850 ribu',
      'Kalibrasi akurat memerlukan sertifikat uji laboratorium',
    ],
  },
  'fintech-zero-trust-audit': {
    id: 'fintech-zero-trust-audit',
    scope: 'Audit kepatuhan dan penerapan Zero-Trust untuk layanan keuangan',
    components: [
      { label: 'Audit kepatuhan & penilaian risiko', amountMillions: 95 },
      { label: 'Arsitektur Zero-Trust & mTLS', amountMillions: 130 },
      { label: 'Pengujian penetrasi menyeluruh', amountMillions: 85 },
    ],
    engineeringMillions: 110,
    durationWeeks: {
      pilot: { min: 6, max: 9 },
      production: { min: 12, max: 18 },
      enterprise: { min: 20, max: 32 },
    },
    stack: ['mTLS', 'Vault', 'eBPF'],
    deliverable: 'Laporan kepatuhan, arsitektur Zero-Trust, dan bukti pengujian',
    priceNotes: [
      'Audit kepatuhan sektor keuangan: Rp 95–150 jt',
      'Implementasi Zero-Trust penuh: Rp 130–250 jt',
    ],
  },
  'erp-manufaktur-fullstack': {
    id: 'erp-manufaktur-fullstack',
    scope: 'ERP manufaktur: modul produksi, gudang, dan keuangan',
    components: [
      { label: 'Modul produksi & penjadwalan', amountMillions: 160 },
      { label: 'Modul gudang & inventaris', amountMillions: 95 },
      { label: 'Modul keuangan & pelaporan', amountMillions: 80 },
      { label: 'Integrasi mesin & migrasi data', amountMillions: 70 },
    ],
    engineeringMillions: 175,
    durationWeeks: {
      pilot: { min: 12, max: 16 },
      production: { min: 20, max: 30 },
      enterprise: { min: 32, max: 52 },
    },
    stack: ['TypeScript', 'React', 'PostgreSQL'],
    deliverable: 'ERP manufaktur multi-modul dengan integrasi lini produksi',
    priceNotes: [
      'ERP manufaktur skala menengah: Rp 350–800 jt',
      'Integrasi mesin (SCADA/Modbus) menambah Rp 70 jt',
    ],
  },
  'high-throughput-telemetry-engine': {
    id: 'high-throughput-telemetry-engine',
    scope: 'Mesin telemetri high-throughput untuk armada dan pelabuhan',
    components: [
      { label: 'Mesin ingest & antrean (Kafka)', amountMillions: 220 },
      { label: 'Penyimpanan time-series skala besar', amountMillions: 140 },
      { label: 'Dasbor operasional 24/7', amountMillions: 110 },
      { label: 'Integrasi armada & NOC', amountMillions: 85 },
    ],
    engineeringMillions: 240,
    durationWeeks: {
      pilot: { min: 14, max: 20 },
      production: { min: 24, max: 38 },
      enterprise: { min: 40, max: 64 },
    },
    stack: ['Go', 'Kafka', 'TimescaleDB'],
    deliverable: 'Mesin telemetri high-throughput dengan NOC dan dasbor operasional',
    priceNotes: [
      'Infrastruktur Kafka enterprise: Rp 220–400 jt',
      'Penyimpanan time-series + retensi panjang: Rp 140 jt',
    ],
  },
};

const KNOWN_DISCIPLINES = new Set<DisciplineId>(Object.keys(DISCIPLINE_PRICING) as DisciplineId[]);

/** Memformat jutaan rupiah menjadi kata yang mudah dibaca. */
export function formatMillionsToWords(millions: number): string {
  if (millions >= 1000) {
    const billions = millions / 1000;
    const rounded = billions >= 10 ? Math.round(billions) : Math.round(billions * 10) / 10;
    return `Rp ${rounded.toLocaleString('id-ID')} Miliar`;
  }
  return `Rp ${Math.round(millions).toLocaleString('id-ID')} Juta`;
}

export function formatIdrRange(minMillions: number, maxMillions: number): string {
  return `${formatMillionsToWords(minMillions)} – ${formatMillionsToWords(maxMillions)}`;
}

export function calculateProjectEstimate(input: EstimatorInput): EstimateResult {
  const uniqueDisciplines = Array.from(
    new Set(input.disciplines.filter((id) => KNOWN_DISCIPLINES.has(id)))
  );

  const empty: EstimateResult = {
    isValid: false,
    disciplines: [],
    weeksMin: 0,
    weeksMax: 0,
    budgetMinMillions: 0,
    budgetMaxMillions: 0,
    breakdown: [],
    teamSummary: 'Pilih minimal satu disiplin rekayasa untuk melihat estimasi.',
    recommendedStack: [],
    deliverables: [],
    formattedBudget: '—',
    formattedBudgetLong: '—',
  };

  if (uniqueDisciplines.length === 0) return empty;

  const scaleConfig = SCALE_MULTIPLIER[input.scale];
  const urgencyCostFactor = input.urgency === 'accelerated' ? 1.22 : 1.0;
  const urgencyTimeFactor = input.urgency === 'accelerated' ? 0.72 : 1.0;

  // Pilar yang digarap berdampingan berbagi sebagian aktivitas (perencanaan,
  // integrasi, QA), jadi total durasi dan biaya tidak dijumlah mentah.
  const synergyFactor = uniqueDisciplines.length > 1 ? 0.82 : 1.0;

  let weeksMin = 0;
  let weeksMax = 0;
  let totalComponents = 0;
  let totalEngineering = 0;
  const stackSet = new Set<string>();
  const deliverables: string[] = [];
  const breakdown: EstimateResult['breakdown'] = [];

  for (const id of uniqueDisciplines) {
    const spec = DISCIPLINE_PRICING[id];
    const dur = spec.durationWeeks[input.scale];
    weeksMin += Math.round(dur.min * DURATION_FACTOR[input.scale] * urgencyTimeFactor);
    weeksMax += Math.round(dur.max * DURATION_FACTOR[input.scale] * urgencyTimeFactor);

    const componentSum = spec.components.reduce((sum, c) => sum + c.amountMillions, 0);
    totalComponents += componentSum;
    totalEngineering += spec.engineeringMillions;

    spec.stack.forEach((tech) => stackSet.add(tech));
    deliverables.push(spec.deliverable);

    breakdown.push({
      pillar: id,
      scope: spec.scope,
      components: spec.components,
      engineeringMillions: spec.engineeringMillions,
      subtotalMillions: componentSum + spec.engineeringMillions,
    });
  }

  weeksMin = Math.max(2, Math.round(weeksMin * synergyFactor));
  weeksMax = Math.max(weeksMin + 2, Math.round(weeksMax * synergyFactor));

  // Komponen dibulatkan ke skala proyek; personel diskalakan penuh.
  const rawCost =
    (totalComponents * scaleConfig.cost + totalEngineering * scaleConfig.cost) *
    synergyFactor *
    urgencyCostFactor;

  const budgetMinMillions = Math.round(rawCost * 0.92);
  const budgetMaxMillions = Math.round(rawCost * 1.28);

  return {
    isValid: true,
    disciplines: uniqueDisciplines,
    weeksMin,
    weeksMax,
    budgetMinMillions,
    budgetMaxMillions,
    breakdown,
    teamSummary: scaleConfig.team,
    recommendedStack: Array.from(stackSet),
    deliverables,
    formattedBudget: formatIdrRange(budgetMinMillions, budgetMaxMillions),
    formattedBudgetLong: formatIdrRange(budgetMinMillions, budgetMaxMillions),
  };
}

export function filterItemsByDiscipline<T extends { discipline: DisciplineId }>(
  items: T[],
  filter: 'all' | DisciplineId
): T[] {
  if (filter === 'all') {
    return items;
  }
  return items.filter((item) => item.discipline === filter);
}

export function validateConsultationForm(input: ConsultationFormInput): FormValidationResult {
  const errors: Partial<Record<keyof ConsultationFormInput, string>> = {};

  const trimmedName = input.name.trim();
  if (trimmedName.length < 2) {
    errors.name = 'Masukkan nama lengkap Anda (minimal 2 karakter).';
  }

  const trimmedContact = input.contact.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact);
  const digitsOnly = trimmedContact.replace(/[\s\-+()]/g, '');
  const isPhone = /^(\+?62|0)?8\d{7,12}$/.test(digitsOnly) || /^\d{9,15}$/.test(digitsOnly);

  if (!trimmedContact) {
    errors.contact = 'Nomor WhatsApp atau alamat email wajib diisi.';
  } else if (!isEmail && !isPhone) {
    errors.contact = 'Gunakan format nomor telepon Indonesia yang valid (mis. 0812...) atau email.';
  }

  const trimmedMessage = input.message.trim();
  if (trimmedMessage.length < 15) {
    errors.message = 'Jelaskan kebutuhan sistem atau target proyek Anda (minimal 15 karakter).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
