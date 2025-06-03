export interface SongInfo {
  title: string;
  artist: string;
  album?: string;
  cover: string; // URL or local path
  progress: number; // seconds
  duration: number; // seconds
}

export interface CardOptions {
  theme?: 'dark' | 'light';
  rounded?: boolean;
  accentColor?: string;
  platform?: 'spotify' | 'youtube' | 'soundcloud' | 'applemusic';
} 