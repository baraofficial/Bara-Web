import React, { useRef, useState } from 'react';
import { 
  Laptop, 
  Tablet, 
  Smartphone, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  ExternalLink,
  ShieldCheck 
} from 'lucide-react';
import { ViewportMode } from '../types';

interface DeviceFrameProps {
  html: string;
  viewport: ViewportMode;
  onViewportChange: (viewport: ViewportMode) => void;
  title?: string;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  html,
  viewport,
  onViewportChange,
  title = 'Pratinjau Website',
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const getContainerWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[385px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-slate-950 transition-all ${
        isFullScreen ? 'fixed inset-0 z-50 p-4 bg-black/95' : 'relative'
      }`}
    >
      {/* Device & Browser Header */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        {/* Browser Address Bar Simulation */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>

          <div className="flex-1 bg-black border border-slate-800 rounded-md px-3 py-1 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="font-mono text-[11px] text-slate-300 truncate">
                https://preview.baraweb.ai/live
              </span>
            </div>
            <button
              onClick={handleRefresh}
              title="Muat Ulang Pratinjau"
              className="hover:text-white transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-slate-500 hover:text-blue-400" />
            </button>
          </div>
        </div>

        {/* Viewport Toggles & Fullscreen */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-black border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => onViewportChange('desktop')}
              title="Tampilan Desktop (100%)"
              className={`p-1.5 rounded transition-colors ${
                viewport === 'desktop'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewportChange('tablet')}
              title="Tampilan Tablet (768px)"
              className={`p-1.5 rounded transition-colors ${
                viewport === 'tablet'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewportChange('mobile')}
              title="Tampilan HP / Mobile (385px)"
              className={`p-1.5 rounded transition-colors ${
                viewport === 'mobile'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            className="p-1.5 bg-black border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            {isFullScreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-auto p-2 md:p-4 flex items-start justify-center bg-black">
        <div
          className={`${getContainerWidth()} h-full transition-all duration-200 bg-black border border-slate-800 rounded-lg overflow-hidden flex flex-col`}
        >
          <iframe
            key={refreshKey}
            ref={iframeRef}
            srcDoc={html}
            title={title}
            className="w-full flex-1 h-full bg-slate-950 border-0"
            sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
          />
        </div>
      </div>
    </div>
  );
};
