import React, { useState, useMemo } from 'react';
import { Wind, AlertCircle, CheckCircle, Sliders } from 'lucide-react';

export const DuctCalculator: React.FC = () => {
  // Input states
  const [airflowM3s, setAirflowM3s] = useState<number>(1.5); // m³/s (3,180 CFM)
  const [frictionRatePaM, setFrictionRatePaM] = useState<number>(0.90); // Pa/m (standard equal friction)
  const [ductShape, setDuctShape] = useState<'rectangular' | 'circular'>('rectangular');
  const [rectHeightMm, setRectHeightMm] = useState<number>(350); // mm (ceiling void limit)
  const [applicationType, setApplicationType] = useState<'main-trunk' | 'branch' | 'diffuser-neck'>('main-trunk');
  const [ductLengthMeters, setDuctLengthMeters] = useState<number>(35); // m

  // Conversions
  const airflowCfm = airflowM3s * 2118.88;
  const airflowLps = airflowM3s * 1000;

  // Circular duct diameter calculation based on Colebrook / standard HVAC duct formula:
  // Friction Pa/m ≈ 0.0242 * (V^1.82) / (D^1.22) * (air_density)
  // Or practical approximation for galvanized sheet metal duct:
  // D (m) ≈ 0.44 * (Q^0.38) / (Friction^0.21)
  const circularDiameterMm = useMemo(() => {
    const dMeters = 0.44 * (Math.pow(airflowM3s, 0.38) / Math.pow(frictionRatePaM, 0.21));
    return Math.round(dMeters * 1000);
  }, [airflowM3s, frictionRatePaM]);

  // Round up to nearest standard sheet metal spiral duct diameter (mm)
  const standardRoundMm = useMemo(() => {
    const standards = [100, 125, 150, 160, 200, 250, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000, 1120, 1250];
    return standards.find((s) => s >= circularDiameterMm) || circularDiameterMm;
  }, [circularDiameterMm]);

  // Rectangular width calculation using Huebscher equation:
  // De = 1.30 * (a * b)^0.625 / (a + b)^0.25
  // We iterate to find dimension b (width) such that De ≈ circularDiameterMm
  const rectWidthMm = useMemo(() => {
    const deTarget = circularDiameterMm;
    const a = rectHeightMm;
    let bestWidth = 200;
    let minDiff = 99999;

    for (let b = 150; b <= 2500; b += 25) {
      const de = 1.30 * (Math.pow(a * b, 0.625) / Math.pow(a + b, 0.25));
      const diff = Math.abs(de - deTarget);
      if (diff < minDiff) {
        minDiff = diff;
        bestWidth = b;
      }
    }
    return bestWidth;
  }, [circularDiameterMm, rectHeightMm]);

  // Area & Velocity Calculations
  const ductAreaM2 = useMemo(() => {
    if (ductShape === 'circular') {
      const rM = standardRoundMm / 2000;
      return Math.PI * rM * rM;
    }
    return (rectWidthMm / 1000) * (rectHeightMm / 1000);
  }, [ductShape, standardRoundMm, rectWidthMm, rectHeightMm]);

  const airVelocityMs = airflowM3s / ductAreaM2;
  const airVelocityFpm = airVelocityMs * 196.85;

  // Aspect ratio check for rectangular
  const aspectRatio = rectWidthMm / rectHeightMm;

  // Velocity criteria based on application type
  const velocityLimits = {
    'main-trunk': { max: 7.5, maxFpm: 1500, nc: 'NC 35', label: 'Main Supply Trunk' },
    branch: { max: 5.0, maxFpm: 1000, nc: 'NC 30', label: 'Branch Run' },
    'diffuser-neck': { max: 3.0, maxFpm: 600, nc: 'NC 25', label: 'Terminal / Diffuser Runout' },
  };

  const currentLimit = velocityLimits[applicationType];
  const isVelocityAcceptable = airVelocityMs <= currentLimit.max;

  // Total static pressure loss estimation (Pa)
  const totalFrictionLossPa = ductLengthMeters * frictionRatePaM;

  return (
    <div className="space-y-6">
      {/* Configuration & Inputs */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Equal Friction Duct Sizing & Velocity Analysis
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Size commercial supply and return ducts according to SMACNA and Singapore SS 553 low-noise criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {/* Airflow Setting */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Airflow Rate</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                {airflowM3s.toFixed(2)} m³/s ({airflowCfm.toFixed(0)} CFM)
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="8.0"
              step="0.1"
              value={airflowM3s}
              onChange={(e) => setAirflowM3s(Number(e.target.value))}
              className="w-full accent-sky-600 dark:accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0.2 m³/s (420 CFM)</span>
              <span>4.0 m³/s</span>
              <span>8.0 m³/s (17,000 CFM)</span>
            </div>
          </div>

          {/* Friction Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Design Friction Rate</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                {frictionRatePaM.toFixed(2)} Pa/m ({(frictionRatePaM * 0.12).toFixed(3)} in.wg/100ft)
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.5"
              step="0.05"
              value={frictionRatePaM}
              onChange={(e) => setFrictionRatePaM(Number(e.target.value))}
              className="w-full accent-sky-600 dark:accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0.6 Pa/m (Quiet/Hospital)</span>
              <span>0.8 - 1.0 (Standard)</span>
              <span>1.5 Pa/m (High)</span>
            </div>
          </div>

          {/* Duct Geometry Selection */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">Duct Cross-Section</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDuctShape('rectangular')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                  ductShape === 'rectangular'
                    ? 'bg-sky-50 border-sky-600 text-sky-700 dark:bg-sky-950/40 dark:border-sky-500 dark:text-sky-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Rectangular Duct
              </button>
              <button
                onClick={() => setDuctShape('circular')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                  ductShape === 'circular'
                    ? 'bg-sky-50 border-sky-600 text-sky-700 dark:bg-sky-950/40 dark:border-sky-500 dark:text-sky-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Spiral Circular Duct
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Parameters: Ceiling Height & Application */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          {ductShape === 'rectangular' ? (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">Ceiling Void Limit (Height H)</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                  {rectHeightMm} mm
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="800"
                step="25"
                value={rectHeightMm}
                onChange={(e) => setRectHeightMm(Number(e.target.value))}
                className="w-full accent-sky-600 dark:accent-sky-500 cursor-pointer"
              />
            </div>
          ) : (
            <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-col justify-center">
              <span>Standard Round Spiral Duct</span>
              <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white mt-1">
                Ø {standardRoundMm} mm ({circularDiameterMm} mm theoretical)
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">Duct Network Zone</span>
            <select
              value={applicationType}
              onChange={(e) => setApplicationType(e.target.value as any)}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="main-trunk">Main Supply Trunk (Max 7.5 m/s · NC 35)</option>
              <option value="branch">Branch Duct (Max 5.0 m/s · NC 30)</option>
              <option value="diffuser-neck">Terminal Diffuser Runout (Max 3.0 m/s · NC 25)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Equivalent Duct Run</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                {ductLengthMeters} meters
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={ductLengthMeters}
              onChange={(e) => setDuctLengthMeters(Number(e.target.value))}
              className="w-full accent-sky-600 dark:accent-sky-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Sizing Results Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recommended Size */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Calculated Sizing Result
          </div>
          <div className="mt-2">
            {ductShape === 'rectangular' ? (
              <div>
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
                  {rectWidthMm} × {rectHeightMm}
                </span>
                <span className="text-xs text-slate-500 ml-1.5">mm (W × H)</span>
              </div>
            ) : (
              <div>
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
                  Ø {standardRoundMm}
                </span>
                <span className="text-xs text-slate-500 ml-1.5">mm dia</span>
              </div>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>Equivalent Diameter:</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">
              De = {circularDiameterMm} mm
            </span>
          </div>
        </div>

        {/* Air Velocity */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Airflow Velocity</span>
            <span className="font-mono">m/s · FPM</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold tracking-tight font-mono tabular-nums ${
                isVelocityAcceptable ? 'text-slate-900 dark:text-white' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {airVelocityMs.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-500">m/s</span>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              ({airVelocityFpm.toFixed(0)} FPM)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Acoustic Check:</span>
            <span
              className={`font-semibold flex items-center gap-1 ${
                isVelocityAcceptable ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {isVelocityAcceptable ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {isVelocityAcceptable ? `Pass (${currentLimit.nc})` : `Excess Velocity!`}
            </span>
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Aspect Ratio (W / H)</span>
            <span className="font-mono">Ratio</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {ductShape === 'rectangular' ? aspectRatio.toFixed(2) : '1.00'}
            </span>
            <span className="text-xs font-semibold text-slate-500">: 1</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {ductShape === 'circular' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Optimal (Zero distortion)</span>
            ) : aspectRatio <= 3.0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Compliant (SMACNA ≤ 3:1)</span>
            ) : aspectRatio <= 4.0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">Borderline (Requires stiffeners)</span>
            ) : (
              <span className="text-red-600 dark:text-red-400 font-medium">Exceeds 4:1 (Increase height H)</span>
            )}
          </div>
        </div>

        {/* Static Pressure Loss */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Estimated Static Loss</span>
            <span className="font-mono">Pa · in.wg</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {totalFrictionLossPa.toFixed(0)}
            </span>
            <span className="text-xs font-semibold text-slate-500">Pa</span>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              ({(totalFrictionLossPa * 0.004015).toFixed(2)} in.wg)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Across {ductLengthMeters}m straight ductwork.
          </div>
        </div>
      </div>
    </div>
  );
};
