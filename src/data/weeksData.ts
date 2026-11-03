export interface WeekResource {
  label: string;
  pdfPath?: string;
  isAvailable: boolean;
  type: 'lecture' | 'tutorial' | 'solution' | 'reference' | 'worksheet';
}

export interface WeekTutorialQuestion {
  questionNumber: string;
  prompt: string;
  solutionSteps: string[];
  finalAnswer: string;
}

export interface WeekData {
  weekNumber: number;
  dateStr: string;
  dayStr: string;
  venue: string;
  venueType: 'classroom' | 'online' | 'lab' | 'break' | 'exam';
  iconType: 'refrigeration' | 'equipment' | 'duct' | 'chiller' | 'pipe' | 'test' | 'recess' | 'design' | 'ettv' | 'load' | 'psychrometric';
  keyFormulaOrCode: string;
  title: string;
  summary: string;
  keyConcepts: string[];
  tutorialQuestions: WeekTutorialQuestion[];
  resources: WeekResource[];
  labTabId?: string; // e.g. 'refrigeration', 'ac-systems', 'ducts', 'chiller', 'pipes', 'ettv', 'cooling-load', 'psychrometrics'
  isSpecial?: 'recess' | 'test' | 'practical';
}

export const WEEKS_DATA: WeekData[] = [
  // ===================== WEEK 1 =====================
  {
    weekNumber: 1,
    dateStr: 'Thu 22/10/2026',
    dayStr: 'Thursday',
    venue: 'LT 51B',
    venueType: 'classroom',
    iconType: 'refrigeration',
    keyFormulaOrCode: '1 RT = 3.517 kW',
    title: 'Types of Air-conditioning Systems',
    summary: 'Direct expansion (DX) vs central chilled water systems, CAV vs VAV, FCU, Thermal Energy Storage (TES), and Singapore District Cooling (SDC).',
    keyConcepts: [
      'Cold is the absence of heat; cooling extracts energy from indoor air and rejects it to the ambient outdoors.',
      'Sensible heat alters dry-bulb temperature; latent heat condenses airborne moisture at constant temperature.',
      '1 Refrigeration Ton (RT) = 12,000 BTU/h = 3.51685 kW (energy to freeze 1 short ton of water at 0°C in 24 hours).',
      'Direct Expansion (DX) uses refrigerant directly in room coils; central plants circulate chilled water at 6.7°C to AHUs/FCUs.',
      'Singapore District Cooling (Marina Bay & Keppel DHCS) centralizes chilled water at 6°C ± 0.5°C with return > 14°C.',
      'Thermal Energy Storage (TES) shifts electrical consumption to off-peak night hours when tariffs are discounted.',
    ],
    tutorialQuestions: [
      {
        questionNumber: 'AMVS 1 · Q1',
        prompt: 'Explain the main difference between a DX (Direct Expansion) and a chilled water system.',
        solutionSteps: [
          'In a DX system, refrigerant evaporates directly inside the cooling coil located in the room or AHU, directly cooling the indoor air.',
          'In a Chilled Water system, refrigerant evaporates in a central chiller to produce chilled water (typically 6.7°C to 8.0°C), which is then pumped through a secondary pipe network to AHUs and FCUs across the building.',
        ],
        finalAnswer: 'DX circulates refrigerant directly into room evaporator coils; Chilled Water uses water as a secondary heat transfer fluid pumped from a central plant.',
      },
      {
        questionNumber: 'AMVS 1 · Q4(c)',
        prompt: 'The rated cooling capacity of a split unit is 18,000 Btu/h. What is its rating in RT?',
        solutionSteps: [
          'Conversion formula: 1 RT = 12,000 Btu/h.',
          'Capacity (RT) = 18,000 / 12,000 = 1.50 RT.',
        ],
        finalAnswer: '1.50 RT (or 5.27 kW)',
      },
      {
        questionNumber: 'AMVS 1 · Q5',
        prompt: 'A water-cooled chiller consumes 480 kWe when providing a cooling capacity of 3600 kWr. What is its efficiency in terms of kWe/RT and COP?',
        solutionSteps: [
          'Cooling capacity in RT = 3600 kW / 3.517 = 1,023.6 RT.',
          'Efficiency (kWe/RT) = Chiller electrical power / Cooling RT = 480 / 1023.6 = 0.469 kWe/RT.',
          'COP = Cooling kW / Electrical kW = 3600 / 480 = 7.50.',
          'Verification: kWe/RT = 3.517 / COP = 3.517 / 7.50 = 0.469 kWe/RT.',
        ],
        finalAnswer: '0.469 kWe/RT | COP = 7.50',
      },
    ],
    resources: [
      { label: 'Lesson 1 Module Introduction (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_1_Module_Introduction_Apr26_1c9b0222.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Lesson 1 AC System Part 1 (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_1_Air-conditional_System_Part1_Apr26_44a6b178.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Lesson 2 AC System Part 2 (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_2_Air-Conditioning_Syste__Part_2_Apr_26_0c5cb21b.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Tutorial AMVS 1 Problem Sheet (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Tutorial_1_Apr_26_c1496a6f.pdf`, isAvailable: true, type: 'tutorial' },
    ],
    labTabId: 'refrigeration',
  },

  // ===================== WEEK 2 =====================
  {
    weekNumber: 2,
    dateStr: 'Wed 28/10/2026',
    dayStr: 'Wednesday',
    venue: 'MS Teams',
    venueType: 'online',
    iconType: 'design',
    keyFormulaOrCode: 'SS 553: 23–25°C · RH ≤ 65%',
    title: 'Air Systems, Indoor and Outdoor Design Conditions',
    summary: 'Singapore SS 553 statutory thermal comfort criteria, outdoor design conditions (33.5°C DB / 27.5°C WB), outdoor fresh air ventilation rates, and sensible/latent heat split.',
    keyConcepts: [
      'Singapore SS 553 indoor comfort standards: 23°C to 25°C Dry Bulb, Relative Humidity ≤ 65%, air movement ≤ 0.30 m/s.',
      'Singapore outdoor design condition: 33.5°C Dry Bulb, 27.5°C Wet Bulb (coincident with peak solar irradiation).',
      'Fresh air ventilation rates per occupant: 5.5 to 10 L/s per person depending on occupancy classification (offices vs auditoriums).',
      'Air distribution patterns: Constant Air Volume (CAV) for uniform heat load; Variable Air Volume (VAV) for perimeter/interior zoning.',
      'Positive room pressure (+10 to +25 Pa) prevents humid outdoor air and particulate infiltration through door cracks.',
    ],
    tutorialQuestions: [
      {
        questionNumber: 'Lesson 9 · Review Q1',
        prompt: 'State the recommended indoor design conditions specified under Singapore Standard SS 553:2016 for commercial offices.',
        solutionSteps: [
          '1. Dry Bulb Temperature: 23°C to 25°C (target 24°C).',
          '2. Relative Humidity: ≤ 65% (prevents mold growth while ensuring occupant comfort).',
          '3. Air Velocity: 0.15 m/s to 0.30 m/s (avoids perceptible draughts yet prevents air stagnation).',
        ],
        finalAnswer: 'DB: 23–25°C | RH: ≤ 65% | Velocity: 0.15–0.30 m/s',
      },
    ],
    resources: [
      { label: 'Lesson 9 Design Lecture Slides (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_9_Design_Apr_26_ce5bf399.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Psychrometric Chart (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Psychrometric_chart_1dc90027.pdf`, isAvailable: true, type: 'reference' },
    ],
    labTabId: 'psychrometrics',
  },

  // ===================== WEEK 3 (CURRENT UPCOMING LESSON) =====================
  {
    weekNumber: 3,
    dateStr: 'Thu 05/11/2026',
    dayStr: 'Thursday',
    venue: 'MS Teams',
    venueType: 'online',
    iconType: 'ettv',
    keyFormulaOrCode: 'U = 1/RT · ETTV ≤ 50 W/m²',
    title: 'Envelope Thermal Performance',
    summary: 'Building envelope heat gain, multilayer wall thermal resistance, air spaces, surface films, overall thermal transmittance U-value, WWR, and BCA Green Mark ETTV compliance.',
    keyConcepts: [
      'Total thermal resistance: RT = Ro + R1 + R2 + ... + Rn + Ri (where R = thickness x / thermal conductivity k).',
      'Thermal transmittance (U-value): Uw = 1 / RT (W/m²K). Lower U-value signifies superior insulation.',
      'Envelope Thermal Transfer Value (ETTV) incorporates conduction through opaque walls, conduction through glass, and solar heat radiation.',
      'ETTV formula: ETTV = 12(1 - WWR)Uw + 3.4(WWR)Uf + 211(WWR)(CF)(SC). Statutory limit: ≤ 50 W/m² (BCA Green Mark ≤ 45 W/m² for Platinum).',
      'Shading Coefficient (SC) and Correction Factor (CF based on orientation: North, South, East, West) govern solar heat gains.',
    ],
    tutorialQuestions: [
      {
        questionNumber: 'Lesson 10 · Worked Ex 1',
        prompt: 'Calculate the overall thermal transmittance (U-value) for an exterior wall: 15mm granite (k=2.927), 100mm lightweight concrete (k=0.346), 20mm air space (R=0.148), 20mm gypsum plasterboard (k=0.170). Outside film Ro = 0.044, inside film Ri = 0.120 m²K/W.',
        solutionSteps: [
          'R_granite = 0.015 / 2.927 = 0.0051 m²K/W.',
          'R_concrete = 0.100 / 0.346 = 0.2890 m²K/W.',
          'R_air = 0.1480 m²K/W.',
          'R_gypsum = 0.020 / 0.170 = 0.1176 m²K/W.',
          'Total RT = Ro + R_granite + R_concrete + R_air + R_gypsum + Ri = 0.044 + 0.0051 + 0.2890 + 0.1480 + 0.1176 + 0.120 = 0.7237 m²K/W.',
          'U-value = 1 / RT = 1 / 0.7237 = 1.382 W/m²K.',
        ],
        finalAnswer: 'RT = 0.724 m²K/W | Uw = 1.38 W/m²K',
      },
    ],
    resources: [
      { label: 'Lesson 10 Envelope Thermal Performance (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_10_Envelope_Thermal_Performance_Apr_26_d6fba43d.pdf`, isAvailable: true, type: 'lecture' },
    ],
    labTabId: 'ettv',
  },

  // ===================== WEEK 4 =====================
  {
    weekNumber: 4,
    dateStr: 'Thu 12/11/2026',
    dayStr: 'Thursday',
    venue: 'MS Teams',
    venueType: 'online',
    iconType: 'load',
    keyFormulaOrCode: 'Qs = 1.2 · V · ΔT · Qt = Qs + Ql',
    title: 'Cooling Load Estimation',
    summary: 'External solar transmission, internal heat gains (occupancy, lighting power density W/m², office equipment), infiltration, outdoor air ventilation cooling loads, and sensible heat ratio (SHR).',
    keyConcepts: [
      'Sensible heat gains (Qs) increase space temperature without moisture change: occupants, lighting, equipment, wall/window conduction, solar radiation.',
      'Latent heat gains (Ql) increase space humidity from occupants perspiration/respiration and outdoor air moisture.',
      'Sensible Heat equation for air: Qs (W) = 1.2 × V (L/s) × ΔT (K) (where ρ = 1.2 kg/m³ and Cpa = 1.0 kJ/kgK).',
      'Sensible Heat Ratio: SHR = Qs / (Qs + Ql). Commercial offices in Singapore typically operate at SHR = 0.75 to 0.85.',
      'Lighting power density targets under SS 530: ≤ 12 W/m² (LED technology often reaches 6–8 W/m²).',
    ],
    tutorialQuestions: [
      {
        questionNumber: 'Lesson 12 · Load Check',
        prompt: 'An office has 20 occupants, each releasing 75 W sensible and 55 W latent heat. Lighting is 1,200 W and computers release 2,400 W. Calculate space sensible, latent, and total heat gain in kW and SHR.',
        solutionSteps: [
          'Occupant sensible = 20 × 75 = 1,500 W.',
          'Total Sensible Qs = 1,500 (people) + 1,200 (lights) + 2,400 (plugs) = 5,100 W = 5.10 kW.',
          'Occupant latent Ql = 20 × 55 = 1,100 W = 1.10 kW.',
          'Total cooling load Qt = Qs + Ql = 5.10 + 1.10 = 6.20 kW.',
          'SHR = Qs / Qt = 5.10 / 6.20 = 0.823.',
        ],
        finalAnswer: 'Qs = 5.10 kW | Ql = 1.10 kW | Total = 6.20 kW (1.76 RT) | SHR = 0.82',
      },
    ],
    resources: [
      { label: 'Lesson 12 Cooling Load Estimation (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_12_Cooling_Load_Estimation_Apr_26_fac925dc.pdf`, isAvailable: true, type: 'lecture' },
    ],
    labTabId: 'cooling-load',
  },

  // ===================== WEEK 5 =====================
  {
    weekNumber: 5,
    dateStr: 'Thu 19/11/2026 (Group A), Fri 20/11/2026 (Group B)',
    dayStr: 'Thu / Fri',
    venue: 'Lab 34-03-02',
    venueType: 'lab',
    iconType: 'chiller',
    keyFormulaOrCode: 'kW/m³s ≤ 349 (CHWP) · 301 (CWP)',
    title: 'Practical 1 (IFM lab)',
    summary: 'Hands-on laboratory testing of water-cooled chiller plant, pump hydraulic power, overall plant efficiency, and statutory verification against Singapore SS 553 Clause 10.7.',
    keyConcepts: [
      'Chiller cooling capacity: Q (kW) = m_chw × Cw × (tchwr - tchws), where Cw = 4.2 kJ/kgK.',
      'Pump hydraulic output power: P_out (kW) = [Flow (L/s) × ΔP (kPa)] / 1000.',
      'Pump power limitation under SS 553:2016: Chilled water pump ≤ 349 kW/(m³/s); Condenser water pump ≤ 301 kW/(m³/s).',
      'Overall chilled water plant efficiency: kW/RT = (P_chiller + P_chwp + P_cwp + P_ct) / Cooling RT.',
      'BCA Green Mark Platinum threshold: overall plant efficiency ≤ 0.65 kW/RT.',
    ],
    tutorialQuestions: [
      {
        questionNumber: 'AMVS 2 · Q8',
        prompt: 'Calculate chiller cooling capacity, kW/RT, and approach: V_chw = 128 L/s (8°C to 13°C), V_cw = 125 L/s (29°C to 35°C), Power = 462 kW, Saturated Condensing = 36.8°C, Saturated Evaporating = 6.5°C.',
        solutionSteps: [
          'Cooling capacity Q_chw = 128 × 4.2 × (13 - 8) = 2,688 kW.',
          'Cooling capacity in RT = 2688 / 3.517 = 764.3 RT.',
          'Efficiency = 462 kW / 764.3 RT = 0.605 kWe/RT (COP = 5.82).',
          'Evaporator approach = Leaving CHW (8.0°C) - Evap sat (6.5°C) = 1.5°C.',
          'Condenser approach = Cond sat (36.8°C) - Leaving CW (35.0°C) = 1.8°C.',
        ],
        finalAnswer: 'Cooling = 2,688 kW (764.3 RT) | 0.605 kWe/RT | Evaporator Approach = 1.5°C | Condenser Approach = 1.8°C',
      },
    ],
    resources: [
      { label: 'Lesson 5 ACMV P1 Chiller Practical Slides (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_5_ACMV_P1_Chiller_Apr_26_6d04ba2c.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Tutorial AMVS 2 Problem Sheet (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Tutorial_2_Apr_26_1b03e097.pdf`, isAvailable: true, type: 'tutorial' },
    ],
    labTabId: 'chiller',
    isSpecial: 'practical',
  },

  // ===================== WEEK 6 =====================
  {
    weekNumber: 6,
    dateStr: 'Thu 26/11/2026',
    dayStr: 'Thursday',
    venue: 'MS Teams',
    venueType: 'online',
    iconType: 'psychrometric',
    keyFormulaOrCode: 'Tm = (mo·To + mr·Tr)/(mo + mr)',
    title: 'System Psychrometrics',
    summary: 'Psychrometric properties of moist air, specific enthalpy, humidity ratio, adiabatic mixing of outdoor air with recirculated room air, coil sensible cooling and dehumidification.',
    keyConcepts: [
      'Adiabatic air mixing lies along the straight line connecting state points O (outdoor) and R (room return).',
      'Mixed air dry bulb: Tm = (mo·To + mr·Tr) / (mo + mr); Mixed humidity ratio: wm = (mo·wo + mr·wr) / (mo + mr).',
      'Cooling coil process M → S: sensible cooling drops temperature to saturation line, condensation removes moisture along the saturation curve.',
      'Apparatus Dew Point (ADP): The effective surface temperature of the cooling coil tubes and fins.',
      'Coil Bypass Factor (BF): Fraction of air that slips between fins without contacting cold metal (typically 0.05 to 0.15 for commercial AHUs).',
    ],
    tutorialQuestions: [
      {
        questionNumber: 'Lessons 13 & 14 · Ex 5.1',
        prompt: '1,000 L/s of outdoor air at 33°C DB, 60% RH mixes with 4,000 L/s of room air at 24°C DB, 50% RH. Calculate the mixed air dry bulb temperature.',
        solutionSteps: [
          'Total air volume = 1,000 + 4,000 = 5,000 L/s.',
          'Outdoor air fraction = 1,000 / 5,000 = 0.20 (20%).',
          'Recirculated air fraction = 4,000 / 5,000 = 0.80 (80%).',
          'Mixed DB temperature Tm = 0.20 × 33°C + 0.80 × 24°C = 6.6 + 19.2 = 25.8°C.',
        ],
        finalAnswer: 'Mixed Air Temperature Tm = 25.8°C',
      },
    ],
    resources: [
      { label: 'Lessons 13 & 14 Psychrometrics Slides (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_13___14_Psychrometics_Apr_26_3d552ceb.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Psychrometric Chart (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Psychrometric_chart_1dc90027.pdf`, isAvailable: true, type: 'reference' },
    ],
    labTabId: 'psychrometrics',
  },

  // ===================== WEEK 7 =====================
  {
    weekNumber: 7,
    dateStr: 'Thu 03/12/2026',
    dayStr: 'Thursday',
    venue: 'LT 51B',
    venueType: 'exam',
    iconType: 'test',
    keyFormulaOrCode: '20% Module Weightage · Closed Book',
    title: 'Common Test',
    summary: 'Mid-semester assessment evaluating Weeks 1 to 6: Thermodynamics, AC Systems, SS 553 Standards, Envelope ETTV, Cooling Load, and Psychrometric processes.',
    keyConcepts: [
      'Covers Lessons 1, 2, 9, 10, 12, 13, and Practical 1.',
      'Formula sheets provided; standard scientific calculators required.',
      'Topics include: 1 RT conversion, COP and kW/RT, SS 553 pump power limits, multilayer wall U-value, ETTV calculation, and psychrometric state points.',
    ],
    tutorialQuestions: [],
    resources: [],
    isSpecial: 'test',
  },

  // ===================== WEEK 8 =====================
  {
    weekNumber: 8,
    dateStr: 'Thu 10/12/2026',
    dayStr: 'Thursday',
    venue: 'LT 51B',
    venueType: 'classroom',
    iconType: 'psychrometric',
    keyFormulaOrCode: 'Qt = m·Δh · Qs = 1.012·m·ΔT',
    title: 'System Psychrometrics',
    summary: 'Detailed psychrometric analysis of Variable Air Volume (VAV) and Fan Coil Unit (FCU) systems, partial load psychrometric tracking, bypass factor, and reheat dynamics.',
    keyConcepts: [
      'VAV systems modulate supply air flow rate while keeping supply air temperature constant (typically 13°C).',
      'FCU systems with Primary Air AHU (DOAS): Fresh outdoor air is pre-cooled and dehumidified before delivery to room units.',
      'Total coil cooling load: Qt (kW) = m_air (kg/s) × [h_mixed - h_supply] (kJ/kg).',
      'Room sensible load: Qs (kW) = m_supply × Cpa × [T_room - T_supply].',
      'Fan heat gain and duct heat pickup elevate supply air temperature by 0.5°C to 1.5°C before diffusers.',
    ],
    tutorialQuestions: [
      {
        questionNumber: 'Lessons 13 & 14 · Ex 5.4',
        prompt: 'An AHU supplies 5.0 kg/s of air at state S (13°C DB, 90% RH, h=34.5 kJ/kg) from mixed air state M (26°C DB, h=56.2 kJ/kg). Calculate total coil cooling capacity in kW and RT.',
        solutionSteps: [
          'Enthalpy drop Δh = h_mixed - h_supply = 56.2 - 34.5 = 21.7 kJ/kg.',
          'Total cooling load Qt = m_air × Δh = 5.0 kg/s × 21.7 kJ/kg = 108.5 kW.',
          'In Refrigeration Tons = 108.5 / 3.517 = 30.85 RT.',
        ],
        finalAnswer: 'Cooling Capacity Qt = 108.5 kW (30.9 RT)',
      },
    ],
    resources: [
      { label: 'Lessons 13 & 14 Psychrometrics Slides (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_13___14_Psychrometics_Apr_26_3d552ceb.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Psychrometric Chart (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Psychrometric_chart_1dc90027.pdf`, isAvailable: true, type: 'reference' },
    ],
    labTabId: 'psychrometrics',
  },

  // ===================== WEEK 9 =====================
  {
    weekNumber: 9,
    dateStr: 'Thu 17/12/2026',
    dayStr: 'Thursday',
    venue: 'MS Teams',
    venueType: 'online',
    iconType: 'duct',
    keyFormulaOrCode: 'ΔP/L = 0.8–1.0 Pa/m · Huebscher De',
    title: 'Duct Systems & Sizing / Retest',
    summary: 'Air distribution systems, supply registers, Coanda effect, throw and drop, Equal Friction duct sizing method, Huebscher circular equivalent equation, and Common Test retest.',
    keyConcepts: [
      'The Equal Friction method sizes duct networks for a constant pressure drop per unit length (0.8 to 1.0 Pa/m).',
      'Huebscher equation converts rectangular duct dimensions (a × b) to circular equivalent diameter: De = 1.30·(a·b)^0.625 / (a+b)^0.25.',
      'Ceiling void restrictions in commercial offices typically limit duct depth to a maximum of 300 mm.',
      'Air entrainment and induction mix cold supply air with room air before it sinks into the occupied zone.',
      'Noise criteria for offices: NC 30–35 (general), NC 40–50 (lobbies/cafeterias) per SS 553:2016.',
    ],
    tutorialQuestions: [
      {
        questionNumber: 'AMVS 3 · Q1',
        prompt: 'State the purpose of (a) wrapping supply air ducts with fiberglass and double-sided aluminum foil, and (b) internal acoustic insulation at the AHU.',
        solutionSteps: [
          '(a) External fiberglass insulation with aluminum foil vapor barrier prevents thermal heat gain from ceiling voids and prevents moisture condensation on the cold exterior duct surface (duct temp 13°C vs room dew point).',
          '(b) Internal acoustic insulation lines the first 3–6 meters of supply/return ducts at the AHU to attenuate fan motor blade pass frequencies and air turbulence noise before entering occupied spaces.',
        ],
        finalAnswer: '(a) Thermal insulation & condensation barrier | (b) Acoustic noise attenuation from AHU fan',
      },
    ],
    resources: [
      { label: 'Lesson 3 Duct Systems Slides (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_3_Duct_Systems_Apr_26_450c1ce7.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Lesson 4 Duct Systems Slides (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_4_Duct_Systems_Apr_26__2___1__450c1ce7.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Duct Sizing Chart & Conversion Table (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Duct_Sizing_Chart__Conversion_Table_and_Duct_SizingTable_892b885e.pdf`, isAvailable: true, type: 'reference' },
      { label: 'Tutorial AMVS 3 Problem Sheet (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Tutorial_3_Apr_26__1__57c7fbf4.pdf`, isAvailable: true, type: 'tutorial' },
    ],
    labTabId: 'ducts',
  },

  // ===================== VACATION BREAK =====================
  {
    weekNumber: 0,
    dateStr: '21 Dec 2026 – 3 Jan 2027',
    dayStr: 'Mon – Sun',
    venue: '—',
    venueType: 'break',
    iconType: 'recess',
    keyFormulaOrCode: 'Vacation Break',
    title: 'Vacation Break',
    summary: 'Year-end institutional semester recess break. No scheduled classes.',
    keyConcepts: [],
    tutorialQuestions: [],
    resources: [],
    isSpecial: 'recess',
  },

  // ===================== WEEK 10 =====================
  {
    weekNumber: 10,
    dateStr: 'Thu 07/01/2027',
    dayStr: 'Thursday',
    venue: 'LT 51B',
    venueType: 'classroom',
    iconType: 'duct',
    keyFormulaOrCode: 'ΔPfitting = Σ C · Pv · Pv = 0.60·V²',
    title: 'Duct Systems & Sizing',
    summary: 'Index run hydraulic resistance, dynamic fitting losses, velocity pressure, fan static pressure calculation, safety factors, and ceiling void depth constraints (300 mm max).',
    keyConcepts: [
      'The Index Run is the hydraulically most resistant circuit from the fan discharge to the most remote diffuser.',
      'Dynamic fitting losses are calculated via loss coefficients: ΔP_fitting = Σ C × Pv, where Pv = 0.60 × V² (for air ρ = 1.2 kg/m³).',
      'External Fan Static Pressure = (Σ Straight Friction + Σ Fitting Dynamic Losses + Terminal Losses) × Safety Factor (1.20).',
      'Aspect ratio of rectangular ducts should ideally be kept below 3:1 to minimize sheet metal cost and excess friction.',
    ],
    tutorialQuestions: [
      {
        questionNumber: 'AMVS 3 · Q4',
        prompt: 'Size the index run of the FCU ductwork in Figure 4 (4 diffusers @ 500 L/s, depth 300 mm max, friction 1.0 Pa/m, diffuser/grille loss 20 Pa each, 20% safety factor).',
        solutionSteps: [
          'Section 1 (2,000 L/s): Round eq Ø 560 mm → 850 × 300 mm (Vel = 7.8 m/s, Pv = 37 Pa)',
          'Section 2 (1,500 L/s): Round eq Ø 500 mm → 700 × 300 mm (Vel = 7.1 m/s, Pv = 31 Pa)',
          'Section 3 (1,000 L/s): Round eq Ø 450 mm → 500 × 300 mm (Vel = 6.7 m/s, Pv = 27 Pa)',
          'Section 4 (500 L/s): Round eq Ø 355 mm → 300 × 300 mm (Vel = 5.6 m/s, Pv = 19 Pa)',
          'Total straight duct length in index run = 26 m @ 1.0 Pa/m = 26.0 Pa.',
          'Dynamic fitting losses = 58.4 Pa | Terminal losses = 40.0 Pa.',
          'Total pressure loss = 124.4 Pa | Applying 20% Safety Factor: 124.4 × 1.20 = 149.3 Pa.',
        ],
        finalAnswer: 'Required External Fan Static Pressure = 149.3 Pa ≈ 150 Pa',
      },
    ],
    resources: [
      { label: 'Lesson 4 Duct Systems Slides (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_4_Duct_Systems_Apr_26__2___1__450c1ce7.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Duct Sizing Table & Worksheet (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Duct_Sizing_Chart__Conversion_Table_and_Duct_SizingTable_892b885e.pdf`, isAvailable: true, type: 'worksheet' },
      { label: 'Tutorial AMVS 3 Problem Sheet (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Tutorial_3_Apr_26__1__57c7fbf4.pdf`, isAvailable: true, type: 'tutorial' },
    ],
    labTabId: 'ducts',
  },

  // ===================== WEEK 11 =====================
  {
    weekNumber: 11,
    dateStr: 'Wed 13/01/2027 (Group A), Fri 15/01/2027 (Group B)',
    dayStr: 'Wed / Fri',
    venue: 'Computer Room 34-02-06',
    venueType: 'lab',
    iconType: 'equipment',
    keyFormulaOrCode: 'Computer-Aided Duct & Energy Sim',
    title: 'Practicals 2 & 3',
    summary: 'Software-based ductwork network pressure calculation, fan static sizing, and energy performance modeling in computer laboratory.',
    keyConcepts: [
      'Lecturers: David Teo / Gan Poh Tin.',
      'Computer-aided equal friction duct network sizing and bill of materials generation.',
      'Verification of air static pressure gradients across filters, cooling coils, transitions, and discharge louvres.',
    ],
    tutorialQuestions: [],
    resources: [],
    isSpecial: 'practical',
  },

  // ===================== WEEK 12 =====================
  {
    weekNumber: 12,
    dateStr: 'Thu 21/01/2027',
    dayStr: 'Thursday',
    venue: 'LT 51B',
    venueType: 'classroom',
    iconType: 'pipe',
    keyFormulaOrCode: 'Le = (Le/D) · D · H = ΔP/(ρ·g)',
    title: 'Pipe Systems & Sizing',
    summary: 'Hydronic chilled water and condenser water networks, flow velocity limits (0.6–2.4 m/s), Darcy-Weisbach friction, equivalent length Le/D method for fittings and valves.',
    keyConcepts: [
      'Velocity limits in steel pipe: 0.6 m/s minimum (prevent sediment accumulation), 1.2 to 2.4 m/s maximum (prevent erosion and water hammer noise).',
      'The Equivalent Length method accounts for turbulent fitting friction: Le = (Le/D) × Diameter (m).',
      'Standard fitting Le/D ratios: 90° welded elbow (13–19), gate valve full open (7.5), butterfly valve (37), check valve (95), Y-strainer (250).',
      'Total equivalent length = Straight pipe length + Σ Equivalent length of all fittings and valves.',
      'Total Pump Head (m) = Total system pressure drop ΔP (kPa) / (ρ × g) = ΔP / 9.81.',
    ],
    tutorialQuestions: [
      {
        questionNumber: 'AMVS 4 · Q1',
        prompt: 'A chilled water pipe carries 40 L/s. Determine the standard nominal pipe size (mm) using the Pipe Sizing Table if velocity is limited to 1.8 m/s and friction is under 250 Pa/m.',
        solutionSteps: [
          'From Lesson 6 Pipe Sizing Table:',
          '125 mm pipe at 40 L/s: Velocity = 1.95 m/s (exceeds 1.8 m/s limit).',
          '150 mm pipe at 40 L/s: Velocity = 1.35 m/s (compliant < 1.8 m/s), Friction loss = 160 Pa/m (compliant < 250 Pa/m).',
        ],
        finalAnswer: 'Nominal Pipe Size = 150 mm (Velocity = 1.35 m/s, Friction = 160 Pa/m)',
      },
    ],
    resources: [
      { label: 'Lesson 6 Pipe Sizing Slides (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_6_Pipe_Sizing_Apr_26_813731d3.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Pipe Sizing Table (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Pipe_Sizing_Table_34c2498b.pdf`, isAvailable: true, type: 'reference' },
      { label: 'Friction Loss in Steel Pipe Schedule 40 (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Friction_Loss_for_Water_in_Commercial_Steel_Pipe_Schedule_40_4e619142.pdf`, isAvailable: true, type: 'reference' },
      { label: 'Tutorial AMVS 4 Problem Sheet (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Tutorial_4_Apr_26_79ce2872.pdf`, isAvailable: true, type: 'tutorial' },
    ],
    labTabId: 'pipes',
  },

  // ===================== WEEK 13 =====================
  {
    weekNumber: 13,
    dateStr: 'Thu 28/01/2027',
    dayStr: 'Thursday',
    venue: 'MS Teams',
    venueType: 'online',
    iconType: 'pipe',
    keyFormulaOrCode: 'Schedule 40 Friction · ΔP ≤ 250 Pa/m',
    title: 'Pipe Systems & Sizing / Air-conditioning Equipment',
    summary: 'Balancing valves, 2-way modulating control valves, secondary pumping headers, pump head calculation, and transition to refrigeration equipment components.',
    keyConcepts: [
      'Primary/secondary hydronic decoupling with bridge header isolates chiller constant flow from variable building load.',
      '2-way control valves modulate chilled water flow through cooling coils while variable speed drives (VFD) ramp pump speeds.',
      'Schedule 40 commercial steel pipe friction charts: determine Pa/m friction based on flow rate L/s and internal roughness.',
      'Compressor operational fundamentals: suction superheat, discharge temperature, and compression ratio.',
    ],
    tutorialQuestions: [
      {
        questionNumber: 'AMVS 4 · Q4',
        prompt: 'Calculate the total pump head required for the hydronic circuit in Figure 3 with 50m straight 150mm pipe (160 Pa/m), 4 elbows (Le/D=13), 2 gate valves (Le/D=7.5), 1 chiller evaporator (40 kPa), 1 AHU coil (35 kPa), and 1 balancing valve (15 kPa).',
        solutionSteps: [
          'Straight pipe friction = 50 m × 160 Pa/m = 8,000 Pa = 8.0 kPa.',
          'Fittings Le = [4 × (13 × 0.15) + 2 × (7.5 × 0.15)] = [7.8 + 2.25] = 10.05 m equivalent.',
          'Fitting friction = 10.05 m × 160 Pa/m = 1,608 Pa = 1.6 kPa.',
          'Equipment pressure drops = 40.0 + 35.0 + 15.0 = 90.0 kPa.',
          'Total pressure drop = 8.0 + 1.6 + 90.0 = 99.6 kPa.',
          'Pump head H = 99.6 kPa / 9.81 = 10.15 metres.',
        ],
        finalAnswer: 'Total Pressure Drop = 99.6 kPa | Required Pump Head = 10.2 metres',
      },
    ],
    resources: [
      { label: 'Lesson 6 Pipe Sizing Part 2 (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_6_Pipe_Sizing_Apr_26__1__813731d3.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Lesson 2 Equipment Slides (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_2_Equipment_Apr_26_30dcd678.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Tutorial AMVS 4 Problem Sheet (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Tutorial_4_Apr_26_79ce2872.pdf`, isAvailable: true, type: 'tutorial' },
    ],
    labTabId: 'pipes',
  },

  // ===================== WEEK 14 =====================
  {
    weekNumber: 14,
    dateStr: 'Thu 04/02/2027',
    dayStr: 'Thursday',
    venue: 'MS Teams',
    venueType: 'online',
    iconType: 'equipment',
    keyFormulaOrCode: 'Approach = Tleaving - Tsat ≤ 2.0°C',
    title: 'Air-conditioning Equipment',
    summary: 'Compressors (Reciprocating, Centrifugal with Magnetic Bearings, Screw, Scroll), metering devices (TXV, EEV), shell & tube condensers/evaporators, automatic tube cleaning, Legionella control protocols.',
    keyConcepts: [
      'Compressor classification: Reciprocating (5–500 kW), Centrifugal (450 kW–20 MW), Screw (450–1500 kW), Scroll (5–50 kW).',
      'Magnetic bearing centrifugal chillers (Turbocor) eliminate lubricating oil, preventing oil fouling on evaporator tubes.',
      'Metering devices: Thermostatic Expansion Valve (TXV) and Electronic Expansion Valve (EEV) maintain suction superheat at 4K–6K.',
      'Evaporator/Condenser Approach: Temperature difference between leaving water and saturated refrigerant (normal 1.0°C–2.0°C).',
      'Automatic condenser tube cleaning (Innova-ball / automatic brush systems) maintains clean tubes and low approach.',
      'Cooling tower maintenance: NEA Code of Practice requires monthly plate count, quarterly Legionella tests, and 5m public setbacks.',
    ],
    tutorialQuestions: [
      {
        questionNumber: 'AMVS 2 · Q10',
        prompt: 'State the chronological starting sequence for water-cooled central chilled water plant equipment.',
        solutionSteps: [
          '1. Start Cooling Towers (establishes draft and air flow).',
          '2. Start Condenser Water Pumps (establishes condenser heat rejection flow).',
          '3. Start Chilled Water Pumps (establishes evaporator water circulation to prevent freezing).',
          '4. Start Water-Cooled Chillers (flow switches confirm flow before compressor start).',
        ],
        finalAnswer: '1. Cooling Towers → 2. Condenser Water Pumps → 3. Chilled Water Pumps → 4. Water-Cooled Chillers',
      },
    ],
    resources: [
      { label: 'Lesson 2 Equipment Slides (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Lesson_2_Equipment_Apr_26_30dcd678.pdf`, isAvailable: true, type: 'lecture' },
      { label: 'Tutorial AMVS 2 Problem Sheet (PDF)', pdfPath: `${import.meta.env.BASE_URL}assets/aistudio/Tutorial_2_Apr_26_1b03e097.pdf`, isAvailable: true, type: 'tutorial' },
    ],
    labTabId: 'ac-systems',
  },

  // ===================== WEEK 15 =====================
  {
    weekNumber: 15,
    dateStr: 'Thu 11/02/2027',
    dayStr: 'Thursday',
    venue: 'LT 51B',
    venueType: 'exam',
    iconType: 'test',
    keyFormulaOrCode: '20% Module Weightage · WTEST',
    title: 'Test 2',
    summary: 'Final comprehensive written examination covering the entire semester curriculum (SS 553, Envelope ETTV, Cooling Load, Psychrometrics, Duct Sizing, and Pipe Sizing).',
    keyConcepts: [
      'Comprehensive final written test covering all 14 weeks of study.',
      '20% of final grade score.',
      'Closed-book exam with approved formula sheets and standard engineering calculators.',
    ],
    tutorialQuestions: [],
    resources: [],
    isSpecial: 'test',
  },
];
