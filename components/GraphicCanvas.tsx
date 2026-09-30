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
      <div className="relative aspect-square w-full max-w-[430px] mx-auto rounded-xl overflow-hidden border border-line bg-surface flex items-center justify-center group">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />

        {/* Overlay Download Button */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-surface hover:bg-black text-white border border-white/20 transition"
            title="Download PNG graphic"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>

      {/* Theme Style Selector */}
      <div className="p-3.5 rounded-xl bg-surface border border-line">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-medium text-ink">
            <Palette className="w-3.5 h-3.5 text-ink" />
            <span>Canvas Style Preset</span>
          </div>
          <span className="text-[11px] text-muted font-mono">{selectedTheme.name}</span>
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
                    ? 'border-line bg-surface ring-1 ring-ink'
                    : 'border-line hover:border-line bg-surface'
                }`}
                title={theme.name}
              >
                <div
                  className="w-full h-7 rounded-lg border border-line"
                  style={{ background: theme.background }}
                />
                <span className="text-[10px] text-ink truncate max-w-full font-mono">
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
