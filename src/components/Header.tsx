import React, { useState } from 'react';
import { TabType, Vehicle, DeviceMode } from '../types';
import { BRAND_AVATARS } from '../data/mockData';
import { Bell, ChevronDown, Monitor, Smartphone, Tablet, Check, ShieldCheck, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  vehicles: Vehicle[];
  selectedVehicle: Vehicle;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenNotifications: () => void;
  unreadAlertsCount: number;
  deviceMode: DeviceMode;
  onChangeDeviceMode: (mode: DeviceMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  onOpenNotifications,
  unreadAlertsCount,
  deviceMode,
  onChangeDeviceMode,
}) => {
  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 w-full z-40 bg-[#1a1c1f]/95 backdrop-blur-md border-b border-[#414755] h-14 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Brand & Vehicle Selector */}
      <div className="flex items-center gap-3">
        {/* Brand Logo Avatar */}
        <div className="relative group cursor-pointer" onClick={() => onSelectTab('home')}>
          <div className="w-8 h-8 rounded-full bg-[#333538] overflow-hidden border border-[#8b90a0] flex-shrink-0 flex items-center justify-center">
            <img
              src={BRAND_AVATARS.headerLogo}
              alt="Autocore Brand Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if network blocked
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00dbe9] rounded-full border-2 border-[#111316]"></span>
        </div>

        {/* Brand Name */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-lg font-bold tracking-tight text-[#adc6ff] hover:text-[#d8e2ff] transition-colors flex items-center gap-1.5 focus:outline-none"
        >
          <span>AUTOCORE</span>
        </button>

        {/* Vehicle Quick Switcher Pill */}
        <div className="relative ml-1 sm:ml-3">
          <button
            id="vehicle-select-dropdown-btn"
            onClick={() => setVehicleDropdownOpen(!vehicleDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#282a2d] hover:bg-[#333538] border border-[#414755] text-xs font-mono text-[#e2e2e6] transition-colors focus:outline-none"
          >
            <span className="hidden sm:inline text-[#8b90a0]">GARAGE:</span>
            <span className="font-semibold text-[#adc6ff] max-w-[110px] sm:max-w-[160px] truncate">
              {selectedVehicle.name}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#8b90a0] transition-transform ${vehicleDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Vehicle Dropdown Menu */}
          {vehicleDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 glass-panel rounded-xl shadow-2xl border border-[#414755] py-2 z-50 animate-in fade-in zoom-in duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#8b90a0] uppercase border-b border-[#2E3238] flex items-center justify-between">
                <span>Select Garage Vehicle</span>
                <span className="text-[#00dbe9]">{vehicles.length} Active</span>
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {vehicles.map((v) => {
                  const isSelected = v.id === selectedVehicle.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        onSelectVehicle(v);
                        setVehicleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-[#282a2d] transition-colors ${
                        isSelected ? 'bg-[#4b8eff]/15 text-[#adc6ff]' : 'text-[#e2e2e6]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{v.name}</div>
                        <div className="text-[10px] font-mono text-[#8b90a0]">VIN: {v.vin.slice(-6)} • {v.hp} HP</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#4b8eff]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop / iPad Inline Navigation */}
      <nav className="hidden md:flex items-center gap-1 lg:gap-2">
        <button
          id="nav-desktop-home"
          onClick={() => onSelectTab('home')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ${
            currentTab === 'home'
              ? 'bg-[#4b8eff]/20 text-[#adc6ff] border border-[#4b8eff]/40'
              : 'text-[#c1c6d7] hover:text-[#e2e2e6] hover:bg-[#282a2d]'
          }`}
        >
          Home
        </button>
        <button
          id="nav-desktop-passport"
          onClick={() => onSelectTab('passport')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ${
            currentTab === 'passport'
              ? 'bg-[#4b8eff]/20 text-[#adc6ff] border border-[#4b8eff]/40'
              : 'text-[#c1c6d7] hover:text-[#e2e2e6] hover:bg-[#282a2d]'
          }`}
        >
          Passport
        </button>
        <button
          id="nav-desktop-shop"
          onClick={() => onSelectTab('shop')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ${
            currentTab === 'shop'
              ? 'bg-[#4b8eff]/20 text-[#adc6ff] border border-[#4b8eff]/40'
              : 'text-[#c1c6d7] hover:text-[#e2e2e6] hover:bg-[#282a2d]'
          }`}
        >
          Shop
        </button>
        <button
          id="nav-desktop-diagnostics"
          onClick={() => onSelectTab('diagnostics')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ${
            currentTab === 'diagnostics'
              ? 'bg-[#4b8eff]/20 text-[#adc6ff] border border-[#4b8eff]/40'
              : 'text-[#c1c6d7] hover:text-[#e2e2e6] hover:bg-[#282a2d]'
          }`}
        >
          Diagnostics
        </button>
      </nav>

      {/* Right Controls: Device Mode Switcher + Notification Bell */}
      <div className="flex items-center gap-2">
        {/* Responsive Frame Switcher */}
        <div className="hidden sm:flex items-center bg-[#111316] p-0.5 rounded-lg border border-[#414755]">
          <button
            onClick={() => onChangeDeviceMode('responsive')}
            title="Fluid Responsive View"
            className={`p-1.5 rounded text-xs transition-colors ${
              deviceMode === 'responsive'
                ? 'bg-[#4b8eff] text-[#00285c]'
                : 'text-[#8b90a0] hover:text-[#e2e2e6]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeDeviceMode('tablet')}
            title="iPad / Tablet Frame (768px)"
            className={`p-1.5 rounded text-xs transition-colors ${
              deviceMode === 'tablet'
                ? 'bg-[#4b8eff] text-[#00285c]'
                : 'text-[#8b90a0] hover:text-[#e2e2e6]'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeDeviceMode('mobile')}
            title="Mobile Screen Frame (414px)"
            className={`p-1.5 rounded text-xs transition-colors ${
              deviceMode === 'mobile'
                ? 'bg-[#4b8eff] text-[#00285c]'
                : 'text-[#8b90a0] hover:text-[#e2e2e6]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notifications Button */}
        <button
          id="open-notifications-btn"
          onClick={onOpenNotifications}
          className="relative w-9 h-9 flex items-center justify-center text-[#c1c6d7] hover:text-[#adc6ff] hover:bg-[#282a2d] rounded-full transition-colors active:scale-95"
          title="Vehicle Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ffb4ab] rounded-full ring-2 ring-[#111316] animate-pulse"></span>
          )}
        </button>
      </div>
    </header>
  );
};
