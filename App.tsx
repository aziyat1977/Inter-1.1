import React, { useState, useEffect } from 'react';
import { StudentMode } from './components/StudentMode';
import { TeacherDashboard } from './components/TeacherDashboard';
import { KahootMode } from './components/KahootMode';
import { VocabBuilder } from './components/VocabBuilder';
import { UserState, Mode, Language } from './types';
import { Users, GraduationCap, Gamepad2, BookA, Zap, Globe, Trophy, Star, Crown } from 'lucide-react';
import { UI_TEXT, SOUNDS, LEVELS, BADGES } from './constants';

export default function App() {
  const [mode, setMode] = useState<Mode>('landing');
  const [lang, setLang] = useState<Language>('en');
  const [userState, setUserState] = useState<UserState>({
    xp: 0,
    level: 0,
    streak: 3,
    completedModules: [],
    badges: ['first_blood']
  });
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Check for level up
  useEffect(() => {
    const nextLevel = LEVELS.findIndex(l => l.xp > userState.xp);
    const currentLevelIdx = nextLevel === -1 ? LEVELS.length - 1 : nextLevel - 1;
    
    if (currentLevelIdx > userState.level) {
        setUserState(prev => ({...prev, level: currentLevelIdx}));
        setShowLevelUp(true);
        const audio = new Audio(SOUNDS.SUCCESS);
        audio.play().catch(()=>{});
    }
  }, [userState.xp]);

  const addXP = (amount: number) => {
    setUserState(prev => ({ ...prev, xp: prev.xp + amount }));
  };
  
  const playClick = () => {
     const audio = new Audio(SOUNDS.CLICK);
     audio.volume = 0.2;
     audio.play().catch(() => {});
  }

  const t = (key: string) => UI_TEXT[key]?.[lang] || key;

  const renderContent = () => {
    switch(mode) {
        case 'student': return <StudentMode addXP={addXP} lang={lang} />;
        case 'teacher': return <TeacherDashboard onBack={() => setMode('landing')} lang={lang} />;
        case 'kahoot': return <KahootMode addXP={addXP} onExit={() => setMode('landing')} lang={lang} />;
        case 'vocab': return <VocabBuilder onBack={() => setMode('landing')} lang={lang} />;
        default: return null;
    }
  };

  const currentLevelData = LEVELS[userState.level];
  const nextLevelData = LEVELS[userState.level + 1];
  const progressPercent = nextLevelData 
    ? ((userState.xp - currentLevelData.xp) / (nextLevelData.xp - currentLevelData.xp)) * 100 
    : 100;

  if (mode !== 'landing') return (
    <div className="dark">
       {renderContent()}
    </div>
  );

  return (
    <div className="min-h-screen font-sans selection:bg-teal-500 selection:text-white bg-black text-white dark">
      
      {/* Level Up Modal */}
      {showLevelUp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-4">
            <div className="bg-gradient-to-b from-slate-900 to-black p-8 rounded-[2rem] border-2 border-yellow-400/50 shadow-[0_0_50px_rgba(250,204,21,0.3)] text-center max-w-sm w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
                <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
                <h2 className="text-3xl font-black text-white uppercase italic tracking-wider mb-2">Level Up!</h2>
                <p className="text-slate-400 mb-6 font-bold">You are now:</p>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 mb-8">
                    {LEVELS[userState.level].name}
                </div>
                <button 
                    onClick={() => setShowLevelUp(false)}
                    className="w-full py-4 bg-yellow-400 text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                >
                    Claim Rewards
                </button>
            </div>
        </div>
      )}

      {/* Top Bar / Profile Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 p-4 sticky top-0 z-50">
         <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* User Profile */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-lg">😎</div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className={`font-black uppercase text-sm ${currentLevelData.color}`}>{currentLevelData.name}</span>
                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">Lvl {userState.level + 1}</span>
                    </div>
                    {/* XP Bar */}
                    <div className="w-32 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden relative">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-blue-500" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Badges / Streak */}
            <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700">
                    <Zap className="text-yellow-400 fill-yellow-400 w-4 h-4" />
                    <span className="font-bold text-sm">{userState.streak}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700">
                    <Star className="text-purple-400 fill-purple-400 w-4 h-4" />
                    <span className="font-bold text-sm">{userState.xp}</span>
                </div>
            </div>

            {/* Lang Switcher */}
             <div className="relative group">
                 <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Globe className="text-slate-400" />
                 </button>
                 <div className="absolute top-full right-0 mt-2 bg-slate-800 rounded-xl shadow-xl overflow-hidden hidden group-hover:block min-w-[100px] border border-slate-700">
                    <button onClick={() => setLang('en')} className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-sm">ENG</button>
                    <button onClick={() => setLang('ru')} className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-sm">RUS</button>
                    <button onClick={() => setLang('uz')} className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-sm">UZB</button>
                 </div>
             </div>
         </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden pb-10 pt-16">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-6 backdrop-blur-sm animate-fadeIn font-bold tracking-widest uppercase text-[10px]">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span> Oxford Navigate B1+ Unit 1
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 animate-slideUp">
            TRENDS.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
             Master Present Tenses & Friendship Vocab to level up your English stats.
          </p>

          {/* Badges Display */}
          <div className="flex justify-center gap-4 mb-16 flex-wrap">
             {BADGES.map(b => (
                 <div key={b.id} className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-slate-900 border-2 ${userState.badges.includes(b.id) ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)] grayscale-0 opacity-100' : 'border-slate-800 grayscale opacity-30'} transition-all`} title={b.name}>
                    {b.icon}
                 </div>
             ))}
          </div>
        </div>
      </div>

      {/* Mode Selection Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20 -mt-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Story Mode */}
          <button 
            onClick={() => { setMode('student'); playClick(); }}
            className="group relative h-80 bg-slate-900 rounded-[2.5rem] p-8 text-left border border-slate-800 hover:border-teal-500 transition-all hover:-translate-y-2 overflow-hidden flex flex-col justify-end"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="relative z-20">
               <div className="flex justify-between items-end mb-2">
                 <h3 className="text-3xl font-black text-white italic">{t('studentMode')}</h3>
                 <Users className="text-teal-400 w-8 h-8 mb-1" />
               </div>
               <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full w-1/3 bg-teal-400"></div>
               </div>
               <p className="text-xs text-teal-400 mt-2 font-bold uppercase tracking-wider">Chapter 1 • In Progress</p>
            </div>
          </button>

          {/* Battle Mode */}
          <button 
            onClick={() => { setMode('kahoot'); playClick(); }}
            className="group relative h-80 bg-indigo-900 rounded-[2.5rem] p-8 text-left border border-indigo-700 hover:border-purple-400 transition-all hover:-translate-y-2 overflow-hidden flex flex-col justify-end shadow-[0_0_30px_rgba(79,70,229,0.2)]"
          >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
             <div className="absolute top-0 right-0 p-6">
                <span className="bg-yellow-400 text-black text-xs font-black px-2 py-1 rounded uppercase">2x XP</span>
             </div>
             <div className="relative z-20">
                <Gamepad2 className="text-white w-12 h-12 mb-4 group-hover:rotate-12 transition-transform" />
                <h3 className="text-3xl font-black text-white italic leading-none mb-2">{t('kahootMode')}</h3>
                <p className="text-indigo-200 text-sm font-medium">Ranked Match</p>
             </div>
          </button>

          {/* Swipe Vocab */}
          <button 
            onClick={() => { setMode('vocab'); playClick(); }}
            className="group relative h-80 bg-slate-900 rounded-[2.5rem] p-8 text-left border border-slate-800 hover:border-pink-500 transition-all hover:-translate-y-2 overflow-hidden flex flex-col justify-between"
          >
             <div className="absolute -right-12 -top-12 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/40 transition-colors"></div>
             
             <BookA className="text-pink-500 w-10 h-10 relative z-10" />
             
             <div className="relative z-20">
                <h3 className="text-3xl font-black text-white italic mb-2">{t('vocabMode')}</h3>
                <p className="text-slate-400 text-sm">8 cards pending</p>
             </div>
          </button>

           {/* Mock Leaderboard */}
           <div className="bg-slate-900 rounded-[2.5rem] p-6 border border-slate-800 flex flex-col h-80 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6 z-10">
                 <Crown className="text-yellow-400 w-5 h-5" />
                 <h3 className="font-black text-white uppercase tracking-wider text-sm">Top Players</h3>
              </div>
              
              <div className="space-y-4 relative z-10">
                 <div className="flex items-center gap-3 opacity-50">
                    <div className="font-black text-slate-500">1</div>
                    <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                    <div className="text-sm font-bold text-slate-300">Alex_99</div>
                    <div className="ml-auto text-xs text-yellow-500 font-bold">5200 XP</div>
                 </div>
                 <div className="flex items-center gap-3 opacity-50">
                    <div className="font-black text-slate-500">2</div>
                    <div className="w-8 h-8 rounded-full bg-red-500"></div>
                    <div className="text-sm font-bold text-slate-300">Sarah.B</div>
                    <div className="ml-auto text-xs text-yellow-500 font-bold">4850 XP</div>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-xl border border-teal-500/30">
                    <div className="font-black text-teal-500">3</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 p-[1px]">
                         <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[10px]">😎</div>
                    </div>
                    <div className="text-sm font-bold text-white">YOU</div>
                    <div className="ml-auto text-xs text-yellow-400 font-bold">{userState.xp} XP</div>
                 </div>
              </div>
              
              <div className="mt-auto text-center z-10">
                 <button onClick={() => setMode('teacher')} className="text-xs text-slate-600 hover:text-slate-400 uppercase font-bold tracking-widest">
                     Teacher Admin
                 </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}