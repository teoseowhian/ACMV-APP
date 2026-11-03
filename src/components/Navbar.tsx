import React from 'react';
import { NavigationTab } from '../types/acmv';
import { Sun, Moon, Wind } from 'lucide-react';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenQuickQuiz: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleDarkMode,
  onOpenQuickQuiz,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-xs group-hover:bg-sky-500 transition-colors">
            <Wind className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            NP ACMV Masterclass
          </span>
        </button>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'home'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-600 dark:border-sky-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home (15 Weeks)
          </button>
          <button
            onClick={() => onSelectTab('lab')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'lab'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-600 dark:border-sky-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Lab Simulators (8)
          </button>
          <button
            onClick={() => onSelectTab('worksheets')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'worksheets'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-600 dark:border-sky-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sizing Worksheets
          </button>
          <button
            onClick={() => onSelectTab('pdf-library')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'pdf-library'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-600 dark:border-sky-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            PDF Courseware
          </button>
        </nav>

        {/* Zone 3: 1 primary action & theme switch */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={onOpenQuickQuiz}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            Quizzes & Exams
          </button>
        </div>
      </div>
    </header>
  );
};
