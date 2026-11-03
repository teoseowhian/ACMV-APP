import React, { useState } from 'react';
import { LESSON_MODULES } from '../data/lessonsData';
import { LessonSection, LessonModule, NavigationTab } from '../types/acmv';
import { BookOpen, ChevronRight, CheckCircle2, Play, Sliders, ArrowRight } from 'lucide-react';

interface CurriculumViewProps {
  onNavigateTab: (tab: NavigationTab) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ onNavigateTab }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(LESSON_MODULES[0].id);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(LESSON_MODULES[0].sections[0].id);

  // Active module & section
  const currentModule = LESSON_MODULES.find((m) => m.id === selectedModuleId) || LESSON_MODULES[0];
  const currentSection =
    currentModule.sections.find((s) => s.id === selectedSectionId) || currentModule.sections[0];

  // In-lesson interactive states:
  // 1. Refrigeration cycle interactive component selection
  const [activeCycleComponent, setActiveCycleComponent] = useState<'compressor' | 'condenser' | 'expansion' | 'evaporator'>('compressor');

  // 2. Fresh air rate calculator
  const [occupantsCount, setOccupantsCount] = useState<number>(45);
  const [officeAreaM2, setOfficeAreaM2] = useState<number>(450);
  const calculatedFreshAirLps = occupantsCount * 5.5 + officeAreaM2 * 0.6; // SS 553 formula

  // Cycle component descriptions
  const cycleComponentDetails = {
    compressor: {
      title: 'Centrifugal / Screw Compressor (State 1 → 2)',
      pressure: 'High Pressure / High Temperature Superheated Vapor',
      temperature: 'Suction: 4°C → Discharge: 75°C to 85°C',
      physics: 'Electrical motor performs shaft work (Wc), compressing low-pressure vapor into high-pressure discharge gas. Isentropic efficiency is typically 78% to 85%.',
    },
    condenser: {
      title: 'Water-Cooled Shell & Tube Condenser (State 2 → 3)',
      pressure: 'High Pressure Superheated Gas → Subcooled Liquid',
      temperature: 'In: 75°C Gas → Out: 35°C Subcooled Liquid',
      physics: 'Rejects heat to condenser water pumped to cooling towers. Gas desuperheats, condenses at saturation temperature (~36°C), and undergoes 2°C to 4°C subcooling.',
    },
    expansion: {
      title: 'Electronic Expansion Valve (EEV) (State 3 → 4)',
      pressure: 'High Pressure Liquid → Low Pressure Liquid/Vapor Mixture',
      temperature: 'In: 35°C Liquid → Out: 3.5°C Flashed Mixture',
      physics: 'Isenthalpic (constant enthalpy) throttling. Pressure drops rapidly, causing ~15% to 20% of liquid to flash into vapor, absorbing heat from itself and plummeting temperature.',
    },
    evaporator: {
      title: 'Flooded Shell & Tube Evaporator (State 4 → 1)',
      pressure: 'Low Pressure Liquid/Vapor → Superheated Vapor',
      temperature: 'In: 3.5°C Mixture → Out: 7.5°C Superheated Vapor',
      physics: 'Liquid refrigerant boils by absorbing heat from building chilled water (cooled from 12.2°C to 6.7°C). Provides 4°C to 5°C superheat to protect compressor from liquid droplets.',
    },
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Professional Building Services Engineering</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Air-Conditioning & Mechanical Ventilation (ACMV) Curriculum
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Comprehensive technical lessons grounded in thermodynamics, Singapore SS 553, BCA Green Mark 2021, and ASHRAE design standards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('lab')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Open Chilled Plant Sim
            </button>
            <button
              onClick={() => onNavigateTab('worksheets')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <Sliders className="w-3.5 h-3.5" />
              Sizing Worksheets
            </button>
          </div>
        </div>

        {/* 5 Module Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          {LESSON_MODULES.map((mod) => {
            const isSelected = mod.id === currentModule.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  setSelectedModuleId(mod.id);
                  setSelectedSectionId(mod.sections[0].id);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-sky-50/80 border-sky-500 dark:bg-sky-950/40 dark:border-sky-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>MODULE {mod.moduleNumber}</span>
                  <span className="text-[10px] uppercase font-sans text-sky-600 dark:text-sky-400 font-semibold">
                    {mod.category}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                  {mod.title}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  {mod.sections.length} Core Topics
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout: Sidebar Sections + Section Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Topic Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Module {currentModule.moduleNumber} Topics
            </div>
            <div className="space-y-1.5">
              {currentModule.sections.map((section, idx) => {
                const isSelected = section.id === currentSection.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    className={`w-full text-left p-3 rounded-lg text-xs font-medium transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-sky-600 text-white font-semibold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] opacity-75 font-mono">
                        {currentModule.moduleNumber}.{idx + 1}
                      </div>
                      <div className="mt-0.5 line-clamp-2">{section.title}</div>
                    </div>
                    <span className="text-[10px] opacity-75 whitespace-nowrap shrink-0 mt-0.5">
                      {section.readingTime}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Standards Card */}
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-5 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <span className="font-semibold text-slate-900 dark:text-white block">
              Reference Standards for this Module:
            </span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
              {currentSection.standardsRef?.map((ref, i) => (
                <li key={i}>{ref}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Area: Lesson Reader (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <article className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* Section Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span>{currentModule.title}</span>
                <span>/</span>
                <span>{currentSection.readingTime}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {currentSection.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {currentSection.subtitle}
              </p>
            </div>

            {/* Summary Callout */}
            <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/50 text-xs sm:text-sm text-sky-900 dark:text-sky-200 leading-relaxed font-medium">
              {currentSection.summary}
            </div>

            {/* In-Lesson Interactive Widget 1: Refrigeration Cycle */}
            {currentSection.interactiveType === 'refrigeration-cycle' && (
              <div className="p-5 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="font-semibold text-slate-300 uppercase tracking-wider">
                    Interactive 4-Stage Refrigeration Cycle Explorer
                  </span>
                  <span className="text-slate-500">Click a component to inspect physics</span>
                </div>

                {/* Component Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => setActiveCycleComponent('compressor')}
                    className={`p-2.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                      activeCycleComponent === 'compressor'
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    1. Compressor
                  </button>
                  <button
                    onClick={() => setActiveCycleComponent('condenser')}
                    className={`p-2.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                      activeCycleComponent === 'condenser'
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    2. Condenser
                  </button>
                  <button
                    onClick={() => setActiveCycleComponent('expansion')}
                    className={`p-2.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                      activeCycleComponent === 'expansion'
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    3. Expansion Valve
                  </button>
                  <button
                    onClick={() => setActiveCycleComponent('evaporator')}
                    className={`p-2.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                      activeCycleComponent === 'evaporator'
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                        : 'border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    4. Evaporator
                  </button>
                </div>

                {/* Active Component Details */}
                <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-sm text-white">
                    <span>{cycleComponentDetails[activeCycleComponent].title}</span>
                    <span className="font-mono text-xs text-sky-400">
                      {cycleComponentDetails[activeCycleComponent].temperature}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-amber-400">
                    State: {cycleComponentDetails[activeCycleComponent].pressure}
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {cycleComponentDetails[activeCycleComponent].physics}
                  </p>
                </div>
              </div>
            )}

            {/* In-Lesson Interactive Widget 2: AHU Sequence */}
            {currentSection.interactiveType === 'ahu-airflow' && (
              <div className="p-5 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-2">
                  AHU Modular Airflow Stream Sequence
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="font-bold text-sky-400">01. Plenum</div>
                    <div className="text-[11px] text-slate-400 mt-1">OA & RA Mixing</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="font-bold text-indigo-400">02. Filters</div>
                    <div className="text-[11px] text-slate-400 mt-1">MERV 8 + 14</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="font-bold text-cyan-400">03. Coil</div>
                    <div className="text-[11px] text-slate-400 mt-1">Cu-Al 7°C CHW</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="font-bold text-emerald-400">04. Plug Fan</div>
                    <div className="text-[11px] text-slate-400 mt-1">EC Direct Drive</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 col-span-2 sm:col-span-1">
                    <div className="font-bold text-amber-400">05. VAV Box</div>
                    <div className="text-[11px] text-slate-400 mt-1">Zone Damper</div>
                  </div>
                </div>
              </div>
            )}

            {/* In-Lesson Interactive Widget 3: Fresh Air Ventilation Calculator */}
            {currentSection.interactiveType === 'ventilation-rates' && (
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Interactive SS 553 / ASHRAE 62.1 Fresh Air Calculator
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>Occupants Count (P_z)</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        {occupantsCount} people
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      step="5"
                      value={occupantsCount}
                      onChange={(e) => setOccupantsCount(Number(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>Office Floor Area (A_z)</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        {officeAreaM2} m²
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1500"
                      step="50"
                      value={officeAreaM2}
                      onChange={(e) => setOfficeAreaM2(Number(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline font-mono text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    Required Outdoor Fresh Air: V_bz = (5.5 × {occupantsCount}) + (0.6 × {officeAreaM2})
                  </span>
                  <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
                    {calculatedFreshAirLps.toFixed(1)} L/s ({(calculatedFreshAirLps * 2.119).toFixed(0)} CFM)
                  </span>
                </div>
              </div>
            )}

            {/* Paragraphs */}
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentSection.contentMarkdown.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Key Formulas Section */}
            {currentSection.keyFormulas && currentSection.keyFormulas.length > 0 && (
              <div className="space-y-3 pt-4">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Core Engineering Mathematical Formulas
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSection.keyFormulas.map((f, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5"
                    >
                      <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                        {f.name}
                      </span>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                        {f.formula}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">{f.explanation}</p>
                      <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        Ex: {f.example}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practical Field Engineering Tips */}
            {currentSection.practicalTips && currentSection.practicalTips.length > 0 && (
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2 text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Practical Field Engineering Best Practices:
                </span>
                <ul className="space-y-1.5 text-emerald-950 dark:text-emerald-100 list-disc list-inside leading-relaxed">
                  {currentSection.practicalTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};
