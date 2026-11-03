import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

export const SimChillerPerformance: React.FC = () => {
  const [chwFlowLps, setChwFlowLps] = useState<number>(128.0); // Practical 1 value
  const [supplyTempC, setSupplyTempC] = useState<number>(8.0); // Practical 1 value
  const [returnTempC, setReturnTempC] = useState<number>(13.0); // Practical 1 value (ΔT = 5.0)
  const [chillerPowerKw, setChillerPowerKw] = useState<number>(440.0); // kWe

  const Cw = 4.2; // kJ/kgK (from Lesson 5 handout Eqn 1)
  const deltaT = returnTempC - supplyTempC;

  // Eqn 1: Q = m_chw * Cw * (tchwr - tchws)
  const coolingCapKw = chwFlowLps * Cw * deltaT;
  // Eqn 2: RT = Q / 3.517
  const coolingCapRt = coolingCapKw / 3.517;

  // Eqn 5: Chiller Efficiency = kWe / RT
  const kwPerRt = coolingCapRt > 0 ? chillerPowerKw / coolingCapRt : 0;
  const cop = kwPerRt > 0 ? 3.517 / kwPerRt : 0;

  // Challenge: Delta-T >= 5.5°C AND efficiency <= 0.58 kW/RT
  const isChallengeMet = deltaT >= 5.5 && kwPerRt <= 0.58;

  const handleReset = () => {
    setChwFlowLps(128.0);
    setSupplyTempC(8.0);
    setReturnTempC(13.0);
    setChillerPowerKw(440.0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Controls & Challenge (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Operating Parameters (Practical 1)
              </span>
              <button
                onClick={handleReset}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Slider 1: Flow Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Chilled Water Flow (ṁ)</span>
                <span className="font-mono font-bold text-sky-400">{chwFlowLps.toFixed(1)} L/s (kg/s)</span>
              </div>
              <input
                type="range"
                min="60"
                max="200"
                step="2"
                value={chwFlowLps}
                onChange={(e) => setChwFlowLps(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>60 L/s</span>
                <span>128 L/s (Lab baseline)</span>
                <span>200 L/s</span>
              </div>
            </div>

            {/* Slider 2: Supply Temp */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">CHW Supply Temp (tchws)</span>
                <span className="font-mono font-bold text-cyan-400">{supplyTempC.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="6.0"
                max="10.0"
                step="0.5"
                value={supplyTempC}
                onChange={(e) => setSupplyTempC(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Slider 3: Return Temp */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">CHW Return Temp (tchwr)</span>
                <span className="font-mono font-bold text-indigo-400">
                  {returnTempC.toFixed(1)}°C (ΔT = {deltaT.toFixed(1)}°C)
                </span>
              </div>
              <input
                type="range"
                min="11.0"
                max="16.0"
                step="0.5"
                value={returnTempC}
                onChange={(e) => setReturnTempC(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Slider 4: Electrical Power */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Chiller Electrical Input (kWe)</span>
                <span className="font-mono font-bold text-amber-400">{chillerPowerKw.toFixed(0)} kW</span>
              </div>
              <input
                type="range"
                min="250"
                max="600"
                step="10"
                value={chillerPowerKw}
                onChange={(e) => setChillerPowerKw(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
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
              <span>Green Mark Target Challenge:</span>
            </div>
            <p className="text-xs leading-relaxed">
              Adjust chilled water <strong>ΔT to ≥ 5.5°C</strong> (e.g. 7.5°C supply, 13.5°C return) to achieve BCA Green Mark Platinum efficiency of <strong>≤ 0.58 kW/RT</strong>.
            </p>
            <div className="mt-2 text-[11px] font-mono">
              Status:{' '}
              {isChallengeMet ? (
                <strong className="text-emerald-400">
                  TARGET ACHIEVED! ({kwPerRt.toFixed(3)} kW/RT ≤ 0.58 Platinum)
                </strong>
              ) : (
                <span className="text-amber-400">
                  Current: {kwPerRt.toFixed(3)} kW/RT (ΔT = {deltaT.toFixed(1)}°C)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Big Results & Gauge (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Cooling kW</span>
              <div className="text-xl font-bold font-mono text-sky-400 mt-1 tabular-nums">
                {coolingCapKw.toFixed(0)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Eqn 1</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Cooling RT</span>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                {coolingCapRt.toFixed(1)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Eqn 2</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Chiller kW/RT</span>
              <div
                className={`text-xl font-bold font-mono mt-1 tabular-nums ${
                  kwPerRt <= 0.58 ? 'text-emerald-400' : kwPerRt <= 0.65 ? 'text-amber-400' : 'text-red-400'
                }`}
              >
                {kwPerRt.toFixed(3)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Eqn 5</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Chiller COP</span>
              <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                {cop.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">3.517 / kW/RT</span>
            </div>
          </div>

          {/* BCA Green Mark Gauge Visualizer */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">
                BCA Green Mark Benchmark Gauge:
              </span>
              <span
                className={`font-mono font-bold ${
                  kwPerRt <= 0.58
                    ? 'text-emerald-400'
                    : kwPerRt <= 0.65
                    ? 'text-sky-400'
                    : kwPerRt <= 0.70
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {kwPerRt <= 0.58
                  ? 'Platinum (≤ 0.58 kW/RT)'
                  : kwPerRt <= 0.65
                  ? 'Gold Plus (≤ 0.65 kW/RT)'
                  : kwPerRt <= 0.70
                  ? 'Gold (≤ 0.70 kW/RT)'
                  : 'Standard Baseline (> 0.70)'}
              </span>
            </div>

            {/* Progress gauge */}
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden relative">
              {/* Target marker line at 0.58 */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white z-10"
                style={{ left: `${((0.58 - 0.45) / (0.85 - 0.45)) * 100}%` }}
                title="Platinum Target: 0.58 kW/RT"
              ></div>
              <div
                className={`h-full transition-all duration-300 ${
                  kwPerRt <= 0.58 ? 'bg-emerald-500' : kwPerRt <= 0.65 ? 'bg-sky-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, ((kwPerRt - 0.45) / (0.85 - 0.45)) * 100))}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.45 kW/RT (Best)</span>
              <span className="text-white font-bold">| Target 0.58</span>
              <span>0.85 kW/RT (High)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monospace Step-by-Step Working */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-sans">
          Step-by-Step Working (From Practical 1 Lab Handout):
        </span>
        <div className="p-4 bg-slate-950 rounded-lg font-mono text-xs text-slate-300 space-y-1.5 leading-relaxed overflow-x-auto">
          <div>1. Chiller cooling capacity in kW [Eqn 1]:</div>
          <div className="text-slate-400 text-[11px]">   Q = ṁ_chw × Cw × (tchwr - tchws) = {chwFlowLps.toFixed(1)} × 4.2 × ({returnTempC.toFixed(1)} - {supplyTempC.toFixed(1)}) = {coolingCapKw.toFixed(1)} kW</div>
          <div>2. Chiller cooling capacity in Refrigeration Ton (RT) [Eqn 2]:</div>
          <div className="text-slate-400 text-[11px]">   RT = Q / 3.517 = {coolingCapKw.toFixed(1)} / 3.517 = {coolingCapRt.toFixed(2)} RT</div>
          <div>3. Chiller efficiency in kW/RT [Eqn 5]:</div>
          <div className="text-sky-400 font-bold">   kWe/RT = Chiller Input Power / Cooling RT = {chillerPowerKw.toFixed(0)} / {coolingCapRt.toFixed(2)} = {kwPerRt.toFixed(3)} kW/RT</div>
          <div>4. Coefficient of Performance (COP):</div>
          <div className="text-slate-400 text-[11px]">   COP = 3.517 / (kW/RT) = 3.517 / {kwPerRt.toFixed(3)} = {cop.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};
