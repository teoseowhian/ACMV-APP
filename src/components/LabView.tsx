import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
} from 'lucide-react';
import { LAB_QUIZZES, LabQuizQuestion } from '../data/labQuizzes';

// Simulators
import { SimRefrigerationCycle } from './simulators/SimRefrigerationCycle';
import { SimAcSystemPicker } from './simulators/SimAcSystemPicker';
import { SimDuctSizing } from './simulators/SimDuctSizing';
import { SimChillerPerformance } from './simulators/SimChillerPerformance';
import { SimPipeSizing } from './simulators/SimPipeSizing';
import { SimEttvUValue } from './simulators/SimEttvUValue';
import { SimCoolingLoad } from './simulators/SimCoolingLoad';
import { SimPsychrometrics } from './simulators/SimPsychrometrics';
import { SimDesignConditions } from './simulators/SimDesignConditions';

// Advanced tools
import { DuctSizingWorksheet } from './DuctSizingWorksheet';
import { PipeSizingWorksheet } from './PipeSizingWorksheet';
import { ChillerAuditTool } from './ChillerAuditTool';
import { EttvCoolingLoadCalculator } from './EttvCoolingLoadCalculator';

export type LabTabId =
  | 'refrigeration'
  | 'ac-systems'
  | 'design-conditions'
  | 'ducts'
  | 'chiller'
  | 'pipes'
  | 'ettv'
  | 'cooling-load'
  | 'psychrometrics'
  | 'advanced';

interface LabMeta {
  id: LabTabId;
  label: string;
  lesson: string;
  code: string;
  goal: string;
}

const LAB_TABS: LabMeta[] = [
  {
    id: 'refrigeration',
    label: 'W1 AC Systems & Cycles',
    lesson: 'Week 1',
    code: 'Vapour Compression & AC System Picker',
    goal: 'Examine pressure-enthalpy state points, compressor power kW, COP, and select air-conditioning topologies (DX vs Chilled Water).',
  },
  {
    id: 'design-conditions',
    label: 'W2 Design Conditions',
    lesson: 'Week 2 (and Week 9)',
    code: 'Singapore SS 553 Standards & Comfort',
    goal: 'Evaluate indoor comfort targets (23–25°C, RH ≤65%), air velocity, positive room pressurization (+10 to +25 Pa), and outdoor air ventilation rates.',
  },
  {
    id: 'chiller',
    label: 'W2/W5 Chiller Performance',
    lesson: 'Weeks 2 & 5',
    code: 'Chiller Plant & Equipment Audit',
    goal: 'Calculate chiller cooling capacity in RT, compressor kW/RT, and verify Green Mark Platinum efficiency compliance (≤ 0.58 kW/RT).',
  },
  {
    id: 'ducts',
    label: 'W3 & 4 Ducts',
    lesson: 'Weeks 3 & 4',
    code: 'Equal Friction Method (0.8–1.0 Pa/m)',
    goal: 'Size circular and rectangular ducts using Huebscher’s formula while keeping air velocity ≤ 7.5 m/s and noise under NC 35.',
  },
  {
    id: 'pipes',
    label: 'W6 & 8 Pipes',
    lesson: 'Weeks 6 & 8',
    code: 'Schedule 40 Steel & Le/D Method',
    goal: 'Determine pipe diameter from water flow rate, calculate equivalent length of fittings, and compute total pump head in metres.',
  },
  {
    id: 'ettv',
    label: 'W10 ETTV',
    lesson: 'Week 10',
    code: 'BCA Singapore ETTV (≤ 50 W/m²)',
    goal: 'Evaluate multilayer wall U-values (Uw) and composite envelope thermal transfer value against statutory limits.',
  },
  {
    id: 'cooling-load',
    label: 'W12 Cooling Load',
    lesson: 'Week 12',
    code: 'SS 553 / ASHRAE Heat Balance',
    goal: 'Compute sensible and latent heat gains from occupants, lighting, equipment, solar fenestration, and outdoor ventilation.',
  },
  {
    id: 'psychrometrics',
    label: 'W13 & 14 Psychrometrics',
    lesson: 'Weeks 13 & 14',
    code: 'Adiabatic Air Mixing & Coil ADP',
    goal: 'Plot dry bulb and humidity ratio, determine adiabatic mixed air condition (M), and calculate cooling coil sensible & latent loads.',
  },
  {
    id: 'advanced',
    label: 'Advanced Tools',
    lesson: 'Full System Engineering',
    code: 'ASHRAE & SS 553 Comprehensive Worksheets',
    goal: 'Access multi-branch duct worksheets, pipe system audits, chiller plant logging, and full ETTV envelope models.',
  },
];

interface LabViewProps {
  initialLabId?: LabTabId;
  onBackToPoster: () => void;
  onOpenAiTutor: (topic?: string) => void;
  onOpenPdf: (pdfPath: string, title: string) => void;
}

export const LabView: React.FC<LabViewProps> = ({
  initialLabId = 'refrigeration',
  onBackToPoster,
  onOpenAiTutor,
  onOpenPdf,
}) => {
  const [activeTab, setActiveTab] = useState<LabTabId>(initialLabId);
  const [refrigSubMode, setRefrigSubMode] = useState<'cycle' | 'picker'>('cycle');
  const [activeAdvancedSubTab, setActiveAdvancedSubTab] = useState<'duct' | 'pipe' | 'chiller' | 'ettv'>('duct');

  // Quiz state for current active tab
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const currentLabMeta = LAB_TABS.find((t) => t.id === activeTab) || LAB_TABS[0];
  const currentQuestions: LabQuizQuestion[] = LAB_QUIZZES[activeTab] || LAB_QUIZZES['refrigeration'] || [];

  const handleSelectTab = (id: LabTabId) => {
    setActiveTab(id);
    setSelectedAnswers({});
    setShowQuizResults(false);
    window.location.hash = `#/lab/${id}`;
  };

  const handleQuizAnswer = (qIdx: number, optIdx: number) => {
    if (showQuizResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const score = currentQuestions.reduce((acc: number, q: LabQuizQuestion, idx: number) => {
    return acc + (selectedAnswers[idx] === q.correctIndex ? 1 : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPoster}
              className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 text-rose-500" />
              <span>← Course Poster</span>
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Interactive Engineering Labs
              </span>
              <span className="text-xs text-slate-500 ml-2">ACMV 2026</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAiTutor(currentLabMeta.label)}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-900/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto flex gap-1.5 pb-2.5 pt-1 no-scrollbar border-t border-slate-800/60">
          {LAB_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Lab Header Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
              <span>{currentLabMeta.lesson}</span>
              <span>•</span>
              <span className="text-slate-400">{currentLabMeta.code}</span>
            </div>
            <h1 className="text-2xl font-black text-white">{currentLabMeta.label}</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {currentLabMeta.goal}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => onOpenAiTutor(currentLabMeta.label)}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Lab Help & Formulas</span>
            </button>
          </div>
        </div>

        {/* Selected Simulator */}
        <div className="space-y-6">
          {(activeTab === 'refrigeration' || activeTab === 'ac-systems') && (
            <div className="space-y-4">
              <div className="flex gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 w-fit">
                <button
                  onClick={() => setRefrigSubMode('cycle')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    refrigSubMode === 'cycle' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Refrigeration Cycle (p-h Diagram)
                </button>
                <button
                  onClick={() => setRefrigSubMode('picker')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    refrigSubMode === 'picker' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AC System Picker & Equipment
                </button>
              </div>
              {refrigSubMode === 'cycle' ? <SimRefrigerationCycle /> : <SimAcSystemPicker />}
            </div>
          )}
          {activeTab === 'design-conditions' && <SimDesignConditions />}
          {activeTab === 'ducts' && <SimDuctSizing />}
          {activeTab === 'chiller' && <SimChillerPerformance />}
          {activeTab === 'pipes' && <SimPipeSizing />}
          {activeTab === 'ettv' && <SimEttvUValue />}
          {activeTab === 'cooling-load' && <SimCoolingLoad />}
          {activeTab === 'psychrometrics' && <SimPsychrometrics />}

          {/* Advanced Multi-Tool Section */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="flex gap-2 p-1.5 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
                <button
                  onClick={() => setActiveAdvancedSubTab('duct')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    activeAdvancedSubTab === 'duct' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Full Duct Sizing Worksheet (Tutorial 1)
                </button>
                <button
                  onClick={() => setActiveAdvancedSubTab('pipe')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    activeAdvancedSubTab === 'pipe' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Schedule 40 Pipe Worksheet (Tutorial 2)
                </button>
                <button
                  onClick={() => setActiveAdvancedSubTab('chiller')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    activeAdvancedSubTab === 'chiller' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Chiller Plant Audit & Green Mark
                </button>
                <button
                  onClick={() => setActiveAdvancedSubTab('ettv')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    activeAdvancedSubTab === 'ettv' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ETTV & Heat Balance Studio
                </button>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                {activeAdvancedSubTab === 'duct' && (
                  <DuctSizingWorksheet onOpenPdf={(path) => onOpenPdf(path, 'Duct Sizing Chart')} />
                )}
                {activeAdvancedSubTab === 'pipe' && (
                  <PipeSizingWorksheet onOpenPdf={(path) => onOpenPdf(path, 'Pipe Sizing Table')} />
                )}
                {activeAdvancedSubTab === 'chiller' && (
                  <ChillerAuditTool onOpenPdf={(path) => onOpenPdf(path, 'Chiller Lesson 5')} />
                )}
                {activeAdvancedSubTab === 'ettv' && <EttvCoolingLoadCalculator />}
              </div>
            </div>
          )}
        </div>

        {/* 5-Question Knowledge Quiz Section */}
        {activeTab !== 'advanced' && currentQuestions.length > 0 && (
          <section className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-rose-500" />
                  {currentLabMeta.label} Knowledge Check
                </h3>
                <p className="text-xs text-slate-400">
                  Test your mastery with 5 quick engineering questions. Instant step-by-step solutions provided.
                </p>
              </div>

              {showQuizResults ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    Score: {score} / {currentQuestions.length} ({((score / currentQuestions.length) * 100).toFixed(0)}%)
                  </span>
                  <button
                    onClick={() => {
                      setSelectedAnswers({});
                      setShowQuizResults(false);
                    }}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
                  >
                    Retake Quiz
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowQuizResults(true)}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  Submit & Check Answers
                </button>
              )}
            </div>

            <div className="space-y-5">
              {currentQuestions.map((q: LabQuizQuestion, qIdx: number) => {
                const userChoice = selectedAnswers[qIdx];
                const isCorrect = userChoice === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-slate-200">
                        <span className="text-rose-400 font-mono mr-2">Q{qIdx + 1}.</span>
                        {q.question}
                      </div>

                      {showQuizResults && (
                        <span className="shrink-0">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt: string, optIdx: number) => {
                        let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';

                        if (userChoice === optIdx) {
                          btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-semibold';
                        }

                        if (showQuizResults) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                          } else if (userChoice === optIdx && !isCorrect) {
                            btnStyle = 'bg-red-950/80 border-red-500 text-red-300 line-through';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleQuizAnswer(qIdx, optIdx)}
                            className={`p-3 rounded-lg border text-left transition flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {showQuizResults && optIdx === q.correctIndex && (
                              <span className="text-[10px] text-emerald-400 font-mono ml-2">Correct</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {showQuizResults && (
                      <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 border border-slate-800 font-mono">
                        <span className="text-rose-400 font-bold block mb-1">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
