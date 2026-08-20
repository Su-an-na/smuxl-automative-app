import React, { useState } from 'react';
import { Vehicle, ServiceRecord } from '../types';
import { Car3DCanvas } from './Car3DCanvas';
import { 
  ShieldCheck, 
  Gauge, 
  Trophy, 
  Route, 
  User, 
  History, 
  CheckCircle2, 
  Store, 
  Plus, 
  FileText, 
  Share2,
  Calendar,
  Wrench
} from 'lucide-react';

interface PassportScreenProps {
  vehicle: Vehicle;
  serviceRecords: ServiceRecord[];
  onAddServiceRecord?: (record: ServiceRecord) => void;
}

export const PassportScreen: React.FC<PassportScreenProps> = ({
  vehicle,
  serviceRecords,
  onAddServiceRecord,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newGarage, setNewGarage] = useState('');
  const [newMileage, setNewMileage] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newGarage) return;

    if (onAddServiceRecord) {
      onAddServiceRecord({
        id: `srv-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
        mileage: newMileage || `${vehicle.odoNumber.toLocaleString()} mi`,
        title: newTitle,
        description: newDesc || 'Routine vehicle maintenance and diagnostics verification log.',
        garageName: newGarage,
        type: 'routine',
        isLatest: true,
      });
    }

    setNewTitle('');
    setNewDesc('');
    setNewGarage('');
    setNewMileage('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header & Verification Badge */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e2e2e6]">
            {vehicle.name}
          </h1>
          <p className="text-sm sm:text-base text-[#c1c6d7] font-medium">
            {vehicle.trim}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#00a0aa]/15 px-3 py-1.5 rounded-full border border-[#00dbe9]/30 text-[#00dbe9] shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#00dbe9]" />
          <span className="text-[11px] font-bold tracking-wider font-mono">
            VERIFIED PASSPORT
          </span>
        </div>
      </section>

      {/* Main Responsive Grid: 3D Visualization (Dominant) + Specs + Right Side Data */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Digital Twin Canvas + Quick Specs */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Interactive 3D Canvas */}
          <Car3DCanvas vehicleName={vehicle.name} vin={vehicle.vin} />

          {/* Quick Specs 3-Column Bento Row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Horsepower */}
            <div className="bg-[#1e2023] rounded-lg p-3 border border-[#414755] flex flex-col items-center justify-center text-center hover:border-[#4b8eff]/40 transition-colors">
              <Gauge className="w-5 h-5 text-[#8b90a0] mb-1" />
              <span className="text-lg sm:text-xl font-bold font-mono text-[#e2e2e6]">
                {vehicle.hp}
              </span>
              <span className="text-[10px] font-bold tracking-wider text-[#c1c6d7] uppercase font-mono">
                HORSEPOWER
              </span>
            </div>

            {/* Drivetrain */}
            <div className="bg-[#1e2023] rounded-lg p-3 border border-[#414755] flex flex-col items-center justify-center text-center hover:border-[#4b8eff]/40 transition-colors">
              <Trophy className="w-5 h-5 text-[#8b90a0] mb-1" />
              <span className="text-lg sm:text-xl font-bold font-mono text-[#e2e2e6] truncate max-w-full">
                {vehicle.drivetrain.includes('AWD') ? 'AWD' : vehicle.drivetrain.includes('RWD') ? 'RWD' : 'AWD'}
              </span>
              <span className="text-[10px] font-bold tracking-wider text-[#c1c6d7] uppercase font-mono">
                DRIVETRAIN
              </span>
            </div>

            {/* Mileage */}
            <div className="bg-[#1e2023] rounded-lg p-3 border border-[#414755] flex flex-col items-center justify-center text-center hover:border-[#4b8eff]/40 transition-colors">
              <Route className="w-5 h-5 text-[#8b90a0] mb-1" />
              <span className="text-lg sm:text-xl font-bold font-mono text-[#e2e2e6]">
                {vehicle.mileage.replace(' mi', '')}
              </span>
              <span className="text-[10px] font-bold tracking-wider text-[#c1c6d7] uppercase font-mono">
                MILEAGE
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Ownership Record & Service Log Timeline */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Ownership Module */}
          <div className="bg-[#1e2023] rounded-xl border border-[#414755] overflow-hidden shadow-md">
            <div className="p-3.5 bg-[#282a2d] border-b border-[#414755] flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#e2e2e6] flex items-center gap-2">
                <User className="w-4 h-4 text-[#4b8eff]" />
                <span>Ownership Record</span>
              </h2>
              <span className="text-[10px] font-bold tracking-wider bg-[#333538] px-2.5 py-1 rounded text-[#c1c6d7] font-mono">
                {vehicle.ownersCount} {vehicle.ownersCount === 1 ? 'OWNER' : 'OWNERS'}
              </span>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {/* Current Owner */}
              <div className="flex justify-between items-center py-2 border-b border-[#2E3238]">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#e2e2e6]">Current Owner</span>
                  <span className="text-xs font-mono text-[#c1c6d7] mt-0.5">
                    Acquired: {vehicle.currentOwnerAcquired}
                  </span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#00dbe9]" />
              </div>

              {/* Previous Owner */}
              <div className="flex justify-between items-center py-2 opacity-75">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#e2e2e6]">Previous Owner</span>
                  <span className="text-xs font-mono text-[#8b90a0] mt-0.5">
                    {vehicle.previousOwnerPeriod}
                  </span>
                </div>
                <span className="text-xs font-mono text-[#8b90a0] bg-[#282a2d] px-2 py-0.5 rounded">
                  {vehicle.previousOwnerType}
                </span>
              </div>
            </div>
          </div>

          {/* Service Log Timeline Module */}
          <div className="bg-[#1e2023] rounded-xl border border-[#414755] overflow-hidden shadow-md flex flex-col">
            <div className="p-3.5 bg-[#282a2d] border-b border-[#414755] flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-sm sm:text-base font-bold text-[#e2e2e6] flex items-center gap-2">
                <History className="w-4 h-4 text-[#4b8eff]" />
                <span>Service Log</span>
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-[11px] font-bold tracking-wider text-[#adc6ff] hover:text-[#d8e2ff] transition-colors flex items-center gap-1 font-mono uppercase"
              >
                <Plus className="w-3.5 h-3.5" /> LOG ENTRY
              </button>
            </div>

            <div className="p-4 flex flex-col gap-0 max-h-[380px] overflow-y-auto">
              {serviceRecords.map((item, idx) => {
                const isFirst = idx === 0;
                return (
                  <div
                    key={item.id}
                    className="relative pl-6 pb-6 border-l-2 border-[#414755] last:border-0 last:pb-0"
                  >
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${
                        isFirst
                          ? 'bg-[#00dbe9] shadow-[0_0_10px_rgba(0,219,233,0.7)]'
                          : 'bg-[#8b90a0]'
                      }`}
                    />

                    <div className="flex justify-between items-start mb-1.5">
                      <span
                        className={`text-xs font-mono font-bold ${
                          isFirst ? 'text-[#00dbe9]' : 'text-[#c1c6d7]'
                        }`}
                      >
                        {item.date}
                      </span>
                      <span className="text-xs font-mono text-[#8b90a0]">{item.mileage}</span>
                    </div>

                    <div className="bg-[#1a1c1f] rounded-lg p-3 border border-[#2E3238] hover:border-[#4b8eff]/40 transition-colors group">
                      <div className="text-sm font-semibold text-[#e2e2e6] mb-1">
                        {item.title}
                      </div>
                      <p className="text-xs text-[#c1c6d7] leading-relaxed mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#8b90a0]">
                        <Store className="w-3.5 h-3.5 text-[#4b8eff]" />
                        <span>{item.garageName}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Service Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#1e2023] border border-[#414755] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2E3238] pb-3 mb-4">
              <h3 className="text-lg font-bold text-[#e2e2e6] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#00dbe9]" />
                <span>Log Service Entry</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8b90a0] hover:text-[#e2e2e6]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-[#c1c6d7] uppercase font-mono block mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Brake Fluid Flush & Pad Inspection"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#1a1c1f] border border-[#414755] rounded-lg px-3 py-2 text-sm text-[#e2e2e6] focus:border-[#4b8eff] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#c1c6d7] uppercase font-mono block mb-1">
                    Mileage
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 25,400 mi"
                    value={newMileage}
                    onChange={(e) => setNewMileage(e.target.value)}
                    className="w-full bg-[#1a1c1f] border border-[#414755] rounded-lg px-3 py-2 text-sm text-[#e2e2e6] focus:border-[#4b8eff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#c1c6d7] uppercase font-mono block mb-1">
                    Garage / Dealer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Apex Motorsport"
                    value={newGarage}
                    onChange={(e) => setNewGarage(e.target.value)}
                    className="w-full bg-[#1a1c1f] border border-[#414755] rounded-lg px-3 py-2 text-sm text-[#e2e2e6] focus:border-[#4b8eff] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#c1c6d7] uppercase font-mono block mb-1">
                  Notes & Replaced Components
                </label>
                <textarea
                  rows={3}
                  placeholder="Installed Motul RBF 660, inspected wear on carbon ceramic discs."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#1a1c1f] border border-[#414755] rounded-lg px-3 py-2 text-sm text-[#e2e2e6] focus:border-[#4b8eff] focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-lg border border-[#414755] text-xs font-bold uppercase text-[#c1c6d7] hover:bg-[#282a2d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-lg bg-[#4b8eff] text-[#00285c] text-xs font-bold uppercase hover:bg-[#adc6ff] glow-active transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
