import type { OfficialCertificate } from '../components/ProtectedCertificateViewer';

/**
 * Dokumen sertifikat resmi milik YcDev.
 *
 * SUMBER TUNGGAL: `src/assets/images/`. Lima berkas di folder itulah satu-satunya
 * dokumen yang diakui situs ini; `CERTIFICATE_SOURCE_FILES` menegaskan daftar itu
 * dan dipakai sebagai daftar putih section.
 *
 * `sourceFile` menyimpan path asli (dengan spasi & huruf persis),
 * `imageFile` menunjuk PNG asli yang dipublikasikan di `public/dokumen-asli/`
 * dengan nama web-safe.
 */
export const OFFICIAL_CERTIFICATES: OfficialCertificate[] = [
  {
    id: 'cks',
    title: 'Certified Kubernetes Security Specialist',
    issuer: 'The Cloud Native Computing Foundation (CNCF)',
    issuerShort: 'CNCF',
    issuedDate: '20 Maret 2025',
    sourceFile: 'src/assets/images/Certified Kubernetes Security Specialist.png',
    imageFile: '/dokumen-asli/certified-kubernetes-security-specialist-cks.png',
  },
  {
    id: 'aws-sap',
    title: 'AWS Certified Solutions Architect — Professional',
    issuer: 'Amazon Web Services (AWS)',
    issuerShort: 'AWS',
    issuedDate: '7 Oktober 2020',
    validUntil: '7 Oktober 2023',
    sourceFile:
      'src/assets/images/AWS Certified Solutions Architect - Professional.png',
    imageFile: '/dokumen-asli/aws-solutions-architect-professional.png',
  },
  {
    id: 'nmea-0400',
    title: 'Advanced NMEA 2000 Installer — NMEA 0400 Installation Standard',
    issuer: 'National Marine Electronics Association (NMEA)',
    issuerShort: 'NMEA',
    issuedDate: '13 Maret 2025',
    validUntil: '31 Maret 2029',
    credentialCode: 'NMEA 5813',
    sourceFile: 'src/assets/images/NMEA 0400 Installation Standard.png',
    imageFile: '/dokumen-asli/nmea-0400-installation-standard.png',
  },
  {
    id: 'codesignal-react',
    title: 'Front-End Engineering with React',
    issuer: 'CodeSignal — Certificate of Achievement',
    issuerShort: 'CodeSignal',
    issuedDate: '27 April 2025',
    sourceFile: 'src/assets/images/Front-End Engineering with React.png',
    imageFile: '/dokumen-asli/codesignal-frontend-engineering-react.png',
  },
  {
    id: 'ckl',
    title: 'Certified Kubernetes Leader™ (CKL™)',
    issuer: 'Chartered Institute of Professional Certifications',
    issuerShort: 'CIPC',
    sourceFile: 'src/assets/images/Certified Kubernetes LeaderTM_CKLTM.png',
    imageFile: '/dokumen-asli/certified-kubernetes-leader-ckl.png',
  },
];

export const CERTIFICATE_WATERMARK = 'YcDev · Dokumen Resmi';

/**
 * Berkas-berkas di `src/assets/images/` yang merupakan dokumen sertifikat.
 * Dipakai sebagai daftar putih — hanya yang terdaftar di sini yang tampil.
 */
export const CERTIFICATE_SOURCE_FILES = OFFICIAL_CERTIFICATES.map((c) => c.sourceFile);
