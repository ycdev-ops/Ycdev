import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileBadge,
  FolderKanban,
  Landmark,
  Lock,
  RotateCcw,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  CLIENT_PORTAL_PROJECTS,
  buildDownloadFilename,
  countCompletedMilestones,
  filterProjectDocuments,
  filterProjectMilestones,
  milestoneDeedNumber,
  milestoneSignedAt,
  milestoneDeedTitle,
  type DocumentCategory,
  type MilestoneFilter,
  type MilestoneStatus,
  type ProjectDocument,
  type ProjectPhaseStatus,
} from '../utils/clientPortal';
import {
  downloadClientDocumentPdf,
  downloadClientSummaryPdf,
} from '../utils/clientPdfGenerator';

interface ClientPortalSectionProps {
  onConsultProject: (scopeSummary: string) => void;
}

const MILESTONE_FILTERS: { id: MilestoneFilter; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'completed', label: 'Selesai' },
  { id: 'in_progress', label: 'Berjalan' },
  { id: 'scheduled', label: 'Terjadwal' },
];

const DOC_CATEGORIES: { id: DocumentCategory; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'architecture', label: 'Arsitektur' },
  { id: 'security', label: 'Keamanan' },
  { id: 'manual', label: 'Manual' },
];

function renderPhaseStatusIcon(status: ProjectPhaseStatus) {
  if (status === 'Pemeliharaan Aktif') {
    return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />;
  }
  if (status === 'UAT / Verifikasi') {
    return <ShieldCheck className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />;
  }
  return <Clock className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />;
}

function renderMilestoneStatusLabel(status: MilestoneStatus) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-emerald-400">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Selesai</span>
      </span>
    );
  }
  if (status === 'in_progress') {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-sky-400">
        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Sedang Berjalan</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-ink-400">
      <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Terjadwal</span>
    </span>
  );
}

/** Segel bulat bertuliskan status — penanda keabsahan pada lembar akta. */
function DeedSeal({ status }: { status: MilestoneStatus }) {
  const tone =
    status === 'completed'
      ? 'border-emerald-400/45 text-emerald-300'
      : status === 'in_progress'
        ? 'border-sky-400/45 text-sky-300'
        : 'border-white/20 text-ink-400';
  const label =
    status === 'completed' ? 'TUNTAS' : status === 'in_progress' ? 'BERJALAN' : 'TERJADWAL';
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border ${tone} bg-white/[0.02]`}
    >
      <Landmark className="h-4 w-4" aria-hidden="true" />
      <span className="mt-1 font-mono text-[7px] font-bold tracking-[0.14em]">{label}</span>
    </span>
  );
}

/** Kop lembar resmi: nama lembaga + nomor akta + garis ganda ala dokumen. */
function DeedLetterhead({
  projectCode,
  deedNumber,
}: {
  projectCode: string;
  deedNumber: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-sky-400/20 pb-3">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-sky-400/40 bg-sky-400/10">
          <ScrollText className="h-4 w-4 text-sky-300" aria-hidden="true" />
        </span>
        <div>
          <p className="font-display text-[11px] font-bold tracking-wide text-white uppercase">
            YcDev · {projectCode}
          </p>
          <p className="font-mono text-[9px] tracking-[0.16em] text-ink-400 uppercase">
            Lembar Akta Resmi Proyek
          </p>
        </div>
      </div>
      <p className="text-right font-mono text-[10px] leading-relaxed text-sky-300/90 tabular-nums">
        No. {deedNumber}
      </p>
    </div>
  );
}

export function ClientPortalSection({ onConsultProject }: ClientPortalSectionProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(CLIENT_PORTAL_PROJECTS[0].id);
  const [milestoneFilter, setMilestoneFilter] = useState<MilestoneFilter>('all');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('all');
  const [docSearch, setDocSearch] = useState('');
  const [previewDocId, setPreviewDocId] = useState<string | null>(
    CLIENT_PORTAL_PROJECTS[0].documents[0].id
  );
  const [downloadedDocIds, setDownloadedDocIds] = useState<string[]>([]);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [summaryDownloadedCode, setSummaryDownloadedCode] = useState<string | null>(null);
  const [isDownloadingSummary, setIsDownloadingSummary] = useState(false);

  const activeProject =
    CLIENT_PORTAL_PROJECTS.find((p) => p.id === selectedProjectId) ?? CLIENT_PORTAL_PROJECTS[0];

  const milestoneCounts = countCompletedMilestones(activeProject.milestones);
  const visibleMilestones = filterProjectMilestones(activeProject.milestones, milestoneFilter);
  const visibleDocuments = filterProjectDocuments(
    activeProject.documents,
    docCategory,
    docSearch
  );

  const activePreviewDoc: ProjectDocument | null =
    activeProject.documents.find((d) => d.id === previewDocId) ?? null;

  const handleSelectProject = (projectId: string) => {
    const nextProject =
      CLIENT_PORTAL_PROJECTS.find((p) => p.id === projectId) ?? CLIENT_PORTAL_PROJECTS[0];
    setSelectedProjectId(projectId);
    setMilestoneFilter('all');
    setDocCategory('all');
    setDocSearch('');
    setPreviewDocId(nextProject.documents[0]?.id ?? null);
  };

  const handleDownloadDocument = async (doc: ProjectDocument) => {
    if (downloadingDocId === doc.id) return;
    setDownloadingDocId(doc.id);
    try {
      await downloadClientDocumentPdf(activeProject, doc);
      setDownloadedDocIds((prev) => (prev.includes(doc.id) ? prev : [...prev, doc.id]));
    } finally {
      setDownloadingDocId((prev) => (prev === doc.id ? null : prev));
    }
  };

  const handleDownloadSummaryReport = async () => {
    if (isDownloadingSummary) return;
    setIsDownloadingSummary(true);
    try {
      await downloadClientSummaryPdf(activeProject);
      setSummaryDownloadedCode(activeProject.projectCode);
    } finally {
      setIsDownloadingSummary(false);
    }
  };

  const handleResetFilters = () => {
    setDocCategory('all');
    setDocSearch('');
  };

  return (
    <section
      id="portal-klien"
      className="relative z-10 border-b border-white/10 bg-[#05070A]/95 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Intro */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow-tag inline-flex items-center gap-2">
              <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
              Ruang Kerja Klien Korporat Terintegrasi
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
              Portal Klien: Status Pengembangan, Akta Milestone & Brankas Dokumen
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-400">
            Setiap mitra YcDev memperoleh dasbor transparan untuk memantau progres sprint,
            memverifikasi akta milestone lapangan, serta mengunduh dokumen PDF resmi
            berlogo dan watermark YcDev dari brankas terdaftar.
          </p>
        </div>

        {/* Workspace Console Container (Single-Elevation Dark Surface) */}
        <div
          data-testid="client-portal-workspace"
          className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1018]"
        >
          {/* Console Top Bar Contract: Breadcrumb on Left, Concise Actions on Right */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#080C13] px-5 py-4 lg:px-7">
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
              <span className="inline-flex items-center gap-1.5 font-medium text-sky-400">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Portal Klien</span>
              </span>
              <span aria-hidden="true">/</span>
              <span className="font-medium text-slate-200">{activeProject.clientName}</span>
              <span aria-hidden="true">/</span>
              <span className="font-mono text-slate-300 tabular-nums">
                {activeProject.projectCode}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                disabled={isDownloadingSummary}
                onClick={handleDownloadSummaryReport}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#0E1522] px-3.5 py-2 text-xs font-semibold text-slate-100 transition-colors hover:border-sky-400/50 hover:text-white disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <Download className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                <span>
                  {isDownloadingSummary
                    ? 'Menyiapkan PDF...'
                    : summaryDownloadedCode === activeProject.projectCode
                      ? 'Laporan PDF Diunduh'
                      : 'Unduh Ringkasan Status (PDF)'}
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onConsultProject(
                    `Permintaan sinkronisasi milestone proyek ${activeProject.projectCode} (${activeProject.clientName}) — ${activeProject.currentPhase}.`
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Diskusi Perubahan Ruang Lingkup</span>
              </button>
            </div>
          </div>

          {/* 2-Column Workspace Layout: Left Sidebar Selector + Right Main Viewport */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Workspace Project List (~260-280px visual weight) */}
            <aside
              aria-label="Daftar proyek klien aktif"
              className="border-b border-white/10 bg-[#080C13]/60 p-5 lg:col-span-4 lg:border-r lg:border-b-0 xl:col-span-3"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-white">
                  <FolderKanban className="h-4 w-4 text-sky-400" aria-hidden="true" />
                  <span>Daftar Klien Aktif</span>
                </span>
                <span className="font-mono text-xs text-ink-400 tabular-nums">
                  {CLIENT_PORTAL_PROJECTS.length} Proyek
                </span>
              </div>

              <div role="list" className="mt-4 space-y-2">
                {CLIENT_PORTAL_PROJECTS.map((project) => {
                  const isActive = project.id === activeProject.id;
                  return (
                    <button
                      key={project.id}
                      type="button"
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => handleSelectProject(project.id)}
                      className={`w-full rounded-xl border p-3.5 text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        isActive
                          ? 'border-sky-400/50 bg-[#101A2C]'
                          : 'border-white/10 bg-transparent hover:border-white/20 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="font-mono text-ink-400 tabular-nums">
                          {project.projectCode}
                        </span>
                        <span className="font-mono font-semibold text-sky-400 tabular-nums">
                          {project.progressPct}%
                        </span>
                      </div>
                      <p className="mt-1 font-display text-sm font-bold text-white">
                        {project.clientName}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-400">{project.clientSector}</p>
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-200">
                        {renderPhaseStatusIcon(project.status)}
                        <span>{project.status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 text-xs text-ink-400">
                <p className="font-medium text-slate-200">Akses Portal Produksi</p>
                <p className="mt-1 leading-relaxed">
                  Klien aktif login menggunakan otentikasi mTLS atau SSO instansi untuk akses log
                  real-time dan repositori rilis.
                </p>
              </div>
            </aside>

            {/* Right Main Viewport */}
            <div className="p-5 sm:p-7 lg:col-span-8 xl:col-span-9">
              {/* Project Header & Live Progress Track */}
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-200">
                    {renderPhaseStatusIcon(activeProject.status)}
                    <span>{activeProject.status}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{activeProject.environmentUrl}</span>
                  <span aria-hidden="true">·</span>
                  <span>Diperbarui {activeProject.lastUpdated}</span>
                </div>

                <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-white text-balance sm:text-2xl">
                  {activeProject.projectTitle}
                </h3>

                {/* Progress Bar */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{activeProject.currentPhase}</span>
                    <span
                      data-testid="portal-progress-pct"
                      className="font-mono font-bold text-sky-400 tabular-nums"
                    >
                      {activeProject.progressPct}% Selesai
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label="Progres pengembangan proyek"
                    aria-valuenow={activeProject.progressPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${activeProject.progressPct}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {activeProject.recentUpdateNote}
                  </p>
                </div>

                {/* Clean 4-Metric Hairline Strip (No Nested Card Boxes) */}
                <dl className="mt-6 grid grid-cols-2 gap-5 border-y border-white/10 py-5 sm:grid-cols-4 sm:gap-6">
                  <div>
                    <dt className="text-xs text-ink-400">Milestone Tuntas</dt>
                    <dd className="mt-1 font-mono text-base font-bold text-white tabular-nums sm:text-lg">
                      {milestoneCounts.completed} / {milestoneCounts.total}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">Target Serah Terima</dt>
                    <dd className="mt-1 font-mono text-base font-bold text-white tabular-nums sm:text-lg">
                      {activeProject.targetHandover}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">Komitmen SLA</dt>
                    <dd className="mt-1 font-mono text-base font-bold text-sky-400 tabular-nums sm:text-lg">
                      {activeProject.slaTier}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">Arsitek Penanggung Jawab</dt>
                    <dd className="mt-1 font-display text-base font-bold text-white sm:text-lg">
                      {activeProject.accountLead}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Milestone Updates Section */}
              <div className="mt-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h4 className="font-display text-base font-bold text-white">
                      Pembaruan Milestone Proyek
                    </h4>
                    <p className="mt-0.5 text-xs text-ink-400">
                      Riwayat tahapan pengiriman perangkat keras, API, dan verifikasi keamanan.
                    </p>
                  </div>

                  <div
                    role="group"
                    aria-label="Filter status milestone"
                    className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#080C13] p-1"
                  >
                    {MILESTONE_FILTERS.map((filterItem) => (
                      <button
                        key={filterItem.id}
                        type="button"
                        aria-pressed={milestoneFilter === filterItem.id}
                        onClick={() => setMilestoneFilter(filterItem.id)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          milestoneFilter === filterItem.id
                            ? 'bg-[#2563EB] text-white'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {filterItem.label}
                      </button>
                    ))}
                  </div>
                </div>

                {visibleMilestones.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-white/10 bg-[#080C13]/70 p-6 text-center">
                    <p className="text-sm font-medium text-slate-200">
                      Tidak ada milestone pada status filter ini untuk proyek{' '}
                      {activeProject.projectCode}.
                    </p>
                    <button
                      type="button"
                      onClick={() => setMilestoneFilter('all')}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-sky-400 hover:bg-white/5 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Tampilkan Semua Milestone</span>
                    </button>
                  </div>
                ) : (
                  <ol className="mt-4 space-y-4">
                    {visibleMilestones.map((milestone) => {
                      const deedNumber = milestoneDeedNumber(
                        activeProject.projectCode,
                        milestone
                      );
                      return (
                        <li
                          key={milestone.id}
                          data-testid={`portal-milestone-${milestone.id}`}
                          className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-4 sm:p-5"
                        >
                          <DeedLetterhead
                            projectCode={activeProject.projectCode}
                            deedNumber={deedNumber}
                          />

                          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 max-w-2xl">
                              <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-sky-300/90 uppercase">
                                {milestoneDeedTitle(milestone)}
                              </p>
                              <p className="mt-1.5 text-xs leading-relaxed text-ink-400">
                                {milestone.summary}
                              </p>

                              <dl className="mt-3 grid grid-cols-1 gap-2 border-t border-white/10 pt-3 text-[11px] sm:grid-cols-2">
                                <div>
                                  <dt className="text-ink-500">Deliverable</dt>
                                  <dd className="mt-0.5 font-medium text-slate-200">
                                    {milestone.deliverableTag}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-ink-500">Penanggung Jawab</dt>
                                  <dd className="mt-0.5 font-medium text-slate-200">
                                    {milestone.leadEngineer}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-ink-500">Target</dt>
                                  <dd className="mt-0.5 font-mono text-slate-200 tabular-nums">
                                    {milestone.targetDate}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-ink-500">Ditetapkan</dt>
                                  <dd className="mt-0.5 text-slate-200">
                                    {milestoneSignedAt(milestone)}
                                  </dd>
                                </div>
                              </dl>

                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                {renderMilestoneStatusLabel(milestone.status)}
                                <span className="font-mono text-[10px] text-ink-500">
                                  · Paraf {milestone.leadEngineer.split(' ')[0]}
                                </span>
                              </div>
                            </div>

                            <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col sm:items-end">
                              <DeedSeal status={milestone.status} />
                              <p className="font-mono text-[10px] leading-relaxed text-ink-400 sm:text-right">
                                Akta {milestone.phaseLabel}
                                <br />
                                {milestone.targetDate}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>

              {/* Project Documentation Vault */}
              <div className="mt-10 border-t border-white/10 pt-8">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-sky-400/40 bg-sky-400/10">
                        <Landmark className="h-4 w-4 text-sky-300" aria-hidden="true" />
                      </span>
                      <div>
                        <h4 className="font-display text-base font-bold text-white">
                          Brankas Dokumentasi & Artefak Proyek
                        </h4>
                        <p className="mt-0.5 text-xs text-ink-400">
                          Registri resmi dokumen proyek — pratinjau isi atau unduh PDF berlogo YcDev.
                        </p>
                      </div>
                    </div>

                    {/* Strip keabsahan brankas */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-y border-white/10 py-2.5 font-mono text-[10px] tracking-[0.14em] text-ink-400 uppercase">
                      <span className="inline-flex items-center gap-1.5">
                        <Lock className="h-3 w-3 text-sky-400" aria-hidden="true" />
                        Akses Terkendali
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                        Hash Terverifikasi
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Award className="h-3 w-3 text-sky-400" aria-hidden="true" />
                        {visibleDocuments.length} Dokumen Terdaftar
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="relative sm:w-64">
                      <label htmlFor="portal-doc-search" className="sr-only">
                        Cari dokumen proyek
                      </label>
                      <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400"
                        aria-hidden="true"
                      />
                      <input
                        id="portal-doc-search"
                        type="search"
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                        placeholder="Cari judul atau kode..."
                        className="w-full rounded-lg border border-white/15 bg-[#080C13] py-2 pr-3 pl-8 text-xs text-white placeholder:text-ink-400 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div
                      role="group"
                      aria-label="Filter kategori dokumen"
                      className="flex flex-wrap items-center gap-1 self-start rounded-lg border border-white/10 bg-[#080C13] p-1 sm:flex-nowrap sm:self-auto"
                    >
                      {DOC_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          aria-pressed={docCategory === cat.id}
                          onClick={() => setDocCategory(cat.id)}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            docCategory === cat.id
                              ? 'bg-[#2563EB] text-white'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {visibleDocuments.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-white/10 bg-[#080C13]/70 p-6 text-center">
                    <p className="text-sm font-medium text-slate-200">
                      Tidak ada dokumen yang cocok dengan pencarian &ldquo;{docSearch}&rdquo;.
                    </p>
                    <p className="mt-1 text-xs text-ink-400">
                      Atur ulang filter kategori atau kata kunci untuk menampilkan dokumen proyek.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-sky-400 hover:bg-white/5 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Reset Filter</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead className="border-b border-white/10 bg-[#080C13] text-ink-400">
                        <tr>
                          <th scope="col" className="px-4 py-3 font-medium">
                            Dokumen & Nomor Registri
                          </th>
                          <th scope="col" className="px-4 py-3 font-medium">
                            Kategori
                          </th>
                          <th scope="col" className="px-4 py-3 font-medium">
                            Akses
                          </th>
                          <th scope="col" className="px-4 py-3 font-medium">
                            Versi & Format
                          </th>
                          <th scope="col" className="px-4 py-3 text-right font-medium">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {visibleDocuments.map((doc) => {
                          const isPreviewed = previewDocId === doc.id;
                          const isDownloaded = downloadedDocIds.includes(doc.id);
                          const isDownloading = downloadingDocId === doc.id;
                          const isRestricted = doc.access === 'terbatas';
                          return (
                            <tr
                              key={doc.id}
                              className={`transition-colors ${
                                isPreviewed ? 'bg-sky-500/10' : 'hover:bg-white/[0.03]'
                              }`}
                            >
                              <td className="px-4 py-3.5">
                                <div className="flex items-start gap-2.5">
                                  <FileBadge
                                    className="mt-0.5 h-4 w-4 shrink-0 text-sky-400"
                                    aria-hidden="true"
                                  />
                                  <div>
                                    <p className="font-medium text-white">{doc.title}</p>
                                    <p className="mt-0.5 font-mono text-[11px] text-sky-300/90 tabular-nums">
                                      {doc.registryNumber}
                                    </p>
                                    <p className="mt-0.5 font-mono text-[10px] text-ink-400 tabular-nums">
                                      {doc.code} · Diperbarui {doc.updatedAt}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap">
                                {doc.categoryLabel}
                              </td>
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium ${
                                    isRestricted
                                      ? 'border-amber-400/35 bg-amber-400/10 text-amber-300'
                                      : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                                  }`}
                                >
                                  <Lock className="h-3 w-3" aria-hidden="true" />
                                  {isRestricted ? 'Terbatas' : 'Publik'}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 font-mono text-slate-300 tabular-nums whitespace-nowrap">
                                {doc.version} · PDF Resmi · {doc.sizeLabel}
                              </td>
                              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                <div className="inline-flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    aria-pressed={isPreviewed}
                                    onClick={() =>
                                      setPreviewDocId((prev) => (prev === doc.id ? null : doc.id))
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white cursor-pointer"
                                  >
                                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span>{isPreviewed ? 'Tutup' : 'Pratinjau'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isDownloading}
                                    aria-label={`Unduh ${doc.title} PDF`}
                                    onClick={() => handleDownloadDocument(doc)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F7641] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#15803D] disabled:opacity-60 cursor-pointer"
                                  >
                                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span>
                                      {isDownloading
                                        ? 'Membuat PDF...'
                                        : isDownloaded
                                          ? 'PDF Tersimpan'
                                          : 'Unduh PDF'}
                                    </span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Document Inline Content Preview — lembar resmi bergaya brankas */}
                {activePreviewDoc && (
                  <div
                    data-testid="portal-doc-preview"
                    className="mt-4 overflow-hidden rounded-xl border border-sky-400/25 bg-[#080C13]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/20 bg-gradient-to-b from-white/[0.03] to-transparent px-5 py-4">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-sky-400/40 bg-sky-400/10">
                          <FileBadge className="h-4 w-4 text-sky-300" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-mono text-[10px] tracking-[0.16em] text-ink-400 uppercase">
                            Lembar Dokumen · {activePreviewDoc.registryNumber}
                          </p>
                          <p className="mt-0.5 font-display text-sm font-bold text-white">
                            {activePreviewDoc.title}
                          </p>
                          <p className="mt-0.5 font-mono text-[10px] text-sky-300/90 tabular-nums">
                            {activePreviewDoc.code} · {activePreviewDoc.version} · SHA-256:{' '}
                            {activePreviewDoc.sha256Short}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium ${
                            activePreviewDoc.access === 'terbatas'
                              ? 'border-amber-400/35 bg-amber-400/10 text-amber-300'
                              : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                          }`}
                        >
                          <Lock className="h-3 w-3" aria-hidden="true" />
                          {activePreviewDoc.access === 'terbatas' ? 'Terbatas' : 'Publik'}
                        </span>
                        <button
                          type="button"
                          disabled={downloadingDocId === activePreviewDoc.id}
                          onClick={() => handleDownloadDocument(activePreviewDoc)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-[#0F7641] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#15803D] disabled:opacity-60 cursor-pointer whitespace-nowrap"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {downloadingDocId === activePreviewDoc.id
                              ? 'Menyiapkan PDF...'
                              : `Unduh ${buildDownloadFilename(activePreviewDoc)}`}
                          </span>
                        </button>
                      </div>
                    </div>

                    <pre className="max-h-[26rem] overflow-auto px-5 py-4 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                      {activePreviewDoc.contentBody}
                    </pre>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-3">
                      <p className="text-[11px] text-ink-400">
                        Ditandatangani oleh{' '}
                        <span className="font-medium text-slate-200">
                          {activePreviewDoc.signatory ?? 'Yuan Nugroho · Principal Systems Architect'}
                        </span>
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.14em] text-ink-500 uppercase">
                        YcDev · Semarang Barat
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
