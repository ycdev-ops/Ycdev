export type DisciplineId = 'iot' | 'fullstack' | 'cybersecurity' | 'software';

export type DomainFilter = 'all' | DisciplineId;

export interface ServicePillar {
  id: DisciplineId;
  indexLabel: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  stackLabel: string;
  spanClass: string;
}

export interface CaseStudy {
  id: string;
  discipline: DisciplineId;
  disciplineLabel: string;
  year: string;
  clientSector: string;
  title: string;
  summary: string;
  impactMetric: string;
  impactContext: string;
  imageUrl?: string;
  imageAlt?: string;
  architectureNotes: string[];
  stack: string[];
}

export const STUDIO_PROFILE = {
  brandName: 'YcDev',
  logoImage: '/assets/aistudio/SmartSelect_20261115_111928_Gallery_7ef9e0a2.png',
  founder: 'Yuan Nugroho',
  founderRole: 'Pendiri & Principal Systems Architect',
  founderImage: '/assets/aistudio/SmartSelect_20261113_232137_Gallery_dcfd98c6.jpg',
  portCommandImage: '/assets/aistudio/SmartSelect_20251119_230032_Chrome_16ba29f7.jpg',
  serverLabImage: '/assets/aistudio/SmartSelect_20251112_004611_Google_ce183bb5.jpg',
  addressLine: 'Jalan Puri Eksekutif A1, Semarang Barat',
  cityRegion: 'Tawangsari, Kota Semarang, Jawa Tengah 50144',
  latitude: -6.9653,
  longitude: 110.3864,
  coordinatesDisplay: '-6.9653° LS, 110.3864° BT',
  plusCode: '29PM+7W7',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-6.9653,110.3864',
  phoneDisplay: '081238668332',
  phoneHref: 'tel:+6281238668332',
  whatsappHref:
    'https://wa.me/6281238668332?text=Halo%20YcDev%20(Yuan%20Nugroho)%2C%20saya%20ingin%20berkonsultasi%20mengenai%20solusi%20IoT%20%2F%20Software%20%2F%20Cybersecurity.',
  whatsappBaseHref: 'https://wa.me/6281238668332',
  email: 'halo@ycdev.id',
  operatingHours: 'Senin – Jumat, 09.00 – 18.00 WIB',
} as const;

export const HERO_METRICS = [
  {
    value: '99.98%',
    label: 'Ketersediaan Sistem Produksi',
    context: 'Pemantauan 24/7 lintas klaster',
  },
  {
    value: '42+',
    label: 'Sistem & Node Terpasang',
    context: 'Manufaktur, logistik, dan SaaS',
  },
  {
    value: '< 18 ms',
    label: 'Latensi Edge Gateway IoT',
    context: 'Protokol MQTT & gRPC lokal',
  },
  {
    value: '0',
    label: 'Insiden Kritis Pasca-Audit',
    context: 'Setelah pengerasan arsitektur',
  },
] as const;

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: 'iot',
    indexLabel: '01.',
    title: 'Internet of Things & Edge Telemetry',
    subtitle: 'Firmware · Edge Gateway · Sensor Industri',
    description:
      'Perancangan sistem tertanam dan jaringan sensor nirkabel dari level PCB hingga dasbor telemetri waktu nyata untuk pabrik, gudang dingin, dan gedung pintar.',
    deliverables: [
      'Firmware C/C++ & Rust untuk ESP32, STM32, dan Linux Edge',
      'Protokol MQTT, LoRaWAN, Modbus RTU/TCP dengan buffering luring',
      'Pembaruan firmware OTA terenkripsi dan manajemen armada perangkat',
    ],
    stackLabel: 'ESP-IDF · Rust Embedded · Mosquitto · TimescaleDB',
    spanClass: 'lg:col-span-2',
  },
  {
    id: 'cybersecurity',
    indexLabel: '02.',
    title: 'Cybersecurity & Audit Sistem',
    subtitle: 'Penetration Testing · Zero-Trust · Hardening',
    description:
      'Pengujian penetrasi menyeluruh pada aplikasi web, API, jaringan lokal, serta perangkat IoT untuk menutup celah eksploitasi sebelum sistem mengudara.',
    deliverables: [
      'Uji penetrasi OWASP Top 10 & API Security Assessment',
      'Segmentasi jaringan Zero-Trust dan enkripsi mTLS antar-node',
      'Laporan remediasi teknis terukur serta verifikasi ulang',
    ],
    stackLabel: 'OWASP · WireGuard · HashiCorp Vault · eBPF',
    spanClass: 'lg:col-span-1',
  },
  {
    id: 'fullstack',
    indexLabel: '03.',
    title: 'Full-Stack Web & Platform SaaS',
    subtitle: 'Arsitektur Web · API · Aplikasi Operasional',
    description:
      'Pengembangan aplikasi web berkecepatan tinggi dengan antarmuka terstruktur, integrasi pembayaran dan ERP, serta basis data relasional yang siap tumbuh.',
    deliverables: [
      'Antarmuka React/TypeScript responsif dengan aksesibilitas teruji',
      'Layanan backend Node.js, Go, atau Python dengan dokumentasi OpenAPI',
      'Pipeline CI/CD otomatis, observabilitas metrik, dan cadangan teruji',
    ],
    stackLabel: 'TypeScript · React · Node.js · PostgreSQL',
    spanClass: 'lg:col-span-1',
  },
  {
    id: 'software',
    indexLabel: '04.',
    title: 'Software Engineering & Arsitektur Kritis',
    subtitle: 'Sistem Terdistribusi · Integrasi Legacy · Skalabilitas',
    description:
      'Rekayasa perangkat lunak khusus untuk kebutuhan bisnis kompleks: migrasi sistem lama, pemrosesan transaksi paralel, dan otomasi alur kerja lintas divisi.',
    deliverables: [
      'Audit arsitektur dan pemecahan bottleneck kueri maupun antrean pesan',
      'Desain sistem terdistribusi berbasis event dengan konsistensi terjamin',
      'Standarisasi pengujian otomatis unit, integrasi, dan beban',
    ],
    stackLabel: 'Go · Kafka · Redis · Kubernetes · Docker',
    spanClass: 'lg:col-span-2',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cold-chain-semarang',
    discipline: 'iot',
    disciplineLabel: 'Internet of Things',
    year: '2026',
    clientSector: 'Logistik Rantai Dingin · Jawa Tengah',
    title: 'Jaringan Telemetri Gudang Pendingin & Armada Otomatis',
    summary:
      'Membangun 140 node sensor suhu-kelembapan berbasis LoRaWAN dan edge gateway lokal yang menyinkronkan data ke pusat kendali bahkan saat koneksi seluler terputus.',
    impactMetric: '-64% Kerugian Kerusakan Muatan dalam 6 Bulan',
    impactContext: 'Peringatan dini anomali kompresor turun dari 45 menit menjadi 14 detik.',
    imageUrl: '/src/assets/images/case_iot_telemetry_1795193678902.jpg',
    imageAlt: 'Unit edge gateway IoT industri terpasang pada panel kontrol fasilitas manufaktur',
    architectureNotes: [
      'Node ESP32 + sensor industri terkalibrasi dengan enkripsi AES-128 per paket.',
      'Edge gateway berbasis ARM Linux menyimpan buffer SQLite lokal hingga 14 hari.',
      'Dasbor web waktu nyata menampilkan peta termal gudang dan riwayat audit BPOM.',
    ],
    stack: ['ESP-IDF', 'LoRaWAN', 'MQTT TLS', 'TimescaleDB', 'React'],
  },
  {
    id: 'fintech-zero-trust-audit',
    discipline: 'cybersecurity',
    disciplineLabel: 'Cybersecurity',
    year: '2026',
    clientSector: 'Layanan Keuangan B2B · Jakarta & Semarang',
    title: 'Audit Keamanan API & Implementasi Arsitektur Zero-Trust',
    summary:
      'Mengidentifikasi 11 kerentanan otorisasi tingkat API, merombak manajemen sesi berbasis mTLS, dan menerapkan rotasi kunci kriptografi otomatis tanpa waktu henti.',
    impactMetric: '100% Celah Kritis Tertutup Sebelum Audit OJK',
    impactContext: 'Waktu deteksi percobaan intrusi otomatis dipangkas menjadi di bawah 3 detik.',
    imageUrl: '/src/assets/images/case_cyber_security_1795193678303.jpg',
    imageAlt: 'Koridor pusat data dengan rak server gelap dan pencahayaan arsitektural presisi',
    architectureNotes: [
      'Penetration testing gray-box terhadap 68 endpoint REST dan GraphQL.',
      'Penerapan HashiCorp Vault untuk injeksi kredensial dinamis berumur pendek.',
      'Pembatasan laju permintaan berbasis perilaku untuk mencegah credential stuffing.',
    ],
    stack: ['OWASP ASVS', 'mTLS', 'HashiCorp Vault', 'WireGuard', 'Nginx'],
  },
  {
    id: 'erp-manufaktur-fullstack',
    discipline: 'fullstack',
    disciplineLabel: 'Full-Stack Development',
    year: '2025',
    clientSector: 'Manufaktur Komponen · Kawasan Industri Kendal',
    title: 'Platform Portal Produksi, Inventori & Pelacakan Batch',
    summary:
      'Menggantikan pencatatan spreadsheet terpisah dengan aplikasi web terpadu yang menghubungkan lantai produksi, gudang bahan baku, dan tim akuntansi.',
    impactMetric: '+3.2x Kecepatan Tutup Buku Bulanan',
    impactContext: 'Selisih stok fisik dan catatan sistem berkurang dari 4,8% menjadi 0,2%.',
    architectureNotes: [
      'Antarmuka operator lantai pabrik dioptimalkan untuk tablet layar sentuh dan pemindai barcode.',
      'Transaksi inventori atomik pada PostgreSQL dengan jejak audit tidak dapat diubah.',
      'Integrasi ekspor faktur pajak dan sinkronisasi ERP eksisting secara terjadwal.',
    ],
    stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis'],
  },
  {
    id: 'high-throughput-telemetry-engine',
    discipline: 'software',
    disciplineLabel: 'Software Engineering',
    year: '2025',
    clientSector: 'Energi & Utilitas · Jawa Timur',
    title: 'Mesin Pemroses Data Meteran Pintar Skala Regional',
    summary:
      'Merancang ulang layanan backend monolitik yang sering macet menjadi pipeline pemrosesan stream berkinerja tinggi untuk 85.000 meteran daya.',
    impactMetric: '48.000 Pesan/Detik pada Beban Puncak',
    impactContext: 'Biaya infrastruktur cloud bulanan turun 38% berkat efisiensi memori layanan Go.',
    architectureNotes: [
      'Migrasi layanan ingest dari runtime interpretatif ke worker pool Go yang terisolasi.',
      'Partisi data deret waktu otomatis dan agregasi interval 15 menit secara asinkron.',
      'Pengujian beban sintetis terotomasi sebelum setiap rilis produksi.',
    ],
    stack: ['Go', 'Apache Kafka', 'ClickHouse', 'Docker', 'Prometheus'],
  },
];
