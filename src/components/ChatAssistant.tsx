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
  Plus, 
  X, 
  Image as ImageIcon,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, UploadedImage } from '../types';

interface ChatAssistantProps {
  messages: ChatMessage[];
  isChatting: boolean;
  onSendMessage: (text: string, image?: UploadedImage) => Promise<void>;
  onClearChat: () => void;
  onSendToStudio: (websitePrompt: string) => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  messages,
  isChatting,
  onSendMessage,
  onClearChat,
  onSendToStudio,
}) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatting]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isChatting) return;
    const text = input;
    const img = selectedImage || undefined;
    setInput('');
    setSelectedImage(null);
    await onSendMessage(text, img);
  };

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const quickPrompts = [
    'Bagaimana struktur landing page yang baik untuk konversi tinggi?',
    'Bantu susun copywriting hero section untuk startup kecerdasan buatan',
    'Rekomendasikan komponen interaktif penting untuk website portofolio',
    'Buatkan ide website untuk platform edukasi pemrograman modern',
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-black text-slate-100 overflow-hidden">
      {/* Chat Header (Tulisan asisten percakapan AI sampai tanya jawab umum telah dihapus sesuai permintaan) */}
      <div className="h-12 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white border border-blue-500/30">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-300">AI Chat</span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Obrolan</span>
          </button>
        )}
      </div>

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl w-full mx-auto">
        {messages.length === 0 ? (
          /* Empty Chat Welcome State */
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-blue-900 flex items-center justify-center text-blue-500 mb-4">
              <MessageSquare className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Ada yang bisa saya bantu hari ini?
            </h3>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-8">
              Ketik pertanyaan, konsultasikan ide desain website, atau unggah foto/screenshot desain menggunakan tombol + di bawah.
            </p>

            {/* Quick Suggestions */}
            <div className="w-full max-w-lg space-y-2 text-left">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block px-1">
                Pertanyaan Populer:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(q)}
                    className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-blue-900 rounded-lg text-xs text-slate-300 hover:text-white transition-colors text-left flex items-start justify-between group"
                  >
                    <span className="line-clamp-2 leading-relaxed">{q}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Message Bubbles */
          messages.map((msg) => (
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
                <div className="whitespace-pre-wrap font-normal selection:bg-blue-900 selection:text-white">
                  {msg.content}
                </div>

                {/* Footer Controls for AI response */}
                {msg.role === 'model' && (
                  <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-400">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        onSendToStudio(
                          `Buatkan website profesional berdasarkan panduan berikut:\n${msg.content.slice(0, 300)}`
                        )
                      }
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      <Code2 className="w-3 h-3" />
                      <span>Buat Website dari Ide Ini</span>
                    </button>
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

        {isChatting && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <Wand2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span>AI sedang berpikir dan menganalisis...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with + Upload Foto Icon */}
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
            className="flex items-center gap-2 bg-black border border-slate-800 rounded-xl px-3 py-2 focus-within:border-blue-600 transition-colors"
          >
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Tombol + untuk Upload Foto */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Foto / Screenshot"
              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-900 rounded-lg transition-colors shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan apa saja atau upload foto referensi..."
              disabled={isChatting}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={(!input.trim() && !selectedImage) || isChatting}
              className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
