import React, { useState } from 'react';
import { Users, Lightbulb, Monitor, Wind, Sun, CheckCircle2 } from 'lucide-react';

export const SimCoolingLoad: React.FC = () => {
  // Office Dimensions: 15m x 10m = 150 m² floor area
  const floorArea = 150; // m²

  // Sliders
  const [occupants, setOccupants] = useState<number>(15); // persons (10 m²/person standard)
  const [lpd, setLpd] = useState<number>(12); // Lighting Power Density (W/m²)
  const [epd, setEpd] = useState<number>(15); // Equipment / Plug Load (W/m²)
  const [solarWindowGain, setSolarWindowGain] = useState<number>(4500); // Envelope & Solar conduction (W)
  const [freshAirRate, setFreshAirRate] = useState<number>(10); // L/s per person (SS 553 standard ~ 5.5 to 10 L/s)

  // Constant heat rates from Lesson 12 & SS 553
  // Person in office: Sensible = 75 W, Latent = 55 W
  const qPeopleSensible = occupants * 75; // W
  const qPeopleLatent = occupants * 55; // W

  // Lights & Equipment (100% sensible)
  const qLights = floorArea * lpd; // W
  const qEquipment = floorArea * epd; // W

  // Envelope Sensible Gain
  const qEnvelope = solarWindowGain; // W

  // Fresh Air Ventilation (Singapore outdoor 32°C DB, 26°C WB / Indoor 24°C DB, 50% RH)
  // Outdoor h ≈ 80 kJ/kg, Indoor h ≈ 48 kJ/kg -> Δh ≈ 32 kJ/kg
  // Air density ρ ≈ 1.2 kg/m³
  // Total airflow Q_fa = occupants * freshAirRate (L/s) = occupants * freshAirRate / 1000 (m³/s)
  const qFaAirflow = (occupants * freshAirRate) / 1000; // m³/s
  // Fresh air sensible = 1.2 * Cp * Q_fa * (To - Ti) = 1.2 * 1.005 * Q_fa * (32 - 24) * 1000 W ≈ 9.65 * Q_fa * 1000
  const qFaSensible = 1.2 * 1.005 * qFaAirflow * (32 - 24) * 1000; // W
  // Fresh air latent = 1.2 * Q_fa * (Wo - Wi) * h_fg ≈ 1.2 * 2450 * Q_fa * (0.0175 - 0.0093) * 1000 W
  const qFaLatent = 1.2 * 2450 * qFaAirflow * (0.0175 - 0.0093) * 1000; // W

  // Totals
  const totalSensibleWatts = qPeopleSensible + qLights + qEquipment + qEnvelope + qFaSensible;
  const totalLatentWatts = qPeopleLatent + qFaLatent;
  const totalWatts = totalSensibleWatts + totalLatentWatts;
  const totalKw = totalWatts / 1000;
  const totalRt = totalKw / 3.517; // 1 RT = 3.517 kW

  const shr = totalWatts > 0 ? totalSensibleWatts / totalWatts : 0.8;
  const wattsPerSqm = totalWatts / floorArea;

  // Challenge: Keep Total Specific Load <= 140 W/m² while providing at least 15 occupants with SS 553 standard 10 L/s/person
  const challengePassed = occupants >= 15 && freshAirRate >= 10 && wattsPerSqm <= 140.0;

  return (
    <div className="space-y-6 text-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Room & Heat Gain Inputs (150 m² Office)
            </span>
            <span className="text-xs text-slate-400">Lesson 12 · SS 553</span>
          </div>

          {/* Occupants */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-400" /> Occupancy (People)
              </span>
              <span className="font-mono text-rose-400 font-semibold">{occupants} pax</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={occupants}
              onChange={(e) => setOccupants(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[11px] text-slate-500">75W sensible + 55W latent per person</div>
          </div>

          {/* Lighting Power Density */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Lighting (LPD)
              </span>
              <span className="font-mono text-amber-400 font-semibold">{lpd} W/m²</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={lpd}
              onChange={(e) => setLpd(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[11px] text-slate-500">LED code limit ~ 12 W/m² (SS 530)</div>
          </div>

          {/* Equipment Load */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-cyan-400" /> Plug Load / Equipment
              </span>
              <span className="font-mono text-cyan-400 font-semibold">{epd} W/m²</span>
            </div>
            <input
              type="range"
              min="8"
              max="35"
              step="1"
              value={epd}
              onChange={(e) => setEpd(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Solar & Envelope Heat Gain */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-orange-400" /> Solar & Glazing Gain
              </span>
              <span className="font-mono text-orange-400 font-semibold">
                {(solarWindowGain / 1000).toFixed(1)} kW
              </span>
            </div>
            <input
              type="range"
              min="1500"
              max="9000"
              step="500"
              value={solarWindowGain}
              onChange={(e) => setSolarWindowGain(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Fresh Air Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-blue-400" /> Outdoor Air Rate
              </span>
              <span className="font-mono text-blue-400 font-semibold">{freshAirRate} L/s·pax</span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              step="1"
              value={freshAirRate}
              onChange={(e) => setFreshAirRate(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[11px] text-slate-500">SS 553 minimum office standard: 5.5 - 10 L/s</div>
          </div>
        </div>

        {/* Live Heat Gain Stack Breakdown & Readouts */}
        <div className="lg:col-span-7 space-y-5">
          {/* Stacked Visual Bar Diagram */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-300 uppercase">
                Cooling Load Heat Gain Breakdown
              </span>
              <span className="text-xs font-mono text-rose-400 font-semibold">
                {totalKw.toFixed(2)} kW Total
              </span>
            </div>

            {/* Component Bars */}
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" /> Solar & Envelope
                  </span>
                  <span className="font-mono font-medium text-slate-200">
                    {(qEnvelope / 1000).toFixed(2)} kW ({((qEnvelope / totalWatts) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(qEnvelope / totalWatts) * 100}%` }}
                    className="h-full bg-orange-500 rounded-full transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Lighting Load
                  </span>
                  <span className="font-mono font-medium text-slate-200">
                    {(qLights / 1000).toFixed(2)} kW ({((qLights / totalWatts) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(qLights / totalWatts) * 100}%` }}
                    className="h-full bg-amber-400 rounded-full transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> Plug Load & Equipment
                  </span>
                  <span className="font-mono font-medium text-slate-200">
                    {(qEquipment / 1000).toFixed(2)} kW ({((qEquipment / totalWatts) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(qEquipment / totalWatts) * 100}%` }}
                    className="h-full bg-cyan-400 rounded-full transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" /> People (Sensible + Latent)
                  </span>
                  <span className="font-mono font-medium text-slate-200">
                    {((qPeopleSensible + qPeopleLatent) / 1000).toFixed(2)} kW ({(((qPeopleSensible + qPeopleLatent) / totalWatts) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${((qPeopleSensible + qPeopleLatent) / totalWatts) * 100}%` }}
                    className="h-full bg-purple-400 rounded-full transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-400" /> Fresh Air Ventilation
                  </span>
                  <span className="font-mono font-medium text-slate-200">
                    {((qFaSensible + qFaLatent) / 1000).toFixed(2)} kW ({(((qFaSensible + qFaLatent) / totalWatts) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${((qFaSensible + qFaLatent) / totalWatts) * 100}%` }}
                    className="h-full bg-blue-400 rounded-full transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3 Big Result Numbers */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Total Capacity</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400 mt-1">
                {totalRt.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500">RT ({totalKw.toFixed(1)} kW)</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Sensible Ratio (SHR)</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
                {shr.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500">Qs / Qtotal</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Specific Load</div>
              <div
                className={`text-xl sm:text-2xl font-bold font-mono mt-1 ${
                  wattsPerSqm <= 140 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {wattsPerSqm.toFixed(0)}
              </div>
              <div className="text-[11px] text-slate-500">W/m² floor area</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-step working box for student tutorials */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Step-by-Step Calculation (Lesson 12 Cooling Load Estimation)
        </div>
        <pre className="font-mono text-xs sm:text-sm text-slate-300 bg-slate-950 p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-800/80">
{`1. Internal Heat Gains (150 m² floor):
   - Lighting: Q_light = 150 m² × ${lpd} W/m² = ${qLights.toFixed(0)} W
   - Equipment: Q_equip = 150 m² × ${epd} W/m² = ${qEquipment.toFixed(0)} W
   - Occupants (${occupants} pax):
     * Sensible: ${occupants} × 75 W = ${qPeopleSensible.toFixed(0)} W
     * Latent: ${occupants} × 55 W = ${qPeopleLatent.toFixed(0)} W

2. Envelope & Solar Conduction:
   - Q_envelope = ${qEnvelope.toFixed(0)} W

3. Outdoor Ventilation (Fresh Air for ${occupants} pax @ ${freshAirRate} L/s·pax = ${(qFaAirflow * 1000).toFixed(0)} L/s):
   - Q_fa,sensible = 1.2 × 1.005 × ${(qFaAirflow).toFixed(4)} m³/s × (32°C - 24°C) × 1000 = ${qFaSensible.toFixed(0)} W
   - Q_fa,latent = 1.2 × 2450 × ${(qFaAirflow).toFixed(4)} m³/s × (0.0175 - 0.0093) × 1000 = ${qFaLatent.toFixed(0)} W

4. Total Cooling Load & Sensible Heat Ratio (SHR):
   - Q_total,sensible = ${qLights.toFixed(0)} + ${qEquipment.toFixed(0)} + ${qPeopleSensible.toFixed(0)} + ${qEnvelope.toFixed(0)} + ${qFaSensible.toFixed(0)} = ${totalSensibleWatts.toFixed(0)} W (${(totalSensibleWatts/1000).toFixed(2)} kW)
   - Q_total,latent = ${qPeopleLatent.toFixed(0)} + ${qFaLatent.toFixed(0)} = ${totalLatentWatts.toFixed(0)} W (${(totalLatentWatts/1000).toFixed(2)} kW)
   - Q_total = ${(totalWatts / 1000).toFixed(2)} kW = ${totalRt.toFixed(2)} RT (1 RT = 3.517 kW)
   - SHR = ${totalSensibleWatts.toFixed(0)} / ${totalWatts.toFixed(0)} = ${shr.toFixed(2)}`}
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
              Try This Challenge: Green Mark Low-Energy Office
            </div>
            <div className="text-xs text-slate-400">
              Serve ≥ 15 occupants with SS 553 fresh air (≥ 10 L/s·pax) while tuning lighting, equipment and solar shading to keep specific load ≤ 140 W/m².
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
