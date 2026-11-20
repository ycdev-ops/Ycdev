import { MARITIME_SOLUTIONS, type MaritimeSolutionItem } from './maritimeCatalog';

export interface AssistantMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
  matchedProduct?: MaritimeSolutionItem;
  suggestions?: string[];
}

export interface AssistantReplyPayload {
  text: string;
  matchedProduct?: MaritimeSolutionItem;
  suggestions: string[];
}

export const QUICK_CHAT_PROMPTS = [
  'Detail Marine IoT Gateway IP67',
  'Cara kerja Hybrid Satellite & 5G',
  'Info Remote Radar Mirroring',
  'Lokasi studio & kontak Yuan Nugroho',
] as const;

export function generateAssistantResponse(userQuery: string): AssistantReplyPayload {
  const q = userQuery.toLowerCase().trim();

  if (!q) {
    return {
      text: 'Halo! Saya Asisten Virtual YcDev. Silakan tanyakan spesifikasi perangkat keras maritim IP67, platform Fleet Command, layanan instalasi on-board, atau estimasi proyek IoT & Keamanan Siber.',
      suggestions: [...QUICK_CHAT_PROMPTS],
    };
  }

  // Certifications & autodidact profile queries
  if (
    q.includes('sertifikat') ||
    q.includes('sertifikasi') ||
    q.includes('keahlian') ||
    q.includes('autodidak') ||
    q.includes('otodidak') ||
    q.includes('kompetensi')
  ) {
    return {
      text: 'Yuan Nugroho adalah insinyur autodidak dengan rekam jejak lebih dari 10 tahun dan 10 sertifikasi standar kompetensi lintas disiplin: Cybersecurity (OSCP Track, CKS Zero-Trust), IoT & Embedded Firmware (ARM/ESP-IDF, LoRaWAN), Full-Stack & Cloud (AWS Solutions Architect Pro), Software Engineering (CKA Kubernetes, ISO/IEC 27001, MikroTik MTCINE), serta Maritime & Satcom (NMEA 2000 & Hybrid Starlink/Iridium).',
      suggestions: [
        'Klien Pelindo, Pemerintah & Tesla',
        'Partner teknologi dunia YcDev',
        'Lokasi studio & kontak Yuan Nugroho',
      ],
    };
  }

  // Enterprise customers / Pelindo / Pemerintah / Tesla / Global clients queries
  if (
    q.includes('pelindo') ||
    q.includes('tesla') ||
    q.includes('klien') ||
    q.includes('customer') ||
    q.includes('pengalaman kerja') ||
    q.includes('pengalaman proyek') ||
    q.includes('luar negeri') ||
    q.includes('pemerintah')
  ) {
    return {
      text: 'YcDev telah dipercaya berbagai sektor strategis, antara lain Instansi Pelindo (telemetri crane terminal & radar pelabuhan), Instansi Pemerintah RI (pelaporan VMS KKP terenkripsi & audit Zero-Trust), proyek ekosistem Tesla (akuisisi CAN-Bus & keamanan API telemetri energi), serta perusahaan maritim di Jepang, Singapura, dan Rotterdam.',
      suggestions: [
        'Sertifikat keahlian Yuan Nugroho',
        'Partner teknologi dunia YcDev',
        'Detail Marine IoT Gateway IP67',
      ],
    };
  }

  // Global partners queries
  if (q.includes('partner') || q.includes('mitra') || q.includes('starlink') && q.includes('nvidia')) {
    return {
      text: 'Ekosistem partner teknologi global YcDev mencakup Starlink Maritime / SpaceX LEO, MikroTik Enterprise Routing, NVIDIA Jetson Edge AI, Amazon Web Services (AWS), Cloudflare Zero-Trust, Iridium & Inmarsat Satcom, Espressif & STMicroelectronics, serta HashiCorp & Linux Foundation.',
      suggestions: [
        'Klien Pelindo, Pemerintah & Tesla',
        'Sertifikat keahlian Yuan Nugroho',
        'Cara kerja Hybrid Satellite & 5G',
      ],
    };
  }

  // Contact / location / founder queries
  if (
    q.includes('alamat') ||
    q.includes('lokasi') ||
    q.includes('semarang') ||
    q.includes('puri eksekutif') ||
    q.includes('yuan') ||
    q.includes('pendiri') ||
    q.includes('telepon') ||
    q.includes('telfon') ||
    q.includes('whatsapp') ||
    /\bwa\b/.test(q) ||
    q.includes('kontak') ||
    q.includes('hubungi')
  ) {
    return {
      text: 'Studio YcDev dipimpin langsung oleh pendiri Yuan Nugroho (arsitek sistem autodidak 10+ tahun) dan berlokasi di Jalan Puri Eksekutif A1, Tawangsari, Semarang Barat, Kota Semarang (koordinat -6.9653, 110.3864 · Plus Code 29PM+7W7). Anda dapat menghubungi langsung telepon/WhatsApp di 081238668332 (Senin–Jumat, 09.00–18.00 WIB) atau menjadwalkan survei on-board untuk seluruh pelabuhan di Indonesia.',
      suggestions: [
        'Sertifikat keahlian Yuan Nugroho',
        'Klien Pelindo, Pemerintah & Tesla',
        'Detail Marine IoT Gateway IP67',
      ],
    };
  }

  // Exact or keyword match against all 12 Maritime products
  const productMatchRules: { id: string; keywords: string[]; reply: string }[] = [
    {
      id: 'marine-iot-gateway',
      keywords: ['gateway', 'edge box', 'nmea', 'ip67'],
      reply:
        'YcDev Marine IoT Gateway (Edge Box) adalah unit pemroses tahan air dan garam berstandar IP67 untuk ruang kemudi kapal. Perangkat ini membaca protokol NMEA 0183/2000 dari radar, GPS, dan sensor mesin, lengkap dengan buffer SQLite luring agar data aman saat melewati blank spot.',
    },
    {
      id: 'radar-arpa-extractor',
      keywords: ['extractor', 'x-band', 's-band', 'arpa'],
      reply:
        'Radar Video & ARPA Extractor Module menangkap tampilan layar radar X-Band atau S-Band kapal dengan isolasi optik penuh dan memadatkannya menjadi aliran data ringan (mulai 12–28 Kbps) agar efisien dikirim lewat satelit.',
    },
    {
      id: 'hybrid-satcom-terminal',
      keywords: ['hybrid', 'satcom', 'starlink', 'iridium', 'inmarsat', '4g', '5g', 'satelit'],
      reply:
        'Hybrid Satellite & Cellular Terminal beralih otomatis (< 800 ms) antara jaringan 4G/5G MIMO saat berada di pesisir dan jaringan satelit LEO (Starlink Maritime) atau L-Band (Iridium/Inmarsat) ketika kapal berlayar di laut lepas.',
    },
    {
      id: 'smart-fuel-engine-sensor',
      keywords: ['bbm', 'fuel', 'tangki', 'flow', 'rpm', 'pencurian', 'mesin'],
      reply:
        'Smart Fuel & Engine Telemetry Sensor memantau volume tangki BBM (flow meter / ultrasonik dengan kompensasi ombak IMU), RPM mesin induk/genset, dan suhu kamar mesin secara real-time untuk mencegah penyusutan atau pencurian bahan bakar.',
    },
    {
      id: 'fleet-command-dashboard',
      keywords: ['dashboard', 'enc', 'peta laut', 'haluan', 'fleet command'],
      reply:
        'YcDev Fleet Command Dashboard (Web & Mobile) menyajikan peta laut digital ENC (Electronic Navigational Charts) beserta posisi armada, haluan, kecepatan, serta lapisan cuaca maritim secara langsung lintas web dan perangkat seluler.',
    },
    {
      id: 'remote-radar-mirroring',
      keywords: ['mirroring', 'remote radar', 'radar jarak jauh'],
      reply:
        'Remote Radar Mirroring memungkinkan tim darat dan DPA memantau tangkapan objek radar kapal secara langsung dari pusat kendali untuk membantu navigasi aman di jalur padat atau cuaca buruk, lengkap dengan arsip playback 90 hari.',
    },
    {
      id: 'automated-alert-geofencing',
      keywords: ['geofencing', 'geofence', 'alert', 'peringatan', 'tabrakan', 'terlarang'],
      reply:
        'Automated Alert & Geofencing System mengirim peringatan instan via WhatsApp, email, maupun aplikasi dalam < 5 detik jika kapal keluar koridor rute, memasuki area terlarang, mengalami penurunan BBM mendadak, atau berisiko tabrakan (CPA/TCPA).',
    },
    {
      id: 'api-regulatory-integration',
      keywords: ['api', 'vms', 'kkp', 'erp', 'regulasi', 'pemerintah'],
      reply:
        'API & Regulatory Integration menghubungkan data telemetri armada secara otomatis ke sistem pelaporan pemerintah (seperti VMS KKP dan monitoring kenavigasian) maupun sistem ERP internal perusahaan pelayaran melalui jalur terenkripsi mTLS.',
    },
    {
      id: 'onboard-survey-installation',
      keywords: ['survei', 'instalasi', 'on-board', 'pasang', 'kabel', 'kalibrasi', 'pelabuhan'],
      reply:
        'Tim insinyur YcDev melayani Survei & Instalasi On-Board langsung di atas kapal saat sandar di pelabuhan seluruh Indonesia—mulai dari survei anjungan, penarikan kabel marine-grade tahan garam, hingga kalibrasi sensor tangki BBM.',
    },
    {
      id: 'managed-satellite-airtime',
      keywords: ['airtime', 'kuota', 'langganan', 'bulanan', 'bandwidth'],
      reply:
        'Managed Satellite Airtime menyediakan paket kuota satelit bulanan yang dikhususkan untuk telemetri IoT dengan optimasi payload biner, sehingga biaya konektivitas laut lepas lebih hemat hingga 72% dan terprediksi.',
    },
    {
      id: 'maintenance-247-noc',
      keywords: ['noc', 'maintenance', 'pemeliharaan', 'gangguan', '24/7', '24 jam'],
      reply:
        'Layanan Maintenance & 24/7 NOC Support memantau kesehatan seluruh node kapal selama 24 jam penuh dari NOC Semarang, termasuk diagnostik jarak jauh, recovery firmware OTA di tengah laut, serta pemeliharaan berkala di pelabuhan.',
    },
    {
      id: 'custom-maritime-iot-dev',
      keywords: ['custom', 'kustom', 'keruk', 'offshore', 'rig', 'patroli'],
      reply:
        'Custom Maritime IoT Development dirancang khusus untuk kebutuhan kapal non-standar seperti sensor kedalaman & kubikasi lumpur pada kapal keruk, keselamatan gas & winch offshore rig, hingga komando taktis kapal patroli.',
    },
  ];

  for (const rule of productMatchRules) {
    if (rule.keywords.some((kw) => q.includes(kw))) {
      const matched = MARITIME_SOLUTIONS.find((item) => item.id === rule.id);
      return {
        text: rule.reply,
        matchedProduct: matched,
        suggestions: [
          'Harga & estimasi pemasangan armada',
          'Lokasi studio & kontak Yuan Nugroho',
          'Layanan Survei On-Board Indonesia',
        ],
      };
    }
  }

  // Pricing / quote / cyber / fullstack
  if (
    q.includes('harga') ||
    q.includes('biaya') ||
    q.includes('estimasi') ||
    q.includes('paket') ||
    q.includes('penawaran')
  ) {
    return {
      text: 'Estimasi investasi proyek YcDev menyesuaikan jumlah kapal/node dan disiplin yang dipilih (IoT, Full-Stack, Cybersecurity, atau Software Engineering). Anda dapat menggunakan Kalkulator Estimasi di halaman ini atau langsung konsultasi gratis dengan Yuan Nugroho di 081238668332.',
      suggestions: [
        'Detail Marine IoT Gateway IP67',
        'Layanan Managed Satellite Airtime',
        'Lokasi studio & kontak Yuan Nugroho',
      ],
    };
  }

  return {
    text: 'Terima kasih telah menghubungi Asisten Virtual YcDev! Kami siap membantu solusi Maritime IoT (Gateway IP67, Radar Extractor, Hybrid Starlink/Iridium, Sensor BBM), Fleet Command Dashboard, VMS KKP, hingga Audit Keamanan Siber. Pilih topik di bawah atau hubungi langsung 081238668332.',
    suggestions: [...QUICK_CHAT_PROMPTS],
  };
}
