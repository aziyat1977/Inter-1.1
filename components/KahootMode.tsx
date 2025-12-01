import React, { useState, useEffect } from 'react';
import { KAHOOT_QUESTIONS, SOUNDS, UI_TEXT } from '../constants';
import { Timer, Trophy, XCircle, CheckCircle, Zap } from 'lucide-react';
import { Language } from '../types';

interface KahootModeProps {
  addXP: (amount: number) => void;
  onExit: () => void;
  lang: Language;
}

export const KahootMode: React.FC<KahootModeProps> = ({ addXP, onExit, lang }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // Faster timer
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'finished'>('intro');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQ = KAHOOT_QUESTIONS[currentQIndex];
  const t = (key: string) => UI_TEXT[key]?.[lang] || key;

  const playSound = (type: 'CORRECT' | 'WRONG' | 'CLICK' | 'SUCCESS') => {
    const audio = new Audio(SOUNDS[type]);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      if (timeLeft <= 3) playSound('CLICK'); 
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleAnswer(null); // Time's up
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const handleAnswer = (option: string | null) => {
    setSelectedOption(option);
    setGameState('feedback');
    if (option === currentQ.correctAnswer) {
      const timeBonus = timeLeft * 20;
      const points = 200 + timeBonus;
      setScore(prev => prev + points);
      playSound('CORRECT');
    } else {
      playSound('WRONG');
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < KAHOOT_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setTimeLeft(10);
      setSelectedOption(null);
      setGameState('playing');
    } else {
      setGameState('finished');
      playSound('SUCCESS');
      addXP(score);
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-indigo-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 animate-pulse"></div>
        <Zap size={80} className="text-yellow-400 mb-6 z-10" />
        <h1 className="text-6xl font-black mb-2 z-10 italic uppercase tracking-tighter">Speed Battle</h1>
        <p className="text-indigo-200 mb-8 z-10 font-bold">Fast. 2 Options. Don't blink.</p>
        <button 
          onClick={() => { setGameState('playing'); playSound('SUCCESS'); }}
          className="px-12 py-6 bg-yellow-400 text-indigo-900 text-3xl font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_0_rgb(202,138,4)] z-10 uppercase"
        >
          {t('start')}
        </button>
        <button onClick={onExit} className="mt-8 text-white/40 z-10 font-bold uppercase text-sm hover:text-white">Exit</button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-indigo-900 flex flex-col items-center justify-center text-white p-4">
        <Trophy size={100} className="text-yellow-400 mb-6 animate-bounce" />
        <h2 className="text-4xl font-black mb-4 uppercase">Complete!</h2>
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-10">{score}</div>
        <button 
          onClick={onExit}
          className="px-10 py-4 bg-white text-indigo-900 font-black rounded-xl hover:bg-gray-100 text-xl shadow-xl transition-transform hover:-translate-y-1"
        >
          {t('back')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-indigo-950">
      {/* HUD */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center text-white z-20 pointer-events-none">
        <div className="bg-black/40 backdrop-blur px-4 py-2 rounded-lg font-bold border border-white/10">
           {currentQIndex + 1} / {KAHOOT_QUESTIONS.length}
        </div>
        <div className={`font-black text-4xl ${timeLeft <= 3 ? 'text-red-500 scale-125' : 'text-white'} transition-all duration-300 drop-shadow-md`}>
          {timeLeft}
        </div>
        <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-black shadow-lg">
          {score}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col">
        {/* Question */}
        <div className="h-1/3 flex items-center justify-center p-6 bg-white dark:bg-slate-900 text-center relative z-10 shadow-xl">
           <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight max-w-4xl">
             {currentQ.question}
           </h2>
        </div>

        {/* 2 Options Split Screen */}
        <div className="h-2/3 flex flex-col md:flex-row">
          {currentQ.options?.map((opt, i) => {
             const isLeft = i === 0;
             const isSelected = selectedOption === opt;
             const isCorrect = opt === currentQ.correctAnswer;
             const showResult = gameState === 'feedback';
             
             // Base style
             let style = isLeft ? 'bg-rose-500' : 'bg-blue-500';
             let content = opt;

             // Feedback override
             if (showResult) {
                if (isCorrect) style = 'bg-emerald-500'; // Winner gets green
                else style = 'bg-slate-700 opacity-30'; // Loser gets grey
             }

             return (
               <button
                 key={i}
                 onClick={() => !showResult && handleAnswer(opt)}
                 disabled={showResult}
                 className={`${style} flex-1 flex items-center justify-center p-8 transition-all duration-300 relative group overflow-hidden active:scale-[0.98]`}
               >
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                 {showResult && isCorrect && <CheckCircle className="absolute top-4 right-4 text-white/50 w-24 h-24" />}
                 {showResult && isSelected && !isCorrect && <XCircle className="absolute top-4 right-4 text-white/50 w-24 h-24" />}
                 
                 <span className="text-3xl md:text-6xl font-black text-white uppercase tracking-tight drop-shadow-md z-10 text-center">
                    {content}
                 </span>
               </button>
             );
          })}
        </div>
      </div>

      {/* Explanation Overlay */}
      {gameState === 'feedback' && (
        <div className="absolute bottom-0 w-full bg-black/90 text-white p-6 z-50 flex items-center justify-between animate-slideUp backdrop-blur-md">
           <div>
             <div className="uppercase text-xs font-bold text-gray-400 mb-1">Feedback</div>
             <div className="text-xl font-bold text-white">{currentQ.explanation}</div>
           </div>
           <button 
             onClick={nextQuestion}
             className="px-8 py-3 bg-white text-black font-black rounded-lg hover:scale-105 transition-transform"
           >
             {t('next')}
           </button>
        </div>
      )}
    </div>
  );
};