import { createCanvas, loadImage } from 'canvas';
import { SongInfo, CardOptions } from '../types';
import path from 'path';

export async function generateClassicCard(song: SongInfo, options: CardOptions = {}): Promise<Buffer> {
  const width = 1000;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = options.theme === 'light' ? '#fff' : '#181818';
  ctx.fillRect(0, 0, width, height);

  // Rounded corners
  if (options.rounded) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.arcTo(width, 0, width, height, 40);
    ctx.arcTo(width, height, 0, height, 40);
    ctx.arcTo(0, height, 0, 0, 40);
    ctx.arcTo(0, 0, width, 0, 40);
    ctx.closePath();
    ctx.clip();
  }

  // Album cover
  const coverImg = await loadImage(song.cover);
  ctx.drawImage(coverImg, 40, 40, 220, 220);

  // Platform icon (top right)
  if (options.platform) {
    const iconPath = path.join(__dirname, '../../assets', `${options.platform}.png`);
    try {
      const icon = await loadImage(iconPath);
      ctx.drawImage(icon, 900, 20, 64, 64);
    } catch (e) {
      // ignore if icon not found
    }
  }

  // Song info
  ctx.font = 'bold 36px Sans-serif';
  ctx.fillStyle = options.accentColor || '#e74c3c';
  ctx.textAlign = 'left';
  ctx.fillText(song.title, 300, 110);

  ctx.font = '36px Sans-serif';
  ctx.fillStyle = '#b3b3b3';
  ctx.fillText(`By ${song.artist}`, 300, 170);

  // Progress bar
  const barY = 240;
  const barX = 300;
  const barWidth = 600;
  const barHeight = 18;
  ctx.fillStyle = '#404040';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  ctx.fillStyle = options.accentColor || '#e74c3c';
  ctx.fillRect(barX, barY, (song.progress / song.duration) * barWidth, barHeight);

  // Progress times
  ctx.font = 'bold 24px Sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.fillText(formatTime(song.progress), barX, barY + 40);
  ctx.textAlign = 'right';
  ctx.fillText(formatTime(song.duration), barX + barWidth, barY + 40);

  if (options.rounded) ctx.restore();

  return canvas.toBuffer('image/png');
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(1, '0')}:${s.toString().padStart(2, '0')}`;
} 