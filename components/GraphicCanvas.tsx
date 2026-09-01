import React, { useEffect, useRef, useState } from 'react';
import { GraphicTheme } from '@/lib/types';
import { GRAPHIC_THEMES } from '@/lib/mockData';
import { renderBrandedGraphic } from '@/lib/canvasUtils';
import { Download, Palette, Sparkles, RefreshCw } from 'lucide-react';

interface GraphicCanvasProps {
  businessName: string;
  themeTitle: string;
  onImageReady?: (dataUrl: string) => void;
}

export function GraphicCanvas({
  businessName,
  themeTitle,
  onImageReady,
}: GraphicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<GraphicTheme>(GRAPHIC_THEMES[0]);
  const [dataUrl, setDataUrl] = useState<string>('');

  const renderCurrent = () => {
    if (!canvasRef.current) return;
    const url = renderBrandedGraphic({
      canvas: canvasRef.current,
      businessName: businessName || 'Your Brand',
      themeTitle: themeTitle || 'Elevate Your Business',
      theme: selectedTheme,
      width: 1080,
      height: 1080,
    });
    setDataUrl(url);
    if (onImageReady) {
      onImageReady(url);
    }
  };

  useEffect(() => {
    renderCurrent();
  }, [businessName, themeTitle, selectedTheme]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `${(businessName || 'markai').toLowerCase().replace(/\s+/g, '-')}-instagram-post.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Visual Canvas Container */}
      <div className="relative aspect-square w-full max-w-[440px] mx-auto rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 flex items-center justify-center group">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Overlay Action Bar */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-90 hover:opacity-100 transition">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-950/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700 shadow-lg transition"
            title="Download PNG graphic"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

      {/* Theme Style Selector */}
      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Palette className="w-4 h-4 text-brand-400" />
            <span>Creative Theme & Color Palette</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">{selectedTheme.name}</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {GRAPHIC_THEMES.map((theme) => {
            const isSelected = selectedTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={`flex flex-col items-center gap-1.5 p-1.5 rounded-lg border transition ${
                  isSelected
                    ? 'border-brand-400 bg-brand-500/10 ring-1 ring-brand-400/40'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                }`}
                title={theme.name}
              >
                <div
                  className="w-full h-7 rounded-md border border-white/20 shadow-inner"
                  style={{ background: theme.background }}
                />
                <span className="text-[10px] text-slate-400 truncate max-w-full font-medium">
                  {theme.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
