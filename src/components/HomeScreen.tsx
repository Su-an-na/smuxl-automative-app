import React, { useState } from 'react';
import { Vehicle, DiagnosticAlert, TabType } from '../types';
import { 
  Gauge, 
  Fuel, 
  ShieldCheck, 
  ChevronRight, 
  AlertTriangle, 
  Info, 
  BatteryCharging, 
  Scan, 
  KeyRound, 
  Volume2, 
  Fan, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface HomeScreenProps {
  vehicle: Vehicle;
  alerts: DiagnosticAlert[];
  onRunScan: () => void;
  onNavigateTab: (tab: TabType) => void;
  onSelectAlert: (alert: DiagnosticAlert) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  vehicle,
  alerts,
  onRunScan,
  onNavigateTab,
  onSelectAlert,
}) => {
  const [remoteActionStatus, setRemoteActionStatus] = useState<string | null>(null);

  const handleRemoteCommand = (action: string) => {
    setRemoteActionStatus(`Transmitting ${action} command over CAN-bus...`);
    setTimeout(() => {
      setRemoteActionStatus(`${action} verified by onboard telemetry.`);
      setTimeout(() => setRemoteActionStatus(null), 3000);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Garage Summary / Vehicle View Header & 3D Render Card */}
      <section className="flex flex-col gap-3 relative">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xs font-bold tracking-widest text-[#c1c6d7] uppercase mb-1">
              PRIMARY VEHICLE
            </h2>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e2e2e6]">
              {vehicle.name}
            </h1>
          </div>
          <div className="px-2.5 py-1 bg-[#1e2023] border border-[#414755] rounded text-xs font-mono text-[#adc6ff] shadow-inner">
            VIN: *{vehicle.vin.slice(-4)}
          </div>
        </div>

        {/* 3D Car Visual Card with hotlinked assets */}
        <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden glass-panel flex items-center justify-center bg-[#1a1c1f] group shadow-2xl border border-[#2E3238]">
          <img
            src={vehicle.heroImage}
            alt={vehicle.name}
            className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-lighten transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              // Fallback
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80';
            }}
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-transparent to-[#111316]/40 pointer-events-none" />

          {/* Overlay Top-Left Data Point: SYS OK */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#111316]/80 backdrop-blur-md border border-[#414755] px-2.5 py-1 rounded-full shadow-lg">
            <span className={`w-2 h-2 rounded-full ${vehicle.sysStatus === 'SYS OK' ? 'bg-[#00dbe9] animate-pulse' : 'bg-[#ffb4ab]'}`}></span>
            <span className="text-[11px] font-bold tracking-wider text-[#e2e2e6] font-mono">
              {vehicle.sysStatus}
            </span>
          </div>

          {/* Overlay Bottom-Right Data Point: Battery Voltage */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-[#111316]/80 backdrop-blur-md border border-[#414755] px-2.5 py-1 rounded-full shadow-lg">
            <BatteryCharging className="w-4 h-4 text-[#adc6ff]" />
            <span className="text-xs font-mono font-medium text-[#e2e2e6]">
              {vehicle.batteryVoltage}
            </span>
          </div>

          {/* Interactive Passport Quick-Link Pill */}
          <button
            onClick={() => onNavigateTab('passport')}
            className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-[#282a2d]/85 hover:bg-[#4b8eff] hover:text-[#00285c] backdrop-blur-md border border-[#414755] px-3 py-1 rounded-full text-xs font-medium text-[#c1c6d7] transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Passport</span>
          </button>
        </div>

        {/* Remote Action Feedback Toast */}
        {remoteActionStatus && (
          <div className="p-2.5 bg-[#00a0aa]/20 border border-[#00dbe9]/40 rounded-lg text-xs font-mono text-[#7df4ff] flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#00dbe9]" />
            <span>{remoteActionStatus}</span>
          </div>
        )}

        {/* Fast Remote Controls Row */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleRemoteCommand('Lock/Unlock')}
            className="glass-panel p-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-[#c1c6d7] hover:text-[#adc6ff] hover:border-[#4b8eff]/40 transition-all active:scale-95"
          >
            <KeyRound className="w-4 h-4 text-[#4b8eff]" />
            <span>Lock Doors</span>
          </button>
          <button
            onClick={() => handleRemoteCommand('Acoustic Horn/Flash')}
            className="glass-panel p-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-[#c1c6d7] hover:text-[#adc6ff] hover:border-[#4b8eff]/40 transition-all active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-[#4b8eff]" />
            <span>Flash Horn</span>
          </button>
          <button
            onClick={() => handleRemoteCommand('Climate Pre-Conditioning (70°F)')}
            className="glass-panel p-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-[#c1c6d7] hover:text-[#adc6ff] hover:border-[#4b8eff]/40 transition-all active:scale-95"
          >
            <Fan className="w-4 h-4 text-[#4b8eff]" />
            <span>Pre-Cool</span>
          </button>
        </div>
      </section>

      {/* Quick Stats Bento Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Mileage (ODO) */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between h-28 hover:border-[#4b8eff]/40 transition-colors">
          <div className="flex items-center gap-2 text-[#c1c6d7]">
            <Gauge className="w-4 h-4 text-[#adc6ff]" />
            <span className="text-[11px] font-bold tracking-wider uppercase font-mono">ODO</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#e2e2e6] tracking-tight">
            {vehicle.odoNumber.toLocaleString()} <span className="text-sm font-normal text-[#8b90a0]">mi</span>
          </div>
        </div>

        {/* Fuel/Range */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between h-28 hover:border-[#4b8eff]/40 transition-colors">
          <div className="flex items-center gap-2 text-[#c1c6d7]">
            <Fuel className="w-4 h-4 text-[#adc6ff]" />
            <span className="text-[11px] font-bold tracking-wider uppercase font-mono">RANGE</span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[#e2e2e6] tracking-tight">
              {vehicle.rangeMiles} <span className="text-sm font-normal text-[#8b90a0]">mi</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-[#333538] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#4b8eff] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (vehicle.rangeMiles / vehicle.rangeMax) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* System Health Score (Spans 2 columns on mobile, single on desktop) */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between h-28 col-span-2 hover:border-[#4b8eff]/40 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-[#c1c6d7]">
              <ShieldCheck className="w-4 h-4 text-[#00dbe9]" />
              <span className="text-[11px] font-bold tracking-wider uppercase font-mono">SYSTEM HEALTH</span>
            </div>
            <span className="px-2 py-0.5 bg-[#4b8eff]/20 text-[#adc6ff] border border-[#4b8eff]/30 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
              {vehicle.healthStatus}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-[#adc6ff] font-mono tracking-tight">
              {vehicle.healthScore}
            </span>
            <span className="text-sm text-[#8b90a0] font-mono">/ 100</span>
          </div>
        </div>
      </section>

      {/* Active Diagnostics Section */}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold tracking-wider text-[#c1c6d7] uppercase font-mono">
            ACTIVE DIAGNOSTICS
          </h2>
          <button
            onClick={() => onNavigateTab('diagnostics')}
            className="text-[#adc6ff] hover:text-[#d8e2ff] text-xs font-bold tracking-wider uppercase flex items-center transition-colors"
          >
            VIEW ALL <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {/* Diagnostic Alert Cards */}
        <div className="flex flex-col gap-2.5">
          {alerts.map((alert) => {
            const isWarningOrCrit = alert.severity === 'critical' || alert.severity === 'warning';
            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert(alert)}
                className="glass-panel p-3.5 rounded-lg flex items-start gap-3.5 hover:border-[#4b8eff]/50 cursor-pointer transition-all active:scale-[0.99]"
              >
                {/* Alert Icon */}
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 border ${
                    alert.severity === 'critical'
                      ? 'bg-[#93000a]/25 border-[#ffb4ab]/40 text-[#ffb4ab]'
                      : alert.severity === 'warning'
                      ? 'bg-[#93000a]/15 border-[#ffb4ab]/30 text-[#ffb4ab]'
                      : 'bg-[#333538] border-[#414755] text-[#c1c6d7]'
                  }`}
                >
                  {isWarningOrCrit ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isWarningOrCrit ? 'text-[#ffb4ab]' : 'text-[#adc6ff]'
                      }`}
                    >
                      {alert.code}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider text-[#8b90a0] uppercase font-mono">
                      {alert.timeAgo}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#e2e2e6] mb-0.5 truncate">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-[#c1c6d7] leading-relaxed line-clamp-2">
                    {alert.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Run Full Scan Button */}
        <button
          id="home-run-scan-btn"
          onClick={onRunScan}
          className="mt-2 w-full h-11 bg-[#4b8eff] text-[#00285c] hover:bg-[#adc6ff] rounded-lg font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all glow-active active:scale-[0.98]"
        >
          <Scan className="w-4 h-4" />
          RUN FULL SCAN
        </button>
      </section>
    </div>
  );
};
