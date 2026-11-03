import { QuizQuestion } from '../types/acmv';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Thermodynamics & Heat Transfer',
    question: 'A commercial office building AHU has a cooling coil delivering 140 kW of sensible cooling and 60 kW of latent cooling. What is the Sensible Heat Ratio (SHR) of this process?',
    options: [
      '0.43',
      '0.70',
      '1.40',
      '2.33'
    ],
    correctIndex: 1,
    explanation: 'Sensible Heat Ratio (SHR) is defined as Sensible Cooling Capacity divided by Total Cooling Capacity (Sensible + Latent). SHR = 140 / (140 + 60) = 140 / 200 = 0.70.',
    formulaUsed: 'SHR = Q_sensible / (Q_sensible + Q_latent)',
    standardsNote: 'ASHRAE Fundamentals Handbook - Psychrometrics'
  },
  {
    id: 2,
    topic: 'Central Chilled Water Plants',
    question: 'A chilled water plant circulates 80 L/s of water with a supply temperature of 6.5°C and return temperature of 12.0°C. What is the instantaneous cooling load delivered in Refrigeration Tons (RT)?',
    options: [
      '248 RT',
      '450 RT',
      '524 RT',
      '1,842 RT'
    ],
    correctIndex: 2,
    explanation: 'Thermal capacity Q = 4.186 kJ/kg·K × 80 L/s × (12.0 - 6.5)°C = 4.186 × 80 × 5.5 = 1,841.84 kW. Converting to RT: 1,841.84 / 3.51685 = 523.7 RT ≈ 524 RT.',
    formulaUsed: 'Q (kW) = 4.186 × Flow (L/s) × ΔT (°C) | RT = kW / 3.517',
    standardsNote: 'Singapore SS 553:2016'
  },
  {
    id: 3,
    topic: 'Energy Efficiency & Green Mark',
    question: 'During a Green Mark audit, a 1,200 RT central plant registers total electrical consumption of 672 kW across all chillers, pumps, and cooling tower fans. What is the overall plant operating efficiency in kW/RT, and what BCA Green Mark tier does it qualify for?',
    options: [
      '0.48 kW/RT — Standard baseline',
      '0.56 kW/RT — Green Mark Platinum (≤ 0.58 kW/RT)',
      '0.68 kW/RT — Green Mark Gold',
      '0.82 kW/RT — Non-compliant'
    ],
    correctIndex: 1,
    explanation: 'Overall plant efficiency = Total Electrical Power / Cooling Load = 672 kW / 1,200 RT = 0.560 kW/RT. Under Singapore BCA Green Mark 2021, a chilled water plant operating efficiency ≤ 0.58 kW/RT achieves the highest Platinum certification tier.',
    formulaUsed: 'Plant kW/RT = Total Plant Power (kW) / Total Cooling Load (RT)',
    standardsNote: 'BCA Green Mark 2021 Certification Standard'
  },
  {
    id: 4,
    topic: 'Hydronics & Troubleshooting',
    question: 'Which of the following is the PRIMARY cause of "Low Delta-T Syndrome" in a chilled water network?',
    options: [
      'Operating chillers at 100% full load',
      'Condenser water temperature being too low in winter',
      'Uncontrolled 3-way modulating bypass valves and oversized AHU control valves',
      'Excessive refrigerant superheat at compressor suction'
    ],
    correctIndex: 2,
    explanation: 'Low Delta-T syndrome occurs when chilled water returns to the plant room much cooler than designed (e.g. 9.5°C instead of 12.5°C). The primary causes are 3-way bypass valves dumping cold supply directly into return headers, dirty cooling coils failing to transfer heat, and hunting oversized 2-way valves.',
    standardsNote: 'ASHRAE Guideline 22'
  },
  {
    id: 5,
    topic: 'Affinity Laws & Pump Optimization',
    question: 'A chilled water secondary pump motor operates at 50 Hz consuming 30 kW. If a Variable Speed Drive (VFD) slows the pump speed down to 40 Hz (80% speed), what is the estimated new electrical power consumption?',
    options: [
      '24.0 kW',
      '19.2 kW',
      '15.36 kW',
      '9.6 kW'
    ],
    correctIndex: 2,
    explanation: 'According to the pump Affinity Laws, power varies with the cube of the rotational speed: P2 = P1 × (N2 / N1)³. Here N2 / N1 = 40 / 50 = 0.8. New Power = 30 kW × (0.8)³ = 30 × 0.512 = 15.36 kW. This represents nearly a 49% energy saving!',
    formulaUsed: 'P2 = P1 × (N2 / N1)³',
    standardsNote: 'Hydraulic Institute Standards & ASHRAE 90.1'
  },
  {
    id: 6,
    topic: 'Air Distribution & Duct Design',
    question: 'Using the Equal Friction method for low-noise commercial office ductwork, what is the standard recommended pressure drop design limit per unit length?',
    options: [
      '0.05 to 0.10 Pa/m',
      '0.80 to 1.00 Pa/m (0.08 to 0.10 in.wg/100 ft)',
      '5.00 to 7.50 Pa/m',
      '15.0 to 20.0 Pa/m'
    ],
    correctIndex: 1,
    explanation: 'In commercial building engineering, the Equal Friction method sizes duct networks at a constant pressure loss of 0.8 to 1.0 Pa/m (SI) or 0.08 to 0.10 in.wg per 100 ft (Imperial). Exceeding 1.2 Pa/m creates high air velocity and unacceptable aerodynamic noise in office occupied zones.',
    standardsNote: 'SMACNA HVAC Duct Construction Standards & CIBSE Guide C'
  },
  {
    id: 7,
    topic: 'Mechanical Ventilation & Fire Safety',
    question: 'Under the Singapore Fire Code (SCDF) and SS 553, what is the design positive pressure required within a fire escape staircase with all exit doors closed?',
    options: [
      '10 Pa',
      '25 Pa',
      '50 Pa (± 10%)',
      '100 Pa'
    ],
    correctIndex: 2,
    explanation: 'Staircase pressurization systems must maintain 50 Pa positive pressure relative to adjacent accommodation spaces with all doors closed. To ensure occupants can open the exit doors without excessive manual force (limit 110 N), pressure must not exceed 60 Pa.',
    standardsNote: 'Singapore Fire Code (SCDF) Cl. 7.1.3 & NFPA 92'
  },
  {
    id: 8,
    topic: 'Cooling Towers & Heat Rejection',
    question: 'In a water-cooled central plant, entering condenser water temperature (ECWT) is 29.5°C and leaving condenser water temperature (LCWT) is 35.0°C. If ambient outdoor wet-bulb temperature is 27.0°C, what is the cooling tower "Approach"?',
    options: [
      '2.5°C',
      '5.5°C',
      '8.0°C',
      '29.5°C'
    ],
    correctIndex: 0,
    explanation: 'Cooling tower Approach is defined as leaving water temperature minus ambient wet-bulb temperature: Approach = T_leaving - T_wb = 29.5°C - 27.0°C = 2.5°C. The Range is T_entering - T_leaving = 35.0 - 29.5 = 5.5°C.',
    formulaUsed: 'Approach = T_leaving - T_ambient_wb',
    standardsNote: 'Cooling Technology Institute (CTI) Standard 201'
  },
  {
    id: 9,
    topic: 'Refrigeration Cycle Mechanics',
    question: 'In an ideal vapor-compression refrigeration cycle, what type of thermodynamic process occurs across the expansion valve (TXV/EEV)?',
    options: [
      'Isentropic (constant entropy)',
      'Isothermal (constant temperature)',
      'Isenthalpic (constant enthalpy)',
      'Isobaric (constant pressure)'
    ],
    correctIndex: 2,
    explanation: 'The throttling process across an expansion valve is assumed to be adiabatic with no external shaft work extracted (W = 0, Q = 0). Therefore, from the first law of thermodynamics, enthalpy remains constant: h3 = h4 (isenthalpic process).',
    standardsNote: 'Thermodynamics of Refrigeration Systems'
  },
  {
    id: 10,
    topic: 'Indoor Air Quality & Demand Control',
    question: 'In Demand-Controlled Ventilation (DCV), what indoor sensor metric is primarily monitored to modulate outdoor air intake dampers in real-time?',
    options: [
      'Carbon Monoxide (CO) in ppm',
      'Carbon Dioxide (CO2) in ppm',
      'Relative Humidity percentage (%RH)',
      'Particulate Matter PM2.5 in μg/m³'
    ],
    correctIndex: 1,
    explanation: 'Human metabolic respiration emits Carbon Dioxide (CO2). Indoor CO2 levels directly indicate occupant density and bio-effluent buildup. DCV modulates fresh air intake to maintain indoor CO2 between 800 and 1,000 ppm, throttling dampers during low occupancy to save significant cooling energy.',
    standardsNote: 'ASHRAE Standard 62.1 & SS 553:2016'
  }
];
