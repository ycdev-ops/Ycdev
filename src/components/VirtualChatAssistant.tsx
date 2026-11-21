import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Send, Volume2, VolumeX, X } from 'lucide-react';
import { STUDIO_PROFILE } from '../data/ycdevData';
import { ambientAudio, type AmbientAudioState } from '../utils/ambientAudio';
import {
  generateAssistantResponse,
  QUICK_CHAT_PROMPTS,
  type AssistantMessage,
} from '../utils/virtualAssistant';
import { assetUrl } from '../utils/siteAssets';

interface VirtualChatAssistantProps {
  onSelectProduct: (productId: string) => void;
  onConsultClick: () => void;
}

function nowTimeLabel() {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

export function VirtualChatAssistant({
  onSelectProduct,
  onConsultClick,
}: VirtualChatAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [audioState, setAudioState] = useState<AmbientAudioState>(() =>
    ambientAudio.getState()
  );
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Halo! Saya Asisten Virtual YcDev. Tanyakan spesifikasi Marine IoT Gateway IP67, Radar Extractor, Hybrid Starlink/5G, Fleet Command Dashboard, layanan on-board, atau hubungi Yuan Nugroho (081238668332).',
      timestamp: nowTimeLabel(),
      suggestions: [...QUICK_CHAT_PROMPTS],
    },
  ]);

  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ambientAudio.initAutoPlay();
    const unsub = ambientAudio.subscribe(setAudioState);
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (open) {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendQuery = (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed) return;

    const userMsg: AssistantMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: nowTimeLabel(),
    };

    const reply = generateAssistantResponse(trimmed);
    const assistantMsg: AssistantMessage = {
      id: `a-${Date.now() + 1}`,
      role: 'assistant',
      text: reply.text,
      timestamp: nowTimeLabel(),
      matchedProduct: reply.matchedProduct,
      suggestions: reply.suggestions,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6">
      {/* Chat Dialog */}
      {open && (
        <div
          role="dialog"
          aria-label="Asisten Virtual Konsumen YcDev"
          data-testid="virtual-chat-dialog"
          className="flex h-[470px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0A0F18] shadow-2xl"
        >
          {/* Header with Official YcDev Logo */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#070B12] px-4 py-3">
            <div className="flex items-center gap-3">
              <img
                src={assetUrl(STUDIO_PROFILE.logoImage)}
                alt="Avatar Asisten Virtual YcDev"
                referrerPolicy="no-referrer"
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-sky-400/50"
              />
              <div>
                <p className="font-display text-sm font-bold text-white">
                  Asisten Virtual YcDev
                </p>
                <p className="text-[11px] text-sky-400">
                  Konsultan Produk & Maritim 24/7
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup asisten virtual"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#2563EB] text-white'
                      : 'border border-white/10 bg-[#111722] text-slate-200'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.matchedProduct && (
                    <div className="mt-2.5 rounded-lg border border-sky-500/30 bg-[#080C12] p-2.5">
                      <p className="font-mono text-[10px] text-sky-400">
                        {msg.matchedProduct.indexLabel} · {msg.matchedProduct.categoryLabel}
                      </p>
                      <p className="mt-0.5 font-semibold text-white">
                        {msg.matchedProduct.name}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            onSelectProduct(msg.matchedProduct!.id);
                          }}
                          className="inline-flex items-center gap-1 rounded bg-[#2563EB] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#1D4ED8] cursor-pointer"
                        >
                          Buka Detail & Video
                          <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => sendQuery(sug)}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300 transition-colors hover:border-sky-400/50 hover:text-white cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                <span className="mt-1 font-mono text-[10px] text-ink-400 tabular-nums">
                  {msg.timestamp}
                </span>
              </div>
            ))}
            <div ref={listEndRef} />
          </div>

          {/* Direct Footer Action + Message Form */}
          <div className="border-t border-white/10 bg-[#070B12] p-3">
            <div className="mb-2 flex items-center justify-between text-[11px] text-ink-400">
              <span>Konsultasi langsung:</span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onConsultClick();
                }}
                className="font-semibold text-sky-400 hover:text-sky-300 cursor-pointer"
              >
                Hubungi Yuan ({STUDIO_PROFILE.phoneDisplay}) →
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Tulis pertanyaan untuk asisten virtual"
                placeholder="Tanya produk, harga, atau survei..."
                className="flex-1 rounded-lg border border-white/15 bg-[#0C111A] px-3 py-2 text-xs text-white placeholder:text-ink-400 focus:border-sky-400 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Kirim pesan"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Compact Controls Row: Ambient Auto-Audio Status/Toggle + Virtual Assistant Avatar Launcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => ambientAudio.toggleMute()}
          aria-label={audioState.isMuted ? 'Nyalakan audio ambien' : 'Bisukan audio ambien'}
          data-testid="ambient-audio-toggle"
          data-audio-playing={String(audioState.isPlaying)}
          className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/15 bg-[#0A0F18] px-3.5 text-xs font-medium text-slate-200 shadow-lg transition-colors hover:border-sky-400/50 hover:text-white cursor-pointer"
        >
          {audioState.isMuted ? (
            <VolumeX className="h-4 w-4 text-ink-400" aria-hidden="true" />
          ) : (
            <Volume2 className="h-4 w-4 text-sky-400" aria-hidden="true" />
          )}
          <span className="hidden sm:inline font-mono text-[11px]">
            {audioState.isMuted ? 'Audio: Bisukan' : 'Audio: Aktif'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label="Buka chat asisten konsumen YcDev"
          data-testid="virtual-chat-launcher"
          className="inline-flex h-12 items-center gap-2.5 rounded-full border border-sky-400/50 bg-[#0B121D] pl-1.5 pr-4 text-xs font-semibold text-white shadow-2xl transition-colors hover:border-sky-300 hover:bg-[#111B2B] cursor-pointer"
        >
          <img
            src={assetUrl(STUDIO_PROFILE.logoImage)}
            alt="Logo Asisten YcDev"
            referrerPolicy="no-referrer"
            className="h-9 w-9 rounded-full object-cover ring-1 ring-sky-400/60"
          />
          <span>Chat Konsumen</span>
        </button>
      </div>
    </div>
  );
}
