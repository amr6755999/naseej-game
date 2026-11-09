import type { GridPoint, Level } from './game/levels';
import type { Language } from './storage';

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

export async function sharePattern(level: Level, language: Language): Promise<'shared' | 'downloaded' | 'copied'> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');

  const background = ctx.createLinearGradient(0, 0, 1080, 1350);
  background.addColorStop(0, '#0b1423');
  background.addColorStop(0.55, '#101e2c');
  background.addColorStop(1, '#080e19');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow = ctx.createRadialGradient(540, 650, 40, 540, 650, 520);
  glow.addColorStop(0, 'rgba(98,234,216,.13)');
  glow.addColorStop(1, 'rgba(98,234,216,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 180, 1080, 980);

  ctx.fillStyle = '#62ead8';
  ctx.font = '700 50px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('N A S E E J', 540, 116);
  ctx.fillStyle = '#e8c78b';
  ctx.font = '500 20px system-ui, sans-serif';
  ctx.fillText('ONE LINE  ·  ENDLESS SYMMETRY', 540, 158);

  ctx.strokeStyle = 'rgba(141,177,188,.12)';
  ctx.lineWidth = 1;
  for (let x = 120; x <= 960; x += 70) {
    ctx.beginPath(); ctx.moveTo(x, 230); ctx.lineTo(x, 1090); ctx.stroke();
  }
  for (let y = 250; y <= 1090; y += 70) {
    ctx.beginPath(); ctx.moveTo(100, y); ctx.lineTo(980, y); ctx.stroke();
  }

  const center = 540;
  const top = 320;
  const xGap = 62;
  const yGap = 90;
  const pos = (point: GridPoint, mirror = false) => ({ x: center + (mirror ? 1 : -1) * point.x * xGap, y: top + point.y * yGap });
  const drawSide = (mirror: boolean) => {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(98,234,216,.8)';
    ctx.shadowBlur = 22;
    ctx.strokeStyle = '#62ead8';
    ctx.lineWidth = 8;
    ctx.beginPath();
    const first = pos(level.route[0]!, mirror);
    ctx.moveTo(first.x, first.y);
    for (const point of level.route.slice(1)) {
      const p = pos(point, mirror);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    for (const point of level.route) {
      const p = pos(point, mirror);
      ctx.fillStyle = '#b6fff4';
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  };
  drawSide(false);
  drawSide(true);
  ctx.strokeStyle = 'rgba(232,199,139,.45)';
  ctx.setLineDash([8, 16]);
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(center, 245); ctx.lineTo(center, 1090); ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#f5f7fa';
  ctx.font = '700 44px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.direction = language === 'ar' ? 'rtl' : 'ltr';
  ctx.fillText(level.title[language], 540, 1190);
  ctx.fillStyle = '#8fa2b8';
  ctx.font = '500 24px system-ui, sans-serif';
  ctx.fillText(language === 'ar' ? `المرحلة ${level.id} · نقش مكتمل` : `LEVEL ${level.id} · PATTERN COMPLETE`, 540, 1238);

  ctx.strokeStyle = 'rgba(98,234,216,.28)';
  ctx.lineWidth = 2;
  roundedRect(ctx, 82, 48, 916, 1254, 38);
  ctx.stroke();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Could not create share image')), 'image/png');
  });
  const file = new File([blob], `naseej-pattern-${String(level.id).padStart(2, '0')}.png`, { type: 'image/png' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title: language === 'ar' ? 'نقشي من نَسِيج' : 'My NASEEJ pattern', files: [file] });
    return 'shared';
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = file.name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
