import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  Wand2, 
  Code2, 
  Eye, 
  Plus, 
  X, 
  ArrowUpRight,
  Layers,
  MessageSquare,
  Columns2,
  RefreshCw,
  ExternalLink,
  CornerDownRight,
  CheckCircle2,
  FileCode2,
  Download
} from 'lucide-react';
import { WebsiteProject, ViewportMode, StudioTab, UploadedImage, StudioChatMessage } from '../types';
import { DeviceFrame } from './DeviceFrame';
import { CodeViewer } from './CodeViewer';

interface StudioWebProps {
  currentProject: WebsiteProject | null;
  history: WebsiteProject[];
  isGenerating: boolean;
  onGenerate: (prompt: string, action?: 'create' | 'modify', image?: UploadedImage) => Promise<void>;
  onSelectHistory: (project: WebsiteProject) => void;
  onUpdateCode: (newHtml: string) => void;
  onUpdateFile?: (fileName: string, newContent: string) => void;
  onDownloadHtml: () => void;
  onOpenTemplates: () => void;
}

export const StudioWeb: React.FC<StudioWebProps> = ({
  currentProject,
  history,
  isGenerating,
  onGenerate,
  onSelectHistory,
  onUpdateCode,
  onUpdateFile,
  onDownloadHtml,
  onOpenTemplates,
}) => {
  // Main view state: default is 'chat' (tampilan seperti AI Chat)
  const [activeTab, setActiveTab] = useState<StudioTab>('chat');
  const [subTab, setSubTab] = useState<'preview' | 'code'>('preview');
  const [viewport, setViewport] = useState<ViewportMode>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'mobile';
    }
    return 'desktop';
  });

  // Input & upload state
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Conversational message stream for Studio Web
  const [chatMessages, setChatMessages] = useState<StudioChatMessage[]>(() => {
    if (currentProject) {
      return [
        {
          id: 'initial-ai',
          role: 'model',
          content: `Website "${currentProject.title}" siap digunakan! Saya telah menyiapkan frontend interaktif beserta arsitektur backend full-stack (Python FastAPI, Node.js Express, dan skema SQL).\n\nAnda dapat melihat hasilnya langsung dengan mengklik tombol Pratinjau Interaktif (ikon mata) di pojok kanan atas, atau ketik instruksi revisi di bawah untuk memodifikasi website ini.`,
          timestamp: currentProject.createdAt || Date.now(),
          version: 1,
          sections: currentProject.sections,
          suggestions: currentProject.suggestions,
        },
      ];
    }
    return [];
  });

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat' || activeTab === 'split') {
      scrollToBottom();
    }
  }, [chatMessages, isGenerating, activeTab]);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Silakan pilih file gambar yang valid.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage({
        data: reader.result as string,
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Submit prompt (acts as chat message + triggers web generation/revision)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isGenerating) return;

    const userPrompt = input.trim();
    const attachedImage = selectedImage;

    // Tambahkan pesan user ke stream obrolan
    const userMsg: StudioChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userPrompt || 'Rancang website berdasarkan gambar referensi terlampir.',
      timestamp: Date.now(),
      image: attachedImage?.data,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);

    try {
      const isModify = Boolean(currentProject);
      await onGenerate(
        userPrompt,
        isModify ? 'modify' : 'create',
        attachedImage || undefined
      );

      // Tambahkan respon model ke stream obrolan
      const nextVersion = history.length + 1;
      const modelMsg: StudioChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: isModify
          ? `Perubahan berhasil diterapkan ke website! Komponen UI, logic backend, dan skema telah diperbarui sesuai instruksi Anda.`
          : `Website berhasil dirancang dan siap diuji! Silakan klik tombol "Pratinjau Interaktif" di bawah atau di pojok kanan atas untuk melihat hasilnya secara langsung.`,
        timestamp: Date.now(),
        version: nextVersion,
        sections: currentProject?.sections || ['Header', 'Hero', 'Fitur', 'Footer'],
        suggestions: currentProject?.suggestions || [
          'Tambahkan tema gelap/terang toggle',
          'Tambahkan validasi form kontak dengan backend',
          'Tambahkan bagian testimoni pelanggan',
        ],
      };
      setChatMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      const errorMsg: StudioChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ Kendala: ${err?.message || 'Gagal memproses pembuatan website.'}`,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    }
  };

  // Click suggestion chip to immediately send as chat message
  const handleSendSuggestion = async (suggestion: string) => {
    if (isGenerating) return;
    const userMsg: StudioChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: suggestion,
      timestamp: Date.now(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      await onGenerate(suggestion, 'modify');
      const modelMsg: StudioChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: `Instruksi revisi "${suggestion}" telah berhasil diterapkan ke website!`,
        timestamp: Date.now(),
        version: history.length + 1,
        sections: currentProject?.sections,
        suggestions: currentProject?.suggestions,
      };
      setChatMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      const errorMsg: StudioChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ Kendala: ${err?.message || 'Gagal menerapkan perubahan.'}`,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    }
  };

  // Quick preset starters for initial welcome state
  const quickStarters = [
    'Buatkan landing page platform AI task automation dengan dark mode, statistik performa, dan demo interaktif.',
    'Buatkan portofolio kreatif modern untuk desainer produk dengan showcase proyek, filter kategori, dan form kontak.',
    'Buatkan toko online kopi artisan premium dengan katalog produk, detail rasa kopi, dan keranjang belanja interaktif.',
    'Buatkan dashboard fintech analytics dengan tabel transaksi, filter status, dan grafik visual.',
  ];

  // Helper render of Chat Interface (dipakai di mode 'chat' full width dan di mode 'split')
  const renderChatInterface = () => (
    <div className="flex-1 flex flex-col h-full bg-black text-slate-100 overflow-hidden">
      {/* Hidden file input for photo/mockup upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* Chat Messages List Area - Full Width Centered seperti AI Chat */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl w-full mx-auto">
        {chatMessages.length === 0 ? (
          /* Empty Chat Welcome State persis seperti AI Chat */
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-blue-900 flex items-center justify-center text-blue-500 mb-4">
              <Sparkles className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Website apa yang ingin Anda buat?
            </h3>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-8">
              Ketik deskripsi ide website Anda, unggah foto/screenshot desain menggunakan tombol +, atau gunakan inspirasi cepat di bawah.
            </p>

            {/* Quick Suggestions Cards */}
            <div className="w-full max-w-2xl space-y-2 text-left">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block px-1">
                Inspirasi Cepat:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {quickStarters.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(starter);
                    }}
                    className="p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-blue-900 rounded-xl text-xs text-slate-300 hover:text-white transition-colors text-left flex items-start justify-between group"
                  >
                    <span className="line-clamp-2 leading-relaxed text-xs">{starter}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Message Bubbles persis seperti AI Chat */
          chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 md:gap-4 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[78%] rounded-xl p-4 text-xs md:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white border border-blue-500/50'
                    : 'bg-slate-950 text-slate-200 border border-slate-800'
                }`}
              >
                {/* Uploaded Image Thumbnail (if attached) */}
                {msg.image && (
                  <div className="mb-3">
                    <img
                      src={msg.image}
                      alt="Lampiran pengguna"
                      className="max-w-xs max-h-60 rounded-lg object-contain bg-black border border-slate-800"
                    />
                  </div>
                )}

                {/* Message Content */}
                <div className="whitespace-pre-wrap font-normal selection:bg-blue-900 selection:text-white mb-2">
                  {msg.content}
                </div>

                {/* Interactive Project Card didalam respon Model */}
                {msg.role === 'model' && currentProject && (
                  <div className="mt-3 pt-3 border-t border-slate-900 space-y-3">
                    {/* Badge Proyek & Tech Stack */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {currentProject.title}
                      </span>
                      {currentProject.techStack && (
                        <span className="text-[10px] font-mono text-blue-400 px-2 py-0.5 rounded bg-blue-950 border border-blue-900">
                          {currentProject.techStack}
                        </span>
                      )}
                    </div>

                    {/* Tombol Aksi Cepat ke Pratinjau & Kode Sumber */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSubTab('preview');
                          setActiveTab('preview');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Pratinjau Interaktif</span>
                      </button>

                      <button
                        onClick={() => {
                          setSubTab('code');
                          setActiveTab('code');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white text-xs font-medium transition-colors"
                      >
                        <Code2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Buka Kode Sumber</span>
                      </button>
                    </div>

                    {/* Sections tags */}
                    {msg.sections && msg.sections.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {msg.sections.map((sec, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                          >
                            {sec}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Saran Iterasi Cepat */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                          Saran Revisi Cepat:
                        </span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {msg.suggestions.map((sug, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendSuggestion(sug)}
                              disabled={isGenerating}
                              className="text-left p-2 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                            >
                              <span className="truncate">{sug}</span>
                              <CornerDownRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isGenerating && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-400 flex items-center gap-2">
              <Wand2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>AI sedang merancang dan memperbarui arsitektur website...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Bottom Chat Input Bar persis seperti AI Chat */}
      <div className="border-t border-slate-800 bg-slate-950 p-4 shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Image preview badge if photo selected */}
          {selectedImage && (
            <div className="mb-2 inline-flex items-center gap-2 p-1.5 pl-2 pr-3 bg-slate-900 border border-blue-900/60 rounded-lg text-xs text-slate-200">
              <img
                src={selectedImage.data}
                alt="Preview"
                className="w-7 h-7 object-cover rounded bg-black"
              />
              <span className="max-w-[200px] truncate text-[11px] text-slate-300">
                {selectedImage.name}
              </span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-1 text-slate-400 hover:text-white ml-1"
                title="Hapus foto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-black border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-blue-600 transition-colors"
          >
            {/* Tombol + untuk Upload Foto / Screenshot Mockup */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Foto / Screenshot Desain"
              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-900 rounded-lg transition-colors shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                currentProject
                  ? "Ketik instruksi revisi (misal: ganti warna aksen, tambahkan fitur kontak)..."
                  : "Deskripsikan website yang ingin Anda buat..."
              }
              disabled={isGenerating}
              className="flex-1 bg-transparent text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={(!input.trim() && !selectedImage) || isGenerating}
              className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // Helper render of Canvas Area (Live Preview / Code Editor)
  const renderCanvasArea = () => (
    <div className="flex-1 min-h-0 w-full h-full flex flex-col overflow-hidden bg-black relative">
      {isGenerating && (
        <div className="absolute inset-0 z-30 bg-black/85 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 bg-blue-600/20 border border-blue-600 text-blue-400 rounded-xl flex items-center justify-center mb-4">
            <Wand2 className="w-6 h-6 animate-spin text-blue-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Bara Web Sedang Merakit Proyek Full-Stack
          </h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Menyusun struktur frontend HTML interaktif, backend Python FastAPI, server Node.js Express, dan skema SQL...
          </p>
        </div>
      )}

      {currentProject ? (
        activeTab === 'code' || (activeTab === 'split' && subTab === 'code') ? (
          <div className="p-1 sm:p-4 h-full w-full min-h-0 flex flex-col overflow-hidden">
            <CodeViewer
              files={currentProject.files}
              code={currentProject.html}
              projectTitle={currentProject.title}
              onUpdateCode={onUpdateCode}
              onUpdateFile={onUpdateFile}
              onDownloadSingle={onDownloadHtml}
            />
          </div>
        ) : (
          <DeviceFrame
            html={currentProject.html}
            viewport={viewport}
            onViewportChange={setViewport}
            title={currentProject.title}
            onBackToChat={() => setActiveTab('chat')}
          />
        )
      ) : (
        /* Empty canvas state */
        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-950">
          <div className="w-16 h-16 rounded-2xl bg-blue-950/60 border border-blue-900 flex items-center justify-center text-blue-400 mb-4">
            <Sparkles className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Belum Ada Website yang Dimuat
          </h3>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
            Kembali ke mode Obrolan untuk meminta AI merancang website, unggah foto desain mockup dengan tombol +, atau pilih salah satu template siap pakai.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('chat')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Buka Obrolan AI</span>
            </button>
            <button
              onClick={onOpenTemplates}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium rounded-lg text-xs transition-colors flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Pilih Template</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 min-h-0 w-full h-full flex flex-col bg-black text-slate-100 overflow-hidden">
      {/* Top Header Studio Web dengan Tombol Pratinjau Interaktif & Kode Sumber di Pojok Kanan Atas */}
      <div className="h-12 border-b border-slate-800 bg-slate-950 px-4 md:px-6 flex items-center justify-between shrink-0">
        {/* Pojok Kiri */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          {currentProject && (
            <span className="text-xs font-medium text-slate-400 truncate max-w-xs sm:max-w-md">
              {currentProject.title}
            </span>
          )}
        </div>

        {/* Pojok Kanan Atas: Ikon Mata (Pratinjau Interaktif) & Kode Sumber (Sesuai Permintaan) */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Tombol Obrolan (Tampilan Seperti AI Chat) */}
          <button
            onClick={() => setActiveTab('chat')}
            title="Tampilan Obrolan AI"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Obrolan</span>
          </button>

          {/* Ikon Mata (Pratinjau Interaktif) */}
          <button
            onClick={() => {
              setSubTab('preview');
              setActiveTab('preview');
            }}
            title="Pratinjau Interaktif"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau Interaktif</span>
          </button>

          {/* Ikon Kode Sumber */}
          <button
            onClick={() => {
              setSubTab('code');
              setActiveTab('code');
            }}
            title="Kode Sumber"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'code'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kode Sumber</span>
          </button>

          {/* Tombol Bagi Layar (Split Screen) untuk fleksibilitas */}
          <button
            onClick={() => setActiveTab(activeTab === 'split' ? 'chat' : 'split')}
            title="Bagi Layar (Obrolan & Kanvas)"
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'split'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Bagi Layar</span>
          </button>

          {/* Bersihkan obrolan */}
          {chatMessages.length > 0 && activeTab === 'chat' && (
            <button
              onClick={() => setChatMessages([])}
              title="Bersihkan obrolan"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Body Layout */}
      {activeTab === 'chat' && (
        /* MODE 1: TAMPILAN STUDIO WEB PERSIS SEPERTI AI CHAT */
        renderChatInterface()
      )}

      {activeTab === 'preview' && (
        /* MODE 2: KANVAS PRATINJAU INTERAKTIF PENUH */
        renderCanvasArea()
      )}

      {activeTab === 'code' && (
        /* MODE 3: KODE SUMBER PENUH */
        renderCanvasArea()
      )}

      {activeTab === 'split' && (
        /* MODE 4: BAGI LAYAR (CHAT DI KIRI, KANVAS DI KANAN) */
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          <div className="w-full md:w-1/2 border-r border-slate-800 flex flex-col h-full">
            {renderChatInterface()}
          </div>
          <div className="w-full md:w-1/2 flex flex-col h-full">
            {renderCanvasArea()}
          </div>
        </div>
      )}
    </div>
  );
};
