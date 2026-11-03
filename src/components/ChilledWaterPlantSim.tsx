import React, { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle2, RotateCcw, Wrench } from 'lucide-react';

export const ChilledWaterPlantSim: React.FC = () => {
  // Operational parameters state
  const [coolingLoadRT, setCoolingLoadRT] = useState<number>(800);
  const [ambientWetBulb, setAmbientWetBulb] = useState<number>(27.5); // °C
  const [chwSupplyTemp, setChwSupplyTemp] = useState<number>(6.7); // °C
  const [chwDeltaT, setChwDeltaT] = useState<number>(5.5); // °C (Design ΔT)
  const [isPicvEnabled, setIsPicvEnabled] = useState<boolean>(false);
  const [towerApproach, setTowerApproach] = useState<number>(2.5); // °C

  // Derived temperatures
  const chwReturnTemp = chwSupplyTemp + chwDeltaT;
  const cwEnteringTemp = ambientWetBulb + towerApproach; // ECWT to chiller
  const cwLeavingTemp = cwEnteringTemp + 5.2; // LCWT from chiller

  // Low Delta-T condition check
  const isLowDeltaT = chwDeltaT < 4.0;

  // Real-world calculations
  const coolingLoadKW = coolingLoadRT * 3.51685;

  // Chilled water flow (L/s) = kW / (4.186 * ΔT)
  const chwFlowLps = coolingLoadKW / (4.186 * chwDeltaT);
  const chwFlowGpm = chwFlowLps * 15.8503;

  // Design baseline flow for 800 RT at 5.5°C ΔT
  const designChwFlowLps = (coolingLoadRT * 3.51685) / (4.186 * 5.5);
  const flowRatio = chwFlowLps / designChwFlowLps;

  // Chillers staging logic:
  // Each chiller has nominal capacity of 500 RT. Max flow per chiller is 85 L/s.
  // When flow spikes due to low ΔT, extra chillers are staged early!
  const chillersRunning = useMemo(() => {
    if (isLowDeltaT && !isPicvEnabled) {
      // Staged due to pump flow limit
      return Math.min(4, Math.max(2, Math.ceil(chwFlowLps / 75)));
    }
    return Math.ceil(coolingLoadRT / 450);
  }, [coolingLoadRT, chwFlowLps, isLowDeltaT, isPicvEnabled]);

  const loadPerChillerRT = coolingLoadRT / chillersRunning;
  const partLoadRatio = Math.min(1.0, loadPerChillerRT / 500);

  // Compressor lift calculation (condenser saturation temp vs evaporator saturation temp)
  const evapSatTemp = chwSupplyTemp - 1.5;
  const condSatTemp = cwLeavingTemp + 1.2;
  const thermalLift = condSatTemp - evapSatTemp; // Lift in °C

  // Chiller baseline COP influenced by lift and part load
  // Standard lift ~ 30°C yields COP ~ 6.5. Higher lift lowers COP.
  const chillerCop = useMemo(() => {
    const baseCop = 7.2 - (thermalLift - 28) * 0.12;
    // Part-load penalty if running < 50%
    const partLoadPenalty = partLoadRatio < 0.5 ? (0.5 - partLoadRatio) * 1.8 : 0;
    return Math.max(3.2, baseCop - partLoadPenalty);
  }, [thermalLift, partLoadRatio]);

  const chillerPowerKw = coolingLoadKW / chillerCop;

  // CHWP Pump Power (kW) = Flow (L/s) * Head (m) * 9.81 / (1000 * PumpEff)
  // Head increases with flow squared, power with cube of flow
  const baseChwpKw = 28 * (coolingLoadRT / 800);
  const chwpPowerKw = baseChwpKw * Math.pow(flowRatio, 2.2);

  // Condenser Water Pump (CWP) Power
  const cwpFlowLps = (coolingLoadKW + chillerPowerKw) / (4.186 * 5.2);
  const cwpPowerKw = 34 * (coolingLoadRT / 800);

  // Cooling Tower Fan Power
  const towerFanPowerKw = 22 * (coolingLoadRT / 800) * (3.0 / Math.max(1.8, towerApproach));

  // Total Central Plant Power
  const totalPlantKw = chillerPowerKw + chwpPowerKw + cwpPowerKw + towerFanPowerKw;

  // Key Efficiency Metric: kW/RT
  const plantKwPerRt = totalPlantKw / coolingLoadRT;
  const plantCop = 3.51685 / plantKwPerRt;

  // Green Mark rating tier
  const greenMarkTier = useMemo(() => {
    if (plantKwPerRt <= 0.58) return { label: 'BCA Green Mark Platinum', color: 'emerald', code: '≤ 0.58 kW/RT' };
    if (plantKwPerRt <= 0.65) return { label: 'Green Mark Gold Plus', color: 'sky', code: '≤ 0.65 kW/RT' };
    if (plantKwPerRt <= 0.70) return { label: 'Green Mark Gold', color: 'amber', code: '≤ 0.70 kW/RT' };
    if (plantKwPerRt <= 0.75) return { label: 'Green Mark Certified', color: 'orange', code: '≤ 0.75 kW/RT' };
    return { label: 'Standard Baseline / Needs Retrofit', color: 'red', code: '> 0.75 kW/RT' };
  }, [plantKwPerRt]);

  const handleFixLowDeltaT = () => {
    setIsPicvEnabled(true);
    setChwDeltaT(5.5);
  };

  const handleReset = () => {
    setCoolingLoadRT(800);
    setAmbientWetBulb(27.5);
    setChwSupplyTemp(6.7);
    setChwDeltaT(5.5);
    setIsPicvEnabled(false);
    setTowerApproach(2.5);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Central Chilled Water Plant Simulator
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Interactive thermodynamic model of water-cooled chillers, cooling towers, and hydraulic loops.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isLowDeltaT && !isPicvEnabled && (
              <button
                onClick={handleFixLowDeltaT}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap"
              >
                <Wrench className="w-3.5 h-3.5" />
                Retrofit PICV Valves (Fix Low ΔT)
              </button>
            )}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Parameters
            </button>
          </div>
        </div>

        {/* Low Delta-T Alert Banner */}
        {isLowDeltaT && (
          <div className="mt-4 p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold block text-sm text-amber-900 dark:text-amber-100">
                Low Delta-T Syndrome Detected (ΔT = {chwDeltaT.toFixed(1)}°C vs 5.5°C Design)
              </span>
              <p>
                Because ΔT has collapsed, required chilled water flow has surged to{' '}
                <strong className="font-mono tabular-nums">{chwFlowLps.toFixed(1)} L/s</strong> (
                {((flowRatio - 1) * 100).toFixed(0)}% above design). The plant is forced to stage{' '}
                <strong>{chillersRunning} chillers</strong> at only{' '}
                <strong className="font-mono tabular-nums">{(partLoadRatio * 100).toFixed(0)}%</strong> part-load,
                wasting pumping power and raising plant consumption to{' '}
                <strong className="font-mono tabular-nums">{plantKwPerRt.toFixed(3)} kW/RT</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
          {/* Cooling Load */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Building Cooling Load</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                {coolingLoadRT} RT ({coolingLoadKW.toFixed(0)} kW)
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="1400"
              step="50"
              value={coolingLoadRT}
              onChange={(e) => setCoolingLoadRT(Number(e.target.value))}
              className="w-full accent-sky-600 dark:accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>200 RT (Night)</span>
              <span>1,400 RT (Peak)</span>
            </div>
          </div>

          {/* Ambient Wet-Bulb */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Ambient Wet-Bulb (Twb)</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                {ambientWetBulb.toFixed(1)}°C
              </span>
            </div>
            <input
              type="range"
              min="24.0"
              max="30.0"
              step="0.5"
              value={ambientWetBulb}
              onChange={(e) => setAmbientWetBulb(Number(e.target.value))}
              className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>24.0°C (Rainy)</span>
              <span>27.5°C (SG Design)</span>
              <span>30.0°C (Peak)</span>
            </div>
          </div>

          {/* Supply Temp Setpoint */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">CHW Supply Setpoint</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                {chwSupplyTemp.toFixed(1)}°C (Return: {chwReturnTemp.toFixed(1)}°C)
              </span>
            </div>
            <input
              type="range"
              min="5.5"
              max="9.0"
              step="0.1"
              value={chwSupplyTemp}
              onChange={(e) => setChwSupplyTemp(Number(e.target.value))}
              className="w-full accent-cyan-600 dark:accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>5.5°C (Low DP)</span>
              <span>6.7°C (Standard)</span>
              <span>9.0°C (Reset)</span>
            </div>
          </div>

          {/* Return Delta-T */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Chilled Water Delta-T (ΔT)</span>
              <span
                className={`font-mono tabular-nums font-semibold ${
                  isLowDeltaT ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
                }`}
              >
                {chwDeltaT.toFixed(1)}°C {isLowDeltaT ? '(Low ΔT!)' : '(Nominal)'}
              </span>
            </div>
            <input
              type="range"
              min="2.5"
              max="6.5"
              step="0.1"
              value={chwDeltaT}
              onChange={(e) => {
                setChwDeltaT(Number(e.target.value));
                if (Number(e.target.value) < 4.0) setIsPicvEnabled(false);
              }}
              className="w-full accent-amber-600 dark:accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>2.5°C (Degraded)</span>
              <span>5.5°C (Ideal)</span>
              <span>6.5°C (High ΔT)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Chilled Water Schematic */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-white relative overflow-hidden shadow-md">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Hydronic Schematic Live Simulation
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Active Chillers: {chillersRunning} of 4</span>
              <span>·</span>
              <span>Condenser Loop: {cwEnteringTemp.toFixed(1)}°C → {cwLeavingTemp.toFixed(1)}°C</span>
              <span>·</span>
              <span>Chilled Loop: {chwSupplyTemp.toFixed(1)}°C → {chwReturnTemp.toFixed(1)}°C</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-1 bg-emerald-500 inline-block rounded-xs"></span> Condenser Loop
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-2.5 h-1 bg-sky-500 inline-block rounded-xs"></span> Chilled Supply (7°C)
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-1 bg-indigo-500 inline-block rounded-xs"></span> Chilled Return (12°C)
            </span>
          </div>
        </div>

        {/* SVG Hydronic Circuit Diagram */}
        <div className="relative w-full overflow-x-auto">
          <svg viewBox="0 0 960 420" className="w-full min-w-[760px] h-auto select-none">
            <defs>
              <linearGradient id="chillerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="towerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>

            {/* Grid & Baseplate */}
            <rect x="10" y="10" width="940" height="400" rx="8" fill="#0b1120" stroke="#1e293b" strokeWidth="1" />

            {/* 1. COOLING TOWER (Top Left) */}
            <g transform="translate(40, 40)">
              <rect x="0" y="0" width="160" height="110" rx="6" fill="url(#towerGrad)" stroke="#475569" strokeWidth="1.5" />
              {/* Fan housing */}
              <path d="M 50 0 L 110 0 L 100 -20 L 60 -20 Z" fill="#475569" />
              {/* Spinning fan animation */}
              <g transform="translate(80, -10)">
                <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#38bdf8" strokeWidth="2.5" className="origin-center animate-spin" style={{ animationDuration: '0.8s' }} />
                <line x1="0" y1="-12" x2="0" y2="12" stroke="#38bdf8" strokeWidth="2.5" className="origin-center animate-spin" style={{ animationDuration: '0.8s' }} />
              </g>
              {/* Water spray nozzles */}
              <line x1="20" y1="35" x2="140" y2="35" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
              {/* Spray droplets */}
              <g fill="#38bdf8" opacity="0.7">
                <circle cx="35" cy="45" r="1.5" />
                <circle cx="55" cy="50" r="1.5" />
                <circle cx="75" cy="45" r="1.5" />
                <circle cx="95" cy="52" r="1.5" />
                <circle cx="115" cy="47" r="1.5" />
                <circle cx="130" cy="51" r="1.5" />
              </g>
              {/* PVC Fill Packing */}
              <rect x="15" y="60" width="130" height="25" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <line x1="20" y1="65" x2="140" y2="65" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="75" x2="140" y2="75" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
              {/* Basin */}
              <path d="M 10 95 L 150 95 L 140 105 L 20 105 Z" fill="#0284c7" opacity="0.6" />
              <text x="80" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">
                COOLING TOWER
              </text>
              <text x="80" y="125" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono" fontWeight="500">
                Twb: {ambientWetBulb.toFixed(1)}°C
              </text>
            </g>

            {/* 2. CONDENSER WATER LOOP (Piping from Tower to Chiller) */}
            {/* Tower out to CWP: Leaving cold water (ECWT to Chiller) */}
            <path
              d="M 120 150 L 120 220 L 210 220"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pipe-flow"
            />
            {/* CWP Pump */}
            <g transform="translate(210, 220)">
              <circle cx="18" cy="0" r="18" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
              <text x="18" y="4" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="700">
                CWP
              </text>
              <text x="18" y="28" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">
                {cwpPowerKw.toFixed(1)} kW
              </text>
            </g>
            {/* CWP to Chiller Condenser Barrel */}
            <path
              d="M 246 220 L 320 220"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pipe-flow"
            />
            <text x="270" y="210" fill="#34d399" fontSize="10" fontFamily="JetBrains Mono">
              {cwEnteringTemp.toFixed(1)}°C (ECWT)
            </text>

            {/* Warm Condenser water return from Chiller back to Tower */}
            <path
              d="M 440 220 L 480 220 L 480 90 L 200 90"
              fill="none"
              stroke="#059669"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pipe-flow-fast"
            />
            <text x="360" y="80" fill="#6ee7b7" fontSize="10" fontFamily="JetBrains Mono">
              {cwLeavingTemp.toFixed(1)}°C (LCWT)
            </text>

            {/* 3. CENTRAL CHILLER (Middle) */}
            <g transform="translate(320, 180)">
              {/* Main Enclosure */}
              <rect x="0" y="0" width="130" height="150" rx="8" fill="url(#chillerGrad)" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Condenser Barrel (Top) */}
              <rect x="10" y="20" width="110" height="45" rx="5" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="65" y="45" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">
                CONDENSER
              </text>
              {/* Centrifugal Compressor (Center Motor) */}
              <circle cx="65" cy="80" r="16" fill="#334155" stroke="#f59e0b" strokeWidth="2" />
              <path d="M 57 80 L 73 80 M 65 72 L 65 88" stroke="#f59e0b" strokeWidth="2" />
              {/* Evaporator Barrel (Bottom) */}
              <rect x="10" y="95" width="110" height="45" rx="5" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
              <text x="65" y="120" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="600">
                EVAPORATOR
              </text>
              <text x="65" y="170" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="700">
                CHILLER ({chillersRunning}x 500 RT)
              </text>
              <text x="65" y="186" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
                COP: {chillerCop.toFixed(2)} | {(partLoadRatio * 100).toFixed(0)}% Load
              </text>
            </g>

            {/* 4. CHILLED WATER LOOP (Chiller Evaporator to AHU) */}
            {/* Supply Pipe: Leaving 6.7°C (Cyan) */}
            <path
              d="M 430 295 L 530 295"
              fill="none"
              stroke="#0284c7"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pipe-flow"
            />
            {/* CHWP Pump */}
            <g transform="translate(530, 295)">
              <circle cx="18" cy="0" r="18" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
              <text x="18" y="4" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="700">
                CHWP
              </text>
              <text x="18" y="28" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">
                {chwpPowerKw.toFixed(1)} kW
              </text>
            </g>
            <path
              d="M 566 295 L 720 295"
              fill="none"
              stroke="#0284c7"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pipe-flow"
            />
            <text x="610" y="285" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono">
              {chwSupplyTemp.toFixed(1)}°C Supply ({chwFlowLps.toFixed(1)} L/s)
            </text>

            {/* DECOUPLER BYPASS HEADER */}
            <g transform="translate(620, 230)">
              <line
                x1="0"
                y1="65"
                x2="0"
                y2="-60"
                stroke={isLowDeltaT ? '#f59e0b' : '#64748b'}
                strokeWidth="3.5"
                strokeDasharray="4 4"
                className={isLowDeltaT ? 'animate-pipe-flow' : ''}
              />
              <circle cx="0" cy="0" r="10" fill="#1e293b" stroke={isLowDeltaT ? '#f59e0b' : '#64748b'} strokeWidth="1.5" />
              <text x="0" y="3" textAnchor="middle" fill={isLowDeltaT ? '#f59e0b' : '#94a3b8'} fontSize="8" fontWeight="700">
                BP
              </text>
              <text x="14" y="2" fill={isLowDeltaT ? '#f59e0b' : '#64748b'} fontSize="9" fontWeight="500">
                {isLowDeltaT ? '▲ Forward Bypass!' : 'Balanced'}
              </text>
            </g>

            {/* Return Pipe: Back to Evaporator (Indigo/Slate) */}
            <path
              d="M 720 170 L 320 170 L 320 275 L 330 275"
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pipe-flow-fast"
            />
            <text x="500" y="160" fill="#a5b4fc" fontSize="10" fontFamily="JetBrains Mono">
              {chwReturnTemp.toFixed(1)}°C Return (ΔT = {chwDeltaT.toFixed(1)}°C)
            </text>

            {/* 5. AIR HANDLING UNIT & BUILDING ZONE (Right) */}
            <g transform="translate(720, 140)">
              {/* AHU Outer Box */}
              <rect x="0" y="0" width="190" height="185" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              {/* Mixing Plenum & Filter */}
              <rect x="15" y="25" width="20" height="135" fill="#334155" stroke="#475569" strokeWidth="1" />
              <text x="25" y="100" textAnchor="middle" fill="#94a3b8" fontSize="8" transform="rotate(-90 25 100)">
                MERV 13 FILTER
              </text>

              {/* Chilled Water Cooling Coil */}
              <g transform="translate(50, 25)">
                <rect x="0" y="0" width="30" height="135" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
                {/* Coil serpentines */}
                <path d="M 5 15 L 25 15 L 25 35 L 5 35 L 5 55 L 25 55 L 25 75 L 5 75 L 5 95 L 25 95 L 25 115 L 5 115" fill="none" stroke="#38bdf8" strokeWidth="2" />
                {/* Condensate Droplets */}
                <circle cx="15" cy="142" r="2" fill="#38bdf8" opacity="0.8" />
                <circle cx="20" cy="150" r="1.5" fill="#38bdf8" opacity="0.8" />
              </g>

              {/* AHU Modulating 2-way Valve */}
              <g transform="translate(65, 168)">
                <polygon points="-6,-6 6,6 6,-6 -6,6" fill={isPicvEnabled ? '#10b981' : isLowDeltaT ? '#f59e0b' : '#0284c7'} />
                <text x="0" y="14" textAnchor="middle" fill="#94a3b8" fontSize="7">
                  {isPicvEnabled ? 'PICV' : '2-Way'}
                </text>
              </g>

              {/* Supply Air Fan */}
              <g transform="translate(125, 90)">
                <circle cx="0" cy="0" r="24" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="-16" y1="0" x2="16" y2="0" stroke="#38bdf8" strokeWidth="2" className="origin-center animate-spin" style={{ animationDuration: '1.2s' }} />
                <line x1="0" y1="-16" x2="0" y2="16" stroke="#38bdf8" strokeWidth="2" className="origin-center animate-spin" style={{ animationDuration: '1.2s' }} />
                <text x="0" y="38" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="600">
                  SUPPLY FAN
                </text>
              </g>

              {/* Supply Airflow Discharge Arrow */}
              <path d="M 170 90 L 195 90 M 190 85 L 198 90 L 190 95" stroke="#38bdf8" strokeWidth="3" />
              <text x="95" y="16" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="700">
                AIR HANDLING UNIT (AHU)
              </text>
            </g>

            {/* Conditioned Zone Kicker */}
            <g transform="translate(720, 345)">
              <rect x="0" y="0" width="190" height="45" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <text x="15" y="20" fill="#94a3b8" fontSize="9">
                BUILDING THERMAL ZONE
              </text>
              <text x="15" y="36" fill="#38bdf8" fontSize="12" fontWeight="700" fontFamily="JetBrains Mono">
                {coolingLoadRT} RT · 23.5°C · 55% RH
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Engineering KPI & Green Mark Benchmark Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Plant kW/RT Metric */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Plant Operating Efficiency</span>
            <span className="font-mono">kW/RT</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {plantKwPerRt.toFixed(3)}
            </span>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              (COP: {plantCop.toFixed(2)})
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">BCA Green Mark:</span>
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              {greenMarkTier.label}
            </span>
          </div>
        </div>

        {/* Chilled Water Flow Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Chilled Water Flow (CHW)</span>
            <span className="font-mono">L/s · GPM</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {chwFlowLps.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">L/s</span>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              ({chwFlowGpm.toFixed(0)} GPM)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Flow Index:</span>
            <span
              className={`font-mono font-medium ${
                flowRatio > 1.1 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {(flowRatio * 2.4).toFixed(2)} GPM/RT {flowRatio > 1.1 && '(High!)'}
            </span>
          </div>
        </div>

        {/* Total Electrical Power */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Plant Electrical Power</span>
            <span className="font-mono">kW</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {totalPlantKw.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">kW</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Compressor: {chillerPowerKw.toFixed(0)} kW</span>
            <span>Pumps+Fans: {(chwpPowerKw + cwpPowerKw + towerFanPowerKw).toFixed(0)} kW</span>
          </div>
        </div>

        {/* Power Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Equipment Power Breakdown
          </div>
          <div className="space-y-1.5 text-xs font-mono my-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Chillers ({chillersRunning} units)</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {chillerPowerKw.toFixed(1)} kW ({(chillerPowerKw / coolingLoadRT).toFixed(3)} kW/RT)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">CHW Primary Pumps</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {chwpPowerKw.toFixed(1)} kW ({(chwpPowerKw / coolingLoadRT).toFixed(3)} kW/RT)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Condenser Pumps</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {cwpPowerKw.toFixed(1)} kW ({(cwpPowerKw / coolingLoadRT).toFixed(3)} kW/RT)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Cooling Tower Fans</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {towerFanPowerKw.toFixed(1)} kW ({(towerFanPowerKw / coolingLoadRT).toFixed(3)} kW/RT)
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            Singapore SS 530 / SS 553 compliant instrumentation.
          </div>
        </div>
      </div>
    </div>
  );
};
