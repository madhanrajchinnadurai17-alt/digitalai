import React, { useEffect, useRef, useState } from 'react';
import { GraphicTheme } from '@/lib/types';
import { GRAPHIC_THEMES } from '@/lib/mockData';
import { renderBrandedGraphic } from '@/lib/canvasUtils';
import { Download, Palette, Sparkles } from 'lucide-react';

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
      <div className="relative aspect-square w-full max-w-[430px] mx-auto rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-space-950 flex items-center justify-center group">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Overlay Download Button */}
        <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/20 shadow-xl transition"
            title="Download PNG graphic"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>

      {/* Theme Style Selector */}
      <div className="p-4 rounded-2xl bg-space-950/60 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Palette className="w-4 h-4 text-fuchsia-400" />
            <span>Creative Theme & Color Palette</span>
          </div>
          <span className="text-[11px] text-fuchsia-300 font-semibold">{selectedTheme.name}</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {GRAPHIC_THEMES.map((theme) => {
            const isSelected = selectedTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl border transition ${
                  isSelected
                    ? 'border-fuchsia-400 bg-fuchsia-500/15 ring-2 ring-fuchsia-400/40 shadow-lg'
                    : 'border-white/5 hover:border-white/20 bg-white/[0.02]'
                }`}
                title={theme.name}
              >
                <div
                  className="w-full h-8 rounded-lg border border-white/20 shadow-inner"
                  style={{ background: theme.background }}
                />
                <span className="text-[10px] text-slate-300 truncate max-w-full font-semibold">
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
