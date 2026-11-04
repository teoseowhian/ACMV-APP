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
  plainTitle?: string; // plain-English headline shown first on the week card
  summary: string;
  keyConcepts: string[];
  tutorialQuestions: WeekTutorialQuestion[];
  tutorialId?: string; // 'tutorial-1' | 'tutorial-2' | 'tutorial-3' | 'tutorial-4'
  resources: WeekResource[];
  labTabId?: string; // e.g. 'refrigeration', 'design-conditions', 'ducts', 'chiller', 'pipes', 'ettv', 'cooling-load', 'psychrometrics'
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
    keyFormulaOrCode: '1 RT = 3.517 kW · COP = Q / P',
    title: 'Types of Air-conditioning Systems',
    plainTitle: 'The big picture: AC systems & refrigeration equipment',
    summary: 'Direct expansion (DX) vs central chilled water systems, CAV vs VAV, FCU, Thermal Energy Storage (TES), Singapore District Cooling (SDC), and equipment fundamentals (compressors, condensers, evaporators, TXV/EEV).',
    keyConcepts: [
      'Cold is the absence of heat; cooling extracts energy from indoor air and rejects it to the ambient outdoors.',
      'Sensible heat alters dry-bulb temperature; latent heat condenses airborne moisture at constant temperature.',
      '1 Refrigeration Ton (RT) = 12,000 BTU/h = 3.51685 kW (energy to freeze 1 short ton of water at 0°C in 24 hours).',
      'Direct Expansion (DX) uses refrigerant directly in room coils; central plants circulate chilled water at 6.7°C to AHUs/FCUs.',
      'Compressors: Reciprocating, Centrifugal with magnetic bearings (Turbocor oil-free), Screw, and Scroll.',
      'Expansion valves: Thermostatic Expansion Valve (TXV) and Electronic Expansion Valve (EEV) maintain 4K–6K superheat.',
      'Singapore District Cooling (Marina Bay & Keppel DHCS) centralizes chilled water at 6°C ± 0.5°C with return > 14°C.',
      'Thermal Energy Storage (TES) shifts electrical consumption to off-peak night hours when tariffs are discounted.',
    ],
    tutorialQuestions: [],
    tutorialId: 'tutorial-1',
    resources: [
      { label: 'Lesson 1 Module Introduction (PDF)', pdfPath: '/assets/aistudio/Lesson_1_Module_Introduction_Apr26_1c9b0222.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Lesson 1 AC System Part 1 (PDF)', pdfPath: '/assets/aistudio/Lesson_1_Air-conditional_System_Part1_Apr26_44a6b178.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Lesson 2 AC System Part 2 (PDF)', pdfPath: '/assets/aistudio/Lesson_2_Air-Conditioning_Syste__Part_2_Apr_26_0c5cb21b.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Lesson 2 Equipment Slides (PDF)', pdfPath: '/assets/aistudio/Lesson_2_Equipment_Apr_26_30dcd678.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Tutorial AMVS 1 Problem Sheet (PDF)', pdfPath: '/assets/aistudio/Tutorial_1_Apr_26_c1496a6f.pdf', isAvailable: true, type: 'tutorial' },
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
    plainTitle: 'Room comfort targets: Singapore\'s rules for temperature, humidity & fresh air',
    summary: 'Singapore SS 553 statutory thermal comfort criteria, outdoor design conditions (33.5°C DB / 27.5°C WB), outdoor fresh air ventilation rates, and sensible/latent heat split.',
    keyConcepts: [
      'Singapore SS 553 indoor comfort standards: 23°C to 25°C Dry Bulb, Relative Humidity ≤ 65%, air movement ≤ 0.30 m/s.',
      'Singapore outdoor design condition: 33.5°C Dry Bulb, 27.5°C Wet Bulb (coincident with peak solar irradiation).',
      'Fresh air ventilation rates per occupant: 5.5 to 10 L/s per person depending on occupancy classification (SS 553 Table 4.10).',
      'Air distribution patterns: Constant Air Volume (CAV) for uniform heat load; Variable Air Volume (VAV) for perimeter/interior zoning.',
      'Positive room pressure (+10 to +25 Pa) prevents humid outdoor air and particulate infiltration through door cracks.',
    ],
    tutorialQuestions: [],
    resources: [
      { label: 'Lesson 9 Design Lecture Slides (PDF)', pdfPath: '/assets/aistudio/Lesson_9_Design_Apr_26_ce5bf399.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Psychrometric Chart (PDF)', pdfPath: '/assets/aistudio/Psychrometric_chart_1dc90027.pdf', isAvailable: true, type: 'reference' },
    ],
    labTabId: 'design-conditions',
  },

  // ===================== WEEK 3 (CURRENT UPCOMING LESSON) =====================
  {
    weekNumber: 3,
    dateStr: 'Thu 05/11/2026',
    dayStr: 'Thursday',
    venue: 'MS Teams',
    venueType: 'online',
    iconType: 'duct',
    keyFormulaOrCode: 'ΔP/L = 0.8–1.0 Pa/m · Huebscher De',
    title: 'Duct Systems & Sizing',
    plainTitle: 'Sizing the air pipes: duct systems & equal friction method',
    summary: 'Air distribution systems, supply registers, Coanda ceiling effect, throw and drop, Equal Friction duct sizing method, Huebscher circular equivalent equation, and ceiling void constraints.',
    keyConcepts: [
      'The Equal Friction method sizes duct networks for a constant pressure drop per unit length (0.8 to 1.0 Pa/m).',
      'Huebscher equation converts rectangular duct dimensions (a × b) to circular equivalent diameter: De = 1.30·(a·b)^0.625 / (a+b)^0.25.',
      'Ceiling void restrictions in commercial offices typically limit duct depth to a maximum of 300 mm.',
      'Air entrainment and induction mix cold supply air with room air before it sinks into the occupied zone.',
      'Noise criteria for offices: NC 30–35 (general), NC 40–50 (lobbies/cafeterias) per SS 553:2016.',
    ],
    tutorialQuestions: [],
    tutorialId: 'tutorial-3',
    resources: [
      { label: 'Lesson 3 Duct Systems Slides (PDF)', pdfPath: '/assets/aistudio/Lesson_3_Duct_Systems_Apr_26_450c1ce7.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Lesson 4 Duct Systems Slides (PDF)', pdfPath: '/assets/aistudio/Lesson_4_Duct_Systems_Apr_26__2___1__450c1ce7.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Duct Sizing Chart & Conversion Table (PDF)', pdfPath: '/assets/aistudio/Duct_Sizing_Chart__Conversion_Table_and_Duct_SizingTable_892b885e.pdf', isAvailable: true, type: 'reference' },
      { label: 'Tutorial AMVS 3 Problem Sheet (PDF)', pdfPath: '/assets/aistudio/Tutorial_3_Apr_26__1__57c7fbf4.pdf', isAvailable: true, type: 'tutorial' },
    ],
    labTabId: 'ducts',
  },

  // ===================== WEEK 4 =====================
  {
    weekNumber: 4,
    dateStr: 'Thu 12/11/2026',
    dayStr: 'Thursday',
    venue: 'MS Teams',
    venueType: 'online',
    iconType: 'duct',
    keyFormulaOrCode: 'ΔPfitting = Σ C · Pv · Pv = 0.60·V²',
    title: 'Duct Systems & Sizing',
    plainTitle: 'Sizing the air pipes, part 2: index run losses & fan static pressure',
    summary: 'Index run hydraulic resistance, dynamic fitting losses, velocity pressure, fan static pressure calculation, safety factors (1.20), and duct aspect ratio control (≤ 3:1).',
    keyConcepts: [
      'The Index Run is the hydraulically most resistant circuit from the fan discharge to the most remote diffuser.',
      'Dynamic fitting losses are calculated via loss coefficients: ΔP_fitting = Σ C × Pv, where Pv = 0.60 × V² (for air ρ = 1.2 kg/m³).',
      'External Fan Static Pressure = (Σ Straight Friction + Σ Fitting Dynamic Losses + Terminal Losses) × Safety Factor (1.20).',
      'Aspect ratio of rectangular ducts should ideally be kept below 3:1 to minimize sheet metal cost and excess friction.',
    ],
    tutorialQuestions: [],
    tutorialId: 'tutorial-3',
    resources: [
      { label: 'Lesson 3 Duct Systems Slides (PDF)', pdfPath: '/assets/aistudio/Lesson_3_Duct_Systems_Apr_26_450c1ce7.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Lesson 4 Duct Systems Slides (PDF)', pdfPath: '/assets/aistudio/Lesson_4_Duct_Systems_Apr_26__2___1__450c1ce7.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Duct Sizing Table & Worksheet (PDF)', pdfPath: '/assets/aistudio/Duct_Sizing_Chart__Conversion_Table_and_Duct_SizingTable_892b885e.pdf', isAvailable: true, type: 'worksheet' },
      { label: 'Tutorial AMVS 3 Problem Sheet (PDF)', pdfPath: '/assets/aistudio/Tutorial_3_Apr_26__1__57c7fbf4.pdf', isAvailable: true, type: 'tutorial' },
    ],
    labTabId: 'ducts',
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
    plainTitle: 'Hands-on lab: testing a real water-cooled chiller plant',
    summary: 'Hands-on laboratory testing of water-cooled chiller plant, pump hydraulic power, overall plant efficiency, and statutory verification against Singapore SS 553 Clause 10.7.',
    keyConcepts: [
      'Chiller cooling capacity: Q (kW) = m_chw × Cw × (tchwr - tchws), where Cw = 4.2 kJ/kgK.',
      'Pump hydraulic output power: P_out (kW) = [Flow (L/s) × ΔP (kPa)] / 1000.',
      'Pump power limitation under SS 553:2016: Chilled water pump ≤ 349 kW/(m³/s); Condenser water pump ≤ 301 kW/(m³/s).',
      'Overall chilled water plant efficiency: kW/RT = (P_chiller + P_chwp + P_cwp + P_ct) / Cooling RT.',
      'BCA Green Mark Platinum threshold: overall plant efficiency ≤ 0.65 kW/RT (central chiller ≤ 0.58 kW/RT).',
    ],
    tutorialQuestions: [],
    tutorialId: 'tutorial-2',
    resources: [
      { label: 'Lesson 5 ACMV P1 Chiller Practical Slides (PDF)', pdfPath: '/assets/aistudio/Lesson_5_ACMV_P1_Chiller_Apr_26_6d04ba2c.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Tutorial AMVS 2 Problem Sheet (PDF)', pdfPath: '/assets/aistudio/Tutorial_2_Apr_26_1b03e097.pdf', isAvailable: true, type: 'tutorial' },
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
    iconType: 'pipe',
    keyFormulaOrCode: '100–400 Pa/m · Le = (Le/D) · D',
    title: 'Pipe Systems & Sizing',
    plainTitle: 'Sizing the water pipes: chilled water & condenser water networks',
    summary: 'Hydronic chilled water and condenser water networks, flow velocity limits (0.6–2.4 m/s), Schedule 40 steel friction charts, Darcy-Weisbach principles, and equivalent length Le/D method.',
    keyConcepts: [
      'Velocity limits in steel pipe: 0.6 m/s minimum (prevent sediment accumulation), 1.2 to 2.4 m/s maximum (prevent erosion and water hammer noise).',
      'The Equivalent Length method accounts for turbulent fitting friction: Le = (Le/D) × Diameter (m).',
      'Standard fitting Le/D ratios: 90° welded elbow (13–19), gate valve full open (7.5), butterfly valve (37), check valve (95), Y-strainer (250).',
      'Schedule 40 commercial steel pipe friction charts: determine Pa/m friction based on flow rate L/s (100–400 Pa/m range, design 250 Pa/m).',
    ],
    tutorialQuestions: [],
    tutorialId: 'tutorial-4',
    resources: [
      { label: 'Lesson 6 Pipe Sizing Slides (PDF)', pdfPath: '/assets/aistudio/Lesson_6_Pipe_Sizing_Apr_26_813731d3.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Pipe Sizing Table (PDF)', pdfPath: '/assets/aistudio/Pipe_Sizing_Table_34c2498b.pdf', isAvailable: true, type: 'reference' },
      { label: 'Friction Loss in Steel Pipe Schedule 40 (PDF)', pdfPath: '/assets/aistudio/Friction_Loss_for_Water_in_Commercial_Steel_Pipe_Schedule_40_4e619142.pdf', isAvailable: true, type: 'reference' },
      { label: 'Tutorial AMVS 4 Problem Sheet (PDF)', pdfPath: '/assets/aistudio/Tutorial_4_Apr_26_79ce2872.pdf', isAvailable: true, type: 'tutorial' },
    ],
    labTabId: 'pipes',
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
    plainTitle: 'Assessment: Common Test (Weeks 1–6)',
    summary: 'Mid-semester assessment evaluating Weeks 1 to 6 under new Rev 6 order (AC Systems & Equipment, SS 553 Design Conditions, Duct Systems & Sizing, Practical 1 Chiller Testing, and Pipe Sizing).',
    keyConcepts: [
      'Covers Lessons 1, 2, 9, 3, 4, 5, 6 and Practical 1 (Weeks 1 to 6).',
      'Formula sheets provided; standard engineering calculators required.',
      'Topics include: 1 RT conversion, COP and kW/RT, SS 553 pump power limits, duct sizing at 0.8–1.0 Pa/m, Le/D equivalent length, and pump head calculation.',
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
    iconType: 'pipe',
    keyFormulaOrCode: 'H = ΔP/(ρ·g) · 10% Safety Factor',
    title: 'Pipe Systems & Sizing',
    plainTitle: 'Sizing the water pipes, part 2: index run, fittings & pump head',
    summary: 'Balancing valves, 2-way modulating control valves, secondary pumping headers, index run hydraulic loss summation, equipment pressure drops, and pump head determination.',
    keyConcepts: [
      'Primary/secondary hydronic decoupling with bridge header isolates chiller constant flow from variable building load.',
      '2-way control valves modulate chilled water flow through cooling coils while variable speed drives (VFD) ramp pump speeds.',
      'Total equivalent length = Straight pipe length + Σ Equivalent length of all fittings and valves.',
      'Total Pump Head (m) = Total system pressure drop ΔP (kPa) / (ρ × g) = ΔP / 9.81 (Closed loop: static head = 0 m; open cooling tower adds elevation head).',
    ],
    tutorialQuestions: [],
    tutorialId: 'tutorial-4',
    resources: [
      { label: 'Lesson 6 Pipe Sizing Part 2 (PDF)', pdfPath: '/assets/aistudio/Lesson_6_Pipe_Sizing_Apr_26__1__813731d3.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Pipe Sizing Table (PDF)', pdfPath: '/assets/aistudio/Pipe_Sizing_Table_34c2498b.pdf', isAvailable: true, type: 'reference' },
      { label: 'Friction Loss in Steel Pipe Schedule 40 (PDF)', pdfPath: '/assets/aistudio/Friction_Loss_for_Water_in_Commercial_Steel_Pipe_Schedule_40_4e619142.pdf', isAvailable: true, type: 'reference' },
      { label: 'Tutorial AMVS 4 Problem Sheet (PDF)', pdfPath: '/assets/aistudio/Tutorial_4_Apr_26_79ce2872.pdf', isAvailable: true, type: 'tutorial' },
    ],
    labTabId: 'pipes',
  },

  // ===================== WEEK 9 =====================
  {
    weekNumber: 9,
    dateStr: 'Thu 17/12/2026',
    dayStr: 'Thursday',
    venue: 'MS Teams',
    venueType: 'online',
    iconType: 'design',
    keyFormulaOrCode: 'SS 553 Design Review · Retest',
    title: 'Design / Retest',
    plainTitle: 'Design revision & Common Test retest',
    summary: 'Lesson 9 Design revision covering SS 553 indoor/outdoor conditions, ventilation calculations, design conditions lab exploration, and Common Test retest session.',
    keyConcepts: [
      'Review of SS 553 indoor design temperature (23–25°C), relative humidity (≤ 65%), and air velocity (≤ 0.30 m/s).',
      'Outdoor fresh air ventilation rate requirements (SS 553 Table 4.10) and infiltration prevention via positive pressurization.',
      'Common Test review and retest session for identified syllabus assessment requirements.',
    ],
    tutorialQuestions: [],
    resources: [
      { label: 'Lesson 9 Design Lecture Slides (PDF)', pdfPath: '/assets/aistudio/Lesson_9_Design_Apr_26_ce5bf399.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Psychrometric Chart (PDF)', pdfPath: '/assets/aistudio/Psychrometric_chart_1dc90027.pdf', isAvailable: true, type: 'reference' },
    ],
    labTabId: 'design-conditions',
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
    iconType: 'ettv',
    keyFormulaOrCode: 'U = 1/RT · ETTV ≤ 50 W/m²',
    title: 'Envelope Thermal Performance',
    plainTitle: 'Why walls & windows let heat in: U-values & BCA ETTV compliance',
    summary: 'Building envelope heat gain, multilayer wall thermal resistance, air spaces, surface films, overall thermal transmittance U-value, WWR, and BCA Green Mark ETTV compliance.',
    keyConcepts: [
      'Total thermal resistance: RT = Ro + R1 + R2 + ... + Rn + Ri (where R = thickness x / thermal conductivity k).',
      'Thermal transmittance (U-value): Uw = 1 / RT (W/m²K). Lower U-value signifies superior insulation.',
      'Envelope Thermal Transfer Value (ETTV) incorporates conduction through opaque walls, conduction through glass, and solar heat radiation.',
      'ETTV formula: ETTV = 12(1 - WWR)Uw + 3.4(WWR)Uf + 211(WWR)(CF)(SC). Statutory limit: ≤ 50 W/m² (BCA Green Mark ≤ 45 W/m² for Platinum).',
      'Shading Coefficient (SC) and Correction Factor (CF based on orientation: North, South, East, West) govern solar heat gains.',
    ],
    tutorialQuestions: [],
    resources: [
      { label: 'Lesson 10 Envelope Thermal Performance (PDF)', pdfPath: '/assets/aistudio/Lesson_10_Envelope_Thermal_Performance_Apr_26_d6fba43d.pdf', isAvailable: true, type: 'lecture' },
    ],
    labTabId: 'ettv',
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
    plainTitle: 'Hands-on: computer labs for duct networks & energy simulation',
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
    iconType: 'load',
    keyFormulaOrCode: 'Qs = 1.2 · V · ΔT · Qt = Qs + Ql',
    title: 'Cooling Load Estimation',
    plainTitle: 'Adding it up: how much cooling a room really needs',
    summary: 'External solar transmission, internal heat gains (occupancy, lighting power density W/m², office equipment), infiltration, outdoor air ventilation cooling loads, and sensible heat ratio (SHR).',
    keyConcepts: [
      'Sensible heat gains (Qs) increase space temperature without moisture change: occupants, lighting, equipment, wall/window conduction, solar radiation.',
      'Latent heat gains (Ql) increase space humidity from occupants perspiration/respiration and outdoor air moisture.',
      'Sensible Heat equation for air: Qs (W) = 1.2 × V (L/s) × ΔT (K) (where ρ = 1.2 kg/m³ and Cpa = 1.0 kJ/kgK).',
      'Sensible Heat Ratio: SHR = Qs / (Qs + Ql). Commercial offices in Singapore typically operate at SHR = 0.75 to 0.85.',
      'Lighting power density targets under SS 530: ≤ 12 W/m² (LED technology often reaches 6–8 W/m²).',
    ],
    tutorialQuestions: [],
    resources: [
      { label: 'Lesson 12 Cooling Load Estimation (PDF)', pdfPath: '/assets/aistudio/Lesson_12_Cooling_Load_Estimation_Apr_26_fac925dc.pdf', isAvailable: true, type: 'lecture' },
    ],
    labTabId: 'cooling-load',
  },

  // ===================== WEEK 13 =====================
  {
    weekNumber: 13,
    dateStr: 'Thu 28/01/2027',
    dayStr: 'Thursday',
    venue: 'MS Teams',
    venueType: 'online',
    iconType: 'psychrometric',
    keyFormulaOrCode: 'Tm = (mo·To + mr·Tr)/(mo + mr)',
    title: 'System Psychrometrics',
    plainTitle: 'Air & moisture: mixing air, and squeezing water out of it',
    summary: 'Psychrometric properties of moist air, specific enthalpy, humidity ratio, adiabatic mixing of outdoor air with recirculated room air, coil sensible cooling and dehumidification.',
    keyConcepts: [
      'Adiabatic air mixing lies along the straight line connecting state points O (outdoor) and R (room return).',
      'Mixed air dry bulb: Tm = (mo·To + mr·Tr) / (mo + mr); Mixed humidity ratio: wm = (mo·wo + mr·wr) / (mo + mr).',
      'Cooling coil process M → S: sensible cooling drops temperature to saturation line, condensation removes moisture along the saturation curve.',
      'Apparatus Dew Point (ADP): The effective surface temperature of the cooling coil tubes and fins.',
      'Coil Bypass Factor (BF): Fraction of air that slips between fins without contacting cold metal (typically 0.05 to 0.15 for commercial AHUs).',
    ],
    tutorialQuestions: [],
    resources: [
      { label: 'Lessons 13 & 14 Psychrometrics Slides (PDF)', pdfPath: '/assets/aistudio/Lesson_13___14_Psychrometics_Apr_26_3d552ceb.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Psychrometric Chart (PDF)', pdfPath: '/assets/aistudio/Psychrometric_chart_1dc90027.pdf', isAvailable: true, type: 'reference' },
    ],
    labTabId: 'psychrometrics',
  },

  // ===================== WEEK 14 =====================
  {
    weekNumber: 14,
    dateStr: 'Thu 04/02/2027',
    dayStr: 'Thursday',
    venue: 'MS Teams',
    venueType: 'online',
    iconType: 'psychrometric',
    keyFormulaOrCode: 'Qt = m·Δh · Qs = 1.012·m·ΔT',
    title: 'System Psychrometrics',
    plainTitle: 'Deeper dive: VAV & fan coil systems on the moisture chart',
    summary: 'Detailed psychrometric analysis of Variable Air Volume (VAV) and Fan Coil Unit (FCU) systems, partial load psychrometric tracking, bypass factor, and reheat dynamics.',
    keyConcepts: [
      'VAV systems modulate supply air flow rate while keeping supply air temperature constant (typically 13°C).',
      'FCU systems with Primary Air AHU (DOAS): Fresh outdoor air is pre-cooled and dehumidified before delivery to room units.',
      'Total coil cooling load: Qt (kW) = m_air (kg/s) × [h_mixed - h_supply] (kJ/kg).',
      'Room sensible load: Qs (kW) = m_supply × Cpa × [T_room - T_supply].',
      'Fan heat gain and duct heat pickup elevate supply air temperature by 0.5°C to 1.5°C before diffusers.',
    ],
    tutorialQuestions: [],
    resources: [
      { label: 'Lessons 13 & 14 Psychrometrics Slides (PDF)', pdfPath: '/assets/aistudio/Lesson_13___14_Psychrometics_Apr_26_3d552ceb.pdf', isAvailable: true, type: 'lecture' },
      { label: 'Psychrometric Chart (PDF)', pdfPath: '/assets/aistudio/Psychrometric_chart_1dc90027.pdf', isAvailable: true, type: 'reference' },
    ],
    labTabId: 'psychrometrics',
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
    plainTitle: 'Assessment: Written Test 2 (Weeks 8–14)',
    summary: 'Final comprehensive written examination covering the second half of the semester curriculum (Pipe Sizing index run & pump head, SS 553 Design conditions, Envelope ETTV, Cooling Load, and Psychrometrics).',
    keyConcepts: [
      'Comprehensive final written test covering Weeks 8 through 14.',
      '20% of final grade score.',
      'Closed-book exam with approved formula sheets and standard engineering calculators.',
    ],
    tutorialQuestions: [],
    resources: [],
    isSpecial: 'test',
  },
];
