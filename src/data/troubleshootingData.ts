import { TroubleshootingCase } from '../types/acmv';

export const TROUBLESHOOTING_CASES: TroubleshootingCase[] = [
  {
    id: 'case-1',
    caseNumber: 'CASE 01',
    title: 'Severe Low Delta-T Syndrome & Premature Chiller Staging',
    facilityType: '35-Story Commercial Office Tower (Grade A)',
    symptom: 'The central plant has staged 3 chillers ON, but each chiller is operating at only 42% motor load. Total plant efficiency has degraded from 0.58 kW/RT to 0.89 kW/RT, and secondary pump VFDs are pegged at 100% speed.',
    bmsReadings: [
      { label: 'Chilled Water Supply Temp (CHWST)', value: '6.8°C', normal: '6.7°C - 7.0°C', status: 'normal' },
      { label: 'Chilled Water Return Temp (CHWRT)', value: '9.4°C', normal: '12.2°C - 12.5°C', status: 'critical' },
      { label: 'System Delta-T (ΔT)', value: '2.6°C', normal: '5.2°C - 5.5°C', status: 'critical' },
      { label: 'Decoupler Bypass Flow Direction', value: 'Forward (Supply to Return)', normal: 'Zero or minimal Reverse', status: 'critical' },
      { label: 'Secondary Pumps Frequency', value: '50.0 Hz (100%)', normal: '32.0 Hz - 40.0 Hz', status: 'warning' }
    ],
    probableCauses: [
      {
        id: 'c1-1',
        label: 'Cooling tower fan belts slipping, causing high entering water',
        isCorrect: false,
        feedback: 'Incorrect. Cooling tower issues affect the condenser water loop (causing high head pressure trips), not the chilled water return temperature.',
        resolutionSteps: 'Inspect cooling tower fans if condenser water exceeds 32°C.'
      },
      {
        id: 'c1-2',
        label: 'Uncontrolled 3-way bypass valves at AHU coils dumping cold supply directly into return, combined with hunting 2-way valves',
        isCorrect: true,
        feedback: 'Correct! The low return temperature (9.4°C vs 12.2°C design) confirms that chilled water is short-circuiting back to the plant room without absorbing heat in the AHUs. This doubles the flow demand, forcing the BMS to stage extra chillers and max out pumps.',
        resolutionSteps: '1. Audit all AHU and FCU valve configurations; convert legacy 3-way bypass connections to 2-way Pressure Independent Control Valves (PICVs). 2. Calibrate valve actuator stroke limits and replace hunting controllers. 3. Verify bypass decoupler line flow direction returns to neutral.'
      },
      {
        id: 'c1-3',
        label: 'Refrigerant leak in Chiller #2 evaporator',
        isCorrect: false,
        feedback: 'Incorrect. A refrigerant leak would manifest as low suction pressure and low evaporating temperature alarms on a specific chiller, not system-wide low ΔT across all headers.',
        resolutionSteps: 'Check refrigerant pressure transducers and oil levels.'
      }
    ]
  },
  {
    id: 'case-2',
    caseNumber: 'CASE 02',
    title: 'Chiller High Condenser Head Pressure Trip on Peak Afternoon',
    facilityType: 'Shopping Mall Central Plant (1,800 RT)',
    symptom: 'At 14:30 on a 34°C sunny afternoon, Lead Chiller #1 tripped out on "High Condenser Pressure Safety". Chiller #2 followed 10 minutes later, threatening a catastrophic mall-wide cooling outage.',
    bmsReadings: [
      { label: 'Entering Condenser Water (ECWT)', value: '33.8°C', normal: '29.5°C', status: 'critical' },
      { label: 'Leaving Condenser Water (LCWT)', value: '38.2°C', normal: '35.0°C', status: 'critical' },
      { label: 'Ambient Wet-Bulb Temp', value: '28.0°C', normal: '27.5°C - 28.0°C', status: 'normal' },
      { label: 'Cooling Tower Approach', value: '5.8°C', normal: '2.0°C - 2.5°C', status: 'critical' },
      { label: 'Condenser Tube Approach', value: '3.9°C', normal: '0.8°C - 1.5°C', status: 'critical' }
    ],
    probableCauses: [
      {
        id: 'c2-1',
        label: 'AHU supply fan VFD tripped off on overload',
        isCorrect: false,
        feedback: 'Incorrect. An AHU fan tripping would reduce cooling load on the evaporator, lowering chiller power rather than raising condenser head pressure.',
        resolutionSteps: 'Check AHU belt tensions and motor thermal overloads.'
      },
      {
        id: 'c2-2',
        label: 'Severe scaling/fouling on chiller condenser tubes and clogged cooling tower spray nozzles/fill',
        isCorrect: true,
        feedback: 'Correct! Both the Cooling Tower Approach (5.8°C vs 2.5°C normal) and Chiller Condenser Tube Approach (3.9°C vs 1.2°C normal) are dangerously elevated. Fouled heat transfer surfaces and clogged nozzles prevent heat rejection, causing refrigerant condensing pressure to surge until safety limits trip.',
        resolutionSteps: '1. Immediately increase cooling tower basin bleed-off to lower total dissolved solids (TDS). 2. Clear clogged cooling tower distribution nozzles and descale PVC fill. 3. Perform offline chemical or mechanical brush tube cleaning (or install automatic tube cleaning sponge ball system). 4. Re-commission water treatment chemistry.'
      },
      {
        id: 'c2-3',
        label: 'Primary chilled water pump running backward due to phase swap',
        isCorrect: false,
        feedback: 'Incorrect. A pump phase swap would cause low chilled water flow and potential evaporator freeze safety trips, not condenser high head pressure.',
        resolutionSteps: 'Verify motor rotation arrows with strobe or phase tester.'
      }
    ]
  },
  {
    id: 'case-3',
    caseNumber: 'CASE 03',
    title: 'Clammy High-Humidity Complaints in Executive Open Office',
    facilityType: 'Financial Institution Headquarters, Level 14',
    symptom: 'Occupants complain the office feels cold and clammy like a refrigerator. Paper contracts are curling, and mold has started appearing on diffusers, despite the thermostat reading 22.5°C.',
    bmsReadings: [
      { label: 'Zone Dry-Bulb Temp', value: '22.4°C', normal: '23.0°C - 24.0°C', status: 'normal' },
      { label: 'Zone Relative Humidity (%RH)', value: '78.5%', normal: '50.0% - 60.0%', status: 'critical' },
      { label: 'AHU Supply Air Temp', value: '17.2°C', normal: '13.0°C - 14.0°C', status: 'warning' },
      { label: 'Cooling Coil Chilled Water Valve', value: '35% Open', normal: '60% - 85% Open', status: 'warning' },
      { label: 'Outdoor Fresh Air Damper', value: '100% Full Open (Stuck)', normal: '15% - 20% Modulating', status: 'critical' }
    ],
    probableCauses: [
      {
        id: 'c3-1',
        label: 'Chiller refrigerant expansion valve overfeeding',
        isCorrect: false,
        feedback: 'Incorrect. Refrigerant issues in the plant room would cause low chiller efficiency or low suction superheat, not localized high fresh air infiltration in a single zone.',
        resolutionSteps: 'Inspect central chiller EEV control algorithm.'
      },
      {
        id: 'c3-2',
        label: 'Stuck open fresh air intake damper flooding tropical humid air, while throttled coil valve fails to reach apparatus dew point',
        isCorrect: true,
        feedback: 'Correct! The fresh air damper actuator seized at 100% open, flooding unconditioned humid tropical air (32°C / 80% RH) into the AHU. Because room dry-bulb met setpoint (22.5°C), the temperature controller throttled the chilled water valve to 35%, raising coil surface temperature above the dew point so zero moisture was condensed out!',
        resolutionSteps: '1. Free and replace the jammed outdoor air damper actuator; re-calibrate damper stroke to design fresh air rate (15%). 2. Implement combined temperature and humidity override control (reheat or sensible reset). 3. Ensure cooling coil apparatus dew point stays below 10°C during humid weather.'
      },
      {
        id: 'c3-3',
        label: 'Diffusers installed too close to fluorescent lights',
        isCorrect: false,
        feedback: 'Incorrect. Lighting heat is 100% sensible heat and would slightly lower relative humidity, not elevate it to 78.5% with curling paper.',
        resolutionSteps: 'Check lighting layout and thermal zoning.'
      }
    ]
  },
  {
    id: 'case-4',
    caseNumber: 'CASE 04',
    title: 'Staircase Fire Doors Jammed / Impossible to Open During Fire Drill',
    facilityType: 'Convention Center Hotel & Tower',
    symptom: 'During an annual SCDF Fire Safety inspection, the building fire alarm activated the Staircase Pressurization System (SPS). When inspectors attempted to open the ground-floor exit door, the door required over 180 Newtons of force to budge, failing safety certification.',
    bmsReadings: [
      { label: 'Ground Floor Stair Pressure', value: '92.0 Pa', normal: '50.0 Pa (Max 60 Pa)', status: 'critical' },
      { label: '12th Floor Stair Pressure', value: '54.0 Pa', normal: '50.0 Pa', status: 'normal' },
      { label: 'Door Handle Opening Force', value: '185 N', normal: '≤ 110 N (25 lbs)', status: 'critical' },
      { label: 'Barometric Relief Damper', value: 'Jammed Shut / Seized', normal: 'Freely Modulating at 55 Pa', status: 'critical' }
    ],
    probableCauses: [
      {
        id: 'c4-1',
        label: 'Fire sprinkler booster pump water pressure too high',
        isCorrect: false,
        feedback: 'Incorrect. Fire sprinkler water pressure has no connection with aerodynamic stairwell air pressurization.',
        resolutionSteps: 'Check fire pump pressure reducing valves.'
      },
      {
        id: 'c4-2',
        label: 'Seized barometric pressure relief damper and lack of VFD pressure feedback loop causing dangerous over-pressurization',
        isCorrect: true,
        feedback: 'Correct! Without functioning relief dampers or VFD speed trimming, the pressurization fan continuously forced maximum CFM into a sealed vertical shaft. The 92 Pa differential pressure generated an excessive opening force of 185 N across the 1.9 m² fire door, trapping evacuees inside.',
        resolutionSteps: '1. Clean, lubricate, and adjust counterweights on the barometric relief damper to vent at exactly 55 Pa. 2. Install differential pressure sensors linked to fan VFDs for automatic modulation. 3. Re-test door opening forces with a calibrated push-pull gauge across all floors.'
      },
      {
        id: 'c4-3',
        label: 'Smoke spill exhaust fan running at double speed',
        isCorrect: false,
        feedback: 'Incorrect. Smoke spill fans extract air and would create negative pressure, reducing door opening force rather than increasing it.',
        resolutionSteps: 'Check smoke spill fan interlocks.'
      }
    ]
  }
];
