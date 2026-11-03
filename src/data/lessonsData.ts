import { LessonModule } from '../types/acmv';

export const LESSON_MODULES: LessonModule[] = [
  {
    id: 'module-1',
    moduleNumber: '01',
    title: 'Thermodynamics & The Refrigeration Cycle',
    tagline: 'The foundational physics governing all vapor-compression cooling systems.',
    category: 'Thermodynamics',
    sections: [
      {
        id: '1-1',
        title: 'Foundations of Heat Transfer & The Refrigeration Ton',
        subtitle: 'Understanding sensible heat, latent heat, enthalpy, and thermal capacity units.',
        readingTime: '6 min read',
        summary: 'Air conditioning does not create cold; it extracts heat from an enclosed space and rejects it to the outdoor ambient environment through continuous phase changes of a working fluid.',
        contentMarkdown: [
          'In thermal engineering, cold is simply the absence of heat energy. An ACMV system moves thermal energy from a lower-temperature reservoir (indoor air) to a higher-temperature reservoir (outdoor air or cooling tower water).',
          'Two fundamental modes of thermal energy transfer govern HVAC processes:',
          '1. Sensible Heat (Qs): Heat energy that causes a measurable change in temperature without changing the physical state of the substance. For air, Qs = 1.2 × 1.005 × Airflow (m³/s) × ΔT (°C), or in Imperial units Qs = 1.08 × CFM × ΔT (°F).',
          '2. Latent Heat (Ql): Heat energy required to induce a phase change (e.g. moisture condensing out of humid air onto a cold coil at 7°C) at constant temperature. For moisture removal, Ql = 1.2 × 2450 × Airflow (m³/s) × Δw (kg/kg), or Ql = 4840 × CFM × Δw (lb/lb).',
          'The primary capacity unit in commercial building services is the Refrigeration Ton (RT). One RT is historically defined as the rate of heat extraction required to freeze 2,000 lbs (1 short ton) of pure water at 0°C into ice in 24 hours (latent heat of fusion of water is 144 BTU/lb).',
          '1 RT = 12,000 BTU/hr = 3.51685 kW = 3,024 kcal/hr. In modern central chiller plant engineering, system capacities commonly range from 300 RT to upwards of 5,000 RT.'
        ],
        keyFormulas: [
          {
            name: 'Sensible Heat Formula (SI)',
            formula: 'Qs = ρ × Cp × Q × ΔT',
            explanation: 'ρ = air density (≈ 1.20 kg/m³), Cp = specific heat of air (≈ 1.005 kJ/kg·K), Q = volumetric airflow (m³/s), ΔT = temperature difference (K or °C).',
            example: 'Airflow of 2.5 m³/s cooled across a coil from 26°C to 14°C: Qs = 1.2 × 1.005 × 2.5 × (26 - 14) = 36.18 kW.'
          },
          {
            name: 'Ton of Refrigeration Conversion',
            formula: '1 RT = 3.517 kW = 12,000 BTU/h',
            explanation: 'Direct conversion between Imperial and SI thermal cooling units.',
            example: 'A building cooling load of 350 kW equates to 350 / 3.517 = 99.5 RT (standard 100 RT equipment size).'
          }
        ],
        standardsRef: ['ASHRAE Handbook - Fundamentals (Ch. 1)', 'Singapore Standard SS 553:2016'],
        practicalTips: [
          'In tropical Southeast Asian climates (Singapore, Malaysia, Indonesia), latent cooling accounts for 30% to 45% of total AHU coil load due to outdoor relative humidity consistently exceeding 80%.',
          'Always size chilled water piping based on actual design ΔT. Specifying a 5.5°C ΔT rather than 4.0°C reduces pipe diameter and saves pumping energy.'
        ]
      },
      {
        id: '1-2',
        title: 'The 4-Stage Vapor Compression Cycle',
        subtitle: 'Compressor, Condenser, Thermal Expansion Valve, and Evaporator mechanics.',
        readingTime: '8 min read',
        summary: 'The closed thermodynamic cycle where refrigerant continuously alternates between vapor and liquid states to absorb indoor heat and reject it outdoors.',
        contentMarkdown: [
          'Every vapor-compression refrigeration machine operates across four distinct thermodynamic processes:',
          '1. Compression (State 1 → 2): Low-pressure, low-temperature superheated refrigerant vapor enters the compressor suction. Mechanical work is applied, elevating the refrigerant to high pressure and high superheat temperature.',
          '2. Condensation (State 2 → 3): High-pressure superheated gas flows into the condenser. As heat is rejected to the condenser cooling water (or ambient air in DX split units), the gas desuperheats, condenses into high-pressure liquid, and undergoes subcooling (typically 2°C to 5°C).',
          '3. Expansion / Throttling (State 3 → 4): High-pressure subcooled liquid passes through a metering device (Electronic Expansion Valve EEV or Thermal Expansion Valve TXV). An isenthalpic pressure drop occurs, causing a portion of refrigerant to flash into vapor ("flash gas"), plummeting its temperature.',
          '4. Evaporation (State 4 → 1): Low-pressure, low-temperature liquid-vapor mixture enters the evaporator. Heat from the building chilled water (or room air) is absorbed. The refrigerant boils into vapor and is superheated by 4°C to 6°C before re-entering the compressor, preventing liquid slugging.'
        ],
        interactiveType: 'refrigeration-cycle',
        keyFormulas: [
          {
            name: 'Refrigeration Effect (RE)',
            formula: 'RE = h1 - h4 (kJ/kg)',
            explanation: 'Enthalpy difference across the evaporator coil, representing heat absorbed per kilogram of circulating refrigerant.',
            example: 'If h1 = 405 kJ/kg and h4 = 250 kJ/kg, RE = 155 kJ/kg.'
          },
          {
            name: 'Compressor Work of Compression (Wc)',
            formula: 'Wc = h2 - h1 (kJ/kg)',
            explanation: 'Work input required by the compressor motor per kilogram of refrigerant.',
            example: 'If h2 = 440 kJ/kg and h1 = 405 kJ/kg, Wc = 35 kJ/kg.'
          },
          {
            name: 'Carnot Coefficient of Performance (COP)',
            formula: 'COP_carnot = T_evap / (T_cond - T_evap) [Kelvin]',
            explanation: 'Theoretical maximum thermodynamic efficiency limit of a refrigeration machine.',
            example: 'Evaporator at 4°C (277.15 K) and Condenser at 36°C (309.15 K): COP_carnot = 277.15 / (309.15 - 277.15) = 8.66.'
          }
        ],
        standardsRef: ['AHRI Standard 550/590', 'ISO 5149 Refrigerating systems and heat pumps'],
        practicalTips: [
          'Liquid slugging into the compressor is fatal to valves and scrolls. Superheat at compressor inlet must be maintained at a minimum of 4K under all modulating load conditions.',
          'Subcooling increases the Refrigeration Effect without requiring additional compressor work, directly boosting the system COP.'
        ]
      },
      {
        id: '1-3',
        title: 'Pressure-Enthalpy (P-h) Diagram Analysis',
        subtitle: 'Mapping thermodynamic states, superheat, subcooling, and efficiency lines.',
        readingTime: '7 min read',
        summary: 'The P-h chart (Mollier diagram) is the diagnostic heart of refrigeration engineering, illustrating saturation curves and enthalpy shifts.',
        contentMarkdown: [
          'On a Mollier P-h diagram, pressure is plotted logarithmically on the vertical axis, and enthalpy (h in kJ/kg) is on the linear horizontal axis.',
          'The characteristic "dome" consists of two curves meeting at the Critical Point:',
          '• Saturated Liquid Line (left slope): Points where refrigerant is 100% liquid at its boiling point (quality x = 0).',
          '• Saturated Vapor Line (right slope): Points where refrigerant is 100% vapor with zero liquid remaining (quality x = 1.0).',
          '• Two-Phase Region (inside the dome): Coexistence of liquid and vapor mixture.',
          '• Subcooled Liquid Region (left of dome): Liquid temperature is below boiling point for that pressure.',
          '• Superheated Vapor Region (right of dome): Vapor temperature is above boiling point for that pressure.',
          'Real vs Ideal Cycle: Real compressors suffer isentropic losses (isentropic efficiency ηs ≈ 75% to 85%), causing the compression line (1 → 2) to skew further to the right toward higher enthalpy, requiring more electrical work.'
        ],
        keyFormulas: [
          {
            name: 'Actual Coefficient of Performance (COP)',
            formula: 'COP = Cooling Capacity (kW) / Compressor Power (kW)',
            explanation: 'Ratio of useful thermal heat removed from chilled water to electrical energy consumed.',
            example: 'A chiller extracting 1,758 kW of heat using 280 kW electrical power has a COP of 1758 / 280 = 6.28.'
          },
          {
            name: 'kW per Refrigeration Ton (kW/RT)',
            formula: 'kW/RT = 3.51685 / COP',
            explanation: 'Primary metric used in commercial MEP and Green Mark audits. Lower values signify higher efficiency.',
            example: 'A COP of 6.28 equates to 3.517 / 6.28 = 0.560 kW/RT (Green Mark Platinum rating).'
          }
        ],
        standardsRef: ['BCA Green Mark 2021 Certification Standard', 'ASHRAE Guideline 22'],
        practicalTips: [
          'Every 1°C increase in evaporating temperature improves chiller efficiency by approximately 2% to 3%.',
          'Every 1°C decrease in entering condenser water temperature (ECWT) reduces chiller power consumption by 1.5% to 2.5%.'
        ]
      },
      {
        id: '1-4',
        title: 'Refrigerant Classifications & Environmental Codes',
        subtitle: 'ODP, GWP, Kigali Amendment, and ASHRAE Standard 34 safety classifications.',
        readingTime: '5 min read',
        summary: 'The transition from CFCs and HCFCs to HFCs and next-generation low-GWP hydrofluoroolefins (HFOs).',
        contentMarkdown: [
          'Refrigerants are classified by two critical environmental indices:',
          '• Ozone Depletion Potential (ODP): Relative ability of a substance to destroy stratospheric ozone compared to CFC-11 (ODP = 1.0). Modern refrigerants must have an ODP of 0.0.',
          '• Global Warming Potential (GWP): Relative greenhouse warming impact over a 100-year horizon compared to CO2 (GWP = 1.0).',
          'ASHRAE Standard 34 Safety Group Matrix:',
          'Toxicity: Class A (Lower toxicity, occupational exposure limit ≥ 400 ppm) vs Class B (Higher toxicity, < 400 ppm).',
          'Flammability: Class 1 (No flame propagation), Class 2L (Lower flammability, burning velocity ≤ 10 cm/s), Class 2 (Flammable), Class 3 (Higher flammability, e.g. R-290 Propane).',
          'Key Refrigerants in Modern ACMV:',
          '• R-134a: HFC, ODP = 0, GWP = 1,430, Safety Class A1. Historically standard in centrifugal chillers.',
          '• R-410A: Near-azeotropic HFC blend (50% R-32 / 50% R-125), ODP = 0, GWP = 2,088, Safety Class A1. Common in VRF and packaged DX units, currently being phased down.',
          '• R-32: Difluoromethane HFC, ODP = 0, GWP = 675 (68% lower than R-410A), Safety Class A2L mildly flammable.',
          '• R-1234ze / R-1233zd: Ultra-low GWP HFOs (GWP < 1), Safety Class A2L / A1, emerging standard for high-efficiency Green Mark Platinum chillers.'
        ],
        standardsRef: ['ASHRAE Standard 15 & 34', 'Montreal Protocol & Kigali Amendment'],
        practicalTips: [
          'Chiller plant rooms utilizing A2L mildly flammable refrigerants require dedicated mechanical purge ventilation, continuous refrigerant leak detection sensors, and non-sparking exhaust fans conforming to SS 553 / EN 378.',
          'Always check local building fire codes before specifying R-32 in high-rise ducted air systems due to refrigerant charge weight limits.'
        ]
      }
    ]
  },
  {
    id: 'module-2',
    moduleNumber: '02',
    title: 'Central Chilled Water Plants & Hydronics',
    tagline: 'Centrifugal chillers, cooling towers, primary-secondary loops, and efficiency controls.',
    category: 'Hydronics',
    sections: [
      {
        id: '2-1',
        title: 'Chiller Configurations: Water-Cooled vs Air-Cooled',
        subtitle: 'Compressor technologies: Centrifugal, Screw, Scroll, and Magnetic Levitation.',
        readingTime: '7 min read',
        summary: 'Central chiller selection determines over 40% of an entire commercial building\'s lifetime energy footprint.',
        contentMarkdown: [
          'Water-cooled central chiller plants achieve significantly higher efficiency than air-cooled systems because water is a superior heat transfer medium with a high specific heat capacity (4.186 kJ/kg·K). Furthermore, cooling towers reject heat against ambient wet-bulb temperature (typically 27°C–29°C in tropical climates), whereas air-cooled condensers reject heat against higher ambient dry-bulb temperature (32°C–35°C).',
          'Compressor Typologies:',
          '1. Centrifugal Compressors (300 RT to 3,000+ RT): Dynamic displacement using high-speed impellers. Exceptional full-load and part-load efficiency. Best suited for continuous large commercial buildings.',
          '2. Magnetic Bearing Centrifugal (Turbocor) (60 RT to 1,500 RT): Oil-free magnetic levitation shafts rotating at up to 48,000 RPM. Eliminates oil management, avoids heat transfer degradation from oil fouling on tube surfaces, and delivers superior IPLV (Integrated Part Load Value).',
          '3. Screw Compressors (50 RT to 500 RT): Positive displacement twin helical rotors. Durable, handles wide pressure ratios, and modulates down to 10% capacity via slide valve or VFD.',
          '4. Scroll Compressors (5 RT to 40 RT per unit): Interlocking spiral scrolls. Low noise, minimal moving parts, ideal for modular multi-compressor chillers.'
        ],
        keyFormulas: [
          {
            name: 'Chilled Water Heat Transfer Equation',
            formula: 'Q_chw (kW) = m_dot × Cp × ΔT = 4.186 × Flow (L/s) × ΔT (°C)',
            explanation: 'Calculation of thermal cooling produced by chilled water circulation.',
            example: 'Flow rate of 70 L/s with 7°C supply and 12.5°C return (ΔT = 5.5°C): Q = 4.186 × 70 × 5.5 = 1,611.6 kW (458.2 RT).'
          },
          {
            name: 'Imperial Hydronic Flow Rule of Thumb',
            formula: 'GPM = (24 × RT) / ΔT_F',
            explanation: 'At standard 10°F (5.56°C) design ΔT, chilled water flow requirement is exactly 2.4 GPM per RT.',
            example: 'A 500 RT chiller requires 500 × 2.4 = 1,200 USGPM of chilled water flow.'
          }
        ],
        standardsRef: ['BCA Green Mark Criteria for ACMV', 'ASHRAE 90.1 Energy Standard for Buildings'],
        practicalTips: [
          'Oil fouling in conventional chillers can reduce evaporator heat transfer efficiency by up to 8% to 15% after 5 years of operation. Oil analysis and refrigerant purging must be performed annually.',
          'Pairing centrifugal chillers with variable speed drives (VFD) enables the compressor to slow down during partial load and low wet-bulb conditions, avoiding surging and saving up to 35% electrical power.'
        ]
      },
      {
        id: '2-2',
        title: 'The Dual Hydronic Loop: Chilled Water & Condenser Water',
        subtitle: 'Decoupled headers, primary pumps, secondary pumps, and thermal balances.',
        readingTime: '8 min read',
        summary: 'Hydronic distribution connects the chiller plant room to hundreds of Air Handling Units and rooftop heat rejection towers.',
        contentMarkdown: [
          'A centralized chilled water plant manages two closed/open hydraulic circuits simultaneously:',
          'A. Chilled Water Circuit (Closed Loop):',
          '• Standard Design Temperatures: 6.7°C (44°F) Supply Water Temperature (CHWST) to AHUs, returning at 12.2°C (54°F) (CHWRT), providing a design ΔT of 5.5°C (10°F).',
          '• Decoupled Primary-Secondary Scheme: Primary Chilled Water Pumps (CHWP) supply constant flow across chiller evaporators to prevent freezing. Secondary Chilled Water Pumps (SCHWP) equipped with VFDs distribute water to building AHUs, maintaining differential pressure across the most remote coil.',
          '• Variable Primary Flow (VPF): Modern high-performance plants eliminate secondary pumps, utilizing a single set of variable-speed primary pumps. A fast-acting modulating bypass valve maintains minimum manufacturer evaporator flow.',
          'B. Condenser Water Circuit (Open Loop):',
          '• Water leaves the chiller condenser at 35.0°C (95°F), is pumped by Condenser Water Pumps (CWP) up to the cooling tower, and returns cooled to 29.5°C (85°F). Design ΔT = 5.5°C.',
          '• Total heat rejected by condenser = Evaporator Cooling Load + Compressor Electrical Power Input (typically 1.25 × Cooling Load, or 3.0 GPM/RT).'
        ],
        interactiveType: 'chilled-water-loop',
        keyFormulas: [
          {
            name: 'Condenser Heat Rejection Rate',
            formula: 'Q_cond = Q_evap + W_compressor',
            explanation: 'Energy balance across the chiller. Condenser must reject both the building thermal load and compressor electrical shaft work.',
            example: 'A 1,000 kW cooling load with a 200 kW compressor input rejects 1,200 kW of heat at the cooling tower.'
          },
          {
            name: 'Condenser Water Flow Rate',
            formula: 'Flow_cwp (GPM) ≈ 3.0 GPM / RT',
            explanation: 'Standard design condenser flow rate at 5.5°C (10°F) range.',
            example: 'A 500 RT chiller requires approximately 500 × 3.0 = 1,500 GPM condenser water flow.'
          }
        ],
        standardsRef: ['Singapore SS 553:2016 Code of Practice for ACMV', 'ASHRAE Handbook - HVAC Systems & Equipment'],
        practicalTips: [
          'The hydraulic neutral point (expansion tank connection) should always be located on the suction side of the chilled water pumps to ensure positive gauge pressure across all building circuits, preventing air ingress.',
          'Variable Primary Flow (VPF) reduces initial mechanical equipment capital cost by 20% and eliminates redundant pump casing heat gain into chilled water.'
        ]
      },
      {
        id: '2-3',
        title: 'Cooling Towers & Heat Rejection Physics',
        subtitle: 'Wet-bulb approach, range, drift, and cycles of concentration.',
        readingTime: '6 min read',
        summary: 'Cooling towers exploit evaporative cooling to lower condenser water below outdoor dry-bulb temperature.',
        contentMarkdown: [
          'Cooling towers reject heat through direct mass and heat transfer: warm condenser water is sprayed downward over PVC fill packing while ambient air is drawn upward by an induced draft axial fan.',
          'Key Cooling Tower Metrics:',
          '1. Range (ΔT): Difference between entering warm water temperature and leaving cool water temperature: Range = T_entering - T_leaving (typically 5.0°C to 5.5°C).',
          '2. Approach: Difference between leaving cooled water temperature and ambient outdoor wet-bulb temperature: Approach = T_leaving - T_wb (typically 2.0°C to 3.5°C).',
          'A cooling tower can never cool water below the ambient wet-bulb temperature, because at 100% relative humidity, no net evaporation can take place.',
          '3. Water Quality & Cycles of Concentration (CoC): As pure water evaporates, dissolved solids remain in the basin. Bleed-off and fresh makeup water are required. Singapore PUB and Green Mark require cooling towers to operate at a minimum of 7 to 10 Cycles of Concentration using non-chemical water treatment (magnetic/electrolytic) or reverse osmosis NEWater.'
        ],
        keyFormulas: [
          {
            name: 'Cooling Tower Effectiveness',
            formula: 'Effectiveness (%) = Range / (Range + Approach) × 100',
            explanation: 'Measures how close the cooling tower gets to the theoretical thermodynamic wet-bulb limit.',
            example: 'Range = 5.5°C, Approach = 2.5°C: Effectiveness = 5.5 / (5.5 + 2.5) × 100 = 68.75%.'
          },
          {
            name: 'Evaporation Loss Rate',
            formula: 'E ≈ 0.0018 × Flow (L/s) × Range (°C)',
            explanation: 'Theoretical water loss via evaporation per second.',
            example: 'Flow = 100 L/s with 5.5°C range: E = 0.0018 × 100 × 5.5 = 0.99 L/s (3,564 liters per hour).'
          }
        ],
        standardsRef: ['CTI Standard 201', 'Singapore National Water Agency (PUB) Water Efficiency Guidelines'],
        practicalTips: [
          'Cooling tower fill fouled by algae or scale increases the approach temperature by 1°C to 2°C, raising entering condenser water to the chiller and costing 3% to 5% more chiller electrical power.',
          'Installing VFDs on cooling tower fans linked to leaving water temperature control saves up to 70% fan energy during mild weather or night operation.'
        ]
      },
      {
        id: '2-4',
        title: 'The Low Delta-T Syndrome & Plant Optimization',
        subtitle: 'Causes, energy penalties, premature chiller staging, and engineering remedies.',
        readingTime: '7 min read',
        summary: 'Low Delta-T Syndrome is the #1 efficiency killer in large commercial chilled water networks.',
        contentMarkdown: [
          'What is Low Delta-T Syndrome?',
          'When an ACMV system is designed for a 5.5°C temperature difference (e.g. 7.0°C supply, 12.5°C return), but returns chilled water at only 9.5°C or 10.0°C (ΔT = 2.5°C to 3.0°C).',
          'Why is it catastrophic for facility energy?',
          'Because cooling capacity is Q = m_dot × Cp × ΔT. If ΔT is halved, twice as much chilled water volume must be pumped to satisfy the exact same building heat load!',
          'Consequences:',
          '1. Premature Chiller Staging: Chillers are forced to stage ON because pumps hit maximum flow limits, even though each running chiller is only at 45% to 55% thermal load, dragging chillers out of their sweet spot.',
          '2. Excessive Pumping Energy: Pumps run at full speed, consuming excessive kWh according to the cubic affinity law.',
          'Root Causes:',
          '• Incorrect 3-way modulating bypass valves instead of 2-way pressure-independent control valves (PICV).',
          '• Dirt, scaling, or biofouling on AHU cooling coil air or water surfaces.',
          '• Oversized AHU control valves with poor valve authority causing hunting.',
          '• Coils operating with laminar water flow due to over-throttling.',
          '• Operators lowering supply water temperature setpoint without recalibrating zone dampers.'
        ],
        standardsRef: ['ASHRAE Guideline 22-2012 Instrumentation for Monitoring Central Chilled-Water Plant Efficiency'],
        practicalTips: [
          'Replace conventional modulating globes with Pressure Independent Control Valves (PICVs). PICVs integrate differential pressure regulators, maintaining calibrated flow regardless of system pressure fluctuations.',
          'Audit decoupling bypass line flow. If bypass water is flowing in the forward direction (mixing warm return into supply), you have Low Delta-T or flow deficit.'
        ]
      }
    ]
  },
  {
    id: 'module-3',
    moduleNumber: '03',
    title: 'Air Handling Units & Air Distribution',
    tagline: 'Anatomy of AHUs, VAV systems, filtration standards, and equal friction duct sizing.',
    category: 'Air Systems',
    sections: [
      {
        id: '3-1',
        title: 'Anatomy & Component Sequence of an AHU',
        subtitle: 'Intake louvers, mixing plenums, filter classes, coils, and plug fans.',
        readingTime: '7 min read',
        summary: 'Air Handling Units (AHUs) condition and circulate air as part of the mechanical air distribution system.',
        contentMarkdown: [
          'An industrial Air Handling Unit consists of sequential modules arranged in the direction of airflow:',
          '1. Outdoor Air & Return Air Mixing Plenum: Equipped with motorized modulating dampers that maintain designed minimum fresh air ventilation and return air ratios.',
          '2. Filter Banks: Multi-stage filtration protection:',
          '   • Pre-Filters (MERV 7–8 / ISO Coarse 70%): Pleated synthetic filters to capture coarse dust, pollen, and debris (>10 μm).',
          '   • Secondary Filters (MERV 13–14 / ePM1 80%): Fine pocket or mini-pleat bag filters for sub-micron particulate protection, virus aerosols, and LEED/Green Mark compliance.',
          '3. Chilled Water Cooling Coil: High-conductivity copper tubes with mechanically bonded aluminum fins (typically 4 to 8 rows deep, 10 to 14 fins per inch). Performs both sensible cooling and moisture condensation.',
          '4. Condensate Drain Pan & Deep-Seal P-Trap: Stainless steel pan sloped ≥ 1:50 with water-seal P-trap sized to overcome negative internal fan static suction pressure.',
          '5. Supply Air Fan Assembly: Modern installations utilize direct-drive Electronically Commutated (EC) backward-curved plug fans or fan walls (multiple modular fans in parallel with N+1 redundancy) rather than traditional belt-driven centrifugal fans.',
          '6. Sound Attenuator / Silencer: Acoustic baffles packed with inorganic mineral wool to attenuate low-frequency fan blade pass noise before entering the ductwork.'
        ],
        interactiveType: 'ahu-airflow',
        standardsRef: ['ASHRAE Standard 52.2 (MERV Rating)', 'ISO 16890 Air Filters for General Ventilation'],
        practicalTips: [
          'A dry condensate trap in a draw-through AHU will allow sewer or mechanical room odors to be drawn straight into the supply air stream. Ensure deep-seal traps have primer lines or self-sealing check valves.',
          'Face velocity across a cooling coil must never exceed 2.5 m/s (500 FPM) to prevent condensate water droplets from being stripped off the fins and carried into the downstream ductwork.'
        ]
      },
      {
        id: '3-2',
        title: 'CAV vs VAV Systems & Terminal Units',
        subtitle: 'Constant Air Volume, Variable Air Volume boxes, and reheat dynamics.',
        readingTime: '6 min read',
        summary: 'Comparing airflow modulation strategies to balance occupant thermal comfort with fan energy savings.',
        contentMarkdown: [
          'Constant Air Volume (CAV):',
          'Supplies a fixed volume of air at all times. Temperature is modulated by adjusting cooling coil chilled water valve or electric reheat. Highly inefficient for multi-zone buildings because unoccupied zones receive identical air volumes as fully loaded zones.',
          'Variable Air Volume (VAV):',
          'Supplies air at a constant supply temperature (typically 13°C to 14°C) while modulating the volumetric airflow rate (CFM or L/s) to match the varying thermal load of each perimeter and interior zone.',
          'VAV Terminal Unit Components:',
          '• Airflow Sensor (multipoint averaging Pitot cross) measuring velocity pressure.',
          '• Motorized Damper Actuator responding to zone room thermostat.',
          '• Digital DDC Controller converting differential pressure into calibrated flow (L/s).',
          '• Optional Reheat Coil (electric or hot water) used in perimeter zones during low-load periods to prevent subcooling while maintaining minimum fresh air ventilation (typically 30% minimum damper stop).'
        ],
        standardsRef: ['ASHRAE Standard 90.1 (Section 6.5.2 Reheat Limits)', 'SS 553:2016'],
        practicalTips: [
          'Set VAV minimum stops to the minimum fresh air requirement rather than a generic 50%. Setting minimum stops too high leads to excessive simultaneous cooling and reheating, wasting huge amounts of energy.',
          'Implement Static Pressure Reset control: Poll all VAV damper positions via BMS; reset supply fan static pressure setpoint so at least one critical VAV damper is 90% to 95% open.'
        ]
      },
      {
        id: '3-3',
        title: 'Duct Design Principles & Equal Friction Method',
        subtitle: 'Sizing calculations, velocity criteria, aspect ratio, and acoustic attenuation.',
        readingTime: '8 min read',
        summary: 'Proper duct sizing balances fan static pressure losses, acoustic limits, and architectural ceiling space.',
        contentMarkdown: [
          'Duct sizing methods in commercial building engineering:',
          '1. Equal Friction Method: The most widely applied engineering standard. The duct system is sized for a constant pressure drop per unit length (typically 0.8 to 1.0 Pa/m in SI units, or 0.08 to 0.10 in.wg per 100 ft in Imperial).',
          '2. Velocity Reduction Method: Main trunk velocities are set at highest permissible limits and systematically stepped down in branch takeoffs to minimize sound.',
          '3. Static Regain Method: Used in high-velocity VAV main supply trunks where velocity reduction after takeoffs is calculated to convert dynamic pressure into static pressure, equalizing pressure at each terminal.',
          'Maximum Recommended Air Velocities for Low-Noise Commercial Offices:',
          '• Main Supply Trunk: 6.0 to 7.5 m/s (1,200 to 1,500 FPM)',
          '• Branch Ducts: 4.0 to 5.0 m/s (800 to 1,000 FPM)',
          '• Flexible Runouts to Diffusers: 2.5 to 3.5 m/s (500 to 700 FPM)',
          '• Diffuser Face Velocity: 1.5 to 2.2 m/s (300 to 450 FPM)',
          'Duct Aspect Ratio: The ratio of duct width to height (W/H). Keep aspect ratios below 3:1 (maximum 4:1). Flat wide rectangular ducts have higher surface friction, require heavier gauge metal, and leak significantly more air.'
        ],
        keyFormulas: [
          {
            name: 'Airflow Velocity Equation',
            formula: 'V = Q / A (m/s)',
            explanation: 'V = air velocity (m/s), Q = airflow (m³/s), A = cross-sectional area (m²).',
            example: 'Airflow of 1.2 m³/s through a 600 mm × 400 mm duct (Area = 0.24 m²): V = 1.2 / 0.24 = 5.0 m/s.'
          },
          {
            name: 'Equivalent Circular Diameter (Huebscher Equation)',
            formula: 'De = 1.30 × (a × b)^0.625 / (a + b)^0.25',
            explanation: 'Converts rectangular duct dimensions (a × b) to circular diameter having identical friction loss.',
            example: 'For a 500 mm × 300 mm duct: De ≈ 418 mm.'
          }
        ],
        standardsRef: ['SMACNA HVAC Duct Construction Standards', 'CIBSE Guide C - Reference Data'],
        practicalTips: [
          'Never install flexible ducting longer than 1.5 to 2.0 meters. Flexible ducts have 2 to 3 times the friction factor of sheet metal, and bends create massive turbulence and noise.',
          'Always specify turning vanes in 90° mitered rectangular elbows. A standard mitered elbow without vanes has an equivalent length of up to 15 meters of straight duct!'
        ]
      }
    ]
  },
  {
    id: 'module-4',
    moduleNumber: '04',
    title: 'Mechanical Ventilation & Fire Life Safety',
    tagline: 'Fresh air rates, carpark jet fans, staircase pressurization, and smoke spill systems.',
    category: 'Ventilation',
    sections: [
      {
        id: '4-1',
        title: 'Ventilation Standards & Indoor Air Quality (IAQ)',
        subtitle: 'Fresh air delivery rates, CO2 limits, and Demand Controlled Ventilation (DCV).',
        readingTime: '6 min read',
        summary: 'Mechanical ventilation dilutes indoor bio-effluents, CO2, formaldehyde, and volatile organic compounds (VOCs).',
        contentMarkdown: [
          'Adequate fresh outdoor air delivery is essential to avoid Sick Building Syndrome (SBS) and maintain cognitive productivity.',
          'Key Standards Benchmarks (SS 553 & ASHRAE 62.1):',
          '• Commercial Offices: Minimum 5.5 to 10 L/s per person, or 0.6 L/s per m² of floor area.',
          '• Classrooms & Lecture Halls: Minimum 8.0 L/s per person.',
          '• Toilets & Restrooms: Continuous exhaust of 10 to 15 air changes per hour (ACH) or minimum 25 to 50 L/s per water closet.',
          'Demand-Controlled Ventilation (DCV):',
          'Instead of introducing constant maximum fresh air volume during low-occupancy periods, CO2 sensors installed in return air ducts or occupied zones modulate outdoor air intake dampers. Outdoor air background CO2 is ~420 ppm. Indoor setpoints target ≤ 800 to 1,000 ppm. When CO2 drops below 700 ppm, outdoor air dampers throttle back, preventing excessive humid outdoor air from overwhelming the cooling coil.'
        ],
        interactiveType: 'ventilation-rates',
        keyFormulas: [
          {
            name: 'Ventilation Air Rate (Combined Occupant & Area Method)',
            formula: 'V_bz = (R_p × P_z) + (R_a × A_z)',
            explanation: 'R_p = outdoor airflow rate per person, P_z = zone population, R_a = outdoor airflow rate per unit area, A_z = zone area.',
            example: 'Office of 500 m² with 40 occupants: V_bz = (5.5 × 40) + (0.6 × 500) = 220 + 300 = 520 L/s.'
          }
        ],
        standardsRef: ['Singapore SS 553:2016 Code of Practice for ACMV', 'ASHRAE Standard 62.1-2022'],
        practicalTips: [
          'In tropical humid regions, never introduce unconditioned outdoor air directly into building occupied spaces. Fresh air must be pre-cooled and dehumidified using dedicated outdoor air units (DOAS) with heat recovery wheels.',
          'Maintain conditioned buildings under slight positive pressure (+10 to +25 Pa) relative to the outdoors to prevent hot, humid outdoor air and airborne moisture from infiltrating through door cracks and facade joints.'
        ]
      },
      {
        id: '4-2',
        title: 'Basement Carpark Ventilation: Jet Fan Impulse Systems',
        subtitle: 'Induction physics, Carbon Monoxide monitoring, and fire smoke purge.',
        readingTime: '7 min read',
        summary: 'Modern underground carparks eliminate bulky ductwork by employing high-velocity thrust jet fans.',
        contentMarkdown: [
          'Traditional ducted carpark exhaust systems require heavy sheet metal ducting suspended along driveways, severely reducing vehicle headroom and clashing with sprinkler pipes and cable trays.',
          'Impulse / Jet Fan Induction Systems:',
          'Small, high-velocity axial fans (thrust rating 30 N to 100 N) suspended from the ceiling induce large volumes of surrounding air via momentum transfer (induction ratio 1:8 to 1:12), pushing air along the driveway toward exhaust louvers.',
          'Dual Operation Modes:',
          '1. Daily CO Dilution Mode: Operates at 50% fan speed to maintain Carbon Monoxide levels ≤ 25 ppm (8-hour weighted average) or ≤ 50 ppm peak. Typically provides 4 to 6 Air Changes per Hour (ACH).',
          '2. Emergency Fire Smoke Purge Mode: Triggered by building fire alarm signal. Fans ramp to 100% full speed, delivering 9 to 10 ACH to sweep smoke toward designated smoke spill extract shafts, ensuring a clear smoke-free layer (> 2.0 m height) for fire-fighting personnel.'
        ],
        standardsRef: ['Singapore Fire Code (SCDF) Cl. 7.1.9', 'BS 7346-7 Components for smoke and heat control systems'],
        practicalTips: [
          'CFD (Computational Fluid Dynamics) simulation is mandatory during design to verify that jet fan throw patterns eliminate stagnant pockets and dead zones behind pillars.',
          'Jet fan motors in carparks must be fire-rated: Class H insulated to operate continuously for at least 2 hours at 250°C to 300°C.'
        ]
      },
      {
        id: '4-3',
        title: 'Staircase Pressurization & Life Safety Smoke Control',
        subtitle: '50 Pa positive pressure envelope, door opening velocities, and barometric relief.',
        readingTime: '7 min read',
        summary: 'Emergency escape stairs must remain smoke-free pressurized refuges during high-rise fire incidents.',
        contentMarkdown: [
          'During a high-rise building fire, toxic smoke and superheated combustion gases are the primary cause of fatalities. Due to the "stack effect" (temperature difference between indoor and outdoor air), smoke naturally rushes into vertical stairwells and elevator shafts unless mechanically counteracted.',
          'The Staircase Pressurization System (SPS) maintains a positive pressure barrier relative to adjacent corridors and fire lobbies:',
          'Dual Safety Criteria (SS 553 / NFPA 92 / BS EN 12101):',
          '1. Closed-Door Condition: When all fire exit doors are closed, the staircase must be pressurized to a minimum of 50 Pa (± 10%) above the accommodation floor.',
          '   • Maximum Door Opening Force: Pressure must never exceed 60 Pa to ensure an occupant (including children or elderly) can push the door open without exceeding 110 Newtons (25 lbs) of handle force.',
          '2. Open-Door Condition: When a design number of doors are held open simultaneously (typically 2 to 3 doors simulating active evacuation), the system must discharge sufficient air velocity through the door frame (minimum 1.0 m/s average face velocity) to prevent smoke backdraft into the stairwell.',
          'Pressure Control Methods:',
          '• Barometric Gravity Relief Dampers venting excess pressure outdoors.',
          '• Motorized Bypass Dampers with high-speed modulating actuators.',
          '• VFD Fan control with static pressure transducers located at top, middle, and bottom stairwell landings.'
        ],
        keyFormulas: [
          {
            name: 'Airflow Through Door Opening (Velocity Method)',
            formula: 'Q_door = A_door × V_target = (W × H) × 1.0 m/s',
            explanation: 'Required airflow to prevent smoke infiltration across an opened fire door.',
            example: 'Standard fire door of 0.9 m × 2.1 m (Area = 1.89 m²): Required airflow = 1.89 × 1.0 = 1.89 m³/s (4,000 CFM) per open door.'
          },
          {
            name: 'Air Leakage Through Closed Cracks',
            formula: 'Q_leak = 0.83 × A_crack × (ΔP)^0.5',
            explanation: 'Air volume escaping through door perimeter gaps at 50 Pa differential pressure.',
            example: 'Crack area of 0.03 m² at 50 Pa: Q_leak = 0.83 × 0.03 × √50 = 0.176 m³/s.'
          }
        ],
        standardsRef: ['Singapore Fire Code Chapter 7', 'NFPA 92 Standard for Smoke Control Systems'],
        practicalTips: [
          'Multiple air injection points are required for staircases exceeding 8 stories. A single bottom injection fan will cause massive overpressure at the ground floor (doors impossible to open) and underpressure at the roof.',
          'Staircase pressurization supply air intakes must be located outdoors at ground or roof level, positioned at least 5 meters away from any smoke discharge, kitchen exhaust, or cooling tower plume.'
        ]
      }
    ]
  },
  {
    id: 'module-5',
    moduleNumber: '05',
    title: 'Psychrometrics, Green Mark & Energy Optimization',
    tagline: 'Moist air properties, psychrometric coil processes, BCA Green Mark, and affinity laws.',
    category: 'Energy & Controls',
    sections: [
      {
        id: '5-1',
        title: 'The Psychrometric Chart & Moist Air Properties',
        subtitle: 'Dry bulb, wet bulb, dew point, relative humidity, specific humidity, and enthalpy.',
        readingTime: '8 min read',
        summary: 'Mastering the seven interrelated physical properties that define atmospheric air and moisture content.',
        contentMarkdown: [
          'Psychrometrics is the science of moist air thermodynamic properties. Any single state point on the chart is fully fixed when at least TWO independent properties are known:',
          '1. Dry-Bulb Temperature (T_db, °C): Standard ambient air temperature measured by an ordinary shielded thermometer.',
          '2. Wet-Bulb Temperature (T_wb, °C): Temperature measured by a thermometer covered with a water-wetted wick exposed to rapid air stream. Indicates the lowest temperature achievable by evaporative cooling.',
          '3. Dew-Point Temperature (T_dp, °C): The temperature at which water vapor begins to condense out of air. Directly correlated to absolute humidity.',
          '4. Relative Humidity (RH, %): Ratio of current partial water vapor pressure to saturation vapor pressure at that dry-bulb temperature.',
          '5. Humidity Ratio / Specific Humidity (w, g/kg dry air): Actual mass of water vapor per unit mass of dry air.',
          '6. Specific Enthalpy (h, kJ/kg dry air): Total thermal energy content (sensible + latent) per kg of dry air: h ≈ 1.006 × T_db + w × (2501 + 1.86 × T_db).',
          '7. Specific Volume (v, m³/kg): Volume occupied per kilogram of dry air (typically 0.82 to 0.90 m³/kg).'
        ],
        interactiveType: 'green-mark-scale',
        standardsRef: ['ASHRAE Psychrometrics Chart No. 1', 'ISO 7726 Ergonomics of the Thermal Environment'],
        practicalTips: [
          'When Relative Humidity is 100% (Saturation Curve), Dry-Bulb, Wet-Bulb, and Dew-Point temperatures are all exactly identical.',
          'In Singapore (tropical climate), typical outdoor design conditions are 32.5°C Dry Bulb, 27.5°C Wet Bulb (70% RH), containing ~21.5 g/kg of moisture. Indoor comfort requires 23.5°C DB and 55% RH (~9.8 g/kg moisture), requiring extraction of 11.7 grams of water per kg of outdoor air!'
        ]
      },
      {
        id: '5-2',
        title: 'Psychrometric Processes in Air Conditioning',
        subtitle: 'Sensible cooling, dehumidification, adiabatic air mixing, and Sensible Heat Ratio.',
        readingTime: '8 min read',
        summary: 'Tracing the path of air as it mixes, passes across chilled water coils, and is supplied into buildings.',
        contentMarkdown: [
          'Core Psychrometric Transformations:',
          '1. Adiabatic Mixing of Two Air Streams: Outdoor Fresh Air (O) mixes with Building Return Air (R) in the AHU plenum. The resulting Mixed Air point (M) lies on the straight line connecting O and R, divided in inverse proportion to mass flow rates: T_ma = (Q_oa × T_oa + Q_ra × T_ra) / (Q_oa + Q_ra).',
          '2. Cooling & Dehumidification (M → S): Mixed air passes across a chilled water coil whose surface temperature (Apparatus Dew Point, ADP ≈ 8°C–10°C) is below the entering air dew point. Moisture condenses out. Air temperature drops and humidity ratio falls from w_m to w_s.',
          '3. Bypass Factor (BF): Not all air molecules make direct physical contact with coil fins. The fraction that slips through uncontacted is the coil Bypass Factor (typically 0.05 to 0.15 for deep 6-to-8 row commercial coils).',
          '4. Sensible Heat Ratio (SHR): Ratio of sensible cooling capacity to total (sensible + latent) cooling capacity: SHR = Q_sensible / Q_total.',
          '• High sensible loads (server rooms, dry auditoriums): SHR ≈ 0.85 to 0.95.',
          '• High latent loads (dance studios, tropical fresh air units, gymnasiums): SHR ≈ 0.55 to 0.70.'
        ],
        keyFormulas: [
          {
            name: 'Air Stream Mixing Temperature',
            formula: 'T_mix = (T_oa × %OA) + (T_ra × %RA)',
            explanation: 'Linear enthalpy/temperature balance of mixed outdoor and return air.',
            example: 'Outdoor 32°C at 20% fresh air, Return 24°C at 80%: T_mix = (32 × 0.20) + (24 × 0.80) = 6.4 + 19.2 = 25.6°C.'
          },
          {
            name: 'Sensible Heat Ratio (SHR)',
            formula: 'SHR = Q_sensible / (Q_sensible + Q_latent)',
            explanation: 'Defines the slope of the condition line on the psychrometric chart.',
            example: 'Sensible load = 70 kW, Latent load = 30 kW: SHR = 70 / (70 + 30) = 0.70.'
          }
        ],
        standardsRef: ['ASHRAE Fundamentals Handbook - Psychrometrics', 'CIBSE Guide B'],
        practicalTips: [
          'If an AHU cooling coil has too high a bypass factor (e.g. 0.25 due to missing coil baffles), supply air will not be sufficiently dehumidified, resulting in clammy, high-humidity complaints in offices even when dry-bulb temperature is 23°C.',
          'Always slope condensate drain lines at minimum 1% gradient with adequate cleanouts to prevent bio-slime accumulation and Legionella proliferation.'
        ]
      },
      {
        id: '5-3',
        title: 'BCA Green Mark, ASHRAE 90.1 & Central Plant Metrics',
        subtitle: 'kW/RT benchmarks, COP, IPLV, and energy audit measurement instrumentation.',
        readingTime: '7 min read',
        summary: 'Evaluating central chilled water plant energy efficiency under Singapore BCA Green Mark Platinum standards.',
        contentMarkdown: [
          'In modern sustainable architecture, central chiller plant efficiency is evaluated as an integrated system, not just the chiller compressor alone:',
          'System Total Plant Efficiency (kW/RT):',
          'kW/RT_plant = (kW_chillers + kW_chw_pumps + kW_cw_pumps + kW_cooling_towers) / Total Cooling Load (RT).',
          'BCA Green Mark 2021 Platinum Performance Standard:',
          '• Chilled Water Plant Operating Efficiency: ≤ 0.58 kW/RT (COP ≥ 6.06) for plants ≥ 500 RT.',
          '• Green Mark Gold Plus: ≤ 0.65 kW/RT.',
          '• Green Mark Gold: ≤ 0.70 kW/RT.',
          '• Standard Baseline Plant: 0.85 to 1.10 kW/RT.',
          'Component Breakdown of a World-Class 0.58 kW/RT Plant:',
          '• Water-Cooled Chiller: 0.45 to 0.48 kW/RT',
          '• Chilled Water Pumps (CHWP): 0.03 to 0.04 kW/RT',
          '• Condenser Water Pumps (CWP): 0.03 to 0.04 kW/RT',
          '• Cooling Tower Fans: 0.02 to 0.03 kW/RT',
          'System Instrumentation Requirements for Audit:',
          '• Chilled water flow meter: Magnetic flow meter with accuracy ± 1.0%.',
          '• Temperature sensors: Matched pair 4-wire RTD (Pt100 or Pt1000) with end-to-end uncertainty ≤ ± 0.05°C.',
          '• Power meters: Class 0.5 or Class 0.2 power meters monitoring true RMS active power (kW).'
        ],
        keyFormulas: [
          {
            name: 'Overall Chilled Water Plant Efficiency',
            formula: 'kW/RT = Total Electrical Power (kW) / Instantaneous Cooling Load (RT)',
            explanation: 'Includes all chillers, primary/secondary pumps, and cooling tower fans.',
            example: 'Total plant power = 580 kW delivering 1,000 RT cooling load: 580 / 1000 = 0.580 kW/RT.'
          },
          {
            name: 'Affinity Laws for Pumps & Fans',
            formula: 'Flow: Q2/Q1 = N2/N1 | Head: H2/H1 = (N2/N1)^2 | Power: P2/P1 = (N2/N1)^3',
            explanation: 'Power consumed varies with the cube of the rotational speed (N).',
            example: 'Reducing fan or pump speed from 100% to 80% (N2/N1 = 0.8): Power drops to (0.8)^3 = 0.512 (48.8% energy reduction!).'
          }
        ],
        standardsRef: ['Singapore BCA Green Mark 2021 Certification Standard', 'SS 530 Energy efficiency standard for building services'],
        practicalTips: [
          'The cubic affinity law is why Variable Speed Drives (VFDs) on pumps and fans yield massive energy paybacks in under 2 years.',
          'A temperature sensor error of just 0.5°C in a 5.0°C ΔT chilled water loop introduces a 10% calculation error in cooling load, completely invalidating energy efficiency audits.'
        ]
      }
    ]
  }
];
