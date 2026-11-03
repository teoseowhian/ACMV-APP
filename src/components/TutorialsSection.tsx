import React, { useState } from 'react';
import { TUTORIAL_GUIDES, TutorialGuide, TutorialQuestion } from '../data/tutorialGuides';
import { FileText, ChevronDown, ChevronUp, Eye, EyeOff, BookOpen, Layers } from 'lucide-react';

interface TutorialsSectionProps {
  onOpenPdf: (pdfPath: string, title?: string) => void;
  selectedTutorialId?: string;
}

export const TutorialsSection: React.FC<TutorialsSectionProps> = ({
  onOpenPdf,
  selectedTutorialId,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(selectedTutorialId || 'all');
  // Track open question accordions: key = `${tutorialId}-${qIdx}`
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(() => {
    // Default open first question of each tutorial
    const initial: Record<string, boolean> = {};
    TUTORIAL_GUIDES.forEach((tut) => {
      initial[`${tut.id}-0`] = true;
    });
    return initial;
  });

  // Track hidden/revealed answers: key = `${tutorialId}-${qIdx}`
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAnswer = (key: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredTutorials =
    activeFilter === 'all'
      ? TUTORIAL_GUIDES
      : TUTORIAL_GUIDES.filter((tut) => tut.id === activeFilter);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8102E]">
              <BookOpen className="w-4 h-4" /> Official Diploma Curriculum Tutorials
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Official Tutorials (AMVS 1 – 4)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Step-by-step engineering working and solutions for the 4 official module tutorials.
              Each question includes detailed derivation steps with final answers hidden for active learning.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All 4 Tutorials
            </button>
            {TUTORIAL_GUIDES.map((tut, i) => (
              <button
                key={tut.id}
                onClick={() => setActiveFilter(tut.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeFilter === tut.id
                    ? 'bg-[#C8102E] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tutorial {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exactly 4 Tutorial Cards */}
      <div className="space-y-6">
        {filteredTutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            id={tutorial.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition hover:border-slate-300"
          >
            {/* Card Header Bar */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#C8102E] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {tutorial.amvsTopic.split(':')[0]}
                  </span>
                  <span className="bg-white/10 text-slate-200 text-xs font-medium px-2.5 py-0.5 rounded-md">
                    Covered in: <strong>{tutorial.weeksCoveredLabel}</strong>
                  </span>
                  <span className="text-xs text-slate-300">
                    ({tutorial.questions.length} questions)
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {tutorial.title}
                </h3>
              </div>

              {/* Official PDF Link (BASE_URL safe via onOpenPdf) */}
              <button
                onClick={() => onOpenPdf(tutorial.pdfPath, tutorial.title)}
                className="self-start sm:self-center bg-white hover:bg-rose-50 text-slate-900 hover:text-[#C8102E] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition whitespace-nowrap cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#C8102E]" />
                <span>Open Tutorial PDF</span>
              </button>
            </div>

            {/* Questions Accordion List */}
            <div className="p-5 sm:p-6 space-y-3 bg-slate-50/40">
              {tutorial.questions.map((q: TutorialQuestion, qIdx: number) => {
                const key = `${tutorial.id}-${qIdx}`;
                const isOpen = !!openAccordions[key];
                const isAnswerRevealed = !!revealedAnswers[key];

                return (
                  <div
                    key={q.questionNumber}
                    className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden transition"
                  >
                    {/* Accordion Toggle Header */}
                    <button
                      onClick={() => toggleAccordion(key)}
                      className="w-full text-left p-4 sm:p-4.5 flex items-start justify-between gap-3 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-[#C8102E] bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
                            {q.questionNumber}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                          {q.prompt}
                        </p>
                      </div>

                      <div className="p-1 text-slate-400 shrink-0 mt-0.5">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-700" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Content Body */}
                    {isOpen && (
                      <div className="px-4 pb-5 pt-1 border-t border-slate-100 space-y-4 text-xs">
                        {/* Numbered Step-by-Step Working */}
                        <div className="space-y-2 pt-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-slate-400" /> Numbered Step-by-Step Working:
                          </div>
                          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-[11px] leading-relaxed space-y-2">
                            {q.steps.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2.5">
                                <span className="text-rose-400 font-bold shrink-0">{sIdx + 1}.</span>
                                <span className="text-slate-200 whitespace-pre-wrap">{step.replace(/^\d+\.\s*/, '')}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Final Answer (Hidden behind Show Answer button) */}
                        <div className="pt-2">
                          {!isAnswerRevealed ? (
                            <button
                              onClick={() => toggleAnswer(key)}
                              className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-[#C8102E] border border-rose-200 font-bold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer shadow-2xs"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Show Final Answer</span>
                            </button>
                          ) : (
                            <div className="space-y-2 bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 text-emerald-950">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                                  ✓ Verified Final Answer
                                </span>
                                <button
                                  onClick={() => toggleAnswer(key)}
                                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                                >
                                  <EyeOff className="w-3.5 h-3.5" /> Hide answer
                                </button>
                              </div>
                              <p className="text-xs font-semibold leading-relaxed font-sans text-emerald-900">
                                {q.finalAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
