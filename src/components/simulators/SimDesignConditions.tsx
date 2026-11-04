import React, { useState } from 'react';
import { Thermometer, Droplets, Wind, ShieldCheck, AlertTriangle, CheckCircle2, Building, Users } from 'lucide-react';

interface SpaceTypePreset {
  id: string;
  name: string;
  ratePerPerson: number; // L/s per person
  ratePerArea: number;   // L/s per m²
  defaultDensity: number; // m² per person
}

const SPACE_PRESETS: SpaceTypePreset[] = [
  { id: 'office', name: 'General Office / Workstations', ratePerPerson: 5.5, ratePerArea: 0.6, defaultDensity: 10 },
  { id: 'classroom', name: 'Classrooms / Lecture Rooms', ratePerPerson: 8.0, ratePerArea: 1.2, defaultDensity: 2.5 },
  { id: 'auditorium', name: 'Auditoriums / Theatres', ratePerPerson: 6.0, ratePerArea: 2.0, defaultDensity: 1.5 },
  { id: 'restaurant', name: 'Restaurants / Dining Halls', ratePerPerson: 10.0, ratePerArea: 2.5, defaultDensity: 2.0 },
  { id: 'meeting', name: 'Conference / Meeting Rooms', ratePerPerson: 7.0, ratePerArea: 1.0, defaultDensity: 3.0 },
];

export const SimDesignConditions: React.FC = () => {
  // Indoor condition controls
  const [tIndoor, setTIndoor] = useState<number>(24.0); // °C
  const [rhIndoor, setRhIndoor] = useState<number>(55);  // %
  const [airVelocity, setAirVelocity] = useState<number>(0.20); // m/s
  const [roomPressure, setRoomPressure] = useState<number>(15); // Pa

  // Fresh air / ventilation calculator state
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('office');
  const [floorArea, setFloorArea] = useState<number>(250); // m²
  const [occupantCount, setOccupantCount] = useState<number>(25);

  const selectedPreset = SPACE_PRESETS.find((p) => p.id === selectedSpaceId) || SPACE_PRESETS[0];

  // Singapore Outdoor Design Benchmark (SS 553 Clause 5.2 / Table 1)
  const tOutdoor = 33.5; // °C Dry Bulb
  const twbOutdoor = 27.5; // °C Wet Bulb
  const rhOutdoor = 65; // % approx coincident
  const hOutdoor = 86.5; // kJ/kg coincident outdoor air enthalpy
  const wOutdoor = 0.0210; // kg/kg moisture content

  // Indoor Psychrometric approximations
  // Saturation vapor pressure (kPa)
  const pwsIndoor = 0.61078 * Math.exp((17.27 * tIndoor) / (tIndoor + 237.3));
  const pwIndoor = (rhIndoor / 100) * pwsIndoor;
  const wIndoor = (0.622 * pwIndoor) / (101.325 - pwIndoor); // kg moisture / kg dry air
  const hIndoor = 1.006 * tIndoor + wIndoor * (2501 + 1.86 * tIndoor); // kJ/kg dry air

  // Dew point approximation
  const alpha = Math.log(pwIndoor / 0.61078);
  const dpIndoor = (237.3 * alpha) / (17.27 - alpha);

  // Fresh air calculations (SS 553 Table 4.10)
  const freshAirByPeople = occupantCount * selectedPreset.ratePerPerson; // L/s
  const freshAirByArea = floorArea * selectedPreset.ratePerArea; // L/s
  const freshAirRequiredLps = Math.max(freshAirByPeople, freshAirByArea); // Governing L/s
  const freshAirRequiredM3h = freshAirRequiredLps * 3.6; // m³/h

  // Ventilation Cooling Loads:
  // Sensible: Qs_vent = 1.2 * V(L/s) * (To - Ti) / 1000 kW
  const qSensibleVent = (1.2 * freshAirRequiredLps * (tOutdoor - tIndoor)) / 1000;
  // Latent: Ql_vent = 1.2 * 2450 * V(L/s) * (wo - wi) / 1000 kW (approx 3000 * V * Δw)
  const qLatentVent = (1.2 * 2450 * freshAirRequiredLps * Math.max(0, wOutdoor - wIndoor)) / 1000;
  const qTotalVent = qSensibleVent + qLatentVent;

  // Compliance checks according to Singapore Standard SS 553:2016
  const isTempCompliant = tIndoor >= 23.0 && tIndoor <= 25.0;
  const isRhCompliant = rhIndoor <= 65;
  const isVelocityCompliant = airVelocity <= 0.30 && airVelocity >= 0.08;
  const isPressureCompliant = roomPressure >= 10 && roomPressure <= 25;

  const allCompliant = isTempCompliant && isRhCompliant && isVelocityCompliant && isPressureCompliant;

  return (
    <div className="space-y-6">
      {/* Overview & Standard Reference Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
            <span>SS 553:2016</span>
            <span>•</span>
            <span>Singapore Indoor & Outdoor Design Conditions</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Statutory Thermal Comfort & Ventilation Simulator
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Verify Singapore SS 553 indoor comfort setpoints (23–25°C, RH ≤ 65%, air velocity ≤ 0.30 m/s), positive pressurization (+10 to +25 Pa), and compute outdoor fresh air requirements and coil ventilation load.
          </p>
        </div>

        <div className="shrink-0">
          <div
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${
              allCompliant
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/80 shadow-md shadow-emerald-950/40'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/80 shadow-md shadow-amber-950/40'
            }`}
          >
            {allCompliant ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SS 553 FULLY COMPLIANT</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>OUT OF SS 553 SPECIFICATION</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Controls & Compliance), Right Column (Singapore Outdoor Benchmarks & Ventilation) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Indoor Conditions Interactive Controls */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-rose-400" /> Indoor Room Air Parameters
            </h3>
            <span className="text-xs font-mono text-slate-400">SS 553 Clause 5.1</span>
          </div>

          {/* 1. Dry Bulb Temperature */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Indoor Dry-Bulb Temperature (T_db)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-sm">{tIndoor.toFixed(1)} °C</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isTempCompliant
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {isTempCompliant ? 'Compliant (23–25°C)' : 'Non-compliant'}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="18.0"
              max="30.0"
              step="0.5"
              value={tIndoor}
              onChange={(e) => setTIndoor(parseFloat(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>18.0°C (Overcooled)</span>
              <span className="text-emerald-400 font-bold">23.0°C – 25.0°C (SS 553 Target)</span>
              <span>30.0°C (Warm)</span>
            </div>
          </div>

          {/* 2. Relative Humidity */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Relative Humidity (RH)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-sm">{rhIndoor} %</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isRhCompliant
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {isRhCompliant ? 'Compliant (≤ 65%)' : 'High Mold Risk (>65%)'}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="30"
              max="85"
              step="1"
              value={rhIndoor}
              onChange={(e) => setRhIndoor(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>30% (Dry)</span>
              <span className="text-emerald-400 font-bold">50% – 65% (SS 553 Max 65%)</span>
              <span>85% (Condensation risk)</span>
            </div>
          </div>

          {/* 3. Air Velocity */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Occupied Zone Air Velocity</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-sm">{airVelocity.toFixed(2)} m/s</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isVelocityCompliant
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {isVelocityCompliant ? 'Compliant (≤ 0.30 m/s)' : airVelocity < 0.08 ? 'Stagnant (<0.08)' : 'Draughty (>0.30)'}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.01"
              value={airVelocity}
              onChange={(e) => setAirVelocity(parseFloat(e.target.value))}
              className="w-full accent-cyan-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.05 m/s (Stagnant)</span>
              <span className="text-emerald-400 font-bold">0.15 – 0.25 m/s (Comfort Range)</span>
              <span>0.60 m/s (Papers blow)</span>
            </div>
          </div>

          {/* 4. Room Pressure */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Room Differential Static Pressure</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-sm">{roomPressure > 0 ? `+${roomPressure}` : roomPressure} Pa</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isPressureCompliant
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {isPressureCompliant ? 'Positive (+10 to +25 Pa)' : roomPressure < 10 ? 'Infiltration Risk' : 'High Door Force'}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="-10"
              max="40"
              step="1"
              value={roomPressure}
              onChange={(e) => setRoomPressure(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-10 Pa (Negative/Outdoor air leaks in)</span>
              <span className="text-emerald-400 font-bold">+10 to +25 Pa (Standard Target)</span>
              <span>+40 Pa (Heavy door)</span>
            </div>
          </div>

          {/* Resulting Indoor Psychrometrics */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Resulting Indoor Air State Points:
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Dew Point (T_dp)</div>
                <div className="font-mono font-bold text-rose-300 text-sm mt-0.5">{dpIndoor.toFixed(1)} °C</div>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Humidity Ratio (W)</div>
                <div className="font-mono font-bold text-blue-300 text-sm mt-0.5">{(wIndoor * 1000).toFixed(1)} g/kg</div>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Specific Enthalpy (h)</div>
                <div className="font-mono font-bold text-emerald-300 text-sm mt-0.5">{hIndoor.toFixed(1)} kJ/kg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Outdoor Benchmark & Fresh Air Ventilation Calculator */}
        <div className="space-y-6">
          {/* Singapore Outdoor Design Benchmark Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-400" /> Singapore Statutory Outdoor Design Benchmark
              </h3>
              <span className="text-xs font-mono text-slate-400">SS 553 Clause 5.2</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Design conditions coincident with peak solar heat radiation in Singapore:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Outdoor DB</div>
                <div className="font-mono font-bold text-amber-300 text-base mt-0.5">{tOutdoor} °C</div>
                <div className="text-[10px] text-slate-500">Peak Solar Coincident</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Outdoor WB</div>
                <div className="font-mono font-bold text-cyan-300 text-base mt-0.5">{twbOutdoor} °C</div>
                <div className="text-[10px] text-slate-500">Wet Bulb Setpoint</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Outdoor Enthalpy</div>
                <div className="font-mono font-bold text-emerald-300 text-base mt-0.5">{hOutdoor} kJ/kg</div>
                <div className="text-[10px] text-slate-500">Total Heat Energy</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Moisture Content</div>
                <div className="font-mono font-bold text-purple-300 text-base mt-0.5">21.0 g/kg</div>
                <div className="text-[10px] text-slate-500">Tropical Humidity</div>
              </div>
            </div>
          </div>

          {/* SS 553 Table 4.10 Fresh Air Ventilation Calculator */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> SS 553 Outdoor Fresh Air Calculator
              </h3>
              <span className="text-xs font-mono text-slate-400">Table 4.10 Minimum Rates</span>
            </div>

            {/* Space Type Selection */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Occupancy / Space Classification</label>
              <select
                value={selectedSpaceId}
                onChange={(e) => {
                  setSelectedSpaceId(e.target.value);
                  const p = SPACE_PRESETS.find((preset) => preset.id === e.target.value);
                  if (p) {
                    setOccupantCount(Math.round(floorArea / p.defaultDensity));
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                {SPACE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.ratePerPerson} L/s per person · {p.ratePerArea} L/s per m²)
                  </option>
                ))}
              </select>
            </div>

            {/* Inputs: Floor Area & Occupancy */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Floor Area (m²)</label>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  value={floorArea}
                  onChange={(e) => setFloorArea(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Number of Occupants</label>
                <input
                  type="number"
                  min="1"
                  max="2000"
                  value={occupantCount}
                  onChange={(e) => setOccupantCount(Math.max(1, parseInt(e.target.value, 10) || 0))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono text-white text-xs"
                />
              </div>
            </div>

            {/* Computed Fresh Air Rate & Ventilation Load */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Required Outdoor Air Flow (L/s & m³/h):</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {freshAirRequiredLps.toFixed(1)} L/s ({freshAirRequiredM3h.toFixed(0)} m³/h)
                </span>
              </div>

              <div className="border-t border-slate-800/80 pt-2 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Sensible OA Load</div>
                  <div className="font-mono font-bold text-amber-300 mt-0.5">{qSensibleVent.toFixed(1)} kW</div>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Latent OA Load</div>
                  <div className="font-mono font-bold text-blue-300 mt-0.5">{qLatentVent.toFixed(1)} kW</div>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Total OA Coil Load</div>
                  <div className="font-mono font-bold text-rose-300 mt-0.5">
                    {qTotalVent.toFixed(1)} kW ({(qTotalVent / 3.517).toFixed(1)} RT)
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Formula: Sensible Qs = 1.2 · V · (To - Ti) | Latent Ql = 1.2 · 2450 · V · (wo - wi)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
