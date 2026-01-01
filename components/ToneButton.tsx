
import React from 'react';
import { ThaiTone } from '../types';
import { ToneIcon } from './ToneIcon';

interface ToneButtonProps {
  tone: ThaiTone;
  onClick: (tone: ThaiTone) => void;
  disabled?: boolean;
  isSelected?: boolean;
  isCorrect?: boolean;
}

export const ToneButton: React.FC<ToneButtonProps> = ({ 
  tone, 
  onClick, 
  disabled, 
  isSelected, 
  isCorrect 
}) => {
  const getBaseStyles = () => {
    if (isCorrect) return 'bg-green-600 border-green-400 text-white';
    if (isSelected && !isCorrect) return 'bg-red-600 border-red-400 text-white';
    return 'bg-[#0f3d2a] border-[#2a6b4f] text-[#facc15]';
  };

  return (
    <button
      onClick={() => onClick(tone)}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all active:scale-95
        w-full aspect-square md:aspect-auto md:h-24
        ${getBaseStyles()}
        ${disabled && !isCorrect && !isSelected ? 'opacity-50 grayscale' : 'hover:brightness-110'}
      `}
    >
      <div className="mb-2">
        <ToneIcon tone={tone} className="w-8 h-4 md:w-12 md:h-6" />
      </div>
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{tone}</span>
    </button>
  );
};
