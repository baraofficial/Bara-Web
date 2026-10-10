import React, { useRef, useState } from 'react';
import { 
  Laptop, 
  Tablet, 
  Smartphone, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  ExternalLink,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { ViewportMode } from '../types';

interface DeviceFrameProps {
  html: string;
  viewport: ViewportMode;
  onViewportChange: (viewport: ViewportMode) => void;
  title?: string;
  onBackToChat?: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  html,
  viewport,
  onViewportChange,
  title = 'Pratinjau Website',
  onBackToChat,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenNewTab = () => {
    try {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (!win) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.click();
      }
    } catch {
      // fallback
    }
  };

  const getContainerWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[390px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div
      className={`flex flex-col h-full w-full min-h-0 bg-black transition-all ${
        isFullScreen ? 'fixed inset-0 z-50 bg-black' : 'relative flex-1'
      }`}
    >
      {/* Device & Browser Header */}
      <div className="h-10 sm:h-11 bg-slate-950 border-b border-slate-800 px-2 sm:px-4 flex items-center justify-between shrink-0 gap-2">
        {/* Tombol Kembali ke Obrolan (jika disediakan) */}
        {onBackToChat && (
          <button
            onClick={onBackToChat}
            title="Kembali ke Obrolan AI"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-blue-600 transition-colors shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden xs:inline">Obrolan</span>
          </button>
        )}

        {/* Browser Address Bar Simulation */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-sm sm:max-w-md">
          <div className="hidden xs:flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>

          <div className="flex-1 bg-black border border-slate-800 rounded-md px-2 sm:px-3 py-1 flex items-center justify-between text-xs text-slate-400 min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="font-mono text-[10px] sm:text-[11px] text-slate-300 truncate">
                preview.baraweb.ai/live
              </span>
            </div>
            <button
              onClick={handleRefresh}
              title="Muat Ulang Pratinjau"
              className="hover:text-white transition-colors shrink-0 ml-1.5 p-0.5 rounded hover:bg-slate-800"
            >
              <RefreshCw className="w-3 h-3 text-slate-400 hover:text-blue-400" />
            </button>
          </div>
        </div>

        {/* Viewport Toggles & Fullscreen */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="flex items-center bg-black border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => onViewportChange('desktop')}
              title="Desktop (100%)"
              className={`p-1 sm:p-1.5 rounded transition-colors ${
                viewport === 'desktop'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewportChange('tablet')}
              title="Tablet (768px)"
              className={`p-1 sm:p-1.5 rounded transition-colors ${
                viewport === 'tablet'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewportChange('mobile')}
              title="Mobile (390px)"
              className={`p-1 sm:p-1.5 rounded transition-colors ${
                viewport === 'mobile'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleOpenNewTab}
            title="Buka di Tab Baru"
            className="p-1 sm:p-1.5 bg-black border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            className="p-1 sm:p-1.5 bg-black border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center"
          >
            {isFullScreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Frame Container - Fills 100% of height without collapsing */}
      <div className="flex-1 w-full min-h-0 flex flex-col items-center bg-black p-0 sm:p-2 md:p-3 overflow-hidden relative">
        <div
          className={`${getContainerWidth()} w-full h-full min-h-0 bg-slate-950 sm:border sm:border-slate-800 sm:rounded-lg overflow-hidden relative flex-1`}
        >
          <iframe
            key={refreshKey}
            ref={iframeRef}
            srcDoc={html}
            title={title}
            className="absolute inset-0 w-full h-full border-0 bg-slate-950 block"
            style={{ width: '100%', height: '100%', minHeight: '100%', border: 'none' }}
            sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
          />
        </div>
      </div>
    </div>
  );
};
