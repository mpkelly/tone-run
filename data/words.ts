
import { ThaiWord, ThaiTone } from '../types';

export const THAI_WORDS: ThaiWord[] = [
  { word: 'ไป', transliteration: 'pai', tone: ThaiTone.Mid, translation: 'go' },
  { word: 'ไก่', transliteration: 'kai', tone: ThaiTone.Low, translation: 'chicken' },
  { word: 'ได้', transliteration: 'dai', tone: ThaiTone.Falling, translation: 'can/get' },
  { word: 'โต๊ะ', transliteration: 'toh', tone: ThaiTone.High, translation: 'table' },
  { word: 'จ๋า', transliteration: 'jaa', tone: ThaiTone.Rising, translation: 'yes (polite)' },
  { word: 'มา', transliteration: 'maa', tone: ThaiTone.Mid, translation: 'come' },
  { word: 'สี่', transliteration: 'see', tone: ThaiTone.Low, translation: 'four' },
  { word: 'ข้าว', transliteration: 'khao', tone: ThaiTone.Falling, translation: 'rice/food' },
  { word: 'น้ำ', transliteration: 'naam', tone: ThaiTone.High, translation: 'water' },
  { word: 'สวย', transliteration: 'suay', tone: ThaiTone.Rising, translation: 'beautiful' },
  { word: 'กิน', transliteration: 'gin', tone: ThaiTone.Mid, translation: 'eat' },
  { word: 'ไข่', transliteration: 'khai', tone: ThaiTone.Low, translation: 'egg' },
  { word: 'หน้า', transliteration: 'naa', tone: ThaiTone.Falling, translation: 'face/front' },
  { word: 'ช้าง', transliteration: 'chaang', tone: ThaiTone.High, translation: 'elephant' },
  { word: 'หมู', transliteration: 'moo', tone: ThaiTone.Rising, translation: 'pig' },
  { word: 'นอน', transliteration: 'norn', tone: ThaiTone.Mid, translation: 'sleep' },
  { word: 'ปาก', transliteration: 'paak', tone: ThaiTone.Low, translation: 'mouth' },
  { word: 'เล่น', transliteration: 'len', tone: ThaiTone.Falling, translation: 'play' },
  { word: 'รัก', transliteration: 'rak', tone: ThaiTone.High, translation: 'love' },
  { word: 'ขาว', transliteration: 'khao', tone: ThaiTone.Rising, translation: 'white' }
];

export const getRandomWord = (exclude?: ThaiWord): ThaiWord => {
  const filtered = exclude ? THAI_WORDS.filter(w => w.word !== exclude.word) : THAI_WORDS;
  return filtered[Math.floor(Math.random() * filtered.length)];
};
