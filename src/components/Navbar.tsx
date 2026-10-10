import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  MessageSquare, 
  Code2, 
  Sliders, 
  Download, 
  RotateCcw,
  LayoutGrid,
  Check,
  Globe
} from 'lucide-react';
import { AppMode } from '../types';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenTemplates: () => void;
  onOpenMyWebsites: () => void;
  onDownloadHtml: () => void;
  onResetProject: () => void;
  onOpenSystemPrompt: () => void;
  hasWebsite: boolean;
  websitesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  onOpenTemplates,
  onOpenMyWebsites,
  onDownloadHtml,
  onResetProject,
  onOpenSystemPrompt,
  hasWebsite,
  websitesCount = 0,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSelectMode = (mode: AppMode) => {
    onSelectMode(mode);
    setIsMenuOpen(false);
  };

  const handleOpenTemplates = () => {
    onOpenTemplates();
    setIsMenuOpen(false);
  };

  const handleOpenMyWebsites = () => {
    onOpenMyWebsites();
    setIsMenuOpen(false);
  };

  const handleOpenSystemPrompt = () => {
    onOpenSystemPrompt();
    setIsMenuOpen(false);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-black px-4 md:px-6 flex items-center justify-between select-none shrink-0 z-40 relative">
      {/* Pojok Kiri Atas: Ikon Garis 3 Ditumpuk & Brand Bara Web */}
      <div className="flex items-center gap-3" ref={menuRef}>
        {/* Ikon Garis 3 Ditumpuk (Hamburger Menu) */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Menu Utama (Garis 3 Ditumpuk)"
            className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${
              isMenuOpen
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Dropdown Menu Didalam Ikon Garis 3 */}
          {isMenuOpen && (
            <div className="absolute left-0 top-12 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-xl p-2 z-50 shadow-none">
              <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-900 mb-1">
                Navigasi Bara Web
              </div>

              {/* Tombol 1: AI Chat */}
              <button
                onClick={() => handleSelectMode('chat')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors mb-1 ${
                  currentMode === 'chat'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-blue-400 group-hover:text-white" />
                  <span>AI Chat</span>
                </div>
                {currentMode === 'chat' && <Check className="w-3.5 h-3.5 text-white" />}
              </button>

              {/* Tombol 2: Studio Web */}
              <button
                onClick={() => handleSelectMode('studio')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors mb-1 ${
                  currentMode === 'studio'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="w-4 h-4 text-blue-400 group-hover:text-white" />
                  <span>Studio Web</span>
                </div>
                {currentMode === 'studio' && <Check className="w-3.5 h-3.5 text-white" />}
              </button>

              {/* Tombol 3: Template (Ikon Kotak 4 Dipindahkan ke sini) */}
              <button
                onClick={handleOpenTemplates}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors mb-1"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutGrid className="w-4 h-4 text-blue-400" />
                  <span>Template Desain</span>
                </div>
                <span className="text-[10px] text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-900">
                  Koleksi
                </span>
              </button>

              {/* Tombol 4: Web Saya (Di bawah Template Desain untuk melihat semua website buatan AI) */}
              <button
                onClick={handleOpenMyWebsites}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors mb-1"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Web Saya</span>
                </div>
                <span className="text-[10px] text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-900">
                  {websitesCount} Web
                </span>
              </button>

              {/* Tombol 4: System Prompt */}
              <button
                onClick={handleOpenSystemPrompt}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span>System Prompt</span>
                </div>
                <span className="text-[10px] text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-900">
                  Konfigurasi
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Brand Name: Bara Web (Tulisan AI Dihapus) */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white border border-blue-500/40">
            <span className="font-extrabold text-sm tracking-tight text-white font-mono">B</span>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white">
              Bara <span className="text-blue-500">Web</span>
            </span>
          </div>
        </div>
      </div>

      {/* Middle Tab Switcher */}
      <div className="hidden sm:flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
        <button
          onClick={() => onSelectMode('studio')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            currentMode === 'studio'
              ? 'bg-blue-600 text-white shadow-none'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Studio Web</span>
        </button>

        <button
          onClick={() => onSelectMode('chat')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            currentMode === 'chat'
              ? 'bg-blue-600 text-white shadow-none'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>AI Chat</span>
        </button>
      </div>

      {/* Quick Actions di kanan (Ikon Kotak 4 sudah dipindahkan ke dalam menu garis 3) */}
      <div className="flex items-center gap-2">
        {hasWebsite && (
          <>
            <button
              onClick={onDownloadHtml}
              title="Unduh Kode HTML"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Download HTML</span>
            </button>

            <button
              onClick={onResetProject}
              title="Mulai Ulang Proyek"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
