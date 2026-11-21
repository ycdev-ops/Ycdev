import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Box,
  Check,
  Film,
  Image as ImageIcon,
  Maximize2,
  X,
} from 'lucide-react';
import {
  filterMaritimeSolutions,
  formatMaritimeInquiryScope,
  MARITIME_CATEGORIES,
  MARITIME_SOLUTIONS,
  type MaritimeCategoryFilter,
  type MaritimeSolutionItem,
} from '../utils/maritimeCatalog';
import type { ShowcaseModelId } from '../three/showcaseObjects';
import { ProductSimulationCanvas } from './ProductSimulationCanvas';
import { ResilientImage } from './ResilientImage';

interface MaritimeSolutionsSectionProps {
  onSelectModule: (scopeSummary: string) => void;
  onInspect3DModel: (modelId: ShowcaseModelId) => void;
  focusedProductId?: string | null;
  onClearFocusedProduct?: () => void;
}

const FILTER_TABS: { id: MaritimeCategoryFilter; label: string }[] = [
  { id: 'all', label: 'Semua Solusi (12)' },
  { id: 'hardware', label: '1. Perangkat Keras (4)' },
  { id: 'software', label: '2. Software & Cloud (4)' },
  { id: 'services', label: '3. Layanan Profesional (4)' },
];

export function MaritimeSolutionsSection({
  onSelectModule,
  onInspect3DModel,
  focusedProductId,
  onClearFocusedProduct,
}: MaritimeSolutionsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<MaritimeCategoryFilter>('all');
  const [cardMediaModes, setCardMediaModes] = useState<Record<string, 'photo' | 'video'>>({});
  const [detailProduct, setDetailProduct] = useState<MaritimeSolutionItem | null>(null);

  useEffect(() => {
    if (!focusedProductId) return;
    const found = MARITIME_SOLUTIONS.find((item) => item.id === focusedProductId);
    if (found) {
      setActiveFilter('all');
      setDetailProduct(found);
    }
  }, [focusedProductId]);

  const visibleItems = filterMaritimeSolutions(MARITIME_SOLUTIONS, activeFilter);

  const visibleCategories =
    activeFilter === 'all'
      ? MARITIME_CATEGORIES
      : MARITIME_CATEGORIES.filter((cat) => cat.id === activeFilter);

  const handleCloseModal = () => {
    setDetailProduct(null);
    onClearFocusedProduct?.();
  };

  const handleConsultModule = (item: MaritimeSolutionItem) => {
    handleCloseModal();
    onSelectModule(formatMaritimeInquiryScope(item));
  };

  const setCardMode = (id: string, mode: 'photo' | 'video') => {
    setCardMediaModes((prev) => ({ ...prev, [id]: mode }));
  };

  return (
    <section
      id="solusi-maritim"
      className="relative z-10 scroll-mt-20 border-b border-white/10 bg-[#06090E]/95 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header & Category Tabs */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Ekosistem Maritim & Telemetri Armada Terpadu
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
              Produk Perangkat Keras, Platform Cloud & Layanan Maritim
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-400">
              Setiap produk dilengkapi foto perangkat nyata, tayangan operasi video proyek,
              spesifikasi teknis mendalam, dan alur implementasi dari ruang kemudi hingga pusat NOC.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter katalog solusi maritim"
            className="flex flex-wrap gap-2"
          >
            {FILTER_TABS.map((tab) => {
              const selected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                    selected
                      ? 'border-sky-500 bg-[#2563EB] text-white'
                      : 'border-white/10 bg-[#0C1119] text-slate-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* End-to-End Vessel-to-Shore Architecture Strip */}
        <div className="mt-10 grid grid-cols-1 divide-y divide-white/10 rounded-xl border border-white/10 bg-[#0B0F17] md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="p-5">
            <p className="font-mono text-xs text-sky-400 tabular-nums">
              LAPISAN 01 · ON-BOARD VESSEL
            </p>
            <p className="mt-1 font-display text-base font-semibold text-white">
              Akuisisi Anjungan & Kamar Mesin
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-400">
              Edge Box IP67 membaca NMEA 0183/2000, radar X/S-Band, flow meter BBM, dan RPM mesin.
            </p>
          </div>

          <div className="p-5">
            <p className="font-mono text-xs text-sky-400 tabular-nums">
              LAPISAN 02 · HYBRID SATCOM LINK
            </p>
            <p className="mt-1 font-display text-base font-semibold text-white">
              4G/5G Pantai ↔ LEO & L-Band Laut Lepas
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-400">
              Failover mulus antara seluler pesisir, Starlink Maritime, dan Iridium/Inmarsat.
            </p>
          </div>

          <div className="p-5">
            <p className="font-mono text-xs text-sky-400 tabular-nums">
              LAPISAN 03 · SHORE COMMAND & NOC
            </p>
            <p className="mt-1 font-display text-base font-semibold text-white">
              ENC Dashboard, VMS KKP & NOC 24/7
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-400">
              Mirroring radar jarak jauh, peringatan WhatsApp otomatis, serta pemantauan NOC penuh.
            </p>
          </div>
        </div>

        {/* Grouped Product Cards with Matched Image + Animated Video Simulation Toggle */}
        <div className="mt-12 space-y-16">
          {visibleCategories.map((category) => {
            const categoryItems = visibleItems.filter(
              (item) => item.category === category.id
            );
            return (
              <div key={category.id} data-testid={`maritime-group-${category.id}`}>
                <div className="flex flex-col justify-between gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end">
                  <div>
                    <p className="font-mono text-xs text-sky-400 tabular-nums">
                      KATEGORI {category.stepNumber}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-white">
                      {category.title}
                    </h3>
                  </div>
                  <p className="max-w-xl text-xs leading-relaxed text-ink-400 sm:text-right">
                    {category.subtitle}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {categoryItems.map((item) => {
                    const mediaMode = cardMediaModes[item.id] ?? 'photo';
                    return (
                      <article
                        key={item.id}
                        id={`produk-${item.id}`}
                        className="flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0D121A] transition-colors duration-200 hover:border-sky-500/40"
                      >
                        <div>
                          {/* Realistic Matched Product Photo OR Animated Project Video Simulation */}
                          <div className="border-b border-white/10 bg-[#060A11] p-3">
                            <div className="mb-2.5 flex items-center justify-between gap-2">
                              <span className="font-mono text-[11px] text-sky-400 tabular-nums">
                                {item.indexLabel} · {item.categoryLabel}
                              </span>
                              <div className="inline-flex rounded-md border border-white/10 bg-[#0B1018] p-0.5">
                                <button
                                  type="button"
                                  onClick={() => setCardMode(item.id, 'photo')}
                                  aria-pressed={mediaMode === 'photo'}
                                  className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-medium cursor-pointer ${
                                    mediaMode === 'photo'
                                      ? 'bg-[#2563EB] text-white'
                                      : 'text-slate-300 hover:text-white'
                                  }`}
                                >
                                  <ImageIcon className="h-3 w-3" aria-hidden="true" />
                                  Foto Produk
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCardMode(item.id, 'video')}
                                  aria-pressed={mediaMode === 'video'}
                                  className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-medium cursor-pointer ${
                                    mediaMode === 'video'
                                      ? 'bg-[#2563EB] text-white'
                                      : 'text-slate-300 hover:text-white'
                                  }`}
                                >
                                  <Film className="h-3 w-3" aria-hidden="true" />
                                  Video Operasi
                                </button>
                              </div>
                            </div>

                            {mediaMode === 'photo' ? (
                              <div className="relative overflow-hidden rounded-lg border border-white/10">
                                <ResilientImage
                                  src={item.imageUrl}
                                  alt={item.imageAlt}
                                  fallbackTitle={item.name}
                                  className="aspect-[4/3] w-full object-cover"
                                />
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-3">
                                  <p className="font-mono text-[11px] text-sky-300">
                                    {item.videoReelTitle}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <ProductSimulationCanvas
                                variant={item.animationVariant}
                                title={item.name}
                                durationLabel={item.videoDurationLabel}
                                compact
                              />
                            )}
                          </div>

                          {/* Rich Technical Detail Body */}
                          <div className="p-6 pb-4">
                            <h4 className="font-display text-xl font-bold text-white">
                              {item.name}
                            </h4>
                            <p className="mt-0.5 text-xs font-medium text-sky-300/90">
                              {item.tagline}
                            </p>

                            <p className="mt-3 text-sm leading-relaxed text-slate-300">
                              {item.description}
                            </p>

                            {/* 2x2 Key Technical Datasheet Preview */}
                            <dl className="mt-4 grid grid-cols-1 gap-2 rounded-lg border border-white/10 bg-[#090D14] p-3 sm:grid-cols-2">
                              {item.detailedSpecs.slice(0, 4).map((spec) => (
                                <div key={spec.label} className="min-w-0">
                                  <dt className="text-[11px] text-ink-400">
                                    {spec.label}
                                  </dt>
                                  <dd className="truncate font-mono text-xs font-medium text-slate-100 tabular-nums">
                                    {spec.value}
                                  </dd>
                                </div>
                              ))}
                            </dl>

                            <ul className="mt-4 space-y-1.5">
                              {item.keySpecs.map((spec) => (
                                <li
                                  key={spec}
                                  className="flex items-start gap-2 text-xs leading-relaxed text-slate-300"
                                >
                                  <Check
                                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400"
                                    aria-hidden="true"
                                  />
                                  <span>{spec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mx-6 mb-6 mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setDetailProduct(item)}
                              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-sky-400/50 cursor-pointer"
                            >
                              <Maximize2 className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                              Spesifikasi & Video
                            </button>

                            {item.linked3DModelId && (
                              <button
                                type="button"
                                onClick={() => onInspect3DModel(item.linked3DModelId!)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white cursor-pointer"
                              >
                                <Box className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                                Lihat di Lab 3D
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleConsultModule(item)}
                            aria-label={`Konsultasikan ${item.name}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 transition-colors hover:text-sky-300 cursor-pointer"
                          >
                            Konsultasikan Modul
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Product Detail + Synchronized Video Simulation Modal */}
      {detailProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-5"
          onClick={handleCloseModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-white/15 bg-[#0C1118] p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
              <div>
                <p className="font-mono text-xs text-sky-400 tabular-nums">
                  {detailProduct.indexLabel} · {detailProduct.categoryLabel}
                </p>
                <h3
                  id="product-detail-title"
                  className="mt-1 font-display text-xl font-bold text-white sm:text-2xl"
                >
                  {detailProduct.name}
                </h3>
                <p className="mt-0.5 text-xs text-ink-400 sm:text-sm">{detailProduct.tagline}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Tutup detail produk"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Side-by-side Photo & Live Project Video Simulation */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-lg border border-white/15 bg-[#060A11]">
                <ResilientImage
                  src={detailProduct.imageUrl}
                  alt={detailProduct.imageAlt}
                  fallbackTitle={detailProduct.name}
                  className="aspect-video w-full object-cover"
                />
                <p className="border-t border-white/10 bg-[#0A0E16] px-3 py-1.5 font-mono text-[11px] text-ink-400">
                  FOTO PERANGKAT NYATA · {detailProduct.protocolOrStandard}
                </p>
              </div>

              <ProductSimulationCanvas
                variant={detailProduct.animationVariant}
                title={detailProduct.name}
                durationLabel={detailProduct.videoDurationLabel}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {detailProduct.description}
            </p>

            {/* Full Technical Datasheet + Deployment Stages */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-[#080C12] p-3.5">
                <p className="text-xs font-semibold text-white">
                  Lembar Data & Spesifikasi Teknis
                </p>
                <dl className="mt-2.5 space-y-2 text-xs">
                  {detailProduct.detailedSpecs.map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-col justify-between gap-1 border-b border-white/5 pb-1.5 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                      <dt className="text-ink-400">{row.label}</dt>
                      <dd className="font-mono font-medium text-sky-300 tabular-nums">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#080C12] p-3.5">
                <p className="text-xs font-semibold text-white">
                  Tahapan Implementasi Lapangan
                </p>
                <ol className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-slate-300">
                  {detailProduct.deploymentStages.map((stage, idx) => (
                    <li key={stage} className="flex items-start gap-2">
                      <span className="font-mono font-semibold text-sky-400 tabular-nums">
                        0{idx + 1}.
                      </span>
                      <span>{stage}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              {detailProduct.linked3DModelId ? (
                <button
                  type="button"
                  onClick={() => {
                    const modelId = detailProduct.linked3DModelId!;
                    handleCloseModal();
                    onInspect3DModel(modelId);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
                >
                  <Box className="h-4 w-4 text-sky-400" aria-hidden="true" />
                  Buka Objek 3D Interaktif
                </button>
              ) : (
                <span className="font-mono text-xs text-ink-400">
                  {detailProduct.protocolOrStandard}
                </span>
              )}

              <button
                type="button"
                onClick={() => handleConsultModule(detailProduct)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer"
              >
                Konsultasikan & Minta Penawaran
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
