import React, { useState } from 'react';
import { TROUBLESHOOTING_CASES } from '../data/troubleshootingData';
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, Activity, Wrench } from 'lucide-react';

export const DiagnosticLab: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(TROUBLESHOOTING_CASES[0].id);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const activeCase = TROUBLESHOOTING_CASES.find((c) => c.id === selectedCaseId) || TROUBLESHOOTING_CASES[0];
  const activeAnswerId = selectedAnswers[activeCase.id];
  const chosenOption = activeCase.probableCauses.find((p) => p.id === activeAnswerId);

  const handleSelectOption = (causeId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [activeCase.id]: causeId,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Case Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            ACMV Operational Diagnostic & Troubleshooting Lab
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Investigate real-world MEP facility alarms, examine BMS SCADA trends, and apply root-cause engineering fixes.
          </p>
        </div>

        {/* Case Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {TROUBLESHOOTING_CASES.map((item) => {
            const isSelected = item.id === activeCase.id;
            const hasAnswered = !!selectedAnswers[item.id];
            const answer = item.probableCauses.find((p) => p.id === selectedAnswers[item.id]);

            return (
              <button
                key={item.id}
                onClick={() => setSelectedCaseId(item.id)}
                className={`text-left p-3.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-sky-50/70 border-sky-500 dark:bg-sky-950/40 dark:border-sky-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>{item.caseNumber}</span>
                  {hasAnswered && (
                    <span className={answer?.isCorrect ? 'text-emerald-500 font-semibold' : 'text-amber-500 font-semibold'}>
                      {answer?.isCorrect ? 'Resolved' : 'Reviewing'}
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2">
                  {item.title}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                  {item.facilityType}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Case Details & Investigation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Facility Incident & BMS Sensor Readings (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Alarm Incident Report</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {activeCase.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeCase.symptom}
            </p>
          </div>

          {/* BMS Live SCADA Telemetry Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              BMS Sensor Trend Log
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium">
                    <th className="pb-2">Sensor Parameter</th>
                    <th className="pb-2">Reading</th>
                    <th className="pb-2">Normal Baseline</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {activeCase.bmsReadings.map((reading, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 text-slate-700 dark:text-slate-300 font-sans font-medium">
                        {reading.label}
                      </td>
                      <td className="py-2.5 font-semibold text-slate-900 dark:text-white">
                        {reading.value}
                      </td>
                      <td className="py-2.5 text-slate-400">{reading.normal}</td>
                      <td className="py-2.5 text-right">
                        {reading.status === 'normal' && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            Normal
                          </span>
                        )}
                        {reading.status === 'warning' && (
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                            Warning
                          </span>
                        )}
                        {reading.status === 'critical' && (
                          <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
                            Critical
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Hypothesis & Engineering Rectification (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Select Your Engineering Diagnostic Hypothesis:
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Analyze the thermodynamic readings above. What is the root mechanical fault causing this condition?
            </p>

            <div className="space-y-3">
              {activeCase.probableCauses.map((cause) => {
                const isSelected = activeAnswerId === cause.id;

                return (
                  <button
                    key={cause.id}
                    onClick={() => handleSelectOption(cause.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? cause.isCorrect
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100'
                          : 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-950 dark:text-red-100'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? cause.isCorrect
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-red-500 bg-red-500 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && (cause.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />)}
                      </div>
                      <span className="text-xs font-medium leading-relaxed">
                        {cause.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Feedback & Resolution Protocol */}
            {chosenOption && (
              <div
                className={`mt-5 p-4 rounded-xl border ${
                  chosenOption.isCorrect
                    ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                    : 'border-amber-200 bg-amber-50/60 dark:border-amber-800/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-xs">
                  {chosenOption.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  )}
                  <span>{chosenOption.isCorrect ? 'Accurate Root-Cause Diagnosis!' : 'Diagnosis Refined'}</span>
                </div>
                <p className="text-xs leading-relaxed mb-3">{chosenOption.feedback}</p>

                {chosenOption.isCorrect && (
                  <div className="pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5" />
                      Engineering Rectification Protocol:
                    </span>
                    <p className="text-xs font-mono text-emerald-950 dark:text-emerald-100 leading-relaxed">
                      {chosenOption.resolutionSteps}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
