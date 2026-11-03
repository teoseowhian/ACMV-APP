import React, { useState, useMemo } from 'react';
import { Plus, Trash2, FileText, CheckCircle2 } from 'lucide-react';
import { PIPE_FITTINGS_LE_D, STANDARD_PIPE_SIZES_MM } from '../data/courseData';

export interface PipeTableRow {
  id: string;
  section: string;
  flowRateLps: number;
  pipeDiaMm: number;
  waterVelocityMs: number;
  pipeLengthM: number;
  fittingsList: {
    name: string;
    count: number;
    leD: number;
  }[];
  pressureLossPaM: number;
  equipmentLossPa: number; // e.g. AHU coil or chiller drop
}

const PRESET_CHILLED_WATER: PipeTableRow[] = [
  {
    id: 'chw-sec-1',
    section: '1 (Pump Discharge Header)',
    flowRateLps: 10,
    pipeDiaMm: 100,
    waterVelocityMs: 1.3,
    pipeLengthM: 20.0,
    fittingsList: [
      { name: '90° Welded Elbow, sharp bend', count: 4, leD: 55 },
      { name: 'Gate valve, full open', count: 1, leD: 7.5 },
      { name: 'Globe valve, full open', count: 1, leD: 320 },
      { name: 'Welded Tee, straight thru', count: 1, leD: 23 },
    ],
    pressureLossPaM: 150,
    equipmentLossPa: 0,
  },
  {
    id: 'chw-sec-2-4',
    section: '2, 4 (Branch to AHU 2)',
    flowRateLps: 6,
    pipeDiaMm: 80,
    waterVelocityMs: 1.4,
    pipeLengthM: 20.0, // 10 + 10
    fittingsList: [
      { name: '90° Welded Elbow, sharp bend', count: 7, leD: 55 },
      { name: 'Gate valve, full open', count: 2, leD: 7.5 },
      { name: 'Globe valve, full open', count: 1, leD: 320 },
      { name: '2-way modulating valve', count: 1, leD: 320 },
      { name: 'Reducer (Do/Di = 0.8)', count: 1, leD: 8 },
      { name: 'Enlarger (Do/Di = 1.25)', count: 1, leD: 8.5 },
    ],
    pressureLossPaM: 230,
    equipmentLossPa: 25000, // AHU 2 cooling coil
  },
  {
    id: 'chw-sec-6-8-10-11',
    section: '6, 8, 10, 11 (Return Header to Chiller)',
    flowRateLps: 10,
    pipeDiaMm: 100,
    waterVelocityMs: 1.3,
    pipeLengthM: 35.0, // 15 + 5 + 5 + 10
    fittingsList: [
      { name: '90° Welded Elbow, sharp bend', count: 11, leD: 55 },
      { name: 'Gate valve, full open', count: 3, leD: 7.5 },
      { name: 'Globe valve, full open', count: 1, leD: 320 },
      { name: 'Y-strainer, clean', count: 1, leD: 250 },
      { name: 'Swing check valve', count: 1, leD: 95 },
      { name: 'Welded Tee, straight thru', count: 1, leD: 23 },
    ],
    pressureLossPaM: 150,
    equipmentLossPa: 50000, // Chiller evaporator
  },
];

const PRESET_CONDENSER_WATER: PipeTableRow[] = [
  {
    id: 'cw-sec-1',
    section: '1 (Tower Return Line)',
    flowRateLps: 10,
    pipeDiaMm: 100,
    waterVelocityMs: 1.3,
    pipeLengthM: 8.0,
    fittingsList: [
      { name: '45° Welded Elbow, r/d=1', count: 3, leD: 14 },
      { name: 'Gate valve, full open', count: 1, leD: 7.5 },
      { name: 'Globe valve, full open', count: 1, leD: 320 },
    ],
    pressureLossPaM: 150,
    equipmentLossPa: 0,
  },
  {
    id: 'cw-sec-3',
    section: '3 (Combined Header)',
    flowRateLps: 20,
    pipeDiaMm: 125,
    waterVelocityMs: 1.55,
    pipeLengthM: 4.0,
    fittingsList: [
      { name: '45° Welded Elbow, r/d=1', count: 1, leD: 14 },
      { name: 'Welded Tee, straight thru', count: 2, leD: 23 },
    ],
    pressureLossPaM: 180,
    equipmentLossPa: 0,
  },
  {
    id: 'cw-sec-4-7',
    section: '4, 7 (CWP Pump Loop)',
    flowRateLps: 10,
    pipeDiaMm: 100,
    waterVelocityMs: 1.3,
    pipeLengthM: 10.0,
    fittingsList: [
      { name: '45° Welded Elbow, r/d=1', count: 5, leD: 14 },
      { name: 'Gate valve, full open', count: 2, leD: 7.5 },
      { name: 'Y-strainer, clean', count: 1, leD: 250 },
      { name: 'Globe valve, full open', count: 1, leD: 320 },
      { name: 'Wafer disk check valve', count: 1, leD: 420 },
    ],
    pressureLossPaM: 150,
    equipmentLossPa: 0,
  },
  {
    id: 'cw-sec-8',
    section: '8 (Pump Discharge Header to Towers)',
    flowRateLps: 20,
    pipeDiaMm: 125,
    waterVelocityMs: 1.55,
    pipeLengthM: 30.0,
    fittingsList: [
      { name: '45° Welded Elbow, r/d=1', count: 4, leD: 14 },
      { name: 'Welded Tee, straight thru', count: 2, leD: 23 },
    ],
    pressureLossPaM: 180,
    equipmentLossPa: 0,
  },
  {
    id: 'cw-sec-10-11',
    section: '10, 11 (Branch to Cooling Tower 1)',
    flowRateLps: 10,
    pipeDiaMm: 100,
    waterVelocityMs: 1.3,
    pipeLengthM: 13.0,
    fittingsList: [
      { name: '45° Welded Elbow, r/d=1', count: 3, leD: 14 },
      { name: 'Gate valve, full open', count: 1, leD: 7.5 },
      { name: 'Globe valve, full open', count: 1, leD: 320 },
      { name: 'Y-strainer, clean', count: 1, leD: 250 },
    ],
    pressureLossPaM: 150,
    equipmentLossPa: 0,
  },
  {
    id: 'cw-sec-13',
    section: '13 (Return Riser to Chiller)',
    flowRateLps: 20,
    pipeDiaMm: 125,
    waterVelocityMs: 1.55,
    pipeLengthM: 30.0,
    fittingsList: [
      { name: '45° Welded Elbow, r/d=1', count: 3, leD: 14 },
      { name: 'Welded Tee, straight thru', count: 2, leD: 23 },
    ],
    pressureLossPaM: 180,
    equipmentLossPa: 0,
  },
  {
    id: 'cw-sec-15',
    section: '15 (Inlet into Chiller Condenser)',
    flowRateLps: 10,
    pipeDiaMm: 100,
    waterVelocityMs: 1.3,
    pipeLengthM: 9.0,
    fittingsList: [
      { name: '45° Welded Elbow, r/d=1', count: 3, leD: 14 },
      { name: 'Gate valve, full open', count: 1, leD: 7.5 },
    ],
    pressureLossPaM: 150,
    equipmentLossPa: 30000, // Chiller condenser drop
  },
];

interface PipeSizingWorksheetProps {
  onOpenPdf: (pdfPath: string) => void;
}

export const PipeSizingWorksheet: React.FC<PipeSizingWorksheetProps> = ({ onOpenPdf }) => {
  const [circuitType, setCircuitType] = useState<'chilled' | 'condenser'>('chilled');
  const [rows, setRows] = useState<PipeTableRow[]>(PRESET_CHILLED_WATER);
  const [safetyFactorPercent, setSafetyFactorPercent] = useState<number>(10); // 10% standard in Tutorial 4
  const [staticHeadMeters, setStaticHeadMeters] = useState<number>(0); // 0m for closed, 2m for cooling tower

  // Row metrics calculator
  const calculateRowMetrics = (row: PipeTableRow) => {
    // Equivalent length of all fittings = Sum( count * (Le/D) * (D / 1000) )
    const dMeters = row.pipeDiaMm / 1000;
    const fittingLeMeters = row.fittingsList.reduce((acc, f) => {
      return acc + f.count * f.leD * dMeters;
    }, 0);

    const totalLeMeters = row.pipeLengthM + fittingLeMeters;
    const pipeFrictionLossPa = totalLeMeters * row.pressureLossPaM;
    const sectionTotalLossPa = pipeFrictionLossPa + row.equipmentLossPa;

    return {
      fittingLeMeters,
      totalLeMeters,
      pipeFrictionLossPa,
      sectionTotalLossPa,
    };
  };

  // Grand totals
  const totalFrictionalLossPa = useMemo(() => {
    return rows.reduce((sum, r) => sum + calculateRowMetrics(r).pipeFrictionLossPa, 0);
  }, [rows]);

  const totalEquipmentLossPa = useMemo(() => {
    return rows.reduce((sum, r) => sum + r.equipmentLossPa, 0);
  }, [rows]);

  const totalSubtotalLossPa = totalFrictionalLossPa + totalEquipmentLossPa;
  const safetyFactorPa = totalSubtotalLossPa * (safetyFactorPercent / 100);
  const grandTotalPressureLossPa = totalSubtotalLossPa + safetyFactorPa;

  // Pump Head hf = P / (rho * g) where rho = 1000 kg/m³, g = 9.81 m/s²
  const frictionalHeadM = grandTotalPressureLossPa / (1000 * 9.81);
  const totalPumpHeadM = frictionalHeadM + staticHeadMeters;

  const handleSwitchCircuit = (type: 'chilled' | 'condenser') => {
    setCircuitType(type);
    if (type === 'chilled') {
      setRows(PRESET_CHILLED_WATER);
      setStaticHeadMeters(0);
    } else {
      setRows(PRESET_CONDENSER_WATER);
      setStaticHeadMeters(2.0);
    }
  };

  const handleUpdateRowField = (id: string, field: keyof PipeTableRow, val: any) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleAddFitting = (rowId: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        return {
          ...r,
          fittingsList: [
            ...r.fittingsList,
            { name: '90° Welded Elbow, sharp bend', count: 1, leD: 55 },
          ],
        };
      })
    );
  };

  const handleRemoveFitting = (rowId: string, idx: number) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const updated = [...r.fittingsList];
        updated.splice(idx, 1);
        return { ...r, fittingsList: updated };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              Official Equivalent Length Method (Tutorial 4 & Practical 1)
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              Interactive Pipe Sizing & Pump Head Table
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Computes fitting equivalent lengths ($L_e/D$), pipe friction loss from Schedule 40 chart, equipment pressure drops, and total pump head.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                onOpenPdf(
                  `${import.meta.env.BASE_URL}assets/aistudio/Friction_Loss_for_Water_in_Commercial_Steel_Pipe_Schedule_40_4e619142.pdf`
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              Schedule 40 Friction Chart PDF
            </button>
            <button
              onClick={() => handleSwitchCircuit('chilled')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                circuitType === 'chilled'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Tutorial 4 Fig 3 (Chilled Water Loop)
            </button>
            <button
              onClick={() => handleSwitchCircuit('condenser')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                circuitType === 'condenser'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Tutorial 4 Fig 4 (Condenser Water Loop)
            </button>
          </div>
        </div>

        {/* Digital Table */}
        <div className="mt-5 space-y-4">
          {rows.map((row) => {
            const metrics = calculateRowMetrics(row);

            return (
              <div
                key={row.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      Section {row.section}
                    </span>
                    <span className="text-xs text-slate-500 font-sans">
                      Pipe Length: <strong>{row.pipeLengthM} m</strong>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                    <span>
                      Flow: <strong>{row.flowRateLps} L/s</strong>
                    </span>
                    <span>
                      Dia: <strong>Ø {row.pipeDiaMm} mm</strong>
                    </span>
                    <span>
                      Velocity: <strong>{row.waterVelocityMs} m/s</strong>
                    </span>
                    <span className="text-sky-600 dark:text-sky-400 font-bold">
                      Loss: {row.pressureLossPaM} Pa/m
                    </span>
                  </div>
                </div>

                {/* Fittings List inside Section */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Valves & Pipe Fittings (Le/D Method):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {row.fittingsList.map((fit, idx) => {
                      const fitLe = fit.count * fit.leD * (row.pipeDiaMm / 1000);

                      return (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                              {fit.name}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400">
                              {fit.count} × {fit.leD} × {(row.pipeDiaMm / 1000).toFixed(2)}m = {fitLe.toFixed(2)}m
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFitting(row.id, idx)}
                            className="text-slate-300 hover:text-red-500 transition-colors ml-2"
                            title="Remove fitting"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section Summary Row */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-baseline justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAddFitting(row.id)}
                      className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Valve/Fitting
                    </button>
                    <span className="text-slate-400">
                      Fitting Le = {metrics.fittingLeMeters.toFixed(2)} m · Total Le = {metrics.totalLeMeters.toFixed(2)} m
                    </span>
                  </div>

                  <div className="flex items-baseline gap-4">
                    {row.equipmentLossPa > 0 && (
                      <span className="text-amber-600 dark:text-amber-400">
                        Equipment Drop: {row.equipmentLossPa} Pa
                      </span>
                    )}
                    <span className="font-bold text-slate-900 dark:text-white">
                      Section Loss: {metrics.sectionTotalLossPa.toFixed(1)} Pa
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Controls & Safety Factor */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Safety Factor:</span>
              <input
                type="number"
                min="0"
                max="30"
                value={safetyFactorPercent}
                onChange={(e) => setSafetyFactorPercent(Number(e.target.value))}
                className="w-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-xs text-right font-mono"
              />
              <span className="text-slate-400">%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Static Head Lift:</span>
              <input
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={staticHeadMeters}
                onChange={(e) => setStaticHeadMeters(Number(e.target.value))}
                className="w-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-xs text-right font-mono"
              />
              <span className="text-slate-400">m (0 for closed, 2–3m for cooling tower)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hydraulic Calculation Result Deck */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Total Pipe Friction Loss
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {totalFrictionalLossPa.toFixed(0)} Pa
          </div>
          <div className="text-[11px] text-slate-400">
            Across {rows.length} indexed pipe sections
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Equipment Pressure Drops
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {totalEquipmentLossPa.toFixed(0)} Pa
          </div>
          <div className="text-[11px] text-slate-400">
            Chillers, AHU Coils & Towers
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Frictional Head (hf = P/ρg)
          </span>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400 font-mono tabular-nums">
            {frictionalHeadM.toFixed(2)} m
          </div>
          <div className="text-[11px] text-slate-400">
            Grand Total = {(grandTotalPressureLossPa / 1000).toFixed(1)} kPa (with {safetyFactorPercent}% SF)
          </div>
        </div>

        <div className="bg-sky-600 dark:bg-sky-950/60 text-white rounded-xl p-5 border border-sky-500/50 shadow-xs space-y-1">
          <span className="text-xs text-sky-100">
            Required Pump Head (Hp = hf + hs)
          </span>
          <div className="text-3xl font-extrabold font-mono tabular-nums">
            {totalPumpHeadM.toFixed(2)} m
          </div>
          <div className="text-[11px] text-sky-200">
            Friction: {frictionalHeadM.toFixed(1)}m + Static: {staticHeadMeters.toFixed(1)}m
          </div>
        </div>
      </div>
    </div>
  );
};
