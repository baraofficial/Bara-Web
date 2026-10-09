import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Layers
} from 'lucide-react';
import JSZip from 'jszip';
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

  const lineCount = currentContent.split('\n').length;
  const charCount = currentContent.length;
  const isDirty = dirtyFiles[activeFileName] || false;

  return (
    <div className="flex flex-col h-full bg-black border border-slate-800 rounded-xl overflow-hidden">
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
            <span>{isZipping ? 'Mengepak...' : 'Download ZIP Proyek'}</span>
          </button>
        </div>
      </div>

      {/* Active File Toolbar */}
      <div className="h-10 bg-slate-950/80 border-b border-slate-900 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-900 text-blue-400 font-semibold">
            {getLanguageBadge(activeFileName)}
          </span>
          {activeFile?.description && (
            <span className="text-[11px] text-slate-400 hidden md:inline truncate max-w-md">
              {activeFile.description}
            </span>
          )}
          <span className="text-[11px] text-slate-600 font-mono">
            {lineCount} baris &bull; {(charCount / 1024).toFixed(1)} KB
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={handleApplyChanges}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors"
            >
              <Play className="w-3 h-3" />
              <span>Simpan & Terapkan</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded text-xs transition-colors"
          >
            {copied ? (
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
            onClick={handleDownloadActiveFile}
            title={`Unduh file ${activeFileName}`}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded text-xs transition-colors"
          >
            <Download className="w-3 h-3 text-blue-400" />
            <span>Unduh File Ini</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 relative overflow-hidden flex bg-black">
        {/* Line Numbers */}
        <div className="w-12 bg-slate-950/80 border-r border-slate-900 py-3 text-right pr-3 select-none text-[12px] font-mono text-slate-600 overflow-hidden shrink-0">
          {Array.from({ length: Math.min(lineCount, 600) }).map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
          {lineCount > 600 && <div className="text-[10px] text-slate-700">...</div>}
        </div>

        {/* Textarea Code */}
        <textarea
          value={currentContent}
          onChange={(e) => {
            const val = e.target.value;
            setFileContents((prev) => ({ ...prev, [activeFileName]: val }));
            setDirtyFiles((prev) => ({ ...prev, [activeFileName]: true }));
          }}
          spellCheck={false}
          className="flex-1 w-full h-full bg-black text-slate-200 font-mono text-xs p-3 leading-6 resize-none focus:outline-none focus:ring-0 selection:bg-blue-800 selection:text-white"
          placeholder="Kode sumber file akan muncul di sini..."
        />
      </div>
    </div>
  );
};
