import React from 'react';
import { DiagnosticAlert, Vehicle } from '../types';
import { AlertTriangle, Info, Wrench, X, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface AlertDetailModalProps {
  alert: DiagnosticAlert | null;
  vehicle: Vehicle;
  onClose: () => void;
  onNavigateToShop?: () => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  vehicle,
  onClose,
  onNavigateToShop,
}) => {
  if (!alert) return null;

  const isCrit = alert.severity === 'critical';
  const isWarn = alert.severity === 'warning';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#1e2023] border border-[#414755] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-[#282a2d] border-b border-[#414755] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                isCrit
                  ? 'bg-[#93000a]/30 border-[#ffb4ab]/40 text-[#ffb4ab]'
                  : isWarn
                  ? 'bg-[#93000a]/20 border-[#ffb4ab]/30 text-[#ffb4ab]'
                  : 'bg-[#333538] border-[#414755] text-[#adc6ff]'
              }`}
            >
              {isCrit || isWarn ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-[#adc6ff]">
                  {alert.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                    isCrit
                      ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/40'
                      : isWarn
                      ? 'bg-[#00a0aa]/20 text-[#00dbe9] border border-[#00dbe9]/30'
                      : 'bg-[#333538] text-[#c1c6d7]'
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
              <p className="text-xs font-mono text-[#8b90a0]">
                Module: {alert.module}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8b90a0] hover:text-[#e2e2e6] hover:bg-[#333538] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5">
          <div>
            <h3 className="text-base font-bold text-[#e2e2e6] mb-1">
              {alert.title}
            </h3>
            <p className="text-xs text-[#c1c6d7] leading-relaxed">
              {alert.description}
            </p>
          </div>

          {/* Diagnostic Inspection Steps */}
          <div className="bg-[#14171a] rounded-xl p-4 border border-[#2E3238] flex flex-col gap-2.5">
            <div className="text-xs font-bold text-[#adc6ff] uppercase font-mono flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-[#4b8eff]" />
              <span>Recommended Diagnostic Procedure</span>
            </div>
            <p className="text-xs text-[#e2e2e6] leading-relaxed">
              {alert.recommendedFix ||
                'Perform an oscilloscope test on the CAN network and probe voltage differential against OEM specifications.'}
            </p>
          </div>

          {/* Affected Part Link */}
          {alert.affectedPart && (
            <div className="bg-[#282a2d] rounded-xl p-3.5 border border-[#414755] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#8b90a0] uppercase">
                  Associated Replacement Component
                </div>
                <div className="text-xs font-bold text-[#00dbe9]">
                  {alert.affectedPart}
                </div>
              </div>
              {onNavigateToShop && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToShop();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#4b8eff] text-[#00285c] text-xs font-mono font-bold uppercase flex items-center gap-1 hover:bg-[#adc6ff] transition-colors"
                >
                  <span>Shop OEM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Vehicle Metadata snippet */}
          <div className="flex justify-between items-center text-xs font-mono text-[#8b90a0] pt-2 border-t border-[#2E3238]">
            <span>Vehicle: {vehicle.name}</span>
            <span>Recorded: {alert.timeAgo}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#282a2d] border-t border-[#414755] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#333538] hover:bg-[#414755] text-xs font-bold font-mono text-[#e2e2e6] transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
