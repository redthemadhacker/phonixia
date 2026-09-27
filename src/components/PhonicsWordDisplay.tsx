import React from 'react';
import { PhonicsLetter } from './PhonicsLetter';

interface PhonicsWordDisplayProps {
  text: string;
  size?: number; // Size of each individual letter card
  className?: string;
  showSubtitle?: boolean;
}

export const PhonicsWordDisplay: React.FC<PhonicsWordDisplayProps> = ({
  text,
  size = 40,
  className = '',
  showSubtitle = false
}) => {
  if (!text) return null;

  // Clean and split words
  const words = text.trim().split(/\s+/);

  return (
    <div className={`inline-flex flex-wrap items-center justify-center gap-2 select-none ${className}`}>
      {words.map((word, wIdx) => {
        // Check if word contains alphabet letters
        const letters = word.split('');
        return (
          <div key={wIdx} className="inline-flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-amber-400/40 shadow-md">
            {letters.map((char, cIdx) => {
              const upper = char.toUpperCase();
              if (upper >= 'A' && upper <= 'Z') {
                return (
                  <PhonicsLetter
                    key={cIdx}
                    letter={upper}
                    size={size}
                    showBadge={size >= 36}
                    animate={false}
                  />
                );
              }
              // Non-alphabetic character (e.g. '-', '/', '+')
              return (
                <span
                  key={cIdx}
                  style={{ fontSize: `${Math.max(14, size * 0.45)}px` }}
                  className="font-black text-amber-300 px-1 font-mono"
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      })}
      {showSubtitle && (
        <span className="w-full text-center text-xs font-mono font-bold text-amber-300 mt-0.5 tracking-widest uppercase">
          {text}
        </span>
      )}
    </div>
  );
};

export default PhonicsWordDisplay;
