import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Layers, 
  Lightbulb, 
  History, 
  Code2, 
  Eye, 
  Wand2, 
  PlusCircle, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Plus,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { WebsiteProject, ViewportMode, StudioTab, UploadedImage } from '../types';
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
  const [promptInput, setPromptInput] = useState('');
  const [modifyInput, setModifyInput] = useState('');
  const [activeTab, setActiveTab] = useState<StudioTab>('preview');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Uploaded photo state for create and modify
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Silakan pilih file gambar yang valid.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage({
        data: reader.result as string,
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!promptInput.trim() && !uploadedImage) || isGenerating) return;
    setErrorNotice(null);
    try {
      const img = uploadedImage || undefined;
      await onGenerate(promptInput, 'create', img);
      setPromptInput('');
      setUploadedImage(null);
    } catch (err: any) {
      setErrorNotice(err?.message || 'Gagal membuat website.');
    }
  };

  const handleModifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!modifyInput.trim() && !uploadedImage) || isGenerating) return;
    setErrorNotice(null);
    try {
      const img = uploadedImage || undefined;
      await onGenerate(modifyInput, 'modify', img);
      setModifyInput('');
      setUploadedImage(null);
    } catch (err: any) {
      setErrorNotice(err?.message || 'Gagal memodifikasi website.');
    }
  };

  const handleApplySuggestion = async (suggestion: string) => {
    if (isGenerating) return;
    setErrorNotice(null);
    try {
      await onGenerate(suggestion, 'modify');
    } catch (err: any) {
      setErrorNotice(err?.message || 'Gagal menerapkan saran.');
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-black text-slate-100">
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Left Sidebar: AI Controls & Prompts */}
      <aside className="w-full lg:w-[420px] bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 h-full overflow-hidden">
        {/* Sidebar Header (Tulisan v1 telah dihapus sesuai permintaan) */}
        <div className="p-4 border-b border-slate-800 bg-black/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-sm text-white">Generator Website AI</span>
          </div>
        </div>

        {/* Scrollable Content in Sidebar */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {errorNotice && (
            <div className="p-3 bg-red-950/40 border border-red-900/80 rounded-lg text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorNotice}</div>
            </div>
          )}

          {!currentProject ? (
            /* State 1: Belum ada website yang dibuat */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Deskripsikan Website yang Ingin Dibuat:
                </label>
                <form onSubmit={handleCreateSubmit} className="space-y-3">
                  <textarea
                    rows={4}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Contoh: Buatkan landing page startup analitik data dengan fitur interactive chart, pricing card 3 paket, dan formulir pendaftaran gratis..."
                    disabled={isGenerating}
                    className="w-full p-3 bg-black border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-600 resize-none transition-colors"
                  />

                  {/* Upload Foto / Mockup Preview & Button */}
                  <div className="flex flex-col gap-2">
                    {uploadedImage && (
                      <div className="flex items-center justify-between p-2 bg-slate-900 border border-blue-900/70 rounded-lg text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={uploadedImage.data}
                            alt="Mockup"
                            className="w-8 h-8 rounded object-cover bg-black"
                          />
                          <span className="truncate text-[11px] text-slate-300">
                            {uploadedImage.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedImage(null)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Hapus foto"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-900 text-slate-300 hover:text-white rounded-lg text-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-blue-400" />
                        <span>Upload Foto / Mockup</span>
                      </button>
                      {uploadedImage && (
                        <span className="text-[10px] text-blue-400 font-mono">1 Foto Terlampir</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={(!promptInput.trim() && !uploadedImage) || isGenerating}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Wand2 className="w-4 h-4 animate-spin text-white" />
                        <span>AI Sedang Merancang Website...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Hasilkan Website Baru</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Preset Shortcuts */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Inspirasi Cepat:
                  </span>
                  <button
                    onClick={onOpenTemplates}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Lihat Template
                  </button>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setPromptInput('Buatkan landing page platform AI task automation dengan dark mode, statistik performa, dan fitur demo interaktif.');
                    }}
                    className="w-full text-left p-2.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800/90 rounded-lg text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">⚡ SaaS Automation & Taskflow</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 ml-2" />
                  </button>

                  <button
                    onClick={() => {
                      setPromptInput('Buatkan portofolio kreatif modern untuk desainer produk dengan showcase studi kasus, gallery filter, dan form pesan.');
                    }}
                    className="w-full text-left p-2.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800/90 rounded-lg text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">💼 Portofolio Minimalis Modern</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 ml-2" />
                  </button>

                  <button
                    onClick={() => {
                      setPromptInput('Buatkan toko online kopi artisan premium dengan katalog produk, detail rasa kopi, dan keranjang belanja interaktif.');
                    }}
                    className="w-full text-left p-2.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800/90 rounded-lg text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">☕ Toko Kopi & Artisan Roastery</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* State 2: Website sudah dibuat, tampilkan kontrol iterasi */
            <div className="space-y-5">
              {/* Project Title & Summary */}
              <div className="p-3 bg-black border border-slate-800 rounded-lg">
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{currentProject.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {currentProject.summary}
                </p>
                {currentProject.sections && currentProject.sections.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {currentProject.sections.map((sec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Modification Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Iterasi & Modifikasi dengan AI:</span>
                </label>
                <form onSubmit={handleModifySubmit} className="space-y-2">
                  <textarea
                    rows={3}
                    value={modifyInput}
                    onChange={(e) => setModifyInput(e.target.value)}
                    placeholder="Contoh: Tambahkan bagian Testimoni pelanggan dengan ulasan bintang 5, atau tambahkan fitur dark mode toggle..."
                    disabled={isGenerating}
                    className="w-full p-2.5 bg-black border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-600 resize-none transition-colors"
                  />

                  {/* Upload Foto di Modifikasi */}
                  <div className="flex flex-col gap-2">
                    {uploadedImage && (
                      <div className="flex items-center justify-between p-2 bg-slate-900 border border-blue-900/70 rounded-lg text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={uploadedImage.data}
                            alt="Mockup"
                            className="w-7 h-7 rounded object-cover bg-black"
                          />
                          <span className="truncate text-[11px] text-slate-300">
                            {uploadedImage.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedImage(null)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Hapus foto"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-900 text-slate-300 hover:text-white rounded-lg text-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-blue-400" />
                        <span>Upload Foto Referensi</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={(!modifyInput.trim() && !uploadedImage) || isGenerating}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Wand2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menerapkan Perubahan...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Terapkan Modifikasi</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* AI Suggestions */}
              {currentProject.suggestions && currentProject.suggestions.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
                    <span>Saran Peningkatan AI:</span>
                  </div>
                  <div className="space-y-1.5">
                    {currentProject.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleApplySuggestion(sug)}
                        disabled={isGenerating}
                        className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-[11px] text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                      >
                        <span className="truncate">{sug}</span>
                        <PlusCircle className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Revision History */}
              {history.length > 1 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                    <History className="w-3.5 h-3.5 text-blue-400" />
                    <span>Riwayat Versi ({history.length}):</span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {history.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => onSelectHistory(item)}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          item.id === currentProject.id
                            ? 'bg-blue-950 border border-blue-900 text-blue-300 font-medium'
                            : 'bg-black border border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <span className="truncate">
                          v{idx + 1}: {item.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Right Canvas: Preview & Code View */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-black">
        {/* Workspace Toolbar: Ikon Mata (Pratinjau Interaktif) & Kode Sumber ditaruh DIPOJOK KANAN ATAS sesuai permintaan */}
        <div className="h-12 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between shrink-0">
          {/* Pojok Kiri: Judul atau status website */}
          <div className="flex items-center gap-2 overflow-hidden">
            {currentProject ? (
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs font-semibold text-white truncate max-w-xs">
                  {currentProject.title}
                </span>
                {currentProject.techStack && (
                  <span className="hidden xl:inline text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-900 text-blue-400 font-semibold truncate">
                    {currentProject.techStack}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-slate-500 font-mono">
                Bara Web Studio
              </span>
            )}
          </div>

          {/* Pojok Kanan Atas: Ikon Mata (Pratinjau Interaktif) & Kode Sumber */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              title="Pratinjau Interaktif"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white shadow-none'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-current" />
              <span>Pratinjau Interaktif</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              title="Kode Sumber"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white shadow-none'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-current" />
              <span>Kode Sumber</span>
            </button>
          </div>
        </div>

        {/* Workspace Canvas Area */}
        <div className="flex-1 overflow-hidden relative">
          {isGenerating && (
            <div className="absolute inset-0 z-30 bg-black/85 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 bg-blue-600/20 border border-blue-600 text-blue-400 rounded-xl flex items-center justify-center mb-4">
                <Wand2 className="w-6 h-6 animate-spin text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Gemini AI Sedang Merakit Proyek Full-Stack
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Menyusun struktur HTML responsif, backend Python FastAPI, server Node.js Express, dan skema SQL...
              </p>
            </div>
          )}

          {currentProject ? (
            activeTab === 'preview' ? (
              <DeviceFrame
                html={currentProject.html}
                viewport={viewport}
                onViewportChange={setViewport}
                title={currentProject.title}
              />
            ) : (
              <div className="p-4 h-full">
                <CodeViewer
                  files={currentProject.files}
                  code={currentProject.html}
                  projectTitle={currentProject.title}
                  onUpdateCode={onUpdateCode}
                  onUpdateFile={onUpdateFile}
                  onDownloadSingle={onDownloadHtml}
                />
              </div>
            )
          ) : (
            /* Empty state canvas */
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-950">
              <div className="w-16 h-16 rounded-2xl bg-blue-950/60 border border-blue-900 flex items-center justify-center text-blue-400 mb-4">
                <Sparkles className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Studio Website Siap Digunakan
              </h3>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
                Ketik deskripsi website yang Anda inginkan di bilah kiri, unggah foto desain mockup dengan tombol +, atau pilih template bawaan.
              </p>
              <button
                onClick={onOpenTemplates}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Pilih Template Siap Pakai</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
