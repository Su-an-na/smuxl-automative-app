import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  ShieldCheck, 
  FileText, 
  X, 
  RotateCw,
  Zap
} from 'lucide-react';
import { Vehicle } from '../types';

interface FullScanModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onScanComplete?: () => void;
}

export const FullScanModal: React.FC<FullScanModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onScanComplete,
}) => {
  const [scanStep, setScanStep] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const scanStages = [
    { title: 'Initializing CAN-Bus Transceiver', sub: 'Baud Rate: 500 kbps High-Speed ISO 15765-4' },
    { title: 'Polling Engine Control Module (ECM)', sub: 'Interrogating fuel trim, timing advance & ignition' },
    { title: 'Scanning Transmission Control (TCM)', sub: 'Checking clutch actuation pressures and gear solenoids' },
    { title: 'Inspecting Anti-Lock Braking (ABS/ESP)', sub: 'Verifying wheel speed optical telemetry and yaw rates' },
    { title: 'Analyzing Emissions & O2 Voltages', sub: 'Cross-verifying Bank 1/Bank 2 catalytic sensor delta' },
    { title: 'Finalizing Health Assessment', sub: 'Compiling ISO diagnostic trouble log' },
  ];

  const startScan = () => {
    setIsScanning(true);
    setIsDone(false);
    setScanStep(0);
    setScanProgress(0);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsScanning(false);
      setIsDone(false);
      setScanProgress(0);
      setScanStep(0);
      return;
    }
    startScan();
  }, [isOpen]);

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setIsDone(true);
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#4b8eff', '#00dbe9', '#adc6ff'],
            });
          } catch (e) {
            // Ignore if in restricted env
          }
          if (onScanComplete) onScanComplete();
          return 100;
        }

        const next = prev + 3;
        const currentStageIndex = Math.min(
          scanStages.length - 1,
          Math.floor((next / 100) * scanStages.length)
        );
        setScanStep(currentStageIndex);
        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [isScanning]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#1e2023] border border-[#414755] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-[#282a2d] border-b border-[#414755] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4b8eff]/20 flex items-center justify-center text-[#adc6ff]">
              <Scan className="w-4 h-4 text-[#4b8eff]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#e2e2e6] leading-tight">
                Full Vehicle OBD-II Diagnostic Scan
              </h3>
              <p className="text-[11px] font-mono text-[#8b90a0]">
                {vehicle.name} • VIN: {vehicle.vin}
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
        <div className="p-6 flex flex-col gap-6">
          {/* Progress / Status Display */}
          <div className="flex flex-col items-center justify-center text-center py-2">
            <div className="relative w-24 h-24 flex items-center justify-center mb-3">
              {isScanning ? (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-[#4b8eff]/30 border-t-[#00dbe9] animate-spin" />
                  <div className="absolute inset-2 rounded-full border border-[#414755] flex items-center justify-center bg-[#111316]">
                    <Zap className="w-8 h-8 text-[#00dbe9] animate-pulse" />
                  </div>
                </>
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#00a0aa]/20 border border-[#00dbe9] flex items-center justify-center text-[#00dbe9] shadow-lg glow-tertiary">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              )}
            </div>

            <h4 className="text-lg font-bold text-[#e2e2e6]">
              {isScanning ? 'Running Systems Interrogation...' : 'Diagnostic Scan Completed'}
            </h4>
            <p className="text-xs font-mono text-[#adc6ff] mt-1">
              {isScanning
                ? scanStages[scanStep]?.title
                : '12 Electronic Control Modules Verified'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b90a0]">
                {isScanning ? scanStages[scanStep]?.sub : 'All protocols verified.'}
              </span>
              <span className="font-bold text-[#4b8eff]">{scanProgress}%</span>
            </div>
            <div className="w-full h-2 bg-[#111316] rounded-full overflow-hidden border border-[#2E3238]">
              <div
                className="h-full bg-gradient-to-r from-[#4b8eff] to-[#00dbe9] transition-all duration-150"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>

          {/* Module Scan Checkpoints */}
          <div className="bg-[#14171a] rounded-xl p-3.5 border border-[#2E3238] flex flex-col gap-2 max-h-40 overflow-y-auto">
            {scanStages.map((stage, idx) => {
              const isPassed = scanStep > idx || isDone;
              const isCurrent = scanStep === idx && isScanning;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between text-xs py-1 border-b border-[#2E3238] last:border-0 ${
                    isCurrent ? 'text-[#00dbe9] font-semibold' : isPassed ? 'text-[#e2e2e6]' : 'text-[#8b90a0] opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00dbe9]" />
                    ) : isCurrent ? (
                      <RotateCw className="w-4 h-4 text-[#4b8eff] animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#414755]" />
                    )}
                    <span>{stage.title}</span>
                  </div>
                  <span className="font-mono text-[10px]">
                    {isPassed ? 'OK [PASS]' : isCurrent ? 'POLLING...' : 'QUEUED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#282a2d] border-t border-[#414755] flex justify-end gap-3">
          {isDone ? (
            <>
              <button
                onClick={startScan}
                className="px-4 py-2 rounded-lg border border-[#414755] text-xs font-bold font-mono text-[#c1c6d7] hover:bg-[#333538] transition-colors"
              >
                Re-Scan
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-[#4b8eff] text-[#00285c] text-xs font-bold font-mono uppercase hover:bg-[#adc6ff] transition-colors glow-active"
              >
                Done / View Telemetry
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#414755] text-xs font-bold font-mono text-[#8b90a0] hover:text-[#e2e2e6]"
            >
              Cancel Scan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
