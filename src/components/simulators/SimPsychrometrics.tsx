import React, { useState } from 'react';
import { Activity, Droplets, Thermometer, CheckCircle2 } from 'lucide-react';

export const SimPsychrometrics: React.FC = () => {
  // Outdoor State (Point O)
  const [tOutdoor, setTOutdoor] = useState<number>(32); // °C
  const [rhOutdoor, setRhOutdoor] = useState<number>(80); // %

  // Return Air State (Point R)
  const [tReturn, setTReturn] = useState<number>(24); // °C
  const [rhReturn, setRhReturn] = useState<number>(50); // %

  // Fresh Air Ratio
  const [freshAirRatio, setFreshAirRatio] = useState<number>(20); // % (0.20)

  // Psychrometric approximation functions (Standard atmospheric pressure 101.325 kPa)
  // Saturation vapor pressure (kPa) via Tetens formula
  const calcPws = (t: number) => 0.61078 * Math.exp((17.27 * t) / (t + 237.3));

  // Humidity ratio W (kg/kg_da)
  const calcW = (t: number, rh: number) => {
    const pws = calcPws(t);
    const pw = (rh / 100) * pws;
    const pAtm = 101.325;
    return (0.622 * pw) / (pAtm - pw);
  };

  // Enthalpy h (kJ/kg_da) = 1.006*t + W*(2501 + 1.86*t)
  const calcH = (t: number, w: number) => 1.006 * t + w * (2501 + 1.86 * t);

  // Wet bulb approximation (Stull formula)
  const calcTwb = (t: number, rh: number) => {
    return (
      t * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5)) +
      Math.atan(t + rh) -
      Math.atan(rh - 1.676331) +
      0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
      4.686035
    );
  };

  // State O calculations
  const wOutdoor = calcW(tOutdoor, rhOutdoor); // kg/kg
  const hOutdoor = calcH(tOutdoor, wOutdoor); // kJ/kg
  const twbOutdoor = calcTwb(tOutdoor, rhOutdoor);

  // State R calculations
  const wReturn = calcW(tReturn, rhReturn);
  const hReturn = calcH(tReturn, wReturn);
  const twbReturn = calcTwb(tReturn, rhReturn);

  // Mixed Air (Point M) by adiabatic mixing (Lesson 13/14 formula)
  // f = fresh air fraction
  const f = freshAirRatio / 100;
  const tMixed = f * tOutdoor + (1 - f) * tReturn;
  const wMixed = f * wOutdoor + (1 - f) * wReturn;
  const hMixed = calcH(tMixed, wMixed);

  // Approximate Supply Air off coil (assuming ADP ~ 10°C, Contact Factor ~ 0.9 / Bypass Factor ~ 0.1)
  const tAdp = 10.0;
  const bf = 0.12;
  const tSupply = tAdp + bf * (tMixed - tAdp);
  const wAdp = calcW(tAdp, 100);
  const wSupply = wAdp + bf * (wMixed - wAdp);
  const hSupply = calcH(tSupply, wSupply);

  // Coordinate mapping for SVG Psychrometric Chart
  // Chart bounds: DB from 10°C to 40°C, W from 0 to 30 g/kg (0.030 kg/kg)
  const svgWidth = 520;
  const svgHeight = 260;
  const padLeft = 45;
  const padBottom = 35;
  const plotWidth = svgWidth - padLeft - 20;
  const plotHeight = svgHeight - padBottom - 20;

  const mapX = (t: number) => padLeft + ((t - 10) / (40 - 10)) * plotWidth;
  const mapY = (wKg: number) => padBottom + (1 - (wKg * 1000) / 30) * plotHeight;

  // Generate Saturation Curve points (100% RH from 10°C to 35°C)
  const satCurvePoints: string[] = [];
  for (let t = 10; t <= 35; t += 1) {
    const wSat = calcW(t, 100);
    satCurvePoints.push(`${mapX(t)},${mapY(wSat)}`);
  }
  const satCurvePath = `M ${satCurvePoints.join(' L ')}`;

  // Challenge: Set Singapore design condition: Outdoor 32°C, 80% RH, Return 24°C, 50% RH, Fresh Air 20%
  // Mixed DB will be 25.6°C (± 0.2°C)
  const challengePassed =
    Math.abs(tOutdoor - 32) <= 1 &&
    Math.abs(rhOutdoor - 80) <= 2 &&
    Math.abs(tReturn - 24) <= 1 &&
    Math.abs(rhReturn - 50) <= 2 &&
    Math.abs(freshAirRatio - 20) <= 1;

  return (
    <div className="space-y-6 text-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Air Stream Conditions
            </span>
            <span className="text-xs text-slate-400">Lessons 13 & 14 · Psychrometrics</span>
          </div>

          {/* Outdoor DB & RH */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Outdoor Dry Bulb (To)</span>
              <span className="font-mono text-orange-400 font-semibold">{tOutdoor}°C</span>
            </div>
            <input
              type="range"
              min="28"
              max="36"
              step="0.5"
              value={tOutdoor}
              onChange={(e) => setTOutdoor(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Outdoor RH (RHo)</span>
              <span className="font-mono text-orange-400 font-semibold">{rhOutdoor}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              step="1"
              value={rhOutdoor}
              onChange={(e) => setRhOutdoor(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Return Air DB & RH */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Room / Return Dry Bulb (Tr)</span>
              <span className="font-mono text-cyan-400 font-semibold">{tReturn}°C</span>
            </div>
            <input
              type="range"
              min="20"
              max="26"
              step="0.5"
              value={tReturn}
              onChange={(e) => setTReturn(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Room RH (RHr)</span>
              <span className="font-mono text-cyan-400 font-semibold">{rhReturn}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="65"
              step="1"
              value={rhReturn}
              onChange={(e) => setRhReturn(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Fresh Air Percentage */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Fresh Air Fraction</span>
              <span className="font-mono text-rose-400 font-semibold">{freshAirRatio}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={freshAirRatio}
              onChange={(e) => setFreshAirRatio(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[11px] text-slate-500">SS 553 fresh air: {(freshAirRatio).toFixed(0)}% outdoor + {(100 - freshAirRatio).toFixed(0)}% recirculated</div>
          </div>
        </div>

        {/* Live Psychrometric SVG & Readouts */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center mb-2 px-1 text-xs">
              <span className="text-slate-400 font-semibold uppercase">Psychrometric Chart & Process Lines</span>
              <span className="text-slate-500">P = 101.325 kPa (Sea Level)</span>
            </div>

            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-h-64 bg-slate-950 rounded-xl border border-slate-800/80">
              {/* Axes */}
              <line x1={padLeft} y1={svgHeight - padBottom} x2={svgWidth - 20} y2={svgHeight - padBottom} stroke="#475569" strokeWidth="1.5" />
              <line x1={padLeft} y1={20} x2={padLeft} y2={svgHeight - padBottom} stroke="#475569" strokeWidth="1.5" />

              {/* Grid ticks for DB */}
              {[10, 15, 20, 25, 30, 35, 40].map((t) => (
                <g key={t}>
                  <line x1={mapX(t)} y1={svgHeight - padBottom} x2={mapX(t)} y2={svgHeight - padBottom + 5} stroke="#64748b" />
                  <text x={mapX(t)} y={svgHeight - padBottom + 16} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    {t}°
                  </text>
                </g>
              ))}
              <text x={svgWidth / 2} y={svgHeight - 4} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">
                Dry Bulb Temperature (°C)
              </text>

              {/* Grid ticks for Humidity Ratio */}
              {[0, 5, 10, 15, 20, 25, 30].map((w) => (
                <g key={w}>
                  <line x1={padLeft - 5} y1={mapY(w / 1000)} x2={padLeft} y2={mapY(w / 1000)} stroke="#64748b" />
                  <text x={padLeft - 8} y={mapY(w / 1000) + 3} textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                    {w}
                  </text>
                </g>
              ))}
              <text x={12} y={svgHeight / 2} transform={`rotate(-90 12 ${svgHeight / 2})`} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">
                w (g/kg_da)
              </text>

              {/* Saturation Curve 100% RH */}
              <path d={satCurvePath} fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 2" />
              <text x={mapX(26)} y={mapY(calcW(26, 100)) - 6} fill="#38bdf8" fontSize="9" fontWeight="600">
                100% RH Saturation
              </text>

              {/* Mixing Line between O and R */}
              <line
                x1={mapX(tReturn)}
                y1={mapY(wReturn)}
                x2={mapX(tOutdoor)}
                y2={mapY(wOutdoor)}
                stroke="#e2e8f0"
                strokeWidth="2"
                strokeDasharray="4 3"
              />

              {/* Cooling & Dehumidification Line from M to ADP through S */}
              <line
                x1={mapX(tMixed)}
                y1={mapY(wMixed)}
                x2={mapX(tAdp)}
                y2={mapY(wAdp)}
                stroke="#06b6d4"
                strokeWidth="2"
              />

              {/* Point O (Outdoor) */}
              <circle cx={mapX(tOutdoor)} cy={mapY(wOutdoor)} r="5" fill="#f97316" stroke="#fff" strokeWidth="1.5" />
              <text x={mapX(tOutdoor) + 8} y={mapY(wOutdoor) - 4} fill="#fb923c" fontSize="11" fontWeight="bold">
                O ({tOutdoor}°C, {(wOutdoor * 1000).toFixed(1)}g)
              </text>

              {/* Point R (Return) */}
              <circle cx={mapX(tReturn)} cy={mapY(wReturn)} r="5" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" />
              <text x={mapX(tReturn) - 8} y={mapY(wReturn) - 4} textAnchor="end" fill="#7dd3fc" fontSize="11" fontWeight="bold">
                R ({tReturn}°C, {(wReturn * 1000).toFixed(1)}g)
              </text>

              {/* Point M (Mixed) */}
              <circle cx={mapX(tMixed)} cy={mapY(wMixed)} r="6" fill="#e11d48" stroke="#fff" strokeWidth="2" />
              <text x={mapX(tMixed) + 8} y={mapY(wMixed) + 12} fill="#fda4af" fontSize="11" fontWeight="bold">
                M ({tMixed.toFixed(1)}°C, {(wMixed * 1000).toFixed(1)}g)
              </text>

              {/* Point S (Supply) */}
              <circle cx={mapX(tSupply)} cy={mapY(wSupply)} r="4.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
              <text x={mapX(tSupply) - 6} y={mapY(wSupply) + 14} textAnchor="end" fill="#6ee7b7" fontSize="10" fontWeight="bold">
                S ({tSupply.toFixed(1)}°C)
              </text>

              {/* Point ADP */}
              <circle cx={mapX(tAdp)} cy={mapY(wAdp)} r="4" fill="#6366f1" stroke="#fff" strokeWidth="1" />
              <text x={mapX(tAdp) - 6} y={mapY(wAdp) - 6} textAnchor="end" fill="#a5b4fc" fontSize="9">
                ADP ({tAdp}°C)
              </text>
            </svg>
          </div>

          {/* 4 Big Result Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">Mixed Temp (Tm)</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-rose-400 mt-0.5">
                {tMixed.toFixed(1)}°C
              </div>
              <div className="text-[10px] text-slate-500">Dry bulb</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">Mixed Moisture (Wm)</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-cyan-400 mt-0.5">
                {(wMixed * 1000).toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500">g/kg dry air</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">Enthalpy (hm)</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-0.5">
                {hMixed.toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-500">kJ/kg dry air</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">Supply Temp (Ts)</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {tSupply.toFixed(1)}°C
              </div>
              <div className="text-[10px] text-slate-500">ADP = 10°C, BF = 0.12</div>
            </div>
          </div>
        </div>
      </div>

      {/* Monospace Step-by-Step Box */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Step-by-Step Calculation (Lessons 13 & 14 Psychrometric Mixing)
        </div>
        <pre className="font-mono text-xs sm:text-sm text-slate-300 bg-slate-950 p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-800/80">
{`1. Outdoor Condition (O):
   - To = ${tOutdoor}°C DB, RHo = ${rhOutdoor}%
   - Wo = ${(wOutdoor * 1000).toFixed(2)} g/kg_da (0.0${(wOutdoor * 1000).toFixed(0)} kg/kg)
   - ho = 1.006×${tOutdoor} + ${wOutdoor.toFixed(4)}×(2501 + 1.86×${tOutdoor}) = ${hOutdoor.toFixed(1)} kJ/kg

2. Return Air Condition (R):
   - Tr = ${tReturn}°C DB, RHr = ${rhReturn}%
   - Wr = ${(wReturn * 1000).toFixed(2)} g/kg_da
   - hr = 1.006×${tReturn} + ${wReturn.toFixed(4)}×(2501 + 1.86×${tReturn}) = ${hReturn.toFixed(1)} kJ/kg

3. Adiabatic Air Stream Mixing (M):
   - Fresh Air Fraction: f = ${(f).toFixed(2)} (${freshAirRatio}%), Recirculated Fraction: 1 - f = ${(1 - f).toFixed(2)}
   - Tm = f·To + (1 - f)·Tr = ${(f).toFixed(2)}×${tOutdoor} + ${(1 - f).toFixed(2)}×${tReturn} = ${tMixed.toFixed(1)}°C
   - Wm = f·Wo + (1 - f)·Wr = ${(f).toFixed(2)}×${(wOutdoor * 1000).toFixed(2)} + ${(1 - f).toFixed(2)}×${(wReturn * 1000).toFixed(2)} = ${(wMixed * 1000).toFixed(2)} g/kg_da
   - hm = f·ho + (1 - f)·hr = ${(f).toFixed(2)}×${hOutdoor.toFixed(1)} + ${(1 - f).toFixed(2)}×${hReturn.toFixed(1)} = ${hMixed.toFixed(1)} kJ/kg

4. Cooling & Dehumidification Process (M -> S):
   - Apparatus Dew Point (ADP) = ${tAdp}°C, Coil Bypass Factor (BF) = ${bf}
   - Supply Air Ts = ADP + BF·(Tm - ADP) = ${tAdp} + ${bf}×(${tMixed.toFixed(1)} - ${tAdp}) = ${tSupply.toFixed(1)}°C
   - Total Coil Enthalpy Drop Δh = hm - hs = ${hMixed.toFixed(1)} - ${hSupply.toFixed(1)} = ${(hMixed - hSupply).toFixed(1)} kJ/kg`}
        </pre>
      </div>

      {/* Try this Challenge */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
          challengePassed
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
            : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              challengePassed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {challengePassed ? <CheckCircle2 className="w-5 h-5" /> : '★'}
          </div>
          <div>
            <div className="font-semibold text-sm">
              Try This Challenge: Singapore Design Mixing
            </div>
            <div className="text-xs text-slate-400">
              Set Outdoor To = 32°C & 80% RH, Room Tr = 24°C & 50% RH, and Fresh Air = 20% to achieve the standard Mixed Air point (Tm = 25.6°C).
            </div>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              challengePassed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {challengePassed ? 'Completed!' : 'In Progress'}
          </span>
        </div>
      </div>
    </div>
  );
};
