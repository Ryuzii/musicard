import { createCanvas, loadImage } from 'canvas';
import { SongInfo, CardOptions } from '../types';

export async function generateClassicAdvCard(song: SongInfo, options: CardOptions = {}): Promise<Buffer> {
  const width = 1100;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = options.theme === 'light' ? '#fff' : '#181818';
  ctx.fillRect(0, 0, width, height);

  // Rounded corners
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(30, 0);
  ctx.arcTo(width, 0, width, height, 40);
  ctx.arcTo(width, height, 0, height, 40);
  ctx.arcTo(0, height, 0, 0, 40);
  ctx.arcTo(0, 0, width, 0, 40);
  ctx.closePath();
  ctx.clip();

  // Left: Song info
  ctx.font = 'bold 64px Sans-serif';
  ctx.fillStyle = options.accentColor || '#e74c3c';
  ctx.textAlign = 'left';
  ctx.fillText(song.title, 60, 140);

  ctx.font = 'bold 48px Sans-serif';
  ctx.fillStyle = '#b3b3b3';
  ctx.fillText(`By ${song.artist}`, 60, 210);

  // Progress bar (below info)
  const barY = 300;
  const barX = 60;
  const barWidth = 600;
  const barHeight = 24;
  ctx.fillStyle = '#888';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  ctx.fillStyle = options.accentColor || '#e74c3c';
  ctx.fillRect(barX, barY, (song.progress / song.duration) * barWidth, barHeight);

  // Progress times
  ctx.font = 'bold 32px Sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.fillText('0:00', barX, barY + 50);
  ctx.textAlign = 'right';
  ctx.fillText(formatTime(song.duration), barX + barWidth, barY + 50);

  // Right: Album cover
  const coverImg = await loadImage(song.cover);
  const coverSize = 320;
  ctx.save();
  ctx.beginPath();
  ctx.arc(width - 180, 200, coverSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(coverImg, width - 340, 40, coverSize, coverSize);
  ctx.restore();

  ctx.restore();
  return canvas.toBuffer('image/png');
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(1, '0')}:${s.toString().padStart(2, '0')}`;
} 