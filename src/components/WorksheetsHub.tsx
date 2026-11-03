import React, { useState } from 'react';
import { DuctSizingWorksheet } from './DuctSizingWorksheet';
import { PipeSizingWorksheet } from './PipeSizingWorksheet';

interface WorksheetsHubProps {
  onOpenPdf: (pdfPath: string) => void;
}

export const WorksheetsHub: React.FC<WorksheetsHubProps> = ({ onOpenPdf }) => {
  const [activeWorksheet, setActiveWorksheet] = useState<'duct' | 'pipe'>('duct');

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        <button
          onClick={() => setActiveWorksheet('duct')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeWorksheet === 'duct'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Duct Sizing Table (Equal Friction)
        </button>
        <button
          onClick={() => setActiveWorksheet('pipe')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeWorksheet === 'pipe'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Pipe Sizing Table (Equivalent Length Le/D)
        </button>
      </div>

      {activeWorksheet === 'duct' ? (
        <DuctSizingWorksheet onOpenPdf={onOpenPdf} />
      ) : (
        <PipeSizingWorksheet onOpenPdf={onOpenPdf} />
      )}
    </div>
  );
};
