import React, { useState } from 'react';
import { Activity, Gauge, CheckCircle2, AlertTriangle, FileText, RotateCcw } from 'lucide-react';

interface ChillerAuditToolProps {
  onOpenPdf: (pdfPath: string) => void;
}

export const ChillerAuditTool: React.FC<ChillerAuditToolProps> = ({ onOpenPdf }) => {
  // Lab inputs (defaults match Tutorial 2 Q8 / Practical 1)
  const [chwSupplyTemp, setChwSupplyTemp] = useState<number>(8.0);
  const [chwReturnTemp, setChwReturnTemp] = useState<number>(13.0);
  const [chwFlowLps, setChwFlowLps] = useState<number>(128.0);

  const [cwSupplyTemp, setCwSupplyTemp] = useState<number>(29.0);
  const [cwReturnTemp, setCwReturnTemp] = useState<number>(35.0);
  const [cwFlowLps, setCwFlowLps] = useState<number>(125.0);

  const [chillerPowerKw, setChillerPowerKw] = useState<number>(462.0);
  const [chwpMotorKw, setChwpMotorKw] = useState<number>(32.0);
  const [cwpMotorKw, setCwpMotorKw] = useState<number>(28.0);
  const [towerMotorKw, setTowerMotorKw] = useState<number>(18.0);

  // Pressure readings for pumps (bar)
  const [chwpDischargeBar, setChwpDischargeBar] = useState<number>(2.4);
  const [chwpSuctionBar, setChwpSuctionBar] = useState<number>(0.8);
  const [cwpDischargeBar, setCwpDischargeBar] = useState<number>(2.0);
  const [cwpSuctionBar, setCwpSuctionBar] = useState<number>(0.6);

  // Constants
  const Cw = 4.2; // kJ/kgK
  const motorEff = 0.85; // 85% motor efficiency

  // Chiller Calculations
  // Eqn 1: Q_chw = m_chw * Cw * (tchwr - tchws)
  const coolingCapKw = chwFlowLps * Cw * (chwReturnTemp - chwSupplyTemp);
  // Eqn 2: Q_rt = Q_chw / 3.517
  const coolingCapRt = coolingCapKw / 3.517;

  // Eqn 3: Q_cw (Water side)
  const heatRejectionCwKw = cwFlowLps * Cw * (cwReturnTemp - cwSupplyTemp);
  // Eqn 4: Q_cw (Energy balance)
  const heatRejectionBalanceKw = coolingCapKw + chillerPowerKw;

  // Eqn 5: Chiller Efficiency (kWe/RT)
  const chillerKwPerRt = coolingCapRt > 0 ? chillerPowerKw / coolingCapRt : 0;
  const chillerCop = chillerKwPerRt > 0 ? 3.517 / chillerKwPerRt : 0;

  // Pump Calculations
  // 1 bar = 100 kPa
  const chwpDeltaKpa = (chwpDischargeBar - chwpSuctionBar) * 100;
  const cwpDeltaKpa = (cwpDischargeBar - cwpSuctionBar) * 100;

  // Eqn 6: Pump Output Power = Flow (L/s) * Delta_P (kPa) / 1000
  const chwpOutputKw = (chwFlowLps * chwpDeltaKpa) / 1000;
  const cwpOutputKw = (cwFlowLps * cwpDeltaKpa) / 1000;

  // Eqn 7: Pump Input Power = Motor Input * Motor Efficiency
  const chwpInputKw = chwpMotorKw * motorEff;
  const cwpInputKw = cwpMotorKw * motorEff;

  // Eqn 8: Pump Efficiency = Output / Input * 100
  const chwpEfficiencyPct = chwpInputKw > 0 ? (chwpOutputKw / chwpInputKw) * 100 : 0;
  const cwpEfficiencyPct = cwpInputKw > 0 ? (cwpOutputKw / cwpInputKw) * 100 : 0;

  // Eqn 9 & 10: Ratio of Pump Motor Input to Water Flow (kW / m³/s)
  // Flow in m³/s = L/s / 1000
  const chwFlowM3s = chwFlowLps / 1000;
  const cwFlowM3s = cwFlowLps / 1000;
  const chwpPowerFlowRatio = chwFlowM3s > 0 ? chwpMotorKw / chwFlowM3s : 0;
  const cwpPowerFlowRatio = cwFlowM3s > 0 ? cwpMotorKw / cwFlowM3s : 0;

  // SS 553:2016 Limits: CHWP <= 349 kW/m³/s, CWP <= 301 kW/m³/s
  const isChwpRatioPass = chwpPowerFlowRatio <= 349;
  const isCwpRatioPass = cwpPowerFlowRatio <= 301;

  // Eqn 11: System Total Efficiency
  const totalPowerKw = chillerPowerKw + chwpMotorKw + cwpMotorKw + towerMotorKw;
  const systemKwPerRt = coolingCapRt > 0 ? totalPowerKw / coolingCapRt : 0;

  const handleReset = () => {
    setChwSupplyTemp(8.0);
    setChwReturnTemp(13.0);
    setChwFlowLps(128.0);
    setCwSupplyTemp(29.0);
    setCwReturnTemp(35.0);
    setCwFlowLps(125.0);
    setChillerPowerKw(462.0);
    setChwpMotorKw(32.0);
    setCwpMotorKw(28.0);
    setTowerMotorKw(18.0);
    setChwpDischargeBar(2.4);
    setChwpSuctionBar(0.8);
    setCwpDischargeBar(2.0);
    setCwpSuctionBar(0.6);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              ACMV Practical 1 (Integrated Facilities Management Lab)
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              Performance Audit: Water-Cooled Chiller & Pumps
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verifies chiller kW/RT, heat rejection balance, pump efficiencies, and SS 553:2016 pump power limitation ratios.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPdf(`${import.meta.env.BASE_URL}assets/aistudio/Lesson_5_ACMV_P1_Chiller_Apr_26_6d04ba2c.pdf`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              Practical 1 Guide PDF
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Lab Values
            </button>
          </div>
        </div>

        {/* Lab Readings Input Sliders / Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
          {/* Chilled Water Loop */}
          <div className="p-3.5 rounded-lg bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-800/40 space-y-2 text-xs">
            <div className="font-semibold text-sky-900 dark:text-sky-200">1. Chilled Water Loop</div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Flow Rate (L/s)</span>
                <span className="font-mono font-semibold">{chwFlowLps} L/s</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="2"
                value={chwFlowLps}
                onChange={(e) => setChwFlowLps(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
              <span>Supply: {chwSupplyTemp}°C</span>
              <span>Return: {chwReturnTemp}°C</span>
              <span className="font-bold text-sky-600">ΔT: {(chwReturnTemp - chwSupplyTemp).toFixed(1)}°C</span>
            </div>
          </div>

          {/* Condenser Water Loop */}
          <div className="p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2 text-xs">
            <div className="font-semibold text-emerald-900 dark:text-emerald-200">2. Condenser Water Loop</div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Flow Rate (L/s)</span>
                <span className="font-mono font-semibold">{cwFlowLps} L/s</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="2"
                value={cwFlowLps}
                onChange={(e) => setCwFlowLps(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
              <span>Supply: {cwSupplyTemp}°C</span>
              <span>Return: {cwReturnTemp}°C</span>
              <span className="font-bold text-emerald-600">Range: {(cwReturnTemp - cwSupplyTemp).toFixed(1)}°C</span>
            </div>
          </div>

          {/* Electrical Power Inputs */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
            <div className="font-semibold text-slate-900 dark:text-white">3. Electrical Power Inputs</div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Chiller:</span>
                <input
                  type="number"
                  value={chillerPowerKw}
                  onChange={(e) => setChillerPowerKw(Number(e.target.value))}
                  className="w-16 bg-white dark:bg-slate-900 border rounded px-1 text-right"
                />
                <span>kW</span>
              </div>
              <div className="flex justify-between">
                <span>CHW Pump:</span>
                <input
                  type="number"
                  value={chwpMotorKw}
                  onChange={(e) => setChwpMotorKw(Number(e.target.value))}
                  className="w-16 bg-white dark:bg-slate-900 border rounded px-1 text-right"
                />
                <span>kW</span>
              </div>
              <div className="flex justify-between">
                <span>CW Pump:</span>
                <input
                  type="number"
                  value={cwpMotorKw}
                  onChange={(e) => setCwpMotorKw(Number(e.target.value))}
                  className="w-16 bg-white dark:bg-slate-900 border rounded px-1 text-right"
                />
                <span>kW</span>
              </div>
              <div className="flex justify-between">
                <span>Tower Fan:</span>
                <input
                  type="number"
                  value={towerMotorKw}
                  onChange={(e) => setTowerMotorKw(Number(e.target.value))}
                  className="w-16 bg-white dark:bg-slate-900 border rounded px-1 text-right"
                />
                <span>kW</span>
              </div>
            </div>
          </div>

          {/* Pressure Gauges (Bar) */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
            <div className="font-semibold text-slate-900 dark:text-white">4. Pump Pressure Gauges</div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>CHWP Disch / Suct:</span>
                <span>{chwpDischargeBar} / {chwpSuctionBar} bar</span>
              </div>
              <div className="flex justify-between">
                <span>CHWP Head:</span>
                <span className="font-bold text-sky-600">{chwpDeltaKpa} kPa</span>
              </div>
              <div className="flex justify-between">
                <span>CWP Disch / Suct:</span>
                <span>{cwpDischargeBar} / {cwpSuctionBar} bar</span>
              </div>
              <div className="flex justify-between">
                <span>CWP Head:</span>
                <span className="font-bold text-emerald-600">{cwpDeltaKpa} kPa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Calculations Tables matching Table 5, Table 6, Table 7 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 5: Chiller Performance */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Gauge className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Table 5: Chiller Operating Performance</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
              <span className="font-sans text-slate-600 dark:text-slate-400">
                Cooling Capacity (kW) [Eqn 1]
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {coolingCapKw.toFixed(1)} kW
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
              <span className="font-sans text-slate-600 dark:text-slate-400">
                Cooling Capacity (RT) [Eqn 2]
              </span>
              <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">
                {coolingCapRt.toFixed(2)} RT
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
              <span className="font-sans text-slate-600 dark:text-slate-400">
                Heat Rejection Rate (Water Side) [Eqn 3]
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {heatRejectionCwKw.toFixed(1)} kW
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
              <span className="font-sans text-slate-600 dark:text-slate-400">
                Heat Rejection Rate (Energy Balance) [Eqn 4]
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {heatRejectionBalanceKw.toFixed(1)} kW
              </span>
            </div>
            <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex justify-between items-center">
              <span className="font-sans font-bold text-sky-900 dark:text-sky-200">
                Chiller Efficiency (kWe/RT) [Eqn 5]
              </span>
              <span className="font-bold text-base text-sky-600 dark:text-sky-400">
                {chillerKwPerRt.toFixed(3)} kW/RT (COP {chillerCop.toFixed(2)})
              </span>
            </div>
          </div>
        </div>

        {/* Table 6: Pump Efficiencies & SS 553 Limitations */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Table 6: Pump Powers & SS 553 Limitations</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* CHWP */}
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono">
              <div className="flex justify-between font-sans font-bold text-slate-900 dark:text-white">
                <span>Chilled Water Pump (CHWP)</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  η = {chwpEfficiencyPct.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Output: {chwpOutputKw.toFixed(1)} kW [Eqn 6]</span>
                <span>Input: {chwpInputKw.toFixed(1)} kW [Eqn 7]</span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
                <span className="font-sans text-slate-600 dark:text-slate-400">
                  Power/Flow Ratio [Eqn 10]:
                </span>
                <span
                  className={`font-bold ${
                    isChwpRatioPass ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {chwpPowerFlowRatio.toFixed(1)} kW/m³/s{' '}
                  <span className="text-[10px] font-sans font-normal">
                    (SS 553 Max: 349) {isChwpRatioPass ? '✓ Pass' : '✗ Exceeded'}
                  </span>
                </span>
              </div>
            </div>

            {/* CWP */}
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono">
              <div className="flex justify-between font-sans font-bold text-slate-900 dark:text-white">
                <span>Condenser Water Pump (CWP)</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  η = {cwpEfficiencyPct.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Output: {cwpOutputKw.toFixed(1)} kW [Eqn 6]</span>
                <span>Input: {cwpInputKw.toFixed(1)} kW [Eqn 7]</span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
                <span className="font-sans text-slate-600 dark:text-slate-400">
                  Power/Flow Ratio [Eqn 9]:
                </span>
                <span
                  className={`font-bold ${
                    isCwpRatioPass ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {cwpPowerFlowRatio.toFixed(1)} kW/m³/s{' '}
                  <span className="text-[10px] font-sans font-normal">
                    (SS 553 Max: 301) {isCwpRatioPass ? '✓ Pass' : '✗ Exceeded'}
                  </span>
                </span>
              </div>
            </div>

            {/* Table 7: System Overall Efficiency */}
            <div className="p-3 rounded-lg bg-slate-900 text-white flex justify-between items-center font-mono">
              <span className="font-sans font-bold text-xs text-slate-300">
                Table 7: Total Plant Operating Efficiency [Eqn 11]
              </span>
              <span className="text-base font-extrabold text-sky-400">
                {systemKwPerRt.toFixed(3)} kW/RT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
