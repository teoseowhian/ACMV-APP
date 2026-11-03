import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { CheckCircle2, XCircle, RotateCcw, Award, ChevronRight, HelpCircle } from 'lucide-react';

interface QuizSectionProps {
  onGoToCurriculum: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onGoToCurriculum }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];
  const selectedOptionIdx = userAnswers[currentQuestion.id];
  const hasAnsweredCurrent = selectedOptionIdx !== undefined;

  const handleSelectOption = (idx: number) => {
    if (hasAnsweredCurrent) return; // lock once answered
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: idx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentIdx(0);
    setIsFinished(false);
  };

  // Score calculation
  const correctCount = QUIZ_QUESTIONS.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);
  const scorePercent = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        {!isFinished ? (
          <div>
            {/* Header with Progress */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  {currentQuestion.topic}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
                </h2>
              </div>
              <span className="text-xs font-mono font-medium text-slate-400">
                Score: {correctCount} / {QUIZ_QUESTIONS.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
              <div
                className="bg-sky-600 h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Text */}
            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed mb-6">
              {currentQuestion.question}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOptionIdx === idx;
                const isCorrect = currentQuestion.correctIndex === idx;

                let btnStyles = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200';

                if (hasAnsweredCurrent) {
                  if (isCorrect) {
                    btnStyles = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100';
                  } else if (isSelected) {
                    btnStyles = 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-950 dark:text-red-100';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasAnsweredCurrent}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between text-xs sm:text-sm font-medium ${btnStyles}`}
                  >
                    <span>{option}</span>
                    {hasAnsweredCurrent && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                    )}
                    {hasAnsweredCurrent && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Standards Note when answered */}
            {hasAnsweredCurrent && (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Engineering Solution Breakdown:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
                {currentQuestion.formulaUsed && (
                  <div className="pt-2 font-mono text-[11px] text-sky-700 dark:text-sky-300">
                    Formula: {currentQuestion.formulaUsed}
                  </div>
                )}
                {currentQuestion.standardsNote && (
                  <div className="text-[11px] text-slate-400">
                    Reference Standard: {currentQuestion.standardsNote}
                  </div>
                )}
              </div>
            )}

            {/* Footer Action */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                disabled={!hasAnsweredCurrent}
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-600 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Masterclass Assessment Complete
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Air-Conditioning & Mechanical Ventilation (ACMV) Knowledge Check
              </p>
            </div>

            <div className="py-4 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl inline-block border border-slate-200 dark:border-slate-700">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {scorePercent}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {correctCount} of {QUIZ_QUESTIONS.length} Questions Correct
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              {scorePercent >= 80
                ? 'Excellent proficiency! You demonstrate a solid grasp of thermodynamics, central chilled water hydraulics, psychrometrics, and fire life safety codes.'
                : scorePercent >= 60
                ? 'Good work! Review the central chilled water hydronics and psychrometric coil calculations to further sharpen your MEP engineering expertise.'
                : 'Keep practicing! Review the curriculum modules, particularly the refrigeration cycle, Low Delta-T syndrome, and equal friction duct sizing.'}
            </p>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake Exam
              </button>
              <button
                onClick={onGoToCurriculum}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors"
              >
                Review Curriculum Modules
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
