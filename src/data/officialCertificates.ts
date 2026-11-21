import type { OfficialCertificate } from '../components/ProtectedCertificateViewer';

/**
 * Dokumen sertifikat resmi milik YcDev. Berkas disimpan di `public/sertifikat/`
 * dan ditampilkan lewat ProtectedCertificateViewer (kanvas + watermark +
 * klik kanan dinonaktifkan).
 *
 * Catatan kejujuran: untuk dokumen yang tidak mencantumkan nomor kredensial
 * maupun saluran verifikasi, `note` menjelaskannya — supaya pengunjung tidak
 * menganggap setiap dokumen setara kredibilitasnya.
 */
export const OFFICIAL_CERTIFICATES: OfficialCertificate[] = [
  {
    id: 'cks',
    title: 'Certified Kubernetes Security Specialist',
    issuer: 'The Cloud Native Computing Foundation (CNCF)',
    issuerShort: 'CNCF',
    issuedDate: '20 Maret 2025',
    imageFile: '/sertifikat/cks.jpg',
  },
  {
    id: 'aws-sap',
    title: 'AWS Certified Solutions Architect — Professional',
    issuer: 'Amazon Web Services (AWS)',
    issuerShort: 'AWS',
    issuedDate: '7 Oktober 2020',
    validUntil: '7 Oktober 2023',
    imageFile: '/sertifikat/aws-sap.jpg',
  },
  {
    id: 'nmea-0400',
    title: 'Advanced NMEA 2000 Installer — NMEA 0400 Installation Standard',
    issuer: 'National Marine Electronics Association (NMEA)',
    issuerShort: 'NMEA',
    issuedDate: '13 Maret 2025',
    validUntil: '31 Maret 2029',
    credentialCode: 'NMEA 5813',
    imageFile: '/sertifikat/nmea-0400.jpg',
  },
  {
    id: 'codesignal-react',
    title: 'Front-End Engineering with React',
    issuer: 'CodeSignal — Certificate of Achievement',
    issuerShort: 'CodeSignal',
    issuedDate: '27 April 2025',
    imageFile: '/sertifikat/codesignal-react.jpg',
    note:
      'Sertifikat penyelesaian jalur belajar (learning path), bukan sertifikasi profesional berstandar industri. Keaslian dapat diverifikasi melalui tautan di dokumen.',
  },
  {
    id: 'ckl',
    title: 'Certified Kubernetes Leader™ (CKL™)',
    issuer: 'Chartered Institute of Professional Certifications',
    issuerShort: 'CIPC',
    imageFile: '/sertifikat/ckl.jpg',
    note:
      'Dokumen ini tidak mencantumkan tanggal terbit, nomor kredensial, maupun saluran verifikasi. Gelar CKL™ bukan bagian dari jalur sertifikasi Kubernetes CNCF/Linux Foundation (CKA/CKAD/CKS).',
  },
];

export const CERTIFICATE_WATERMARK = 'YcDev · Dokumen Resmi';
