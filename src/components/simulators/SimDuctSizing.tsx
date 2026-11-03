import React, { useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

export const SimDuctSizing: React.FC = () => {
  const [airflowLps, setAirflowLps] = useState<number>(1500); // L/s
  const [frictionRatePaM, setFrictionRatePaM] = useState<number>(1.0); // Pa/m (standard equal friction)
  const [rectHeightMm, setRectHeightMm] = useState<number>(300); // mm (Tutorial 3 max depth)

  const airflowM3s = airflowLps / 1000;
  const airflowCfm = airflowLps * 2.11888;

  // Theoretical circular diameter D (m) ≈ 0.44 * (Q^0.38) / (Friction^0.21)
  const circularDiameterMm = useMemo(() => {
    const dMeters = 0.44 * (Math.pow(airflowM3s, 0.38) / Math.pow(frictionRatePaM, 0.21));
    return Math.round(dMeters * 1000);
  }, [airflowM3s, frictionRatePaM]);

  // Nearest standard spiral duct diameter (mm)
  const standardRoundMm = useMemo(() => {
    const standards = [100, 125, 150, 160, 200, 250, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000];
    return standards.find((s) => s >= circularDiameterMm) || circularDiameterMm;
  }, [circularDiameterMm]);

  // Compute rectangular width b such that De ≈ circularDiameterMm (Huebscher equation)
  const rectWidthMm = useMemo(() => {
    const targetDe = circularDiameterMm;
    const a = rectHeightMm;
    let bestB = 300;
    let minDiff = 99999;

    for (let b = 150; b <= 2000; b += 25) {
      const de = 1.30 * (Math.pow(a * b, 0.625) / Math.pow(a + b, 0.25));
      const diff = Math.abs(de - targetDe);
      if (diff < minDiff) {
        minDiff = diff;
        bestB = b;
      }
    }
    return bestB;
  }, [circularDiameterMm, rectHeightMm]);

  // Velocity calculation: V = Q / Area
  const rectAreaM2 = (rectWidthMm / 1000) * (rectHeightMm / 1000);
  const velocityMs = rectAreaM2 > 0 ? airflowM3s / rectAreaM2 : 0;
  const velocityPressurePa = 0.60 * Math.pow(velocityMs, 2);

  // Noise Criteria assessment (SS 553 office criteria)
  const noiseAssessment = useMemo(() => {
    if (velocityMs <= 5.0) return { label: 'Quiet / Branch Duct (NC 30)', color: 'emerald' };
    if (velocityMs <= 7.5) return { label: 'Moderate / Main Trunk (NC 35)', color: 'sky' };
    if (velocityMs <= 9.0) return { label: 'Noisy / Plant Room Only (NC 45)', color: 'amber' };
    return { label: 'Excessive Noise / Redesign Needed', color: 'red' };
  }, [velocityMs]);

  // Challenge goal: Keep velocity <= 7.5 m/s when airflow is 1500 L/s at 1.0 Pa/m
  const isChallengeMet = airflowLps === 1500 && frictionRatePaM === 1.0 && velocityMs <= 7.5;

  const handleReset = () => {
    setAirflowLps(1500);
    setFrictionRatePaM(1.0);
    setRectHeightMm(300);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Controls & Challenge (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Duct Parameters
              </span>
              <button
                onClick={handleReset}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Slider 1: Airflow */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Volumetric Airflow (Q)</span>
                <span className="font-mono font-bold text-sky-400">
                  {airflowLps} L/s ({airflowCfm.toFixed(0)} CFM)
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="50"
                value={airflowLps}
                onChange={(e) => setAirflowLps(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>200 L/s (Branch)</span>
                <span>1,500 L/s</span>
                <span>3,000 L/s (Main)</span>
              </div>
            </div>

            {/* Slider 2: Friction Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Design Friction Rate</span>
                <span className="font-mono font-bold text-amber-400">{frictionRatePaM.toFixed(2)} Pa/m</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.05"
                value={frictionRatePaM}
                onChange={(e) => setFrictionRatePaM(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.6 Pa/m (Low noise)</span>
                <span>1.0 Pa/m (Standard)</span>
                <span>1.5 Pa/m</span>
              </div>
            </div>

            {/* Slider 3: Max Height (Ceiling Limit) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Max Duct Depth (H)</span>
                <span className="font-mono font-bold text-cyan-400">{rectHeightMm} mm</span>
              </div>
              <input
                type="range"
                min="200"
                max="500"
                step="25"
                value={rectHeightMm}
                onChange={(e) => setRectHeightMm(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>200 mm</span>
                <span>300 mm (Tutorial limit)</span>
                <span>500 mm</span>
              </div>
            </div>
          </div>

          {/* Try This Challenge */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              isChallengeMet
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
              {isChallengeMet ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span>Duct Sizing Challenge:</span>
            </div>
            <p className="text-xs leading-relaxed">
              For an airflow of <strong>1,500 L/s</strong> at <strong>1.0 Pa/m</strong>, find the rectangular duct size that maintains air velocity <strong>≤ 7.5 m/s</strong> (NC 35 office limit).
            </p>
            <div className="mt-2 text-[11px] font-mono">
              Status:{' '}
              {isChallengeMet ? (
                <strong className="text-emerald-400">
                  PASSED! {rectWidthMm} × {rectHeightMm} mm (Velocity: {velocityMs.toFixed(2)} m/s)
                </strong>
              ) : (
                <span className="text-amber-400">Set Q = 1,500 L/s and Friction = 1.0 Pa/m</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Big Results & Cross Section Diagram (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Rectangular Duct</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400 mt-1 tabular-nums">
                {rectWidthMm} × {rectHeightMm}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">W × H (mm)</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Air Velocity</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                {velocityMs.toFixed(1)} <span className="text-xs font-normal font-sans">m/s</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Pv = {velocityPressurePa.toFixed(1)} Pa</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Equivalent Circular</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                Ø {standardRoundMm}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">De = {circularDiameterMm} mm</span>
            </div>
          </div>

          {/* Visual Cross-Section & Noise Meter */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 uppercase font-bold tracking-wider">Acoustic Noise Indicator:</span>
              <span className="font-bold text-white">{noiseAssessment.label}</span>
            </div>

            {/* Noise Gauge Bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  velocityMs <= 5.0
                    ? 'bg-emerald-500'
                    : velocityMs <= 7.5
                    ? 'bg-sky-500'
                    : velocityMs <= 9.0
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, (velocityMs / 12) * 100)}%` }}
              ></div>
            </div>

            {/* Visual Duct Cutaway representation */}
            <div className="p-4 bg-slate-950 rounded-lg flex items-center justify-center">
              <div
                className="border-2 border-sky-400 bg-sky-950/40 flex items-center justify-center text-sky-200 text-xs font-mono font-bold transition-all"
                style={{
                  width: `${Math.min(260, Math.max(90, rectWidthMm / 4))}px`,
                  height: `${Math.min(130, Math.max(50, rectHeightMm / 4))}px`,
                }}
              >
                {rectWidthMm} × {rectHeightMm}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monospace Step-by-Step Working */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-sans">
          Step-by-Step Working (Tutorial AMVS 3 method):
        </span>
        <div className="p-4 bg-slate-950 rounded-lg font-mono text-xs text-slate-300 space-y-1.5 leading-relaxed overflow-x-auto">
          <div>1. Flow rate Q = {airflowLps} L/s = {airflowM3s.toFixed(3)} m³/s at design friction {frictionRatePaM.toFixed(2)} Pa/m.</div>
          <div>2. Theoretical equivalent diameter from friction chart: De ≈ {circularDiameterMm} mm (Round nominal: Ø {standardRoundMm} mm).</div>
          <div>3. Huebscher Conversion for max depth a = {rectHeightMm} mm:</div>
          <div className="text-slate-400 text-[11px]">   De = 1.30 × (a × b)^0.625 / (a + b)^0.25 → solving for b yields width b = {rectWidthMm} mm.</div>
          <div>4. Cross-sectional duct area: A = ({rectWidthMm}/1000) × ({rectHeightMm}/1000) = {rectAreaM2.toFixed(3)} m².</div>
          <div className="font-bold text-sky-400">
            5. Velocity: V = Q / A = {airflowM3s.toFixed(3)} / {rectAreaM2.toFixed(3)} = {velocityMs.toFixed(2)} m/s.
          </div>
          <div>6. Velocity Pressure: Pv = 0.60 × V² = 0.60 × ({velocityMs.toFixed(2)})² = {velocityPressurePa.toFixed(1)} Pa.</div>
        </div>
      </div>
    </div>
  );
};
