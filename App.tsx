import React, { useState, useEffect } from 'react';
import { StudentMode } from './components/StudentMode';
import { TeacherDashboard } from './components/TeacherDashboard';
import { KahootMode } from './components/KahootMode';
import { VocabBuilder } from './components/VocabBuilder';
import { UserState, Mode, Language } from './types';
import { Users, GraduationCap, Gamepad2, BookA, Zap, Sun, Moon, Globe } from 'lucide-react';
import { UI_TEXT, SOUNDS } from './constants';

export default function App() {
  const [mode, setMode] = useState<Mode>('landing');
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [userState, setUserState] = useState<UserState>({
    xp: 0,
    streak: 1,
    completedModules: []
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  if (mode !== 'landing') return (
    <div className={darkMode ? 'dark' : ''}>
       {renderContent()}
    </div>
  );

  return (
    <div className={`min-h-screen font-sans selection:bg-teal-500 selection:text-white transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Bar */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
         <div className="flex gap-4">
             <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-600" />}
             </button>
             <div className="relative group">
                 <button className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1">
                    <Globe className={darkMode ? "text-slate-300" : "text-slate-600"} />
                    <span className="text-xs font-bold uppercase">{lang}</span>
                 </button>
                 <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden hidden group-hover:block min-w-[100px] border border-gray-100 dark:border-slate-700">
                    <button onClick={() => setLang('en')} className="block w-full text-left px-4 py-2 hover:bg-teal-50 dark:hover:bg-slate-700 text-sm">English</button>
                    <button onClick={() => setLang('ru')} className="block w-full text-left px-4 py-2 hover:bg-teal-50 dark:hover:bg-slate-700 text-sm">Русский</button>
                    <button onClick={() => setLang('uz')} className="block w-full text-left px-4 py-2 hover:bg-teal-50 dark:hover:bg-slate-700 text-sm">O'zbek</button>
                 </div>
             </div>
         </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden pb-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover opacity-10 blur-sm dark:opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-6 pt-32 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20 mb-6 backdrop-blur-sm animate-fadeIn font-bold tracking-widest uppercase text-xs">
            Oxford Navigate B1+
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 animate-slideUp">
            {t('unitTitle')}
          </h1>
          <p className="text-2xl text-slate-500 dark:text-slate-300 max-w-3xl mx-auto mb-16 leading-relaxed font-light">
             Interactive CELTA-powered learning platform with gamified grammar, reading, and vocabulary modules.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-20">
             <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 backdrop-blur-md flex flex-col items-center min-w-[180px] shadow-xl transform hover:scale-105 transition-transform">
               <Zap className="text-yellow-400 mb-2 fill-yellow-400" size={32} />
               <span className="text-4xl font-black text-slate-800 dark:text-white">{userState.xp}</span>
               <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('xpEarned')}</span>
             </div>
             <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 backdrop-blur-md flex flex-col items-center min-w-[180px] shadow-xl transform hover:scale-105 transition-transform delay-75">
               <div className="text-orange-500 mb-2 text-3xl">🔥</div>
               <span className="text-4xl font-black text-slate-800 dark:text-white">{userState.streak}</span>
               <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('dayStreak')}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="max-w-7xl mx-auto px-6 pb-20 -mt-10 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Student Mode Card */}
          <button 
            onClick={() => { setMode('student'); playClick(); }}
            className="group relative bg-white dark:bg-slate-800 text-left p-10 rounded-[2.5rem] shadow-2xl hover:shadow-teal-500/30 transition-all hover:-translate-y-3 overflow-hidden border border-gray-100 dark:border-slate-700"
          >
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-teal-50 dark:bg-teal-900/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
               <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/50 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-8 group-hover:rotate-12 transition-transform shadow-sm">
                 <Users size={32} />
               </div>
               <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{t('studentMode')}</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Core lesson path. Interactive reading, discussion & grammar tasks.</p>
            </div>
          </button>

          {/* Kahoot Card */}
          <button 
            onClick={() => { setMode('kahoot'); playClick(); }}
            className="group relative bg-gradient-to-br from-indigo-600 to-purple-700 text-left p-10 rounded-[2.5rem] shadow-2xl hover:shadow-purple-500/50 transition-all hover:-translate-y-3 overflow-hidden"
          >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
             <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform backdrop-blur-sm border border-white/30">
                  <Gamepad2 size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">{t('kahootMode')}</h3>
                <p className="text-indigo-100 text-sm font-medium leading-relaxed">High-energy quiz battle. Test your reflexes and earn massive XP.</p>
             </div>
          </button>

          {/* Vocab Card */}
          <button 
            onClick={() => { setMode('vocab'); playClick(); }}
            className="group relative bg-white dark:bg-slate-800 text-left p-10 rounded-[2.5rem] shadow-2xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-3 overflow-hidden border border-gray-100 dark:border-slate-700"
          >
             <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
             <div className="relative z-10">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 group-hover:rotate-12 transition-transform shadow-sm">
                  <BookA size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t('vocabMode')}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Interactive 3D flashcards. Master the Unit 1 wordlist.</p>
             </div>
          </button>

          {/* Teacher Card */}
          <button 
            onClick={() => { setMode('teacher'); playClick(); }}
            className="group relative bg-slate-100 dark:bg-slate-800/50 text-left p-10 rounded-[2.5rem] shadow-xl hover:shadow-slate-500/20 transition-all hover:-translate-y-3 overflow-hidden border border-slate-200 dark:border-slate-700"
          >
             <div className="relative z-10">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 mb-8 group-hover:scale-110 transition-transform">
                  <GraduationCap size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-700 dark:text-white mb-3">{t('teacherMode')}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Lesson aims, keys & CCQs. For instructor use only.</p>
             </div>
          </button>

        </div>
      </div>
    </div>
  );
}