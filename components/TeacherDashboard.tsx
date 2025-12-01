import React, { useState } from 'react';
import { Eye, Book, List, CheckSquare, EyeOff } from 'lucide-react';
import { GRAMMAR_RULES, VOCAB_LIST, READING_TEXT, UI_TEXT } from '../constants';
import { Language } from '../types';

export const TeacherDashboard: React.FC<{ onBack: () => void, lang: Language }> = ({ onBack, lang }) => {
  const [revealAll, setRevealAll] = useState(false);
  const t = (key: string) => UI_TEXT[key]?.[lang] || key;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-1">Teacher Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Unit 1.1: Trends & Friends</p>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={() => setRevealAll(!revealAll)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold hover:bg-indigo-200 transition-colors"
            >
                {revealAll ? <><EyeOff size={18} /> Hide Keys</> : <><Eye size={18} /> Reveal Keys</>}
            </button>
            <button onClick={onBack} className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white rounded-xl font-bold hover:bg-gray-300 transition-colors">{t('back')}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lesson Aims */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border-l-8 border-blue-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800 dark:text-white">
              <Book className="text-blue-500" /> Lesson Aims
            </h2>
            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
                  Engage students with the topic of friendship in the digital age.
              </li>
              <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
                  Clarify usage of Present Simple, Continuous, and Perfect.
              </li>
              <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
                  Practice friendship-related vocabulary (phrasal verbs).
              </li>
              <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
                  Encourage fluency through open discussions regarding Facebook stats.
              </li>
            </ul>
          </div>

          {/* CCQs */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border-l-8 border-purple-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800 dark:text-white">
              <Eye className="text-purple-500" /> Concept Checking Questions (CCQs)
            </h2>
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <p className="font-bold text-sm text-purple-800 dark:text-purple-300 mb-2 uppercase tracking-wide">Target: "I have known him for 3 years."</p>
                <div className="space-y-1 text-gray-700 dark:text-gray-300">
                   <p>Q: Do I know him now? <span className="font-bold text-green-600">(Yes)</span></p>
                   <p>Q: Did I meet him in the past? <span className="font-bold text-green-600">(Yes)</span></p>
                   <p>Q: Is the connection finished? <span className="font-bold text-red-600">(No)</span></p>
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <p className="font-bold text-sm text-purple-800 dark:text-purple-300 mb-2 uppercase tracking-wide">Target: "I am meeting my friends."</p>
                <div className="space-y-1 text-gray-700 dark:text-gray-300">
                    <p>Q: Is this a habit? <span className="font-bold text-red-600">(Maybe not, usually temporary)</span></p>
                    <p>Q: Is it happening around now? <span className="font-bold text-green-600">(Yes)</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Answer Key */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border-l-8 border-green-500 md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800 dark:text-white">
              <CheckSquare className="text-green-500" /> Answer Keys
            </h2>
            <div className={`grid md:grid-cols-3 gap-8 transition-all duration-500 ${revealAll ? 'opacity-100 blur-0' : 'opacity-50 blur-sm hover:opacity-100 hover:blur-0'}`}>
              <div>
                <h3 className="font-black text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2 mb-4">Reading</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  <li>To raise money for charity (£3000+).</li>
                  <li>Europe (UK, Poland, Finland, etc), New Zealand, USA.</li>
                </ol>
              </div>
              <div>
                <h3 className="font-black text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2 mb-4">Ex 1a (Grammar)</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  <li><span className="font-bold text-green-600">is meeting</span> (Temp/Current)</li>
                  <li><span className="font-bold text-green-600">takes</span> (Habit)</li>
                  <li><span className="font-bold text-green-600">they've now been</span> (Duration)</li>
                </ol>
              </div>
              <div>
                <h3 className="font-black text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2 mb-4">Ex 6a (Vocab)</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-bold text-green-600">Positive:</span> get on, meet up, have a lot in common, help out, keep in touch, make friends.</p>
                    <p><span className="font-bold text-red-500">Negative:</span> fall out, have an argument.</p>
                </div>
              </div>
            </div>
            {!revealAll && <p className="text-center text-sm text-gray-400 mt-4 italic">Hover to peek or click 'Reveal Keys'</p>}
          </div>
        </div>
      </div>
    </div>
  );
};