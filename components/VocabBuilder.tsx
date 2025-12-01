import React, { useState } from 'react';
import { VOCAB_LIST, UI_TEXT, SOUNDS } from '../constants';
import { ArrowLeft, Zap, X, Heart, RotateCcw } from 'lucide-react';
import { Language } from '../types';

interface VocabBuilderProps {
  onBack: () => void;
  lang: Language;
}

export const VocabBuilder: React.FC<VocabBuilderProps> = ({ onBack, lang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipedDir, setSwipedDir] = useState<'left' | 'right' | null>(null);
  const [streak, setStreak] = useState(0);

  const t = (key: string) => UI_TEXT[key]?.[lang] || key;
  const currentCard = VOCAB_LIST[currentIndex % VOCAB_LIST.length];

  const handleSwipe = (dir: 'left' | 'right') => {
    setSwipedDir(dir);
    if (dir === 'right') {
        const audio = new Audio(SOUNDS.SUCCESS);
        audio.volume = 0.3;
        audio.play().catch(()=>{});
        setStreak(s => s + 1);
    } else {
        const audio = new Audio(SOUNDS.WRONG);
        audio.volume = 0.3;
        audio.play().catch(()=>{});
        setStreak(0);
    }

    setTimeout(() => {
        setSwipedDir(null);
        setIsFlipped(false);
        setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.3),rgba(0,0,0,1))]"></div>
      
      {/* Header */}
      <div className="absolute top-6 left-6 z-20">
          <button onClick={onBack} className="p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors">
            <ArrowLeft size={24} />
          </button>
      </div>

      <div className="absolute top-6 right-6 z-20 flex flex-col items-end">
          <div className="flex items-center gap-2 text-yellow-400 font-black text-2xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
             <Zap fill="currentColor" /> {streak}
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Streak</p>
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-sm aspect-[3/4] z-10 perspective-1000">
         <div 
           className={`w-full h-full relative transition-all duration-500 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''} ${swipedDir === 'left' ? '-translate-x-full rotate-[-20deg] opacity-0' : swipedDir === 'right' ? 'translate-x-full rotate-[20deg] opacity-0' : ''}`}
           onClick={() => setIsFlipped(!isFlipped)}
         >
            {/* Front */}
            <div className="absolute inset-0 bg-slate-900 rounded-[3rem] border-2 border-slate-700 p-8 flex flex-col items-center justify-center text-center backface-hidden shadow-2xl">
                <span className="text-slate-500 font-bold uppercase tracking-[0.2em] mb-8">{currentCard.partOfSpeech}</span>
                <h2 className="text-5xl font-black text-white mb-6 drop-shadow-md">{currentCard.word}</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-teal-400 to-purple-500 rounded-full mb-8"></div>
                <p className="text-slate-400 font-medium">Tap to reveal meaning</p>
            </div>

            {/* Back */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 shadow-2xl border-2 border-indigo-500/50">
                <p className="text-3xl font-bold text-white mb-6 leading-tight">"{currentCard.definition}"</p>
                <p className="text-indigo-200 italic mb-8">"{currentCard.contextSentence}"</p>
                <p className="bg-black/30 px-4 py-2 rounded-lg text-sm text-white font-medium">
                    {lang === 'ru' ? currentCard.translation.ru : lang === 'uz' ? currentCard.translation.uz : ''}
                </p>
            </div>
         </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8 mt-12 z-20">
         <button 
           onClick={() => handleSwipe('left')}
           className="w-20 h-20 rounded-full bg-slate-900 border-2 border-red-500/50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white hover:scale-110 transition-all shadow-xl active:scale-95"
         >
            <X size={40} strokeWidth={3} />
         </button>
         
         <button 
           onClick={() => setIsFlipped(prev => !prev)}
           className="w-14 h-14 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all shadow-lg"
         >
            <RotateCcw size={24} />
         </button>

         <button 
           onClick={() => handleSwipe('right')}
           className="w-20 h-20 rounded-full bg-slate-900 border-2 border-green-500/50 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white hover:scale-110 transition-all shadow-xl active:scale-95"
         >
            <Heart size={36} fill="currentColor" />
         </button>
      </div>

      <p className="mt-8 text-slate-500 text-sm font-medium opacity-50">Swipe Left (Forgot) • Swipe Right (Got it)</p>
    </div>
  );
};