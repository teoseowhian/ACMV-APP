import React, { useState, useMemo } from 'react';
import { Droplets, Wind, Thermometer, RotateCcw } from 'lucide-react';

// Standard atmospheric pressure at sea level in kPa
const P_ATM = 101.325;

// Tetens / Magnus approximation for saturation vapor pressure in kPa
function getSatVaporPressure(tempC: number): number {
  return 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}

// Humidity ratio w in kg water / kg dry air
function getHumidityRatio(tempC: number, rhPercent: number): number {
  const pWs = getSatVaporPressure(tempC);
  const pW = (rhPercent / 100) * pWs;
  return (0.62198 * pW) / (P_ATM - pW);
}

// Specific enthalpy in kJ/kg dry air
function getEnthalpy(tempC: number, wKgPerKg: number): number {
  return 1.006 * tempC + wKgPerKg * (2501 + 1.86 * tempC);
}

// Dew point temperature in °C
function getDewPoint(tempC: number, rhPercent: number): number {
  const pWs = getSatVaporPressure(tempC);
  const pW = (rhPercent / 100) * pWs;
  const alpha = Math.log(pW / 0.61078);
  return (237.3 * alpha) / (17.27 - alpha);
}

export const PsychrometricTool: React.FC = () => {
  // Outdoor Air (O) inputs
  const [oaTemp, setOaTemp] = useState<number>(32.5); // °C
  const [oaRh, setOaRh] = useState<number>(80); // %

  // Return Air (R) inputs
  const [raTemp, setRaTemp] = useState<number>(24.0); // °C
  const [raRh, setRaRh] = useState<number>(55); // %

  // Fresh Air ratio (%)
  const [freshAirRatio, setFreshAirRatio] = useState<number>(15); // %

  // Total AHU Airflow in m³/s
  const [airflowM3s, setAirflowM3s] = useState<number>(5.0); // m³/s (approx 10,600 CFM)

  // Target Supply Air Temp leaving cooling coil
  const [supplyTemp, setSupplyTemp] = useState<number>(13.5); // °C
  const [coilBypassFactor, setCoilBypassFactor] = useState<number>(0.10); // BF

  // Calculations for Point O (Outdoor)
  const oaW = useMemo(() => getHumidityRatio(oaTemp, oaRh), [oaTemp, oaRh]);
  const oaH = useMemo(() => getEnthalpy(oaTemp, oaW), [oaTemp, oaW]);
  const oaDp = useMemo(() => getDewPoint(oaTemp, oaRh), [oaTemp, oaRh]);

  // Calculations for Point R (Return)
  const raW = useMemo(() => getHumidityRatio(raTemp, raRh), [raTemp, raRh]);
  const raH = useMemo(() => getEnthalpy(raTemp, raW), [raTemp, raW]);
  const raDp = useMemo(() => getDewPoint(raTemp, raRh), [raTemp, raRh]);

  // Calculations for Point M (Mixed Air Plenum)
  const fOa = freshAirRatio / 100;
  const fRa = 1 - fOa;
  const maTemp = useMemo(() => oaTemp * fOa + raTemp * fRa, [oaTemp, raTemp, fOa, fRa]);
  const maW = useMemo(() => oaW * fOa + raW * fRa, [oaW, raW, fOa, fRa]);
  const maH = useMemo(() => getEnthalpy(maTemp, maW), [maTemp, maW]);

  // Mixed Air RH & Dew Point
  const maPws = getSatVaporPressure(maTemp);
  const maPw = (maW * P_ATM) / (0.62198 + maW);
  const maRh = Math.min(100, (maPw / maPws) * 100);
  const maDp = useMemo(() => getDewPoint(maTemp, maRh), [maTemp, maRh]);

  // Coil Process (M -> S)
  // Apparatus Dew Point (ADP) calculation
  const coilAdp = useMemo(() => {
    // T_supply = T_adp + BF * (T_ma - T_adp) => T_adp = (T_supply - BF * T_ma) / (1 - BF)
    const adp = (supplyTemp - coilBypassFactor * maTemp) / (1 - coilBypassFactor);
    return Math.max(5.0, Math.min(12.0, adp));
  }, [supplyTemp, coilBypassFactor, maTemp]);

  const adpW = useMemo(() => getHumidityRatio(coilAdp, 100), [coilAdp]);
  const supplyW = useMemo(() => adpW + coilBypassFactor * (maW - adpW), [adpW, coilBypassFactor, maW]);
  const supplyH = useMemo(() => getEnthalpy(supplyTemp, supplyW), [supplyTemp, supplyW]);

  const supplyPws = getSatVaporPressure(supplyTemp);
  const supplyPw = (supplyW * P_ATM) / (0.62198 + supplyW);
  const supplyRh = Math.min(100, Math.max(80, (supplyPw / supplyPws) * 100));

  // Thermal Capacity Calculations
  // Air mass flow m_dot = ρ * Q (where ρ ≈ 1.2 kg/m³)
  const airDensity = 1.20;
  const massFlowKgS = airflowM3s * airDensity;

  // Sensible cooling: Qs = massFlow * Cp * (T_ma - T_supply)
  const qSensibleKw = massFlowKgS * 1.006 * Math.max(0, maTemp - supplyTemp);

  // Latent cooling: Ql = massFlow * 2450 * (w_ma - w_supply)
  const qLatentKw = massFlowKgS * 2450 * Math.max(0, maW - supplyW);

  // Total cooling load
  const qTotalKw = qSensibleKw + qLatentKw;
  const qTotalRt = qTotalKw / 3.51685;

  // Sensible Heat Ratio
  const shr = qTotalKw > 0 ? qSensibleKw / qTotalKw : 1.0;

  // Moisture extraction rate in Liters / hour (or kg/hr)
  const moistureExtractLph = massFlowKgS * Math.max(0, maW - supplyW) * 3600;

  // Coordinate mapping for SVG Psychrometric Chart
  // X: Temp (0°C to 45°C) mapped to [60, 560]
  // Y: Humidity ratio w (0 to 30 g/kg) mapped to [320, 40]
  const mapCoords = (t: number, wKg: number) => {
    const wG = wKg * 1000;
    const x = 60 + ((t - 0) / 45) * 500;
    const y = 320 - ((wG - 0) / 30) * 280;
    return { x: Math.max(60, Math.min(560, x)), y: Math.max(40, Math.min(320, y)) };
  };

  // Generate saturation curve points (100% RH)
  const satCurvePoints = useMemo(() => {
    const points: string[] = [];
    for (let t = 0; t <= 35; t += 1) {
      const w = getHumidityRatio(t, 100);
      const { x, y } = mapCoords(t, w);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
  }, []);

  // Generate 50% RH curve points
  const rh50CurvePoints = useMemo(() => {
    const points: string[] = [];
    for (let t = 10; t <= 45; t += 1) {
      const w = getHumidityRatio(t, 50);
      const { x, y } = mapCoords(t, w);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
  }, []);

  const ptO = mapCoords(oaTemp, oaW);
  const ptR = mapCoords(raTemp, raW);
  const ptM = mapCoords(maTemp, maW);
  const ptS = mapCoords(supplyTemp, supplyW);
  const ptAdp = mapCoords(coilAdp, adpW);

  const handleReset = () => {
    setOaTemp(32.5);
    setOaRh(80);
    setRaTemp(24.0);
    setRaRh(55);
    setFreshAirRatio(15);
    setAirflowM3s(5.0);
    setSupplyTemp(13.5);
    setCoilBypassFactor(0.10);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Deck */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Interactive Psychrometric Air Mixing & Coil Simulator
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Simulate outdoor ventilation mixing, sensible and latent cooling coil loads, and moisture condensation.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Psychrometrics
          </button>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
          {/* Outdoor Fresh Air (O) */}
          <div className="space-y-2 p-3.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
            <div className="text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span>Outdoor Air (Point O)</span>
              <span className="font-mono text-[11px]">{oaTemp.toFixed(1)}°C / {oaRh}% RH</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Dry-Bulb Temp</span>
                <span className="font-mono">{oaTemp.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="26.0"
                max="38.0"
                step="0.5"
                value={oaTemp}
                onChange={(e) => setOaTemp(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Relative Humidity</span>
                <span className="font-mono">{oaRh}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={oaRh}
                onChange={(e) => setOaRh(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Return Air (R) */}
          <div className="space-y-2 p-3.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40">
            <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
              <span>Return Air (Point R)</span>
              <span className="font-mono text-[11px]">{raTemp.toFixed(1)}°C / {raRh}% RH</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Room Temperature</span>
                <span className="font-mono">{raTemp.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="20.0"
                max="26.0"
                step="0.5"
                value={raTemp}
                onChange={(e) => setRaTemp(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Room Humidity</span>
                <span className="font-mono">{raRh}%</span>
              </div>
              <input
                type="range"
                min="45"
                max="70"
                step="5"
                value={raRh}
                onChange={(e) => setRaRh(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Mixing Ratio & Airflow */}
          <div className="space-y-2 p-3.5 rounded-lg bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-800/40">
            <div className="text-xs font-semibold text-sky-900 dark:text-sky-200 flex items-center justify-between">
              <span>Mixing & Airflow</span>
              <span className="font-mono text-[11px]">{freshAirRatio}% OA</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Fresh Outdoor Air %</span>
                <span className="font-mono">{freshAirRatio}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={freshAirRatio}
                onChange={(e) => setFreshAirRatio(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>AHU Airflow (m³/s)</span>
                <span className="font-mono">{airflowM3s.toFixed(1)} m³/s</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.5"
                value={airflowM3s}
                onChange={(e) => setAirflowM3s(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Coil Leaving Supply Setpoint */}
          <div className="space-y-2 p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
            <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
              <span>Coil Supply Target (Point S)</span>
              <span className="font-mono text-[11px]">{supplyTemp.toFixed(1)}°C</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Supply Air Temp (T_s)</span>
                <span className="font-mono">{supplyTemp.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="11.0"
                max="16.0"
                step="0.5"
                value={supplyTemp}
                onChange={(e) => setSupplyTemp(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Coil Bypass Factor (BF)</span>
                <span className="font-mono">{coilBypassFactor.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.25"
                step="0.01"
                value={coilBypassFactor}
                onChange={(e) => setCoilBypassFactor(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Psychrometric Chart Visualizer */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Interactive Psychrometric State Diagram
            </span>
            <span className="text-xs text-slate-500">· Atmospheric: 101.3 kPa (Sea Level)</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Point O (Outdoor)
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> Point R (Return)
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span> Point M (Mixed)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Point S (Supply)
            </span>
          </div>
        </div>

        {/* SVG Psychrometric Chart */}
        <div className="relative w-full overflow-x-auto">
          <svg viewBox="0 0 600 360" className="w-full min-w-[550px] h-auto select-none font-mono">
            {/* Chart Area Background */}
            <rect x="50" y="20" width="530" height="310" fill="#0b1120" stroke="#1e293b" strokeWidth="1" rx="4" />

            {/* Grid Lines: Dry Bulb Temperature Lines (every 5°C) */}
            {[5, 10, 15, 20, 25, 30, 35, 40].map((t) => {
              const { x } = mapCoords(t, 0);
              return (
                <g key={`t-${t}`}>
                  <line x1={x} y1="320" x2={x} y2="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                  <text x={x} y="338" textAnchor="middle" fill="#64748b" fontSize="9">
                    {t}°
                  </text>
                </g>
              );
            })}

            {/* Grid Lines: Humidity Ratio Lines (every 5 g/kg) */}
            {[5, 10, 15, 20, 25].map((w) => {
              const { y } = mapCoords(0, w / 1000);
              return (
                <g key={`w-${w}`}>
                  <line x1="60" y1={y} x2="560" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="568" y={y + 3} fill="#64748b" fontSize="9">
                    {w}
                  </text>
                </g>
              );
            })}

            {/* 100% Saturation Curve */}
            <polyline
              points={satCurvePoints}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
            <text x="145" y="65" fill="#38bdf8" fontSize="9" fontWeight="bold">
              100% Saturation Curve (RH = 100%)
            </text>

            {/* 50% Relative Humidity Curve */}
            <polyline
              points={rh50CurvePoints}
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text x="360" y="210" fill="#64748b" fontSize="8">
              50% RH
            </text>

            {/* Adiabatic Mixing Line (Point O to Point R) */}
            <line
              x1={ptO.x}
              y1={ptO.y}
              x2={ptR.x}
              y2={ptR.y}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="3 3"
            />

            {/* Coil Process Line (Point M to Point S, heading towards ADP) */}
            <line
              x1={ptM.x}
              y1={ptM.y}
              x2={ptAdp.x}
              y2={ptAdp.y}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            <line
              x1={ptM.x}
              y1={ptM.y}
              x2={ptS.x}
              y2={ptS.y}
              stroke="#10b981"
              strokeWidth="3"
            />

            {/* State Points */}
            {/* Point O */}
            <circle cx={ptO.x} cy={ptO.y} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            <text x={ptO.x + 8} y={ptO.y - 4} fill="#f59e0b" fontSize="10" fontWeight="bold">
              O (Outdoor: {oaTemp}°C, {(oaW * 1000).toFixed(1)}g)
            </text>

            {/* Point R */}
            <circle cx={ptR.x} cy={ptR.y} r="6" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
            <text x={ptR.x - 12} y={ptR.y + 16} textAnchor="end" fill="#a5b4fc" fontSize="10" fontWeight="bold">
              R (Return: {raTemp}°C, {(raW * 1000).toFixed(1)}g)
            </text>

            {/* Point M */}
            <circle cx={ptM.x} cy={ptM.y} r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            <text x={ptM.x + 10} y={ptM.y + 4} fill="#38bdf8" fontSize="10" fontWeight="bold">
              M (Mixed Air: {maTemp.toFixed(1)}°C, {(maW * 1000).toFixed(1)}g)
            </text>

            {/* Point S */}
            <circle cx={ptS.x} cy={ptS.y} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            <text x={ptS.x + 10} y={ptS.y + 12} fill="#34d399" fontSize="10" fontWeight="bold">
              S (Supply Air: {supplyTemp.toFixed(1)}°C)
            </text>

            {/* Point ADP */}
            <circle cx={ptAdp.x} cy={ptAdp.y} r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
            <text x={ptAdp.x - 8} y={ptAdp.y - 6} textAnchor="end" fill="#06b6d4" fontSize="8">
              ADP ({coilAdp.toFixed(1)}°C)
            </text>

            {/* Axis Labels */}
            <text x="310" y="355" textAnchor="middle" fill="#94a3b8" fontSize="10">
              Dry-Bulb Temperature T_db (°C)
            </text>
            <text x="585" y="180" textAnchor="middle" fill="#94a3b8" fontSize="10" transform="rotate(90 585 180)">
              Humidity Ratio w (g moisture / kg dry air)
            </text>
          </svg>
        </div>
      </div>

      {/* Thermodynamic Calculation Results Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Coil Cooling Load */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total AHU Coil Capacity</span>
            <span className="font-mono">kW · RT</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {qTotalKw.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">kW</span>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              ({qTotalRt.toFixed(1)} RT)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Sensible: {qSensibleKw.toFixed(1)} kW</span>
            <span>Latent: {qLatentKw.toFixed(1)} kW</span>
          </div>
        </div>

        {/* Sensible Heat Ratio (SHR) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Sensible Heat Ratio (SHR)</span>
            <span className="font-mono">Fraction</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {shr.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              ({(shr * 100).toFixed(0)}% Sensible)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Latent fraction:</span>
            <span className="font-mono font-medium text-amber-600 dark:text-amber-400">
              {((1 - shr) * 100).toFixed(0)}% (Moisture extraction)
            </span>
          </div>
        </div>

        {/* Moisture Removal Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Dehumidification Extraction</span>
            <span className="font-mono">L/hr</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {moistureExtractLph.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">Liters/hr</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Condensate drainage:</span>
            <span className="font-mono">{(moistureExtractLph / 60).toFixed(2)} L/min</span>
          </div>
        </div>

        {/* State Points Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            State Points Enthalpy & Humidity
          </div>
          <div className="space-y-1.5 text-xs font-mono my-2">
            <div className="flex justify-between items-center text-amber-600 dark:text-amber-400">
              <span>Outdoor (O)</span>
              <span className="tabular-nums font-semibold">{oaH.toFixed(1)} kJ/kg · {(oaW * 1000).toFixed(1)} g/kg</span>
            </div>
            <div className="flex justify-between items-center text-indigo-600 dark:text-indigo-400">
              <span>Return (R)</span>
              <span className="tabular-nums font-semibold">{raH.toFixed(1)} kJ/kg · {(raW * 1000).toFixed(1)} g/kg</span>
            </div>
            <div className="flex justify-between items-center text-sky-600 dark:text-sky-400">
              <span>Mixed (M)</span>
              <span className="tabular-nums font-semibold">{maH.toFixed(1)} kJ/kg · {(maW * 1000).toFixed(1)} g/kg</span>
            </div>
            <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
              <span>Supply (S)</span>
              <span className="tabular-nums font-semibold">{supplyH.toFixed(1)} kJ/kg · {(supplyW * 1000).toFixed(1)} g/kg</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            ASHRAE Psychrometrics Chart No. 1 formulation.
          </div>
        </div>
      </div>
    </div>
  );
};
