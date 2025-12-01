import React, { useState, useEffect } from 'react';
import { VOCAB_LIST, UI_TEXT, SOUNDS } from '../constants';
import { RefreshCw, FlipHorizontal, ArrowLeft, Zap, BookOpen, Clock } from 'lucide-react';
import { Language } from '../types';

interface VocabBuilderProps {
  onBack: () => void;
  lang: Language;
}

export const VocabBuilder: React.FC<VocabBuilderProps> = ({ onBack, lang }) => {
  const [mode, setMode] = useState<'study' | 'drill'>('study');
  const [flipped, setFlipped] = useState<{[key: string]: boolean}>({});
  
  // Drill State
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillScore, setDrillScore] = useState(0);
  const [drillOptions, setDrillOptions] = useState<string[]>([]);
  const [showDrillResult, setShowDrillResult] = useState(false);

  const t = (key: string) => UI_TEXT[key]?.[lang] || key;

  // Setup drill question
  useEffect(() => {
    if (mode === 'drill') {
      const correct = VOCAB_LIST[drillIndex];
      // Find a wrong option
      let wrong = VOCAB_LIST[Math.floor(Math.random() * VOCAB_LIST.length)];
      while (wrong.id === correct.id) {
        wrong = VOCAB_LIST[Math.floor(Math.random() * VOCAB_LIST.length)];
      }
      
      const opts = Math.random() > 0.5 
        ? [correct.definition, wrong.definition] 
        : [wrong.definition, correct.definition];
      setDrillOptions(opts);
      setShowDrillResult(false);
    }
  }, [drillIndex, mode]);

  const handleDrillAnswer = (answer: string) => {
    if (showDrillResult) return;
    const correct = VOCAB_LIST[drillIndex].definition;
    
    if (answer === correct) {
      new Audio(SOUNDS.CORRECT).play().catch(()=>{});
      setDrillScore(s => s + 1);
    } else {
      new Audio(SOUNDS.WRONG).play().catch(()=>{});
    }
    setShowDrillResult(true);

    setTimeout(() => {
      if (drillIndex < VOCAB_LIST.length - 1) {
        setDrillIndex(i => i + 1);
      } else {
        // Loop back for endless drill or finish
        setDrillIndex(0); 
      }
    }, 1000);
  };

  const playFlipSound = () => {
    const audio = new Audio(SOUNDS.CLICK);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
          <button onClick={onBack} className="flex items-center text-slate-600 dark:text-slate-300 font-bold hover:text-teal-600">
            <ArrowLeft className="mr-2" /> {t('back')}
          </button>
          
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <button 
              onClick={() => setMode('study')}
              className={`px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${mode === 'study' ? 'bg-white dark:bg-slate-600 text-teal-600 shadow-md' : 'text-slate-400'}`}
            >
              <BookOpen size={16} /> {t('study')}
            </button>
            <button 
              onClick={() => setMode('drill')}
              className={`px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${mode === 'drill' ? 'bg-yellow-400 text-slate-900 shadow-md' : 'text-slate-400'}`}
            >
              <Zap size={16} /> {t('quiz')}
            </button>
          </div>
        </div>

        {mode === 'study' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {VOCAB_LIST.map(item => (
              <div 
                key={item.id} 
                className="h-64 perspective-1000 group cursor-pointer"
                onClick={() => {
                  setFlipped(prev => ({...prev, [item.id]: !prev[item.id]}));
                  playFlipSound();
                }}
              >
                <div className={`relative w-full h-full transition-all duration-500 preserve-3d shadow-xl rounded-2xl ${flipped[item.id] ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className="absolute w-full h-full bg-white dark:bg-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center backface-hidden border-2 border-slate-100 dark:border-slate-700">
                    <span className="absolute top-4 right-4 text-xs font-bold text-slate-400 uppercase">{item.partOfSpeech}</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white text-center mb-1">{item.word}</h3>
                    <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                      {lang === 'ru' ? item.translation.ru : lang === 'uz' ? item.translation.uz : ''}
                    </p>
                    <div className="absolute bottom-4 text-slate-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                      <FlipHorizontal size={12} /> Flip
                    </div>
                  </div>

                  {/* Back */}
                  <div className="absolute w-full h-full bg-slate-800 text-white rounded-2xl p-6 flex flex-col items-center justify-center rotate-y-180 backface-hidden">
                    <p className="font-bold text-lg text-center leading-tight mb-4 text-yellow-400">"{item.definition}"</p>
                    <p className="text-xs text-slate-400 text-center italic">"{item.contextSentence}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mt-10">
             <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-100 dark:border-slate-700">
                <div className="bg-slate-100 dark:bg-slate-900 p-4 flex justify-between items-center border-b dark:border-slate-700">
                   <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Drill Mode</span>
                   <div className="flex items-center gap-2 text-yellow-500 font-black">
                      <Zap size={18} fill="currentColor" /> {drillScore}
                   </div>
                </div>
                
                <div className="p-12 text-center">
                   <h2 className="text-5xl font-black text-slate-800 dark:text-white mb-12">
                     {VOCAB_LIST[drillIndex].word}
                   </h2>
                   
                   <div className="grid grid-cols-1 gap-4">
                     {drillOptions.map((opt, i) => {
                       const isCorrect = opt === VOCAB_LIST[drillIndex].definition;
                       return (
                         <button
                           key={i}
                           onClick={() => handleDrillAnswer(opt)}
                           disabled={showDrillResult}
                           className={`p-6 rounded-xl font-bold text-xl transition-all transform active:scale-95 ${
                             showDrillResult
                               ? isCorrect 
                                 ? 'bg-green-500 text-white shadow-green-500/50'
                                 : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                               : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 hover:shadow-lg border-2 border-indigo-100 dark:border-indigo-800'
                           }`}
                         >
                           {opt}
                         </button>
                       )
                     })}
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};