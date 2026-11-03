import { GlossaryTerm } from '../types/acmv';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Refrigeration Ton',
    acronym: 'RT',
    definition: 'A unit of power used to describe the heat-extraction capacity of refrigeration and air conditioning equipment. 1 RT is the rate of heat removal required to freeze 1 short ton (2000 lbs) of water at 0°C in 24 hours.',
    category: 'Refrigeration',
    formula: '1 RT = 3.51685 kW = 12,000 BTU/hr'
  },
  {
    term: 'Coefficient of Performance',
    acronym: 'COP',
    definition: 'The ratio of useful heating or cooling provided to work (energy) required. Higher COP represents a more efficient thermodynamic cycle.',
    category: 'Refrigeration',
    formula: 'COP = Cooling Capacity (kW) / Electrical Power (kW)'
  },
  {
    term: 'Specific Plant Efficiency',
    acronym: 'kW/RT',
    definition: 'The primary metric used in Singapore and Southeast Asia to quantify central chilled water plant efficiency. It measures total electrical power (chillers + pumps + cooling towers) required to produce 1 ton of cooling.',
    category: 'Standards',
    formula: 'kW/RT = Total Plant kW / Total Cooling RT = 3.517 / COP'
  },
  {
    term: 'Low Delta-T Syndrome',
    acronym: 'Low ΔT',
    definition: 'A common hydronic pathology where chilled water returns to the plant room at a significantly lower temperature than designed (e.g. 9.5°C instead of 12.5°C), forcing excess water circulation, maxing out pumps, and staging unneeded chillers.',
    category: 'Hydronics',
    formula: 'Flow (L/s) = Q (kW) / (4.186 × ΔT)'
  },
  {
    term: 'Air Handling Unit',
    acronym: 'AHU',
    definition: 'A centralized device used to regulate and circulate air as part of a heating, ventilating, and air-conditioning system. Includes dampers, filter banks, chilled water cooling coils, condensate drain, and supply fan.',
    category: 'Air Distribution'
  },
  {
    term: 'Variable Air Volume',
    acronym: 'VAV',
    definition: 'An HVAC system that varies the airflow at a constant supply temperature (typically 13°C) to satisfy varying thermal zone loads, yielding significant fan energy savings compared to constant volume systems.',
    category: 'Air Distribution'
  },
  {
    term: 'Fan Coil Unit',
    acronym: 'FCU',
    definition: 'A small terminal unit consisting of a heating or cooling coil and fan, installed locally in individual rooms or ceiling plenums without extensive ductwork.',
    category: 'Air Distribution'
  },
  {
    term: 'Pressure Independent Control Valve',
    acronym: 'PICV',
    definition: 'A combined dynamic balancing valve and 2-way modulating temperature control valve that maintains constant flow regardless of upstream or downstream pressure fluctuations.',
    category: 'Hydronics'
  },
  {
    term: 'Staircase Pressurization System',
    acronym: 'SPS',
    definition: 'A life safety mechanical ventilation system designed to maintain positive air pressure (50 Pa) within emergency escape stairwells, preventing ingress of toxic smoke and hot fire gases.',
    category: 'Ventilation',
    formula: 'ΔP = 50 Pa (Max 60 Pa / 110 N door opening force)'
  },
  {
    term: 'Jet Fan / Impulse Ventilation',
    acronym: 'Jet Fan',
    definition: 'Suspended high-velocity axial fans used in underground carparks to induce and propel exhaust air toward smoke extract shafts via momentum transfer, eliminating sheet metal ductwork.',
    category: 'Ventilation'
  },
  {
    term: 'Apparatus Dew Point',
    acronym: 'ADP',
    definition: 'The effective average surface temperature of a cooling coil fin surface. Moist air passing over the coil cannot be cooled below this thermodynamic limit without freezing.',
    category: 'Air Distribution'
  },
  {
    term: 'Sensible Heat Ratio',
    acronym: 'SHR',
    definition: 'The ratio of sensible heat to total heat (sensible plus latent) absorbed or rejected in an air-conditioning process.',
    category: 'Refrigeration',
    formula: 'SHR = Q_sensible / (Q_sensible + Q_latent)'
  },
  {
    term: 'Equal Friction Method',
    definition: 'The standard engineering method for sizing supply and return duct systems, designing for a uniform pressure drop per unit length (typically 0.8 to 1.0 Pa/m in SI units).',
    category: 'Air Distribution',
    formula: 'ΔP / L = constant (0.8 - 1.0 Pa/m)'
  },
  {
    term: 'Cooling Tower Approach',
    definition: 'The difference between the temperature of cold water leaving the cooling tower basin and the outdoor ambient air wet-bulb temperature.',
    category: 'Hydronics',
    formula: 'Approach = T_leaving_water - T_ambient_wb'
  },
  {
    term: 'Cooling Tower Range',
    definition: 'The temperature difference between entering warm condenser water from the chiller and cooled water leaving the tower basin.',
    category: 'Hydronics',
    formula: 'Range = T_entering_water - T_leaving_water'
  },
  {
    term: 'Global Warming Potential',
    acronym: 'GWP',
    definition: 'A relative measure of how much heat a greenhouse gas traps in the atmosphere compared to Carbon Dioxide (GWP = 1.0) over a 100-year timescale.',
    category: 'Standards'
  },
  {
    term: 'BCA Green Mark',
    definition: 'Singapore\'s green building rating scheme established by the Building and Construction Authority. Green Mark 2021 sets world-leading ACMV energy efficiency benchmarks, requiring central chiller plant efficiency ≤ 0.58 kW/RT for Platinum certification.',
    category: 'Standards'
  },
  {
    term: 'Variable Primary Flow',
    acronym: 'VPF',
    definition: 'A modern chilled water plant hydronic configuration that eliminates secondary pumps, using a single set of variable-speed primary pumps and a modulating minimum-flow bypass line.',
    category: 'Hydronics'
  }
];
