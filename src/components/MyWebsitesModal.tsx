import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  ArrowRight, 
  Download, 
  Trash2, 
  Calendar, 
  Code2, 
  CheckCircle2, 
  FileCode, 
  Search,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { WebsiteProject } from '../types';

interface MyWebsitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: WebsiteProject[];
  currentProjectId?: string;
  onSelectProject: (project: WebsiteProject) => void;
  onDeleteProject: (projectId: string) => void;
  onDownloadProject: (project: WebsiteProject) => void;
}

export const MyWebsitesModal: React.FC<MyWebsitesModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onDeleteProject,
  onDownloadProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredProjects = projects.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      (p.summary && p.summary.toLowerCase().includes(query)) ||
      (p.prompt && p.prompt.toLowerCase().includes(query))
    );
  });

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Baru Saja';
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-black/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Web Saya
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-900 font-semibold">
                  {projects.length} Website Dibuat AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                Koleksi seluruh website interaktif yang telah dirancang dan dibuat oleh AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari website buatan AI berdasarkan nama atau topik..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-white underline transition-colors"
            >
              Reset Pencarian
            </button>
          )}
        </div>

        {/* Project List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0">
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
                <Globe className="w-7 h-7 text-blue-500/70" />
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-white mb-1">
                {searchQuery ? 'Tidak Ada Website yang Cocok' : 'Belum Ada Website Buatan AI'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                {searchQuery
                  ? `Tidak ada website yang cocok dengan kata kunci "${searchQuery}". Silakan coba kata kunci lain.`
                  : 'Gunakan Studio Web untuk meminta AI merancang website pertama Anda, atau pilih salah satu template yang tersedia.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Mulai Rancang Website Sekarang</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project) => {
                const isCurrent = project.id === currentProjectId;
                const fileCount = project.files?.length || 1;

                return (
                  <div
                    key={project.id}
                    className={`p-4 sm:p-5 bg-black border rounded-xl flex flex-col justify-between transition-all group relative ${
                      isCurrent
                        ? 'border-blue-600/80 bg-blue-950/10 shadow-lg shadow-blue-950/20'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top status badges */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isCurrent && (
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-600 text-white flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Sedang Dibuka
                            </span>
                          )}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {fileCount} File
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(project.createdAt)}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {project.title}
                      </h4>

                      {/* Summary or Prompt */}
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {project.summary || project.prompt}
                      </p>

                      {/* Sections tags */}
                      {project.sections && project.sections.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {project.sections.slice(0, 4).map((sec, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800"
                            >
                              {sec}
                            </span>
                          ))}
                          {project.sections.length > 4 && (
                            <span className="text-[10px] text-slate-500 py-0.5 px-1">
                              +{project.sections.length - 4} bagian
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {/* Download button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownloadProject(project);
                          }}
                          title="Unduh Kode HTML"
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete button (only if more than 1 project) */}
                        {projects.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Hapus website "${project.title}" dari riwayat Web Saya?`)) {
                                onDeleteProject(project.id);
                              }
                            }}
                            title="Hapus dari Web Saya"
                            className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Open in Studio Button */}
                      <button
                        onClick={() => {
                          onSelectProject(project);
                          onClose();
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                          isCurrent
                            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        <span>{isCurrent ? 'Lanjutkan Edit' : 'Buka Website'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
