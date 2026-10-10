import React, { useState, useEffect } from 'react';
import { X, Sliders, RotateCcw, Check, Sparkles, Terminal, Bot } from 'lucide-react';
import { SystemPrompts } from '../types';

export const DEFAULT_WEBSITE_PROMPT = `Anda adalah Arsitek Full-Stack Software Engineer kelas dunia untuk platform Bara Web.
Tugas Anda adalah merancang dan membuat sistem aplikasi website LENGKAP dengan arsitektur multi-bahasa:
1. Frontend: HTML5 semantik responsif + Tailwind CSS + JavaScript interaktif
2. Backend Python: File backend server berbasis Python (FastAPI / Flask) dengan route API, validasi data Pydantic, dan penanganan data
3. Backend Node.js: File backend server alternatif berbasis Node.js (Express) dengan REST API endpoints
4. Database: File skema SQL (PostgreSQL/SQLite) untuk penyimpanan data
5. Konfigurasi Dependensi: requirements.txt (Python) dan package.json (Node.js)
6. Dokumentasi: README.md panduan instalasi dan menjalankan backend

PERATURAN PENTING KODE:
1. "html": Kode HTML utama yang 100% lengkap dan mandiri (dari <!DOCTYPE html> sampai </html>), menggunakan CDN Tailwind CSS dan Lucide icons, dengan JavaScript interaktif yang siap dijalankan langsung di iframe browser.
2. "files": Array file proyek lengkap yang mencakup:
   - "index.html" (Frontend)
   - "main.py" (Server Python FastAPI lengkap dengan endpoint REST API)
   - "server.js" (Server Node.js Express alternatif lengkap dengan endpoint REST API)
   - "schema.sql" (Skema tabel database relasional)
   - "requirements.txt" (Pustaka Python: fastapi, uvicorn, pydantic)
   - "package.json" (Pustaka Node.js: express, cors, dotenv)
   - "README.md" (Panduan menjalankan server Python atau Node.js)
3. Desain visual harus modern, profesional, bersih, bertema hitam dan biru solid TANPA EFEK GLOW / BLOOM.
4. Desain WAJIB 100% responsif mobile-first:
   - Wajib mencantumkan <meta name="viewport" content="width=device-width, initial-scale=1.0"> di dalam <head>.
   - Tipografi responsif (contoh judul hero: text-2xl sm:text-4xl md:text-5xl, jangan gunakan ukuran statis raksasa tanpa breakpoint mobile).
   - Padding responsif (px-4 sm:px-6, py-8 sm:py-16) dan navbar tidak boleh terpotong atau wrap berantakan di layar kecil HP (gunakan whitespace-nowrap dan shrink-0).
   - Hindari lebar statis tetap (gunakan max-w-full w-full mx-auto) agar tidak ada elemen yang meluap ke samping.

Format output WAJIB JSON:
{
  "title": "Judul Singkat Website",
  "summary": "Deskripsi arsitektur sistem dan teknologi yang digunakan",
  "techStack": "HTML5, Tailwind, Python (FastAPI), Node.js (Express), SQL",
  "sections": ["Navigasi", "Hero", "Fitur", "API Showcase", "Harga", "Footer"],
  "html": "<!DOCTYPE html><html>...</html>",
  "files": [
    {
      "name": "index.html",
      "language": "html",
      "description": "Frontend UI responsif Tailwind CSS",
      "content": "<!DOCTYPE html>..."
    },
    {
      "name": "main.py",
      "language": "python",
      "description": "Backend API Server Python FastAPI",
      "content": "from fastapi import FastAPI..."
    },
    {
      "name": "server.js",
      "language": "javascript",
      "description": "Backend API Server Node.js Express",
      "content": "const express = require('express')...."
    },
    {
      "name": "schema.sql",
      "language": "sql",
      "description": "Skema database dan tabel SQL",
      "content": "CREATE TABLE..."
    },
    {
      "name": "requirements.txt",
      "language": "text",
      "description": "Dependensi Python pip",
      "content": "fastapi>=0.110.0\\nuvicorn>=0.28.0"
    },
    {
      "name": "package.json",
      "language": "json",
      "description": "Dependensi Node.js npm",
      "content": "{\\"dependencies\\": {\\"express\\": \\"^4.19.2\\"}}"
    },
    {
      "name": "README.md",
      "language": "markdown",
      "description": "Panduan menjalankan proyek",
      "content": "# Panduan Menjalankan..."
    }
  ],
  "nextSuggestions": ["Saran 1", "Saran 2", "Saran 3"]
}`;

export const DEFAULT_CHAT_PROMPT = `Anda adalah Bara Web AI, asisten kecerdasan buatan serbaguna yang ramah, cerdas, dan ahli dalam:
1. Pembuatan dan konsultasi website (HTML, Tailwind CSS, JavaScript, React, arsitektur web, UI/UX).
2. Percakapan umum, tanya-jawab, pemecahan masalah teknis, penulisan kreatif, dan coding dalam berbagai bahasa pemrograman.
3. Anda dapat berkomunikasi dalam Bahasa Indonesia dan Bahasa Inggris dengan lancar, jelas, dan ramah.

Jika pengguna bertanya tentang website yang sedang dibuat, berikan panduan teknis yang tajam.
Jika pengguna mengajak ngobrol santai atau menanyakan topik lain, jawab dengan informatif dan terstruktur.`;

interface SystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemPrompts: SystemPrompts;
  onSave: (prompts: SystemPrompts) => void;
}

export const SystemPromptModal: React.FC<SystemPromptModalProps> = ({
  isOpen,
  onClose,
  systemPrompts,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'website' | 'chat'>('website');
  const [websitePrompt, setWebsitePrompt] = useState(systemPrompts.websitePrompt);
  const [chatPrompt, setChatPrompt] = useState(systemPrompts.chatPrompt);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setWebsitePrompt(systemPrompts.websitePrompt);
    setChatPrompt(systemPrompts.chatPrompt);
  }, [systemPrompts, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      websitePrompt,
      chatPrompt,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleResetCurrent = () => {
    if (activeTab === 'website') {
      setWebsitePrompt(DEFAULT_WEBSITE_PROMPT);
    } else {
      setChatPrompt(DEFAULT_CHAT_PROMPT);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-black/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Pengaturan System Prompt</span>
                <span className="text-[10px] font-mono bg-blue-950 border border-blue-900 text-blue-400 px-2 py-0.5 rounded font-semibold">
                  Bara Web AI
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Kustomisasi instruksi dasar dan kepribadian model AI untuk generator website maupun obrolan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('website')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'website'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>System Prompt Website Builder</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>System Prompt AI Chat</span>
            </button>
          </div>

          <button
            onClick={handleResetCurrent}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-slate-500 hover:text-blue-400" />
            <span>Reset Tab Ini ke Default</span>
          </button>
        </div>

        {/* Prompt Editor Area */}
        <div className="p-5 flex-1 overflow-y-auto bg-black flex flex-col">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>
              {activeTab === 'website'
                ? 'Instruksi untuk pembuatan dan perancangan website (Studio Web):'
                : 'Instruksi untuk asisten percakapan (AI Chat):'}
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              {activeTab === 'website' ? websitePrompt.length : chatPrompt.length} karakter
            </span>
          </div>

          <textarea
            value={activeTab === 'website' ? websitePrompt : chatPrompt}
            onChange={(e) => {
              if (activeTab === 'website') {
                setWebsitePrompt(e.target.value);
              } else {
                setChatPrompt(e.target.value);
              }
            }}
            rows={14}
            className="w-full flex-1 min-h-[260px] p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 resize-none leading-relaxed selection:bg-blue-900 selection:text-white"
            placeholder="Ketik system prompt di sini..."
          />

          <div className="mt-3 p-3 bg-slate-950 border border-slate-900 rounded-lg text-[11px] text-slate-400 leading-relaxed">
            💡 <strong className="text-slate-300">Tips:</strong> System prompt di atas langsung dikirim ke model Gemini saat Anda membuat website atau berinteraksi di ruang chat. Anda dapat menambahkan aturan khusus seperti gaya penulisan, library tambahan, atau persona tertentu.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            disabled={isSaved}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Simpan System Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
