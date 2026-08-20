import React, { useState, useEffect } from 'react';
import { Vehicle, DiagnosticAlert, TelemetryData } from '../types';
import { 
  Play, 
  RotateCcw, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Gauge, 
  Radio, 
  Pause, 
  Sparkles, 
  Trash2,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface DiagnosticsScreenProps {
  vehicle: Vehicle;
  alerts: DiagnosticAlert[];
  onRunScan: () => void;
  onClearAlerts: () => void;
  onSelectAlert: (alert: DiagnosticAlert) => void;
}

export const DiagnosticsScreen: React.FC<DiagnosticsScreenProps> = ({
  vehicle,
  alerts,
  onRunScan,
  onClearAlerts,
  onSelectAlert,
}) => {
  const [isPolling, setIsPolling] = useState(true);
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    rpm: 850,
    rpmStatus: 'IDLE',
    coolantTemp: 195,
    coolantPercent: 60,
    intakePressure: 14.7,
    intakePercent: 42,
    massAirFlow: 4.2,
    mafStatus: 'NOMINAL',
    o2SensorVoltage: 0.1,
    o2Status: 'LEAN',
    throttlePos: 12,
    boostPressure: 0.2,
    oilPressure: 45,
    speedMph: 0,
  });

  // Real-time sensor fluctuation simulation
  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const rpmNoise = (Math.random() - 0.5) * 20;
        const o2Noise = (Math.random() - 0.5) * 0.02;
        const mafNoise = (Math.random() - 0.5) * 0.15;
        const newRpm = Math.max(820, Math.min(880, Math.round(prev.rpm + rpmNoise)));
        const newO2 = Math.max(0.08, Math.min(0.14, +(prev.o2SensorVoltage + o2Noise).toFixed(2)));
        const newMaf = Math.max(3.9, Math.min(4.5, +(prev.massAirFlow + mafNoise).toFixed(1)));

        return {
          ...prev,
          rpm: newRpm,
          o2SensorVoltage: newO2,
          massAirFlow: newMaf,
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isPolling]);

  // Calculate circular stroke for health score
  const healthScore = vehicle.healthScore;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Responsive Grid: Left (Score & Maintenance) + Right (Faults & Telemetry) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Health Score Card & Maintenance */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Overall Health Score Card */}
          <div className="bg-[#1C1F23] border border-[#2E3238] rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
            {/* Ambient Top Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4b8eff]/10 to-transparent pointer-events-none rounded-xl" />

            <h2 className="text-lg sm:text-xl font-bold text-[#e2e2e6] mb-1 relative z-10">
              System Health
            </h2>

            {/* Circular SVG Gauge */}
            <div className="relative w-48 h-48 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#2E3238"
                  strokeWidth="8"
                />
                {/* Active Indicator Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={healthScore > 90 ? '#4b8eff' : healthScore > 75 ? '#00dbe9' : '#ffb4ab'}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold font-mono text-[#adc6ff] tracking-tight">
                  {healthScore}
                </span>
                <span className="text-xs font-bold tracking-widest text-[#8b90a0] font-mono mt-0.5">
                  {vehicle.healthStatus}
                </span>
              </div>
            </div>

            {/* Run Full Scan Button */}
            <button
              id="diag-run-scan-btn"
              onClick={onRunScan}
              className="w-full bg-[#4b8eff] text-[#00285c] hover:bg-[#adc6ff] font-bold text-xs tracking-wider uppercase h-11 rounded-lg transition-all flex items-center justify-center gap-2 pulse-glow relative z-10 glow-active active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              RUN FULL SCAN
            </button>
          </div>

          {/* Maintenance Reminders Box */}
          <div className="bg-[#1C1F23] border border-[#2E3238] rounded-xl p-5 flex flex-col gap-3 shadow-md">
            <div className="flex items-center gap-2 border-b border-[#2E3238] pb-3">
              <Calendar className="w-4 h-4 text-[#8b90a0]" />
              <h3 className="text-sm sm:text-base font-bold text-[#e2e2e6]">Maintenance</h3>
            </div>

            {/* Reminder 1: Oil Change */}
            <div className="flex justify-between items-center py-2 border-b border-[#2E3238]">
              <div>
                <div className="text-sm font-semibold text-[#e2e2e6]">Oil Change</div>
                <div className="text-xs font-mono text-[#ffb4ab] font-bold mt-0.5">
                  Due in 500 mi
                </div>
              </div>
              <AlertTriangle className="w-5 h-5 text-[#ffb4ab]" />
            </div>

            {/* Reminder 2: Tire Rotation */}
            <div className="flex justify-between items-center py-2">
              <div>
                <div className="text-sm font-semibold text-[#e2e2e6]">Tire Rotation</div>
                <div className="text-xs font-mono text-[#c1c6d7] mt-0.5">
                  Due in 2,500 mi
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#4b8eff]" />
            </div>
          </div>
        </div>

        {/* Right Column: Active Faults (DTCs) + Live OBD-II Telemetry */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Active Fault Codes Bento Box */}
          <div className="bg-[#1C1F23] border border-[#2E3238] rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 border-b border-[#2E3238] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#ffb4ab]" />
                <h3 className="text-base sm:text-lg font-bold text-[#e2e2e6]">
                  Active Faults
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#93000a]/25 text-[#ffb4ab] text-[10px] font-bold font-mono px-2.5 py-1 rounded border border-[#ffb4ab]/30">
                  {alerts.length} ISSUES DETECTED
                </span>
                {alerts.length > 0 && (
                  <button
                    onClick={onClearAlerts}
                    className="p-1 text-[#8b90a0] hover:text-[#ffb4ab] transition-colors"
                    title="Clear DTC Codes"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {alerts.length === 0 ? (
              <div className="p-6 text-center rounded-lg bg-[#111316] border border-[#2E3238] flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-[#00dbe9]" />
                <div className="text-sm font-semibold text-[#e2e2e6]">
                  No Active Diagnostic Trouble Codes
                </div>
                <p className="text-xs text-[#8b90a0]">
                  All powertrain, emissions, and chassis control ECUs report clear status.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alerts.map((alert) => {
                  const isCrit = alert.severity === 'critical';
                  return (
                    <div
                      key={alert.id}
                      onClick={() => onSelectAlert(alert)}
                      className={`bg-[#1a1c1f] rounded-lg p-3.5 flex flex-col justify-between border transition-all cursor-pointer hover:border-[#4b8eff] ${
                        isCrit ? 'border-[#ffb4ab]/30' : 'border-[#00dbe9]/30'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <span
                            className={`font-mono text-sm font-bold ${
                              isCrit ? 'text-[#ffb4ab]' : 'text-[#00dbe9]'
                            }`}
                          >
                            {alert.code}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono ${
                              isCrit
                                ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/40'
                                : 'bg-[#00a0aa]/20 text-[#00dbe9] border border-[#00dbe9]/40'
                            }`}
                          >
                            {isCrit ? 'Critical' : 'Warning'}
                          </span>
                        </div>
                        <div className="font-semibold text-sm text-[#e2e2e6] mb-1">
                          {alert.title}
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-[#8b90a0] mt-3 pt-2 border-t border-[#2E3238]">
                        Module: {alert.module}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Real-time OBD-II Sensor Data Grid */}
          <div className="bg-[#1C1F23] border border-[#2E3238] rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 border-b border-[#2E3238] pb-3">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-[#adc6ff]" />
                <h3 className="text-base sm:text-lg font-bold text-[#e2e2e6]">
                  Live Telemetry
                </h3>
              </div>

              {/* Polling Toggle Control */}
              <button
                onClick={() => setIsPolling(!isPolling)}
                className={`flex items-center gap-1.5 text-xs font-bold font-mono px-2.5 py-1 rounded-full border transition-colors ${
                  isPolling
                    ? 'bg-[#4b8eff]/15 text-[#adc6ff] border-[#4b8eff]/40'
                    : 'bg-[#282a2d] text-[#8b90a0] border-[#414755]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPolling ? 'bg-[#4b8eff] animate-pulse' : 'bg-[#8b90a0]'
                  }`}
                />
                <span>{isPolling ? 'POLLING (100Hz)' : 'PAUSED'}</span>
              </button>
            </div>

            {/* 6 Sensor Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Sensor 1: RPM */}
              <div className="bg-[#111316] border border-[#2E3238] rounded-lg p-3.5 flex flex-col items-center justify-center text-center hover:border-[#4b8eff]/40 transition-colors">
                <div className="text-[11px] font-bold text-[#8b90a0] font-mono mb-1">
                  RPM
                </div>
                <div className="font-mono text-2xl font-bold text-[#adc6ff]">
                  {telemetry.rpm}
                </div>
                <div className="text-[10px] text-[#8b90a0] font-mono mt-1">
                  {telemetry.rpmStatus}
                </div>
              </div>

              {/* Sensor 2: COOLANT TEMP */}
              <div className="bg-[#111316] border border-[#2E3238] rounded-lg p-3.5 flex flex-col items-center justify-center text-center hover:border-[#4b8eff]/40 transition-colors">
                <div className="text-[11px] font-bold text-[#8b90a0] font-mono mb-1">
                  COOLANT TEMP
                </div>
                <div className="font-mono text-2xl font-bold text-[#e2e2e6]">
                  {telemetry.coolantTemp}°F
                </div>
                <div className="w-full bg-[#282a2d] h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-[#4b8eff] h-full w-[60%] rounded-full" />
                </div>
              </div>

              {/* Sensor 3: INTAKE PRESSURE */}
              <div className="bg-[#111316] border border-[#2E3238] rounded-lg p-3.5 flex flex-col items-center justify-center text-center hover:border-[#4b8eff]/40 transition-colors">
                <div className="text-[11px] font-bold text-[#8b90a0] font-mono mb-1">
                  INTAKE PRESS
                </div>
                <div className="font-mono text-2xl font-bold text-[#e2e2e6]">
                  {telemetry.intakePressure} <span className="text-sm font-normal">psi</span>
                </div>
                <div className="w-full bg-[#282a2d] h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-[#00dbe9] h-full w-[42%] rounded-full" />
                </div>
              </div>

              {/* Sensor 4: MASS AIR FLOW */}
              <div className="bg-[#111316] border border-[#2E3238] rounded-lg p-3.5 flex flex-col items-center justify-center text-center hover:border-[#4b8eff]/40 transition-colors">
                <div className="text-[11px] font-bold text-[#8b90a0] font-mono mb-1">
                  MASS AIR FLOW
                </div>
                <div className="font-mono text-2xl font-bold text-[#e2e2e6]">
                  {telemetry.massAirFlow} <span className="text-sm font-normal">g/s</span>
                </div>
                <div className="text-[10px] text-[#8b90a0] font-mono mt-1">
                  {telemetry.mafStatus}
                </div>
              </div>

              {/* Sensor 5: O2 SENSOR B1S1 (Alert Highlight) */}
              <div className="bg-[#111316] border border-[#ffb4ab]/50 rounded-lg p-3.5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[#93000a]/10 pointer-events-none" />
                <div className="text-[11px] font-bold text-[#ffb4ab] font-mono mb-1">
                  O2 SENSOR B1S1
                </div>
                <div className="font-mono text-2xl font-bold text-[#ffb4ab]">
                  {telemetry.o2SensorVoltage}V
                </div>
                <div className="text-[10px] text-[#ffb4ab] font-bold font-mono mt-1">
                  {telemetry.o2Status} (FAULT)
                </div>
              </div>

              {/* Sensor 6: THROTTLE POS */}
              <div className="bg-[#111316] border border-[#2E3238] rounded-lg p-3.5 flex flex-col items-center justify-center text-center hover:border-[#4b8eff]/40 transition-colors">
                <div className="text-[11px] font-bold text-[#8b90a0] font-mono mb-1">
                  THROTTLE POS
                </div>
                <div className="font-mono text-2xl font-bold text-[#e2e2e6]">
                  {telemetry.throttlePos}%
                </div>
                <div className="w-full bg-[#282a2d] h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-[#4b8eff] h-full w-[12%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
