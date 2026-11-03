import React, { useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

export const SimPipeSizing: React.FC = () => {
  const [flowRateLps, setFlowRateLps] = useState<number>(10.0); // L/s (from Tutorial 4)
  const [indexRunLengthM, setIndexRunLengthM] = useState<number>(35.0); // meters
  const [fittingsCount, setFittingsCount] = useState<number>(6); // e.g. 4 elbows, 1 check valve, 1 gate valve

  // Discrete Schedule 40 steel pipe diameter lookup based on Flow Rate (L/s)
  // Sized to maintain pressure drop within 100 to 400 Pa/m (Lesson 6 slide 31)
  const selectedPipe = useMemo(() => {
    if (flowRateLps <= 2.5) {
      return { diaMm: 50, velocity: 1.15, frictionPaM: 280, label: '50 mm (2")' };
    }
    if (flowRateLps <= 4.5) {
      return { diaMm: 65, velocity: 1.25, frictionPaM: 240, label: '65 mm (2.5")' };
    }
    if (flowRateLps <= 7.5) {
      return { diaMm: 80, velocity: 1.40, frictionPaM: 230, label: '80 mm (3")' };
    }
    if (flowRateLps <= 14.0) {
      return { diaMm: 100, velocity: 1.30, frictionPaM: 150, label: '100 mm (4")' };
    }
    if (flowRateLps <= 22.0) {
      return { diaMm: 125, velocity: 1.55, frictionPaM: 180, label: '125 mm (5")' };
    }
    return { diaMm: 150, velocity: 1.70, frictionPaM: 200, label: '150 mm (6")' };
  }, [flowRateLps]);

  // Average Le/D for common welded elbows and valves is ≈ 45
  const avgLeD = 45;
  const dMeters = selectedPipe.diaMm / 1000;
  const totalFittingLeM = fittingsCount * avgLeD * dMeters;
  const totalEquivalentLengthM = indexRunLengthM + totalFittingLeM;

  // Pressure loss: P = Total Le * (Pa/m)
  const pipeFrictionLossPa = totalEquivalentLengthM * selectedPipe.frictionPaM;
  // Equipment drop (e.g. cooling coil or chiller) ≈ 40 kPa
  const equipmentLossPa = 40000;
  const subtotalPa = pipeFrictionLossPa + equipmentLossPa;
  // 10% safety factor (Tutorial 4)
  const safetyFactorPa = subtotalPa * 0.10;
  const grandTotalLossPa = subtotalPa + safetyFactorPa;

  // Pump head hf = P / (rho * g) where rho = 1000 kg/m³, g = 9.81 m/s²
  const frictionalHeadM = grandTotalLossPa / (1000 * 9.81);

  // Velocity criteria check (1.0 to 2.0 m/s for 50-100mm per Lesson 6 slide 31)
  const isVelocityCompliant = selectedPipe.velocity >= 0.6 && selectedPipe.velocity <= 2.0;

  // Challenge: Size a pipe for 10 L/s that keeps friction loss between 100 and 200 Pa/m
  const isChallengeMet = flowRateLps === 10.0 && selectedPipe.frictionPaM >= 100 && selectedPipe.frictionPaM <= 200;

  const handleReset = () => {
    setFlowRateLps(10.0);
    setIndexRunLengthM(35.0);
    setFittingsCount(6);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Controls & Challenge (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Piping Index Run Inputs
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
                <span className="text-slate-300">Water Flow Rate (Q)</span>
                <span className="font-mono font-bold text-sky-400">{flowRateLps.toFixed(1)} L/s</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="25.0"
                step="0.5"
                value={flowRateLps}
                onChange={(e) => setFlowRateLps(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>2 L/s (Branch)</span>
                <span>10 L/s (Tutorial 4)</span>
                <span>25 L/s (Main header)</span>
              </div>
            </div>

            {/* Slider 2: Straight Pipe Length */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Index Run Straight Length</span>
                <span className="font-mono font-bold text-amber-400">{indexRunLengthM} m</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={indexRunLengthM}
                onChange={(e) => setIndexRunLengthM(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Slider 3: Equivalent Fittings Count */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Fittings Count (Elbows/Valves)</span>
                <span className="font-mono font-bold text-cyan-400">{fittingsCount} units</span>
              </div>
              <input
                type="range"
                min="2"
                max="16"
                step="1"
                value={fittingsCount}
                onChange={(e) => setFittingsCount(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
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
              <span>Pipe Sizing Challenge:</span>
            </div>
            <p className="text-xs leading-relaxed">
              Size a pipe for <strong>10.0 L/s</strong> that keeps friction loss between <strong>100 and 200 Pa/m</strong> (matching Tutorial 4 Section 1).
            </p>
            <div className="mt-2 text-[11px] font-mono">
              Status:{' '}
              {isChallengeMet ? (
                <strong className="text-emerald-400">
                  PASSED! Ø {selectedPipe.diaMm} mm ({selectedPipe.frictionPaM} Pa/m @ {selectedPipe.velocity} m/s)
                </strong>
              ) : (
                <span className="text-amber-400">Set Flow = 10.0 L/s</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Big Results & Gauge (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Pipe Diameter</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400 mt-1 tabular-nums">
                Ø {selectedPipe.diaMm} <span className="text-xs font-normal font-sans">mm</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Sched 40 Steel</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Water Velocity</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                {selectedPipe.velocity.toFixed(2)} <span className="text-xs font-normal font-sans">m/s</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {isVelocityCompliant ? '1.0–2.0 m/s (Pass)' : 'Exceeds limit'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Pressure Drop</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {selectedPipe.frictionPaM} <span className="text-xs font-normal font-sans">Pa/m</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Target: 100–400</span>
            </div>
          </div>

          {/* Pump Head Card */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider">
                Index Run Pump Head Calculation:
              </span>
              <span className="font-mono text-sky-400">Total Le: {totalEquivalentLengthM.toFixed(1)} m</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 font-sans block">Calculated Frictional Pump Head:</span>
                <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                  {frictionalHeadM.toFixed(1)} <span className="text-sm font-normal text-slate-400">meters</span>
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400 text-right">
                Grand Total = {(grandTotalLossPa / 1000).toFixed(1)} kPa (with 10% SF)
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (selectedPipe.frictionPaM / 400) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>100 Pa/m (Min)</span>
              <span>250 Pa/m (Optimum)</span>
              <span>400 Pa/m (Max)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monospace Step-by-Step Working */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-sans">
          Step-by-Step Working (Tutorial AMVS 4 Equivalent Length Method):
        </span>
        <div className="p-4 bg-slate-950 rounded-lg font-mono text-xs text-slate-300 space-y-1.5 leading-relaxed overflow-x-auto">
          <div>1. Flow rate Q = {flowRateLps.toFixed(1)} L/s through Schedule 40 commercial steel pipe.</div>
          <div>2. Sized diameter = Ø {selectedPipe.diaMm} mm ({selectedPipe.label}) from friction loss chart.</div>
          <div>3. Water velocity V = {selectedPipe.velocity} m/s (Compliant with 1.0 - 2.0 m/s range for 50-100mm pipe).</div>
          <div>4. Pressure loss rate = {selectedPipe.frictionPaM} Pa/m (within acceptable 100 - 400 Pa/m design band).</div>
          <div>5. Equivalent length of {fittingsCount} fittings: Le = {fittingsCount} × {avgLeD} × {dMeters.toFixed(3)}m = {totalFittingLeM.toFixed(2)} m.</div>
          <div>6. Total Equivalent Length: Le_total = {indexRunLengthM}m pipe + {totalFittingLeM.toFixed(2)}m fittings = {totalEquivalentLengthM.toFixed(2)} m.</div>
          <div className="font-bold text-sky-400">
            7. Pump Head hf = Total P / (ρ × g) = {grandTotalLossPa.toFixed(0)} Pa / (1000 × 9.81) = {frictionalHeadM.toFixed(2)} meters of water.
          </div>
        </div>
      </div>
    </div>
  );
};
