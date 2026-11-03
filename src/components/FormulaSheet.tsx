import React, { useState, useMemo } from 'react';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { Search, Calculator, BookOpen, Layers } from 'lucide-react';

export const FormulaSheet: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Mini-calc 1: Hydronic Heat Load
  const [calcFlowLps, setCalcFlowLps] = useState<number>(60);
  const [calcDeltaT, setCalcDeltaT] = useState<number>(5.5);
  const calcThermalKw = 4.186 * calcFlowLps * calcDeltaT;
  const calcThermalRt = calcThermalKw / 3.51685;

  // Mini-calc 2: Affinity Law Power Savings
  const [calcBaseKw, setCalcBaseKw] = useState<number>(22);
  const [calcSpeedRatio, setCalcSpeedRatio] = useState<number>(80); // %
  const calcNewKw = calcBaseKw * Math.pow(calcSpeedRatio / 100, 3);
  const calcEnergySavingsPct = (1 - calcNewKw / calcBaseKw) * 100;

  // Mini-calc 3: Plant kW/RT to COP
  const [calcKwPerRt, setCalcKwPerRt] = useState<number>(0.58);
  const calcCop = 3.51685 / calcKwPerRt;

  const categories = ['All', 'Air Distribution', 'Refrigeration', 'Hydronics', 'Ventilation', 'Standards'];

  const filteredGlossary = useMemo(() => {
    return GLOSSARY_TERMS.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.acronym && item.acronym.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Interactive Engineering Calculators Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
          <Calculator className="w-4 h-4" />
          <span>Interactive Quick-Formulas</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          Everyday ACMV Engineering Calculators
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calc 1: Hydronic Thermal Capacity */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Chilled Water Thermal Capacity
            </span>
            <div className="text-[11px] font-mono text-sky-600 dark:text-sky-400">
              Q (kW) = 4.186 × Flow (L/s) × ΔT (°C)
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-500 mb-0.5">
                  <span>Flow Rate (L/s)</span>
                  <span className="font-mono font-semibold">{calcFlowLps} L/s</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={calcFlowLps}
                  onChange={(e) => setCalcFlowLps(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-slate-500 mb-0.5">
                  <span>Delta-T (°C)</span>
                  <span className="font-mono font-semibold">{calcDeltaT} °C</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="8.0"
                  step="0.5"
                  value={calcDeltaT}
                  onChange={(e) => setCalcDeltaT(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline font-mono">
              <span className="text-xs text-slate-500">Cooling Output:</span>
              <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
                {calcThermalKw.toFixed(1)} kW ({calcThermalRt.toFixed(1)} RT)
              </span>
            </div>
          </div>

          {/* Calc 2: Affinity Law Power Savings */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              VFD Affinity Law (P₂ = P₁ × (N₂/N₁)³)
            </span>
            <div className="text-[11px] font-mono text-sky-600 dark:text-sky-400">
              Power varies with the cube of speed
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-500 mb-0.5">
                  <span>Full-Speed Power (kW)</span>
                  <span className="font-mono font-semibold">{calcBaseKw} kW</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="75"
                  step="1"
                  value={calcBaseKw}
                  onChange={(e) => setCalcBaseKw(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-slate-500 mb-0.5">
                  <span>Modulated Speed (%)</span>
                  <span className="font-mono font-semibold">{calcSpeedRatio}% speed</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={calcSpeedRatio}
                  onChange={(e) => setCalcSpeedRatio(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline font-mono">
              <span className="text-xs text-slate-500">New Power:</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {calcNewKw.toFixed(2)} kW (-{calcEnergySavingsPct.toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Calc 3: Plant Efficiency Metric */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Efficiency Converter: kW/RT ⟷ COP
            </span>
            <div className="text-[11px] font-mono text-sky-600 dark:text-sky-400">
              COP = 3.51685 / (kW/RT)
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-500 mb-0.5">
                  <span>Plant Specific Consumption (kW/RT)</span>
                  <span className="font-mono font-semibold">{calcKwPerRt.toFixed(2)} kW/RT</span>
                </div>
                <input
                  type="range"
                  min="0.45"
                  max="1.10"
                  step="0.01"
                  value={calcKwPerRt}
                  onChange={(e) => setCalcKwPerRt(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline font-mono">
              <span className="text-xs text-slate-500">Equivalent COP:</span>
              <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
                COP = {calcCop.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Standards Reference Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>Building Codes & Standards Benchmarks</span>
        </div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          Core Regulatory Codes for ACMV Practice
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium">
                <th className="pb-2.5">Code / Standard</th>
                <th className="pb-2.5">Jurisdiction / Body</th>
                <th className="pb-2.5">Core Focus Area</th>
                <th className="pb-2.5">Key Performance Mandate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-2.5 font-semibold text-slate-900 dark:text-white">SS 553:2016</td>
                <td className="py-2.5">Enterprise Singapore</td>
                <td className="py-2.5">ACMV Systems in Buildings</td>
                <td className="py-2.5 font-mono text-[11px]">Fresh air rates (5.5–10 L/s/p), duct acoustics, stair pressurization</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-900 dark:text-white">BCA Green Mark 2021</td>
                <td className="py-2.5">Building & Construction Authority</td>
                <td className="py-2.5">Environmental Sustainability</td>
                <td className="py-2.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">Platinum Chiller Plant ≤ 0.58 kW/RT, M&V instrumentation</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-900 dark:text-white">SCDF Fire Code Cl. 7</td>
                <td className="py-2.5">Singapore Civil Defence Force</td>
                <td className="py-2.5">Fire Safety & Smoke Control</td>
                <td className="py-2.5 font-mono text-[11px]">Stairs 50 Pa (Max 60 Pa/110 N), 9 ACH carpark smoke purge</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-900 dark:text-white">SS 530:2014</td>
                <td className="py-2.5">Enterprise Singapore</td>
                <td className="py-2.5">Energy Efficiency for Building Services</td>
                <td className="py-2.5 font-mono text-[11px]">Minimum equipment efficiency COP, fan and pump motor standards</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-900 dark:text-white">ASHRAE Standard 62.1</td>
                <td className="py-2.5">ASHRAE (International)</td>
                <td className="py-2.5">Ventilation for Acceptable IAQ</td>
                <td className="py-2.5 font-mono text-[11px]">Ventilation Rate Procedure, filtration minimum MERV 8/13</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-900 dark:text-white">ASHRAE 90.1-2022</td>
                <td className="py-2.5">ASHRAE (International)</td>
                <td className="py-2.5">Energy Standard for Buildings</td>
                <td className="py-2.5 font-mono text-[11px]">VAV reheat limits, economizers, fan power limits (kW/m³/s)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ACMV Engineering Glossary */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Terminology & Definitions</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Searchable ACMV Engineering Glossary
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search terms, acronyms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Glossary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGlossary.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/20 space-y-2"
            >
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.term}
                  </h3>
                  {item.acronym && (
                    <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400">
                      ({item.acronym})
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">{item.category}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.definition}
              </p>
              {item.formula && (
                <div className="pt-2 font-mono text-[11px] text-slate-700 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-700/60">
                  {item.formula}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredGlossary.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400">
            No terms match your search filter.
          </div>
        )}
      </div>
    </div>
  );
};
