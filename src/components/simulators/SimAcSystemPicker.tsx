import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Layers } from 'lucide-react';

export const SimAcSystemPicker: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<'window' | 'split' | 'vrf' | 'chiller'>('split');

  const systemData = {
    window: {
      name: 'Window (Room) Air Conditioner',
      capacityRange: '0.75 to 2.5 RT (2.6 to 9.0 kW)',
      typicalCop: '2.80 to 3.20 (1.10 to 1.25 kW/RT)',
      refrigerant: 'R-32 or R-410A (Factory sealed charge)',
      compressor: 'Rotary hermetic compressor',
      metering: 'Capillary tube',
      airDistribution: 'Double-shafted motor driving centrifugal blower and propeller condenser fan',
      pros: [
        'Lowest initial capital cost',
        'Simple installation through window frame or wall opening',
        'No external refrigerant piping required',
      ],
      cons: [
        'High noise transmission directly into room',
        'Blocks window daylight and aesthetics',
        'Low energy efficiency compared to modern central plants',
      ],
      maintenance: [
        'Wash air filters and clean front panel monthly',
        'Clean condensate drain pan and drainpipe',
        'Straighten/comb coil fins where necessary',
      ],
    },
    split: {
      name: 'Air-Cooled Split Unit',
      capacityRange: '1.0 to 5.0 RT (3.5 to 17.5 kW)',
      typicalCop: '3.20 to 3.80 (0.92 to 1.10 kW/RT)',
      refrigerant: 'R-32 (A2L) or R-410A',
      compressor: 'Inverter rotary or scroll hermetic compressor',
      metering: 'Electronic Expansion Valve (EEV) or capillary',
      airDistribution: 'Cross-flow tangential fan in indoor unit; propeller fan in outdoor condensing unit',
      pros: [
        'Noisy compressor is located outdoors on aircon ledge',
        'Flexible wall, cassette, or ducted ceiling indoor mounting',
        'Good individual room temperature control',
      ],
      cons: [
        'Refrigerant piping length limited between indoor and outdoor units',
        'Air-cooled outdoor condenser rejects heat at hot dry-bulb temp (33°C+)',
        'Multiple outdoor condensing units clutter building facade',
      ],
      maintenance: [
        'Chemical coil cleaning of indoor cooling coil every 6 months',
        'Clean fan blower wheel and clear condensate drain line',
        'Check refrigerant suction/discharge pressures for leaks',
      ],
    },
    vrf: {
      name: 'Variable Refrigerant Flow (VRF / VRV)',
      capacityRange: '5.0 to 50.0 RT (17.5 to 175 kW)',
      typicalCop: '3.80 to 4.50 (0.78 to 0.92 kW/RT)',
      refrigerant: 'R-410A or R-32',
      compressor: 'Modulating DC Inverter Scroll Compressor',
      metering: 'Pulse-width modulated Electronic Expansion Valves at each indoor unit',
      airDistribution: 'Simultaneous cooling and heating with multi-zone indoor cassettes',
      pros: [
        'Superior part-load efficiency with inverter compressor speed modulation',
        'Long piping runs (up to 150m) and large elevation differences',
        'Zonal energy billing and smart building controls integration',
      ],
      cons: [
        'High refrigerant volume circulating in occupied spaces (leak risk)',
        'Proprietary communication protocols and complex diagnostic electronics',
        'Higher capital cost than standard split units',
      ],
      maintenance: [
        'Regular sensor calibration and electronic valve stroke checks',
        'Monitor oil return cycles and compressor frequency logs',
        'Inspect electrical contactors and outdoor fan bearings',
      ],
    },
    chiller: {
      name: 'Water-Cooled Central Chiller + AHU Plant',
      capacityRange: '300 to 3,000+ RT (1,050 to 10,500+ kW)',
      typicalCop: '5.50 to 7.00+ (0.50 to 0.60 kW/RT)',
      refrigerant: 'R-134a or ultra-low GWP HFO R-1234ze / R-1233zd',
      compressor: 'Centrifugal compressor with magnetic levitation bearings (Turbocor)',
      metering: 'High-precision modulating pilot-operated expansion valves',
      airDistribution: 'Chilled water pumped at 6.7°C to central AHUs, VAV boxes, and cooling towers',
      pros: [
        'Highest energy efficiency (complies with BCA Green Mark Platinum ≤ 0.58 kW/RT)',
        'Economies of scale for large high-rise office towers and shopping malls',
        'Water-cooled towers reject heat against lower wet-bulb temperature (~27°C)',
      ],
      cons: [
        'High initial mechanical capital investment and plant room space required',
        'Requires dedicated cooling tower water treatment and Legionella monitoring',
        'Requires skilled certified licensed facilities maintenance engineers',
      ],
      maintenance: [
        'Automatic condenser tube brush/ball cleaning to prevent scale',
        'Monthly water quality testing and quarterly Legionella bacteria plate counts',
        'Chilled and condenser water pump alignment and vibration analysis',
      ],
    },
  };

  const active = systemData[selectedSystem];
  const isChallengeMet = selectedSystem === 'chiller';

  return (
    <div className="space-y-6">
      {/* Top Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: System Selector & Challenge (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-800 pb-2">
              Select Air-Conditioning System Typology:
            </span>

            <div className="space-y-2">
              {(['window', 'split', 'vrf', 'chiller'] as const).map((sys) => (
                <button
                  key={sys}
                  onClick={() => setSelectedSystem(sys)}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all ${
                    selectedSystem === sys
                      ? 'bg-sky-950/60 border-sky-500 text-white font-semibold'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{systemData[sys].name}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {sys === 'chiller' ? 'Central' : 'DX'}
                    </span>
                  </div>
                </button>
              ))}
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
              <span>Design Selection Challenge:</span>
            </div>
            <p className="text-xs leading-relaxed">
              Select the system suitable for a <strong>1,200 RT commercial office tower</strong> in Singapore targeting BCA Green Mark Platinum efficiency.
            </p>
            <div className="mt-2 text-[11px] font-mono">
              Status:{' '}
              {isChallengeMet ? (
                <strong className="text-emerald-400">OPTIMAL SELECTION: Water-Cooled Central Chiller + AHU Plant</strong>
              ) : (
                <span className="text-amber-400">Current selection capacity too small for a 1,200 RT tower.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Detailed Specification & Diagram (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Big Spec Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-400 block font-sans">Capacity Range</span>
              <div className="text-sm sm:text-base font-bold font-mono text-sky-400 mt-1">
                {active.capacityRange}
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-400 block font-sans">Typical Efficiency</span>
              <div className="text-sm sm:text-base font-bold font-mono text-emerald-400 mt-1">
                COP {active.typicalCop}
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 block font-sans">Compressor Type</span>
              <div className="text-xs font-semibold text-slate-200 mt-1 truncate">
                {active.compressor}
              </div>
            </div>
          </div>

          {/* Component Diagram / Schematic Card */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="font-bold text-white uppercase tracking-wider">{active.name} Technical Architecture</span>
              <span className="font-mono text-slate-400 text-[11px]">Refrigerant: {active.refrigerant}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Advantages (Pros):
                </span>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {active.pros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Limitations (Cons):
                </span>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {active.cons.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                Maintenance Protocols (Lesson 2 Slides):
              </span>
              <ul className="space-y-1 text-slate-400 list-disc list-inside text-[11px]">
                {active.maintenance.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
