import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

export const SimRefrigerationCycle: React.FC = () => {
  const [coolingLoadKw, setCoolingLoadKw] = useState<number>(1050); // kW (approx 300 RT)
  const [condensingTempC, setCondensingTempC] = useState<number>(36.8); // °C (from Lesson 2 Fig 8)
  const [evaporatingTempC, setEvaporatingTempC] = useState<number>(6.5); // °C

  // Enthalpy estimations for R-134a based on Lesson 2 slide 106 P-h diagram:
  // Evaporating at ~6.5°C: h1 (suction vapor) ≈ 404 kJ/kg
  // Compression to condensing pressure: h2 (discharge superheated gas)
  // Condensing at ~36.8°C: h3 = h4 (liquid / flashed) ≈ 251 kJ/kg
  const h1 = 404; // kJ/kg
  const h4 = 251; // kJ/kg
  const re = h1 - h4; // Refrigerating Effect = 153 kJ/kg

  // Isentropic lift effect on h2:
  const lift = condensingTempC - evaporatingTempC; // e.g. ~30.3°C
  const wc = 24 + (lift - 25) * 0.45; // Work of compression (kJ/kg)
  const h2 = h1 + wc;

  // Mass flow rate ṁ = Q_cooling / RE
  const massFlowKgS = coolingLoadKw / re;
  const compressorPowerKw = massFlowKgS * wc;
  const cop = coolingLoadKw / compressorPowerKw;
  const coolingLoadRt = coolingLoadKw / 3.517;

  // Challenge goal: achieve COP >= 5.5
  const isChallengeMet = cop >= 5.5;

  const handleReset = () => {
    setCoolingLoadKw(1050);
    setCondensingTempC(36.8);
    setEvaporatingTempC(6.5);
  };

  return (
    <div className="space-y-6">
      {/* Simulator Layout: Controls on Left, Animated Diagram on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Controls & Challenge (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cycle Controls
              </span>
              <button
                onClick={handleReset}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Slider 1: Cooling Load */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Cooling Load (Qe)</span>
                <span className="font-mono font-bold text-sky-400">
                  {coolingLoadKw} kW ({coolingLoadRt.toFixed(0)} RT)
                </span>
              </div>
              <input
                type="range"
                min="350"
                max="2800"
                step="50"
                value={coolingLoadKw}
                onChange={(e) => setCoolingLoadKw(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>350 kW (100 RT)</span>
                <span>2,800 kW (800 RT)</span>
              </div>
            </div>

            {/* Slider 2: Condensing Temperature */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Condensing Temp (T_cond)</span>
                <span className="font-mono font-bold text-amber-400">{condensingTempC.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="30.0"
                max="45.0"
                step="0.5"
                value={condensingTempC}
                onChange={(e) => setCondensingTempC(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>30.0°C (Efficient CW)</span>
                <span>45.0°C (Air-cooled peak)</span>
              </div>
            </div>

            {/* Slider 3: Evaporating Temperature */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Evaporating Temp (T_evap)</span>
                <span className="font-mono font-bold text-cyan-400">{evaporatingTempC.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="9.0"
                step="0.5"
                value={evaporatingTempC}
                onChange={(e) => setEvaporatingTempC(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>3.0°C (Deep dehumid)</span>
                <span>6.5°C (Standard)</span>
                <span>9.0°C</span>
              </div>
            </div>
          </div>

          {/* "Try This" Challenge Box */}
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
              <span>Try This Challenge:</span>
            </div>
            <p className="text-xs leading-relaxed">
              Lower the condensing temperature and adjust temperatures to achieve a <strong>COP ≥ 5.50</strong> (reducing compressor lift).
            </p>
            <div className="mt-2 text-[11px] font-mono">
              Status:{' '}
              {isChallengeMet ? (
                <strong className="text-emerald-400">CHALLENGE MET! (COP = {cop.toFixed(2)})</strong>
              ) : (
                <span className="text-amber-400">Current COP: {cop.toFixed(2)} (Target: ≥ 5.50)</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Big Results & Live SVG Animation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Big Result KPI Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Compressor Power</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {compressorPowerKw.toFixed(1)} <span className="text-xs font-normal font-sans">kW</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{(compressorPowerKw / coolingLoadRt).toFixed(3)} kW/RT</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Refrigerant Flow</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                {massFlowKgS.toFixed(2)} <span className="text-xs font-normal font-sans">kg/s</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">RE = {re} kJ/kg</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Cycle COP</span>
              <div className={`text-xl sm:text-2xl font-bold font-mono mt-1 tabular-nums ${isChallengeMet ? 'text-emerald-400' : 'text-white'}`}>
                {cop.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Lift: {lift.toFixed(1)}°C</span>
            </div>
          </div>

          {/* Animated 4-Stage Loop SVG */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <svg viewBox="0 0 540 280" className="w-full h-auto select-none font-mono">
              {/* Background */}
              <rect x="0" y="0" width="540" height="280" rx="8" fill="#0b1120" stroke="#1e293b" />

              {/* Connecting Piping Loop */}
              {/* Top: Discharge gas (Compressor to Condenser) - Red */}
              <path d="M 270 50 L 420 50 L 420 80" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="6 6" className="animate-pipe-flow" />
              {/* Right: Condenser down to Expansion Valve - Orange/Yellow */}
              <path d="M 420 160 L 420 220 L 290 220" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 6" className="animate-pipe-flow" />
              {/* Bottom: Expansion Valve to Evaporator - Cyan */}
              <path d="M 250 220 L 120 220 L 120 160" fill="none" stroke="#06b6d4" strokeWidth="4" strokeDasharray="6 6" className="animate-pipe-flow" />
              {/* Left: Evaporator to Compressor - Blue */}
              <path d="M 120 80 L 120 50 L 270 50" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="6 6" className="animate-pipe-flow" />

              {/* COMPONENT 1: COMPRESSOR (Center Top) */}
              <g transform="translate(270, 50)">
                <circle cx="0" cy="0" r="24" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <path d="M -12 -12 L 12 0 L -12 12 Z" fill="#f59e0b" opacity="0.8" />
                <text x="0" y="-30" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  1. COMPRESSOR
                </text>
                <text x="0" y="38" textAnchor="middle" fill="#f59e0b" fontSize="9">
                  {compressorPowerKw.toFixed(0)} kW
                </text>
              </g>

              {/* COMPONENT 2: CONDENSER (Right) */}
              <g transform="translate(420, 120)">
                <rect x="-40" y="-40" width="80" height="80" rx="6" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
                <path d="M -25 -20 L 25 -20 M -25 0 L 25 0 M -25 20 L 25 20" stroke="#ef4444" strokeWidth="2" />
                <text x="0" y="-46" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  2. CONDENSER
                </text>
                <text x="0" y="5" textAnchor="middle" fill="#ef4444" fontSize="9">
                  T_c = {condensingTempC.toFixed(1)}°C
                </text>
                <text x="0" y="56" textAnchor="middle" fill="#94a3b8" fontSize="8">
                  Heat Rejection
                </text>
              </g>

              {/* COMPONENT 3: EXPANSION VALVE (Center Bottom) */}
              <g transform="translate(270, 220)">
                <polygon points="-12,-10 12,10 12,-10 -12,10" fill="#a855f7" stroke="#c084fc" strokeWidth="1" />
                <circle cx="0" cy="0" r="4" fill="#ffffff" />
                <text x="0" y="-16" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  3. EXPANSION (EEV)
                </text>
                <text x="0" y="24" textAnchor="middle" fill="#c084fc" fontSize="9">
                  Isenthalpic Drop
                </text>
              </g>

              {/* COMPONENT 4: EVAPORATOR (Left) */}
              <g transform="translate(120, 120)">
                <rect x="-40" y="-40" width="80" height="80" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
                <path d="M -25 -20 L 25 -20 M -25 0 L 25 0 M -25 20 L 25 20" stroke="#06b6d4" strokeWidth="2" />
                <text x="0" y="-46" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  4. EVAPORATOR
                </text>
                <text x="0" y="5" textAnchor="middle" fill="#06b6d4" fontSize="9">
                  T_e = {evaporatingTempC.toFixed(1)}°C
                </text>
                <text x="0" y="56" textAnchor="middle" fill="#94a3b8" fontSize="8">
                  Q = {coolingLoadKw} kW
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Step-by-Step Monospace Working Box (for tutorial submission) */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-sans">
          Step-by-Step Working (Copy directly into tutorial solutions):
        </span>
        <div className="p-4 bg-slate-950 rounded-lg font-mono text-xs text-slate-300 space-y-1.5 leading-relaxed overflow-x-auto">
          <div>1. Refrigerating Effect: RE = h1 - h4 = {h1} - {h4} = {re} kJ/kg</div>
          <div>2. Refrigerant Mass Flow Rate: ṁ = Q_cooling / RE = {coolingLoadKw} kW / {re} kJ/kg = {massFlowKgS.toFixed(3)} kg/s</div>
          <div>3. Work of Compression: Wc = h2 - h1 = {h2.toFixed(1)} - {h1} = {wc.toFixed(1)} kJ/kg (Lift = {lift.toFixed(1)}°C)</div>
          <div>4. Compressor Electrical Input: P_comp = ṁ × Wc = {massFlowKgS.toFixed(3)} × {wc.toFixed(1)} = {compressorPowerKw.toFixed(1)} kW</div>
          <div className="font-bold text-sky-400">
            5. Cycle COP = Q_cooling / P_comp = {coolingLoadKw} / {compressorPowerKw.toFixed(1)} = {cop.toFixed(2)}
          </div>
          <div className="text-slate-400 text-[11px]">
            Equiv Specific Power = 3.517 / COP = 3.517 / {cop.toFixed(2)} = {(3.517 / cop).toFixed(3)} kWe/RT
          </div>
        </div>
      </div>
    </div>
  );
};
