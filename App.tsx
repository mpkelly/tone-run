
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ThaiTone, ThaiWord, GameState } from './types';
import { getRandomWord } from './data/words';
import { playThaiWord, stopAudio } from './services/ttsService';
import { ToneButton } from './components/ToneButton';

const TIMER_DURATION = 10;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentWord: null,
    streak: 0,
    timeLeft: TIMER_DURATION,
    status: 'playing',
    selectedTone: null,
  });

  const timerRef = useRef<number | null>(null);

  const startNewRound = useCallback((resetStreak = false) => {
    // Stop any audio before switching words
    stopAudio();
    
    const nextWord = getRandomWord(gameState.currentWord || undefined);
    setGameState(prev => ({
      ...prev,
      currentWord: nextWord,
      status: 'playing',
      timeLeft: TIMER_DURATION,
      selectedTone: null,
      streak: resetStreak ? 0 : prev.streak
    }));
    playThaiWord(nextWord.word);
  }, [gameState.currentWord]);

  // Initial load
  useEffect(() => {
    startNewRound();
    return () => stopAudio(); // Cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameState.status === 'playing' && gameState.timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 0.1) {
            clearInterval(timerRef.current!);
            return { ...prev, timeLeft: 0, status: 'timeout' };
          }
          return { ...prev, timeLeft: prev.timeLeft - 0.1 };
        });
      }, 100);
    } else if (gameState.status !== 'playing' && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.status, gameState.timeLeft]);

  const handleToneSelect = (tone: ThaiTone) => {
    if (gameState.status !== 'playing') return;

    if (tone === gameState.currentWord?.tone) {
      setGameState(prev => ({
        ...prev,
        status: 'correct',
        selectedTone: tone,
        streak: prev.streak + 1
      }));
      // Auto-advance after delay
      setTimeout(() => startNewRound(), 1200);
    } else {
      setGameState(prev => ({
        ...prev,
        status: 'wrong',
        selectedTone: tone
      }));
    }
  };

  const handleReplay = () => {
    if (gameState.currentWord) {
      playThaiWord(gameState.currentWord.word);
    }
  };

  const progressPercentage = (gameState.timeLeft / TIMER_DURATION) * 100;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto px-6 py-8 select-none text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">
          Tone Run
        </h1>
        <div className="text-right">
          <span className="text-sm font-bold opacity-80 uppercase tracking-widest mr-2">Streak</span>
          <span className="text-3xl font-black text-[#facc15] leading-none">{gameState.streak}</span>
        </div>
      </div>

      {/* Main Word Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {gameState.currentWord && (
          <div 
            onClick={handleReplay}
            className="cursor-pointer group flex flex-col items-center"
          >
            <span className="text-8xl md:text-9xl font-bold mb-1 drop-shadow-xl transition-transform group-active:scale-95">
              {gameState.currentWord.word}
            </span>
            
            <span className="text-xl md:text-2xl font-bold text-white/50 mb-6 uppercase tracking-widest">
              {gameState.currentWord.translation}
            </span>
            
            {/* Feedback Info */}
            <div className="h-12 flex flex-col items-center justify-center text-center">
              {gameState.status === 'correct' && (
                <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-bounce">
                  CORRECT!
                </div>
              )}
              {(gameState.status === 'wrong' || gameState.status === 'timeout') && (
                <div className="text-red-300 font-medium space-y-1">
                  <div className="text-sm uppercase tracking-widest opacity-80">Correct Tone</div>
                  <div className="text-xl font-bold text-white uppercase">{gameState.currentWord.tone}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/20 h-1.5 rounded-full mb-12 overflow-hidden">
        <div 
          className="h-full bg-[#facc15] transition-all duration-100 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Tone Selection / Next Button */}
      <div className="mb-8">
        {gameState.status === 'playing' || gameState.status === 'correct' ? (
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {Object.values(ThaiTone).map((tone) => (
              <ToneButton
                key={tone}
                tone={tone}
                onClick={handleToneSelect}
                disabled={gameState.status !== 'playing'}
                isSelected={gameState.selectedTone === tone}
                isCorrect={gameState.status === 'correct' && gameState.selectedTone === tone}
              />
            ))}
          </div>
        ) : (
          <button
            onClick={() => startNewRound(true)}
            className="w-full bg-[#facc15] text-[#1e5e41] font-black py-4 rounded-xl text-xl uppercase tracking-widest hover:bg-white transition-colors"
          >
            Next Word
          </button>
        )}
      </div>

      {/* Help Tip */}
      <p className="text-center text-xs opacity-40 font-medium">
        Tap the word to replay audio
      </p>
    </div>
  );
};

export default App;
