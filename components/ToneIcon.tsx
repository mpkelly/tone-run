
import React from 'react';
import { ThaiTone } from '../types';

interface ToneIconProps {
  tone: ThaiTone;
  className?: string;
}

export const ToneIcon: React.FC<ToneIconProps> = ({ tone, className = "w-12 h-4" }) => {
  switch (tone) {
    case ThaiTone.Mid:
      return (
        <svg className={className} viewBox="0 0 100 40">
          <line x1="10" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case ThaiTone.Low:
      return (
        <svg className={className} viewBox="0 0 100 40">
          <line x1="10" y1="30" x2="90" y2="30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case ThaiTone.Falling:
      return (
        <svg className={className} viewBox="0 0 100 40">
          <path d="M10 30 Q 50 10, 90 30" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case ThaiTone.High:
      return (
        <svg className={className} viewBox="0 0 100 40">
          <line x1="10" y1="10" x2="90" y2="10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case ThaiTone.Rising:
      return (
        <svg className={className} viewBox="0 0 100 40">
          <path d="M10 30 Q 50 50, 90 10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};
