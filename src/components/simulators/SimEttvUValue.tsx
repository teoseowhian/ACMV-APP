import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Layers, Compass, CheckCircle2 } from 'lucide-react';

export const SimEttvUValue: React.FC = () => {
  // 1. Wall thermal layers
  const [plasterThick, setPlasterThick] = useState<number>(20); // mm
  const [brickThick, setBrickThick] = useState<number>(100); // mm
  const [insulThick, setInsulThick] = useState<number>(25); // mm

  // 2. Fenestration & Orientation
  const [wwr, setWwr] = useState<number>(35); // Window to wall ratio % (0 - 80)
  const [shgc, setShgc] = useState<number>(0.38); // Solar Heat Gain Coefficient / Shading Coeff
  const [orientation, setOrientation] = useState<'N' | 'S' | 'E' | 'W'>('W'); // CF values vary

  // Thermal conductivities (W/m·K) from Lesson 10
  const kPlaster = 0.80; // Cement plaster
  const kBrick = 0.81; // Common clay brick
  const kInsul = 0.035; // Glasswool / Rockwool insulation
  const rInsideAir = 0.12; // m²·K/W
  const rOutsideAir = 0.044; // m²·K/W

  // Thermal resistances: R = x / k
  const rPlaster = (plasterThick / 1000) / kPlaster;
  const rBrick = (brickThick / 1000) / kBrick;
  const rInsul = (insulThick / 1000) / kInsul;
  const rTotal = rOutsideAir + rPlaster + rBrick + rInsul + rInsideAir;
  const uWall = 1 / rTotal; // W/m²·K

  // Glazing U-value typical
  const uFenestration = 2.8; // W/m²·K (Double glazed Low-E)

  // Solar Correction Factors (CF) from Lesson 10 / BCA Code
  const cfMap = {
    N: 0.90,
    S: 0.92,
    E: 1.15,
    W: 1.25,
  };
  const cf = cfMap[orientation];

  // ETTV Singapore BCA Formula (Lesson 10):
  // ETTV = 12(1 - WWR)*Uw + 3.4(WWR)*Uf + 211(WWR)*CF*SC
  const wwrFraction = wwr / 100;
  const opaqueConduction = 12 * (1 - wwrFraction) * uWall;
  const glassConduction = 3.4 * wwrFraction * uFenestration;
  const solarRadiation = 211 * wwrFraction * cf * shgc;
  const ettv = opaqueConduction + glassConduction + solarRadiation;

  // Challenge: Achieve ETTV <= 50 W/m² on a West-facing façade with WWR >= 30%
  const challengePassed = orientation === 'W' && wwr >= 30 && ettv <= 50.0;

  return (
    <div className="space-y-6 text-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Façade Inputs
            </span>
            <span className="text-xs text-slate-400">Lesson 10 · BCA Envelope</span>
          </div>

          {/* Wall Insulation */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Rockwool Insulation (k=0.035)</span>
              <span className="font-mono text-rose-400 font-semibold">{insulThick} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="75"
              step="5"
              value={insulThick}
              onChange={(e) => setInsulThick(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Window to Wall Ratio (WWR) */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Window-to-Wall Ratio (WWR)</span>
              <span className="font-mono text-rose-400 font-semibold">{wwr}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={wwr}
              onChange={(e) => setWwr(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Shading Coefficient / SHGC */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Glazing Shading Coeff (SC)</span>
              <span className="font-mono text-rose-400 font-semibold">{shgc.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="0.85"
              step="0.02"
              value={shgc}
              onChange={(e) => setShgc(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Orientation */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Façade Orientation (CF factor)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['N', 'S', 'E', 'W'] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setOrientation(dir)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    orientation === dir
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-900/30'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {dir} (CF {cfMap[dir]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Diagram & Results Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* SVG Wall & Glazing Elevation Diagram */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col items-center">
            <svg viewBox="0 0 500 210" className="w-full max-h-52">
              <defs>
                <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* Opaque Wall Frame */}
              <rect x="30" y="20" width="440" height="170" rx="10" fill="url(#wallGrad)" stroke="#64748b" strokeWidth="2" />
              <text x="45" y="42" fill="#94a3b8" fontSize="12" fontWeight="600">
                OPAQUE WALL · Uw = {uWall.toFixed(2)} W/m²K
              </text>

              {/* Glass Window based on WWR */}
              {/* Width proportional to sqrt of WWR */}
              <rect
                x={250 - Math.min(180, (wwr / 70) * 160)}
                y={60}
                width={Math.min(360, (wwr / 70) * 320)}
                height={110}
                rx="6"
                fill="url(#glassGrad)"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text x="250" y="115" textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="bold">
                GLAZING ({wwr}% WWR · SC {shgc.toFixed(2)})
              </text>
              <text x="250" y="135" textAnchor="middle" fill="#bae6fd" fontSize="11">
                Solar Radiation: {solarRadiation.toFixed(1)} W/m²
              </text>

              {/* Sun & Solar Ray */}
              <circle cx="430" cy="50" r="18" fill="#fbbf24" filter="drop-shadow(0px 0px 8px #f59e0b)" />
              <line x1="410" y1="65" x2="350" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
              <text x="430" y="85" textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="bold">
                {orientation} (CF {cf})
              </text>
            </svg>

            {/* Quick breakdown bar */}
            <div className="w-full mt-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Opaque: {opaqueConduction.toFixed(1)}</span>
                <span>Glass Cond: {glassConduction.toFixed(1)}</span>
                <span>Solar Heat: {solarRadiation.toFixed(1)} W/m²</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${(opaqueConduction / (ettv || 1)) * 100}%` }}
                  className="bg-amber-500 transition-all duration-300"
                  title="Opaque Wall Conduction"
                />
                <div
                  style={{ width: `${(glassConduction / (ettv || 1)) * 100}%` }}
                  className="bg-cyan-500 transition-all duration-300"
                  title="Glass Conduction"
                />
                <div
                  style={{ width: `${(solarRadiation / (ettv || 1)) * 100}%` }}
                  className="bg-rose-500 transition-all duration-300"
                  title="Solar Radiation Gain"
                />
              </div>
            </div>
          </div>

          {/* 3 Big Result Numbers */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Wall U-Value (Uw)</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
                {uWall.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500">W/m²·K</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Total ETTV</div>
              <div
                className={`text-xl sm:text-2xl font-bold font-mono mt-1 ${
                  ettv <= 50 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {ettv.toFixed(1)}
              </div>
              <div className="text-[11px] text-slate-500">W/m²</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-xs text-slate-400">BCA Compliance</div>
              <div className="mt-1 flex items-center justify-center gap-1 font-semibold text-sm sm:text-base">
                {ettv <= 50 ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Pass (≤50)
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Non-Compliant
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">Cap: 50 W/m²</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-step working box for student tutorials */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Step-by-Step Calculation (BCA ETTV Formula)
        </div>
        <pre className="font-mono text-xs sm:text-sm text-slate-300 bg-slate-950 p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-800/80">
{`1. Opaque Wall Thermal Resistance (RT) & U-value (Uw):
   RT = Ro + (x_plaster / k) + (x_brick / k) + (x_insul / k) + Ri
   RT = 0.044 + (${(plasterThick/1000).toFixed(3)} / 0.80) + (${(brickThick/1000).toFixed(3)} / 0.81) + (${(insulThick/1000).toFixed(3)} / 0.035) + 0.12
   RT = ${rTotal.toFixed(3)} m²·K/W
   Uw = 1 / RT = ${uWall.toFixed(2)} W/m²·K

2. BCA Singapore ETTV Standard Formula:
   ETTV = 12(1 - WWR)·Uw + 3.4(WWR)·Uf + 211(WWR)·CF·SC
   ETTV = 12·(1 - ${(wwrFraction).toFixed(2)})·${uWall.toFixed(2)} + 3.4·(${(wwrFraction).toFixed(2)})·${uFenestration.toFixed(1)} + 211·(${(wwrFraction).toFixed(2)})·${cf.toFixed(2)}·${shgc.toFixed(2)}
   ETTV = ${opaqueConduction.toFixed(2)} [Wall Conduction] + ${glassConduction.toFixed(2)} [Glass Conduction] + ${solarRadiation.toFixed(2)} [Solar Gain]
   Total ETTV = ${ettv.toFixed(1)} W/m² (Statutory limit: ≤ 50 W/m²)`}
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
              Try This Challenge: West-Facing Solar Defence
            </div>
            <div className="text-xs text-slate-400">
              Select West façade, set WWR ≥ 30%, and adjust Rockwool insulation & Shading Coefficient (SC) to achieve ETTV ≤ 50.0 W/m².
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
