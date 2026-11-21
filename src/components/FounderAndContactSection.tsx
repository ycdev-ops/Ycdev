import { useState, type FormEvent, type RefObject } from 'react';
import { CheckCircle2, MapPin, Phone, User, X } from 'lucide-react';
import { STUDIO_PROFILE } from '../data/ycdevData';
import {
  validateConsultationForm,
  type ConsultationFormInput,
} from '../utils/projectEstimator';
import { ResilientImage } from './ResilientImage';
import { Semarang3DMapCanvas } from './Semarang3DMapCanvas';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FounderAndContactSectionProps {
  attachedScope: string | null;
  onClearScope: () => void;
  nameInputRef: RefObject<HTMLInputElement | null>;
}

const INITIAL_FORM: ConsultationFormInput = {
  name: '',
  contact: '',
  company: '',
  message: '',
};

export function FounderAndContactSection({
  attachedScope,
  onClearScope,
  nameInputRef,
}: FounderAndContactSectionProps) {
  const [form, setForm] = useState<ConsultationFormInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ConsultationFormInput, string>>
  >({});
  const [submittedRecord, setSubmittedRecord] = useState<{
    form: ConsultationFormInput;
    scope: string | null;
    submittedAt: string;
  } | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateConsultationForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmittedRecord({
      form: { ...form },
      scope: attachedScope,
      submittedAt: new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date()),
    });
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmittedRecord(null);
  };

  return (
    <section
      id="kontak"
      className="relative z-10 scroll-mt-20 bg-[#070A0F]/95 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Puri Eksekutif Semarang Barat 3D Studio Map & Direct Contact */}
          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0E131B] p-6 sm:p-8 lg:col-span-5">
            <div>
              <p className="text-xs font-medium tracking-wide text-sky-400">
                Lokasi Studio & Koordinasi Langsung
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white lg:text-3xl">
                Laboratorium Rekayasa Jalan Puri Eksekutif A1, Semarang Barat
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Seluruh riset perangkat keras maritim, pengujian rak server, dan konsultasi
                klien dikoordinasikan langsung oleh pendiri{' '}
                <strong className="text-white">{STUDIO_PROFILE.founder}</strong> dari markas
                rekayasa YcDev di Semarang Barat serta terhubung dengan koridor Pelabuhan Tanjung Emas.
              </p>

              <div className="mt-6">
                <Semarang3DMapCanvas />
              </div>

              <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-[#080B11]">
                <ResilientImage
                  src={STUDIO_PROFILE.serverLabImage}
                  alt="Rak server dan fasilitas uji PCB laboratorium YcDev"
                  fallbackTitle="Laboratorium Server & Hardware YcDev"
                  className="aspect-[16/9] w-full object-cover object-top"
                />
              </div>
            </div>

            <dl className="mt-8 space-y-4 border-t border-white/10 pt-6 text-sm">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-ink-400">Pendiri</dt>
                  <dd className="font-semibold text-white">
                    {STUDIO_PROFILE.founder} · {STUDIO_PROFILE.founderRole}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-ink-400">Alamat Studio</dt>
                  <dd className="font-semibold text-white">
                    {STUDIO_PROFILE.addressLine}
                  </dd>
                  <dd className="text-xs text-ink-400">{STUDIO_PROFILE.cityRegion}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-ink-400">Telepon / WhatsApp Langsung</dt>
                  <dd className="mt-1 flex flex-wrap items-center gap-3">
                    <a
                      href={STUDIO_PROFILE.phoneHref}
                      className="font-mono text-base font-medium text-sky-300 underline decoration-sky-400/40 underline-offset-4 hover:text-white tabular-nums"
                    >
                      {STUDIO_PROFILE.phoneDisplay}
                    </a>
                    <a
                      href={STUDIO_PROFILE.whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/45 bg-[#15803D] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#16A34A] whitespace-nowrap"
                    >
                      <WhatsAppIcon className="h-4 w-4 shrink-0" />
                      <span>Hubungi Kami</span>
                    </a>
                  </dd>
                  <dd className="mt-1 text-xs text-ink-400">
                    {STUDIO_PROFILE.operatingHours}
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Right: Validated Consultation Form + Studio SLA Brief */}
          <div className="space-y-6 lg:col-span-7">
            <div className="flex flex-col rounded-xl border border-white/10 bg-[#11151B] p-6 sm:p-8">
            {submittedRecord ? (
              <div
                data-testid="consultation-confirmation"
                className="flex flex-1 flex-col justify-start"
              >
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6 shrink-0" aria-hidden="true" />
                  <span className="text-sm font-semibold">
                    Ringkasan Konsultasi Tercatat
                  </span>
                </div>

                <h3 className="mt-4 font-display text-2xl font-bold text-white">
                  Terima kasih, {submittedRecord.form.name}.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Brief teknis Anda telah siap ditinjau oleh tim{' '}
                  <strong className="text-white">{STUDIO_PROFILE.brandName}</strong> (
                  {STUDIO_PROFILE.founder}). Untuk koordinasi segera, Anda juga dapat
                  menghubungi langsung nomor{' '}
                  <a
                    href={STUDIO_PROFILE.phoneHref}
                    className="font-mono text-sky-300 underline underline-offset-4 tabular-nums"
                  >
                    {STUDIO_PROFILE.phoneDisplay}
                  </a>
                  .
                </p>

                <dl className="mt-6 space-y-3 rounded-lg border border-white/10 bg-[#0D1015] p-5 text-sm">
                  <div>
                    <dt className="text-xs text-ink-400">Kontak Balasan</dt>
                    <dd className="font-mono text-slate-200">
                      {submittedRecord.form.contact}
                    </dd>
                  </div>
                  {submittedRecord.form.company && (
                    <div>
                      <dt className="text-xs text-ink-400">Organisasi</dt>
                      <dd className="text-slate-200">{submittedRecord.form.company}</dd>
                    </div>
                  )}
                  {submittedRecord.scope && (
                    <div>
                      <dt className="text-xs text-ink-400">Ruang Lingkup Terlampir</dt>
                      <dd className="text-sky-300">{submittedRecord.scope}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs text-ink-400">Kebutuhan Teknis</dt>
                    <dd className="text-slate-200">{submittedRecord.form.message}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">Waktu Pengajuan</dt>
                    <dd className="font-mono text-xs text-ink-400">
                      {submittedRecord.submittedAt}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-xs font-semibold text-slate-200">
                    Alur Tindak Lanjut Teknis
                  </p>
                  <ol className="mt-2.5 space-y-2 text-sm text-ink-400">
                    <li>01. Tinjauan kebutuhan dan kelayakan arsitektur (maks. 1 hari kerja).</li>
                    <li>02. Sesi diskusi teknis bersama Yuan Nugroho (daring atau di Puri Eksekutif).</li>
                    <li>03. Penyampaian proposal arsitektur, jadwal sprint, dan penawaran resmi.</li>
                  </ol>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-5">
                  <a
                    href={`${STUDIO_PROFILE.whatsappBaseHref}?text=${encodeURIComponent(
                      `Halo YcDev (${STUDIO_PROFILE.founder}), saya ${submittedRecord.form.name}. Kebutuhan proyek: ${submittedRecord.form.message}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#15803D]"
                  >
                    <WhatsAppIcon className="h-4 w-4 shrink-0" />
                    <span>Hubungi Kami via WhatsApp ({STUDIO_PROFILE.phoneDisplay})</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5 cursor-pointer"
                  >
                    Kirim Konsultasi Lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs font-medium tracking-wide text-sky-400">
                    Mulai Diskusi Teknis
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-white">
                    Konsultasi Proyek & Audit Sistem
                  </h3>
                  <p className="mt-2 text-sm text-ink-400">
                    Jelaskan target sistem atau tantangan teknis Anda. Kami membalas dalam 1
                    hari kerja dari studio Puri Eksekutif, Semarang Barat.
                  </p>

                  {attachedScope && (
                    <div
                      data-testid="attached-scope-banner"
                      className="mt-5 flex items-start justify-between gap-3 rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-3 text-xs text-sky-200"
                    >
                      <div>
                        <span className="block font-semibold text-white">
                          Ruang Lingkup Estimator Terlampir
                        </span>
                        <span className="mt-0.5 block text-sky-200">{attachedScope}</span>
                      </div>
                      <button
                        type="button"
                        onClick={onClearScope}
                        aria-label="Hapus ruang lingkup terlampir"
                        className="rounded p-1 text-sky-300 hover:bg-white/10 hover:text-white cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="mt-6 space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="consult-name"
                          className="block text-sm font-medium text-slate-200"
                        >
                          Nama Lengkap
                        </label>
                        <input
                          ref={nameInputRef}
                          id="consult-name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Contoh: Hendra Wijaya"
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? 'consult-name-error' : undefined}
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#0D1015] px-4 py-2.5 text-sm text-white placeholder:text-ink-400 focus:border-sky-400 focus:outline-none"
                        />
                        {errors.name && (
                          <p
                            id="consult-name-error"
                            role="alert"
                            className="mt-1.5 text-xs text-rose-400"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="consult-contact"
                          className="block text-sm font-medium text-slate-200"
                        >
                          Nomor WhatsApp atau Email
                        </label>
                        <input
                          id="consult-contact"
                          name="contact"
                          type="text"
                          value={form.contact}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, contact: e.target.value }))
                          }
                          placeholder="0812xxxx atau nama@perusahaan.id"
                          aria-invalid={Boolean(errors.contact)}
                          aria-describedby={
                            errors.contact ? 'consult-contact-error' : undefined
                          }
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#0D1015] px-4 py-2.5 text-sm text-white placeholder:text-ink-400 focus:border-sky-400 focus:outline-none"
                        />
                        {errors.contact && (
                          <p
                            id="consult-contact-error"
                            role="alert"
                            className="mt-1.5 text-xs text-rose-400"
                          >
                            {errors.contact}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="consult-company"
                        className="block text-sm font-medium text-slate-200"
                      >
                        Perusahaan / Instansi (Opsional)
                      </label>
                      <input
                        id="consult-company"
                        name="company"
                        type="text"
                        value={form.company}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, company: e.target.value }))
                        }
                        placeholder="Nama perusahaan atau divisi"
                        className="mt-2 w-full rounded-lg border border-white/15 bg-[#0D1015] px-4 py-2.5 text-sm text-white placeholder:text-ink-400 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="consult-message"
                        className="block text-sm font-medium text-slate-200"
                      >
                        Ringkasan Kebutuhan Sistem
                      </label>
                      <textarea
                        id="consult-message"
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, message: e.target.value }))
                        }
                        placeholder="Jelaskan kebutuhan IoT, aplikasi full-stack, audit keamanan, atau integrasi perangkat lunak Anda..."
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={
                          errors.message ? 'consult-message-error' : undefined
                        }
                        className="mt-2 w-full rounded-lg border border-white/15 bg-[#0D1015] px-4 py-2.5 text-sm text-white placeholder:text-ink-400 focus:border-sky-400 focus:outline-none"
                      />
                      {errors.message && (
                        <p
                          id="consult-message-error"
                          role="alert"
                          className="mt-1.5 text-xs text-rose-400"
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <p className="text-xs text-ink-400">
                    Konsultasi awal tanpa kewajiban kontrak.
                  </p>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                  >
                    Kirim Permintaan Konsultasi
                  </button>
                </div>
              </form>
            )}
            </div>

            {/* Compact Operational SLA & On-Board Survey Dispatch Info */}
            <div className="rounded-xl border border-white/10 bg-[#0D1219] p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <p className="font-mono text-xs text-sky-400">
                  STANDAR OPERASIONAL & MOBILISASI LAPANGAN
                </p>
                <span className="font-mono text-[11px] text-ink-400">
                  SLA NOC 24/7 · INDONESIA-WIDE
                </span>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="font-mono text-xs text-sky-400 tabular-nums">01 · RESPON CEPAT</p>
                  <p className="mt-1 text-sm font-semibold text-white">Audit Teknis ≤ 24 Jam</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-400">
                    Evaluasi kebutuhan NMEA, satelit, atau keamanan sistem langsung oleh Principal Architect.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs text-sky-400 tabular-nums">02 · ON-BOARD SURVEY</p>
                  <p className="mt-1 text-sm font-semibold text-white">Seluruh Pelabuhan RI</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-400">
                    Tim teknisi berangkat dari Semarang Barat menuju lokasi sandar kapal Anda.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs text-sky-400 tabular-nums">03 · DUKUNGAN PENUH</p>
                  <p className="mt-1 text-sm font-semibold text-white">Garansi & OTA Recovery</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-400">
                    Monitoring aktif NOC 24/7 serta pembaruan keamanan firmware jarak jauh.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
