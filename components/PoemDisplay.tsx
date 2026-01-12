
import React from 'react';
import { Poem, LineTiming, DifficultWord } from '../types';
import { Volume2 } from 'lucide-react';

interface PoemDisplayProps {
  poem: Poem;
  difficultWords: DifficultWord[];
  currentTime: number;
  onWordClick: (word: string) => void;
}

const PoemDisplay: React.FC<PoemDisplayProps> = ({ poem, currentTime, onWordClick }) => {
  
  const isLineActive = (line: LineTiming) => currentTime >= line.start && currentTime <= line.end;

  const renderWord = (line: LineTiming, word: any, wordIndex: number) => {
    let wordStartTime = line.start;
    for (let i = 0; i < wordIndex; i++) {
      wordStartTime += line.words[i].duration;
    }
    const wordEndTime = wordStartTime + word.duration;
    const isWordActive = currentTime >= wordStartTime && currentTime <= wordEndTime;

    return (
      <span
        key={wordIndex}
        onClick={() => word.difficult && onWordClick(word.text)}
        className={`inline-block mx-1 transition-all duration-150 transform cursor-pointer ${
          isWordActive 
            ? 'text-red-600 scale-125 font-black drop-shadow-sm' 
            : word.difficult 
              ? 'text-orange-600 font-extrabold border-b-4 border-orange-200 hover:bg-orange-50 px-1 rounded-lg' 
              : 'text-gray-800'
        }`}
      >
        {word.text}
        {word.difficult && isWordActive && (
          <Volume2 size={24} className="inline-block ml-1 animate-bounce text-red-500" />
        )}
      </span>
    );
  };

  const renderStanza = (lines: LineTiming[], title: string, colorClass: string) => (
    <div className={`flex flex-col gap-6 w-full max-w-4xl p-10 rounded-[60px] border-4 border-dashed transition-all duration-700 bg-white/30 ${colorClass}`}>
      <div className="flex items-center justify-center gap-4 mb-4 opacity-60">
        <div className="h-1 w-12 bg-current rounded-full"></div>
        <div className="font-black text-2xl uppercase tracking-widest">{title}</div>
        <div className="h-1 w-12 bg-current rounded-full"></div>
      </div>
      <div className="flex flex-col items-center gap-6">
        {lines.map((line) => (
          <div 
            key={line.line}
            className={`transition-all duration-500 py-4 flex items-center justify-center rounded-[30px] w-full ${
              isLineActive(line) ? 'bg-white/60 shadow-xl scale-110 z-10 border-2 border-white' : ''
            }`}
          >
            <span className="text-3xl md:text-5xl lg:text-6xl font-black tracking-wide whitespace-nowrap inline-flex items-center justify-center">
              {line.words.map((word, wIdx) => renderWord(line, word, wIdx))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-20 py-10 w-full overflow-x-hidden">
      {/* Khổ Một (Line 2-5) */}
      {renderStanza(poem.detailedLines.slice(1, 5), "Khổ Một", "border-blue-200 text-blue-500")}
      {/* Khổ Hai (Line 6-9) */}
      {renderStanza(poem.detailedLines.slice(5, 9), "Khổ Hai", "border-orange-200 text-orange-500")}
      {/* Khổ Ba (Line 10-13) */}
      {renderStanza(poem.detailedLines.slice(9, 13), "Khổ Ba", "border-green-200 text-green-500")}
    </div>
  );
};

export default PoemDisplay;
