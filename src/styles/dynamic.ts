import { createCanvas, loadImage } from 'canvas';
import { SongInfo, CardOptions } from '../types';

export async function generateDynamicCard(song: SongInfo, options: CardOptions = {}): Promise<Buffer> {
  const width = 1100;
  const height = 320;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = options.theme === 'light' ? '#fff' : '#181818';
  ctx.fillRect(0, 0, width, height);

  // Rounded corners
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(80, 0);
  ctx.arcTo(width, 0, width, height, 120);
  ctx.arcTo(width, height, 0, height, 120);
  ctx.arcTo(0, height, 0, 0, 120);
  ctx.arcTo(0, 0, width, 0, 120);
  ctx.closePath();
  ctx.clip();

  // Left: Circular album cover
  const coverImg = await loadImage(song.cover);
  const coverX = 120;
  const coverY = height / 2;
  const coverRadius = 110;
  ctx.save();
  ctx.beginPath();
  ctx.arc(coverX, coverY, coverRadius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(coverImg, coverX - coverRadius, coverY - coverRadius, coverRadius * 2, coverRadius * 2);
  ctx.restore();

  // Center: Song info
  ctx.font = 'bold 56px Sans-serif';
  ctx.fillStyle = options.accentColor || '#e74c3c';
  ctx.textAlign = 'left';
  ctx.fillText(song.title, 270, 150);

  ctx.font = 'bold 40px Sans-serif';
  ctx.fillStyle = '#b3b3b3';
  ctx.fillText(`By ${song.artist}`, 270, 210);

  // Right: Circular progress indicator
  const progressX = width - 180;
  const progressY = height / 2;
  const progressRadius = 80;
  ctx.save();
  ctx.beginPath();
  ctx.arc(progressX, progressY, progressRadius, 0, Math.PI * 2);
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 14;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(progressX, progressY, progressRadius, -Math.PI / 2, (song.progress / song.duration) * Math.PI * 2 - Math.PI / 2);
  ctx.strokeStyle = options.accentColor || '#e74c3c';
  ctx.lineWidth = 14;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
  return canvas.toBuffer('image/png');
} 