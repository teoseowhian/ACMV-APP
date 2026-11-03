import React, { useState } from 'react';
import { Building2, Sun, Thermometer, Wind, CheckCircle2, RotateCcw } from 'lucide-react';

export const EttvCoolingLoadCalculator: React.FC = () => {
  const [subTab, setSubTab] = useState<'ettv' | 'cooling-load'>('cooling-load');

  // ===================== ETTV STATE =====================
  const [wallLayers, setWallLayers] = useState([
    { name: 'Outside Granite Panel', thicknessMm: 15, kValue: 2.927 },
    { name: 'Lightweight Concrete', thicknessMm: 100, kValue: 0.346 },
    { name: 'Air Space (20mm)', thicknessMm: 20, isAirSpace: true, rValue: 0.148, kValue: 0.135 },
    { name: 'Gypsum Plasterboard', thicknessMm: 20, kValue: 0.170 },
  ]);
  const [roFilm] = useState<number>(0.044);
  const [riFilm] = useState<number>(0.120);

  // Compute U-value
  const wallRt =
    roFilm +
    riFilm +
    wallLayers.reduce((sum, layer) => {
      if (layer.isAirSpace) return sum + (layer.rValue || 0.148);
      return sum + (layer.thicknessMm / 1000) / layer.kValue;
    }, 0);
  const wallUw = 1 / wallRt;

  // Building Façades for ETTV
  const [facades, setFacades] = useState([
    { name: 'Façade A (North)', grossArea: 720, wwr: 0.30, uFenestration: 2.8, cf: 0.80, sc: 0.30 },
    { name: 'Façade B (West)', grossArea: 400, wwr: 0.35, uFenestration: 2.8, cf: 1.23, sc: 0.35 },
    { name: 'Façade C (South)', grossArea: 720, wwr: 0.25, uFenestration: 2.8, cf: 0.83, sc: 0.30 },
  ]);

  const calcFacadeEttv = (f: typeof facades[0]) => {
    // ETTV = 12*(1-WWR)*Uw + 3.4*WWR*Uf + 211*WWR*CF*SC
    const opaqueConduction = 12 * (1 - f.wwr) * wallUw;
    const glassConduction = 3.4 * f.wwr * f.uFenestration;
    const solarRadiation = 211 * f.wwr * f.cf * f.sc;
    return opaqueConduction + glassConduction + solarRadiation;
  };

  const totalGrossArea = facades.reduce((sum, f) => sum + f.grossArea, 0);
  const weightedBuildingEttv =
    facades.reduce((sum, f) => sum + f.grossArea * calcFacadeEttv(f), 0) / totalGrossArea;

  // ===================== COOLING LOAD STATE (Lesson 12 Worked Example) =====================
  const [roomLengthM, setRoomLengthM] = useState<number>(15);
  const [roomWidthM, setRoomWidthM] = useState<number>(10);
  const [roomHeightM, setRoomHeightM] = useState<number>(3);
  const [glazingAreaM2, setGlazingAreaM2] = useState<number>(20); // 10x2m
  const [shgf, setShgf] = useState<number>(755); // Table 4.1 Mar West
  const [scGlass, setScGlass] = useState<number>(0.55); // Bronze single
  const [clfGlass, setClfGlass] = useState<number>(0.87); // Table 4.3 16h West
  const [uGlass, setUGlass] = useState<number>(5.6);
  const [cltdGlass, setCltdGlass] = useState<number>(10.1); // Corrected CLTD
  const [occupants, setOccupants] = useState<number>(19); // 150/8
  const [lpdWattsM2, setLpdWattsM2] = useState<number>(12); // SS 530
  const [equipmentLoadWm2, setEquipmentLoadWm2] = useState<number>(5.38); // 50% laptop
  const [infiltrationAch, setInfiltrationAch] = useState<number>(0.3); // ACH

  const floorAreaM2 = roomLengthM * roomWidthM;
  const roomVolumeM3 = floorAreaM2 * roomHeightM;

  // Component Heat Gains (W)
  const qc1SolarGlass = glazingAreaM2 * shgf * scGlass * clfGlass; // 7,225 W
  const qc2TransGlass = glazingAreaM2 * uGlass * cltdGlass; // 1,131 W
  const qc3ExtWalls = 25 * 2.5 * 8.3 + 30 * 2.5 * 8.9; // West 25m2 @ 8.3 + South 30m2 @ 8.9 = 1,187 W
  const qc4Partition = (roomLengthM * roomHeightM) * 2.0 * (30 - 23); // 630 W
  const qc5OccupantsSensible = occupants * 85 * 1.0 * 1.0; // 1,615 W
  const qc6OccupantsLatent = occupants * 55 * 1.0 * 1.0; // 1,045 W
  const qc7Lighting = floorAreaM2 * lpdWattsM2 * 1.0 * 0.9; // 1,620 W
  const qc8Equipment = floorAreaM2 * equipmentLoadWm2; // 807 W

  // Infiltration: va = 0.852 m³/kg, go = 0.0202, gi = 0.0098
  const qc9InfiltrationSensible =
    (infiltrationAch * roomVolumeM3 / 3600) * (1 / 0.852) * 1012 * (33 - 23); // 445 W
  const qc10InfiltrationLatent =
    (infiltrationAch * roomVolumeM3 / 3600) * (1 / 0.852) * 2454000 * (0.0202 - 0.0098); // 1,123 W

  // Space Totals
  const spaceSensibleCoolingLoadW =
    qc1SolarGlass +
    qc2TransGlass +
    qc3ExtWalls +
    qc4Partition +
    qc5OccupantsSensible +
    qc7Lighting +
    qc8Equipment +
    qc9InfiltrationSensible;

  const spaceLatentCoolingLoadW = qc6OccupantsLatent + qc10InfiltrationLatent;
  const totalSpaceCoolingLoadW = spaceSensibleCoolingLoadW + spaceLatentCoolingLoadW;

  // External Loads (Duct, Fan, Ventilation)
  const ductHeatGainW = 0.02 * spaceSensibleCoolingLoadW; // 2%
  const fanHeatGainW = 0.03 * spaceSensibleCoolingLoadW; // 3%
  // Fresh air: 0.6 L/s/m2 = 0.09 m3/s
  const ventAirM3s = (0.6 * floorAreaM2) / 1000;
  const ventSensibleW = (ventAirM3s / 0.852) * 1012 * (33 - 23); // 1,069 W
  const ventLatentW = (ventAirM3s / 0.852) * 2454000 * (0.0202 - 0.0098); // 2,696 W

  const totalCoolingCoilLoadW =
    totalSpaceCoolingLoadW + ductHeatGainW + fanHeatGainW + ventSensibleW + ventLatentW;
  const totalCoolingCoilLoadRt = totalCoolingCoilLoadW / 3516.85;

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              Singapore SS 553 / BCA Green Mark Energy Suite
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              Envelope Thermal Performance (ETTV) & Cooling Load Estimator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Implements Lessons 10 & 12 formulas with full component-by-component mathematical verification.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setSubTab('cooling-load')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                subTab === 'cooling-load'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cooling Load Estimator
            </button>
            <button
              onClick={() => setSubTab('ettv')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                subTab === 'ettv'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Building ETTV & U-Value
            </button>
          </div>
        </div>

        {subTab === 'cooling-load' ? (
          /* COOLING LOAD ESTIMATION INTERFACE */
          <div className="mt-6 space-y-6">
            {/* Worked Example Context Banner */}
            <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs text-sky-950 dark:text-sky-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-bold text-sm block text-sky-900 dark:text-sky-100">
                  Lesson 12 Intermediate Floor Office Worked Example (15m × 10m × 3m)
                </span>
                <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                  Singapore March 16:00h conditions (Outdoor 33°C DB / 27°C WB; Indoor 23°C DB / 55% Saturation).
                  All 10 heat gain components are dynamically summed into Space Cooling Load and Total AHU Coil Load.
                </p>
              </div>
            </div>

            {/* Parameter Adjustment Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Room Length × Width</span>
                  <span className="font-mono font-semibold">{roomLengthM}m × {roomWidthM}m</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="30"
                  step="1"
                  value={roomLengthM}
                  onChange={(e) => setRoomLengthM(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400">Area: {floorAreaM2} m² · Vol: {roomVolumeM3} m³</div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Glazing Area (West Window)</span>
                  <span className="font-mono font-semibold">{glazingAreaM2} m²</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="1"
                  value={glazingAreaM2}
                  onChange={(e) => setGlazingAreaM2(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400">Bronze single glass (SC=0.55)</div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Occupancy Population</span>
                  <span className="font-mono font-semibold">{occupants} persons</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={occupants}
                  onChange={(e) => setOccupants(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400">{(floorAreaM2 / occupants).toFixed(1)} m²/person density</div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Lighting Power (SS 530)</span>
                  <span className="font-mono font-semibold">{lpdWattsM2} W/m²</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="18"
                  step="1"
                  value={lpdWattsM2}
                  onChange={(e) => setLpdWattsM2(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400">Fluorescent (DF = 0.90)</div>
              </div>
            </div>

            {/* Breakdown Table of All 10 Components */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3">Heat Gain Source Component</th>
                    <th className="py-2.5 px-3">Governing Equation</th>
                    <th className="py-2.5 px-3 text-right">Sensible (W)</th>
                    <th className="py-2.5 px-3 text-right">Latent (W)</th>
                    <th className="py-2.5 px-3 text-right">Total (W)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium">1. Solar radiation through window (Qc1)</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">Ag × SHGF × SC × CLF</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">{qc1SolarGlass.toFixed(0)}</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right font-bold">{qc1SolarGlass.toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium">2. Transmission through window (Qc2)</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">Ag × Ug × CLTD_corr</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">{qc2TransGlass.toFixed(0)}</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right font-bold">{qc2TransGlass.toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium">3. External Opaque Walls (Qc3)</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">Aw × Uw × CLTD (West + South)</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">{qc3ExtWalls.toFixed(0)}</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right font-bold">{qc3ExtWalls.toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium">4. Internal Partition (Qc4)</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">Aw × Uw × (tnr - ti)</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">{qc4Partition.toFixed(0)}</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right font-bold">{qc4Partition.toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium">5. Occupancy People Load (Qc5 + Qc6)</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">No. × SHG / LHG</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">{qc5OccupantsSensible.toFixed(0)}</td>
                    <td className="py-2 px-3 text-right text-amber-600 dark:text-amber-400 font-bold">{qc6OccupantsLatent.toFixed(0)}</td>
                    <td className="py-2 px-3 text-right font-bold">{(qc5OccupantsSensible + qc6OccupantsLatent).toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium">6. Lighting Fixtures (Qc7)</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">Area × LPD × CLF × DF</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">{qc7Lighting.toFixed(0)}</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right font-bold">{qc7Lighting.toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium">7. Equipment & Computers (Qc8)</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">Area × Load Factor</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">{qc8Equipment.toFixed(0)}</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right font-bold">{qc8Equipment.toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium">8. Infiltration Air (Qc9 + Qc10)</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">0.3 ACH × Volume</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">{qc9InfiltrationSensible.toFixed(0)}</td>
                    <td className="py-2 px-3 text-right text-amber-600 dark:text-amber-400 font-bold">{qc10InfiltrationLatent.toFixed(0)}</td>
                    <td className="py-2 px-3 text-right font-bold">{(qc9InfiltrationSensible + qc10InfiltrationLatent).toFixed(0)}</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold font-sans">
                    <td className="py-2 px-3" colSpan={2}>
                      TOTAL SPACE (ROOM) COOLING LOAD:
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-sky-600 dark:text-sky-400">
                      {spaceSensibleCoolingLoadW.toFixed(0)} W
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-amber-600 dark:text-amber-400">
                      {spaceLatentCoolingLoadW.toFixed(0)} W
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-900 dark:text-white">
                      {totalSpaceCoolingLoadW.toFixed(0)} W ({((totalSpaceCoolingLoadW) / floorAreaM2).toFixed(1)} W/m²)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium">9. Supply Duct & Fan Heat Gains</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">2% Duct + 3% Fan × SCL</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">{(ductHeatGainW + fanHeatGainW).toFixed(0)}</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right font-bold">{(ductHeatGainW + fanHeatGainW).toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium">10. SS 553 Outdoor Ventilation Air</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">0.6 L/s/m² (0.09 m³/s)</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">{ventSensibleW.toFixed(0)}</td>
                    <td className="py-2 px-3 text-right text-amber-600 dark:text-amber-400 font-bold">{ventLatentW.toFixed(0)}</td>
                    <td className="py-2 px-3 text-right font-bold">{(ventSensibleW + ventLatentW).toFixed(0)}</td>
                  </tr>
                  <tr className="bg-sky-50 dark:bg-sky-950/40 font-bold font-sans text-sky-900 dark:text-sky-200">
                    <td className="py-3 px-3 text-sm" colSpan={2}>
                      GRAND TOTAL COOLING COIL LOAD (AHU):
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm">
                      {(spaceSensibleCoolingLoadW + ductHeatGainW + fanHeatGainW + ventSensibleW).toFixed(0)} W
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm">
                      {(spaceLatentCoolingLoadW + ventLatentW).toFixed(0)} W
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm font-extrabold text-sky-600 dark:text-sky-400">
                      {totalCoolingCoilLoadW.toFixed(0)} W ({totalCoolingCoilLoadRt.toFixed(2)} RT)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ETTV & U-VALUE INTERFACE */
          <div className="mt-6 space-y-6">
            {/* Multi-layer Wall U-Value Calculator */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Multi-Layer Wall Thermal Resistance (RT) & U-Value Calculator
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    RT = Ro + Σ(x / k) + Ra + Ri · Uw = 1 / RT (Lesson 10 Example)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-mono">Wall U-Value:</span>
                  <div className="text-xl font-bold font-mono text-sky-600 dark:text-sky-400">
                    {wallUw.toFixed(2)} W/m²K
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">RT = {wallRt.toFixed(3)} m²K/W</span>
                </div>
              </div>

              {/* Layer list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 font-sans">Outside Air Film (Ro)</div>
                  <div className="text-slate-500 mt-1">Ro = {roFilm} m²K/W</div>
                </div>
                {wallLayers.map((layer, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"
                  >
                    <div className="font-semibold text-slate-700 dark:text-slate-300 font-sans">{layer.name}</div>
                    <div className="text-slate-500 mt-1">
                      {layer.isAirSpace
                        ? `Ra = ${layer.rValue} m²K/W`
                        : `${layer.thicknessMm}mm (k=${layer.kValue})`}
                    </div>
                  </div>
                ))}
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 font-sans">Inside Air Film (Ri)</div>
                  <div className="text-slate-500 mt-1">Ri = {riFilm} m²K/W (High Emissivity)</div>
                </div>
              </div>
            </div>

            {/* Whole Building ETTV Calculator Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Building Façade ETTV Summary (Singapore Code Benchmark: ≤ 50 W/m²)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                      <th className="py-2.5 px-3">Façade Orientation</th>
                      <th className="py-2.5 px-3">Gross Area (m²)</th>
                      <th className="py-2.5 px-3">WWR</th>
                      <th className="py-2.5 px-3">Glass Uf</th>
                      <th className="py-2.5 px-3">Solar CF</th>
                      <th className="py-2.5 px-3">Shading SC</th>
                      <th className="py-2.5 px-3 text-right">Façade ETTV (W/m²)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {facades.map((f, idx) => {
                      const ettv = calcFacadeEttv(f);
                      return (
                        <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                            {f.name}
                          </td>
                          <td className="py-2.5 px-3">{f.grossArea} m²</td>
                          <td className="py-2.5 px-3">{(f.wwr * 100).toFixed(0)}%</td>
                          <td className="py-2.5 px-3">{f.uFenestration} W/m²K</td>
                          <td className="py-2.5 px-3">{f.cf}</td>
                          <td className="py-2.5 px-3">{f.sc}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-sky-600 dark:text-sky-400">
                            {ettv.toFixed(2)} W/m²
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-sky-50 dark:bg-sky-950/40 font-bold font-sans">
                      <td className="py-3 px-3" colSpan={3}>
                        WHOLE BUILDING WEIGHTED ETTV:
                      </td>
                      <td className="py-3 px-3 text-right font-mono" colSpan={4}>
                        <span className="text-base text-emerald-600 dark:text-emerald-400">
                          {weightedBuildingEttv.toFixed(2)} W/m²
                        </span>{' '}
                        <span className="text-xs text-slate-500 font-sans font-normal ml-2">
                          (Compliant with Singapore Code ≤ 50 W/m²)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
