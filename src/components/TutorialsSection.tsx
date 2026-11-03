import React, { useState } from 'react';
import { TUTORIAL_SOLUTIONS, TutorialSolutionItem } from '../data/tutorialSolutions';
import { BookOpen, CheckCircle, FileText, ChevronRight } from 'lucide-react';

interface TutorialsSectionProps {
  onOpenPdf: (pdfPath: string) => void;
}

export const TutorialsSection: React.FC<TutorialsSectionProps> = ({ onOpenPdf }) => {
  const [selectedTutorial, setSelectedTutorial] = useState<string>('All');
  const [activeSolutionId, setActiveSolutionId] = useState<string>(TUTORIAL_SOLUTIONS[0].id);

  const tutorialTabs = ['All', 'AMVS 1', 'AMVS 2', 'AMVS 3', 'AMVS 4'];

  const filteredSolutions = TUTORIAL_SOLUTIONS.filter(
    (item) => selectedTutorial === 'All' || item.tutorialNumber === selectedTutorial
  );

  const activeSolution =
    TUTORIAL_SOLUTIONS.find((s) => s.id === activeSolutionId) || filteredSolutions[0];

  const tutorialPdfMap: Record<string, string> = {
    'AMVS 1': `${import.meta.env.BASE_URL}assets/aistudio/Tutorial_1_Apr_26_c1496a6f.pdf`,
    'AMVS 2': `${import.meta.env.BASE_URL}assets/aistudio/Tutorial_2_Apr_26_1b03e097.pdf`,
    'AMVS 3': `${import.meta.env.BASE_URL}assets/aistudio/Tutorial_3_Apr_26__1__57c7fbf4.pdf`,
    'AMVS 4': `${import.meta.env.BASE_URL}assets/aistudio/Tutorial_4_Apr_26_79ce2872.pdf`,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              Official Diploma Tutorial Worked Solutions
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              Tutorial Solutions & Step-by-Step Derivations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Complete mathematical walkthroughs and circuit index runs for Tutorials AMVS 1, 2, 3, and 4.
            </p>
          </div>

          {/* Tutorial Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tutorialTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTutorial(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedTutorial === tab
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Question Selector List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {filteredSolutions.map((sol) => {
            const isSelected = sol.id === activeSolution?.id;

            return (
              <button
                key={sol.id}
                onClick={() => setActiveSolutionId(sol.id)}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-sky-50 border-sky-500 dark:bg-sky-950/40 dark:border-sky-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>{sol.tutorialNumber}</span>
                  <span className="text-sky-600 dark:text-sky-400 font-semibold">{sol.questionNumber}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                  {sol.title}
                </h3>
              </button>
            );
          })}
        </div>
      </div>

      {/* Solution Detail Card */}
      {activeSolution && (
        <article className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-sky-600 dark:text-sky-400">
                <span>{activeSolution.tutorialNumber}</span>
                <span>·</span>
                <span>{activeSolution.questionNumber}</span>
                <span>·</span>
                <span>{activeSolution.topic}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                {activeSolution.title}
              </h2>
            </div>

            {tutorialPdfMap[activeSolution.tutorialNumber] && (
              <button
                onClick={() => onOpenPdf(tutorialPdfMap[activeSolution.tutorialNumber])}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap self-start"
              >
                <FileText className="w-3.5 h-3.5" />
                Open Tutorial PDF Sheet
              </button>
            )}
          </div>

          {/* Question Prompt */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {activeSolution.questionText}
          </div>

          {/* Given Data Box */}
          {activeSolution.givenData && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Recorded Design & Sensor Data:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-mono">
                {Object.entries(activeSolution.givenData).map(([key, val], idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-800 flex justify-between"
                  >
                    <span className="text-slate-500 font-sans">{key}:</span>
                    <span className="font-semibold text-slate-900 dark:text-white ml-2">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step by Step Breakdown */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Step-by-Step Engineering Solution:
            </span>
            <div className="p-5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 font-mono text-xs space-y-2 leading-relaxed overflow-x-auto">
              {activeSolution.stepByStepSolution.map((step, idx) => (
                <div key={idx} className={step.startsWith('(') || step.startsWith('1.') || step.startsWith('2.') ? 'text-sky-300 font-bold mt-2' : ''}>
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Final Answer Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-[11px] font-mono uppercase text-emerald-700 dark:text-emerald-400 block font-normal">
                Final Result Summary:
              </span>
              <span className="text-xs sm:text-sm font-mono">{activeSolution.finalAnswer}</span>
            </div>
          </div>
        </article>
      )}
    </div>
  );
};
