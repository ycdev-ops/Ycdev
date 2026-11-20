import { jsPDF } from 'jspdf';
import {
  buildDownloadFilename,
  buildSummaryPdfFilename,
  countCompletedMilestones,
  type ClientPortalProject,
  type ProjectDocument,
} from './clientPortal';
import type { CertificationItem } from './credentialsCatalog';

export const YCDEV_OFFICIAL_LOGO_URL =
  '/assets/aistudio/SmartSelect_20261115_111928_Gallery_7ef9e0a2.png';

export const YCDEV_STUDIO_PDF_FOOTER =
  'YcDev · Jalan Puri Eksekutif A1, Semarang Barat · Telp/WA: 081238668332 · Principal Architect: Yuan Nugroho';

export interface ClientPdfPayload {
  filename: string;
  documentKind: 'DOKUMEN TEKNIS PROYEK' | 'LAPORAN STATUS PROYEK' | 'SERTIFIKAT KEAHLIAN';
  title: string;
  subtitle: string;
  metadataRows: { label: string; value: string }[];
  sections: { heading: string; lines: string[] }[];
  verificationCode: string;
}

export function buildClientDocumentPdfPayload(
  project: ClientPortalProject,
  doc: ProjectDocument
): ClientPdfPayload {
  return {
    filename: buildDownloadFilename(doc),
    documentKind: 'DOKUMEN TEKNIS PROYEK',
    title: doc.title,
    subtitle: `${project.clientName} · ${project.projectTitle}`,
    metadataRows: [
      { label: 'Kode Dokumen', value: `${doc.code} (${doc.version})` },
      { label: 'Kode Proyek', value: project.projectCode },
      { label: 'Klien / Instansi', value: project.clientName },
      { label: 'Kategori Artefak', value: doc.categoryLabel },
      { label: 'Tanggal Pembaruan', value: doc.updatedAt },
      { label: 'SHA-256 Digest', value: doc.sha256Short },
      { label: 'Arsitek Utama', value: `${project.accountLead} (YcDev Semarang Barat)` },
      { label: 'Komitmen SLA', value: project.slaTier },
    ],
    sections: [
      {
        heading: 'Ringkasan Eksekutif & Status Proyek',
        lines: [
          `Status Fase: ${project.status} (${project.progressPct}% selesai)`,
          `Tahapan Aktif: ${project.currentPhase}`,
          `Catatan Terkini: ${project.recentUpdateNote}`,
        ],
      },
      {
        heading: 'Isi Dokumen & Spesifikasi Teknis Terverifikasi',
        lines: doc.contentBody
          .split('\n')
          .map((line) => line.trimEnd())
          .filter((line, idx, arr) => line.length > 0 || (idx > 0 && arr[idx - 1].length > 0)),
      },
    ],
    verificationCode: `${project.projectCode} · ${doc.code} · ${doc.sha256Short}`,
  };
}

export function buildClientSummaryPdfPayload(
  project: ClientPortalProject
): ClientPdfPayload {
  const counts = countCompletedMilestones(project.milestones);

  return {
    filename: buildSummaryPdfFilename(project.projectCode),
    documentKind: 'LAPORAN STATUS PROYEK',
    title: `Laporan Resmi Progres & Milestone — ${project.clientName}`,
    subtitle: project.projectTitle,
    metadataRows: [
      { label: 'Kode Proyek', value: project.projectCode },
      { label: 'Klien / Instansi', value: project.clientName },
      { label: 'Sektor & Wilayah', value: project.clientSector },
      { label: 'Status Saat Ini', value: `${project.status} (${project.progressPct}%)` },
      { label: 'Milestone Tuntas', value: `${counts.completed} dari ${counts.total} tahap` },
      { label: 'Target Serah Terima', value: project.targetHandover },
      { label: 'Lingkungan Portal', value: project.environmentUrl },
      { label: 'Penanggung Jawab', value: `${project.accountLead} (081238668332)` },
    ],
    sections: [
      {
        heading: 'Ringkasan Rekayasa Terkini',
        lines: [
          `Fase Aktif: ${project.currentPhase}`,
          `Pembaruan Terakhir: ${project.lastUpdated}`,
          project.recentUpdateNote,
        ],
      },
      {
        heading: 'Daftar Milestone Pengembangan & Verifikasi Lapangan',
        lines: project.milestones.flatMap((m) => [
          `[${m.status.toUpperCase()}] ${m.phaseLabel} — ${m.title}`,
          `Target: ${m.targetDate} | PIC: ${m.leadEngineer} | Luaran: ${m.deliverableTag}`,
          m.summary,
          '',
        ]),
      },
      {
        heading: 'Inventaris Dokumen Resmi Terdaftar',
        lines: project.documents.map(
          (d) => `- ${d.code} (${d.version}) — ${d.title} [SHA-256: ${d.sha256Short}]`
        ),
      },
    ],
    verificationCode: `${project.projectCode} · SLA ${project.slaTier}`,
  };
}

interface LogoAssetSet {
  headerLogoDataUrl: string;
  watermarkDataUrl: string;
}

let cachedLogosPromise: Promise<LogoAssetSet | null> | null = null;

async function loadYcDevLogoAssets(): Promise<LogoAssetSet | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  if (cachedLogosPromise) {
    return cachedLogosPromise;
  }

  cachedLogosPromise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const size = 256;

        // 1. Crisp header emblem PNG
        const headerCanvas = document.createElement('canvas');
        headerCanvas.width = size;
        headerCanvas.height = size;
        const hCtx = headerCanvas.getContext('2d');
        if (!hCtx) {
          resolve(null);
          return;
        }
        hCtx.beginPath();
        hCtx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
        hCtx.closePath();
        hCtx.clip();
        hCtx.drawImage(img, 0, 0, size, size);

        // 2. Soft centered watermark PNG (8.5% alpha so body copy remains high contrast)
        const wmSize = 420;
        const wmCanvas = document.createElement('canvas');
        wmCanvas.width = wmSize;
        wmCanvas.height = wmSize;
        const wCtx = wmCanvas.getContext('2d');
        if (!wCtx) {
          resolve({
            headerLogoDataUrl: headerCanvas.toDataURL('image/png'),
            watermarkDataUrl: headerCanvas.toDataURL('image/png'),
          });
          return;
        }
        wCtx.globalAlpha = 0.085;
        wCtx.beginPath();
        wCtx.arc(wmSize / 2, wmSize / 2, wmSize / 2 - 8, 0, Math.PI * 2);
        wCtx.closePath();
        wCtx.clip();
        wCtx.drawImage(img, 0, 0, wmSize, wmSize);

        resolve({
          headerLogoDataUrl: headerCanvas.toDataURL('image/png'),
          watermarkDataUrl: wmCanvas.toDataURL('image/png'),
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = YCDEV_OFFICIAL_LOGO_URL;
  });

  return cachedLogosPromise;
}

function drawPageBranding(
  pdf: jsPDF,
  assets: LogoAssetSet | null,
  documentKind: string,
  verificationCode: string
) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Centered YcDev Logo Watermark behind all content
  if (assets?.watermarkDataUrl) {
    const wmDim = 104;
    pdf.addImage(
      assets.watermarkDataUrl,
      'PNG',
      (pageWidth - wmDim) / 2,
      (pageHeight - wmDim) / 2 + 8,
      wmDim,
      wmDim,
      undefined,
      'FAST'
    );
  }

  // Subtle vertical edge watermark stamp
  pdf.setTextColor(218, 226, 236);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text(
    `YCDEV OFFICIAL ARCHIVE · ${verificationCode}`,
    pageWidth / 2,
    pageHeight - 18,
    { align: 'center' }
  );

  // Dark Navy Corporate Header Banner
  pdf.setFillColor(11, 16, 24);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  pdf.setFillColor(14, 165, 233);
  pdf.rect(0, 30, pageWidth, 1.2, 'F');

  if (assets?.headerLogoDataUrl) {
    pdf.addImage(assets.headerLogoDataUrl, 'PNG', 14, 5, 20, 20, undefined, 'FAST');
  }

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('YcDev — IoT, Full-Stack & Cybersecurity', 38, 13.5);

  pdf.setTextColor(148, 163, 184);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.text(
    'Jalan Puri Eksekutif A1, Semarang Barat · Telp/WA: 081238668332 · Arsitek: Yuan Nugroho',
    38,
    20.5
  );

  // Classification Label on Top-Right
  pdf.setTextColor(56, 189, 248);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text(documentKind, pageWidth - 14, 14, { align: 'right' });
  pdf.setTextColor(203, 213, 225);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.text('VERIFIED CLIENT PORTAL PDF', pageWidth - 14, 20.5, { align: 'right' });
}

function finalizePageFooters(pdf: jsPDF, verificationCode: string) {
  const totalPages = pdf.getNumberOfPages();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 1; i <= totalPages; i += 1) {
    pdf.setPage(i);
    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(0.3);
    pdf.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text(YCDEV_STUDIO_PDF_FOOTER, 14, pageHeight - 8.5);
    pdf.text(
      `${verificationCode}  |  Halaman ${i} dari ${totalPages}`,
      pageWidth - 14,
      pageHeight - 8.5,
      { align: 'right' }
    );
  }
}

async function generateAndSaveBrandedPdf(payload: ClientPdfPayload): Promise<void> {
  const assets = await loadYcDevLogoAssets();
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 14;
  const maxContentWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - 25;

  drawPageBranding(pdf, assets, payload.documentKind, payload.verificationCode);

  let y = 40;

  // Document Title Block
  pdf.setTextColor(15, 23, 42);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  const titleLines = pdf.splitTextToSize(payload.title, maxContentWidth);
  pdf.text(titleLines, marginX, y);
  y += titleLines.length * 6.5 + 1.5;

  pdf.setTextColor(71, 85, 105);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  const subLines = pdf.splitTextToSize(payload.subtitle, maxContentWidth);
  pdf.text(subLines, marginX, y);
  y += subLines.length * 4.5 + 5;

  // Metadata 2-Column Grid Box
  const rowCount = Math.ceil(payload.metadataRows.length / 2);
  const boxHeight = rowCount * 11 + 6;
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.35);
  pdf.roundedRect(marginX, y, maxContentWidth, boxHeight, 2, 2, 'FD');

  const colWidth = maxContentWidth / 2;
  payload.metadataRows.forEach((row, index) => {
    const col = index % 2;
    const rowIdx = Math.floor(index / 2);
    const rx = marginX + 4 + col * colWidth;
    const ry = y + 6 + rowIdx * 11;

    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.text(row.label.toUpperCase(), rx, ry);

    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    const valClipped = pdf.splitTextToSize(row.value, colWidth - 8)[0] ?? row.value;
    pdf.text(valClipped, rx, ry + 4.2);
  });

  y += boxHeight + 8;

  // Body Sections with Automatic Multi-Page Pagination + Watermark Continuity
  for (const section of payload.sections) {
    if (y + 14 > bottomLimit) {
      pdf.addPage();
      drawPageBranding(pdf, assets, payload.documentKind, payload.verificationCode);
      y = 40;
    }

    pdf.setFillColor(241, 245, 249);
    pdf.rect(marginX, y - 4.2, maxContentWidth, 6.5, 'F');
    pdf.setTextColor(14, 116, 144);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.text(section.heading.toUpperCase(), marginX + 2.5, y);
    y += 6.5;

    pdf.setTextColor(30, 41, 59);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);

    for (const rawLine of section.lines) {
      if (!rawLine.trim()) {
        y += 3;
        continue;
      }

      const wrapped = pdf.splitTextToSize(rawLine, maxContentWidth - 2);
      for (const wLine of wrapped) {
        if (y + 5 > bottomLimit) {
          pdf.addPage();
          drawPageBranding(pdf, assets, payload.documentKind, payload.verificationCode);
          y = 40;
        }
        pdf.setTextColor(30, 41, 59);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.text(wLine, marginX + 1, y);
        y += 4.6;
      }
      y += 0.8;
    }

    y += 4;
  }

  // Official Sign-off Verification Box
  if (y + 26 > bottomLimit) {
    pdf.addPage();
    drawPageBranding(pdf, assets, payload.documentKind, payload.verificationCode);
    y = 40;
  }

  pdf.setDrawColor(14, 165, 233);
  pdf.setLineWidth(0.4);
  pdf.line(marginX, y + 2, pageWidth - marginX, y + 2);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('Otorisasi & Verifikasi Resmi YcDev', marginX, y + 8.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  pdf.text(
    'Dokumen ini diterbitkan secara resmi melalui Portal Klien YcDev dengan identitas & watermark tervalidasi.',
    marginX,
    y + 13.5
  );

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(15, 23, 42);
  pdf.text('Yuan Nugroho', pageWidth - marginX, y + 10, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Founder & Principal Systems Architect · YcDev', pageWidth - marginX, y + 14.5, {
    align: 'right',
  });

  finalizePageFooters(pdf, payload.verificationCode);
  pdf.save(payload.filename);
}

export async function downloadClientDocumentPdf(
  project: ClientPortalProject,
  doc: ProjectDocument
): Promise<string> {
  const payload = buildClientDocumentPdfPayload(project, doc);
  await generateAndSaveBrandedPdf(payload);
  return payload.filename;
}

export async function downloadClientSummaryPdf(
  project: ClientPortalProject
): Promise<string> {
  const payload = buildClientSummaryPdfPayload(project);
  await generateAndSaveBrandedPdf(payload);
  return payload.filename;
}

export async function downloadCertificationPdf(cert: CertificationItem): Promise<string> {
  const payload: ClientPdfPayload = {
    filename: `${cert.credentialCode.toLowerCase()}-sertifikat-resmi.pdf`,
    documentKind: 'SERTIFIKAT KEAHLIAN' as ClientPdfPayload['documentKind'],
    title: cert.title,
    subtitle: `Penerima Kredensial: ${cert.holderName} · Diterbitkan oleh ${cert.issuer}`,
    metadataRows: [
      { label: 'Pemegang Sertifikat', value: cert.holderName },
      { label: 'Nomor Kredensial', value: cert.credentialCode },
      { label: 'Lembaga Penerbit', value: cert.issuer },
      { label: 'Bidang Keahlian', value: cert.domainLabel },
      { label: 'Tanggal Terbit', value: cert.issuedDate },
      { label: 'Otoritas Penandatangan', value: `${cert.signatoryName} (${cert.signatoryTitle})` },
    ],
    sections: [
      {
        heading: 'Fokus Kompetensi Utama',
        lines: [cert.competencyFocus],
      },
      {
        heading: 'Cakupan Kompetensi & Audit Tervalidasi',
        lines: cert.verificationHighlights.map((item, idx) => `${idx + 1}. ${item}`),
      },
      {
        heading: 'Verifikasi Registri Kredensial',
        lines: [
          `URL Registri: ${cert.registryUrl}`,
          `Status Kredensial: AKTIF & TERVERIFIKASI (${cert.year})`,
        ],
      },
    ],
    verificationCode: `${cert.credentialCode} · ${cert.issuerShort}`,
  };

  await generateAndSaveBrandedPdf(payload);
  return payload.filename;
}
