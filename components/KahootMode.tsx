import React, { useState, useEffect } from 'react';
import { KAHOOT_QUESTIONS, SOUNDS, UI_TEXT } from '../constants';
import { Timer, Trophy, XCircle, CheckCircle, Zap, Flame, RotateCw } from 'lucide-react';
import { Language } from '../types';

interface KahootModeProps {
  addXP: (amount: number) => void;
  onExit: () => void;
  lang: Language;
}

export const KahootMode: React.FC<KahootModeProps> = ({ addXP, onExit, lang }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'finished'>('intro');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [shake, setShake] = useState(false);

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
      const timeBonus = timeLeft * 50;
      const comboBonus = combo * 100;
      const points = 500 + timeBonus + comboBonus;
      
      setScore(prev => prev + points);
      setCombo(prev => {
         const newCombo = prev + 1;
         if (newCombo > maxCombo) setMaxCombo(newCombo);
         return newCombo;
      });
      playSound('CORRECT');
    } else {
      setCombo(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);
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

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 animate-gradient-xy"></div>
        
        <div className="z-10 flex flex-col items-center animate-bounce-slow">
           <div className="relative">
             <div className="absolute -inset-4 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
             <Zap size={100} className="text-yellow-400 mb-6 relative z-10" fill="currentColor" />
           </div>
           <h1 className="text-7xl font-black mb-2 italic uppercase tracking-tighter drop-shadow-xl text-center">Speed Battle</h1>
           <p className="text-indigo-200 mb-12 font-bold text-xl tracking-widest uppercase">2 Options • 10 Seconds • Infinite Glory</p>
        </div>

        <button 
          onClick={() => { setGameState('playing'); playSound('SUCCESS'); }}
          className="px-16 py-8 bg-yellow-400 text-indigo-950 text-4xl font-black rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_0_rgb(202,138,4)] z-10 uppercase flex items-center gap-4 group"
        >
          {t('start')} <Zap className="group-hover:rotate-12 transition-transform" fill="currentColor" />
        </button>
        <button onClick={onExit} className="mt-12 text-white/40 z-10 font-bold uppercase text-sm hover:text-white transition-colors">Exit Game</button>
      </div>
    );
  }

  // Result Screen
  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center text-white p-4">
        <Trophy size={120} className="text-yellow-400 mb-8 animate-bounce drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" fill="currentColor" />
        <h2 className="text-5xl font-black mb-2 uppercase tracking-wide">Victory!</h2>
        <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-6 drop-shadow-sm">{score}</div>
        
        <div className="flex gap-8 mb-12">
           <div className="text-center">
              <p className="text-indigo-300 font-bold uppercase text-xs tracking-widest">Max Combo</p>
              <p className="text-3xl font-black">{maxCombo}x</p>
           </div>
           <div className="text-center">
              <p className="text-indigo-300 font-bold uppercase text-xs tracking-widest">Correct</p>
              <p className="text-3xl font-black">{Math.round((score / (KAHOOT_QUESTIONS.length * 1000)) * 10)}/8</p> 
           </div>
        </div>

        <button 
          onClick={onExit}
          className="px-12 py-5 bg-white text-indigo-900 font-black rounded-2xl hover:bg-indigo-50 text-2xl shadow-2xl transition-transform hover:-translate-y-1 flex items-center gap-3"
        >
          <RotateCw size={24} /> {t('back')}
        </button>
      </div>
    );
  }

  // Playing Mode
  const bgIntensity = timeLeft <= 3 ? 'bg-red-900' : 'bg-indigo-950';

  return (
    <div className={`min-h-screen flex flex-col font-sans ${bgIntensity} transition-colors duration-500 overflow-hidden ${shake ? 'animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]' : ''}`}>
      
      {/* HUD */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center text-white z-20 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl font-black border border-white/10 text-xl shadow-lg">
           {currentQIndex + 1} <span className="text-white/40 text-sm">/ {KAHOOT_QUESTIONS.length}</span>
        </div>
        
        {/* Timer */}
        <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-8 transition-all duration-300 bg-black/20 backdrop-blur-sm ${timeLeft <= 3 ? 'border-red-500 scale-110 shadow-[0_0_30px_red]' : 'border-white/20'}`}>
          <span className={`text-5xl font-black ${timeLeft <= 3 ? 'text-red-500' : 'text-white'}`}>{timeLeft}</span>
        </div>

        {/* Score & Combo */}
        <div className="flex flex-col items-end gap-2">
           <div className="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black shadow-[0_4px_0_rgba(0,0,0,0.2)] text-xl flex items-center gap-2">
             <Trophy size={20} fill="currentColor"/> {score}
           </div>
           {combo > 1 && (
             <div className="text-yellow-400 font-black text-2xl animate-bounce flex items-center gap-1 drop-shadow-md">
                <Flame fill="currentColor" /> {combo}x COMBO!
             </div>
           )}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col">
        {/* Question Area */}
        <div className="h-[40vh] flex items-center justify-center p-8 bg-white dark:bg-slate-900 text-center relative z-10 shadow-2xl rounded-b-[3rem]">
           <h2 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white leading-tight max-w-5xl drop-shadow-sm">
             {currentQ.question}
           </h2>
        </div>

        {/* 2 Options Split Screen */}
        <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 bg-slate-900">
          {currentQ.options?.map((opt, i) => {
             const isLeft = i === 0;
             const isSelected = selectedOption === opt;
             const isCorrect = opt === currentQ.correctAnswer;
             const showResult = gameState === 'feedback';
             
             // Base style
             let baseClass = isLeft 
               ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-[0_8px_0_#9f1239]' 
               : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_8px_0_#1e40af]';
             
             // Feedback override
             if (showResult) {
                if (isCorrect) baseClass = 'bg-emerald-500 shadow-[0_8px_0_#065f46] scale-[1.02] ring-4 ring-white z-10'; 
                else baseClass = 'bg-slate-700 opacity-20 grayscale scale-95'; 
             }

             return (
               <button
                 key={i}
                 onClick={() => !showResult && handleAnswer(opt)}
                 disabled={showResult}
                 className={`${baseClass} flex-1 rounded-3xl flex items-center justify-center p-8 transition-all duration-300 relative group overflow-hidden active:scale-[0.98] active:translate-y-2 active:shadow-none`}
               >
                 <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                 {showResult && isCorrect && <CheckCircle className="absolute top-6 right-6 text-white w-20 h-20 animate-pulse" />}
                 {showResult && isSelected && !isCorrect && <XCircle className="absolute top-6 right-6 text-white w-20 h-20" />}
                 
                 <span className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight drop-shadow-lg z-10 text-center">
                    {opt}
                 </span>
               </button>
             );
          })}
        </div>
      </div>

      {/* Explanation Overlay */}
      {gameState === 'feedback' && (
        <div className="absolute bottom-0 w-full bg-slate-900/95 text-white p-8 z-50 flex items-center justify-between animate-slideUp backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
           <div className="max-w-3xl">
             <div className="uppercase text-xs font-bold text-yellow-400 mb-2 tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div> Explanation
             </div>
             <div className="text-3xl font-bold text-white leading-tight">{currentQ.explanation}</div>
           </div>
           <button 
             onClick={nextQuestion}
             className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-50 hover:scale-105 transition-all text-xl shadow-xl flex items-center gap-2"
           >
             {t('next')} <Timer size={24} />
           </button>
        </div>
      )}
    </div>
  );
};