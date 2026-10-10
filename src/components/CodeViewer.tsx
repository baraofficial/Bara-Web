import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Play, 
  FileCode, 
  FolderArchive,
  Database,
  Terminal,
  FileText,
  Package,
  Globe,
  Eye,
  Edit3,
  Sparkles
} from 'lucide-react';
import JSZip from 'jszip';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';
import { ProjectFile } from '../types';

interface CodeViewerProps {
  files?: ProjectFile[];
  code: string; // fallback if files array not present
  projectTitle?: string;
  onUpdateCode: (newHtml: string) => void;
  onUpdateFile?: (fileName: string, newContent: string) => void;
  onDownloadSingle?: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  files = [],
  code,
  projectTitle = 'Bara Web Project',
  onUpdateCode,
  onUpdateFile,
  onDownloadSingle,
}) => {
  // Ensure we have at least index.html if files array is empty
  const projectFiles: ProjectFile[] = files.length > 0 ? files : [
    {
      name: 'index.html',
      language: 'html',
      description: 'Frontend HTML5 & Tailwind CSS',
      content: code,
    }
  ];

  const [activeFileName, setActiveFileName] = useState<string>('index.html');
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [dirtyFiles, setDirtyFiles] = useState<Record<string, boolean>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Refs for scrolling synchronization in edit mode
  const editLineNumbersRef = useRef<HTMLDivElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when files or code change
  useEffect(() => {
    const map: Record<string, string> = {};
    projectFiles.forEach((f) => {
      map[f.name] = f.content;
    });
    setFileContents(map);
    setDirtyFiles({});

    // If current active file no longer exists, reset to first file
    if (!projectFiles.some((f) => f.name === activeFileName)) {
      setActiveFileName(projectFiles[0]?.name || 'index.html');
    }
  }, [files, code]);

  const activeFile = projectFiles.find((f) => f.name === activeFileName) || projectFiles[0];
  const currentContent = fileContents[activeFileName] ?? activeFile?.content ?? '';

  // Determine Prism language based on filename extension
  const getPrismLanguage = (fileName: string): string => {
    if (fileName.endsWith('.html') || fileName.endsWith('.htm') || fileName.endsWith('.xml') || fileName.endsWith('.svg')) return 'markup';
    if (fileName.endsWith('.py')) return 'python';
    if (fileName.endsWith('.js') || fileName.endsWith('.ts') || fileName.endsWith('.jsx') || fileName.endsWith('.tsx')) return 'javascript';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.sql')) return 'sql';
    if (fileName.endsWith('.json')) return 'json';
    return 'markup';
  };

  const currentLanguage = getPrismLanguage(activeFileName);

  // Pre-highlight code using Prism
  const highlightedCodeHtml = useMemo(() => {
    try {
      const grammar = Prism.languages[currentLanguage] || Prism.languages.markup;
      return Prism.highlight(currentContent, grammar, currentLanguage);
    } catch {
      return currentContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  }, [currentContent, currentLanguage]);

  const lineCount = useMemo(() => {
    return currentContent.split('\n').length;
  }, [currentContent]);

  const charCount = currentContent.length;
  const isDirty = dirtyFiles[activeFileName] || false;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleApplyChanges = () => {
    if (activeFileName === 'index.html') {
      onUpdateCode(currentContent);
    }
    if (onUpdateFile) {
      onUpdateFile(activeFileName, currentContent);
    }
    setDirtyFiles((prev) => ({ ...prev, [activeFileName]: false }));
  };

  // Synchronize scrolling in edit mode: when user scrolls textarea, scroll line numbers
  const handleEditScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (editLineNumbersRef.current) {
      editLineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Download entire full-stack project as ZIP
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      projectFiles.forEach((file) => {
        const content = fileContents[file.name] ?? file.content;
        zip.file(file.name, content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = (projectTitle || 'bara-web-project').toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.href = url;
      link.download = `${safeName}-fullstack.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Gagal membuat ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  // Download single active file
  const handleDownloadActiveFile = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.html')) return <Globe className="w-3.5 h-3.5 text-blue-400" />;
    if (name.endsWith('.py')) return <Terminal className="w-3.5 h-3.5 text-amber-400" />;
    if (name.endsWith('.js') || name.endsWith('.ts')) return <FileCode className="w-3.5 h-3.5 text-emerald-400" />;
    if (name.endsWith('.sql')) return <Database className="w-3.5 h-3.5 text-purple-400" />;
    if (name.endsWith('.json')) return <Package className="w-3.5 h-3.5 text-yellow-400" />;
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  const getLanguageBadge = (name: string) => {
    if (name.endsWith('.py')) return 'Python (FastAPI)';
    if (name.endsWith('.js')) return 'Node.js (Express)';
    if (name.endsWith('.html')) return 'HTML5 & Tailwind';
    if (name.endsWith('.sql')) return 'SQL (Database)';
    if (name.endsWith('.json')) return 'JSON Config';
    if (name.endsWith('.txt')) return 'Dependencies';
    if (name.endsWith('.md')) return 'Markdown';
    return 'Text';
  };

  return (
    <div className="flex flex-col h-full w-full min-h-0 bg-black border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* File Tabs Explorer Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto shrink-0 select-none">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {projectFiles.map((f) => {
            const isActive = f.name === activeFileName;
            const hasUnsaved = dirtyFiles[f.name];
            return (
              <button
                key={f.name}
                onClick={() => setActiveFileName(f.name)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-none font-semibold'
                    : 'bg-black/60 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80'
                }`}
              >
                {getFileIcon(f.name)}
                <span>{f.name}</span>
                {hasUnsaved && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Tombol Download Full Project ZIP */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            title="Download Semua File Proyek sebagai .ZIP (Python, Node.js, SQL, HTML)"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isZipping ? 'Mengepak...' : 'Download ZIP Proyek'}</span>
            <span className="sm:hidden">{isZipping ? 'ZIP...' : 'ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Active File Toolbar */}
      <div className="min-h-10 bg-slate-950/90 border-b border-slate-900 px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-900 text-blue-400 font-semibold">
            {getLanguageBadge(activeFileName)}
          </span>
          {activeFile?.description && (
            <span className="text-[11px] text-slate-400 hidden md:inline truncate max-w-xs">
              {activeFile.description}
            </span>
          )}
          <span className="text-[11px] text-slate-500 font-mono">
            {lineCount} baris &bull; {(charCount / 1024).toFixed(1)} KB
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Toggle Mode: Berwarna (Highlight) vs Edit Kode */}
          <button
            onClick={() => setIsEditMode((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              isEditMode
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                : 'bg-blue-950/80 hover:bg-blue-900/80 text-blue-300 border border-blue-800/80'
            }`}
            title={isEditMode ? 'Beralih ke mode lihat kode berwarna' : 'Beralih ke mode edit teks'}
          >
            {isEditMode ? (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-200" />
                <span>Mode Berwarna</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white font-medium">Berwarna (Aktif)</span>
                <span className="text-slate-400 text-[10px] hidden xs:inline border-l border-blue-800 pl-1.5">Klik utk Edit</span>
              </>
            )}
          </button>

          {/* Tombol Simpan & Terapkan bila ada editan */}
          {isDirty && (
            <button
              onClick={handleApplyChanges}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors animate-pulse"
              title="Terapkan perubahan ke pratinjau live"
            >
              <Play className="w-3 h-3" />
              <span>Simpan & Terapkan</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg text-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Salin</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadActiveFile}
            title={`Unduh file ${activeFileName}`}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg text-xs transition-colors"
          >
            <Download className="w-3 h-3 text-blue-400" />
            <span className="hidden xs:inline">Unduh</span>
          </button>
        </div>
      </div>

      {/* Code Editor / Viewer Body */}
      <div className="flex-1 min-h-0 w-full relative overflow-hidden bg-black flex">
        {!isEditMode ? (
          /* MODE BERWARNA (Syntax Highlighted dengan sinkronisasi gulir nomor baris & kode) */
          <div 
            className="flex-1 w-full h-full overflow-auto bg-black flex relative font-mono text-xs select-text"
          >
            {/* Kolom Nomor Baris (Sticky di kiri, ikut tergulir vertikal saat user gulir kode ke bawah) */}
            <div 
              className="sticky left-0 top-0 self-start z-10 flex flex-col py-3 select-none text-right font-mono text-slate-600 bg-slate-950 border-r border-slate-900 shrink-0"
              style={{ minHeight: '100%' }}
            >
              {Array.from({ length: lineCount }).map((_, i) => (
                <div 
                  key={i} 
                  className="leading-6 text-[11px] sm:text-xs h-6 px-2.5 sm:px-3 min-w-[2.75rem] sm:min-w-[3.25rem] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Blok Kode Berwarna (Prism Syntax Highlighting) */}
            <pre 
              tabIndex={0}
              className="py-3 px-3 sm:px-4 m-0 flex-1 min-w-max font-mono text-xs leading-6 bg-transparent overflow-visible text-slate-200 outline-none"
            >
              <code 
                className={`language-${currentLanguage}`}
                dangerouslySetInnerHTML={{ __html: highlightedCodeHtml }}
              />
            </pre>
          </div>
        ) : (
          /* MODE EDIT (Textarea editable dengan nomor baris yang ikut tergulir serentak) */
          <div className="flex-1 w-full h-full min-h-0 relative overflow-hidden flex bg-black">
            {/* Nomor Baris di Mode Edit (Tergulir bersamaan dengan textarea) */}
            <div 
              ref={editLineNumbersRef}
              className="w-11 sm:w-13 bg-slate-950 border-r border-slate-900 py-3 text-right pr-2 sm:pr-3 select-none text-[11px] sm:text-xs font-mono text-slate-500 overflow-hidden shrink-0 pointer-events-none"
            >
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i} className="leading-6 h-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Textarea Kode */}
            <textarea
              ref={editTextareaRef}
              value={currentContent}
              onScroll={handleEditScroll}
              onChange={(e) => {
                const val = e.target.value;
                setFileContents((prev) => ({ ...prev, [activeFileName]: val }));
                setDirtyFiles((prev) => ({ ...prev, [activeFileName]: true }));
              }}
              spellCheck={false}
              className="flex-1 w-full h-full bg-black text-slate-100 font-mono text-xs p-3 leading-6 resize-none focus:outline-none focus:ring-0 selection:bg-blue-800 selection:text-white overflow-auto"
              placeholder="Ketik atau edit kode file di sini..."
            />
          </div>
        )}
      </div>
    </div>
  );
};
