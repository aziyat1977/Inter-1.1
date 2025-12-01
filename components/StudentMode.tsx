import React, { useState } from 'react';
import { READING_TEXT, GRAMMAR_RULES, PRACTICE_EXERCISES, UI_TEXT, SOUNDS } from '../constants';
import { CheckCircle2, BookOpen, PenTool, MessageCircle, ArrowRight, Eye, PlayCircle, Lock, Clock } from 'lucide-react';
import { Language } from '../types';

interface StudentModeProps {
  addXP: (amount: number) => void;
  lang: Language;
}

const GrammarTimeline = ({ type }: { type: 'simple' | 'continuous' | 'perfect' }) => {
  return (
    <div className="w-full h-32 bg-slate-50 dark:bg-slate-900 rounded-xl mb-4 relative overflow-hidden border border-slate-100 dark:border-slate-700">
      {/* Base Time Axis */}
      <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-300 dark:bg-slate-600"></div>
      
      {/* "Now" Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-0.5 h-4 bg-slate-400 dark:bg-slate-500"></div>
        <span className="text-[10px] font-bold uppercase text-slate-400 mt-2 tracking-widest">Now</span>
      </div>
      <span className="absolute left-4 top-1/2 mt-4 text-[10px] text-slate-300 font-bold">PAST</span>
      <span className="absolute right-4 top-1/2 mt-4 text-[10px] text-slate-300 font-bold">FUTURE</span>

      {/* Tense Specific Visuals */}
      {type === 'simple' && (
        <>
          {/* Repeated Actions: X X X */}
          <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-75"></div>
          
          <div className="absolute top-1/2 left-[50%] -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
          <div className="absolute top-1/2 left-[50%] -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-75"></div>
          
          <div className="absolute top-1/2 left-[70%] -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
          <div className="absolute top-1/2 left-[70%] -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-75"></div>
          
          <div className="absolute top-8 left-0 w-full text-center text-blue-500 text-xs font-bold animate-pulse">
            Habits / Facts
          </div>
        </>
      )}

      {type === 'continuous' && (
        <>
          {/* Active Duration Wave */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
             <path 
               d="M 120 64 Q 150 40 180 64 T 240 64"
               fill="none" 
               stroke="currentColor" 
               className="text-green-500 stroke-[4]"
               strokeLinecap="round"
             >
               <animate attributeName="d" 
                 values="M 100 64 Q 150 30 200 64 T 300 64; M 100 64 Q 150 90 200 64 T 300 64; M 100 64 Q 150 30 200 64 T 300 64" 
                 dur="2s" 
                 repeatCount="indefinite" />
             </path>
          </svg>
          {/* Active Zone Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-16 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
          
          <div className="absolute top-8 left-0 w-full text-center text-green-500 text-xs font-bold animate-pulse">
            Happening Around Now
          </div>
        </>
      )}

      {type === 'perfect' && (
        <>
           {/* Bridge from Past to Now */}
           <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
             <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" className="fill-purple-500" />
                </marker>
             </defs>
             {/* Path from Past (25%) to Now (50%) */}
             <path 
               d="M 80 64 Q 130 20 195 60" 
               fill="none" 
               stroke="currentColor" 
               className="text-purple-500 stroke-[3]"
               markerEnd="url(#arrow)"
             >
                <animate 
                  attributeName="stroke-dasharray" 
                  from="0, 200" 
                  to="200, 0" 
                  dur="1.5s" 
                  repeatCount="indefinite"
                />
             </path>
             <circle cx="80" cy="64" r="6" className="fill-purple-500" />
           </svg>
           
           <div className="absolute top-8 left-0 w-full text-center text-purple-500 text-xs font-bold animate-pulse">
            Past Action -> Present Result
          </div>
        </>
      )}
    </div>
  );
};

export const StudentMode: React.FC<StudentModeProps> = ({ addXP, lang }) => {
  const [step, setStep] = useState(0);
  const [discussionInput, setDiscussionInput] = useState("");
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);
  
  const playSound = (type: 'CORRECT' | 'WRONG' | 'CLICK' | 'SUCCESS') => {
    const audio = new Audio(SOUNDS[type]);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const t = (key: string) => UI_TEXT[key]?.[lang] || key;

  const handlePracticeCheck = () => {
    let correctCount = 0;
    PRACTICE_EXERCISES.forEach(ex => {
      const userVal = practiceAnswers[ex.id]?.toLowerCase().trim();
      const correctVal = Array.isArray(ex.correctAnswer) 
        ? ex.correctAnswer.map(c => c.toLowerCase()) 
        : [ex.correctAnswer.toLowerCase()];
      
      if (correctVal.includes(userVal || '')) {
        correctCount++;
      }
    });

    if (correctCount === PRACTICE_EXERCISES.length) playSound('SUCCESS');
    else if (correctCount > 0) playSound('CORRECT');
    else playSound('WRONG');

    addXP(correctCount * 20);
    setShowResults(true);
  };

  const steps = [
    {
      title: "Discuss",
      icon: <MessageCircle className="w-6 h-6" />,
      content: (
        <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto mt-10">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border-2 border-teal-100 dark:border-slate-700 text-center">
            <h3 className="font-black text-teal-600 dark:text-teal-400 text-xl mb-4 uppercase tracking-widest">Question</h3>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
              "The average Facebook user has 338 friends."
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {lang === 'ru' ? "Это правда? Можно ли иметь столько друзей?" : 
               lang === 'uz' ? "Bu rostmi? Shuncha do'st bo'lishi mumkinmi?" :
               "Is this true? Can you really have so many friends?"}
            </p>
          </div>
          
          <div className="space-y-4">
            <textarea 
              className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-teal-500 focus:ring-0 outline-none transition-all text-lg"
              rows={3}
              placeholder={lang === 'ru' ? "Ваш ответ..." : "Your answer..."}
              value={discussionInput}
              onChange={(e) => setDiscussionInput(e.target.value)}
            />
            
            {!showModelAnswer ? (
              <button 
                onClick={() => { setShowModelAnswer(true); playSound('CLICK'); addXP(10); }}
                disabled={discussionInput.length < 5}
                className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 transition-all shadow-lg active:scale-[0.98]"
              >
                {t('reveal')}
              </button>
            ) : (
              <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-2xl animate-slideUp">
                <h4 className="font-bold text-green-800 dark:text-green-300 mb-1">Idea:</h4>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  Maybe you know 338 people, but you only have 5 real friends. The rest are just contacts.
                </p>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: "Read",
      icon: <BookOpen className="w-6 h-6" />,
      content: (
        <div className="grid md:grid-cols-2 gap-8 animate-fadeIn h-[70vh]">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{READING_TEXT.title}</h2>
            {READING_TEXT.paragraphs.map((p, i) => (
              <p key={i} className="mb-4 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800">
              <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-4 text-xl flex items-center gap-2">
                 Quick Check
              </h3>
              <div className="space-y-4">
                <div className="group cursor-pointer bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow" onClick={(e) => { e.currentTarget.classList.toggle('revealed'); playSound('CLICK'); }}>
                   <p className="font-bold text-slate-800 dark:text-white mb-2">1. Why meet 700 people?</p>
                   <p className="text-indigo-600 dark:text-indigo-400 font-medium hidden group-[.revealed]:block animate-fadeIn">For charity (£3,000).</p>
                   <p className="text-slate-400 text-sm group-[.revealed]:hidden">Click to answer</p>
                </div>
                <div className="group cursor-pointer bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow" onClick={(e) => { e.currentTarget.classList.toggle('revealed'); playSound('CLICK'); }}>
                   <p className="font-bold text-slate-800 dark:text-white mb-2">2. Where did he go?</p>
                   <p className="text-indigo-600 dark:text-indigo-400 font-medium hidden group-[.revealed]:block animate-fadeIn">Europe, USA, New Zealand.</p>
                   <p className="text-slate-400 text-sm group-[.revealed]:hidden">Click to answer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Learn",
      icon: <Lock className="w-6 h-6" />,
      content: (
        <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-slate-800 dark:text-white text-center mb-8">Grammar Visualized</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {GRAMMAR_RULES.map((rule, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-md border-b-8 border-slate-100 dark:border-slate-700 hover:-translate-y-2 transition-transform duration-300">
                <div className={`text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${
                   rule.usage === 'simple' ? 'text-blue-500' : 
                   rule.usage === 'continuous' ? 'text-green-500' : 'text-purple-500'
                }`}>
                  <Clock size={14} /> {rule.usage}
                </div>
                
                {/* TIMELINE COMPONENT */}
                <GrammarTimeline type={rule.usage} />

                <h3 className="font-black text-2xl mb-3 dark:text-white">{rule.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-4 min-h-[48px]">{rule.description}</p>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-300">
                  {rule.examples.map((ex, i) => <div key={i} className="mb-2 last:mb-0 pl-2 border-l-2 border-slate-300 dark:border-slate-500">"{ex}"</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Type",
      icon: <PenTool className="w-6 h-6" />,
      content: (
        <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto pb-20">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden">
            {PRACTICE_EXERCISES.map((ex, i) => (
              <div key={ex.id} className="p-6 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <label className="block text-lg font-bold text-slate-700 dark:text-slate-200 mb-3">{i+1}. {ex.question}</label>
                <input 
                  type="text" 
                  disabled={showResults}
                  className={`w-full p-4 rounded-xl border-2 font-bold text-lg outline-none transition-colors ${
                    showResults 
                      ? (Array.isArray(ex.correctAnswer) ? ex.correctAnswer.includes(practiceAnswers[ex.id]?.trim()) : practiceAnswers[ex.id]?.toLowerCase().trim() === ex.correctAnswer.toString().toLowerCase())
                        ? 'bg-green-50 border-green-500 text-green-900'
                        : 'bg-red-50 border-red-500 text-red-900'
                      : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:border-teal-500'
                  }`}
                  placeholder="..."
                  onChange={(e) => setPracticeAnswers({...practiceAnswers, [ex.id]: e.target.value})}
                />
                {showResults && (
                   <div className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                     {ex.explanation}
                   </div>
                )}
              </div>
            ))}
          </div>

          {!showResults && (
            <button 
              onClick={handlePracticeCheck}
              className="w-full py-5 bg-teal-500 text-white font-black text-xl rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t('check')}
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto pt-6 px-4 mb-8">
        <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm">
          {steps.map((s, i) => (
            <button 
              key={i}
              onClick={() => { setStep(i); playSound('CLICK'); }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                i === step 
                  ? 'bg-teal-500 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                 {s.icon}
                 <span className="hidden sm:inline">{s.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {steps[step].content}
      </div>
    </div>
  );
};
