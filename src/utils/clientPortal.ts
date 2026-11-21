export type ProjectPhaseStatus = 'On Track' | 'UAT / Verifikasi' | 'Pemeliharaan Aktif';

export type MilestoneStatus = 'completed' | 'in_progress' | 'scheduled';

export type MilestoneFilter = 'all' | MilestoneStatus;

export type DocumentCategory = 'all' | 'architecture' | 'security' | 'manual';

export interface ProjectMilestone {
  id: string;
  phaseLabel: string;
  title: string;
  summary: string;
  status: MilestoneStatus;
  targetDate: string;
  leadEngineer: string;
  deliverableTag: string;
  /**
   * Nomor akta/berita acara resmi. Dipakai pada tampilan "resmi" milestone
   * (kop akta + segel). Bila kosong, nomor akta dibuat dari kode proyek.
   */
  deedNumber?: string;
  /**
   * Kota penandatanganan akta — memperkuat kesan dokumen resmi.
   */
  signedAt?: string;
}

export interface ProjectDocument {
  id: string;
  code: string;
  title: string;
  category: Exclude<DocumentCategory, 'all'>;
  categoryLabel: string;
  format: 'MD' | 'TXT' | 'JSON' | 'CSV';
  version: string;
  updatedAt: string;
  sizeLabel: string;
  sha256Short: string;
  contentBody: string;
  /**
   * Nomor registrasi dokumen di brankas (mis. "REG/PLD/04/2026").
   * Menjaga brankas terasa seperti registri resmi, bukan tabel berkas biasa.
   */
  registryNumber: string;
  /**
   * Klasifikasi akses dokumen. Menjaga komitmen "brankas" — ada dokumen
   * yang hanya dapat diunduh oleh pemegang kredensial.
   */
  access: 'publik' | 'terbatas';
  /**
   * Penandatangan dokumen ( nama & jabatan ), untuk kop resmi.
   */
  signatory?: string;
}

export interface ClientPortalProject {
  id: string;
  projectCode: string;
  clientName: string;
  clientSector: string;
  projectTitle: string;
  environmentUrl: string;
  status: ProjectPhaseStatus;
  progressPct: number;
  currentPhase: string;
  targetHandover: string;
  lastUpdated: string;
  slaTier: string;
  accountLead: string;
  recentUpdateNote: string;
  milestones: ProjectMilestone[];
  documents: ProjectDocument[];
}

export const CLIENT_PORTAL_PROJECTS: ClientPortalProject[] = [
  {
    id: 'pelindo-terminal',
    projectCode: 'YCD-PLD-2026-01',
    clientName: 'PT Pelabuhan Indonesia (Pelindo)',
    clientSector: 'BUMN Kepelabuhanan · Klaster Jawa Tengah',
    projectTitle: 'Integrasi Telemetri Crane, Radar Pelabuhan & Fleet Command ENC',
    environmentUrl: 'portal-noc.pelindo-cluster.ycdev.id',
    status: 'UAT / Verifikasi',
    progressPct: 86,
    currentPhase: 'Fase 4 · Uji Beban Radar Mirroring & Serah Terima NOC',
    targetHandover: '15 Des 2026',
    lastUpdated: '20 Nov 2026 · 16:40 WIB',
    slaTier: '99.98% NOC 24/7',
    accountLead: 'Yuan Nugroho',
    recentUpdateNote:
      'Sinkronisasi stream radar X-Band Tanjung Emas dan CCTV RTG crane terverifikasi di ruang kendali dengan latensi rata-rata 14 ms.',
    milestones: [
      {
        id: 'pld-m1',
        phaseLabel: 'Tahap 01',
        title: 'Survei Lapangan & Pemetaan Bus Sensor Crane Terminal',
        summary:
          'Audit instalasi kabel maritim tahan korosi garam, pemetaan titik PLC gantry crane, dan verifikasi daya cadangan 24 VDC.',
        status: 'completed',
        targetDate: '12 Sep 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Laporan Survei & Topologi VLAN',
        deedNumber: 'AKTA-01/PLD/IX/2026',
        signedAt: 'Semarang Barat, 12 September 2026',
      },
      {
        id: 'pld-m2',
        phaseLabel: 'Tahap 02',
        title: 'Pemasangan 14 Unit Marine IoT Gateway IP67 & Ekstraktor Radar',
        summary:
          'Instalasi unit Edge Box di kapal pandu dan stasiun dermaga dengan isolasi galvanik 2.5 kV serta enkripsi TLS 1.3.',
        status: 'completed',
        targetDate: '18 Okt 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Berita Acara Komisioning HW',
        deedNumber: 'AKTA-02/PLD/X/2026',
        signedAt: 'Perairan Tanjung Emas, 18 Oktober 2026',
      },
      {
        id: 'pld-m3',
        phaseLabel: 'Tahap 03',
        title: 'Pengembangan Dasbor Peta Laut ENC & Mirroring Radar Jarak Jauh',
        summary:
          'Pengujian stream target ARPA multi-kapal bersamaan dengan telemetri posisi crane dan status tambat dermaga.',
        status: 'in_progress',
        targetDate: '28 Nov 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Rilis Staging ENC v2.4',
        deedNumber: 'AKTA-03/PLD/XI/2026',
        signedAt: 'Semarang Barat, 28 November 2026',
      },
      {
        id: 'pld-m4',
        phaseLabel: 'Tahap 04',
        title: 'Uji Penetrasi Zero-Trust & Serah Terima Operasional NOC 24/7',
        summary:
          'Audit keamanan OWASP ASVS Level 2 bersama tim TI Pelindo sebelum aktivasi penuh ke produksi.',
        status: 'scheduled',
        targetDate: '15 Des 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Sertifikat UAT & Runbook SLA',
        deedNumber: 'AKTA-04/PLD/XII/2026',
        signedAt: 'Semarang Barat, 15 Desember 2026',
      },
    ],
    documents: [
      {
        id: 'pld-doc-1',
        code: 'DOC-PLD-ARCH-04',
        title: 'Spesifikasi Arsitektur Telemetri Pelabuhan & Radar X-Band',
        category: 'architecture',
        categoryLabel: 'Arsitektur & API',
        format: 'MD',
        version: 'v2.4',
        updatedAt: '18 Nov 2026',
        sizeLabel: '184 KB',
        sha256Short: '9f4a21c8...e01b',
        registryNumber: 'REG/PLD/ARCH/04/2026',
        access: 'publik',
        signatory: 'Yuan Nugroho · Principal Systems Architect',
        contentBody: `# Spesifikasi Arsitektur Telemetri Pelabuhan & Radar X-Band
Kode Proyek : YCD-PLD-2026-01
Klien      : PT Pelabuhan Indonesia (Pelindo)
Arsitek    : Yuan Nugroho (YcDev · Jalan Puri Eksekutif A1, Semarang Barat)

## 1. Topologi Jaringan On-Board & Dermaga
- Akuisisi NMEA 0183/2000 melalui 14x YcDev Marine IoT Gateway (IP67)
- Ekstraksi frame radar X-Band (9 GHz) terkompresi 18 Kbps adaptif via mTLS
- Segmentasi VLAN terpisah antara jaringan PLC crane dan stream video CCTV

## 2. Target Kinerja Terukur
- Latensi ujung-ke-ujung (edge ke layar NOC): <= 18 ms
- Penyimpanan buffer luring otomatis: 64 GB SLC Ring Buffer
`,
      },
      {
        id: 'pld-doc-2',
        code: 'DOC-PLD-SEC-02',
        title: 'Laporan Pra-Audit Keamanan Zero-Trust & Rotasi Kunci mTLS',
        category: 'security',
        categoryLabel: 'Keamanan & Audit',
        format: 'TXT',
        version: 'v1.9',
        updatedAt: '15 Nov 2026',
        sizeLabel: '96 KB',
        sha256Short: '4c81e0b2...77a9',
        registryNumber: 'REG/PLD/SEC/02/2026',
        access: 'terbatas',
        signatory: 'Yuan Nugroho · Principal Systems Architect',
        contentBody: `YCDEV SECURITY PRE-AUDIT SUMMARY
Proyek : YCD-PLD-2026-01 (Pelindo Terminal Cluster)
Status : 0 Kerentanan Kritis · Lolos Pengujian Penetrasi Internal

Ringkasan Kontrol:
1. Otentikasi sertifikat X.509 dua arah (mTLS) untuk seluruh node edge.
2. Pembatasan laju permintaan berbasis eBPF pada gateway MQTT & WebRTC.
3. Log audit tak-terubah (append-only) tersimpan minimal 365 hari.
`,
      },
      {
        id: 'pld-doc-3',
        code: 'DOC-PLD-MAN-01',
        title: 'Panduan Operator Pusat Kendali & Prosedur Failover Satelit',
        category: 'manual',
        categoryLabel: 'Manual & Sertifikat',
        format: 'MD',
        version: 'v1.3',
        updatedAt: '10 Nov 2026',
        sizeLabel: '142 KB',
        sha256Short: '7a3d90f4...12c5',
        registryNumber: 'REG/PLD/MAN/01/2026',
        access: 'publik',
        signatory: 'Yuan Nugroho · Principal Systems Architect',
        contentBody: `# Panduan Operator Pusat Kendali (NOC) Pelindo
1. Pemantauan lapisan kapal pandu pada peta ENC S-57/S-63.
2. Aktivasi layar mirroring radar X-Band saat jarak pandang < 1 mil laut.
3. Eskalasi darurat NOC 24/7 YcDev: 081238668332 (Semarang Barat).
`,
      },
    ],
  },
  {
    id: 'pemerintah-vms',
    projectCode: 'YCD-GOV-2026-04',
    clientName: 'Kementerian & Pengawasan VMS RI',
    clientSector: 'Instansi Pemerintah · Regulasi Maritim',
    projectTitle: 'Gerbang Pelaporan Otomatis VMS KKP & Audit Keamanan Portal',
    environmentUrl: 'vms-bridge.maritim-ri.ycdev.id',
    status: 'On Track',
    progressPct: 72,
    currentPhase: 'Fase 3 · Pengujian Kepatuhan Payload & Sinkronisasi mTLS',
    targetHandover: '22 Des 2026',
    lastUpdated: '19 Nov 2026 · 14:15 WIB',
    slaTier: '99.99% Kepatuhan Regulasi',
    accountLead: 'Yuan Nugroho',
    recentUpdateNote:
      'Skema JSON & biner VMS KKP untuk 120 kapal uji lolos validasi tanda tangan kriptografi tanpa packet drop.',
    milestones: [
      {
        id: 'gov-m1',
        phaseLabel: 'Tahap 01',
        title: 'Pemetaan Standar Payload VMS & Kriptografi Tanda Tangan Data',
        summary:
          'Penyelarasan format telemetri posisi, heading, dan timestamp UTC sesuai spesifikasi server pengawasan nasional.',
        status: 'completed',
        targetDate: '04 Okt 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Dokumen Skema API VMS',
        deedNumber: 'AKTA-01/GOV/X/2026',
        signedAt: 'Semarang Barat, 4 Oktober 2026',
      },
      {
        id: 'gov-m2',
        phaseLabel: 'Tahap 02',
        title: 'Implementasi Jembatan API mTLS & Antrean Pengiriman Ulang Otomatis',
        summary:
          'Mekanisme retry eksponensial memastikan data posisi kapal di zona laut lepas tidak hilang saat sinyal satelit pulih.',
        status: 'completed',
        targetDate: '01 Nov 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Service Bridge Go + PostgreSQL',
        deedNumber: 'AKTA-02/GOV/XI/2026',
        signedAt: 'Semarang Barat, 1 November 2026',
      },
      {
        id: 'gov-m3',
        phaseLabel: 'Tahap 03',
        title: 'Verifikasi Skala 500 Kapal Serentak & Pengerasan OWASP ASVS',
        summary:
          'Pengujian lonjakan trafik akhir pekan dan pemeriksaan integritas jejak audit per unit perangkat.',
        status: 'in_progress',
        targetDate: '05 Des 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Laporan Beban & Audit Log',
        deedNumber: 'AKTA-03/GOV/XII/2026',
        signedAt: 'Semarang Barat, 5 Desember 2026',
      },
      {
        id: 'gov-m4',
        phaseLabel: 'Tahap 04',
        title: 'Penyerahan Sertifikat Kepatuhan & Pelatihan Tim TI Instansi',
        summary:
          'Sesi serah terima kredensial produksi, dokumentasi API, dan prosedur tanggap insiden 24/7.',
        status: 'scheduled',
        targetDate: '22 Des 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Paket Dokumentasi Produksi',
        deedNumber: 'AKTA-04/GOV/XII/2026',
        signedAt: 'Semarang Barat, 22 Desember 2026',
      },
    ],
    documents: [
      {
        id: 'gov-doc-1',
        code: 'DOC-GOV-API-03',
        title: 'Kontrak Skema API VMS KKP & Spesifikasi Enkripsi Payload',
        category: 'architecture',
        categoryLabel: 'Arsitektur & API',
        format: 'JSON',
        version: 'v3.1',
        updatedAt: '19 Nov 2026',
        sizeLabel: '64 KB',
        sha256Short: '2e9b11a0...90f1',
        registryNumber: 'REG/GOV/API/03/2026',
        access: 'publik',
        signatory: 'Yuan Nugroho · Principal Systems Architect',
        contentBody: `{
  "projectCode": "YCD-GOV-2026-04",
  "protocol": "HTTPS/mTLS 1.3 + Ed25519 Signature",
  "endpoint": "/api/v1/vms/telemetry-batch",
  "heartbeatIntervalSec": 300,
  "offlineRetentionDays": 90,
  "complianceStatus": "VERIFIED_STAGING"
}`,
      },
      {
        id: 'gov-doc-2',
        code: 'DOC-GOV-SEC-01',
        title: 'Matriks Kepatuhan OWASP ASVS & Segmentasi Portal Publik',
        category: 'security',
        categoryLabel: 'Keamanan & Audit',
        format: 'TXT',
        version: 'v2.0',
        updatedAt: '12 Nov 2026',
        sizeLabel: '118 KB',
        sha256Short: '8d12c4e7...33b4',
        registryNumber: 'REG/GOV/SEC/01/2026',
        access: 'terbatas',
        signatory: 'Yuan Nugroho · Principal Systems Architect',
        contentBody: `MATRIKS KEPATUHAN OWASP ASVS LEVEL 2
Proyek : YCD-GOV-2026-04
Temuan Kritis : 0
Temuan Tinggi : 0
Validasi mTLS & Rate Limiter : LULUS`,
      },
    ],
  },
  {
    id: 'tesla-telemetry',
    projectCode: 'YCD-TSL-2026-02',
    clientName: 'Tesla Energy Telemetry Partner',
    clientSector: 'Energi & Otomotif Global · AS & Asia-Pasifik',
    projectTitle: 'Modul Akuisisi CAN-Bus Baterai Industri & Ketahanan API',
    environmentUrl: 'canbus-lab.tesla-partner.ycdev.id',
    status: 'Pemeliharaan Aktif',
    progressPct: 100,
    currentPhase: 'Operasi Produksi · Pemantauan Telemetri & Pembaruan OTA',
    targetHandover: 'Selesai (Live)',
    lastUpdated: '20 Nov 2026 · 09:05 WIB',
    slaTier: '< 12 ms CAN-Bus SLA',
    accountLead: 'Yuan Nugroho',
    recentUpdateNote:
      'Seluruh modul firmware Rust CAN-Bus berjalan di klaster penyimpanan daya dengan integritas paket 99.99% selama 90 hari berturut-turut.',
    milestones: [
      {
        id: 'tsl-m1',
        phaseLabel: 'Tahap 01',
        title: 'Desain Firmware Embedded Rust & Pembacaan Frame CAN-Bus 1 Mbps',
        summary:
          'Implementasi parser nol-alokasi untuk membaca suhu sel, tegangan modul, dan siklus pengisian cepat.',
        status: 'completed',
        targetDate: '10 Jul 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Firmware Rust v1.0-prod',
        deedNumber: 'AKTA-01/TSL/VII/2026',
        signedAt: 'Semarang Barat, 10 Juli 2026',
      },
      {
        id: 'tsl-m2',
        phaseLabel: 'Tahap 02',
        title: 'Pipeline Ingesti gRPC Terdistribusi & Pengujian Stres API',
        summary:
          'Validasi pemrosesan 40.000 pesan telemetri per detik dengan failover node otomatis tanpa kehilangan paket.',
        status: 'completed',
        targetDate: '24 Agu 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Benchmark Report 40k RPS',
        deedNumber: 'AKTA-02/TSL/VIII/2026',
        signedAt: 'Semarang Barat, 24 Agustus 2026',
      },
      {
        id: 'tsl-m3',
        phaseLabel: 'Tahap 03',
        title: 'Audit Kriptografi OTA Update & Penyerahan ke Lingkungan Produksi',
        summary:
          'Verifikasi pembaruan firmware jarak jauh bertanda tangan Ed25519 dan rollback otomatis.',
        status: 'completed',
        targetDate: '18 Sep 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Sertifikat Rilis Produksi',
        deedNumber: 'AKTA-03/TSL/IX/2026',
        signedAt: 'Semarang Barat, 18 September 2026',
      },
    ],
    documents: [
      {
        id: 'tsl-doc-1',
        code: 'DOC-TSL-PERF-09',
        title: 'Laporan Uji Kinerja Akuisisi CAN-Bus & Integritas Paket 90 Hari',
        category: 'architecture',
        categoryLabel: 'Arsitektur & API',
        format: 'CSV',
        version: 'v4.2',
        updatedAt: '20 Nov 2026',
        sizeLabel: '52 KB',
        sha256Short: 'c190a4d2...61f8',
        registryNumber: 'REG/TSL/PERF/09/2026',
        access: 'publik',
        signatory: 'Yuan Nugroho · Principal Systems Architect',
        contentBody: `date,cluster,avg_latency_ms,packet_integrity_pct,ota_status
2026-11-01,APAC-BESS-01,10.8,99.99,VERIFIED
2026-11-10,APAC-BESS-01,11.2,99.99,VERIFIED
2026-11-20,APAC-BESS-01,10.9,100.00,VERIFIED`,
      },
      {
        id: 'tsl-doc-2',
        code: 'DOC-TSL-MAN-05',
        title: 'Prosedur OTA Rollback & Spesifikasi Antarmuka Diagnostik',
        category: 'manual',
        categoryLabel: 'Manual & Sertifikat',
        format: 'MD',
        version: 'v2.1',
        updatedAt: '02 Nov 2026',
        sizeLabel: '108 KB',
        sha256Short: '5b44e8c1...28a0',
        registryNumber: 'REG/TSL/MAN/05/2026',
        access: 'terbatas',
        signatory: 'Yuan Nugroho · Principal Systems Architect',
        contentBody: `# Prosedur OTA Firmware & Diagnostik CAN-Bus
- Setiap paket firmware ditandatangani Ed25519 sebelum didistribusikan.
- Jika watchdog gagal dalam 15 detik pasca-boot, partisi cadangan aktif otomatis.
`,
      },
    ],
  },
  {
    id: 'nippon-marine',
    projectCode: 'YCD-JPN-2026-07',
    clientName: 'Nippon Marine Logistics Co., Ltd.',
    clientSector: 'Pelayaran Internasional · Tokyo & Kobe, Jepang',
    projectTitle: 'Armada Kargo Curah: Gateway IP67, Radar Extractor & Flow BBM',
    environmentUrl: 'fleet-apac.nipponmarine.ycdev.id',
    status: 'On Track',
    progressPct: 64,
    currentPhase: 'Fase 3 · Kalibrasi Sensor BBM & Kompresi Satelit Iridium',
    targetHandover: '10 Jan 2027',
    lastUpdated: '18 Nov 2026 · 19:20 WIB',
    slaTier: '-72% Target Kuota Satelit',
    accountLead: 'Yuan Nugroho',
    recentUpdateNote:
      'Uji pelayaran rute Yokohama–Surabaya membuktikan penghematan kuota satelit 72% dengan sinkronisasi data BBM per 15 menit.',
    milestones: [
      {
        id: 'jpn-m1',
        phaseLabel: 'Tahap 01',
        title: 'Pengiriman & Instalasi 8 Unit Edge Box IP67 di Galangan Kobe',
        summary:
          'Pemasangan modul tahan garam IP67 beserta flow meter ultrasonik pada jalur suplai bahan bakar mesin induk.',
        status: 'completed',
        targetDate: '19 Okt 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Checklist Galangan Kobe',
        deedNumber: 'AKTA-01/JPN/X/2026',
        signedAt: 'Kobe, Jepang, 19 Oktober 2026',
      },
      {
        id: 'jpn-m2',
        phaseLabel: 'Tahap 02',
        title: 'Kalibrasi Algoritma Kompresi Radar X-Band untuk L-Band Iridium',
        summary:
          'Optimalisasi payload biner radar agar tetap terbaca jernih di kantor pusat Tokyo pada bandwidth terbatas.',
        status: 'in_progress',
        targetDate: '08 Des 2026',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Profil Codec Delta v1.8',
        deedNumber: 'AKTA-02/JPN/XII/2026',
        signedAt: 'Semarang Barat, 8 Desember 2026',
      },
      {
        id: 'jpn-m3',
        phaseLabel: 'Tahap 03',
        title: 'Aktivasi Peringatan Anomali BBM WhatsApp & Integrasi ERP Tokyo',
        summary:
          'Penghubungan webhook alarm pengurasan tangki tidak wajar dan pencatatan jam kerja mesin ke sistem ERP.',
        status: 'scheduled',
        targetDate: '10 Jan 2027',
        leadEngineer: 'Yuan Nugroho',
        deliverableTag: 'Konektor REST ERP & SLA',
        deedNumber: 'AKTA-03/JPN/I/2027',
        signedAt: 'Tokyo, Jepang, 10 Januari 2027',
      },
    ],
    documents: [
      {
        id: 'jpn-doc-1',
        code: 'DOC-JPN-SAT-02',
        title: 'Analisis Efisiensi Kuota Satelit Starlink Maritime & Iridium Certus',
        category: 'architecture',
        categoryLabel: 'Arsitektur & API',
        format: 'MD',
        version: 'v1.8',
        updatedAt: '18 Nov 2026',
        sizeLabel: '132 KB',
        sha256Short: '3f77d1b9...55e2',
        registryNumber: 'REG/JPN/SAT/02/2026',
        access: 'publik',
        signatory: 'Yuan Nugroho · Principal Systems Architect',
        contentBody: `# Analisis Efisiensi Kuota Satelit Lintas Pasifik
Klien  : Nippon Marine Logistics Co., Ltd.
Rute   : Yokohama - Kobe - Surabaya

Ringkasan Hasil Uji:
- Kompresi biner telemetri mesin + radar menurunkan pemakaian data dari 1.8 GB/bulan menjadi 504 MB/bulan per kapal (-72%).
`,
      },
      {
        id: 'jpn-doc-2',
        code: 'DOC-JPN-SEC-01',
        title: 'Sertifikat Uji Ketahanan Enklosur IP67 & Isolasi Bus Navigasi',
        category: 'manual',
        categoryLabel: 'Manual & Sertifikat',
        format: 'TXT',
        version: 'v1.2',
        updatedAt: '05 Nov 2026',
        sizeLabel: '74 KB',
        sha256Short: 'a621f9c0...44d3',
        registryNumber: 'REG/JPN/SEC/01/2026',
        access: 'publik',
        signatory: 'Yuan Nugroho · Principal Systems Architect',
        contentBody: `SERTIFIKAT KALIBRASI & PROTEKSI PERANGKAT KERAS
Unit   : YcDev Marine IoT Gateway IP67
Uji    : Semprot Kabut Garam 72 Jam & Isolasi Galvanik 2.5 kV
Status : LULUS STANDAR MARITIM`,
      },
    ],
  },
];

export function filterProjectMilestones(
  milestones: ProjectMilestone[],
  filter: MilestoneFilter
): ProjectMilestone[] {
  if (filter === 'all') return milestones;
  return milestones.filter((item) => item.status === filter);
}

export function filterProjectDocuments(
  documents: ProjectDocument[],
  category: DocumentCategory,
  searchQuery: string
): ProjectDocument[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return documents.filter((doc) => {
    const matchesCategory = category === 'all' || doc.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      doc.title.toLowerCase().includes(normalizedQuery) ||
      doc.code.toLowerCase().includes(normalizedQuery) ||
      doc.categoryLabel.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function countCompletedMilestones(milestones: ProjectMilestone[]): {
  completed: number;
  inProgress: number;
  scheduled: number;
  total: number;
} {
  return milestones.reduce(
    (acc, item) => {
      acc.total += 1;
      if (item.status === 'completed') acc.completed += 1;
      else if (item.status === 'in_progress') acc.inProgress += 1;
      else acc.scheduled += 1;
      return acc;
    },
    { completed: 0, inProgress: 0, scheduled: 0, total: 0 }
  );
}

export function buildDownloadFilename(doc: ProjectDocument): string {
  const safeCode = doc.code.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  return `${safeCode}-${doc.version}.pdf`;
}

export function buildSummaryPdfFilename(projectCode: string): string {
  const safeProject = projectCode.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  return `${safeProject}-laporan-status-ycdev.pdf`;
}

/**
 * Nomor akta yang tampil. Bila milestone belum punya `deedNumber`, dibuat dari
 * kode proyek + nomor urut tahap — supaya setiap akta punya nomor yang rapi.
 */
export function milestoneDeedNumber(
  projectCode: string,
  milestone: ProjectMilestone
): string {
  if (milestone.deedNumber) return milestone.deedNumber;
  const seq = milestone.id.split('-').pop()?.toUpperCase() ?? '01';
  return `AKTA-${seq}/${projectCode.replace('YCD-', '')}/2026`;
}

/**
 * Kota + tanggal penandatanganan. Bila belum diisi, memakai targetDate dengan
 * kota Semarang Barat — menandai akta diterbitkan oleh kantor YcDev.
 */
export function milestoneSignedAt(milestone: ProjectMilestone): string {
  if (milestone.signedAt) return milestone.signedAt;
  return `Semarang Barat, ${milestone.targetDate}`;
}

/**
 * Judul dokumen resmi — dipakai pada kop akta milestone.
 */
export function milestoneDeedTitle(milestone: ProjectMilestone): string {
  return `Akta ${milestone.phaseLabel} — ${milestone.title}`;
}
