
export enum ThaiTone {
  Mid = 'Mid',
  Low = 'Low',
  Falling = 'Falling',
  High = 'High',
  Rising = 'Rising'
}

export interface ThaiWord {
  word: string;
  transliteration: string;
  tone: ThaiTone;
  translation: string;
}

export interface GameState {
  currentWord: ThaiWord | null;
  streak: number;
  timeLeft: number;
  status: 'playing' | 'correct' | 'wrong' | 'timeout';
  selectedTone: ThaiTone | null;
}
