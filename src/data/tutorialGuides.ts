export interface TutorialQuestion {
  questionNumber: string;
  prompt: string;
  steps: string[];
  finalAnswer: string;
}

export interface TutorialGuide {
  id: string;
  title: string;
  amvsTopic: string;
  pdfPath: string;
  weeksCovered: number[];
  weeksCoveredLabel: string;
  questions: TutorialQuestion[];
}

export const TUTORIAL_GUIDES: TutorialGuide[] = [
  // =========================================================================
  // TUTORIAL 1 (AMVS 1)
  // =========================================================================
  {
    id: 'tutorial-1',
    title: 'Tutorial 1 (AMVS 1): Introduction to Air-conditioning Systems',
    amvsTopic: 'AMVS 1: Introduction to Air-conditioning Systems',
    pdfPath: '/assets/aistudio/Tutorial_1_Apr_26_c1496a6f.pdf',
    weeksCovered: [1],
    weeksCoveredLabel: 'Week 1',
    questions: [
      {
        questionNumber: 'Q1. DX vs chilled water system',
        prompt: 'Explain the main difference between a DX (Direct Expansion) and a chilled water system.',
        steps: [
          '1. Ask "what touches the air?" In DX, refrigerant evaporates directly in the coil. In chilled water, the refrigerant cools water first, and the water cools the air.',
          '2. Count the heat-transfer stages: DX has one (air → refrigerant). Chilled water has two (air → water → refrigerant).',
          '3. Say what is piped to the space: refrigerant (DX) or chilled water at about 7–8 °C supply and 12–13 °C return (chilled water).',
          '4. Give an application example: DX fits split units and VRF; chilled water fits multi-storey commercial buildings, campuses and district cooling.',
        ],
        finalAnswer:
          'DX evaporates refrigerant directly in the room coil (single heat transfer stage, refrigerant piping). Chilled water cools water in a central chiller and pumps it to AHUs/FCUs at 7–8 °C (two stages, water piping). DX suits small to mid buildings; chilled water suits large commercial plants.',
      },
      {
        questionNumber: 'Q2. Air-cooled chilled water system schematic',
        prompt: 'Sketch the heat and fluid flow schematic for an air-cooled chilled water system.',
        steps: [
          '1. Draw the refrigeration cycle: compressor, air-cooled condenser with fan, expansion valve, and water-cooler (evaporator).',
          '2. Draw the chilled water circuit: pump moves chilled water at 7–8 °C from evaporator through insulated supply pipes to the AHU/FCU cooling coils, returning at 12–13 °C back to evaporator.',
          '3. Trace heat rejection: room heat is absorbed into chilled water, transferred across evaporator tubes into evaporating refrigerant, compressed to high pressure/temperature, and rejected directly to outdoor ambient air through the finned air-cooled condenser coil.',
        ],
        finalAnswer:
          'A closed-circuit chilled water loop (pump circulates water at 7–8 °C supply and 12–13 °C return between chiller evaporator and air coils) coupled to an outdoor air-cooled condensing unit rejecting heat directly to ambient air.',
      },
      {
        questionNumber: 'Q3. Equipment and numbered components identification',
        prompt: 'Name the equipment and numbered components shown in Figures 3.1 to 3.4.',
        steps: [
          '1. Figure 3.1 (Indoor unit of split air-conditioner): 1 = Evaporator cooling coil, 2 = Capillary tube / refrigerant distributor, 3 = Condensate drain pan.',
          '2. Figure 3.2 (Outdoor condensing unit of split air-conditioner): 1 = Hermetic reciprocating/rotary compressor, 2 = Air-cooled condenser coil, 3 = Propeller condenser fan.',
          '3. Figure 3.3 (Water-cooled packaged chiller): 1 = Semi-hermetic screw compressor, 2 = Discharge line, 3 = Oil separator, 4 = Electric drive motor, 5 = Suction line, 6 = Shell-and-tube condenser, 7 = Condenser water nozzles, 8 = Thermostatic expansion valve, 9 = Shell-and-tube evaporator (cooler).',
          '4. Figure 3.4 (Packaged / window unit layout): 1 = Evaporator coil, 2 = Supply blower fan, 3 = Air filter, 4 = Condensate pan / slinger ring, 5 = Room thermostat, 6 = Hermetic compressor, 7 = Capillary tube expansion device.',
        ],
        finalAnswer:
          'Fig 3.1: Split indoor unit. Fig 3.2: Split outdoor condensing unit. Fig 3.3: Semi-hermetic screw water-cooled chiller. Fig 3.4: Packaged/window unit layout.',
      },
      {
        questionNumber: 'Q4. Split unit cooling capacity conversion',
        prompt: 'The rated cooling capacity of Component 1 is 18,000 Btu/h. What is its rating in RT?',
        steps: [
          '1. Recall conversion constant: 1 Refrigeration Ton (RT) = 12,000 Btu/h = 3.517 kW.',
          '2. Divide rated Btu/h by 12,000: Capacity (RT) = 18,000 Btu/h / 12,000 Btu/h/RT.',
          '3. Compute: 18,000 / 12,000 = 1.50 RT.',
          '4. Convert to kW if needed: 1.50 RT × 3.517 kW/RT = 5.275 kW ≈ 5.28 kW.',
        ],
        finalAnswer: '1.50 RT (or 5.28 kW)',
      },
      {
        questionNumber: 'Q5. Water-cooled chiller efficiency: kWe/RT and COP',
        prompt: 'A water-cooled chiller consumes 480 kWe when it provides a cooling capacity of 3600 kWr. What is its efficiency in terms of kWe/RT and COP?',
        steps: [
          '1. Convert cooling capacity from kW to RT: Q (RT) = 3600 kW / 3.517 kW/RT = 1,023.60 RT (or 3600 / 3.51685 = 1,023.64 RT).',
          '2. Calculate specific power in kWe/RT: Efficiency = Electrical Power (kWe) / Cooling Capacity (RT) = 480 / 1,023.60 = 0.4689 kWe/RT ≈ 0.469 kWe/RT.',
          '3. Calculate COP: COP = Useful Cooling Output (kW) / Electrical Power Input (kW) = 3600 kW / 480 kW = 7.50.',
          '4. Cross-verify: kWe/RT = 3.517 / COP = 3.517 / 7.50 = 0.469 kWe/RT.',
        ],
        finalAnswer: 'Efficiency = 0.469 kWe/RT | COP = 7.50 (Meets BCA Green Mark Platinum standard ≤ 0.58 kW/RT)',
      },
      {
        questionNumber: 'Q6. CAV system operation on decreasing cooling demand',
        prompt: 'Describe the operation of a CAV system when the cooling demand decreases, including sensor operation.',
        steps: [
          '1. Recognize constant airflow: In a Constant Air Volume (CAV) system, the supply fan delivers a fixed volumetric airflow rate (m³/s) at all times.',
          '2. Thermostat senses load drop: As space thermal load decreases, room temperature falls below setpoint (e.g. < 24 °C).',
          '3. Signal to control valve: Room temperature sensor signals the motorized 2-way or 3-way modulating chilled water valve on the AHU coil to modulate toward the closed position.',
          '4. Coil heat transfer reduces: Throttling chilled water flow decreases coil cooling rate, causing supply air temperature to rise (e.g. from 14 °C up to 18 °C) until room setpoint temperature is restored.',
        ],
        finalAnswer:
          'Room thermostat detects dropping temperature and throttles the AHU modulating chilled water valve. Water flow decreases, raising supply air temperature to match reduced load while airflow remains constant.',
      },
      {
        questionNumber: 'Q7. Conventional VAV AHU operation on increasing cooling demand',
        prompt: 'Describe the operation of a conventional VAV AHU when the space cooling demand increases, including sensor operation.',
        steps: [
          '1. Thermostat senses temperature rise: Space temperature rises above setpoint (e.g. > 24 °C) due to increased occupant or solar load.',
          '2. VAV terminal damper modulates: Room thermostat signals the local VAV terminal box actuator to open the damper blade wider, admitting more cold primary air (at constant ~13–15 °C) into the room.',
          '3. Duct static pressure drops: Multiple VAV boxes opening reduces overall resistance and causes static pressure inside the supply duct trunk to decrease.',
          '4. Static pressure sensor detects drop: Static pressure sensor located 2/3 down the main duct detects the drop below setpoint (e.g. below 250 Pa) and sends an error signal to the AHU controller.',
          '5. VFD accelerates supply fan: Controller signals the Variable Frequency Drive (VFD) to increase fan motor speed, restoring duct static pressure and delivering higher airflow.',
        ],
        finalAnswer:
          'Room thermostat opens VAV terminal damper → more cold air delivered to room. Duct static pressure drops → static sensor signals VFD to speed up AHU supply fan, maintaining duct static pressure at setpoint.',
      },
      {
        questionNumber: 'Q8. Central chilled water AHU heat transfer and expansion tank',
        prompt: 'Describe how heat is transferred in Figure 8 from conditioned spaces to the outdoors using temperatures shown, and explain the function of Component 8.',
        steps: [
          '1. Air loop: Room air at 24 °C passes over AHU cooling coil, cooling to 15 °C before being supplied back to the space.',
          '2. Chilled water loop: Chilled water absorbs heat in the coil, rising from 8 °C supply to 13 °C return, and is pumped back to the chiller evaporator (cooler 4).',
          '3. Refrigerant loop: Evaporator transfers heat from 13 °C water to boiling refrigerant (cooling water back to 8 °C). Compressor (5) compresses refrigerant vapour to high pressure/temperature.',
          '4. Condenser / heat rejection loop: High-temperature refrigerant vapour enters air-cooled condenser (6). Outdoor air at 32 °C flows across condenser coils and is discharged heated at 45 °C, rejecting room and compressor heat.',
          '5. Component 8 (Expansion tank): Absorbs volumetric thermal expansion and contraction of water, maintains positive hydrostatic head at pump suction to prevent cavitation, and provides air separation/make-up.',
        ],
        finalAnswer:
          'Heat transfer: Room Air (24 °C → 15 °C) → Chilled Water (8 °C → 13 °C) → Evaporator → Compressor → Condenser → Outdoor Air (32 °C in → 45 °C discharge). Component 8 is an expansion tank accommodating water expansion and maintaining positive suction pressure.',
      },
    ],
  },

  // =========================================================================
  // TUTORIAL 2 (AMVS 2)
  // =========================================================================
  {
    id: 'tutorial-2',
    title: 'Tutorial 2 (AMVS 2): Air-conditioning Equipment & Energy Audit',
    amvsTopic: 'AMVS 2: Air-conditioning Equipment',
    pdfPath: '/assets/aistudio/Tutorial_2_Apr_26_1b03e097.pdf',
    weeksCovered: [5],
    weeksCoveredLabel: 'Week 5',
    questions: [
      {
        questionNumber: 'Q1 & Q2. Compressors by construction and compression method',
        prompt: 'State differences between open, hermetic and serviceable hermetic compressors, and name types by method of compression.',
        steps: [
          '1. Open compressor: Motor and compressor are distinct units connected via external shaft coupling or belt drive. Requires external mechanical shaft seal, which can leak refrigerant over time.',
          '2. Hermetic compressor: Motor and compressor are enclosed inside a single welded steel shell. No shaft seal and zero external leakage, but non-serviceable (must be replaced if burnt out).',
          '3. Semi-hermetic (serviceable hermetic): Motor and compressor housed in a common bolted cast-iron casing with gasketed cylinder heads. Allows on-site servicing and cylinder/bearing rebuilds without cutting.',
          '4. Types by method of compression: Positive displacement (Reciprocating, Rotary vane, Scroll, Single/Twin Screw) vs Dynamic / Roto-dynamic (Centrifugal).',
        ],
        finalAnswer:
          'Open = external motor with shaft seal. Hermetic = welded sealed shell, non-serviceable. Semi-hermetic = bolted accessible housing. Methods: Positive displacement (reciprocating, scroll, screw) and Dynamic (centrifugal).',
      },
      {
        questionNumber: 'Q3. Metering devices: TXV and low-side float',
        prompt: 'Describe the construction and operation of a thermostatic expansion valve (TXV) and low-side float.',
        steps: [
          '1. TXV forces balance: Operates via 3 opposing forces: P1 (bulb pressure on top of diaphragm pushing valve open) vs P2 (evaporator pressure beneath diaphragm pushing valve closed) + P3 (spring pressure pushing valve closed). Equilibrium: P1 = P2 + P3.',
          '2. Superheat modulation: Sensing bulb clamped to evaporator outlet pipe senses suction temperature. When superheat increases, bulb pressure P1 rises, depressing diaphragm and opening valve needle to admit more liquid refrigerant.',
          '3. Low-side float: Located in flooded evaporator surge drum. Buoyant hollow sphere floats on liquid refrigerant surface. As liquid boils away and level drops, float drops and opens needle orifice to admit liquid from condenser; when level rises, float rises and closes orifice.',
        ],
        finalAnswer:
          'TXV balances bulb pressure against evaporator plus spring pressure (P1 = P2 + P3) to maintain constant superheat at coil outlet. Low-side float maintains constant liquid level inside a flooded evaporator.',
      },
      {
        questionNumber: 'Q4. Shell-and-tube condenser and tube fouling',
        prompt: 'Describe a 2-pass shell-and-tube condenser and explain why keeping the water side clean is critical.',
        steps: [
          '1. Fluid circulation: Refrigerant vapour discharges from compressor into shell exterior; cooling water circulates through inner copper tubes. In a 2-pass design, water enters bottom half of tube bundle (pass 1), reverses in end head, and exits through top half (pass 2).',
          '2. Fouling accumulation: Hard water minerals (calcium carbonate), algae, bacteria, and silt precipitate onto inner tube walls, forming an insulating scale layer (fouling factor Rf).',
          '3. Impact on performance: Scale severely reduces overall heat transfer coefficient (U), forcing saturated condensing temperature and pressure to rise.',
          '4. Power penalty: Higher condensing pressure increases compressor discharge head. Compressor power increases by 2% to 3% for every 0.5 °C increase in condenser approach, increasing operating cost and risking high-pressure cutout trips.',
        ],
        finalAnswer:
          '2-pass condenser circulates water through tubes in two passes while refrigerant condenses on shell outside. Tube fouling adds thermal resistance, elevating condensing pressure and compressor kW/RT (power increases ~2–3% per 0.5 °C approach rise).',
      },
      {
        questionNumber: 'Q5. Refrigeration accessories and locations',
        prompt: 'State the functions and locations of High pressure cut-out, Low pressure cut-out, Filter drier, and Sight glass.',
        steps: [
          '1. High pressure cut-out: Safety switch piped to compressor discharge line. Trips motor when discharge pressure exceeds safety threshold (e.g. condenser fan failure or clogged tubes).',
          '2. Low pressure cut-out: Safety/operating switch piped to compressor suction line. Trips motor when suction pressure drops below setpoint to prevent vacuum air ingress, oil foaming, or water freezing; also used for pump-down control.',
          '3. Filter drier: Located in liquid line after condenser/receiver before expansion valve. Desiccant beads absorb moisture; filter element traps metal particles, solder flux, and sludge.',
          '4. Sight glass with moisture indicator: Located in liquid line downstream of filter drier. Clear window allows visual check for bubbles (flashing/shortage); chemical indicator changes color (green = dry, yellow = wet/contaminated).',
        ],
        finalAnswer:
          'HP cut-out on discharge line (overpressure safety); LP cut-out on suction line (freeze/vacuum protection); Filter drier on liquid line (removes moisture and debris); Sight glass after filter drier (checks liquid subcooling and moisture).',
      },
      {
        questionNumber: 'Q6 & Q7. Draw-through vs blow-through AHU and dirty filters',
        prompt: 'Differentiate between draw-through and blow-through AHUs and discuss the effects of dirty filters.',
        steps: [
          '1. Draw-through configuration: Supply fan is downstream of cooling coil (draws air through coil). Provides uniform air velocity across coil face; fan motor heat is added directly to cooled supply air.',
          '2. Blow-through configuration: Supply fan is upstream of cooling coil (blows air into coil). High coil static pressure suits multizone mixing boxes, but velocity across coil can be uneven.',
          '3. Effects of dirty filters: Dust loading increases filter differential pressure (ΔP), increasing overall system resistance.',
          '4. Airflow reduction: System operating point moves left on fan curve, reducing volumetric flow (m³/s). Less airflow drops room air change rate, lowers coil evaporating temperature (risking coil icing), and degrades indoor thermal comfort.',
        ],
        finalAnswer:
          'Draw-through has fan downstream of coil (uniform velocity); blow-through has fan upstream. Dirty filters increase resistance, reducing supply airflow, lowering evaporating temperature (risking coil frost), and starving room ventilation.',
      },
      {
        questionNumber: 'Q8. Energy audit calculations (Figure 8)',
        prompt: 'Given V_cw = 125 L/s, tcwr = 35 °C, tcws = 29 °C, V_chw = 128 L/s, tchwr = 13 °C, tchws = 8 °C, P_elec = 462 kW, T_cond_sat = 36.8 °C, T_evap_sat = 6.5 °C. Calculate (a) cooling capacity, (b) kW/RT, (c) COP, (d) heat rejection rate, (e) evaporator approach, (f) condenser approach.',
        steps: [
          '1. (a) Chiller cooling capacity Q_chw: Q = m_chw × Cp × (tchwr - tchws) = 128 kg/s × 4.19 kJ/kg·K × (13 - 8) K = 128 × 4.19 × 5 = 2,681.6 kW. In RT: 2,681.6 kW / 3.517 kW/RT = 762.5 RT (or using Cp=4.2: 128 × 4.2 × 5 = 2,688 kW / 3.517 = 764.3 RT).',
          '2. (b) Specific power input: kW/RT = 462 kW / 762.5 RT = 0.6059 kW/RT ≈ 0.606 kW/RT (or 462 / 764.3 = 0.605 kW/RT).',
          '3. (c) Coefficient of Performance: COP = Cooling Output (kW) / Electrical Input (kW) = 2,681.6 kW / 462 kW = 5.80 (or 2,688 / 462 = 5.82).',
          '4. (d) Chiller heat rejection rate: Condenser water side: Q_cond = 125 kg/s × 4.19 × (35 - 29) = 125 × 4.19 × 6 = 3,142.5 kW. Energy balance: Q_rej = Cooling capacity + Power input = 2,681.6 + 462 = 3,143.6 kW (~100% heat balance match!).',
          '5. (e) Evaporator approach: tchws - T_evap_sat = 8.0 °C - 6.5 °C = 1.5 K (or 1.5 °C).',
          '6. (f) Condenser approach: T_cond_sat - tcwr = 36.8 °C - 35.0 °C = 1.8 K (or 1.8 °C).',
        ],
        finalAnswer:
          '(a) 2,681.6 kW (762.5 RT) | (b) 0.606 kW/RT | (c) COP = 5.80 | (d) 3,142.5 kW | (e) Evaporator approach = 1.5 K | (f) Condenser approach = 1.8 K',
      },
      {
        questionNumber: 'Q9 to Q11. Tube cleaning, plant starting sequence, and flow switches',
        prompt: 'Describe automatic tube cleaning systems, state the chronological starting sequence for chilled water plant equipment, and explain the need for flow switches.',
        steps: [
          '1. Automatic tube cleaning systems: (1) Sponge ball system: elastomeric sponge balls injected into condenser inlet header, scrub tubes clean, and are captured by downstream ball strainer and pumped back. (2) Brush-and-basket system: nylon brush in each tube is propelled back and forth when a 4-way valve reverses water flow direction periodically.',
          '2. Plant starting sequence in chronological order: 1. Cooling Towers → 2. Condenser Water Pumps → 3. Chilled Water Pumps → 4. Water-Cooled Chillers.',
          '3. Reason for starting order & flow switches: Establishes heat rejection medium and water flows before compressor starts. Evaporator flow switch prevents chiller start or trips compressor if chilled water stops, preventing water from freezing inside tubes and bursting shell-and-tube bundle. Condenser flow switch trips compressor if condenser water fails, preventing high pressure cutout and damage.',
        ],
        finalAnswer:
          'Cleaning: Sponge ball circulating system or brush-and-basket reversing system. Starting sequence: 1. Cooling Towers → 2. CW Pumps → 3. CHW Pumps → 4. Water-Cooled Chillers. Flow switches interlock compressor to prevent catastrophic tube freeze-up and condenser overpressure.',
      },
      {
        questionNumber: 'Q12 to Q15. Cooling tower range, approach, water flows and bleed-off',
        prompt: 'Define cooling tower range and approach. Given Q_chiller = 600 kW, tchws = 8 °C, tchwr = 15 °C, ambient 32 °C dbt / 26 °C wbt, rejection factor 1.25, approach = 3 °C, range = 6 °C. Calculate (a) CHW flow rate, (b) tower heat rejection capacity, (c) entering and leaving CW temperatures. Explain make-up and bleed-off.',
        steps: [
          '1. Definitions: Range = Tc_in - Tc_out (temperature drop across tower). Approach = Tc_out - T_wb (leaving water temp minus ambient wet-bulb temp).',
          '2. (a) CHW flow rate: m_chw = Q / (Cp × ΔT) = 600 kW / (4.19 kJ/kg·K × (15 - 8) K) = 600 / 29.33 = 20.46 kg/s ≈ 20.5 l/s.',
          '3. (b) Cooling tower heat rejection capacity: Q_ct = Q_chiller × 1.25 = 600 kW × 1.25 = 750 kW.',
          '4. (c) CW temperatures: Leaving tower Tc_out = Ambient WBT + Approach = 26 °C + 3 °C = 29 °C. Entering tower Tc_in = Tc_out + Range = 29 °C + 6 °C = 35 °C.',
          '5. Make-up water and bleed-off: Make-up water replenishes water lost to evaporation (~1% of flow), drift droplets, and bleed-off. Bleed-off purges a continuous small bleed of high-conductivity water to prevent dissolved solids (TDS) and silica from saturating and forming scale on chiller tubes.',
        ],
        finalAnswer:
          '(a) CHW flow = 20.5 l/s | (b) Tower capacity = 750 kW | (c) Leaving CW = 29 °C, Entering CW = 35 °C. Make-up replaces evaporation/drift; bleed-off controls cycles of concentration to prevent condenser scaling.',
      },
      {
        questionNumber: 'Q16. ACMV equipment maintenance tasks',
        prompt: 'List six maintenance tasks for air-cooled split unit, water-cooled packaged unit, AHU, and cooling tower.',
        steps: [
          '1. Air-cooled split unit: Clean air filter mesh, wash outdoor condenser coil, check refrigerant operating pressures, inspect condensate drain pan and drain line, test thermostat accuracy, check fan motor bearings and electrical connections.',
          '2. Water-cooled packaged unit: Inspect and flush condenser strainer, clean shell-and-tube condenser tubes, check compressor oil level and sight glass, inspect V-belt tension and alignment, test high/low pressure cutouts, check water regulating valve operation.',
          '3. Air Handling Unit (AHU): Replace pre-filters and bag filters, chemically clean cooling coil fins, clear condensate pan and U-trap, lubricate fan and motor bearings, inspect drive belt tension and pulley alignment, check modulating control valve operation.',
          '4. Cooling tower: Clean water distribution basin and unclog spray nozzles, inspect fill packing for biological fouling and scaling, clean drift eliminators, check make-up water float valve, test water treatment chemical dosing and biocide, drain and disinfect basin to prevent Legionella proliferation.',
        ],
        finalAnswer:
          'Key preventive maintenance involves filter cleaning/replacement, coil washing, belt tensioning, water chemical treatment, tube descaling, and Legionella disinfection.',
      },
    ],
  },

  // =========================================================================
  // TUTORIAL 3 (AMVS 3)
  // =========================================================================
  {
    id: 'tutorial-3',
    title: 'Tutorial 3 (AMVS 3): Duct Systems & Sizing',
    amvsTopic: 'AMVS 3: Duct Systems & Sizing',
    pdfPath: '/assets/aistudio/Tutorial_3_Apr_26__1__57c7fbf4.pdf',
    weeksCovered: [3, 4],
    weeksCoveredLabel: 'Weeks 3 & 4',
    questions: [
      {
        questionNumber: 'Q1 to Q3. Duct insulation, throw & drop, and design objectives',
        prompt: 'State the purpose of duct insulation, explain throw and drop with diagrams, and list 5 design objectives.',
        steps: [
          '1. External insulation (fiberglass with double-sided aluminum foil): Prevents condensation on outer duct surface (preventing water dripping onto ceilings) and minimizes thermal heat gain from hot ceiling spaces.',
          '2. Internal acoustic lining: Absorbs fan noise, airflow turbulence, and acoustic vibrations inside the first 3–6 m of supply and return ductwork.',
          '3. Throw and drop: "Throw" is the horizontal or vertical distance from the air diffuser outlet to the point where the air jet velocity decays to terminal velocity (0.25 to 0.50 m/s). "Drop" is the vertical downward sag of cold supply air due to its greater density before reaching the end of its throw.',
          '4. 5 Design objectives: (1) Deliver required conditioned air volume to satisfy thermal loads, (2) Keep noise levels within NC 30–35 criteria, (3) Fit within spatial ceiling void limits (depth ≤ 300 mm), (4) Minimize friction and dynamic pressure losses to reduce fan energy, (5) Optimize sheet metal material usage and fabrication cost.',
        ],
        finalAnswer:
          'External insulation stops surface condensation; internal acoustic lining silences fan noise. Throw is jet travel distance to terminal velocity; drop is cold jet sagging. Objectives: air delivery, low noise (NC ≤ 35), ceiling void clearance, low fan power, economical cost.',
      },
      {
        questionNumber: 'Q4. Fan Coil Unit duct sizing & external fan static pressure (Figure 4)',
        prompt: 'Size rectangular ductwork in the index run using Equal Friction Method (1.0 Pa/m, max depth 300 mm, 500 l/s per diffuser, 20% outdoor air, 20% safety factor). Determine external fan static pressure.',
        steps: [
          '1. Index run identification: Return Grille 10 → Section 10 (4 m) → Sec 9 (3 m) → FCU → Sec 1 (7 m) → Sec 2 (3 m) → Sec 3 (3 m) → Sec 4 (6 m) → Diffuser 4. Total straight duct length = 4 + 3 + 7 + 3 + 3 + 6 = 26 m.',
          '2. Section volumetric flow rates (500 l/s per diffuser): Sec 1 = 4 × 500 = 2,000 l/s; Sec 2 = 3 × 500 = 1,500 l/s; Sec 3 = 2 × 500 = 1,000 l/s; Sec 4 = 1 × 500 = 500 l/s. Return: 20% OA means 80% RA = 1,600 l/s total return (800 l/s per grille: Sec 10 = 800 l/s, Sec 9 = 800 l/s).',
          '3. Duct sizing at 1.0 Pa/m with depth fixed at 300 mm:\n   - Sec 1 (2,000 l/s): Ø eq ≈ 560 mm → 850 mm × 300 mm (Vel = 7.84 m/s, Pv = 37.0 Pa)\n   - Sec 2 (1,500 l/s): Ø eq ≈ 500 mm → 700 mm × 300 mm (Vel = 7.14 m/s, Pv = 30.6 Pa)\n   - Sec 3 (1,000 l/s): Ø eq ≈ 440 mm → 500 mm × 300 mm (Vel = 6.67 m/s, Pv = 26.7 Pa)\n   - Sec 4 (500 l/s): Ø eq ≈ 335 mm → 300 mm × 300 mm (Vel = 5.56 m/s, Pv = 18.5 Pa)\n   - Sec 9 (800 l/s): Ø eq ≈ 400 mm → 450 mm × 300 mm (Vel = 5.93 m/s, Pv = 21.1 Pa)\n   - Sec 10 (800 l/s): Ø eq ≈ 400 mm → 450 mm × 300 mm (Vel = 5.93 m/s, Pv = 21.1 Pa)',
          '4. Straight duct friction loss: ΔP_duct = 26 m × 1.0 Pa/m = 26.0 Pa.',
          '5. Dynamic fitting losses (Σ Co × Pv): Fan discharge loss (0.7 × 37.0 = 25.9 Pa) + fittings (elbows, tees, transitions) = 158.1 Pa.',
          '6. Terminal equipment losses: Supply diffuser (20 Pa) + Return grille (20 Pa) = 40.0 Pa.',
          '7. Total pressure drop: 26.0 + 158.1 + 40.0 = 224.1 Pa.',
          '8. Apply 20% safety factor: 224.1 Pa × 1.20 = 268.9 Pa ≈ 270 Pa.',
        ],
        finalAnswer:
          'Index Run: 10-9-FCU-1-2-3-4 | Straight duct loss = 26.0 Pa | Dynamic & terminal losses = 198.1 Pa | External Fan Static Pressure = 268.9 Pa ≈ 270 Pa',
      },
      {
        questionNumber: 'Q5. AHU duct sizing & external fan static pressure (Figure 5)',
        prompt: 'Size rectangular ductwork in the index run for AHU layout (Figure 5) using Equal Friction Method (0.8 Pa/m, max depth 300 mm, 500 l/s per diffuser, 15% OA, 20% safety factor). Calculate external fan static pressure.',
        steps: [
          '1. Index run identification: Path from Return Grille 15 → Sec 15 (13 m) → Sec 14 (10 m) → Sec 11 (12 m) → AHU → Sec 1 (10 m) → Sec 2 (10 m) → Sec 9 (12 m) → Sec 10 (6 m) → Supply Diffuser 10. Total straight length = 13 + 10 + 12 + 10 + 10 + 12 + 6 = 73 m.',
          '2. Duct sizing at 0.8 Pa/m (depth ≤ 300 mm):\n   - Sec 1 (3,000 l/s): Ø eq ≈ 660 mm → 1,200 mm × 300 mm (Vel = 8.33 m/s, Pv = 41.7 Pa)\n   - Sec 2 (2,000 l/s): Ø eq ≈ 570 mm → 900 mm × 300 mm (Vel = 7.41 m/s, Pv = 32.9 Pa)\n   - Sec 9 (1,000 l/s): Ø eq ≈ 450 mm → 550 mm × 300 mm (Vel = 6.06 m/s, Pv = 22.0 Pa)\n   - Sec 10 (500 l/s): Ø eq ≈ 340 mm → 350 mm × 300 mm (Vel = 4.76 m/s, Pv = 13.6 Pa)\n   - Return trunk (Sec 11, 14, 15): 85% of supply (15% OA) = 2,550 l/s total return.',
          '3. Straight duct friction loss: ΔP_duct = 73 m × 0.8 Pa/m = 58.4 Pa.',
          '4. Dynamic fitting losses: Fan discharge (0.63 × 41.7 = 26.3 Pa) + elbows + branch tees = 171.2 Pa.',
          '5. Terminal losses: Supply diffuser (20 Pa) + Return grille (20 Pa) = 40.0 Pa.',
          '6. Total pressure drop: 58.4 + 171.2 + 40.0 = 269.6 Pa.',
          '7. Apply 20% safety factor: 269.6 Pa × 1.20 = 323.5 Pa ≈ 325 Pa.',
        ],
        finalAnswer:
          'Index Run: 15-14-11-AHU-1-2-9-10 | Straight duct loss = 58.4 Pa | Dynamic fittings = 171.2 Pa | Terminals = 40.0 Pa | External Fan Static Pressure = 323.5 Pa ≈ 325 Pa',
      },
    ],
  },

  // =========================================================================
  // TUTORIAL 4 (AMVS 4)
  // =========================================================================
  {
    id: 'tutorial-4',
    title: 'Tutorial 4 (AMVS 4): Pipe Systems & Sizing',
    amvsTopic: 'AMVS 4: Pipe Systems & Sizing',
    pdfPath: '/assets/aistudio/Tutorial_4_Apr_26_79ce2872.pdf',
    weeksCovered: [6, 8],
    weeksCoveredLabel: 'Weeks 6 & 8',
    questions: [
      {
        questionNumber: 'Q1. Chilled water expansion tank functions',
        prompt: 'State the two main functions of a chilled water expansion tank.',
        steps: [
          '1. Accommodate thermal expansion/contraction: Water expands when warmed and contracts when cooled. The expansion tank provides cushion volume for fluid volume fluctuations.',
          '2. Maintain system static pressure: Keeps positive hydrostatic pressure at highest points and pump suction, preventing cavitation at pump impellers and air ingress into pipework.',
          '3. Secondary functions: Venting point to separate and purge dissolved gases and make-up water connection point.',
        ],
        finalAnswer:
          '1. Accommodates volumetric expansion and contraction of water due to temperature swings. 2. Maintains positive static pressure at pump suction to prevent cavitation and air ingress.',
      },
      {
        questionNumber: 'Q2. Chilled water flow changes upon decreasing cooling demand (Figure 2)',
        prompt: 'Describe how chilled water flow will change throughout the system when cooling demand at cooling coils decreases (Figure 2).',
        steps: [
          '1. AHU 2-way valves modulate: As room temperature drops below setpoint, 2-way modulating control valves at AHU cooling coils throttle toward closed position.',
          '2. Header differential pressure rises: Throttling coil valves reduces water flow through coils, increasing pressure differential (ΔP) across supply and return distribution headers.',
          '3. Bypass line modulating valve opens: Differential pressure controller detects ΔP exceeding setpoint and modulates bypass valve open.',
          '4. Chiller evaporator flow maintained constant: Excess chilled water bypasses coils directly into return line, ensuring constant flow rate through chiller evaporators to prevent tube freeze-up.',
          '5. Chiller capacity staging: Lower return water temperature signals chiller controls to unload compressors or stage off one chiller.',
        ],
        finalAnswer:
          'AHU 2-way valves throttle closed → header differential pressure rises → bypass valve opens, diverting excess supply water directly to return. This protects chillers with constant evaporator flow while chillers unload.',
      },
      {
        questionNumber: 'Q3. Chilled water circuit index run & pump head (Figure 3)',
        prompt: 'Size the index run pipe sections and calculate required chilled water pump head using equivalent length method (Figure 3, 10% safety factor, AHU 1 = 5 l/s, AHU 2 = 5 l/s, Chiller drop = 60 kPa, AHU 2 drop = 30 kPa).',
        steps: [
          '1. Index run identification: Path starts at Chiller 1 → Sec 1 (10 l/s, 20 m) → Sec 2 (5 l/s, 16 m) → Sec 4 (5 l/s, 15 m) → AHU 2 (30 kPa) → Sec 6 (5 l/s, 15 m) → Sec 8 (10 l/s, 5 m) → Sec 10 (10 l/s, 5 m) → Sec 11 (10 l/s, 10 m) → Pump 1 suction/discharge.',
          '2. Pipe sizing within 100–400 Pa/m range (Schedule 40 steel):\n   - 10 l/s sections (Sec 1, 8, 10, 11): 100 mm diameter (Velocity ≈ 1.3 m/s, Friction ≈ 150 Pa/m)\n   - 5 l/s sections (Sec 2, 4, 6): 80 mm (or 65 mm) diameter (Velocity ≈ 1.2–1.4 m/s, Friction ≈ 200–230 Pa/m)',
          '3. Equivalent length calculations (Le = Le/D × D) for pipe, elbows (Le/D=55), gate valves (Le/D=7.5), globe valves (Le/D=320), check valve (Le/D=95), strainer (Le/D=250), 2-way valve (Le/D=37):\n   - Total equivalent length of pipes & fittings across the circuit.',
          '4. Sum of friction and equipment pressure drops:\n   - Total pipe and fitting friction loss = ~43.7 kPa\n   - Equipment drops: AHU 2 coil (30.0 kPa) + Chiller evaporator (60.0 kPa) = 90.0 kPa\n   - Subtotal system loss = 43.7 + 90.0 = 133.7 kPa',
          '5. Apply 10% safety factor: 133.7 kPa × 1.10 = 147.1 kPa.',
          '6. Convert to pump head (hf = ΔP / (ρ × g)): 147,100 / (1,000 × 9.81) = 15.0 m (Closed loop: static head = 0 m).',
        ],
        finalAnswer:
          'Index Run: Chiller-1-2-4-AHU2-6-8-10-11 | Friction & equipment loss = 133.7 kPa | Total with 10% SF = 147.1 kPa | Chilled Water Pump Head = 15.0 m of water (at 10 l/s)',
      },
      {
        questionNumber: 'Q4. Condenser water circuit index run & pump head (Figure 4)',
        prompt: 'Size index run sections and determine condenser water pump head using equivalent length method (Figure 4, 10% safety factor, Chiller drop = 30 kPa, Tower drop = 5 kPa, Static head = 3 m, total flow = 20 l/s, 10 l/s per tower/chiller, Sec 1 loss given as 9,828 Pa).',
        steps: [
          '1. Index run identification: From Cooling Tower 2 basin → Sec 4 (10 l/s, 5 m) → Sec 5 (20 l/s, 15 m) → Sec 6 (20 l/s, 8 m) → Sec 7 (20 l/s, 4 m) → Pump 1 → Sec 1 (20 l/s, 20 m, 9,828 Pa given) → Chiller condenser (30 kPa) → Sec 10 (20 l/s, 15 m) → Sec 3 (10 l/s, 8 m) → Tower 2 spray nozzles.',
          '2. Pipe sizing within 100–400 Pa/m range:\n   - 20 l/s sections (Sec 1, 5, 6, 7, 10): 125 mm diameter (Velocity ≈ 1.55 m/s, Friction ≈ 180 Pa/m)\n   - 10 l/s sections (Sec 3, 4): 100 mm diameter (Velocity ≈ 1.3 m/s, Friction ≈ 150 Pa/m)',
          '3. Friction loss and equipment drops:\n   - Sum of pipe & fitting friction losses = 61.2 kPa (including Sec 1 given as 9,828 Pa)\n   - Equipment pressure drops: Chiller condenser (30.0 kPa) + Cooling tower spray nozzles (5.0 kPa) = 35.0 kPa\n   - Total dynamic loss = 61.2 + 35.0 = 96.2 kPa',
          '4. Apply 10% safety factor: 96.2 kPa × 1.10 = 105.8 kPa.',
          '5. Convert frictional loss to head: H_friction = 105,800 / (1,000 × 9.81) = 10.78 m ≈ 10.6 m.',
          '6. Add static head (open cooling tower basin to discharge nozzle elevation): H_static = 3.0 m.',
          '7. Total Condenser Pump Head: H_total = H_friction + H_static = 10.6 m + 3.0 m = 13.6 m of water head.',
        ],
        finalAnswer:
          'Index Run: Tower 2-4-5-6-7-Pump 1-1-Chiller-10-3-Tower 2 | Frictional Head = 10.6 m | Static Head = 3.0 m | Total Condenser Pump Head = 13.6 m of water (at 20 l/s)',
      },
    ],
  },
];

/**
 * Returns the official tutorial guide assigned to the given week number,
 * or undefined if the week does not have an official tutorial.
 *
 * Mappings for Rev 6:
 * - Week 1: Tutorial 1 (AMVS 1)
 * - Week 5: Tutorial 2 (AMVS 2)
 * - Week 3, 4: Tutorial 3 (AMVS 3)
 * - Week 6, 8: Tutorial 4 (AMVS 4)
 * - All other weeks: undefined
 */
export function getTutorialForWeek(weekNumber: number): TutorialGuide | undefined {
  if (weekNumber === 1) {
    return TUTORIAL_GUIDES.find((t) => t.id === 'tutorial-1');
  }
  if (weekNumber === 5) {
    return TUTORIAL_GUIDES.find((t) => t.id === 'tutorial-2');
  }
  if (weekNumber === 3 || weekNumber === 4) {
    return TUTORIAL_GUIDES.find((t) => t.id === 'tutorial-3');
  }
  if (weekNumber === 6 || weekNumber === 8) {
    return TUTORIAL_GUIDES.find((t) => t.id === 'tutorial-4');
  }
  return undefined;
}
