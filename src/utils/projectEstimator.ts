import type { DisciplineId } from '../data/ycdevData';

export type ProjectScale = 'mvp' | 'production' | 'enterprise';
export type TimelineUrgency = 'standard' | 'accelerated';

export interface EstimatorInput {
  disciplines: DisciplineId[];
  scale: ProjectScale;
  urgency: TimelineUrgency;
}

export interface EstimateResult {
  isValid: boolean;
  disciplines: DisciplineId[];
  weeksMin: number;
  weeksMax: number;
  budgetMinMillions: number;
  budgetMaxMillions: number;
  teamSummary: string;
  recommendedStack: string[];
  deliverables: string[];
  formattedBudget: string;
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

const DISCIPLINE_BASE: Record<
  DisciplineId,
  {
    weeks: number;
    costMillions: number;
    stack: string[];
    deliverable: string;
  }
> = {
  iot: {
    weeks: 4,
    costMillions: 28,
    stack: ['ESP-IDF / Rust', 'MQTT TLS', 'TimescaleDB'],
    deliverable: 'Prototipe hardware/gateway, firmware OTA, dan dasbor telemetri',
  },
  fullstack: {
    weeks: 4,
    costMillions: 24,
    stack: ['TypeScript', 'React', 'PostgreSQL'],
    deliverable: 'Aplikasi web responsif, REST/GraphQL API, dan pipeline deployment',
  },
  cybersecurity: {
    weeks: 2,
    costMillions: 18,
    stack: ['OWASP ASVS', 'mTLS', 'Vault'],
    deliverable: 'Audit kerentanan, penetration test, dan dokumen remediasi teknis',
  },
  software: {
    weeks: 5,
    costMillions: 32,
    stack: ['Go / Node.js', 'Redis / Kafka', 'Docker'],
    deliverable: 'Arsitektur sistem terdistribusi, modul inti, dan suite uji otomatis',
  },
};

const SCALE_MULTIPLIER: Record<ProjectScale, { cost: number; time: number; team: string }> = {
  mvp: {
    cost: 1.0,
    time: 1.0,
    team: '1 Principal Architect + 1 Engineer Spesialis',
  },
  production: {
    cost: 1.75,
    time: 1.4,
    team: '1 Principal Architect + 2 Senior Engineers + QA',
  },
  enterprise: {
    cost: 2.8,
    time: 1.9,
    team: 'Skuad Terdedikasi (Architect, Backend, IoT/Sec, DevOps)',
  },
};

export function formatIdrRange(minMillions: number, maxMillions: number): string {
  const formatVal = (m: number) => `Rp ${Math.round(m)} Juta`;
  return `${formatVal(minMillions)} – ${formatVal(maxMillions)}`;
}

export function calculateProjectEstimate(input: EstimatorInput): EstimateResult {
  const uniqueDisciplines = Array.from(new Set(input.disciplines));

  if (uniqueDisciplines.length === 0) {
    return {
      isValid: false,
      disciplines: [],
      weeksMin: 0,
      weeksMax: 0,
      budgetMinMillions: 0,
      budgetMaxMillions: 0,
      teamSummary: 'Pilih minimal satu disiplin rekayasa untuk melihat estimasi.',
      recommendedStack: [],
      deliverables: [],
      formattedBudget: '—',
    };
  }

  let baseWeeks = 0;
  let baseCost = 0;
  const stackSet = new Set<string>();
  const deliverables: string[] = [];

  for (const id of uniqueDisciplines) {
    const spec = DISCIPLINE_BASE[id];
    baseWeeks += spec.weeks;
    baseCost += spec.costMillions;
    spec.stack.forEach((tech) => stackSet.add(tech));
    deliverables.push(spec.deliverable);
  }

  // Parallel execution synergy when combining multiple disciplines
  const synergyFactor = uniqueDisciplines.length > 1 ? 0.85 : 1.0;
  const scaleConfig = SCALE_MULTIPLIER[input.scale];
  const urgencyCostFactor = input.urgency === 'accelerated' ? 1.2 : 1.0;
  const urgencyTimeFactor = input.urgency === 'accelerated' ? 0.75 : 1.0;

  const rawWeeks = baseWeeks * synergyFactor * scaleConfig.time * urgencyTimeFactor;
  const weeksMin = Math.max(2, Math.floor(rawWeeks));
  const weeksMax = Math.max(weeksMin + 1, Math.ceil(rawWeeks * 1.25));

  const rawCost = baseCost * synergyFactor * scaleConfig.cost * urgencyCostFactor;
  const budgetMinMillions = Math.round(rawCost * 0.9);
  const budgetMaxMillions = Math.round(rawCost * 1.15);

  return {
    isValid: true,
    disciplines: uniqueDisciplines,
    weeksMin,
    weeksMax,
    budgetMinMillions,
    budgetMaxMillions,
    teamSummary: scaleConfig.team,
    recommendedStack: Array.from(stackSet),
    deliverables,
    formattedBudget: formatIdrRange(budgetMinMillions, budgetMaxMillions),
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
