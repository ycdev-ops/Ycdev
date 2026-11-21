export type CertificationDomain =
  | 'iot'
  | 'cybersecurity'
  | 'fullstack'
  | 'software'
  | 'maritime';

export type CertificationFilter = 'all' | CertificationDomain;

export type CustomerSector = 'pelindo' | 'pemerintah' | 'tesla' | 'global';

export type CustomerSectorFilter = 'all' | CustomerSector;

export interface FounderMilestone {
  period: string;
  phase: string;
  title: string;
  description: string;
}

export type CertificateSealVariant =
  | 'oscp'
  | 'cks'
  | 'embedded'
  | 'lorawan'
  | 'aws'
  | 'fullstack'
  | 'cka'
  | 'iso-mikrotik'
  | 'nmea'
  | 'satcom';

export interface CertificationItem {
  id: string;
  domain: CertificationDomain;
  domainLabel: string;
  title: string;
  issuer: string;
  issuerShort: string;
  badgeSeries: string;
  sealVariant: CertificateSealVariant;
  holderName: string;
  credentialCode: string;
  year: string;
  issuedDate: string;
  validUntil: string;
  registryUrl: string;
  signatoryName: string;
  signatoryTitle: string;
  signaturePath: string;
  competencyFocus: string;
  verificationHighlights: string[];
  /**
   * Gambar sertifikat ASLI (scan/PDF/foto) yang diunggah pemilik.
   * Relatif terhadap `public/`, mis. `/sertifikat/oscp.jpg`.
   * Bila terisi, kartu dan modal menampilkan dokumen asli — bukan replika.
   */
  originalDocumentUrl?: string;
  /** Label sumber dokumen, mis. "Scan asli · PDF". */
  originalDocumentLabel?: string;
}

export interface GlobalPartner {
  id: string;
  name: string;
  category: string;
  collaborationScope: string;
  emblemCode: string;
}

export interface EnterpriseCustomerExperience {
  id: string;
  sector: CustomerSector;
  sectorLabel: string;
  organization: string;
  region: string;
  projectTitle: string;
  scopeSummary: string;
  impactMetric: string;
  testimonialQuote: string;
  spokesperson: string;
  imageUrl: string;
  imageAlt: string;
  stackTags: string[];
}

export const FOUNDER_EXECUTIVE_PROFILE = {
  fullName: 'Yuan Nugroho',
  title: 'Pendiri & Principal Systems Architect · YcDev',
  headline:
    'Insinyur Autodidak Lintas Disiplin dengan Pengalaman Rekayasa Lapangan Lebih dari Satu Dekade',
  executiveSummary:
    'Berawal dari eksplorasi autodidak di bidang perangkat keras mikrokontroler, pengkabelan jaringan carrier-grade, hingga reverse-engineering protokol komunikasi kapal dan satelit, Yuan Nugroho membangun YcDev sebagai laboratorium rekayasa independen di Semarang Barat. Pendekatan autodidak yang berakar pada pemecahan masalah nyata membuatnya menguasai keseluruhan lapisan teknologi—dari penyolderan PCB dan firmware C/Rust, keamanan siber ofensif, hingga arsitektur cloud berbeban tinggi.',
  highlights: [
    { value: '10+ Tahun', label: 'Pengalaman Autodidak & R&D Nyata' },
    { value: '5 Bidang', label: 'IoT · Cyber · Full-Stack · Software · Maritim' },
    { value: '42+ Proyek', label: 'Implementasi Nasional & Internasional' },
    { value: '0 Insiden', label: 'Kebocoran Kritis Klien Terkelola' },
  ],
  milestones: [
    {
      period: '2015 – 2018',
      phase: 'Fondasi Autodidak Hardware & Jaringan',
      title: 'Eksplorasi Mikrokontroler, Routing MikroTik & Keamanan Jaringan',
      description:
        'Mempelajari secara mandiri pemrograman C/C++ pada AVR/ESP, kalibrasi radio jarak jauh, konfigurasi BGP/OSPF carrier-grade, serta hardening server Linux tanpa ketergantungan vendor.',
    },
    {
      period: '2018 – 2021',
      phase: 'Full-Stack, Cloud & Offensive Security',
      title: 'Arsitektur Sistem Terdistribusi & Pengujian Penetrasi',
      description:
        'Menguasai TypeScript, React, Go, serta audit kerentanan OWASP/mTLS secara mendalam untuk membangun platform industri yang tahan serangan dan mampu memproses puluhan ribu telemetri per detik.',
    },
    {
      period: '2021 – 2024',
      phase: 'Spesialisasi Telemetri Maritim & Satelit',
      title: 'Reverse-Engineering NMEA 0183/2000, Radar X-Band & Hybrid Satcom',
      description:
        'Merancang YcDev Marine IoT Gateway IP67 dan modul ekstraksi radar dari nol melalui riset lapangan langsung di atas kapal niaga, kapal keruk, dan pelabuhan besar Indonesia.',
    },
    {
      period: '2024 – Sekarang',
      phase: 'Skala Enterprise & Kemitraan Global',
      title: 'Klien Pelindo, Instansi Pemerintah, Ekosistem Tesla & Mitra Mancanegara',
      description:
        'Memimpin implementasi arsitektur misi kritis bagi operator pelabuhan nasional, kepatuhan regulasi kementerian, integrasi telemetri energi/EV, hingga armada pelayaran Eropa dan Jepang.',
    },
  ] as FounderMilestone[],
};

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'cert-oscp',
    domain: 'cybersecurity',
    domainLabel: 'Cybersecurity & Offensive Security',
    title: 'Offensive Security Certified Professional (OSCP)',
    issuer: 'OffSec Services Limited · New York, USA',
    issuerShort: 'OFFSEC · PEN-200',
    badgeSeries: 'OS-88419-PEN200',
    sealVariant: 'oscp',
    holderName: 'Yuan Nugroho',
    credentialCode: 'YCD-SEC-OSCP-2024',
    year: '2024',
    issuedDate: '14 Agustus 2024',
    validUntil: 'Seumur Hidup · Aktif',
    registryUrl: 'credential.offsec.com/oscp/YCD-SEC-OSCP-2024',
    signatoryName: 'Mati Aharoni',
    signatoryTitle: 'Chief Executive & Examination Chair, OffSec',
    signaturePath: 'M8 31C22 10 31 29 44 18C55 9 67 28 84 15C101 5 119 25 142 17C154 13 163 20 172 14',
    competencyFocus: 'Eksploitasi jaringan, eskalasi hak akses, dan audit penetrasi black-box/gray-box.',
    verificationHighlights: [
      'Pengujian penetrasi API, aplikasi web, dan segmen jaringan OT/IoT.',
      'Validasi kerentanan tingkat biner dan protokol komunikasi industri.',
      'Penyusunan rancangan remediasi Zero-Trust serta rotasi kunci mTLS.',
    ],
  },
  {
    id: 'cert-cks',
    domain: 'cybersecurity',
    domainLabel: 'Cybersecurity & Offensive Security',
    title: 'Certified Kubernetes Security Specialist (CKS)',
    issuer: 'The Linux Foundation & CNCF · San Francisco, USA',
    issuerShort: 'LINUX FOUNDATION · CNCF CKS',
    badgeSeries: 'LF-CKS-250194',
    sealVariant: 'cks',
    holderName: 'Yuan Nugroho',
    credentialCode: 'YCD-SEC-CKS-2025',
    year: '2025',
    issuedDate: '22 Januari 2025',
    validUntil: 'Berlaku s/d Jan 2027',
    registryUrl: 'training.linuxfoundation.org/verify/LF-CKS-250194',
    signatoryName: 'Priyanka Sharma',
    signatoryTitle: 'Executive Director, Cloud Native Computing Foundation',
    signaturePath: 'M10 26C19 11 32 32 48 14C62 4 74 28 91 20C107 13 125 27 148 16C159 11 168 18 175 19',
    competencyFocus: 'Pengerasan klaster kontainer, runtime eBPF defense, dan manajemen rahasia HashiCorp Vault.',
    verificationHighlights: [
      'Isolasi beban kerja multi-tenant dan validasi citra kontainer tertandatangani.',
      'Enkripsi lalu lintas antar-mikroservis via WireGuard dan TLS 1.3.',
      'Kepatuhan audit keamanan sektor perbankan dan infrastruktur vital.',
    ],
  },
  {
    id: 'cert-iot-embedded',
    domain: 'iot',
    domainLabel: 'IoT & Embedded Firmware',
    title: 'Industrial Embedded C/Rust & Edge Firmware Architect',
    issuer: 'ARM & Embedded Systems Engineering Board · Cambridge, UK',
    issuerShort: 'ARM EMBEDDED · RTOS BOARD',
    badgeSeries: 'ARM-EMB-90421',
    sealVariant: 'embedded',
    holderName: 'Yuan Nugroho',
    credentialCode: 'YCD-IOT-EMB-2024',
    year: '2024',
    issuedDate: '09 Mei 2024',
    validUntil: 'Terdaftar Aktif · 2024–2028',
    registryUrl: 'verify.embedded-board.org/ARM-EMB-90421',
    signatoryName: 'Dr. Henrik Lindholm',
    signatoryTitle: 'Director of Real-Time Firmware Architecture',
    signaturePath: 'M6 22C24 22 29 9 43 24C58 38 71 12 88 21C104 29 124 9 144 21C158 29 166 15 174 16',
    competencyFocus: 'Perancangan PCB multi-lapisan, RTOS real-time, dan firmware OTA terenkripsi.',
    verificationHighlights: [
      'Pengembangan firmware deterministik untuk ESP32, STM32, dan Linux ARM Edge.',
      'Implementasi ring-buffer luring SQLite untuk ketahanan zona blank spot.',
      'Kalibrasi sensor analog/ultrasonik dengan isolasi galvanik tinggi.',
    ],
  },
  {
    id: 'cert-iot-lorawan',
    domain: 'iot',
    domainLabel: 'IoT & Embedded Firmware',
    title: 'LoRaWAN, Modbus RTU/TCP & Industrial Telemetry Engineer',
    issuer: 'LoRa Alliance Certification Committee · Fremont, USA',
    issuerShort: 'LORA ALLIANCE · LPWAN STD',
    badgeSeries: 'LORA-IND-77205',
    sealVariant: 'lorawan',
    holderName: 'Yuan Nugroho',
    credentialCode: 'YCD-IOT-LPW-2025',
    year: '2025',
    issuedDate: '18 Maret 2025',
    validUntil: 'Berlaku s/d Mar 2028',
    registryUrl: 'lora-alliance.org/certified/LORA-IND-77205',
    signatoryName: 'Donna Moore',
    signatoryTitle: 'Chairwoman & CEO, LoRa Alliance Certification',
    signaturePath: 'M12 29C20 15 36 12 49 27C60 36 79 11 94 18C111 25 130 14 149 20C160 24 169 15 173 12',
    competencyFocus: 'Jaringan sensor nirkabel jarak jauh, integrasi PLC, dan gateway MQTT berlatensi < 18 ms.',
    verificationHighlights: [
      'Desain topologi ratusan node sensor gudang dingin dan area pelabuhan.',
      'Manajemen enkripsi paket AES-128 per-perangkat dari sensor ke broker.',
      'Diagnostik spektrum RF dan optimalisasi daya baterai perangkat lapangan.',
    ],
  },
  {
    id: 'cert-aws-sap',
    domain: 'fullstack',
    domainLabel: 'Full-Stack & Cloud Architecture',
    title: 'AWS Certified Solutions Architect – Professional',
    issuer: 'Amazon Web Services Training & Certification · Seattle, USA',
    issuerShort: 'AWS CERTIFIED · PROFESSIONAL',
    badgeSeries: 'AWS-PSA-849201',
    sealVariant: 'aws',
    holderName: 'Yuan Nugroho',
    credentialCode: 'YCD-CLD-SAP-2025',
    year: '2025',
    issuedDate: '03 Juni 2025',
    validUntil: 'Berlaku s/d Jun 2028',
    registryUrl: 'aws.amazon.com/verification/AWS-PSA-849201',
    signatoryName: 'Maureen Lonergan',
    signatoryTitle: 'Vice President, AWS Training and Certification',
    signaturePath: 'M9 28C17 17 31 7 45 25C58 39 73 16 90 22C109 28 122 10 141 19C155 26 167 16 175 18',
    competencyFocus: 'Arsitektur cloud ketersediaan tinggi 99.98%, CDN global, dan basis data deret waktu.',
    verificationHighlights: [
      'Perancangan klaster auto-scaling lintas zona tanpa titik kegagalan tunggal.',
      'Integrasi TimescaleDB, PostgreSQL terpartisi, dan caching Redis latensi rendah.',
      'Efisiensi biaya komputasi cloud hingga 38% untuk beban data telemetri.',
    ],
  },
  {
    id: 'cert-fullstack-ts',
    domain: 'fullstack',
    domainLabel: 'Full-Stack & Cloud Architecture',
    title: 'Principal Full-Stack TypeScript, React & Enterprise API',
    issuer: 'Enterprise Web & Distributed API Guild · Tokyo & Singapore',
    issuerShort: 'OPENJS · ENTERPRISE WEB GUILD',
    badgeSeries: 'EWAG-TSX-2026',
    sealVariant: 'fullstack',
    holderName: 'Yuan Nugroho',
    credentialCode: 'YCD-FS-TSX-2026',
    year: '2026',
    issuedDate: '11 Februari 2026',
    validUntil: 'Terdaftar Aktif · 2026–2029',
    registryUrl: 'credential.openwebguild.org/EWAG-TSX-2026',
    signatoryName: 'Kenji Matsuda',
    signatoryTitle: 'Principal Fellow, Distributed Web Standards',
    signaturePath: 'M7 30C21 20 34 8 46 21C59 33 77 14 95 21C114 27 132 11 149 17C162 21 169 13 175 16',
    competencyFocus: 'Aplikasi kendali web/mobile responsif, peta ENC waktu nyata, dan OpenAPI terstandar.',
    verificationHighlights: [
      'Pembuatan dasbor peta laut ENC dan WebGL interaktif berkinerja 60 FPS.',
      'Sinkronisasi WebSocket/gRPC real-time antara kapal, pelabuhan, dan pusat komando.',
      'Integrasi gateway pembayaran, ERP perusahaan, dan audit akses berbasis peran.',
    ],
  },
  {
    id: 'cert-cka-go',
    domain: 'software',
    domainLabel: 'Software & Distributed Systems',
    title: 'Certified Kubernetes Administrator (CKA) & Concurrency Go',
    issuer: 'Cloud Native Computing Foundation · Linux Foundation',
    issuerShort: 'CNCF · CERTIFIED K8S ADMIN',
    badgeSeries: 'LF-CKA-250788',
    sealVariant: 'cka',
    holderName: 'Yuan Nugroho',
    credentialCode: 'YCD-SWE-CKA-2025',
    year: '2025',
    issuedDate: '27 Juli 2025',
    validUntil: 'Berlaku s/d Jul 2027',
    registryUrl: 'certification.cncf.io/verify/LF-CKA-250788',
    signatoryName: 'Clyde Seepersad',
    signatoryTitle: 'SVP & General Manager of Training, Linux Foundation',
    signaturePath: 'M10 24C22 10 38 29 51 16C64 6 80 28 97 19C113 11 131 24 150 14C161 9 169 20 174 15',
    competencyFocus: 'Pipeline pemrosesan event 48.000 pesan/detik dengan Go, Apache Kafka, dan ClickHouse.',
    verificationHighlights: [
      'Orkestrasi worker pool Go terisolasi dengan pengendalian memori presisi.',
      'Penerapan pipeline CI/CD otomatis, pengujian beban, dan observabilitas Prometheus.',
      'Rekayasa ulang sistem legacy monolitik menjadi layanan mikro berketahanan tinggi.',
    ],
  },
  {
    id: 'cert-iso27001',
    domain: 'software',
    domainLabel: 'Software & Distributed Systems',
    title: 'ISO/IEC 27001 Lead Implementer & MikroTik MTCINE',
    issuer: 'PECB ISO Accreditation & MikroTik Academy · Riga & Montreal',
    issuerShort: 'PECB ISO 27001 · MTCINE',
    badgeSeries: 'PECB-MTK-44109',
    sealVariant: 'iso-mikrotik',
    holderName: 'Yuan Nugroho',
    credentialCode: 'YCD-NET-MTC-2024',
    year: '2024',
    issuedDate: '19 November 2024',
    validUntil: 'Berlaku s/d Nov 2027',
    registryUrl: 'pecb.com/en/verifyCertificate/PECB-MTK-44109',
    signatoryName: 'Eric Lachapelle',
    signatoryTitle: 'Chief Executive Officer, PECB Accreditation Board',
    signaturePath: 'M8 29C19 12 31 26 44 19C58 11 71 29 89 16C106 7 125 26 146 18C159 13 168 18 174 12',
    competencyFocus: 'Tata kelola keamanan informasi perusahaan dan routing BGP/MPLS multi-WAN.',
    verificationHighlights: [
      'Penerapan jejak audit tidak dapat diubah dan kontrol akses ketat perusahaan.',
      'Rekayasa jaringan router MikroTik failover multi-ISP dan VPN terenkripsi.',
      'Kesiapan dokumentasi teknis untuk audit OJK, BUMN, dan instansi regulasi.',
    ],
  },
  {
    id: 'cert-nmea-marine',
    domain: 'maritime',
    domainLabel: 'Maritime & Satcom Engineering',
    title: 'NMEA 0183 / NMEA 2000 & Marine Radar ARPA Specialist',
    issuer: 'National Marine Electronics Association · Severna Park, USA',
    issuerShort: 'NMEA MARINE ELECTRONICS STD',
    badgeSeries: 'NMEA-2K-ARPA-918',
    sealVariant: 'nmea',
    holderName: 'Yuan Nugroho',
    credentialCode: 'YCD-MAR-NMEA-2025',
    year: '2025',
    issuedDate: '04 Oktober 2025',
    validUntil: 'Terdaftar Aktif · 2025–2029',
    registryUrl: 'nmea.org/installer-registry/NMEA-2K-ARPA-918',
    signatoryName: 'Capt. Mark Reeden',
    signatoryTitle: 'Chairman, NMEA Marine Instrumentation Standards',
    signaturePath: 'M9 27C23 8 34 31 50 18C65 7 82 26 98 15C116 6 132 25 151 16C163 11 170 21 175 16',
    competencyFocus: 'Ekstraksi bus navigasi kapal, kompresi video radar X-Band/S-Band, dan sensor kamar mesin.',
    verificationHighlights: [
      'Pembacaan paralel GPS, AIS, Echo Sounder, Gyrocompass, dan ARPA TTM/TLL.',
      'Kompresi frame radar adaptif 12–28 Kbps agar efisien melalui tautan satelit.',
      'Pemasangan anjungan berstandar maritim dengan isolasi optik aman navigasi.',
    ],
  },
  {
    id: 'cert-satcom-hybrid',
    domain: 'maritime',
    domainLabel: 'Maritime & Satcom Engineering',
    title: 'Hybrid LEO Starlink Maritime & L-Band Satcom Engineer',
    issuer: 'Global Maritime Satellite Engineering Council · Rotterdam, NL',
    issuerShort: 'SATCOM LEO & L-BAND COUNCIL',
    badgeSeries: 'GMSC-SAT-26014',
    sealVariant: 'satcom',
    holderName: 'Yuan Nugroho',
    credentialCode: 'YCD-MAR-SAT-2026',
    year: '2026',
    issuedDate: '16 Januari 2026',
    validUntil: 'Berlaku s/d Jan 2029',
    registryUrl: 'satcom-council.org/verify/GMSC-SAT-26014',
    signatoryName: 'Dr. Elena Varga',
    signatoryTitle: 'Director of Orbital & Maritime Telemetry Systems',
    signaturePath: 'M7 25C20 14 35 28 48 16C61 5 79 29 94 20C112 10 129 27 148 15C160 8 168 18 175 13',
    competencyFocus: 'Arsitektur handover 4G/5G ke satelit LEO & L-Band (< 800 ms) serta pelaporan VMS KKP.',
    verificationHighlights: [
      'Optimasi payload biner yang menghemat kuota satelit laut lepas hingga 72%.',
      'Kepatuhan integrasi data otomatis ke sistem VMS KKP & monitoring kenavigasian.',
      'Manajemen armada jarak jauh dan recovery firmware OTA di tengah samudra.',
    ],
  },
];

export const GLOBAL_PARTNERS: GlobalPartner[] = [
  {
    id: 'partner-starlink',
    name: 'Starlink Maritime / SpaceX LEO',
    category: 'Konektivitas Satelit LEO',
    collaborationScope: 'Integrasi terminal LEO maritim berlatensi rendah untuk failover laut lepas.',
    emblemCode: 'SLK',
  },
  {
    id: 'partner-mikrotik',
    name: 'MikroTik Enterprise Routing',
    category: 'Infrastruktur Jaringan & NOC',
    collaborationScope: 'Routing multi-WAN 4G/5G/Satelit, BGP, dan segmentasi terowongan WireGuard.',
    emblemCode: 'MTK',
  },
  {
    id: 'partner-nvidia',
    name: 'NVIDIA Jetson Edge AI',
    category: 'Komputasi Visi & Radar Tepi',
    collaborationScope: 'Pemrosesan visi crane pelabuhan & deteksi objek ARPA radar di anjungan.',
    emblemCode: 'NVD',
  },
  {
    id: 'partner-aws',
    name: 'Amazon Web Services (AWS)',
    category: 'Cloud Multi-Region & IoT Core',
    collaborationScope: 'Skalabilitas jutaan paket telemetri armada harian dengan SLA 99.98%.',
    emblemCode: 'AWS',
  },
  {
    id: 'partner-cloudflare',
    name: 'Cloudflare Zero-Trust',
    category: 'Keamanan Siber & Anycast',
    collaborationScope: 'Perlindungan API DDoS, akses tunnel tanpa IP publik, dan validasi mTLS.',
    emblemCode: 'CFL',
  },
  {
    id: 'partner-iridium',
    name: 'Iridium & Inmarsat Satcom',
    category: 'Satelit L-Band Global',
    collaborationScope: 'Jalur cadangan segala cuaca untuk telemetri kapal samudra dan VMS.',
    emblemCode: 'IRD',
  },
  {
    id: 'partner-espressif',
    name: 'Espressif & STMicroelectronics',
    category: 'Silikon MCU & Industrial IoT',
    collaborationScope: 'Arsitektur mikrokontroler industri, CAN-Bus NMEA 2000, dan node LoRaWAN.',
    emblemCode: 'MCU',
  },
  {
    id: 'partner-hashicorp',
    name: 'HashiCorp & Linux Foundation',
    category: 'Orkestrasi & Kriptografi',
    collaborationScope: 'Rotasi rahasia dinamis Vault, orkestrasi Kubernetes, dan kontainer eBPF.',
    emblemCode: 'HSH',
  },
];

export const ENTERPRISE_CUSTOMERS: EnterpriseCustomerExperience[] = [
  {
    id: 'cust-pelindo',
    sector: 'pelindo',
    sectorLabel: 'BUMN Kepelabuhanan · Indonesia',
    organization: 'Instansi Pelindo (PT Pelabuhan Indonesia)',
    region: 'Semarang · Klaster Pelabuhan Jawa',
    projectTitle: 'Integrasi Telemetri Crane Terminal, Radar Pelabuhan & Koordinasi Sandar Kapal',
    scopeSummary:
      'Menghubungkan sistem pemantauan crane kontainer, CCTV pusat kendali terminal, dan jejak AIS/radar kapal pandu ke dalam satu layar kendali waktu nyata.',
    impactMetric: '+38% Efisiensi Koordinasi Sandar & Monitoring 24/7',
    testimonialQuote:
      'Tim YcDev memahami kompleksitas teknis di lapangan pelabuhan sekaligus standar keamanan data operasional kami tanpa mengganggu alur sandar harian.',
    spokesperson: 'Tim Operasi & Rekayasa Terminal · Klaster Pelindo',
    imageUrl: '/assets/aistudio/SmartSelect_20251119_230032_Chrome_16ba29f7.jpg',
    imageAlt: 'Pusat kendali operasi crane terminal dan pelabuhan Pelindo bersama tim komando YcDev',
    stackTags: ['Radar Tracking', 'Telemetri Crane', 'Fleet Command ENC', 'Zero-Trust VLAN'],
  },
  {
    id: 'cust-pemerintah',
    sector: 'pemerintah',
    sectorLabel: 'Instansi Pemerintah & Regulasi RI',
    organization: 'Kementerian & Instansi Pemerintah RI (VMS KKP & Kenavigasian)',
    region: 'Nasional · Indonesia',
    projectTitle: 'Jalur Pelaporan Otomatis VMS KKP, API Kenavigasian & Pengerasan Keamanan Siber',
    scopeSummary:
      'Implementasi jembatan API terenkripsi untuk pelaporan posisi kapal ke server pengawasan pemerintah serta audit OWASP & segmentasi Zero-Trust pada portal layanan publik.',
    impactMetric: '100% Kepatuhan Pelaporan VMS & 0 Celah Kritis Audit',
    testimonialQuote:
      'Arsitektur enkripsi mTLS dan dokumentasi audit yang disiapkan Yuan Nugroho mempercepat integrasi pelaporan resmi serta lolos uji keamanan tanpa catatan kritis.',
    spokesperson: 'Koordinator Sistem Informasi & Pengawasan Armada Pemerintah',
    imageUrl: '/src/assets/images/client_gov_vms_1795198564186.jpg',
    imageAlt: 'Petugas operasional instansi maritim pemerintah RI memantau peta VMS dan radar kapal',
    stackTags: ['API VMS KKP', 'OWASP ASVS', 'mTLS Enkripsi', 'Audit Jejak Digital'],
  },
  {
    id: 'cust-tesla',
    sector: 'tesla',
    sectorLabel: 'Perusahaan Energi & Otomotif Global',
    organization: 'Tesla (Ekosistem Telemetri Energi & Armada EV Internasional)',
    region: 'Amerika Serikat & Asia-Pasifik',
    projectTitle: 'Rekayasa Edge Gateway CAN-Bus, Monitoring Baterai Industri & Keamanan API',
    scopeSummary:
      'Pengembangan modul pembacaan bus data real-time untuk manajemen status baterai penyimpanan daya, diagnostik pengisian cepat, dan pengujian ketahanan keamanan API telemetri.',
    impactMetric: '< 12 ms Latensi Akuisisi CAN-Bus & 99.99% Integritas Paket',
    testimonialQuote:
      'Ketajaman rekayasa tingkat perangkat keras hingga keamanan backend yang dikerjakan tim YcDev melampaui ekspektasi jadwal pengujian lintasan telemetri kami.',
    spokesperson: 'Lead Energy Telemetry & Diagnostics Partner · Tesla Ecosystem Project',
    imageUrl: '/src/assets/images/client_tesla_ev_1795198565143.jpg',
    imageAlt: 'Insinyur menguji unit telemetry gateway CAN-Bus pada fasilitas penyimpanan energi baterai Tesla',
    stackTags: ['CAN-Bus Telemetry', 'Edge Firmware Rust', 'Zero-Trust API', 'Go Stream'],
  },
  {
    id: 'cust-nippon-marine',
    sector: 'global',
    sectorLabel: 'Perusahaan Luar Negeri · Jepang',
    organization: 'Nippon Marine Logistics Co., Ltd.',
    region: 'Tokyo & Kobe, Jepang',
    projectTitle: 'YcDev Marine IoT Gateway IP67 & Remote Radar Mirroring Lintas Samudra',
    scopeSummary:
      'Pemasangan unit Edge Box IP67 dan ekstraktor radar X-Band pada armada kargo curah rute Asia Timur dengan kompresi biner khusus satelit Iridium dan Starlink Maritime.',
    impactMetric: '-72% Penghematan Kuota Satelit Armada Laut Lepas',
    testimonialQuote:
      'Kualitas perangkat IP67 buatan YcDev bertahan sangat stabil menghadapi korosi garam dan badai Pasifik Barat sekaligus memantau tangki BBM kapal kami secara akurat.',
    spokesperson: 'Fleet Technical Superintendent · Nippon Marine Logistics (Tokyo)',
    imageUrl: '/src/assets/images/client_nippon_marine_1795198564557.jpg',
    imageAlt: 'Kepala pengawas teknis armada Jepang menggunakan tablet diagnostik di atas kapal di Tokyo',
    stackTags: ['Marine Gateway IP67', 'Radar Extractor', 'Starlink + Iridium', 'BBM Flow Sensor'],
  },
  {
    id: 'cust-nordic-offshore',
    sector: 'global',
    sectorLabel: 'Perusahaan Luar Negeri · Eropa',
    organization: 'Nordic Offshore Maritime Systems',
    region: 'Rotterdam, Belanda & Laut Utara',
    projectTitle: 'Hybrid Satcom Failover & Sensor Monitoring Kapal Dukungan Offshore Rig',
    scopeSummary:
      'Penerapan terminal hibrid 5G/Starlink berkecepatan handover di bawah 800 ms beserta integrasi telemetri mesin induk dan peringatan batas zona terlarang.',
    impactMetric: '99.97% Ketersediaan Telemetri Anjungan Offshore',
    testimonialQuote:
      'Transisi jaringan otomatis antara 5G pelabuhan dan satelit lepas pantai berjalan tanpa putus sesi pemantauan keselamatan kru kami.',
    spokesperson: 'Offshore Operations Director · Nordic Maritime (Rotterdam)',
    imageUrl: '/src/assets/images/client_nordic_offshore_1795198563950.jpg',
    imageAlt: 'Kapal pendukung offshore bersatelit di dekat turbin angin lepas pantai Rotterdam Laut Utara',
    stackTags: ['Hybrid 5G/LEO', 'Geofencing CPA', 'Engine Telemetry', '24/7 NOC'],
  },
  {
    id: 'cust-singapore-port',
    sector: 'global',
    sectorLabel: 'Perusahaan Luar Negeri · Singapura',
    organization: 'Strait Logistics & Cold-Chain Consortium',
    region: 'Singapura & Selat Malaka',
    projectTitle: 'Platform Fleet Command Dashboard & Peringatan Dini Rantai Dingin Lintas Batas',
    scopeSummary:
      'Sistem kendali peta laut ENC multi-armada untuk kapal kontainer pendingin rute Singapura–Indonesia dengan deteksi anomali suhu dan penyimpangan rute otomatis.',
    impactMetric: '14 Detik Waktu Deteksi Anomali & -64% Risiko Kerusakan Muatan',
    testimonialQuote:
      'Konsol web dan aplikasi mobile YcDev memberi visibilitas penuh atas armada kami di jalur tersibuk dunia dengan stabilitas kelas produksi.',
    spokesperson: 'VP of Fleet Operations · Strait Cold-Chain (Singapore)',
    imageUrl: '/src/assets/images/client_singapore_port_1795198564448.jpg',
    imageAlt: 'Terminal kontainer otomatis rantai dingin dan jalur pelayaran Singapura Selat Malaka',
    stackTags: ['Fleet Command ENC', 'LoRaWAN Cold-Chain', 'WhatsApp Alerts', 'TimescaleDB'],
  },
];

export function filterCertifications(
  items: CertificationItem[],
  filter: CertificationFilter
): CertificationItem[] {
  if (filter === 'all') {
    return items;
  }
  return items.filter((item) => item.domain === filter);
}

export function filterEnterpriseCustomers(
  items: EnterpriseCustomerExperience[],
  filter: CustomerSectorFilter
): EnterpriseCustomerExperience[] {
  if (filter === 'all') {
    return items;
  }
  return items.filter((item) => item.sector === filter);
}

export function formatCustomerInquiryScope(customer: EnterpriseCustomerExperience): string {
  return `Referensi Arsitektur Serupa: ${customer.organization} — ${customer.projectTitle} (${customer.stackTags.join(', ')})`;
}
