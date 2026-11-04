export interface LabQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LAB_QUIZZES: Record<string, LabQuizQuestion[]> = {
  refrigeration: [
    {
      id: 1,
      question: 'In a standard vapor-compression cycle, what is the thermodynamic process occurring across the expansion valve?',
      options: ['Isentropic (constant entropy)', 'Isenthalpic (constant enthalpy)', 'Isothermal (constant temperature)', 'Isobaric (constant pressure)'],
      correctIndex: 1,
      explanation: 'The throttling process across the expansion valve is adiabatic with no external work done (W=0, Q=0), meaning enthalpy remains constant: h3 = h4.',
    },
    {
      id: 2,
      question: 'How is the Refrigeration Ton (RT) defined in SI units?',
      options: ['1 RT = 1.000 kW', '1 RT = 2.500 kW', '1 RT = 3.517 kW (12,000 BTU/h)', '1 RT = 4.186 kW'],
      correctIndex: 2,
      explanation: '1 Refrigeration Ton equals 3.51685 kW (or 12,000 BTU/h), representing the latent heat extraction to freeze 2,000 lbs of water at 0°C in 24 hours.',
    },
    {
      id: 3,
      question: 'Why is refrigerant vapor superheated by 4°C to 6°C at the compressor suction?',
      options: ['To increase compressor discharge pressure', 'To prevent liquid droplets from entering and damaging compressor pistons or scrolls', 'To reduce the electrical resistance of the motor', 'To comply with Singapore SS 530'],
      correctIndex: 1,
      explanation: 'Superheat ensures 100% dry vapor enters the compressor, preventing catastrophic liquid slugging.',
    },
    {
      id: 4,
      question: 'If a chiller provides 1,400 kW of cooling with 250 kW electrical compressor power, what is its COP?',
      options: ['3.50', '5.60', '0.62', '7.20'],
      correctIndex: 1,
      explanation: 'COP = Cooling Capacity (kW) / Compressor Power (kW) = 1,400 / 250 = 5.60.',
    },
    {
      id: 5,
      question: 'What happens to chiller COP when the entering condenser water temperature (ECWT) decreases?',
      options: ['COP decreases', 'COP increases because compressor lift is reduced', 'COP remains unchanged', 'The evaporator freezes immediately'],
      correctIndex: 1,
      explanation: 'Lower condenser water temperature lowers the condensing pressure, reducing compressor lift and decreasing motor work required.',
    },
  ],

  'ac-systems': [
    {
      id: 1,
      question: 'Which compressor type is typically used for large commercial building central plants exceeding 500 RT?',
      options: ['Reciprocating compressor', 'Centrifugal compressor (including magnetic levitation Turbocor)', 'Window rotary compressor', 'Fractional horsepower scroll'],
      correctIndex: 1,
      explanation: 'Centrifugal compressors offer the highest full-load and part-load efficiencies for large centralized chilled water plants.',
    },
    {
      id: 2,
      question: 'What is a major advantage of oil-free magnetic bearing centrifugal chillers?',
      options: ['They use flammable ammonia only', 'They eliminate oil fouling on evaporator tubes, maintaining peak heat transfer over life', 'They do not require electricity', 'They eliminate the need for cooling towers'],
      correctIndex: 1,
      explanation: 'Traditional chillers suffer 8%–15% efficiency loss over time due to lubricating oil coating the copper tube surfaces. Magnetic bearings eliminate oil entirely.',
    },
    {
      id: 3,
      question: 'Under NEA Environmental Health regulations, what is the minimum setback distance for cooling towers from windows and pedestrian areas?',
      options: ['1 meter', '3 meters', '5 meters', '15 meters'],
      correctIndex: 2,
      explanation: 'NEA requires a minimum 5m setback from any air inlet, openable window, pedestrian thoroughfare, or public access to minimize Legionella aerosol inhalation risks.',
    },
    {
      id: 4,
      question: 'What is the primary function of automatic condenser tube cleaning systems (such as sponge balls or brushes)?',
      options: ['To paint the interior of tubes', 'To prevent bio-slime and calcium scale accumulation, keeping condenser approach low', 'To filter out dissolved gases from the refrigerant', 'To lubricate compressor impellers'],
      correctIndex: 1,
      explanation: 'Automatic tube cleaning keeps the water side of condenser tubes polished and scale-free, maintaining condenser approach between 1°C and 2°C.',
    },
    {
      id: 5,
      question: 'Which air-conditioning system is best suited for hotels where individual guestrooms require independent temperature control and can be switched off when vacant?',
      options: ['Single-zone CAV system', 'Fan Coil Unit (FCU) system with Primary AHU for treated fresh air', 'Direct ducted constant volume', 'District heating network'],
      correctIndex: 1,
      explanation: 'FCU systems allow guestrooms to operate independently with individual thermostats, while unoccupied rooms can be completely shut off to save energy.',
    },
  ],

  ducts: [
    {
      id: 1,
      question: 'In commercial office building duct design, what is the standard design friction loss rate under the Equal Friction Method?',
      options: ['0.10 to 0.20 Pa/m', '0.80 to 1.00 Pa/m', '5.0 to 10.0 Pa/m', '25 Pa/m'],
      correctIndex: 1,
      explanation: '0.8 to 1.0 Pa/m (0.08 to 0.10 in.wg/100 ft) is the recognized standard for low-noise commercial office ductwork.',
    },
    {
      id: 2,
      question: 'What physical phenomenon causes cold air discharged from ceiling diffusers to travel horizontally along the ceiling before dropping?',
      options: ['Bernoulli cavitation', 'The Coanda effect (ceiling effect)', 'Thermal inversion', 'Adiabatic expansion'],
      correctIndex: 1,
      explanation: 'Friction between the jet and ceiling creates a localized static pressure reduction, causing the jet to cling to the surface and entrain room air.',
    },
    {
      id: 3,
      question: 'If air velocity in an office occupied zone (1.8m above floor) drops below 0.08 m/s, what complaint will occupants make?',
      options: ['Severe draughts', 'Stuffiness and stagnant air', 'Excessive aerodynamic noise', 'Paper blowing off desks'],
      correctIndex: 1,
      explanation: 'Velocities < 0.08 m/s lead to complaints of stuffiness, whereas > 0.25 m/s causes draught complaints.',
    },
    {
      id: 4,
      question: 'Given an airflow Q = 1.2 m³/s and duct cross-sectional area A = 0.24 m² (600mm × 400mm), what is the air velocity?',
      options: ['2.4 m/s', '5.0 m/s', '10.0 m/s', '12.0 m/s'],
      correctIndex: 1,
      explanation: 'Velocity V = Q / A = 1.2 / 0.24 = 5.0 m/s.',
    },
    {
      id: 5,
      question: 'How is dynamic fitting pressure loss calculated for duct elbows and tees?',
      options: ['ΔP = C × V', 'ΔP = C × Pv (where Pv = 0.60 × V²)', 'ΔP = C / Length', 'ΔP = C × Diameter'],
      correctIndex: 1,
      explanation: 'Fitting loss is proportional to the velocity pressure: ΔP = C × Pv, where Pv = 0.5 × ρ × V² ≈ 0.60 V² (for air density 1.2 kg/m³).',
    },
  ],

  chiller: [
    {
      id: 1,
      question: 'What is the formula to calculate chiller cooling capacity from chilled water flow and temperatures?',
      options: ['Q = V / ΔT', 'Q = ṁ_chw × Cw × (tchwr - tchws)', 'Q = kW_e × COP', 'Q = P_discharge - P_suction'],
      correctIndex: 1,
      explanation: 'Q = ṁ × Cw × ΔT, where Cw is the specific heat of water (4.2 kJ/kgK) and ΔT is the temperature difference between return and supply.',
    },
    {
      id: 2,
      question: 'Under Singapore SS 553:2016 Clause 10.7, what is the maximum permissible pump power limitation for chilled water systems?',
      options: ['150 kW/m³/s', '301 kW/m³/s', '349 kW/m³/s', '500 kW/m³/s'],
      correctIndex: 2,
      explanation: 'SS 553 stipulates that the pump motor power ratio must not exceed 349 kW/m³/s for chilled water and 301 kW/m³/s for condenser water systems.',
    },
    {
      id: 3,
      question: 'What is the Singapore BCA Green Mark Platinum benchmark for overall central chilled water plant efficiency?',
      options: ['≤ 0.85 kW/RT', '≤ 0.70 kW/RT', '≤ 0.65 kW/RT', '≤ 0.58 kW/RT'],
      correctIndex: 3,
      explanation: 'BCA Green Mark 2021 sets ≤ 0.58 kW/RT (COP ≥ 6.06) as the world-class Platinum standard for water-cooled chilled water plants.',
    },
    {
      id: 4,
      question: 'How is hydraulic pump output power calculated from flow rate in L/s and pressure difference in kPa?',
      options: ['P_out = Flow (L/s) × ΔP (kPa) / 1000', 'P_out = Flow × ΔP × 3.517', 'P_out = Flow / ΔP', 'P_out = Flow × ΔP × 9.81'],
      correctIndex: 0,
      explanation: 'P_out (kW) = [Volume Flow (L/s) × ΔP (kPa)] / 1000 (from Lesson 5 Practical 1 Equation 6).',
    },
    {
      id: 5,
      question: 'What is "Low Delta-T Syndrome" in a chilled water plant?',
      options: ['When supply water is 0°C', 'When return chilled water returns colder than designed (e.g. 9.5°C vs 12.5°C), forcing excess pumping and premature chiller staging', 'When cooling tower water freezes', 'When compressor motor speed is too low'],
      correctIndex: 1,
      explanation: 'Low ΔT means the water absorbs less heat per liter, requiring higher flow rates, causing pump saturation and forcing extra chillers to stage on at inefficient low loads.',
    },
  ],

  pipes: [
    {
      id: 1,
      question: 'According to Lesson 6 & 8, what is the recommended design range of friction loss rate for water in Schedule 40 commercial steel pipe?',
      options: ['10 to 50 Pa/m', '100 to 400 Pa/m (average 250 Pa/m)', '800 to 1200 Pa/m', '2500 Pa/m'],
      correctIndex: 1,
      explanation: 'The standard economic balance between pumping energy and pipe material cost is 100 to 400 Pa/m, with 250 Pa/m used as the primary sizing line.',
    },
    {
      id: 2,
      question: 'What is the Equivalent Length (Le) of a pipe fitting or valve?',
      options: ['The physical length measured along the centerline', 'The length of straight pipe of the same diameter that produces the identical pressure drop as the fitting', 'The wall thickness of the pipe fitting', 'The maximum allowable span between pipe hangers'],
      correctIndex: 1,
      explanation: 'Equivalent length converts complex turbulent valve/fitting losses into an equivalent length of straight pipe: Le = (Le/D) × D.',
    },
    {
      id: 3,
      question: 'What is the Le/D ratio for a fully open globe valve in commercial steel pipe?',
      options: ['7.5', '55', '95', '320'],
      correctIndex: 3,
      explanation: 'A globe valve forces water through an S-bend passage, causing high resistance with Le/D = 320 (compared to gate valve Le/D = 7.5).',
    },
    {
      id: 4,
      question: 'Why must chilled water velocity not be allowed to drop below 0.6 m/s?',
      options: ['To prevent water from freezing into ice', 'To prevent entrained air and sediments from settling in the pipe', 'To keep the pipe cold on the outside', 'To avoid high electrical pump demand'],
      correctIndex: 1,
      explanation: 'Velocities < 0.6 m/s allow dirt, silt, and air bubbles to settle in low points, causing localized corrosion and air locking.',
    },
    {
      id: 5,
      question: 'In a closed chilled water circuit, what is the static head component in the total pump head calculation?',
      options: ['Zero meters (static pressure on suction and discharge cancel out in a closed loop)', 'Equal to the building height (e.g. 100 meters)', 'Equal to the expansion tank water level', 'Always 2.0 meters'],
      correctIndex: 0,
      explanation: 'In a closed hydraulic circuit, the downward gravity head on the return riser exactly balances the upward gravity head on the supply riser, so static head = 0 m.',
    },
  ],

  ettv: [
    {
      id: 1,
      question: 'What does ETTV stand for, and what is the maximum permissible value in Singapore for air-conditioned non-residential buildings?',
      options: ['Energy Thermal Transmission Value · ≤ 100 W/m²', 'Envelope Thermal Transfer Value · ≤ 50 W/m²', 'Estimated Total Temperature Variation · ≤ 25 W/m²', 'External Trade Temperature Value · ≤ 75 W/m²'],
      correctIndex: 1,
      explanation: 'ETTV = Envelope Thermal Transfer Value, with a maximum statutory cap of 50 W/m² under BCA building regulations.',
    },
    {
      id: 2,
      question: 'Which three components comprise the ETTV equation: ETTV = 12(1-WWR)Uw + 3.4(WWR)Uf + 211(WWR)(CF)(SC)?',
      options: ['People load + lighting load + equipment load', 'Opaque wall conduction + glass window conduction + glass solar radiation', 'Roof conduction + wall conduction + floor conduction', 'Chiller power + pump power + fan power'],
      correctIndex: 1,
      explanation: 'ETTV accounts for heat conduction through opaque walls, heat conduction through window glass, and direct solar radiation through glazing.',
    },
    {
      id: 3,
      question: 'How is the thermal transmittance (U-value) of a composite wall calculated from its total thermal resistance (RT)?',
      options: ['Uw = RT × Area', 'Uw = 1 / RT', 'Uw = RT / k-value', 'Uw = RT + Ro + Ri'],
      correctIndex: 1,
      explanation: 'U-value is the inverse of total thermal resistance: U = 1 / RT (W/m²K).',
    },
    {
      id: 4,
      question: 'What is the Solar Correction Factor (CF) for a vertical wall facing West in Singapore at 90° pitch angle?',
      options: ['0.80', '0.98', '1.23', '2.11'],
      correctIndex: 2,
      explanation: 'From Table C1 / Figure E5 in Lesson 10, West facing vertical walls in Singapore receive high afternoon solar irradiance with CF = 1.23 (North is 0.80).',
    },
    {
      id: 5,
      question: 'What is the maximum permissible Residential Envelope Transmittance Value (RETV) for residential air-conditioned buildings?',
      options: ['15 W/m²', '25 W/m²', '50 W/m²', '75 W/m²'],
      correctIndex: 1,
      explanation: 'Under BCA Green Mark, RETV for residential buildings has a stricter limit of ≤ 25 W/m².',
    },
  ],

  'cooling-load': [
    {
      id: 1,
      question: 'What is the difference between space heat gain and space cooling load?',
      options: ['They are always 100% identical at any instant', 'Heat gain is the instantaneous entry of energy, while cooling load accounts for radiant thermal storage and time lag before energy is transferred to air by convection', 'Cooling load is only caused by people', 'Heat gain includes chiller power while cooling load does not'],
      correctIndex: 1,
      explanation: 'Radiant heat from the sun and lights is initially absorbed by the building structure and furniture, then slowly released to the air later through convection (time lag).',
    },
    {
      id: 2,
      question: 'Under Singapore Standard SS 530, what is the maximum allowable Lighting Power Density (LPD) for commercial offices?',
      options: ['5 W/m²', '12 W/m²', '25 W/m²', '50 W/m²'],
      correctIndex: 1,
      explanation: 'SS 530 mandates a maximum Lighting Power Density of 12 W/m² for general commercial offices and classrooms.',
    },
    {
      id: 3,
      question: 'Under Singapore SS 553:2016, what is the minimum outdoor fresh air supply rate for general commercial offices?',
      options: ['0.1 L/s/m²', '0.6 L/s per m² floor area (or 5.5 L/s per person)', '5.0 L/s/m²', '15.0 L/s/m²'],
      correctIndex: 1,
      explanation: 'SS 553 Table 4.10 prescribes 0.6 L/s/m² (or 5.5 L/s per person) minimum outdoor air supply for offices to ensure good indoor air quality.',
    },
    {
      id: 4,
      question: 'How is solar heat gain through vertical glass windows (Qc1) calculated?',
      options: ['Qc1 = Ag × Ug × ΔT', 'Qc1 = Ag × SHGF × SC × CLF', 'Qc1 = Volume × ACH', 'Qc1 = ṁ × Cp × ΔT'],
      correctIndex: 1,
      explanation: 'Qc1 = Area of glazing (Ag) × Solar Heat Gain Factor (SHGF) × Shading Coefficient (SC) × Cooling Load Factor (CLF).',
    },
    {
      id: 5,
      question: 'In practice, how much are supply air duct heat gains typically estimated as a percentage of Space Sensible Cooling Load (SCL)?',
      options: ['0.1%', '1% to 4% (typically 2%)', '15% to 25%', '50%'],
      correctIndex: 1,
      explanation: 'Lesson 12 notes that supply air duct heat gain through unconditioned ceiling plenums is typically estimated at 1% to 4% (2% in the worked example).',
    },
  ],

  psychrometrics: [
    {
      id: 1,
      question: 'How is the Room Sensible Heat Factor (RSHF) defined?',
      options: ['RSHF = RLCL / RSCL', 'RSHF = RSCL / (RSCL + RLCL)', 'RSHF = (tr - ts) / tr', 'RSHF = Specific Enthalpy / Specific Volume'],
      correctIndex: 1,
      explanation: 'RSHF is the ratio of room sensible cooling load to total room cooling load: RSHF = RSCL / (RSCL + RLCL).',
    },
    {
      id: 2,
      question: 'What is the Apparatus Dew Point (ADP) of a cooling coil?',
      options: ['The outdoor ambient dew point temperature', 'The effective average surface temperature of the cooling coil where the condition line intersects 100% saturation', 'The boiling point of pure water', 'The temperature inside the compressor crankcase'],
      correctIndex: 1,
      explanation: 'ADP represents the thermodynamic temperature of the cooling coil fin surfaces.',
    },
    {
      id: 3,
      question: 'If outdoor air at 32°C DB mixes with return air at 24°C DB with an outdoor air ratio of 15% (ṁo/ṁs = 0.15), what is the mixed air temperature (tm)?',
      options: ['24.0°C', '25.2°C (25.35°C)', '28.0°C', '32.0°C'],
      correctIndex: 1,
      explanation: 'tm = tr + (ṁo/ṁs) × (to - tr) = 24 + 0.15 × (32 - 24) = 24 + 1.2 = 25.2°C (Lesson 13 Example 5.2 uses 33°C to obtain 25.35°C).',
    },
    {
      id: 4,
      question: 'Under Singapore SS 553 Clause 7.3.2, what is the design temperature rule for air leaving a supply diffuser relative to the room dew point?',
      options: ['Must be at least 10°C below room dew point', 'Must be designed at a temperature less than 2°C below the room dew point to prevent condensation on the diffuser face', 'Must always be at 100% relative humidity', 'Must exceed 26°C'],
      correctIndex: 1,
      explanation: 'SS 553 Clause 7.3.2 stipulates that air leaving diffusers must be less than 2°C below room dew point to prevent water droplets condensing on diffuser surfaces.',
    },
    {
      id: 5,
      question: 'What is a major advantage of Variable Air Volume (VAV) systems over Constant Air Volume (CAV)?',
      options: ['VAV boxes have zero moving parts', 'AHUs can take advantage of load diversity, allowing smaller fan sizes and saving up to 50% fan operating energy', 'VAV systems completely eliminate the need for fresh outdoor air', 'VAV systems do not require temperature sensors'],
      correctIndex: 1,
      explanation: 'Because building zones peak at different hours (East morning vs West afternoon), VAV systems size fans based on the simultaneous block load, reducing fan sizes by ~30% and annual kWh by up to 50%.',
    },
  ],

  'design-conditions': [
    {
      id: 1,
      question: 'Under Singapore Standard SS 553:2016, what are the recommended indoor design comfort conditions for air-conditioned spaces?',
      options: ['20°C to 22°C · RH ≤ 40% · air speed ≤ 0.10 m/s', '23°C to 25°C · RH ≤ 65% · air speed ≤ 0.30 m/s', '26°C to 28°C · RH ≤ 80% · air speed ≤ 0.50 m/s', '18°C to 20°C · RH ≤ 50% · air speed ≤ 0.15 m/s'],
      correctIndex: 1,
      explanation: 'SS 553:2016 Clause 5.1 specifies an operative temperature of 23°C to 25°C, relative humidity not exceeding 65%, and air velocity not exceeding 0.30 m/s for indoor thermal comfort.',
    },
    {
      id: 2,
      question: 'What are the official Singapore outdoor design conditions, and why is positive room pressure (+10 to +25 Pa) maintained?',
      options: [
        '30.0°C DB / 25.0°C WB · to blow out dust particles',
        '33.5°C DB / 27.5°C WB · to prevent humid outdoor air and moisture infiltration through envelope joints',
        '36.0°C DB / 30.0°C WB · to reduce cooling coil fan power',
        '28.0°C DB / 24.0°C WB · to increase compressor compression ratio',
      ],
      correctIndex: 1,
      explanation: 'Singapore coincident peak outdoor design condition is 33.5°C DB and 27.5°C WB. Maintaining +10 to +25 Pa positive room pressure forces outward exfiltration, preventing hot, humid tropical outdoor air and airborne moisture from infiltrating through door cracks and facade joints.',
    },
    {
      id: 3,
      question: 'How do CAV and VAV air distribution systems respond when space cooling demand decreases?',
      options: [
        'CAV stops the supply fan entirely, while VAV turns off chilled water pumps',
        'CAV throttles modulating chilled water flow raising supply air temperature at constant airflow; VAV modulates terminal dampers reducing airflow rate at constant supply air temperature',
        'Both CAV and VAV decrease fan speed simultaneously to zero',
        'CAV increases supply airflow, while VAV heats the room with electric resistance heaters',
      ],
      correctIndex: 1,
      explanation: 'Constant Air Volume (CAV) delivers fixed airflow at all times and throttles the cooling coil valve to raise supply air temperature as load decreases. Variable Air Volume (VAV) modulates terminal unit dampers to reduce airflow rate while keeping supply air temperature constant (typically ~13°C).',
    },
    {
      id: 4,
      question: 'In refrigeration equipment, how does a Thermostatic Expansion Valve (TXV) maintain constant superheat at the evaporator outlet?',
      options: [
        'By measuring electrical motor current draw',
        'By balancing sensing bulb pressure against evaporator pressure and spring pressure: P1 = P2 + P3',
        'By opening completely whenever condenser water pump starts',
        'By converting high-pressure vapor into subcooled liquid',
      ],
      correctIndex: 1,
      explanation: 'The TXV operates on three balancing forces: P1 (bulb pressure on top of diaphragm pushing valve open) equals P2 (evaporator suction pressure beneath diaphragm) plus P3 (spring pressure pushing valve closed). When superheat increases, bulb pressure P1 rises and opens the valve needle to admit more liquid refrigerant.',
    },
    {
      id: 5,
      question: 'In water-cooled chillers, what is the impact of tube scale and fouling on the condenser approach temperature and compressor power consumption?',
      options: [
        'Tube fouling lowers condensing pressure and reduces compressor power',
        'Tube fouling creates thermal resistance, elevating condenser approach temperature and increasing compressor power by ~2% to 3% for every 0.5°C rise',
        'Tube fouling has zero effect because water velocity compensates for scale',
        'Tube fouling prevents the compressor from overheating by insulating the copper tubes',
      ],
      correctIndex: 1,
      explanation: 'Mineral scale and algae buildup on inner tube walls add thermal resistance (fouling factor Rf), reducing the heat transfer coefficient. This forces the saturated condensing temperature to rise, increasing compressor lift. Compressor electrical power increases by 2% to 3% for every 0.5°C rise in condenser approach.',
    },
  ],
};
