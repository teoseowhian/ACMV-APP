import React, { useState } from 'react';
import { ChilledWaterPlantSim } from './ChilledWaterPlantSim';
import { PsychrometricTool } from './PsychrometricTool';
import { EttvCoolingLoadCalculator } from './EttvCoolingLoadCalculator';
import { ChillerAuditTool } from './ChillerAuditTool';
import { DiagnosticLab } from './DiagnosticLab';

interface CalculatorsHubProps {
  onOpenPdf: (pdfPath: string) => void;
}

export const CalculatorsHub: React.FC<CalculatorsHubProps> = ({ onOpenPdf }) => {
  const [activeTool, setActiveTool] = useState<
    'cooling-load' | 'chiller-audit' | 'psychrometrics' | 'plant-sim' | 'diagnostic'
  >('cooling-load');

  return (
    <div className="space-y-6">
      {/* Segmented Controls for Calculators */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        <button
          onClick={() => setActiveTool('cooling-load')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeTool === 'cooling-load'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          ETTV & Cooling Load
        </button>
        <button
          onClick={() => setActiveTool('chiller-audit')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeTool === 'chiller-audit'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Practical 1: Chiller & Pump Audit
        </button>
        <button
          onClick={() => setActiveTool('psychrometrics')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeTool === 'psychrometrics'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Psychrometric Air & Coil Tool
        </button>
        <button
          onClick={() => setActiveTool('plant-sim')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeTool === 'plant-sim'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Chilled Water Plant Simulator
        </button>
        <button
          onClick={() => setActiveTool('diagnostic')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeTool === 'diagnostic'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Diagnostic Lab
        </button>
      </div>

      {activeTool === 'cooling-load' && <EttvCoolingLoadCalculator />}
      {activeTool === 'chiller-audit' && <ChillerAuditTool onOpenPdf={onOpenPdf} />}
      {activeTool === 'psychrometrics' && <PsychrometricTool />}
      {activeTool === 'plant-sim' && <ChilledWaterPlantSim />}
      {activeTool === 'diagnostic' && <DiagnosticLab />}
    </div>
  );
};
