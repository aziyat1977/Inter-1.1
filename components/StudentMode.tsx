import React, { useState, useEffect, useRef } from 'react';
import { READING_TEXT, GRAMMAR_RULES, PRACTICE_EXERCISES, UI_TEXT, SOUNDS } from '../constants';
import { CheckCircle2, BookOpen, PenTool, MessageCircle, ArrowRight, Eye, PlayCircle, Lock, Clock, Check, X, Heart, Share2, Send, Zap } from 'lucide-react';
import { Language } from '../types';

interface StudentModeProps {
  addXP: (amount: number) => void;
  lang: Language;
}

const GrammarTimeline = ({ type }: { type: 'simple' | 'continuous' | 'perfect' }) => {
  return (
    <div className="w-full h-32 bg-slate-900 rounded-xl mb-4 relative overflow-hidden border border-slate-700 shadow-inner group">
      {/* Base Time Axis */}
      <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-700 rounded-full"></div>
      
      {/* "Now" Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <div className="w-1 h-8 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
        <span className="text-[10px] font-black uppercase text-white mt-4 bg-slate-800 px-2 rounded-full border border-slate-600">Now</span>
      </div>

      {/* Tense Specific Visuals */}
      {type === 'simple' && (
        <>
          {[-50, 0, 50].map((offset, i) => (
             <div key={i} className="absolute top-1/2 left-1/2 -translate-y-1/2 w-4 h-4" style={{ marginLeft: `${offset}px`, transform: `translate(-50%, -50%)` }}>
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-full h-full bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] border-2 border-white"></div>
             </div>
          ))}
        </>
      )}

      {type === 'continuous' && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-32 h-6 -translate-x-1/2 bg-green-500/30 rounded-full border-2 border-green-400 blur-[1px] animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-8 h-8 -translate-x-1/2 bg-green-400 rounded-full shadow-[0_0_20px_#4ade80] animate-bounce"></div>
        </>
      )}

      {type === 'perfect' && (
        <>
           <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7] border border-white"></div>
           <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
             <path d="M 170 64 Q 220 20 280 60" fill="none" stroke="#a855f7" strokeWidth="3" strokeDasharray="6 4" className="animate-pulse" />
             <path d="M 275 60 L 285 64 L 278 68" fill="#a855f7" />
           </svg>
        </>
      )}
    </div>
  );
};

export const StudentMode: React.FC<StudentModeProps> = ({ addXP, lang }) => {
  const [step, setStep] = useState(0);
  const [discussionInput, setDiscussionInput] = useState("");
  const [likes, setLikes] = useState(337);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<{user: string, text: string, time: string}[]>([]);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  
  const playSound = (type: 'CORRECT' | 'WRONG' | 'CLICK' | 'SUCCESS') => {
    const audio = new Audio(SOUNDS[type]);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const t = (key: string) => UI_TEXT[key]?.[lang] || key;

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

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

    if (correctCount === PRACTICE_EXERCISES.length) {
      playSound('SUCCESS');
      addXP(correctCount * 50); 
    } else if (correctCount > 0) {
      playSound('CORRECT');
      addXP(correctCount * 25);
    } else {
      playSound('WRONG');
    }

    setShowResults(true);
  };

  const handlePostComment = () => {
    if(!discussionInput) return;
    setComments([...comments, { user: "You", text: discussionInput, time: "Just now" }]);
    setDiscussionInput("");
    playSound('SUCCESS');
    addXP(50);
    setTimeout(() => {
        setShowModelAnswer(true);
        playSound('CLICK');
    }, 1000);
  };

  const steps = [
    {
      title: "Story",
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="flex flex-col items-center animate-fadeIn max-w-md mx-auto">
          {/* Instagram Story Style Viewer */}
          <div className="w-full bg-black rounded-[2rem] aspect-[9/16] relative overflow-hidden shadow-2xl border-4 border-slate-800">
             {/* Progress Bars */}
             <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
                {READING_TEXT.paragraphs.map((_, i) => (
                    <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-white transition-all duration-300 ${i < storyIndex ? 'w-full' : i === storyIndex ? 'w-full animate-[loading_5s_linear]' : 'w-0'}`}
                        ></div>
                    </div>
                ))}
             </div>

             {/* Header */}
             <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black border border-white/20"></div>
                    </div>
                    <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{READING_TEXT.author}</span>
                    <span className="text-white/60 text-xs">2h ago</span>
                </div>
             </div>

             {/* Content */}
             <div 
               className="absolute inset-0 bg-cover bg-center"
               style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)' }}
             >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>
             </div>

             <div className="absolute bottom-0 left-0 w-full p-8 pb-12 z-20 flex flex-col justify-end h-3/4 bg-gradient-to-t from-black via-black/50 to-transparent">
                 <p className="text-white text-2xl font-bold leading-relaxed mb-6 drop-shadow-lg animate-slideUp">
                    {READING_TEXT.paragraphs[storyIndex]}
                 </p>
                 <button 
                   onClick={() => {
                      if (storyIndex < READING_TEXT.paragraphs.length - 1) {
                          setStoryIndex(prev => prev + 1);
                          playSound('CLICK');
                      } else {
                          addXP(100);
                          playSound('SUCCESS');
                      }
                   }}
                   className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
                 >
                    {storyIndex < READING_TEXT.paragraphs.length - 1 ? "Next Snap 👉" : "Finish Story 🎉"}
                 </button>
             </div>

             {/* Touch Zones */}
             <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={() => setStoryIndex(Math.max(0, storyIndex - 1))}></div>
             <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={() => setStoryIndex(Math.min(READING_TEXT.paragraphs.length - 1, storyIndex + 1))}></div>
          </div>
          <p className="text-slate-400 mt-4 text-sm">Tap right to advance, left to go back</p>
        </div>
      )
    },
    {
        title: "Feed",
        icon: <MessageCircle className="w-5 h-5" />,
        content: (
          <div className="max-w-md mx-auto animate-fadeIn">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400"></div>
                        <div>
                            <p className="text-white font-bold text-sm">oxford_official</p>
                            <p className="text-slate-500 text-xs">Sponsored</p>
                        </div>
                    </div>
                    <div className="text-slate-500">•••</div>
                </div>
                
                {/* Post Content */}
                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 min-h-[200px] flex items-center justify-center text-center">
                    <p className="text-2xl font-black text-white italic">
                        "The average user has 338 friends but only knows 10% of them. 🧐 Real or Fake?"
                    </p>
                </div>

                {/* Actions */}
                <div className="p-4 flex gap-4 text-white">
                    <button onClick={() => { setIsLiked(!isLiked); setLikes(l => isLiked ? l - 1 : l + 1); playSound('CLICK'); }}>
                        <Heart className={`w-7 h-7 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    <MessageCircle className="w-7 h-7" />
                    <Share2 className="w-7 h-7 ml-auto" />
                </div>
                <div className="px-4 pb-2">
                    <p className="text-white font-bold text-sm">{likes} likes</p>
                </div>

                {/* Comments Section */}
                <div className="px-4 pb-4 space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                    {showModelAnswer && (
                         <div className="flex gap-2 animate-slideUp">
                            <div className="w-6 h-6 rounded-full bg-teal-500 flex-shrink-0"></div>
                            <div className="bg-slate-800 rounded-2xl rounded-tl-none p-3 text-sm">
                                <span className="text-teal-400 font-bold block mb-1">Teacher Bot 🤖</span>
                                <p className="text-slate-300">
                                   Facts! Most "friends" are just contacts. Real ones are the people you actually <span className="text-teal-400 font-bold">meet up</span> with! 💯
                                </p>
                            </div>
                         </div>
                    )}
                    {comments.map((c, i) => (
                        <div key={i} className="flex gap-2 animate-fadeIn">
                           <div className="w-6 h-6 rounded-full bg-indigo-500 flex-shrink-0"></div>
                           <div>
                               <p className="text-white text-sm"><span className="font-bold mr-2">{c.user}</span>{c.text}</p>
                               <p className="text-slate-500 text-[10px] mt-1">{c.time}</p>
                           </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-3 border-t border-slate-800 flex gap-2">
                    <input 
                       type="text" 
                       placeholder="Add a comment..." 
                       className="bg-transparent flex-1 text-white text-sm outline-none placeholder:text-slate-600"
                       value={discussionInput}
                       onChange={(e) => setDiscussionInput(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                    />
                    <button 
                        onClick={handlePostComment}
                        disabled={!discussionInput}
                        className="text-blue-500 font-bold text-sm disabled:opacity-50"
                    >
                        Post
                    </button>
                </div>
            </div>
          </div>
        )
    },
    {
      title: "Hacks",
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-2">Grammar Hacks</h2>
            <p className="text-slate-400">Cheat codes for English tenses.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {GRAMMAR_RULES.map((rule, idx) => (
              <div key={idx} className="bg-slate-800 p-6 rounded-[2rem] border border-slate-700 hover:border-teal-500 transition-all hover:scale-105 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500/20 to-transparent rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                
                <h3 className="font-black text-xl text-white mb-2 relative z-10">{rule.title}</h3>
                <div className="inline-block bg-slate-900 px-3 py-1 rounded-full text-xs font-bold text-teal-400 mb-4 border border-slate-700 relative z-10">
                    {rule.usage.toUpperCase()}
                </div>
                
                <GrammarTimeline type={rule.usage} />

                <p className="text-slate-300 font-medium mb-4 text-sm">{rule.description}</p>
                <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                   {rule.examples.map((ex, i) => (
                       <p key={i} className="text-xs text-slate-400 mb-1 last:mb-0">"{ex}"</p>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Battle",
      icon: <Zap className="w-5 h-5" />,
      content: (
        <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto pb-20">
          <div className="bg-slate-900 rounded-[2rem] border-2 border-slate-700 p-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-purple-500"></div>
            <div className="bg-slate-800/50 p-6 rounded-[1.8rem]">
               <h3 className="font-black text-xl text-white mb-6 flex items-center gap-2">
                 <PenTool className="text-teal-400"/> Fill the Gaps
               </h3>
            
               {PRACTICE_EXERCISES.map((ex, i) => {
                 const userVal = practiceAnswers[ex.id]?.trim() || '';
                 const isCorrect = Array.isArray(ex.correctAnswer) 
                    ? ex.correctAnswer.some(a => a.toLowerCase() === userVal.toLowerCase())
                    : ex.correctAnswer.toLowerCase() === userVal.toLowerCase();
                 
                 return (
                   <div key={ex.id} className="mb-6 last:mb-0">
                     <p className="text-lg font-bold text-slate-300 mb-3">
                       <span className="text-teal-500 mr-2">{i+1}.</span> 
                       {ex.question.split('_____').map((part, idx, arr) => (
                          <React.Fragment key={idx}>
                             {part}
                             {idx < arr.length - 1 && (
                                <span className={`inline-block mx-1 border-b-2 min-w-[100px] text-center font-black ${
                                    showResults 
                                     ? isCorrect ? 'text-green-400 border-green-500' : 'text-red-400 border-red-500'
                                     : 'text-white border-slate-500'
                                }`}>
                                   {userVal || '______'}
                                </span>
                             )}
                          </React.Fragment>
                       ))}
                     </p>
                     
                     <input 
                         type="text" 
                         disabled={showResults}
                         autoComplete="off"
                         className="w-full bg-black/20 border border-slate-600 rounded-xl p-3 text-white focus:border-teal-500 outline-none transition-colors font-medium placeholder:text-slate-600"
                         placeholder="Type answer..."
                         value={practiceAnswers[ex.id] || ''}
                         onChange={(e) => setPracticeAnswers({...practiceAnswers, [ex.id]: e.target.value})}
                     />
                     
                     {showResults && !isCorrect && (
                        <div className="mt-2 text-red-400 text-sm font-bold flex items-center gap-2 animate-fadeIn">
                            <X size={14} /> Answer: {Array.isArray(ex.correctAnswer) ? ex.correctAnswer[0] : ex.correctAnswer}
                        </div>
                     )}
                   </div>
                 );
               })}
            </div>
          </div>

          {!showResults && (
            <button 
              onClick={handlePracticeCheck}
              className="w-full py-5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black text-2xl rounded-2xl shadow-lg hover:shadow-teal-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {t('check')} <Zap fill="white" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20 pt-24 px-4">
      <div className="max-w-4xl mx-auto mb-8">
        {/* Navigation Tabs */}
        <div className="bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl flex gap-1 sticky top-24 z-30 border border-slate-800">
          {steps.map((s, i) => (
            <button 
              key={i}
              onClick={() => { setStep(i); playSound('CLICK'); }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                i === step 
                  ? 'bg-slate-800 text-teal-400 shadow-md border border-slate-700' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
               {s.icon}
               <span className="hidden sm:inline">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2">
        {steps[step].content}
      </div>
    </div>
  );
};