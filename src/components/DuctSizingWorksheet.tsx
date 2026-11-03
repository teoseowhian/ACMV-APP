import React, { useState, useMemo } from 'react';
import { Plus, Trash2, RotateCcw, Download, FileText, CheckCircle2 } from 'lucide-react';

export interface DuctTableRow {
  id: string;
  section: string;
  description: string;
  airQtyLps: number;
  ductDiaMm: number;
  rectWidthMm: number;
  rectHeightMm: number;
  ductLengthM: number;
  fittingLossCoeff: number; // Sum of C
  frictionLossPerM: number; // Pa/m (default 1.0 or 0.8)
  additionalLossPa: number; // e.g. diffuser or grille 20 Pa
}

const PRESET_TUTORIAL3_FIG4: DuctTableRow[] = [
  {
    id: 'fcu-1',
    section: '10 (Return Grille & Branch)',
    description: 'Return Air Grille & Duct to Header',
    airQtyLps: 800,
    ductDiaMm: 400,
    rectWidthMm: 450,
    rectHeightMm: 300,
    ductLengthM: 4.0,
    fittingLossCoeff: 1.6, // Grille C=1.0 + Elbow C=0.6
    frictionLossPerM: 1.0,
    additionalLossPa: 20.0, // Return air grille loss
  },
  {
    id: 'fcu-2',
    section: '9 (Return Main Header)',
    description: 'Return Main to FCU Intake',
    airQtyLps: 1600,
    ductDiaMm: 530,
    rectWidthMm: 750,
    rectHeightMm: 300,
    ductLengthM: 3.0,
    fittingLossCoeff: 1.0, // Tee branch Cb=0.6 + entry Co=0.4
    frictionLossPerM: 1.0,
    additionalLossPa: 0.0,
  },
  {
    id: 'fcu-3',
    section: '1 (Supply Main Trunk)',
    description: 'FCU Discharge to Branch Takeoff',
    airQtyLps: 2000,
    ductDiaMm: 560,
    rectWidthMm: 850,
    rectHeightMm: 300,
    ductLengthM: 7.0,
    fittingLossCoeff: 1.1, // Fan discharge Co=0.7 + elbow Co=0.4
    frictionLossPerM: 1.0,
    additionalLossPa: 0.0,
  },
  {
    id: 'fcu-4',
    section: '2 (Intermediate Supply)',
    description: 'Main Supply Trunk after first takeoff',
    airQtyLps: 1500,
    ductDiaMm: 500,
    rectWidthMm: 700,
    rectHeightMm: 300,
    ductLengthM: 3.0,
    fittingLossCoeff: 0.2, // Tee straight Cs=0.2
    frictionLossPerM: 1.0,
    additionalLossPa: 0.0,
  },
  {
    id: 'fcu-5',
    section: '3 (Intermediate Supply)',
    description: 'Supply Trunk after second takeoff',
    airQtyLps: 1000,
    ductDiaMm: 450,
    rectWidthMm: 500,
    rectHeightMm: 300,
    ductLengthM: 3.0,
    fittingLossCoeff: 0.15, // Tee straight Cs=0.15
    frictionLossPerM: 1.0,
    additionalLossPa: 0.0,
  },
  {
    id: 'fcu-6',
    section: '4 (Terminal Diffuser Runout)',
    description: 'Final Branch to Diffuser 4',
    airQtyLps: 500,
    ductDiaMm: 355,
    rectWidthMm: 350,
    rectHeightMm: 300,
    ductLengthM: 6.0,
    fittingLossCoeff: 1.7, // Elbow Co=1.2 + Tee branch Cb=0.5
    frictionLossPerM: 1.0,
    additionalLossPa: 20.0, // Supply diffuser loss
  },
];

const PRESET_TUTORIAL3_FIG5: DuctTableRow[] = [
  {
    id: 'ahu-1',
    section: '1 (AHU Discharge Trunk)',
    description: 'Main Riser from AHU',
    airQtyLps: 4000,
    ductDiaMm: 710,
    rectWidthMm: 1250,
    rectHeightMm: 300,
    ductLengthM: 10.0,
    fittingLossCoeff: 1.03, // Fan loss Co=0.63 + elbow Co=0.4
    frictionLossPerM: 0.8,
    additionalLossPa: 0.0,
  },
  {
    id: 'ahu-2',
    section: '2 (Floor Distribution Main)',
    description: 'Horizontal Header along corridor',
    airQtyLps: 3000,
    ductDiaMm: 630,
    rectWidthMm: 1000,
    rectHeightMm: 300,
    ductLengthM: 10.0,
    fittingLossCoeff: 0.88, // Elbow Co=0.38 + Tee Cb=0.5
    frictionLossPerM: 0.8,
    additionalLossPa: 0.0,
  },
  {
    id: 'ahu-3',
    section: '9 (Secondary Distribution)',
    description: 'Trunk to North Offices',
    airQtyLps: 1500,
    ductDiaMm: 500,
    rectWidthMm: 650,
    rectHeightMm: 300,
    ductLengthM: 12.0,
    fittingLossCoeff: 0.55, // Tee straight Cs=0.05 + Cb=0.5
    frictionLossPerM: 0.8,
    additionalLossPa: 0.0,
  },
  {
    id: 'ahu-4',
    section: '10 (Terminal Branch to Diffuser)',
    description: 'Diffuser Runout Section 10',
    airQtyLps: 500,
    ductDiaMm: 355,
    rectWidthMm: 350,
    rectHeightMm: 300,
    ductLengthM: 6.0,
    fittingLossCoeff: 1.3, // Elbow Co=0.8 + branch Cb=0.5
    frictionLossPerM: 0.8,
    additionalLossPa: 20.0, // Diffuser loss
  },
];

interface DuctSizingWorksheetProps {
  onOpenPdf: (pdfPath: string) => void;
}

export const DuctSizingWorksheet: React.FC<DuctSizingWorksheetProps> = ({ onOpenPdf }) => {
  const [rows, setRows] = useState<DuctTableRow[]>(PRESET_TUTORIAL3_FIG4);
  const [safetyFactorPercent, setSafetyFactorPercent] = useState<number>(20); // 20% standard in Tutorial 3

  // Row calculation helper
  const calculateRowMetrics = (row: DuctTableRow) => {
    const areaM2 = (row.rectWidthMm / 1000) * (row.rectHeightMm / 1000);
    const airQtyM3s = row.airQtyLps / 1000;
    const velocityMs = areaM2 > 0 ? airQtyM3s / areaM2 : 0;
    // Velocity pressure Pv = 0.5 * rho * V^2 ≈ 0.60 * V^2 (rho = 1.20 kg/m³)
    const velocityPressurePa = 0.60 * Math.pow(velocityMs, 2);
    // Straight duct pressure loss = Length * (Pa/m)
    const straightDuctLossPa = row.ductLengthM * row.frictionLossPerM;
    // Fitting dynamic loss = Sum(C) * Pv
    const fittingLossPa = row.fittingLossCoeff * velocityPressurePa;
    // Section total
    const sectionTotalLossPa = straightDuctLossPa + fittingLossPa + row.additionalLossPa;

    return {
      areaM2,
      velocityMs,
      velocityPressurePa,
      straightDuctLossPa,
      fittingLossPa,
      sectionTotalLossPa,
    };
  };

  // Grand totals
  const totalStraightLossPa = useMemo(() => {
    return rows.reduce((sum, r) => sum + calculateRowMetrics(r).straightDuctLossPa, 0);
  }, [rows]);

  const totalFittingLossPa = useMemo(() => {
    return rows.reduce((sum, r) => sum + calculateRowMetrics(r).fittingLossPa, 0);
  }, [rows]);

  const totalTerminalLossPa = useMemo(() => {
    return rows.reduce((sum, r) => sum + r.additionalLossPa, 0);
  }, [rows]);

  const grandTotalPressureLossPa = totalStraightLossPa + totalFittingLossPa + totalTerminalLossPa;
  const safetyFactorPa = grandTotalPressureLossPa * (safetyFactorPercent / 100);
  const externalFanStaticPressurePa = grandTotalPressureLossPa + safetyFactorPa;

  const handleUpdateField = (id: string, field: keyof DuctTableRow, value: any) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleAddRow = () => {
    const newId = `row-${Date.now()}`;
    setRows((prev) => [
      ...prev,
      {
        id: newId,
        section: `Sec ${prev.length + 1}`,
        description: 'New Duct Branch',
        airQtyLps: 500,
        ductDiaMm: 355,
        rectWidthMm: 350,
        rectHeightMm: 300,
        ductLengthM: 5.0,
        fittingLossCoeff: 0.5,
        frictionLossPerM: 1.0,
        additionalLossPa: 0,
      },
    ]);
  };

  const handleDeleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Worksheet Header & Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              Official Examination & Tutorial Calculation Template
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              Interactive Duct Sizing Table (Equal Friction Method)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Computes air velocity, velocity pressure, straight duct friction, dynamic fitting losses, and total external fan static pressure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                onOpenPdf(
                  '/assets/aistudio/Duct_Sizing_Chart__Conversion_Table_and_Duct_SizingTable_892b885e.pdf'
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              View Official Chart & Tables PDF
            </button>
            <button
              onClick={() => setRows(PRESET_TUTORIAL3_FIG4)}
              className="px-3 py-1.5 text-xs font-medium bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors whitespace-nowrap"
            >
              Preset: Tutorial 3 (Fig 4 FCU)
            </button>
            <button
              onClick={() => setRows(PRESET_TUTORIAL3_FIG5)}
              className="px-3 py-1.5 text-xs font-medium bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors whitespace-nowrap"
            >
              Preset: Tutorial 3 (Fig 5 AHU)
            </button>
          </div>
        </div>

        {/* Digital Worksheet Spreadsheet */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-2.5 px-2 w-28">Section</th>
                <th className="py-2.5 px-2 w-36">Description</th>
                <th className="py-2.5 px-2 w-20">Air Qty (L/s)</th>
                <th className="py-2.5 px-2 w-20">Dia (mm)</th>
                <th className="py-2.5 px-2 w-28">Rect W × H (mm)</th>
                <th className="py-2.5 px-2 w-20">Vel (m/s)</th>
                <th className="py-2.5 px-2 w-20">Pv (Pa)</th>
                <th className="py-2.5 px-2 w-16">Len (m)</th>
                <th className="py-2.5 px-2 w-16">Σ C</th>
                <th className="py-2.5 px-2 w-20">Pa/m</th>
                <th className="py-2.5 px-2 w-24">Fitting/Duct Loss</th>
                <th className="py-2.5 px-2 w-20 text-right">Total (Pa)</th>
                <th className="py-2.5 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-mono">
              {rows.map((row) => {
                const metrics = calculateRowMetrics(row);

                return (
                  <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-2 font-sans font-medium">
                      <input
                        type="text"
                        value={row.section}
                        onChange={(e) => handleUpdateField(row.id, 'section', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2 px-2 font-sans text-slate-500 dark:text-slate-400 text-[11px]">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => handleUpdateField(row.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={row.airQtyLps}
                        onChange={(e) =>
                          handleUpdateField(row.id, 'airQtyLps', Number(e.target.value))
                        }
                        className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs text-right"
                      />
                    </td>
                    <td className="py-2 px-2 text-slate-500">{row.ductDiaMm}</td>
                    <td className="py-2 px-2 text-slate-900 dark:text-white font-semibold whitespace-nowrap">
                      {row.rectWidthMm} × {row.rectHeightMm}
                    </td>
                    <td className="py-2 px-2 text-sky-600 dark:text-sky-400 font-semibold">
                      {metrics.velocityMs.toFixed(1)}
                    </td>
                    <td className="py-2 px-2 text-slate-500">
                      {metrics.velocityPressurePa.toFixed(1)}
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={row.ductLengthM}
                        onChange={(e) =>
                          handleUpdateField(row.id, 'ductLengthM', Number(e.target.value))
                        }
                        className="w-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs text-right"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.05"
                        value={row.fittingLossCoeff}
                        onChange={(e) =>
                          handleUpdateField(row.id, 'fittingLossCoeff', Number(e.target.value))
                        }
                        className="w-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs text-right"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        value={row.frictionLossPerM}
                        onChange={(e) =>
                          handleUpdateField(row.id, 'frictionLossPerM', Number(e.target.value))
                        }
                        className="w-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs text-right"
                      />
                    </td>
                    <td className="py-2 px-2 text-[11px] text-slate-500">
                      {metrics.straightDuctLossPa.toFixed(1)} + {metrics.fittingLossPa.toFixed(1)}
                      {row.additionalLossPa > 0 && ` + ${row.additionalLossPa}`}
                    </td>
                    <td className="py-2 px-2 text-right font-bold text-slate-900 dark:text-white">
                      {metrics.sectionTotalLossPa.toFixed(1)}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action button to add row */}
        <div className="mt-4 flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Duct Section
          </button>

          <div className="flex items-center gap-2 text-xs font-sans text-slate-500">
            <span>Safety Factor:</span>
            <input
              type="number"
              min="0"
              max="50"
              value={safetyFactorPercent}
              onChange={(e) => setSafetyFactorPercent(Number(e.target.value))}
              className="w-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-xs text-right font-mono"
            />
            <span>%</span>
          </div>
        </div>
      </div>

      {/* Sizing Calculation Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Straight Duct Friction Loss (Σ L × Pa/m)
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {totalStraightLossPa.toFixed(1)} Pa
          </div>
          <div className="text-[11px] text-slate-400">
            Based on {rows.reduce((s, r) => s + r.ductLengthM, 0).toFixed(1)}m total duct run
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Dynamic Fitting & Terminal Losses
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {(totalFittingLossPa + totalTerminalLossPa).toFixed(1)} Pa
          </div>
          <div className="text-[11px] text-slate-400">
            Fittings: {totalFittingLossPa.toFixed(1)} Pa · Terminals: {totalTerminalLossPa.toFixed(1)} Pa
          </div>
        </div>

        <div className="bg-sky-600 dark:bg-sky-950/60 text-white rounded-xl p-5 border border-sky-500/50 shadow-xs space-y-1">
          <span className="text-xs text-sky-100">
            External Fan Static Pressure (with {safetyFactorPercent}% SF)
          </span>
          <div className="text-3xl font-extrabold font-mono tabular-nums">
            {externalFanStaticPressurePa.toFixed(1)} Pa
          </div>
          <div className="text-[11px] text-sky-200">
            Grand Total = {grandTotalPressureLossPa.toFixed(1)} Pa + {safetyFactorPa.toFixed(1)} Pa SF
          </div>
        </div>
      </div>
    </div>
  );
};
