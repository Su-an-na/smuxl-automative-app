import React from 'react';
import { Bell, X, ShieldCheck, AlertTriangle, Info, CheckCircle2, Wrench } from 'lucide-react';
import { Vehicle } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  vehicle,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'Emissions DTC Recorded on ECM',
      desc: 'Fault code P0420 (Catalyst efficiency below threshold) logged on Bank 1.',
      time: '2 hours ago',
      type: 'warning',
    },
    {
      id: 'notif-2',
      title: 'Scheduled Oil Change Approaching',
      desc: `${vehicle.name} has 500 miles remaining until recommended 15,000-mile drain interval.`,
      time: '1 day ago',
      type: 'info',
    },
    {
      id: 'notif-3',
      title: 'Digital Vehicle Passport Synced',
      desc: 'All 3D digital twin telemetry coordinates and cryptographic verification logs updated.',
      time: '3 days ago',
      type: 'success',
    },
    {
      id: 'notif-4',
      title: 'OBD-II Wireless Dongle Connected',
      desc: 'Bluetooth 5.4 CAN interface streaming telemetry at 100Hz with 12.4V battery baseline.',
      time: '5 days ago',
      type: 'info',
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-[#1e2023] border border-[#414755] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#282a2d] border-b border-[#414755] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#4b8eff]" />
            <h3 className="text-base font-bold text-[#e2e2e6]">
              Autocore Telemetry Feed
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8b90a0] hover:text-[#e2e2e6] hover:bg-[#333538] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 max-h-96 overflow-y-auto flex flex-col gap-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-[#14171a] p-3.5 rounded-xl border border-[#2E3238] flex gap-3 items-start"
            >
              <div className="mt-0.5 flex-shrink-0">
                {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#ffb4ab]" />}
                {n.type === 'info' && <Info className="w-4 h-4 text-[#4b8eff]" />}
                {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#00dbe9]" />}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-[#e2e2e6]">{n.title}</h4>
                  <span className="text-[10px] font-mono text-[#8b90a0]">{n.time}</span>
                </div>
                <p className="text-xs text-[#c1c6d7] mt-1 leading-relaxed">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#282a2d] border-t border-[#414755] flex justify-between items-center">
          <span className="text-[11px] font-mono text-[#8b90a0]">
            Vehicle: {vehicle.name}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#4b8eff] text-[#00285c] text-xs font-mono font-bold uppercase hover:bg-[#adc6ff] transition-colors"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
};
