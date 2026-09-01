import { GraphicTheme } from './types';

export interface RenderCanvasOptions {
  canvas: HTMLCanvasElement;
  businessName: string;
  themeTitle: string;
  theme: GraphicTheme;
  width?: number;
  height?: number;
}

export function renderBrandedGraphic({
  canvas,
  businessName,
  themeTitle,
  theme,
  width = 1080,
  height = 1080,
}: RenderCanvasOptions): string {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.clearRect(0, 0, width, height);

  // 1. Draw Background Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, theme.gradientStart);
  grad.addColorStop(1, theme.gradientEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw Decorative Ambient Glow Circles
  ctx.save();
  const glow1 = ctx.createRadialGradient(width * 0.8, height * 0.2, 50, width * 0.8, height * 0.2, 450);
  glow1.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
  glow1.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glow1;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.2, 450, 0, Math.PI * 2);
  ctx.fill();

  const glow2 = ctx.createRadialGradient(width * 0.2, height * 0.8, 50, width * 0.2, height * 0.8, 400);
  glow2.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
  glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow2;
  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.8, 400, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Subtle Inner Border
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, width - 120, height - 120);
  ctx.restore();

  // 4. Draw Top Business Badge (Pill Shape)
  ctx.save();
  const badgeText = businessName.toUpperCase();
  ctx.font = '600 28px Inter, system-ui, sans-serif';
  const badgeMetrics = ctx.measureText(badgeText);
  const badgeWidth = Math.max(badgeMetrics.width + 60, 260);
  const badgeHeight = 64;
  const badgeX = 100;
  const badgeY = 110;
  const radius = 32;

  // Badge background
  ctx.fillStyle = theme.badgeBg;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, radius);
  ctx.fill();

  // Badge border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Badge text
  ctx.fillStyle = theme.badgeText;
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, badgeX + 30, badgeY + badgeHeight / 2);

  // Sparkle icon dot
  ctx.fillStyle = theme.accentColor;
  ctx.beginPath();
  ctx.arc(badgeX + badgeWidth - 26, badgeY + badgeHeight / 2, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5. Draw Quote / Decorative Mark
  ctx.save();
  ctx.font = '800 120px Georgia, serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillText('“', 100, 320);
  ctx.restore();

  // 6. Main Headline Text (Word wrap)
  ctx.save();
  ctx.fillStyle = theme.textColor;
  ctx.font = '700 62px Inter, system-ui, -apple-system, sans-serif';
  ctx.textBaseline = 'top';

  const maxWidth = width - 220;
  const lineHeight = 80;
  const words = (themeTitle || 'Elevate Your Business Today').split(' ');
  let line = '';
  const lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  // Vertically position lines
  const startY = 360;
  lines.forEach((l, idx) => {
    ctx.fillText(l, 110, startY + idx * lineHeight);
  });
  ctx.restore();

  // 7. Accent Divider Line
  ctx.save();
  const dividerY = startY + lines.length * lineHeight + 50;
  const divGrad = ctx.createLinearGradient(110, dividerY, 350, dividerY);
  divGrad.addColorStop(0, theme.accentColor);
  divGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = divGrad;
  ctx.fillRect(110, dividerY, 240, 6);
  ctx.restore();

  // 8. Footer Call To Action & Watermark
  ctx.save();
  const footerY = height - 130;
  ctx.font = '600 32px Inter, system-ui, sans-serif';
  ctx.fillStyle = theme.accentColor;
  ctx.fillText('✨ TAP LINK IN BIO TO EXPLORE', 110, footerY);

  ctx.font = '500 24px Inter, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.textAlign = 'right';
  ctx.fillText(`@${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}`, width - 110, footerY);
  ctx.restore();

  return canvas.toDataURL('image/png');
}
