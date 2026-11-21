import { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  FolderKanban,
  Lock,
  RotateCcw,
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
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Ruang Kerja Klien Korporat Terintegrasi
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
              Portal Klien: Status Pengembangan, Milestone & Brankas Dokumen
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            Setiap mitra YcDev memperoleh dasbor transparan untuk memantau progres sprint,
            verifikasi milestone lapangan, serta mengunduh dokumentasi PDF resmi berlogo dan watermark YcDev.
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
                  <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
                    {visibleMilestones.map((milestone) => (
                      <li
                        key={milestone.id}
                        className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-start"
                      >
                        <div className="max-w-2xl">
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-400">
                            <span className="font-mono font-semibold text-sky-400 tabular-nums">
                              {milestone.phaseLabel}
                            </span>
                            <span aria-hidden="true">·</span>
                            {renderMilestoneStatusLabel(milestone.status)}
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-300">{milestone.deliverableTag}</span>
                          </div>
                          <p className="mt-1.5 font-display text-sm font-bold text-white">
                            {milestone.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-ink-400">
                            {milestone.summary}
                          </p>
                        </div>

                        <div className="shrink-0 text-left sm:text-right">
                          <p className="font-mono text-xs font-semibold text-slate-200 tabular-nums">
                            {milestone.targetDate}
                          </p>
                          <p className="mt-0.5 text-[11px] text-ink-400">
                            PIC: {milestone.leadEngineer}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {/* Project Documentation Vault */}
              <div className="mt-10 border-t border-white/10 pt-8">
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="font-display text-base font-bold text-white">
                      Brankas Dokumentasi & Artefak Proyek
                    </h4>
                    <p className="mt-0.5 text-xs text-ink-400">
                      Pratinjau isi spesifikasi teknis atau unduh dokumen PDF resmi berlogo dan watermark YcDev.
                    </p>
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
                            Dokumen & Kode
                          </th>
                          <th scope="col" className="px-4 py-3 font-medium">
                            Kategori
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
                          return (
                            <tr
                              key={doc.id}
                              className={`transition-colors ${
                                isPreviewed ? 'bg-sky-500/10' : 'hover:bg-white/[0.03]'
                              }`}
                            >
                              <td className="px-4 py-3.5">
                                <div className="flex items-start gap-2.5">
                                  <FileText
                                    className="mt-0.5 h-4 w-4 shrink-0 text-sky-400"
                                    aria-hidden="true"
                                  />
                                  <div>
                                    <p className="font-medium text-white">{doc.title}</p>
                                    <p className="mt-0.5 font-mono text-[11px] text-ink-400 tabular-nums">
                                      {doc.code} · Diperbarui {doc.updatedAt}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap">
                                {doc.categoryLabel}
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

                {/* Document Inline Content Preview */}
                {activePreviewDoc && (
                  <div
                    data-testid="portal-doc-preview"
                    className="mt-4 rounded-xl border border-sky-400/25 bg-[#080C13] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div>
                        <p className="font-mono text-[11px] text-sky-400 tabular-nums">
                          {activePreviewDoc.code} · {activePreviewDoc.version} · SHA-256:{' '}
                          {activePreviewDoc.sha256Short}
                        </p>
                        <p className="mt-0.5 font-display text-sm font-bold text-white">
                          Pratinjau: {activePreviewDoc.title}
                        </p>
                      </div>
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
                    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">
                      {activePreviewDoc.contentBody}
                    </pre>
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
