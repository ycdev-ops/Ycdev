export type TeamRegionFilter = 'all' | 'indonesia' | 'international';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: string;
  regionGroup: Exclude<TeamRegionFilter, 'all'>;
  location: string;
  countryCode: string;
  imageUrl: string;
  imageAlt: string;
  bio: string;
  specialties: string[];
  experienceYears: string;
}

export const TEAM_BRIEFING_SHOWCASE = {
  eyebrow: 'Koordinasi Lintas Zona Waktu · Semarang HQ & Hub Global',
  title: 'Sinkronisasi Tim Analis, Optic IoT, Operator Radar & Insinyur Internasional',
  summary:
    'Di bawah arahan langsung Yuan Nugroho, setiap proyek YcDev digerakkan oleh kolaborasi tim lapangan Indonesia bersama insinyur spesialis radar, keamanan siber, dan sistem terdistribusi dari Jepang, Eropa, dan Amerika Serikat.',
  imageUrl: '/assets/aistudio/SmartSelect_20251201_044352_Chrome_75fb0ed7.jpg',
  imageAlt: 'Yuan Nugroho memimpin sesi briefing teknis bersama tim operasi dan rekayasa YcDev',
  highlights: [
    { label: 'Operasional NOC & Lapangan', value: '24/7 Aktif' },
    { label: 'Hub Rekayasa Lintas Negara', value: 'ID · JP · NL · DE · US' },
    { label: 'Standar Pengujian Bersama', value: 'IP67 · mTLS · NMEA' },
  ],
} as const;

export const YCDEV_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'wiena-kartika',
    name: 'Wiena Kartika',
    role: 'Tim Analis',
    division: 'System & Business Requirements Analyst',
    regionGroup: 'indonesia',
    location: 'Semarang Barat, Indonesia',
    countryCode: 'ID',
    imageUrl: '/assets/aistudio/1769705147195_ef5b239a.png',
    imageAlt: 'Wiena Kartika, Tim Analis YcDev di kantor operasional YcDev',
    bio: 'Memimpin pemetaan proses operasional klien korporat dan pelabuhan, menerjemahkan kebutuhan lapangan ke spesifikasi teknis, serta mengawal validasi UAT dan dokumen SLA.',
    specialties: ['Analisis Sistem', 'Spesifikasi Teknis', 'Audit Kepatuhan SLA'],
    experienceYears: '6+ Thn',
  },
  {
    id: 'ceilin-wu',
    name: 'Ceilin Wu',
    role: 'Optic IoT Dev',
    division: 'Optical Sensing & Precision IoT Hardware',
    regionGroup: 'indonesia',
    location: 'Lab Optik & Integrasi IoT',
    countryCode: 'ID / SG',
    imageUrl: '/assets/aistudio/SmartSelect_20260213_024930_Gallery_ec6b3495.jpg',
    imageAlt: 'Ceilin Wu, Optic IoT Dev YcDev mengenakan rompi keselamatan di ruang kendali laboratorium',
    bio: 'Merancang antarmuka sensor optik industri, jalur telemetri serat optik berkecepatan tinggi, serta kalibrasi node lapangan dan perangkat keras ketahanan ekstrem.',
    specialties: ['Sensor Optik IoT', 'Fiber Telemetry', 'Kalibrasi Node IP67'],
    experienceYears: '7+ Thn',
  },
  {
    id: 'hendra-ansteinly',
    name: 'Hendra Ansteinly',
    role: 'Operator Satelit & Radar',
    division: 'Satellite Link & Marine Radar Operations',
    regionGroup: 'indonesia',
    location: 'Pusat Kendali NOC · Laut Jawa',
    countryCode: 'ID',
    imageUrl: '/assets/aistudio/haidir_anto79-20260523-0002_0d3206c2.jpg',
    imageAlt: 'Hendra Ansteinly, Operator Satelit dan Radar YcDev di konsol pemantauan multi-layar',
    bio: 'Mengawasi operasional link satelit LEO Starlink & Iridium L-Band, mirroring radar X-Band/S-Band 24 jam, serta koordinasi respons cepat bersama kru anjungan kapal.',
    specialties: ['Radar X/S-Band', 'Satcom Failover', 'Operasi NOC 24/7'],
    experienceYears: '8+ Thn',
  },
  {
    id: 'kenji-takahashi',
    name: 'Kenji Takahashi',
    role: 'Principal Maritime Radar & DSP Engineer',
    division: 'Marine Signal Processing · International Hub',
    regionGroup: 'international',
    location: 'Tokyo, Jepang',
    countryCode: 'JP',
    imageUrl: '/src/assets/images/team_kenji_takahashi_1795201357749.jpg',
    imageAlt: 'Kenji Takahashi, Principal Maritime Radar dan DSP Engineer YcDev di laboratorium Tokyo',
    bio: 'Mengembangkan algoritma kompresi sapuan radar X-Band/ARPA ber-bitrate rendah dan isolasi antarmuka NMEA 2000 untuk armada kargo curah lintas Pasifik.',
    specialties: ['DSP Radar ARPA', 'Kompresi Satelit', 'NMEA 2000 Bus'],
    experienceYears: '10+ Thn',
  },
  {
    id: 'lukas-lindqvist',
    name: 'Lukas Lindqvist',
    role: 'Zero-Trust Cybersecurity & mTLS Architect',
    division: 'Critical Infrastructure Security · International Hub',
    regionGroup: 'international',
    location: 'Rotterdam, Belanda',
    countryCode: 'NL',
    imageUrl: '/src/assets/images/team_lukas_lindqvist_1795201358799.jpg',
    imageAlt: 'Lukas Lindqvist, Zero-Trust Cybersecurity Architect YcDev di koridor pusat data Rotterdam',
    bio: 'Merancang arsitektur pertahanan Zero-Trust, manajemen rotasi sertifikat mTLS perangkat keras, serta audit penetrasi OWASP untuk infrastruktur pelabuhan Eropa dan RI.',
    specialties: ['Zero-Trust mTLS', 'Audit OWASP ASVS', 'Pengerasan Kernel'],
    experienceYears: '11+ Thn',
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Distributed Cloud & High-Throughput Engineer',
    division: 'Cloud Telemetry Pipelines · International Hub',
    regionGroup: 'international',
    location: 'Berlin, Jerman',
    countryCode: 'DE',
    imageUrl: '/src/assets/images/team_elena_rostova_1795201358419.jpg',
    imageAlt: 'Elena Rostova, Distributed Cloud Systems Engineer YcDev di studio rekayasa Berlin',
    bio: 'Membangun mesin ingesti data Rust & Go berkapasitas di atas 50.000 pesan per detik, replikasi klaster TimescaleDB, dan dasbor ENC berlatensi rendah.',
    specialties: ['Rust & Go Pipeline', 'TimescaleDB Klaster', 'High Availability'],
    experienceYears: '9+ Thn',
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'CAN-Bus & Autonomous Edge AI Engineer',
    division: 'Energy Telemetry & Edge Intelligence · International Hub',
    regionGroup: 'international',
    location: 'San Francisco, Amerika Serikat',
    countryCode: 'US',
    imageUrl: '/src/assets/images/team_marcus_vance_1795201358952.jpg',
    imageAlt: 'Marcus Vance, CAN-Bus dan Autonomous Edge AI Engineer YcDev di bengkel uji perangkat keras',
    bio: 'Mengembangkan firmware pembacaan bus daya CAN-Bus berkecepatan tinggi untuk ekosistem penyimpanan baterai industri, diagnostik EV, dan drone LiDAR pelabuhan.',
    specialties: ['CAN-Bus 1 Mbps', 'Edge AI Vision', 'OTA Firmware Rust'],
    experienceYears: '9+ Thn',
  },
];

export function filterTeamMembers(
  members: TeamMember[],
  filter: TeamRegionFilter
): TeamMember[] {
  if (filter === 'all') return members;
  return members.filter((member) => member.regionGroup === filter);
}

export function formatTeamConsultationScope(member: TeamMember): string {
  return `Konsultasi Teknis bersama ${member.name} (${member.role} · ${member.location}) terkait keahlian: ${member.specialties.join(', ')}.`;
}
