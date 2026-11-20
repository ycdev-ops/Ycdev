export type MaritimeCategory = 'hardware' | 'software' | 'services';

export type MaritimeCategoryFilter = 'all' | MaritimeCategory;

export type ProductVideoVariant =
  | 'nmea-bus'
  | 'radar-sweep'
  | 'satcom-handover'
  | 'fuel-flow'
  | 'enc-fleet'
  | 'remote-radar'
  | 'geofence-alert'
  | 'api-sync'
  | 'onboard-cabling'
  | 'airtime-qos'
  | 'noc-telemetry'
  | 'dredger-rig';

export interface ProductSpecRow {
  label: string;
  value: string;
}

export interface MaritimeSolutionItem {
  id: string;
  indexLabel: string;
  category: MaritimeCategory;
  categoryLabel: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  videoReelTitle: string;
  videoDurationLabel: string;
  animationVariant: ProductVideoVariant;
  keySpecs: string[];
  detailedSpecs: ProductSpecRow[];
  deploymentStages: string[];
  protocolOrStandard: string;
  linked3DModelId?: 'marine-gateway' | 'hybrid-satcom';
}

export interface MaritimeCategoryMeta {
  id: MaritimeCategory;
  stepNumber: string;
  title: string;
  shortLabel: string;
  subtitle: string;
}

export const MARITIME_CATEGORIES: MaritimeCategoryMeta[] = [
  {
    id: 'hardware',
    stepNumber: '01',
    title: 'Produk Perangkat Keras (Hardware)',
    shortLabel: 'Perangkat Keras',
    subtitle:
      'Perangkat edge tahan garam IP67, ekstraktor radar X/S-Band, terminal satelit hibrid & sensor mesin kapal.',
  },
  {
    id: 'software',
    stepNumber: '02',
    title: 'Platform Perangkat Lunak (Software & Cloud)',
    shortLabel: 'Perangkat Lunak',
    subtitle:
      'Dasbor peta laut digital ENC real-time, remote radar mirroring, geofencing otomatis & integrasi VMS KKP.',
  },
  {
    id: 'services',
    stepNumber: '03',
    title: 'Layanan Profesional (Services)',
    shortLabel: 'Layanan Profesional',
    subtitle:
      'Survei & instalasi on-board seluruh Indonesia, airtime satelit terkelola, NOC 24/7 & rekayasa kustom.',
  },
];

export const MARITIME_SOLUTIONS: MaritimeSolutionItem[] = [
  // 1. Produk Perangkat Keras (Hardware)
  {
    id: 'marine-iot-gateway',
    indexLabel: 'HW-01',
    category: 'hardware',
    categoryLabel: 'Perangkat Keras Maritim',
    name: 'YcDev Marine IoT Gateway (Edge Box)',
    tagline: 'Unit Pemroses Data Bridge Kapal Standar IP67',
    description:
      'Kotak pemroses data tahan air dan garam (standar industri IP67) yang dipasang di ruang kemudi kapal untuk membaca data NMEA 0183/2000 dari radar, GPS, dan sensor mesin.',
    imageUrl: '/src/assets/images/marine_iot_gateway_1795196270852.jpg',
    imageAlt: 'YcDev Marine IoT Gateway Edge Box standar IP67 dengan konektor NMEA 2000',
    videoReelTitle: 'Operasi Akuisisi Bus NMEA 0183/2000 & Buffering Luring',
    videoDurationLabel: '00:24 · Live Loop',
    animationVariant: 'nmea-bus',
    keySpecs: [
      'Enklosur aluminium marine-grade tahan korosi garam (IP67)',
      'Akuisisi multi-kanal NMEA 0183, NMEA 2000 (CAN), & Modbus RTU',
      'Buffer memori luring terenkripsi saat kapal melintas di zona blank spot',
    ],
    detailedSpecs: [
      { label: 'Proteksi Enklosur', value: 'IP67 Marine Anodized Alloy' },
      { label: 'Antarmuka Navigasi', value: '2× NMEA 2000 CAN + 4× NMEA 0183 (RS-422)' },
      { label: 'Penyimpanan Luring', value: '64 GB Industrial SLC + SQLite Ring Buffer' },
      { label: 'Catu Daya Kapal', value: '9–36 VDC Dual Isolated (Surge Protected)' },
    ],
    deploymentStages: [
      'Audit port NMEA & tegangan DC pada konsol anjungan kapal.',
      'Pemasangan braket anti-vibrasi & penyegelan gland kabel kuningan IP67.',
      'Uji sinkronisasi paket ke Fleet Command Dashboard & pemulihan putus sinyal.',
    ],
    protocolOrStandard: 'IP67 · NMEA 0183/2000 · RS-422/485 · CAN-Bus',
    linked3DModelId: 'marine-gateway',
  },
  {
    id: 'radar-arpa-extractor',
    indexLabel: 'HW-02',
    category: 'hardware',
    categoryLabel: 'Perangkat Keras Maritim',
    name: 'Radar Video & ARPA Extractor Module',
    tagline: 'Kompresi Tangkapan Layar Radar X-Band / S-Band',
    description:
      'Modul antarmuka khusus yang menangkap tampilan layar radar kapal (X-Band/S-Band) dan memadatkannya menjadi data ringan untuk dikirim lewat satelit.',
    imageUrl: '/src/assets/images/radar_arpa_extractor_1795196271888.jpg',
    imageAlt: 'Radar Video and ARPA Extractor Module terhubung ke layar radar kapal X-Band',
    videoReelTitle: 'Ekstraksi Target ARPA & Kompresi Sweep Radar X-Band',
    videoDurationLabel: '00:28 · Live Loop',
    animationVariant: 'radar-sweep',
    keySpecs: [
      'Menangkap sinyal video radar X-Band & S-Band serta target pelacakan ARPA',
      'Kompresi frame adaptif ber-bitrate ultra rendah untuk efisiensi kuota satelit',
      'Isolasi optik penuh agar tidak mengganggu sistem navigasi utama anjungan',
    ],
    detailedSpecs: [
      { label: 'Input Radar', value: 'Analog RGB/DVI Radar + Serial ARPA TTM/TLL' },
      { label: 'Band Didukung', value: 'Marine X-Band (9 GHz) & S-Band (3 GHz)' },
      { label: 'Rasio Kompresi', value: '12–28 Kbps Adaptif via Satelit L-Band/LEO' },
      { label: 'Keselamatan Bus', value: 'Isolasi Galvanik 2.5 kV (Zero Interference)' },
    ],
    deploymentStages: [
      'Identifikasi splitter video & output NMEA TTM dari unit radar utama.',
      'Instalasi modul ekstraktor dengan isolator optik pasif di balik konsol.',
      'Kalibrasi jangkauan (NM) & verifikasi sinkronisasi ARPA ke pusat komando.',
    ],
    protocolOrStandard: 'X-Band / S-Band · ARPA Target Stream · Low-Bitrate Codec',
  },
  {
    id: 'hybrid-satcom-terminal',
    indexLabel: 'HW-03',
    category: 'hardware',
    categoryLabel: 'Perangkat Keras Maritim',
    name: 'Hybrid Satellite & Cellular Terminal',
    tagline: 'Failover Otomatis 4G/5G Pantai & Satelit Laut Lepas',
    description:
      'Paket antena dan modem maritim otomatis yang beralih mulus antara jaringan 4G/5G saat dekat pantai dan jaringan satelit (LEO seperti Starlink Maritime atau L-Band seperti Iridium/Inmarsat) di laut lepas.',
    imageUrl: '/src/assets/images/hybrid_satcom_terminal_1795196270637.jpg',
    imageAlt: 'Hybrid Satellite and Cellular Terminal dengan radome maritim dan antena 5G di tiang kapal',
    videoReelTitle: 'Operasi Failover Otomatis 4G/5G ke LEO Starlink & L-Band',
    videoDurationLabel: '00:30 · Live Loop',
    animationVariant: 'satcom-handover',
    keySpecs: [
      'Switching otomatis 4G/5G pesisir ke LEO (Starlink Maritime) & L-Band (Iridium/Inmarsat)',
      'Manajemen prioritas paket telemetri kritis & routing Multi-WAN zero-drop',
      'Radome maritim terstabilisasi untuk gelombang tinggi & angin laut ekstrem',
    ],
    detailedSpecs: [
      { label: 'Kanal Seluler', value: 'Dual-SIM 5G/4G LTE High-Gain Marine MIMO' },
      { label: 'Kanal Satelit', value: 'LEO (Starlink Maritime) + L-Band (Iridium/Inmarsat)' },
      { label: 'Waktu Handover', value: '< 800 ms Seamless Multi-WAN Failover' },
      { label: 'Ketahanan Angin', value: 'Up to 110 Knots · -25°C to +55°C' },
    ],
    deploymentStages: [
      'Survei garis pandang langit (skyline view) di atas dek mast radar kapal.',
      'Pemasangan pedestal baja tahan karat, radome satelit, dan bilah antena 5G.',
      'Konfigurasi kebijakan routing SD-WAN & prioritas kuota telemetri.',
    ],
    protocolOrStandard: '4G/5G MIMO · LEO Starlink · L-Band Iridium/Inmarsat',
    linked3DModelId: 'hybrid-satcom',
  },
  {
    id: 'smart-fuel-engine-sensor',
    indexLabel: 'HW-04',
    category: 'hardware',
    categoryLabel: 'Perangkat Keras Maritim',
    name: 'Smart Fuel & Engine Telemetry Sensor',
    tagline: 'Sensor BBM Presisi, RPM & Suhu Ruang Mesin',
    description:
      'Sensor tambahan untuk memantau volume tangki BBM (flow meter / ultrasonik), RPM mesin, dan suhu ruang mesin secara real-time untuk mencegah pencurian bahan bakar.',
    imageUrl: '/src/assets/images/smart_fuel_sensor_1795196271412.jpg',
    imageAlt: 'Smart Fuel and Engine Telemetry Sensor terpasang pada pipa bahan bakar diesel kamar mesin kapal',
    videoReelTitle: 'Monitoring Aliran BBM Flow Meter, RPM & Deteksi Siphoning',
    videoDurationLabel: '00:22 · Live Loop',
    animationVariant: 'fuel-flow',
    keySpecs: [
      'Deteksi anomali penyusutan tangki & selisih konsumsi BBM secara real-time',
      'Pemantauan RPM mesin induk, genset, tekanan oli, dan suhu kamar mesin',
      'Kompensasi kemiringan kapal (pitch & roll) pada pembacaan level tangki',
    ],
    detailedSpecs: [
      { label: 'Akurasi Pengukuran', value: '±0.5% Differential Flow / Ultrasonic Level' },
      { label: 'Telemetri Mesin', value: 'RPM Induk/Genset, Exhaust Temp, Oil Pressure' },
      { label: 'Kompensasi Ombak', value: 'IMU 6-Axis Pitch/Roll Filtering' },
      { label: 'Deteksi Pencurian', value: 'Alert Selisih Flow vs Tank Level < 15 Detik' },
    ],
    deploymentStages: [
      'Pemetaan jalur suplai-return BBM & kalibrasi tabel sounding tangki kapal.',
      'Instalasi sensor ultrasonik/flow meter bersertifikat & hub J1939 kamar mesin.',
      'Pengujian akurasi pembakaran per jam (L/jam) saat uji coba berlayar.',
    ],
    protocolOrStandard: 'Ultrasonic / Flow Meter · J1939 · Anti-Siphoning Alert',
  },

  // 2. Platform Perangkat Lunak (Software & Cloud)
  {
    id: 'fleet-command-dashboard',
    indexLabel: 'SW-01',
    category: 'software',
    categoryLabel: 'Platform Software & Cloud',
    name: 'YcDev Fleet Command Dashboard (Web & Mobile)',
    tagline: 'Pusat Kendali Armada Berbasis Peta Laut Digital (ENC)',
    description:
      'Pusat kendali berbasis peta laut digital (Electronic Navigational Charts) untuk memantau posisi seluruh armada, arah haluan, kecepatan, dan cuaca maritim secara langsung.',
    imageUrl: '/src/assets/images/fleet_command_dashboard_1795196271551.jpg',
    imageAlt: 'YcDev Fleet Command Dashboard menampilkan peta laut digital ENC dan posisi armada kapal',
    videoReelTitle: 'Pemantauan Armada Live di Peta Laut ENC & Overlay Cuaca',
    videoDurationLabel: '00:26 · Live Loop',
    animationVariant: 'enc-fleet',
    keySpecs: [
      'Peta laut digital ENC interaktif dengan overlay rute pelayaran & cuaca maritim',
      'Pelacakan arah haluan (heading), kecepatan (SOG/STW), dan status mesin armada',
      'Akses multi-perangkat (Web Command Center & Mobile) dengan kontrol hak akses peran',
    ],
    detailedSpecs: [
      { label: 'Standar Peta Laut', value: 'IHO S-57 / S-63 ENC + AIS Target Layer' },
      { label: 'Refresh Telemetri', value: 'Real-Time WebSocket (1–5 Detik Coastal / Adaptif)' },
      { label: 'Layer Cuaca', value: 'Tinggi Gelombang, Arah Angin, & Badai Tropis' },
      { label: 'Platform Akses', value: 'Web Command Center + iOS / Android Companion' },
    ],
    deploymentStages: [
      'Onboarding daftar kapal (IMO/MMSI) dan konfigurasi peta zona operasi klien.',
      'Pembagian hak akses role (Direksi, DPA, Superintendent, Operator).',
      'Pelatihan tim darat serta integrasi laporan voyage harian otomatis.',
    ],
    protocolOrStandard: 'ENC S-57/S-63 · AIS Overlay · Web & Mobile Real-Time',
  },
  {
    id: 'remote-radar-mirroring',
    indexLabel: 'SW-02',
    category: 'software',
    categoryLabel: 'Platform Software & Cloud',
    name: 'Remote Radar Mirroring',
    tagline: 'Pantau Layar Radar Kapal Langsung dari Darat',
    description:
      'Fitur yang memungkinkan tim darat melihat tangkapan objek di layar radar kapal secara jarak jauh untuk membantu navigasi di jalur padat atau cuaca buruk.',
    imageUrl: '/src/assets/images/remote_radar_mirroring_1795196271550.jpg',
    imageAlt: 'Monitor Remote Radar Mirroring menampilkan gema radar dan target kapal di ruang kendali darat',
    videoReelTitle: 'Sinkronisasi Layar Radar Kapal ke Ruang Kendali Darat',
    videoDurationLabel: '00:25 · Live Loop',
    animationVariant: 'remote-radar',
    keySpecs: [
      'Streaming vektor target & gema radar sinkron dengan posisi GPS kapal',
      'Membantu DPA & tim operasional darat memandu navigasi di selat padat atau badai',
      'Pemutaran ulang (playback) historis jejak radar untuk investigasi insiden pelayaran',
    ],
    detailedSpecs: [
      { label: 'Mode Visual', value: 'North-Up / Head-Up / Course-Up Synchronized' },
      { label: 'Konsumsi Bandwidth', value: 'Ultra-Low Delta Encoding (Mulai 14 Kbps)' },
      { label: 'Retensi Playback', value: 'Arsip Jejak Radar 90 Hari (Blackbox Cloud)' },
      { label: 'Anotasi Jarak', value: 'Electronic Bearing Line (EBL) & VRM Jarak Jauh' },
    ],
    deploymentStages: [
      'Pairing modul Radar Extractor di kapal ke server relay terenkripsi YcDev.',
      'Kalibrasi orientasi heading & skala mil laut (NM) antara konsol & web.',
      'Uji panduan navigasi langsung dengan tim DPA di kantor pelayaran.',
    ],
    protocolOrStandard: 'WebRTC / MQTT Delta Stream · ARPA Playback',
  },
  {
    id: 'automated-alert-geofencing',
    indexLabel: 'SW-03',
    category: 'software',
    categoryLabel: 'Platform Software & Cloud',
    name: 'Automated Alert & Geofencing System',
    tagline: 'Notifikasi Instan Pelanggaran Jalur, BBM & Risiko Tubrukan',
    description:
      'Sistem peringatan instan via WhatsApp, email, atau aplikasi jika kapal keluar dari jalur, memasuki area terlarang, mengalami penurunan BBM drastis, atau berisiko tabrakan.',
    imageUrl: '/src/assets/images/automated_alert_geofencing_1795196271523.jpg',
    imageAlt: 'Automated Alert and Geofencing System menampilkan zona poligon terlarang dan notifikasi WhatsApp',
    videoReelTitle: 'Deteksi Pelanggaran Geofence, Anomali BBM & Peringatan WhatsApp',
    videoDurationLabel: '00:20 · Live Loop',
    animationVariant: 'geofence-alert',
    keySpecs: [
      'Peringatan otomatis via WhatsApp, email, dan push notifikasi dalam hitungan detik',
      'Zona geofencing terlarang, deviasi koridor rute, serta alarm penurunan BBM mendadak',
      'Kalkulasi CPA/TCPA untuk deteksi dini potensi tabrakan di alur pelayaran',
    ],
    detailedSpecs: [
      { label: 'Kanal Notifikasi', value: 'WhatsApp Business API, Email SMTP, Web/Push' },
      { label: 'Aturan Geofence', value: 'Poligon Area Terlarang, Pelabuhan & Koridor Rute' },
      { label: 'Deteksi Risiko', value: 'CPA/TCPA Collision Warning + Fuel Drop > 3%/15m' },
      { label: 'Latensi Eskalasi', value: '< 5 Detik dari Pemicu Edge ke Penerima' },
    ],
    deploymentStages: [
      'Penggambaran batas poligon zona tambat, alur aman, dan area terlarang.',
      'Penetapan ambang batas anomali BBM, kecepatan, serta nomor penerima WhatsApp.',
      'Pengujian pemicu alarm end-to-end hingga status eskalasi terverifikasi.',
    ],
    protocolOrStandard: 'WhatsApp API · Webhook · CPA/TCPA Geofence Engine',
  },
  {
    id: 'api-regulatory-integration',
    indexLabel: 'SW-04',
    category: 'software',
    categoryLabel: 'Platform Software & Cloud',
    name: 'API & Regulatory Integration',
    tagline: 'Jembatan Data Otomatis ke VMS KKP & ERP Pelayaran',
    description:
      'Jalur integrasi data otomatis ke sistem pelaporan pemerintah (seperti VMS KKP atau sistem monitoring kenavigasian) maupun sistem ERP internal perusahaan pelayaran.',
    imageUrl: '/src/assets/images/api_regulatory_vms_1795196271534.jpg',
    imageAlt: 'API and Regulatory Integration infrastruktur cloud yang menyinkronkan laporan VMS KKP dan ERP pelayaran',
    videoReelTitle: 'Alur Sinkronisasi Terenkripsi mTLS ke VMS KKP & ERP Internal',
    videoDurationLabel: '00:24 · Live Loop',
    animationVariant: 'api-sync',
    keySpecs: [
      'Kepatuhan pelaporan otomatis ke VMS KKP dan sistem monitoring kenavigasian',
      'REST & Webhook API terdokumentasi untuk sinkronisasi logistik & bunker ke ERP',
      'Enkripsi mTLS antar-server dan jejak audit pengiriman data yang tidak dapat diubah',
    ],
    detailedSpecs: [
      { label: 'Kepatuhan Regulasi', value: 'VMS KKP, Kenavigasian & Audit Log Pemerintah' },
      { label: 'Antarmuka ERP', value: 'REST OpenAPI 3.1, GraphQL & Signed Webhooks' },
      { label: 'Keamanan Transmisi', value: 'Mutual TLS 1.3 + OAuth2 Client Credentials' },
      { label: 'Jaminan Pengiriman', value: 'Dead-Letter Retry Queue & Delivery Receipt' },
    ],
    deploymentStages: [
      'Pemetaan skema data posisi, jam mesin, dan bunker ke format ERP/VMS.',
      'Konfigurasi sertifikat mTLS dan sandbox uji kirim ke endpoint target.',
      'Monitoring rasio sukses pengiriman 99.98% secara otomatis di cloud.',
    ],
    protocolOrStandard: 'REST / GraphQL · VMS KKP Ready · mTLS Audit Log',
  },

  // 3. Layanan Profesional (Services)
  {
    id: 'onboard-survey-installation',
    indexLabel: 'SV-01',
    category: 'services',
    categoryLabel: 'Layanan Profesional Maritim',
    name: 'Survei & Instalasi On-Board',
    tagline: 'Pemasangan, Pengkabelan Maritim & Kalibrasi di Seluruh Indonesia',
    description:
      'Jasa pemasangan perangkat keras, penarikan kabel maritim, dan kalibrasi sensor langsung di atas kapal saat sandar di pelabuhan seluruh Indonesia.',
    imageUrl: '/src/assets/images/onboard_marine_install_1795196271296.jpg',
    imageAlt: 'Tim insinyur melakukan survei, pengkabelan maritim, dan instalasi on-board di ruang kemudi kapal',
    videoReelTitle: 'Dokumentasi Lapangan Instalasi & Kalibrasi Sensor di Pelabuhan',
    videoDurationLabel: '00:27 · Live Loop',
    animationVariant: 'onboard-cabling',
    keySpecs: [
      'Survei teknis anjungan & kamar mesin sebelum fabrikasi braket dan pengkabelan',
      'Penarikan kabel marine-grade tahan api & garam mengikuti standar klasifikasi',
      'Kalibrasi tangki BBM, uji baca NMEA, dan komisioning langsung saat kapal sandar',
    ],
    detailedSpecs: [
      { label: 'Cakupan Pelabuhan', value: 'Semarang, Surabaya, Jakarta, Batam, Makassar, Balikpapan' },
      { label: 'Standar Kabel', value: 'IEC 60092 Marine Armored Flame-Retardant' },
      { label: 'Durasi Sandar', value: '1–2 Hari Kerja per Kapal (Siap Berlayar)' },
      { label: 'Serah Terima', value: 'Berita Acara Kalibrasi & Uji Telemetry Sea-Trial' },
    ],
    deploymentStages: [
      'Koordinasi jadwal sandar kapal dan izin masuk pelabuhan (port clearance).',
      'Instalasi fisik hardware, penarikan jalur kabel, dan penyegelan IP67.',
      'Kalibrasi sensor kamar mesin serta verifikasi live ke dasbor pusat.',
    ],
    protocolOrStandard: 'Seluruh Pelabuhan RI · Marine-Grade Cabling · UAT On-Board',
  },
  {
    id: 'managed-satellite-airtime',
    indexLabel: 'SV-02',
    category: 'services',
    categoryLabel: 'Layanan Profesional Maritim',
    name: 'Managed Satellite Airtime',
    tagline: 'Paket Kuota Satelit Teroptimasi untuk Telemetri IoT',
    description:
      'Layanan paket langganan kuota satelit bulanan yang sudah dioptimalkan khusus untuk data telemetri IoT sehingga biaya operasional lebih hemat dan terprediksi.',
    imageUrl: '/src/assets/images/managed_satcom_airtime_1795196271519.jpg',
    imageAlt: 'Managed Satellite Airtime meja kendali optimasi kuota satelit LEO dan L-Band armada maritim',
    videoReelTitle: 'Optimasi Payload Biner & Pemantauan Kuota Satelit Multi-Kapal',
    videoDurationLabel: '00:23 · Live Loop',
    animationVariant: 'airtime-qos',
    keySpecs: [
      'Penagihan bulanan transparan dengan optimasi payload biner telemetri IoT',
      'Pemisahan jalur bandwidth agar pembaruan sistem tidak memakan kuota radar & sensor',
      'Pengelolaan multi-operator (LEO & L-Band) dalam satu kontrak layanan terpadu',
    ],
    detailedSpecs: [
      { label: 'Efisiensi Payload', value: 'Kompresi Protobuf / Biner Hemat Hingga 72% Kuota' },
      { label: 'Manajemen QoS', value: 'Prioritas Ketat Telemetri & Alert vs Traffic Non-Kritis' },
      { label: 'Skema Tagihan', value: 'Langganan Bulanan Flat / Pooled Armada' },
      { label: 'Portal Kuota', value: 'Pemakaian Real-Time per Kapal & Peringatan Batas' },
    ],
    deploymentStages: [
      'Perhitungan profil bandwidth harian berdasarkan jumlah sensor & radar kapal.',
      'Aktivasi SIM seluler M2M & akun satelit LEO/L-Band dalam satu billing.',
      'Pemantauan konsumsi kuota harian otomatis agar bebas biaya tak terduga.',
    ],
    protocolOrStandard: 'LEO & L-Band Airtime · Payload Shaping · Fixed Monthly SLA',
  },
  {
    id: 'maintenance-247-noc',
    indexLabel: 'SV-03',
    category: 'services',
    categoryLabel: 'Layanan Profesional Maritim',
    name: 'Maintenance & 24/7 NOC Support',
    tagline: 'Pemeliharaan Berkala & Dukungan Teknis Laut Lepas 24 Jam',
    description:
      'Layanan pemeliharaan berkala (preventive maintenance) serta dukungan teknis Network Operations Center (NOC) 24 jam jika terjadi gangguan sinyal atau perangkat di tengah laut.',
    imageUrl: '/src/assets/images/maintenance_noc_support_1795196271728.jpg',
    imageAlt: 'Maintenance and 24/7 NOC Support ruang kendali jaringan maritim memantau kesehatan sistem kapal',
    videoReelTitle: 'Operasional NOC 24/7, Diagnostik Jarak Jauh & Recovery OTA',
    videoDurationLabel: '00:26 · Live Loop',
    animationVariant: 'noc-telemetry',
    keySpecs: [
      'Pemantauan kesehatan perangkat & tautan satelit 24/7 dari ruang NOC Semarang',
      'Diagnostik jarak jauh & pembaruan firmware OTA untuk pemulihan cepat di tengah laut',
      'Jadwal preventive maintenance berkala dan penggantian modul cadangan di pelabuhan',
    ],
    detailedSpecs: [
      { label: 'Ketersediaan NOC', value: '24 Jam / 7 Hari Non-Stop (Semarang Barat HQ)' },
      { label: 'Respon Insiden', value: '< 15 Menit Triage Jarak Jauh via SSH/WireGuard' },
      { label: 'Kunjungan Berkala', value: 'Preventive Maintenance Setiap 6 Bulan di Pelabuhan' },
      { label: 'Garansi Modul', value: 'Swap-Unit Cadangan Cepat Saat Kapal Sandar' },
    ],
    deploymentStages: [
      'Pemasangan agen heartbeat & watchdog otomatis di setiap Edge Box kapal.',
      'Aktivasi jalur eskalasi NOC langsung ke superintendent armada klien.',
      'Laporan kesehatan armada bulanan & inspeksi fisik terjadwal di pelabuhan.',
    ],
    protocolOrStandard: '24/7 NOC Semarang · Remote OTA Recovery · Preventive SLA',
  },
  {
    id: 'custom-maritime-iot-dev',
    indexLabel: 'SV-04',
    category: 'services',
    categoryLabel: 'Layanan Profesional Maritim',
    name: 'Custom Maritime IoT Development',
    tagline: 'Rekayasa Kustom untuk Kapal Keruk, Offshore Rig & Patroli',
    description:
      'Jasa pengembangan sistem pemantauan khusus sesuai kebutuhan spesifik klien (misalnya untuk kapal keruk, offshore rig, atau kapal patroli).',
    imageUrl: '/src/assets/images/custom_maritime_dev_1795196271515.jpg',
    imageAlt: 'Custom Maritime IoT Development pada kapal keruk dan anjungan lepas pantai offshore rig',
    videoReelTitle: 'Operasi Telemetri Kustom Kapal Keruk, Offshore Rig & Patroli',
    videoDurationLabel: '00:29 · Live Loop',
    animationVariant: 'dredger-rig',
    keySpecs: [
      'Integrasi sensor kedalaman hisap & produksi volume lumpur pada kapal keruk (dredger)',
      'Telemetri stabilitas struktur, keselamatan gas, dan crane untuk offshore rig',
      'Sistem komando misi taktis terenkripsi untuk armada kapal patroli & pengawasan',
    ],
    detailedSpecs: [
      { label: 'Kapal Keruk', value: 'Suction Depth, Slurry Density & Cubic Meter Yield' },
      { label: 'Offshore Rig', value: 'Gas H2S/LEL, Winch Tension & Crane Load Moment' },
      { label: 'Kapal Patroli', value: 'Encrypted Tactical Tracking & Thermal Camera Sync' },
      { label: 'Siklus R&D', value: 'Desain PCB Kustom, Firmware & Cloud Khusus Klien' },
    ],
    deploymentStages: [
      'Workshop perancangan teknis langsung bersama Principal Architect Yuan Nugroho.',
      'Prototipe perangkat keras & firmware khusus diikuti uji ketahanan laboratorium.',
      'Implementasi penuh di atas armada khusus & serah terima hak operasional penuh.',
    ],
    protocolOrStandard: 'Kapal Keruk · Offshore Rig · Kapal Patroli · Full R&D',
  },
];

export function filterMaritimeSolutions(
  items: MaritimeSolutionItem[],
  filter: MaritimeCategoryFilter
): MaritimeSolutionItem[] {
  if (filter === 'all') {
    return items;
  }
  return items.filter((item) => item.category === filter);
}

export function formatMaritimeInquiryScope(item: MaritimeSolutionItem): string {
  return `${item.categoryLabel}: ${item.name} (${item.protocolOrStandard})`;
}
