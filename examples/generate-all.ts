import { generateClassicCard, generateClassicAdvCard, generateDynamicCard, SongInfo, CardOptions } from '../src';
import { writeFileSync } from 'fs';

const song: SongInfo = {
  title: 'Bla Bla Bla Bla',
  artist: 'Sagopa Kajmer, Şehinşah',
  album: 'Kağıt Kesikleri',
  cover: 'https://static.vecteezy.com/system/resources/thumbnails/000/435/728/small_2x/1404.i033.096.S.m003.c10.Headphones_grunge.jpg',
  progress: 121,
  duration: 263,
};

const classicOptions: CardOptions = {
  theme: 'dark',
  rounded: true,
  platform: 'spotify', // Show platform icon only for classic
};

const advOptions: CardOptions = {
  theme: 'dark',
  rounded: true,
};

(async () => {
  writeFileSync('examples/classic.png', await generateClassicCard(song, classicOptions));
  writeFileSync('examples/classic-adv.png', await generateClassicAdvCard(song, advOptions));
  writeFileSync('examples/dynamic.png', await generateDynamicCard(song, advOptions));
  console.log('All example cards generated!');
})(); 